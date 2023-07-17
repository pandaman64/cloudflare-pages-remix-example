CREATE TABLE `id_association` (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` integer NOT NULL,
	PRIMARY KEY(`provider`, `provider_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_name` text NOT NULL
);
