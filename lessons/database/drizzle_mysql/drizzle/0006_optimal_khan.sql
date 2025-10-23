CREATE TABLE `is_email_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY),
	`created_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `is_email_token` ADD CONSTRAINT `is_email_token_user_id_users_auth_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_auth`(`id`) ON DELETE cascade ON UPDATE no action;