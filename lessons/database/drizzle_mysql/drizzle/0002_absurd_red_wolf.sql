CREATE TABLE `user_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`tagline` varchar(255) NOT NULL,
	CONSTRAINT `user_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_data_title_unique` UNIQUE(`title`)
);
