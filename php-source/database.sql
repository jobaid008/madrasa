-- ========================================================
-- উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
-- Central Financial Management System
-- Database Schema for MySQL 8.0+ / MariaDB 10.4+
-- ========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

-- --------------------------------------------------------
-- Table structure for `madrasa_settings`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `madrasa_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_bn` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `address_bn` VARCHAR(255) NOT NULL,
  `address_en` VARCHAR(255) NOT NULL,
  `established_bn` VARCHAR(100) NOT NULL,
  `established_en` VARCHAR(100) NOT NULL,
  `registration_bn` VARCHAR(100) NOT NULL,
  `registration_en` VARCHAR(100) NOT NULL,
  `mahatamim_bn` VARCHAR(150) NOT NULL,
  `mahatamim_en` VARCHAR(150) NOT NULL,
  `mahatamim_phone` VARCHAR(50) NOT NULL,
  `office_phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `announcement_bn` TEXT DEFAULT NULL,
  `announcement_en` TEXT DEFAULT NULL,
  `opening_balance` DECIMAL(15,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `madrasa_settings` (`id`, `name_bn`, `name_en`, `address_bn`, `address_en`, `established_bn`, `established_en`, `registration_bn`, `registration_en`, `mahatamim_bn`, `mahatamim_en`, `mahatamim_phone`, `office_phone`, `email`, `announcement_bn`, `announcement_en`, `opening_balance`) VALUES
(1, 'উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা', 'Uttar Deshibai Faizul Uloom Qawmi Hafizia Madrasa & Orphanage', 'উত্তর দেশীবাই, কাঁঠালী, জলঢাকা, নীলফামারী', 'Uttar Deshibai, Kanthali, Jaldhaka, Nilphamari', '১৯৭১ খ্রিষ্টাব্দ / ১৩৭১ বঙ্গাব্দ', '1971 AD / 1371 BS', 'রংপুর-৬৪২/৮৬', 'Rangpur-642/86', 'মাও: মো: মোস্তফা কামাল', 'Mawlana Md. Mostafa Kamal', '+8801744618311', '01832693837', 'deshibaimadrasa@gmail.com', 'মাদ্রাসার সকল ছাত্র-ছাত্রীদের প্রতি অনুরোধ, নিয়মিত পড়াশোনা ও নামাজে মনোযোগী হও।', 'Requesting all students of the madrasa to be attentive to regular studies and daily prayers.', 0.00);

-- --------------------------------------------------------
-- Table structure for `users` (Admin Authentication)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'accountant') DEFAULT 'admin',
  `must_change_password` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Administrator (Phone: 01832693837, Default Password: password_hash of 524434)
INSERT INTO `users` (`id`, `username`, `phone`, `password_hash`, `role`, `must_change_password`) VALUES
(1, '01832693837', '01832693837', '$2y$10$wT8K8U1p0b/1rVp1MkJt2eC3S0k7vK4tK7Cj5yWjXhK6a1L8m1V2.', 'super_admin', 1);

-- --------------------------------------------------------
-- Table structure for `categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_bn` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `color` VARCHAR(20) DEFAULT '#059669',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Categories
INSERT INTO `categories` (`id`, `name_bn`, `name_en`, `type`, `color`) VALUES
(1, 'যাকাত', 'Zakat', 'income', '#10B981'),
(2, 'সাধারণ অনুদান', 'General Donation', 'income', '#059669'),
(3, 'দান ও সাদাকাহ', 'Charity / Sadaqah', 'income', '#047857'),
(4, 'লিল্লা বোর্ডিং ও এতিম তহবিল', 'Lillah Boarding & Orphanage Fund', 'income', '#14B8A6'),
(5, 'মাসিক চাঁদা', 'Monthly Subscription', 'income', '#0D9488'),
(6, 'কোরবানির চামড়ার অর্থ', 'Qurbani Hides Income', 'income', '#065F46'),
(7, 'ছাত্র ভর্তি ও পরীক্ষা ফি', 'Student Admission & Exam Fee', 'income', '#34D399'),
(8, 'খাদ্য খরচ', 'Food & Meals', 'expense', '#EF4444'),
(9, 'শিক্ষক বেতন', 'Teachers Salary', 'expense', '#DC2626'),
(10, 'বিদ্যুৎ ও পানি বিল', 'Electricity & Water Bill', 'expense', '#B91C1C'),
(11, 'চিকিৎসা ও ওষুধ', 'Medical & Healthcare', 'expense', '#F87171'),
(12, 'কিতাব ও শিক্ষা উপকরণ', 'Books & Supplies', 'expense', '#EA580C'),
(13, 'ভবন সংস্কার ও মেরামত', 'Building Maintenance', 'expense', '#C2410C'),
(14, 'বিবিধ খরচ ও মেহমানদারি', 'Miscellaneous & Hospitality', 'expense', '#9A3412');

-- --------------------------------------------------------
-- Table structure for `transactions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sl` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `category_name_bn` VARCHAR(150) NOT NULL,
  `category_name_en` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `donor_or_payee` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `payment_method` ENUM('cash', 'bkash', 'nagad', 'bank') DEFAULT 'cash',
  `voucher_no` VARCHAR(50) DEFAULT NULL,
  `is_public` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_type` (`type`),
  INDEX `idx_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Authentic Transactions from Screenshot
INSERT INTO `transactions` (`id`, `sl`, `date`, `type`, `category_id`, `category_name_bn`, `category_name_en`, `description`, `amount`, `donor_or_payee`, `payment_method`, `voucher_no`, `is_public`) VALUES
(1, 1, '2026-10-27', 'income', 1, 'যাকাত', 'Zakat', 'হাফেজদের অনুদান', 5000.00, 'আলহাজ্ব মো: রফিকুল ইসলাম', 'cash', 'IN-2026-001', 1),
(2, 2, '2026-10-27', 'expense', 8, 'খাদ্য খরচ', 'Food & Meals', 'মাদ্রাসার ছাত্রদের খাবার', 2450.00, 'জলঢাকা স্থানীয় বাজার', 'cash', 'EX-2026-001', 1),
(3, 3, '2026-10-26', 'income', 2, 'সাধারণ অনুদান', 'General Donation', 'স্থানীয় ব্যক্তির অনুদান', 10000.00, 'জনাব মো: শফিকুল হক', 'bkash', 'IN-2026-002', 1),
(4, 4, '2026-10-26', 'expense', 9, 'শিক্ষক বেতন', 'Teachers Salary', 'শিক্ষক বেতন প্রদান', 15000.00, 'মাওলানা আব্দুল্লাহ ও সহকারী শিক্ষকবৃন্দ', 'cash', 'EX-2026-002', 1),
(5, 5, '2026-10-25', 'income', 3, 'দান', 'Charity / Sadaqah', 'একজন দাতার অনুদান', 20000.00, 'প্রবাসী শুভাকাঙ্ক্ষী (গোপন দান)', 'bank', 'IN-2026-003', 1);

COMMIT;
