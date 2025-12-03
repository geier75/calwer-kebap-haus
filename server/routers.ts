import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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

  // Categories
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    
    featured: publicProcedure.query(async () => {
      return await db.getFeaturedProducts();
    }),
    
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.categoryId);
      }),
    
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductBySlug(input.slug);
      }),
    
    variants: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductVariants(input.productId);
      }),
  }),

  // Extras
  extras: router({
    list: publicProcedure.query(async () => {
      return await db.getAllExtras();
    }),
  }),

  // Favorites
  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFavorites(ctx.user.id);
    }),
    
    toggle: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isFavorited = await db.toggleFavorite(ctx.user.id, input.productId);
        return { isFavorited };
      }),
  }),

  // Gamification - Achievements
  achievements: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAchievements();
    }),
    
    userAchievements: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAchievements(ctx.user.id);
    }),
  }),

  // Gamification - Rewards
  rewards: router({
    list: publicProcedure.query(async () => {
      return await db.getAllRewards();
    }),
    
    userRewards: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserRewards(ctx.user.id);
    }),
    
    redeem: protectedProcedure
      .input(z.object({ rewardId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new Error("User not found");
        
        const reward = await db.getAllRewards();
        const selectedReward = reward.find(r => r.id === input.rewardId);
        if (!selectedReward) throw new Error("Reward not found");
        
        if (user.loyaltyPoints < selectedReward.pointsCost) {
          throw new Error("Not enough points");
        }
        
        // Generate unique code
        const code = `RWD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + selectedReward.validDays);
        
        await db.redeemReward(ctx.user.id, input.rewardId, code, expiresAt);
        
        // Deduct points
        await db.updateUserGamification(ctx.user.id, {
          loyaltyPoints: user.loyaltyPoints - selectedReward.pointsCost,
        });
        
        return { code, expiresAt };
      }),
  }),

  // Addresses
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAddresses(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        label: z.string().optional(),
        street: z.string(),
        houseNumber: z.string(),
        floor: z.string().optional(),
        postalCode: z.string(),
        city: z.string(),
        phone: z.string(),
        notes: z.string().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createAddress({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // Orders
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),
    
    byId: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Order not found");
        }
        return order;
      }),
    
    items: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Order not found");
        }
        return await db.getOrderItems(input.orderId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        addressId: z.number(),
        items: z.array(z.object({
          productId: z.number(),
          variantId: z.number().optional(),
          quantity: z.number(),
          extras: z.array(z.number()).optional(),
          specialInstructions: z.string().optional(),
        })),
        paymentMethod: z.enum(["cash", "card", "paypal"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Calculate order total
        let subtotal = 0;
        const orderItems = [];
        
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) throw new Error(`Product ${item.productId} not found`);
          
          let price = product.basePrice;
          let variantName = null;
          
          if (item.variantId) {
            const variants = await db.getProductVariants(item.productId);
            const variant = variants.find(v => v.id === item.variantId);
            if (variant) {
              price += variant.priceModifier;
              variantName = variant.name;
            }
          }
          
          const itemTotal = price * item.quantity;
          subtotal += itemTotal;
          
          orderItems.push({
            productId: item.productId,
            productName: product.name,
            variantId: item.variantId,
            variantName,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: itemTotal,
            extras: item.extras ? JSON.stringify(item.extras) : null,
            specialInstructions: item.specialInstructions,
          });
        }
        
        const deliveryFee = 200; // 2€
        const total = subtotal + deliveryFee;
        
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        // Create order
        const result = await db.createOrder({
          orderNumber,
          userId: ctx.user.id,
          addressId: input.addressId,
          status: "pending",
          subtotal,
          deliveryFee,
          discount: 0,
          total,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
          notes: input.notes,
          pointsEarned: Math.floor(total / 100), // 1 point per €
        });
        
        const orderId = Number((result as any).insertId);
        
        // Create order items
        for (const item of orderItems) {
          await db.createOrderItem({
            orderId,
            ...item,
          });
        }
        
        // Update user gamification
        const user = await db.getUserById(ctx.user.id);
        if (user) {
          const newTotalOrders = user.totalOrders + 1;
          const newTotalSpent = user.totalSpent + total;
          const newPoints = user.loyaltyPoints + Math.floor(total / 100);
          
          // Level up logic
          let newLevel = user.currentLevel;
          if (newTotalSpent >= 10000) newLevel = "platinum"; // 100€+
          else if (newTotalSpent >= 5000) newLevel = "gold"; // 50€+
          else if (newTotalSpent >= 2000) newLevel = "silver"; // 20€+
          
          await db.updateUserGamification(ctx.user.id, {
            totalOrders: newTotalOrders,
            totalSpent: newTotalSpent,
            loyaltyPoints: newPoints,
            currentLevel: newLevel,
          });
          
          // Check for achievements
          if (newTotalOrders === 1) {
            await db.unlockAchievement(ctx.user.id, 1); // First order
          }
          if (newTotalOrders === 10) {
            await db.unlockAchievement(ctx.user.id, 2); // Loyal customer
          }
          if (newTotalSpent >= 10000) {
            await db.unlockAchievement(ctx.user.id, 3); // Big spender
          }
        }
        
        return { orderNumber, orderId };
      }),
  }),

  // Reviews
  reviews: router({
    byProduct: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductReviews(input.productId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        orderId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReview({
          userId: ctx.user.id,
          productId: input.productId,
          orderId: input.orderId,
          rating: input.rating,
          comment: input.comment,
          isApproved: false,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
