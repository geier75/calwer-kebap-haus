CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`nameTr` varchar(100),
	`nameAr` varchar(100),
	`description` text,
	`descriptionEn` text,
	`descriptionTr` text,
	`descriptionAr` text,
	`iconUrl` text,
	`pointsReward` int NOT NULL DEFAULT 0,
	`requirement` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`label` varchar(50),
	`street` varchar(200) NOT NULL,
	`houseNumber` varchar(20) NOT NULL,
	`floor` varchar(20),
	`postalCode` varchar(10) NOT NULL,
	`city` varchar(100) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`notes` text,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`nameTr` varchar(100),
	`nameAr` varchar(100),
	`slug` varchar(100) NOT NULL,
	`description` text,
	`imageUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(200) NOT NULL,
	`variantId` int,
	`variantName` varchar(100),
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`extras` text,
	`specialInstructions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(20) NOT NULL,
	`userId` int NOT NULL,
	`addressId` int NOT NULL,
	`status` enum('pending','confirmed','preparing','ready','delivering','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`subtotal` int NOT NULL,
	`deliveryFee` int NOT NULL DEFAULT 0,
	`discount` int NOT NULL DEFAULT 0,
	`total` int NOT NULL,
	`paymentMethod` enum('cash','card','paypal') NOT NULL DEFAULT 'cash',
	`paymentStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`notes` text,
	`estimatedDeliveryTime` timestamp,
	`deliveredAt` timestamp,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `productExtras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`nameTr` varchar(100),
	`nameAr` varchar(100),
	`price` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productExtras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`nameTr` varchar(100),
	`nameAr` varchar(100),
	`priceModifier` int NOT NULL DEFAULT 0,
	`isDefault` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productVariants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`nameEn` varchar(200),
	`nameTr` varchar(200),
	`nameAr` varchar(200),
	`slug` varchar(200) NOT NULL,
	`description` text,
	`descriptionEn` text,
	`descriptionTr` text,
	`descriptionAr` text,
	`imageUrl` text,
	`basePrice` int NOT NULL,
	`isVegetarian` boolean NOT NULL DEFAULT false,
	`isVegan` boolean NOT NULL DEFAULT false,
	`isSpicy` boolean NOT NULL DEFAULT false,
	`allergens` text,
	`nutritionInfo` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`orderId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`isApproved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`nameTr` varchar(100),
	`nameAr` varchar(100),
	`description` text,
	`descriptionEn` text,
	`descriptionTr` text,
	`descriptionAr` text,
	`type` enum('discount_percent','discount_fixed','free_item','free_delivery') NOT NULL,
	`value` int NOT NULL,
	`pointsCost` int NOT NULL,
	`minOrderAmount` int NOT NULL DEFAULT 0,
	`validDays` int NOT NULL DEFAULT 30,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rewardId` int NOT NULL,
	`code` varchar(20) NOT NULL,
	`status` enum('active','used','expired') NOT NULL DEFAULT 'active',
	`usedInOrderId` int,
	`expiresAt` timestamp NOT NULL,
	`redeemedAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	CONSTRAINT `userRewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `userRewards_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `loyaltyPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentLevel` enum('bronze','silver','gold','platinum') DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalOrders` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalSpent` int DEFAULT 0 NOT NULL;