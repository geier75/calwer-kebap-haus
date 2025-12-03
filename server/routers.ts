import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { drizzle } from "drizzle-orm/mysql2";
import { categories, products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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
});

export type AppRouter = typeof appRouter;
