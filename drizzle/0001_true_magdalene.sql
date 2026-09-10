CREATE TABLE `session_holds` (
	`session_id` text PRIMARY KEY NOT NULL,
	`held_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
