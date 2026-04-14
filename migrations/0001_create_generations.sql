CREATE TABLE `generations` (
  `id` text PRIMARY KEY NOT NULL,
  `prompt` text NOT NULL,
  `full_prompt` text NOT NULL,
  `preset_id` text NOT NULL,
  `width` integer NOT NULL,
  `height` integer NOT NULL,
  `model` text NOT NULL,
  `image_key` text NOT NULL,
  `created_at` text NOT NULL,
  `status` text NOT NULL,
  `error_message` text
);
