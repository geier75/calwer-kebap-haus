import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { drizzle } from "drizzle-orm/mysql2";
import { categories, products } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

const db = drizzle(process.env.DATABASE_URL!);

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  menu: router({
    categories: publicProcedure.query(async () => {
      return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
    }),
    
    products: publicProcedure.query(async () => {
      return await db.select().from(products).where(eq(products.isAvailable, true)).orderBy(products.sortOrder);
    }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input }) => {
        const allProducts = await db.select().from(products).where(eq(products.isAvailable, true));
        const productList = allProducts.map(p => `${p.name} - ${(p.basePrice / 100).toFixed(2)}€`).join('\n');
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Du bist ein freundlicher KI-Assistent für das Calwer Kebap Restaurant. Hilf Kunden bei der Bestellung.\n\nVerfügbare Produkte:\n${productList}\n\nBeantworte Fragen zu Produkten, Preisen und nimm Bestellungen entgegen. Sei freundlich und hilfsbereit.`
            },
            {
              role: 'user',
              content: input.message
            }
          ]
        });
        
        const content = response.choices[0]?.message?.content;
        const reply = typeof content === 'string' ? content : 'Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.';
        return { reply };
      }),
  }),
});

export type AppRouter = typeof appRouter;
