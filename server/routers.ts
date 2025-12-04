import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { categories, products, orders, orderItems } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  menu: router({
    categories: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(categories).where(eq(categories.isActive, true));
    }),
    
    products: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        if (input?.categoryId) {
          return await db.select().from(products)
            .where(eq(products.categoryId, input.categoryId));
        }
        
        return await db.select().from(products);
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string(),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        
        // Hole alle Produkte und Kategorien für den Chatbot-Kontext
        const allCategories = db ? await db.select().from(categories) : [];
        const allProducts = db ? await db.select().from(products) : [];
        
        // Erstelle Speisekarten-Kontext für den Chatbot
        const menuContext = `
Du bist ein höflicher und professioneller Bestell-Agent für das Calwer Pizza Kebap Haus.

**Deine Aufgaben:**
1. Begrüße Kunden freundlich und professionell
2. Zeige die Speisekarte auf Anfrage
3. Nimm Bestellungen entgegen
4. Frage nach Lieferadresse, Telefonnummer und Zahlungsmethode
5. Bestätige die Bestellung mit allen Details
6. Sei immer höflich, hilfsbereit und geduldig

**Unsere Speisekarte:**

${allCategories.map(cat => {
  const categoryProducts = allProducts.filter(p => p.categoryId === cat.id);
  return `**${cat.name}**\n${categoryProducts.map(p => 
    `- ${p.name}: ${(p.basePrice / 100).toFixed(2)}€${p.description ? ` - ${p.description}` : ''}`
  ).join('\n')}`;
}).join('\n\n')}

**Restaurant-Informationen:**
- Name: Calwer Pizza Kebap Haus
- Adresse: Inselgasse 3, 75365 Calw
- Telefon: +49 7051 927587
- Liefergebiet: Calw und Umgebung

**Wichtig:**
- Sei immer freundlich und professionell
- Nutze Emojis sparsam und passend (🍕 🥙 🥤)
- Frage nach allen notwendigen Informationen für die Bestellung
- Bestätige die Bestellung klar und deutlich
- Bei Unklarheiten: Frage höflich nach
`;

        const messages = [
          { role: "system" as const, content: menuContext },
          ...(input.conversationHistory || []).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({ messages });
        
        const assistantMessage = response.choices[0]?.message?.content || "Entschuldigung, ich konnte Ihre Nachricht nicht verarbeiten.";

        return {
          message: assistantMessage,
        };
      }),
    
    placeOrder: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          quantity: z.number(),
          price: z.number(),
        })),
        deliveryAddress: z.string(),
        phone: z.string(),
        paymentMethod: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Berechne Gesamtpreis
        const totalPrice = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Erstelle Bestellzusammenfassung
        const orderSummary = `
🎉 **Neue Bestellung von ${ctx.user.name || 'Kunde'}**

**Bestellte Artikel:**
${input.items.map(item => `- ${item.quantity}x ${item.productName} (${(item.price / 100).toFixed(2)}€)`).join('\n')}

**Gesamtpreis:** ${(totalPrice / 100).toFixed(2)}€

**Lieferadresse:** ${input.deliveryAddress}
**Telefon:** ${input.phone}
**Zahlungsmethode:** ${input.paymentMethod}
${input.notes ? `**Anmerkungen:** ${input.notes}` : ''}

**Kunde:** ${ctx.user.name} (${ctx.user.email})
`;

        // Sende WhatsApp-Benachrichtigung
        await notifyOwner({
          title: "Neue Bestellung eingegangen!",
          content: orderSummary,
        });

        return {
          success: true,
          orderId: Date.now(), // Temporäre Order-ID
          message: "Ihre Bestellung wurde erfolgreich aufgegeben! Sie erhalten in Kürze eine Bestätigung.",
        };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().optional(),
        customerPhone: z.string(),
        deliveryStreet: z.string(),
        deliveryHouseNumber: z.string(),
        deliveryFloor: z.string().optional(),
        deliveryPostalCode: z.string(),
        deliveryCity: z.string(),
        deliveryNotes: z.string().optional(),
        paymentMethod: z.enum(["cash", "paypal"]),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          priceAtOrder: z.number(),
          variant: z.string().nullable().optional(),
        })),
        totalAmount: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const [order] = await db.insert(orders).values({
          orderNumber,
          status: "pending",
          customerName: input.customerName,
          customerEmail: input.customerEmail || null,
          customerPhone: input.customerPhone,
          deliveryStreet: input.deliveryStreet,
          deliveryHouseNumber: input.deliveryHouseNumber,
          deliveryFloor: input.deliveryFloor || null,
          deliveryPostalCode: input.deliveryPostalCode,
          deliveryCity: input.deliveryCity,
          deliveryNotes: input.deliveryNotes || null,
          subtotal: input.totalAmount,
          deliveryFee: 0,
          discount: 0,
          total: input.totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
        });

        const orderId = order.insertId;

        // Create order items
        for (const item of input.items) {
          const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
          
          await db.insert(orderItems).values({
            orderId: Number(orderId),
            productId: item.productId,
            productName: product?.name || "Unknown Product",
            variant: item.variant || null,
            quantity: item.quantity,
            unitPrice: item.priceAtOrder,
            totalPrice: item.priceAtOrder * item.quantity,
          });
        }

        // Send WhatsApp notification
        const itemsList = input.items.map((item, idx) => 
          `${idx + 1}. ${item.quantity}x Produkt #${item.productId}${item.variant ? ` (${item.variant})` : ""}`
        ).join("\n");

        const notificationMessage = `🍕 NEUE BESTELLUNG #${orderNumber}\n\n` +
          `👤 Kunde: ${input.customerName}\n` +
          `📞 Telefon: ${input.customerPhone}\n` +
          `📍 Adresse: ${input.deliveryStreet} ${input.deliveryHouseNumber}, ${input.deliveryPostalCode} ${input.deliveryCity}\n` +
          (input.deliveryFloor ? `🏢 Etage: ${input.deliveryFloor}\n` : "") +
          (input.deliveryNotes ? `📝 Hinweise: ${input.deliveryNotes}\n` : "") +
          `\n📦 Bestellung:\n${itemsList}\n\n` +
          `💰 Gesamt: ${(input.totalAmount / 100).toFixed(2)} €\n` +
          `💳 Zahlung: ${input.paymentMethod === "cash" ? "Bar bei Lieferung" : "PayPal"}`;

        await notifyOwner({
          title: "🍕 Neue Bestellung eingegangen!",
          content: notificationMessage,
        });

        return {
          success: true,
          orderNumber,
          orderId: Number(orderId),
        };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      
      // Only admins can see all orders
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await db.select().from(orders);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "preparing", "delivering", "delivered", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Only admins can update order status
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await db.update(orders)
          .set({ status: input.status })
          .where(eq(orders.id, input.orderId));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
