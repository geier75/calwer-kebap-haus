ALTER TABLE `orderItems` ADD `extras` json;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `hasExtras`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `availableExtras`;