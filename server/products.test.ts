import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    loyaltyPoints: 500,
    currentLevel: "bronze" as const,
    totalOrders: 5,
    totalSpent: 3000,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Products API", () => {
  it("should list all categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.categories.list();
    
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("id");
    expect(categories[0]).toHaveProperty("name");
    expect(categories[0]).toHaveProperty("slug");
  });

  it("should list all products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("basePrice");
  });

  it("should list featured products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const featured = await caller.products.featured();
    
    expect(featured).toBeDefined();
    expect(Array.isArray(featured)).toBe(true);
    if (featured.length > 0) {
      expect(featured[0]!.isFeatured).toBe(true);
    }
  });

  it("should get products by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.byCategory({ categoryId: 1 });
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    if (products.length > 0) {
      expect(products[0]!.categoryId).toBe(1);
    }
  });

  it("should get product by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const product = await caller.products.bySlug({ slug: "doener-kebap" });
    
    expect(product).toBeDefined();
    if (product) {
      expect(product.slug).toBe("doener-kebap");
      expect(product.name).toBeDefined();
    }
  });

  it("should list all extras", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const extras = await caller.extras.list();
    
    expect(extras).toBeDefined();
    expect(Array.isArray(extras)).toBe(true);
    expect(extras.length).toBeGreaterThan(0);
    expect(extras[0]).toHaveProperty("name");
    expect(extras[0]).toHaveProperty("price");
  });
});

describe("Gamification API", () => {
  it("should list all achievements", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const achievements = await caller.achievements.list();
    
    expect(achievements).toBeDefined();
    expect(Array.isArray(achievements)).toBe(true);
    expect(achievements.length).toBeGreaterThan(0);
    expect(achievements[0]).toHaveProperty("key");
    expect(achievements[0]).toHaveProperty("name");
    expect(achievements[0]).toHaveProperty("pointsReward");
  });

  it("should list all rewards", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const rewards = await caller.rewards.list();
    
    expect(rewards).toBeDefined();
    expect(Array.isArray(rewards)).toBe(true);
    expect(rewards.length).toBeGreaterThan(0);
    expect(rewards[0]).toHaveProperty("name");
    expect(rewards[0]).toHaveProperty("pointsCost");
    expect(rewards[0]).toHaveProperty("type");
  });
});

describe("Auth API", () => {
  it("should return null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();
    
    expect(user).toBeNull();
  });

  it("should return user data for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();
    
    expect(user).toBeDefined();
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("loyaltyPoints");
  });
});
