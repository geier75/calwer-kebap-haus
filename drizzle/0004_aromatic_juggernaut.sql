ALTER TABLE `products` ADD `hasVariants` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `variants` json;