import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { categories, products } from "../drizzle/schema";
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
});

export type AppRouter = typeof appRouter;
