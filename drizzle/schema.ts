import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  
  // Gamification fields
  loyaltyPoints: int("loyaltyPoints").default(0).notNull(),
  currentLevel: mysqlEnum("currentLevel", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalSpent: int("totalSpent").default(0).notNull(), // in cents
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories (Pizza, Döner, Kebap, etc.)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  nameTr: varchar("nameTr", { length: 100 }),
  nameAr: varchar("nameAr", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products/Menu items
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }),
  nameTr: varchar("nameTr", { length: 200 }),
  nameAr: varchar("nameAr", { length: 200 }),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  descriptionTr: text("descriptionTr"),
  descriptionAr: text("descriptionAr"),
  imageUrl: text("imageUrl"),
  basePrice: int("basePrice").notNull(), // in cents
  isVegetarian: boolean("isVegetarian").default(false).notNull(),
  isVegan: boolean("isVegan").default(false).notNull(),
  isSpicy: boolean("isSpicy").default(false).notNull(),
  allergens: text("allergens"), // JSON array of allergen strings
  nutritionInfo: text("nutritionInfo"), // JSON object
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product variants (sizes, options)
 */
export const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Klein", "Groß", "Ø 30cm"
  nameEn: varchar("nameEn", { length: 100 }),
  nameTr: varchar("nameTr", { length: 100 }),
  nameAr: varchar("nameAr", { length: 100 }),
  priceModifier: int("priceModifier").default(0).notNull(), // in cents, added to base price
  isDefault: boolean("isDefault").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Product extras/add-ons
 */
export const productExtras = mysqlTable("productExtras", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  nameTr: varchar("nameTr", { length: 100 }),
  nameAr: varchar("nameAr", { length: 100 }),
  price: int("price").notNull(), // in cents
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductExtra = typeof productExtras.$inferSelect;
export type InsertProductExtra = typeof productExtras.$inferInsert;

/**
 * Customer delivery addresses
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 50 }), // e.g., "Home", "Work"
  street: varchar("street", { length: 200 }).notNull(),
  houseNumber: varchar("houseNumber", { length: 20 }).notNull(),
  floor: varchar("floor", { length: 20 }),
  postalCode: varchar("postalCode", { length: 10 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  notes: text("notes"), // Delivery instructions
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 20 }).notNull().unique(),
  userId: int("userId").notNull(),
  addressId: int("addressId").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivering",
    "delivered",
    "cancelled"
  ]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  deliveryFee: int("deliveryFee").default(0).notNull(), // in cents
  discount: int("discount").default(0).notNull(), // in cents
  total: int("total").notNull(), // in cents
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "paypal"]).default("cash").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  notes: text("notes"),
  estimatedDeliveryTime: timestamp("estimatedDeliveryTime"),
  deliveredAt: timestamp("deliveredAt"),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 200 }).notNull(), // Snapshot at order time
  variantId: int("variantId"),
  variantName: varchar("variantName", { length: 100 }),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(), // in cents
  totalPrice: int("totalPrice").notNull(), // in cents
  extras: text("extras"), // JSON array of selected extras
  specialInstructions: text("specialInstructions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Gamification: Achievements/Badges
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  nameTr: varchar("nameTr", { length: 100 }),
  nameAr: varchar("nameAr", { length: 100 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  descriptionTr: text("descriptionTr"),
  descriptionAr: text("descriptionAr"),
  iconUrl: text("iconUrl"),
  pointsReward: int("pointsReward").default(0).notNull(),
  requirement: text("requirement"), // JSON object describing unlock condition
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements (unlocked badges)
 */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Gamification: Rewards/Coupons
 */
export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  nameTr: varchar("nameTr", { length: 100 }),
  nameAr: varchar("nameAr", { length: 100 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  descriptionTr: text("descriptionTr"),
  descriptionAr: text("descriptionAr"),
  type: mysqlEnum("type", ["discount_percent", "discount_fixed", "free_item", "free_delivery"]).notNull(),
  value: int("value").notNull(), // percentage or cents
  pointsCost: int("pointsCost").notNull(),
  minOrderAmount: int("minOrderAmount").default(0).notNull(), // in cents
  validDays: int("validDays").default(30).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;

/**
 * User redeemed rewards
 */
export const userRewards = mysqlTable("userRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rewardId: int("rewardId").notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  status: mysqlEnum("status", ["active", "used", "expired"]).default("active").notNull(),
  usedInOrderId: int("usedInOrderId"),
  expiresAt: timestamp("expiresAt").notNull(),
  redeemedAt: timestamp("redeemedAt").defaultNow().notNull(),
  usedAt: timestamp("usedAt"),
});

export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = typeof userRewards.$inferInsert;

/**
 * Product favorites
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Product reviews
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  orderId: int("orderId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
