CREATE TABLE `users_auth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_auth_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_auth_email_unique` UNIQUE(`email`)
);
