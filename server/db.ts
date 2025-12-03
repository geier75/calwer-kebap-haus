import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  productVariants,
  productExtras,
  addresses,
  orders,
  orderItems,
  achievements,
  userAchievements,
  rewards,
  userRewards,
  favorites,
  reviews,
  InsertCategory,
  InsertProduct,
  InsertProductVariant,
  InsertProductExtra,
  InsertAddress,
  InsertOrder,
  InsertOrderItem,
  InsertAchievement,
  InsertUserAchievement,
  InsertReward,
  InsertUserReward,
  InsertFavorite,
  InsertReview,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserGamification(userId: number, data: {
  loyaltyPoints?: number;
  currentLevel?: "bronze" | "silver" | "gold" | "platinum";
  totalOrders?: number;
  totalSpent?: number;
}) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set(data).where(eq(users.id, userId));
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(categories).values(data);
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.isActive, true)).orderBy(products.sortOrder);
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
    .orderBy(products.sortOrder);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
    .orderBy(products.sortOrder)
    .limit(6);
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(products).values(data);
}

// ============================================================================
// PRODUCT VARIANTS & EXTRAS
// ============================================================================

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productVariants).where(eq(productVariants.productId, productId)).orderBy(productVariants.sortOrder);
}

export async function getAllExtras() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productExtras).where(eq(productExtras.isActive, true)).orderBy(productExtras.sortOrder);
}

// ============================================================================
// ADDRESSES
// ============================================================================

export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function getAddressById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(addresses).where(eq(addresses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAddress(data: InsertAddress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(addresses).values(data);
  return result;
}

// ============================================================================
// ORDERS
// ============================================================================

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(data);
  return result;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(data: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(orderItems).values(data);
}

// ============================================================================
// GAMIFICATION - ACHIEVEMENTS
// ============================================================================

export async function getAllAchievements() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(achievements).where(eq(achievements.isActive, true)).orderBy(achievements.sortOrder);
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: userAchievements.id,
      achievementId: userAchievements.achievementId,
      unlockedAt: userAchievements.unlockedAt,
      achievement: achievements,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));
}

export async function unlockAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already unlocked
  const existing = await db
    .select()
    .from(userAchievements)
    .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)))
    .limit(1);
  
  if (existing.length > 0) return false;
  
  await db.insert(userAchievements).values({ userId, achievementId });
  return true;
}

// ============================================================================
// GAMIFICATION - REWARDS
// ============================================================================

export async function getAllRewards() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(rewards).where(eq(rewards.isActive, true)).orderBy(rewards.sortOrder);
}

export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: userRewards.id,
      rewardId: userRewards.rewardId,
      code: userRewards.code,
      status: userRewards.status,
      expiresAt: userRewards.expiresAt,
      redeemedAt: userRewards.redeemedAt,
      reward: rewards,
    })
    .from(userRewards)
    .innerJoin(rewards, eq(userRewards.rewardId, rewards.id))
    .where(eq(userRewards.userId, userId))
    .orderBy(desc(userRewards.redeemedAt));
}

export async function redeemReward(userId: number, rewardId: number, code: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userRewards).values({
    userId,
    rewardId,
    code,
    expiresAt,
    status: "active",
  });
}

// ============================================================================
// FAVORITES
// ============================================================================

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: favorites.id,
      productId: favorites.productId,
      createdAt: favorites.createdAt,
      product: products,
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, userId));
}

export async function toggleFavorite(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.delete(favorites).where(eq(favorites.id, existing[0]!.id));
    return false;
  } else {
    await db.insert(favorites).values({ userId, productId });
    return true;
  }
}

// ============================================================================
// REVIEWS
// ============================================================================

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: users,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reviews).values(data);
}
