CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int,
	`titleEn` varchar(512) NOT NULL,
	`titleAr` varchar(512),
	`contentEn` text,
	`contentAr` text,
	`excerptEn` text,
	`excerptAr` text,
	`imageUrl` varchar(1024),
	`slug` varchar(512),
	`isPublished` boolean DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryId` int NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameAr` varchar(128),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nameEn` varchar(256) NOT NULL,
	`nameAr` varchar(256),
	`registrationNumber` varchar(128),
	`email` varchar(320),
	`phone` varchar(32),
	`address` text,
	`website` varchar(512),
	`logoUrl` varchar(1024),
	`countryId` int,
	`cityId` int,
	`description` text,
	`isApproved` boolean DEFAULT false,
	`isBlocked` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(64) NOT NULL,
	`icon` varchar(64),
	CONSTRAINT `contact_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameAr` varchar(128),
	`code` varchar(8),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education_levels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameAr` varchar(128),
	CONSTRAINT `education_levels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionEn` text NOT NULL,
	`questionAr` text,
	`answerEn` text NOT NULL,
	`answerAr` text,
	`sortOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`seafarerId` int NOT NULL,
	`status` enum('pending','reviewed','accepted','rejected') DEFAULT 'pending',
	`coverLetter` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`rankId` int,
	`shipTypeId` int,
	`titleEn` varchar(256),
	`titleAr` varchar(256),
	`descriptionEn` text,
	`descriptionAr` text,
	`countryId` int,
	`salary` decimal(10,2),
	`currency` varchar(8) DEFAULT 'USD',
	`contractDuration` varchar(128),
	`isActive` boolean DEFAULT true,
	`publishedAt` timestamp DEFAULT (now()),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleEn` varchar(256),
	`titleAr` varchar(256),
	`messageEn` text,
	`messageAr` text,
	`linkUrl` varchar(512),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`titleEn` varchar(256),
	`titleAr` varchar(256),
	`contentEn` text,
	`contentAr` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `ranks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameAr` varchar(128),
	`department` enum('deck','engine','catering','other') DEFAULT 'deck',
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `ranks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seafarer_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seafarerId` int NOT NULL,
	`docType` varchar(128),
	`fileUrl` varchar(1024) NOT NULL,
	`fileName` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seafarer_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seafarer_ship_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seafarerId` int NOT NULL,
	`shipTypeId` int NOT NULL,
	CONSTRAINT `seafarer_ship_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seafarers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstNameEn` varchar(128),
	`middleNameEn` varchar(128),
	`lastNameEn` varchar(128),
	`firstNameAr` varchar(128),
	`middleNameAr` varchar(128),
	`lastNameAr` varchar(128),
	`email` varchar(320),
	`phone` varchar(32),
	`rankId` int,
	`educationLevelId` int,
	`countryId` int,
	`cityId` int,
	`birthDate` timestamp,
	`experienceMonths` int DEFAULT 0,
	`availabilityStatus` enum('available','onboard','unavailable') DEFAULT 'available',
	`profileImageUrl` varchar(1024),
	`cvUrl` varchar(1024),
	`bio` text,
	`isVerified` boolean DEFAULT false,
	`isBlocked` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seafarers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ship_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameAr` varchar(128),
	`iconUrl` varchar(1024),
	CONSTRAINT `ship_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sliders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(256),
	`titleAr` varchar(256),
	`subtitleEn` varchar(512),
	`subtitleAr` varchar(512),
	`imageUrl` varchar(1024) NOT NULL,
	`linkUrl` varchar(512),
	`sortOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sliders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`requestType` enum('seafarer','company') NOT NULL,
	`documentUrl` varchar(1024),
	`notes` text,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`adminNotes` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vessels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`nameEn` varchar(256) NOT NULL,
	`nameAr` varchar(256),
	`shipTypeId` int,
	`flag` varchar(128),
	`imoNumber` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vessels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` varchar(1024);--> statement-breakpoint
ALTER TABLE `users` ADD `accountType` enum('seafarer','company') DEFAULT 'seafarer';--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `isBlocked` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `resetToken` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `resetTokenExpiry` timestamp;