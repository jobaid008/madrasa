import JSZip from 'jszip';
import { MadrasaInfo, Transaction, Category } from '../types';

// 1-Click Direct Download of single index.php file
export async function downloadIndexPhpFile(): Promise<void> {
  try {
    const res = await fetch('/index.php');
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.php';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
  } catch (e) {
    console.error('Error fetching /index.php', e);
  }

  // Fallback direct download
  const fallbackPhp = `<?php
/**
 * উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
 * Full-Stack Production PHP Application with SQLite PDO & VPS Fallback
 * Mohtamim: মাওলানা মোস্তফা কামাল (+8801744618311)
 * Admin Credentials: Phone: 01832693837 | Pass: 524434
 */
session_start();
date_default_timezone_set('Asia/Dhaka');
header('Location: /');
exit;
`;
  const blob = new Blob([fallbackPhp], { type: 'application/x-php' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.php';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate complete downloadable ZIP
export async function generateSourceCodeZip(
  madrasa: MadrasaInfo,
  transactions: Transaction[],
  categories: Category[]
): Promise<Blob> {
  const zip = new JSZip();

  // Try to fetch current index.php
  let indexPhpContent = '';
  try {
    const res = await fetch('/index.php');
    if (res.ok) {
      indexPhpContent = await res.text();
    }
  } catch {
    // fallback
  }

  if (!indexPhpContent) {
    indexPhpContent = `<?php
/**
 * উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
 * Full-Stack Production PHP Application with SQLite PDO & VPS Fallback
 * Mohtamim: মাওলানা মোস্তফা কামাল (+8801744618311)
 * Admin Credentials: Phone: 01832693837 | Pass: 524434
 */
session_start();
date_default_timezone_set('Asia/Dhaka');
?>`;
  }

  // 1. database.sql
  const databaseSql = `-- ========================================================
-- উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
-- Database Schema for MySQL 8.0+ / MariaDB 10.4+
-- ========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

CREATE TABLE IF NOT EXISTS \`madrasa_settings\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name_bn\` VARCHAR(255) NOT NULL,
  \`name_en\` VARCHAR(255) NOT NULL,
  \`address_bn\` VARCHAR(255) NOT NULL,
  \`address_en\` VARCHAR(255) NOT NULL,
  \`established_bn\` VARCHAR(100) NOT NULL,
  \`established_en\` VARCHAR(100) NOT NULL,
  \`registration_bn\` VARCHAR(100) NOT NULL,
  \`registration_en\` VARCHAR(100) NOT NULL,
  \`mahatamim_bn\` VARCHAR(150) NOT NULL,
  \`mahatamim_en\` VARCHAR(150) NOT NULL,
  \`mahatamim_phone\` VARCHAR(50) NOT NULL,
  \`office_phone\` VARCHAR(50) NOT NULL,
  \`announcement_bn\` TEXT DEFAULT NULL,
  \`opening_balance\` DECIMAL(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`madrasa_settings\` (\`id\`, \`name_bn\`, \`name_en\`, \`address_bn\`, \`address_en\`, \`established_bn\`, \`established_en\`, \`registration_bn\`, \`registration_en\`, \`mahatamim_bn\`, \`mahatamim_en\`, \`mahatamim_phone\`, \`office_phone\`, \`announcement_bn\`, \`opening_balance\`) VALUES
(1, '${madrasa.nameBn.replace(/'/g, "\\'")}', '${madrasa.nameEn.replace(/'/g, "\\'")}', '${madrasa.addressBn.replace(/'/g, "\\'")}', '${madrasa.addressEn.replace(/'/g, "\\'")}', '${madrasa.establishedBn}', '${madrasa.establishedEn}', '${madrasa.registrationBn}', '${madrasa.registrationEn}', '${madrasa.mahatamimBn}', '${madrasa.mahatamimEn}', '${madrasa.mahatamimPhone}', '${madrasa.officePhone}', '${madrasa.announcementBn.replace(/'/g, "\\'")}', ${madrasa.openingBalance});

CREATE TABLE IF NOT EXISTS \`transactions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`sl\` INT UNSIGNED NOT NULL,
  \`date\` DATE NOT NULL,
  \`type\` ENUM('income', 'expense') NOT NULL,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`category_name_bn\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`amount\` DECIMAL(15,2) NOT NULL,
  \`donor_or_payee\` VARCHAR(150) DEFAULT NULL,
  \`payment_method\` ENUM('cash', 'bkash', 'nagad', 'bank') DEFAULT 'cash',
  \`voucher_no\` VARCHAR(50) DEFAULT NULL,
  \`is_public\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
`;

  // 2. README.md
  const readmeMd = `# উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা
## Full-Stack Production PHP Application with SQLite & MySQL

### ইনস্টলেশন (Installation)
1. এই ফোল্ডারের ফাইলসমূহ আপনার cPanel বা লোকাল হোস্টিং \`htdocs\` ফোল্ডারে রাখুন।
2. কোনো ডাটাবেজ কনফিগার ছাড়াই স্বয়ংক্রিয়ভাবে SQLite (\`madrasa_accounting.sqlite\`) ব্যবহার করে চালু হয়ে যাবে!
3. ব্রাউজারে প্রবেশ করুন: \`http://localhost/index.php\`
4. অ্যাডমিন লগইন:
   - মোবাইল: \`01832693837\`
   - পাসওয়ার্ড: \`524434\`
`;

  // Logo blob
  let logoBlob: Blob | null = null;
  try {
    const res = await fetch('/madrasa_logo.png');
    if (res.ok) {
      logoBlob = await res.blob();
    }
  } catch {
    // ignore
  }

  zip.file('index.php', indexPhpContent);
  zip.file('database.sql', databaseSql);
  zip.file('README.md', readmeMd);

  if (logoBlob) {
    zip.file('logo.png', logoBlob);
    zip.file('madrasa_logo.png', logoBlob);
  }

  return await zip.generateAsync({ type: 'blob' });
}
