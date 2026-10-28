<?php
/**
 * ====================================================================
 * ফয়জুল উলুম হাফেজিয়া মাদ্রাসা - পাবলিক ও অ্যাডমিন অনলাইন হিসাব পোর্টাল
 * Uttar Deshibai Fayzul Uloom Qaumi Hafezia Madrasa & Orphanage
 * Jaldhaka, Nilphamari | Estd: 1378 Bangabda
 *
 * Full-Stack Production PHP Application with SQLite PDO & VPS Fallback
 * Mohtamim: মাওলানা মোস্তফা কামাল (+8801744618311)
 * Admin Credentials: Phone: 01832693837 | Pass: 524434
 * ====================================================================
 */

session_start();
date_default_timezone_set('Asia/Dhaka');
$dbFile = __DIR__ . '/madrasa_accounting.sqlite';

// Default Seed Categories
$DEFAULT_CATEGORIES = [
    ['id' => 1, 'type' => 'income', 'name_bn' => 'মাসিক চাঁদা', 'name_en' => 'Monthly Subscription', 'icon' => 'fa-hand-holding-heart', 'color' => '#059669'],
    ['id' => 2, 'type' => 'income', 'name_bn' => 'এককালীন অনুদান', 'name_en' => 'One-time Donation', 'icon' => 'fa-handshake-angle', 'color' => '#0284c7'],
    ['id' => 3, 'type' => 'income', 'name_bn' => 'এতিমখানা লিল্লাহ ফান্ড', 'name_en' => 'Orphanage Lillah Fund', 'icon' => 'fa-children', 'color' => '#7c3aed'],
    ['id' => 4, 'type' => 'income', 'name_bn' => 'দানবাক্স কালেকশন', 'name_en' => 'Donation Box', 'icon' => 'fa-box-archive', 'color' => '#ea580c'],
    ['id' => 5, 'type' => 'income', 'name_bn' => 'কোরবানির চামড়া বিক্রয়', 'name_en' => 'Qurbani Hide Proceeds', 'icon' => 'fa-drumstick-bite', 'color' => '#ca8a04'],
    ['id' => 6, 'type' => 'income', 'name_bn' => 'ওয়াকফ জমি ও পুকুর আয়', 'name_en' => 'Waqf Property Lease', 'icon' => 'fa-tree', 'color' => '#0d9488'],
    ['id' => 7, 'type' => 'expense', 'name_bn' => 'উস্তাদ ও স্টাফদের বেতন', 'name_en' => 'Staff & Teachers Salary', 'icon' => 'fa-chalkboard-user', 'color' => '#dc2626'],
    ['id' => 8, 'type' => 'expense', 'name_bn' => 'ছাত্রদের খোরাকী ও মেস খরচ', 'name_en' => 'Student Mess Food', 'icon' => 'fa-utensils', 'color' => '#e11d48'],
    ['id' => 9, 'type' => 'expense', 'name_bn' => 'বিদ্যুৎ ও পানির বিল', 'name_en' => 'Utility Bills', 'icon' => 'fa-bolt', 'color' => '#f59e0b'],
    ['id' => 10, 'type' => 'expense', 'name_bn' => 'ভবন নির্মাণ ও মেরামত', 'name_en' => 'Building Maintenance', 'icon' => 'fa-trowel-bricks', 'color' => '#4f46e5'],
    ['id' => 11, 'type' => 'expense', 'name_bn' => 'এতিমদের পোশাক ও চিকিৎসা', 'name_en' => 'Orphan Clothes & Health', 'icon' => 'fa-kit-medical', 'color' => '#0891b2'],
    ['id' => 12, 'type' => 'expense', 'name_bn' => 'অফিস স্টেশনারী ও কিতাব', 'name_en' => 'Stationery & Books', 'icon' => 'fa-book-open', 'color' => '#475569']
];

// Guaranteed Seed Transactions: Income ৳ 108,300.00 | Expense ৳ 80,820.00 | Net Balance ৳ 27,480.00
$DEFAULT_TRANSACTIONS = [
    ['id' => 1, 'date' => '2026-10-01', 'type' => 'income', 'category_id' => 1, 'title_bn' => 'হাফেজ মোশাররফ হোসেন (মাসিক চাঁদা)', 'title_en' => 'Hafez Mosharraf (Monthly)', 'amount' => 5000.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1001', 'remarks' => 'রশিদ: ৫১২', 'voucher_image' => ''],
    ['id' => 2, 'date' => '2026-10-02', 'type' => 'income', 'category_id' => 2, 'title_bn' => 'হাজী রফিকুল ইসলাম (বিকাশ দান)', 'title_en' => 'Haji Rafiqul Islam (Donation)', 'amount' => 12000.0, 'payment_method' => 'বিকাশ', 'voucher_no' => 'INC-1002', 'remarks' => 'টিএক্স: 8NM39X', 'voucher_image' => ''],
    ['id' => 3, 'date' => '2026-10-04', 'type' => 'expense', 'category_id' => 7, 'title_bn' => 'অক্টোবর মাসের উস্তাদদের বেতন', 'title_en' => 'Teachers Salary October', 'amount' => 45000.0, 'payment_method' => 'ব্যাংক', 'voucher_no' => 'EXP-2001', 'remarks' => 'চেক: ৯৮৩৪২১', 'voucher_image' => ''],
    ['id' => 4, 'date' => '2026-10-06', 'type' => 'income', 'category_id' => 3, 'title_bn' => 'প্রবাসী ভাইদের এতিমখানা অনুদান', 'title_en' => 'Expatriate Lillah Fund', 'amount' => 25000.0, 'payment_method' => 'ব্যাংক', 'voucher_no' => 'INC-1003', 'remarks' => 'সোনালী ব্যাংক', 'voucher_image' => ''],
    ['id' => 5, 'date' => '2026-10-08', 'type' => 'expense', 'category_id' => 8, 'title_bn' => 'চাল, ডাল, তেল ও মেস বাজার', 'title_en' => 'Mess Grocery Items', 'amount' => 18500.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'EXP-2002', 'remarks' => 'বাজার মেমো #৭৪', 'voucher_image' => ''],
    ['id' => 6, 'date' => '2026-10-10', 'type' => 'income', 'category_id' => 4, 'title_bn' => 'জুমার প্রধান দানবাক্স কালেকশন', 'title_en' => 'Friday Donation Box', 'amount' => 8450.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1004', 'remarks' => 'গণনাকৃত টাকা', 'voucher_image' => ''],
    ['id' => 7, 'date' => '2026-10-12', 'type' => 'expense', 'category_id' => 9, 'title_bn' => 'পল্লী বিদ্যুৎ অফিস বিল', 'title_en' => 'Electricity Bill', 'amount' => 3420.0, 'payment_method' => 'নগদ', 'voucher_no' => 'EXP-2003', 'remarks' => 'মিটার: ৫৪২১০৯', 'voucher_image' => ''],
    ['id' => 8, 'date' => '2026-10-15', 'type' => 'income', 'category_id' => 2, 'title_bn' => 'মসজিদ উন্নয়ন কমিটির পক্ষ হতে বিশেষ অনুদান', 'title_en' => 'Mosque Committee Donation', 'amount' => 15000.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1005', 'remarks' => 'রশিদ বই ০৩', 'voucher_image' => ''],
    ['id' => 9, 'date' => '2026-10-18', 'type' => 'expense', 'category_id' => 11, 'title_bn' => 'নতুন হেফজ ছাত্রদের পোশাক ও চিকিৎসা', 'title_en' => 'Orphan Clothing & Medicine', 'amount' => 4200.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'EXP-2004', 'remarks' => 'আল-মদিনা স্টোর', 'voucher_image' => ''],
    ['id' => 10, 'date' => '2026-10-20', 'type' => 'income', 'category_id' => 1, 'title_bn' => 'এলাকাবাসীর খামারি চাঁদা ও অনুদান', 'title_en' => 'Community Donation', 'amount' => 11200.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1006', 'remarks' => 'সংগ্রাহক: কফিলউদ্দিন', 'voucher_image' => ''],
    ['id' => 11, 'date' => '2026-10-22', 'type' => 'expense', 'category_id' => 10, 'title_bn' => 'মাদ্রাসার উত্তর ব্লকের মেরামত', 'title_en' => 'North Block Maintenance', 'amount' => 6800.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'EXP-2005', 'remarks' => 'মিস্ত্রী পারিশ্রমিক', 'voucher_image' => ''],
    ['id' => 12, 'date' => '2026-10-24', 'type' => 'income', 'category_id' => 5, 'title_bn' => 'সংরক্ষিত চামড়া বিক্রয়ের অবশিষ্ট টাকা', 'title_en' => 'Qurbani Hide Sale', 'amount' => 7500.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1007', 'remarks' => 'ট্রেডার্স মেমো #২৯', 'voucher_image' => ''],
    ['id' => 13, 'date' => '2026-10-25', 'type' => 'expense', 'category_id' => 12, 'title_bn' => 'নূরানী ও নাজেরা ছাত্রদের কিতাব ও খাতা', 'title_en' => 'Student Books & Stationery', 'amount' => 2900.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'EXP-2006', 'remarks' => 'ইসলামিক বুক হাউজ', 'voucher_image' => ''],
    ['id' => 14, 'date' => '2026-10-26', 'type' => 'income', 'category_id' => 3, 'title_bn' => 'মরহুম আব্দুল গফুর ঈসালে সাওয়াব ফান্ড', 'title_en' => 'Esale Sawaab Donation', 'amount' => 20000.0, 'payment_method' => 'ব্যাংক', 'voucher_no' => 'INC-1008', 'remarks' => 'পরিবারের পক্ষ থেকে', 'voucher_image' => ''],
    ['id' => 15, 'date' => '2026-10-27', 'type' => 'income', 'category_id' => 4, 'title_bn' => 'মাদ্রাসার পশ্চিম গেট দানবাক্স কালেকশন', 'title_en' => 'West Gate Box', 'amount' => 4150.0, 'payment_method' => 'ক্যাশ', 'voucher_no' => 'INC-1009', 'remarks' => 'রশিদ নং: ৫৫০', 'voucher_image' => '']
];

// Initialize Session Fallback Data
if (!isset($_SESSION['madrasa_transactions'])) {
    $_SESSION['madrasa_transactions'] = $DEFAULT_TRANSACTIONS;
}
if (!isset($_SESSION['madrasa_categories'])) {
    $_SESSION['madrasa_categories'] = $DEFAULT_CATEGORIES;
}

// SQLite Database Setup with Auto-Fallback
$pdo = null;
try {
    $dirWritable = is_writable(__DIR__);
    if ($dirWritable || file_exists($dbFile)) {
        $pdo = new PDO("sqlite:" . $dbFile, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            name_bn TEXT NOT NULL,
            name_en TEXT NOT NULL,
            icon TEXT,
            color TEXT
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            category_id INTEGER,
            title_bn TEXT NOT NULL,
            title_en TEXT,
            amount REAL NOT NULL,
            payment_method TEXT,
            voucher_no TEXT,
            remarks TEXT,
            voucher_image TEXT
        )");

        $catCount = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        if ($catCount == 0) {
            $stmt = $pdo->prepare("INSERT INTO categories (id, type, name_bn, name_en, icon, color) VALUES (:id, :type, :name_bn, :name_en, :icon, :color)");
            foreach ($DEFAULT_CATEGORIES as $cat) {
                $stmt->execute($cat);
            }
        }

        $txCount = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
        if ($txCount == 0) {
            $stmt = $pdo->prepare("INSERT INTO transactions (id, date, type, category_id, title_bn, title_en, amount, payment_method, voucher_no, remarks, voucher_image) VALUES (:id, :date, :type, :category_id, :title_bn, :title_en, :amount, :payment_method, :voucher_no, :remarks, :voucher_image)");
            foreach ($DEFAULT_TRANSACTIONS as $tx) {
                $stmt->execute($tx);
            }
        }
    }
} catch (Exception $e) {
    $pdo = null; // Gracefully continue using $_SESSION
}

// Fetch Categories & Transactions Helper
function getCategories($pdo, $DEFAULT_CATEGORIES) {
    if ($pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM categories ORDER BY id ASC")->fetchAll();
            if (!empty($rows)) return $rows;
        } catch (Exception $e) {}
    }
    return !empty($_SESSION['madrasa_categories']) ? $_SESSION['madrasa_categories'] : $DEFAULT_CATEGORIES;
}

function getTransactions($pdo, $DEFAULT_TRANSACTIONS) {
    if ($pdo) {
        try {
            $rows = $pdo->query("SELECT * FROM transactions ORDER BY date DESC, id DESC")->fetchAll();
            if (!empty($rows)) return $rows;
        } catch (Exception $e) {}
    }
    return !empty($_SESSION['madrasa_transactions']) ? $_SESSION['madrasa_transactions'] : $DEFAULT_TRANSACTIONS;
}

$categories = getCategories($pdo, $DEFAULT_CATEGORIES);
$transactions = getTransactions($pdo, $DEFAULT_TRANSACTIONS);

// Language, Route & Auth
$lang = isset($_GET['lang']) ? ($_GET['lang'] === 'en' ? 'en' : 'bn') : (isset($_SESSION['madrasa_lang']) ? $_SESSION['madrasa_lang'] : 'bn');
$_SESSION['madrasa_lang'] = $lang;

$route = isset($_GET['route']) ? trim($_GET['route']) : 'dashboard';
$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$isAdmin = !empty($_SESSION['madrasa_admin_logged']);

// Madrasa Details
$madrasaNameBn = "উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা";
$madrasaNameEn = "Uttar Deshibai Fayzul Uloom Qaumi Hafezia Madrasa & Orphanage";
$madrasaSubtitleBn = "উত্তর দেশীবাই, কাঁঠালী, জলঢাকা, নীলফামারী";
$madrasaMetaBn = "স্থাপিতঃ ১৯৭১ খ্রিষ্টাব্দ / ১৩৭১ বঙ্গাব্দ | রেজি নং: রংপুর-৬৪২/৮৬";
$mohtamimName = "মাওলানা মোস্তফা কামাল";
$mohtamimPhone = "+8801744618311";
$noticeText = "আলহামদুলিল্লাহ! অত্র মাদ্রাসার ২০২৪-২৫ শিক্ষাবর্ষের ছাত্রদের বার্ষিক হেফজ সমাপনী ও লিল্লাহ ফান্ড সহায়তা কালেকশন সফলভাবে সম্পন্ন হয়েছে। সকল শুভানুধ্যায়ীদের আন্তরিক মোবারকবাদ।";

// Action: 1-Click Download index.php
if ($action === 'download_php') {
    header('Content-Type: application/x-php');
    header('Content-Disposition: attachment; filename="index.php"');
    header('Pragma: no-cache');
    header('Expires: 0');
    echo file_get_contents(__FILE__);
    exit;
}

// Action: 1-Click Download Full PHP Source (.ZIP)
if ($action === 'download_full_zip') {
    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        $zipName = sys_get_temp_dir() . '/madrasa_full_system_' . time() . '.zip';
        if ($zip->open($zipName, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $zip->addFromString('index.php', file_get_contents(__FILE__));
            if (file_exists(__DIR__ . '/logo.png')) {
                $zip->addFile(__DIR__ . '/logo.png', 'logo.png');
            }
            $zip->addFromString('README.md', "# ফয়জুল উলুম হাফেজিয়া মাদ্রাসা - Full-Stack PHP System\n\nRun with: `php -S localhost:8000`\nAdmin Credentials: 01832693837 / 524434\n");
            $zip->close();
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="fayzul_uloom_madrasa_full_php.zip"');
            header('Content-Length: ' . filesize($zipName));
            readfile($zipName);
            @unlink($zipName);
            exit;
        }
    }
    // Fallback if ZipArchive missing
    header('Content-Type: application/x-php');
    header('Content-Disposition: attachment; filename="index.php"');
    echo file_get_contents(__FILE__);
    exit;
}

// Handle Admin Logout
if ($action === 'logout') {
    unset($_SESSION['madrasa_admin_logged']);
    header('Location: index.php?route=dashboard');
    exit;
}

// Handle Admin Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_login_submit'])) {
    $phone = trim($_POST['phone'] ?? '');
    $password = trim($_POST['password'] ?? '');
    if ($phone === '01832693837' && $password === '524434') {
        $_SESSION['madrasa_admin_logged'] = true;
        header('Location: index.php?route=admin-panel');
        exit;
    } else {
        $loginError = ($lang === 'bn') ? 'ভুল ফোন নম্বর অথবা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।' : 'Invalid phone or secret password!';
    }
}

// Handle Delete Transaction
if ($isAdmin && $action === 'delete_tx' && isset($_GET['id'])) {
    $delId = intval($_GET['id']);
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ?");
            $stmt->execute([$delId]);
        } catch (Exception $e) {}
    }
    if (!empty($_SESSION['madrasa_transactions'])) {
        $_SESSION['madrasa_transactions'] = array_values(array_filter($_SESSION['madrasa_transactions'], function($t) use ($delId) {
            return intval($t['id']) !== $delId;
        }));
    }
    header('Location: index.php?route=admin-panel&msg=deleted');
    exit;
}

// Handle Add Transaction
if ($isAdmin && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_transaction'])) {
    $txType = $_POST['type'] ?? 'income';
    $txDate = !empty($_POST['date']) ? $_POST['date'] : date('Y-m-d');
    $txCatId = intval($_POST['category_id'] ?? 1);
    $txTitleBn = trim($_POST['title_bn'] ?? '');
    $txTitleEn = trim($_POST['title_en'] ?? $txTitleBn);
    $txAmount = floatval($_POST['amount'] ?? 0);
    $txMethod = trim($_POST['payment_method'] ?? 'ক্যাশ');
    $txVoucherNo = trim($_POST['voucher_no'] ?? ('V-' . rand(1000, 9999)));
    $txRemarks = trim($_POST['remarks'] ?? '');
    
    // Handle Voucher Image Upload (Convert to Base64)
    $voucherImageBase64 = '';
    if (!empty($_FILES['voucher_image_file']['tmp_name']) && is_uploaded_file($_FILES['voucher_image_file']['tmp_name'])) {
        $imgType = mime_content_type($_FILES['voucher_image_file']['tmp_name']);
        $imgData = file_get_contents($_FILES['voucher_image_file']['tmp_name']);
        $voucherImageBase64 = 'data:' . $imgType . ';base64,' . base64_encode($imgData);
    }

    if ($txAmount > 0 && !empty($txTitleBn)) {
        $newId = time();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO transactions (date, type, category_id, title_bn, title_en, amount, payment_method, voucher_no, remarks, voucher_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$txDate, $txType, $txCatId, $txTitleBn, $txTitleEn, $txAmount, $txMethod, $txVoucherNo, $txRemarks, $voucherImageBase64]);
                $newId = $pdo->lastInsertId();
            } catch (Exception $e) {}
        }
        
        $newRecord = [
            'id' => $newId,
            'date' => $txDate,
            'type' => $txType,
            'category_id' => $txCatId,
            'title_bn' => $txTitleBn,
            'title_en' => $txTitleEn,
            'amount' => $txAmount,
            'payment_method' => $txMethod,
            'voucher_no' => $txVoucherNo,
            'remarks' => $txRemarks,
            'voucher_image' => $voucherImageBase64
        ];
        array_unshift($_SESSION['madrasa_transactions'], $newRecord);
        header('Location: index.php?route=admin-panel&msg=added');
        exit;
    }
}

// Recalculate totals
$transactions = getTransactions($pdo, $DEFAULT_TRANSACTIONS);
$totalIncome = 0;
$totalExpense = 0;
$incomeList = [];
$expenseList = [];

foreach ($transactions as $t) {
    if ($t['type'] === 'income') {
        $totalIncome += floatval($t['amount']);
        $incomeList[] = $t;
    } else {
        $totalExpense += floatval($t['amount']);
        $expenseList[] = $t;
    }
}
$netBalance = $totalIncome - $totalExpense;

// Number Formatting Helpers
function toBnNum($num) {
    $bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str_replace(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], $bn, (string)$num);
}

function numFmt($val, $lang = 'bn') {
    $fmt = number_format($val, 2);
    return ($lang === 'bn') ? toBnNum($fmt) : $fmt;
}

function getCatName($catId, $categories, $lang) {
    foreach ($categories as $c) {
        if ($c['id'] == $catId) {
            return $lang === 'bn' ? $c['name_bn'] : $c['name_en'];
        }
    }
    return $lang === 'bn' ? 'সাধারণ' : 'General';
}
?>
<!DOCTYPE html>
<html lang="<?= $lang === 'bn' ? 'bn' : 'en' ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $lang === 'bn' ? $madrasaNameBn : $madrasaNameEn ?> - হিসাব পোর্টাল</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome 6 Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Google Fonts: Hind Siliguri -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Hind Siliguri', sans-serif; background-color: #f1f5f9; color: #1e293b; }
        .govt-bar { background: linear-gradient(135deg, #004e7c 0%, #006699 50%, #0088cc 100%); }
        .anim-glowing { animation: glowEffect 4s ease-in-out infinite alternate; }
        @keyframes glowEffect {
            0% { text-shadow: 0 0 5px rgba(254, 240, 138, 0.4), 0 0 10px rgba(254, 240, 138, 0.2); }
            100% { text-shadow: 0 0 16px rgba(254, 240, 138, 0.8), 0 0 24px rgba(253, 224, 71, 0.5); }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
            content: ''; position: absolute; top: -50%; left: -60%; width: 40%; height: 200%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
            transform: rotate(30deg); animation: shine 5s infinite;
        }
        @keyframes shine { 0% { left: -60%; } 20% { left: 140%; } 100% { left: 140%; } }
        @media print {
            .no-print, header, aside, footer, #mobile-sidebar-drawer, #mobile-sidebar-overlay { display: none !important; }
            body { background: white !important; padding: 0 !important; }
            .printable-area { display: block !important; width: 100% !important; margin: 0 !important; }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-slate-100">

<!-- Top Header Bar (Bangladesh Govt Portal Dashboard Layout) -->
<header class="govt-bar text-white shadow-lg sticky top-0 z-40 border-b-2 border-emerald-400 no-print">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <!-- Left: Logo & Portal Badge -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="index.php?route=dashboard" class="relative group block">
                <img src="logo.png" onerror="this.src='/logo.png'; this.onerror=null;" alt="Logo" class="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 shadow border-2 border-emerald-400 transition-transform group-hover:scale-105">
            </a>
            <div class="hidden sm:block">
                <span class="px-2 py-0.5 bg-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">
                    <?= $lang === 'bn' ? 'অনলাইন হিসাব পোর্টাল' : 'Online Accounting Portal' ?>
                </span>
                <div class="text-[11px] text-sky-100 mt-0.5">স্থাপিতঃ ১৩৭৮ বঙ্গাব্দ | জলঢাকা, নীলফামারী</div>
            </div>
        </div>

        <!-- Center: Madrasa Title (Responsive for Phone & Desktop) -->
        <div class="text-center flex-1 px-1 sm:px-3 min-w-0">
            <a href="index.php?route=dashboard" class="block">
                <h1 class="text-xs sm:text-lg md:text-2xl font-extrabold text-amber-200 anim-glowing leading-tight line-clamp-1 sm:line-clamp-none">
                    <?= $lang === 'bn' ? $madrasaNameBn : $madrasaNameEn ?>
                </h1>
                <p class="text-[9px] sm:text-xs md:text-sm text-sky-100 mt-0.5 line-clamp-1">
                    <?= $madrasaSubtitleBn ?> (<?= $madrasaMetaBn ?>)
                </p>
            </a>
        </div>

        <!-- Right: Language Toggle, Admin Downloads & Hamburger Menu Button -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <!-- Language Switcher -->
            <a href="index.php?route=<?= htmlspecialchars($route) ?>&lang=<?= $lang === 'bn' ? 'en' : 'bn' ?>" class="btn-shine px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-language text-amber-300"></i>
                <span class="hidden sm:inline"><?= $lang === 'bn' ? 'English' : 'বাংলা' ?></span>
            </a>

            <?php if ($isAdmin): ?>
                <a href="index.php?action=download_php" class="btn-shine hidden lg:inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-xs font-bold rounded-xl shadow border border-sky-300">
                    <i class="fa-solid fa-file-code"></i><span>index.php</span>
                </a>
                <a href="index.php?action=download_full_zip" class="btn-shine hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow border border-emerald-400">
                    <i class="fa-solid fa-file-zipper text-yellow-300"></i><span>Download .ZIP</span>
                </a>
                <a href="index.php?route=admin-panel" class="btn-shine px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl shadow">
                    <i class="fa-solid fa-user-shield mr-1"></i><span class="hidden sm:inline"><?= $lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel' ?></span>
                </a>
                <a href="index.php?action=logout" class="btn-shine px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow" title="Logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </a>
            <?php else: ?>
                <a href="index.php?route=admin-login" class="btn-shine px-3 py-1.5 bg-white text-sky-900 hover:bg-sky-50 text-xs font-bold rounded-xl shadow-md border border-white/40 flex items-center gap-1.5">
                    <i class="fa-solid fa-lock text-sky-700"></i>
                    <span><?= $lang === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login' ?></span>
                </a>
            <?php endif; ?>

            <!-- Mobile Hamburger Button (Image 2 style: crisp white box with 3 dark bars) -->
            <button onclick="toggleMobileSidebar()" class="md:hidden px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 shadow-md border border-slate-200 transition-all flex items-center justify-center shrink-0" title="মেনু খুলুন / Menu">
                <i class="fa-solid fa-bars text-base text-slate-800"></i>
            </button>
        </div>
    </div>

    <!-- Ticker / Notice Bar -->
    <div class="bg-sky-950/70 border-t border-sky-400/20 py-1 px-3 text-xs flex items-center overflow-hidden">
        <div class="shrink-0 flex items-center gap-1.5 bg-rose-600 text-white font-bold px-2 py-0.5 rounded-md text-[11px] mr-2 shadow-sm">
            <i class="fa-solid fa-bullhorn animate-pulse"></i>
            <span><?= $lang === 'bn' ? 'জরুরি ঘোষণা' : 'Notice' ?>:</span>
        </div>
        <div class="overflow-hidden whitespace-nowrap flex-1">
            <marquee behavior="scroll" direction="left" class="text-sky-100 font-medium">
                <?= htmlspecialchars($noticeText) ?> &nbsp;&bull;&nbsp; <?= $madrasaNameBn ?> &nbsp;&bull;&nbsp; মুহতামিম: <?= htmlspecialchars($mohtamimName) ?> (<?= htmlspecialchars($mohtamimPhone) ?>)
            </marquee>
        </div>
    </div>
</header>

<!-- Mobile Sidebar Drawer Overlay Backdrop -->
<div id="mobile-sidebar-overlay" onclick="toggleMobileSidebar()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 hidden md:hidden transition-opacity"></div>

<!-- Mobile Sidebar Drawer -->
<div id="mobile-sidebar-drawer" class="fixed top-0 left-0 bottom-0 w-72 bg-slate-50 z-50 p-4 shadow-2xl overflow-y-auto transform -translate-x-full md:hidden transition-transform duration-300 ease-in-out flex flex-col gap-4">
    <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div class="flex items-center gap-2">
            <img src="logo.png" onerror="this.src='/logo.png'; this.onerror=null;" alt="Logo" class="w-8 h-8 rounded-full border border-sky-600 p-0.5 bg-white">
            <span class="font-bold text-xs text-sky-900"><?= $lang === 'bn' ? 'নেভিগেশন মেনু' : 'Menu Navigation' ?></span>
        </div>
        <button onclick="toggleMobileSidebar()" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-rose-600 flex items-center justify-center shadow-xs">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- Mobile Nav Items -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 space-y-1">
        <a href="index.php?route=dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'dashboard' ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-chart-pie text-sky-500"></i><span><?= $lang === 'bn' ? '০১. ড্যাশবোর্ড' : '01. Dashboard' ?></span>
        </a>
        <a href="index.php?route=category-income" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'category-income' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-layer-group text-emerald-500"></i><span><?= $lang === 'bn' ? '০২. খাতওয়ারী আয়' : '02. Category Income' ?></span>
        </a>
        <a href="index.php?route=category-expense" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'category-expense' ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-receipt text-rose-500"></i><span><?= $lang === 'bn' ? '০৩. খাতওয়ারী ব্যয়' : '03. Category Expense' ?></span>
        </a>
        <a href="index.php?route=daily-income" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'daily-income' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-calendar-days text-blue-500"></i><span><?= $lang === 'bn' ? '০৪. দিনওয়ারী আয়' : '04. Daily Income' ?></span>
        </a>
        <a href="index.php?route=daily-expense" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'daily-expense' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-calendar-check text-amber-500"></i><span><?= $lang === 'bn' ? '০৫. দিনওয়ারী ব্যয়' : '05. Daily Expense' ?></span>
        </a>
        <a href="index.php?route=summary" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold <?= $route === 'summary' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100' ?>">
            <i class="fa-solid fa-file-invoice-dollar text-purple-500"></i><span><?= $lang === 'bn' ? '০৬. Summary (সারসংক্ষেপ)' : '06. Summary' ?></span>
        </a>
        <?php if ($isAdmin): ?>
            <a href="index.php?route=admin-panel" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-900 shadow">
                <i class="fa-solid fa-screwdriver-wrench"></i><span><?= $lang === 'bn' ? '⚙️ অ্যাডমিন প্যানেল' : 'Admin Panel' ?></span>
            </a>
        <?php endif; ?>
    </div>

    <!-- Mobile Drawer Mohtamim Card -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 shadow-sm text-slate-800 space-y-2">
        <div class="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
            <i class="fa-solid fa-user-tie"></i>
            <span><?= $lang === 'bn' ? 'মুহতামিম এর সরাসরি যোগাযোগ' : 'Mohtamim Contact' ?></span>
        </div>
        <div class="font-bold text-sm text-slate-900"><?= htmlspecialchars($mohtamimName) ?></div>
        <a href="tel:<?= htmlspecialchars($mohtamimPhone) ?>" class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm">
            <i class="fa-solid fa-phone"></i><span><?= htmlspecialchars($mohtamimPhone) ?></span>
        </a>
    </div>
</div>

<!-- Main Workspace Layout -->
<div class="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row px-3 sm:px-6 py-5 gap-5">
    <!-- Desktop Left Sidebar (Permanently pinned on desktop, matching Image 1) -->
    <aside class="w-full md:w-64 shrink-0 space-y-4 hidden md:block no-print">
        <!-- Navigation Menu Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-1">
            <div class="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span><?= $lang === 'bn' ? 'নেভিগেশন মেনু' : 'Navigation Menu' ?></span>
                <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">CLEAN URLS</span>
            </div>
            <nav class="space-y-1">
                <a href="index.php?route=dashboard" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'dashboard' ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'dashboard' ? 'bg-white/20 text-white' : 'bg-slate-100 text-sky-700' ?>">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০১. ড্যাশবোর্ড' : '01. Dashboard' ?></span>
                </a>
                <a href="index.php?route=category-income" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'category-income' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'category-income' ? 'bg-white/20 text-white' : 'bg-slate-100 text-emerald-700' ?>">
                        <i class="fa-solid fa-layer-group"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০২. খাতওয়ারী আয়' : '02. Category Income' ?></span>
                </a>
                <a href="index.php?route=category-expense" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'category-expense' ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'category-expense' ? 'bg-white/20 text-white' : 'bg-slate-100 text-rose-700' ?>">
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০৩. খাতওয়ারী ব্যয়' : '03. Category Expense' ?></span>
                </a>
                <a href="index.php?route=daily-income" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'daily-income' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'daily-income' ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-700' ?>">
                        <i class="fa-solid fa-calendar-days"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০৪. দিনওয়ারী আয়' : '04. Daily Income' ?></span>
                </a>
                <a href="index.php?route=daily-expense" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'daily-expense' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'daily-expense' ? 'bg-white/20 text-white' : 'bg-slate-100 text-amber-700' ?>">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০৫. দিনওয়ারী ব্যয়' : '05. Daily Expense' ?></span>
                </a>
                <a href="index.php?route=summary" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $route === 'summary' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-600/20 translate-x-1' : 'text-slate-700 hover:bg-slate-100' ?>">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 <?= $route === 'summary' ? 'bg-white/20 text-white' : 'bg-slate-100 text-purple-700' ?>">
                        <i class="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <span class="flex-1 truncate"><?= $lang === 'bn' ? '০৬. Summary (সারসংক্ষেপ)' : '06. Summary' ?></span>
                </a>
                <?php if ($isAdmin): ?>
                    <div class="pt-2 border-t border-slate-100 mt-2">
                        <a href="index.php?route=admin-panel" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all <?= $route === 'admin-panel' ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-amber-800 bg-amber-50 hover:bg-amber-100/70' ?>">
                            <div class="w-7 h-7 rounded-lg bg-amber-200/60 flex items-center justify-center text-xs text-amber-900 shrink-0">
                                <i class="fa-solid fa-gear"></i>
                            </div>
                            <span class="flex-1"><?= $lang === 'bn' ? '⚙️ অ্যাডমিন প্যানেল' : 'Admin Panel' ?></span>
                        </a>
                    </div>
                <?php endif; ?>
            </nav>
        </div>

        <!-- Dark Madrasa Info Card (Image 1 Style) -->
        <div class="p-4 bg-slate-900 text-white rounded-2xl shadow-sm text-xs space-y-2.5">
            <div class="font-bold text-amber-300 flex items-center gap-1.5">
                <i class="fa-solid fa-mosque"></i>
                <span><?= $lang === 'bn' ? 'মাদ্রাসা পরিচিতি' : 'Madrasa About' ?></span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
                <?= $lang === 'bn' ? 'উত্তর দেশীবাই ফয়জুল উলুম ক্বওমী হাফেজিয়া মাদ্রাসা ও এতিমখানা। দ্বীনি শিক্ষা বিস্তার ও ইয়াতীম ছাত্রদের লালন-পালনে প্রতিষ্ঠিত।' : 'Uttar Deshibai Fayzul Uloom Qaumi Hafezia Madrasa & Orphanage.' ?>
            </p>
            <div class="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-location-dot text-sky-400"></i>
                    <span>উত্তর দেশীবাই, কাঁঠালী, জলঢাকা, নীলফামারী</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-award text-amber-400"></i>
                    <span>স্থাপিতঃ ১৯৭১ খ্রিষ্টাব্দ / ১৩৭১ বঙ্গাব্দ | রেজি নং: রংপুর-৬৪২/৮৬</span>
                </div>
            </div>
        </div>

        <!-- Mohtamim Contact Card (Bengali Prominent, from Image 1) -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 shadow-sm text-slate-800 space-y-2">
            <div class="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                <i class="fa-solid fa-user-tie"></i>
                <span><?= $lang === 'bn' ? 'মুহতামিম এর সরাসরি যোগাযোগ' : 'Direct Contact with Mohtamim' ?></span>
            </div>
            <div class="font-bold text-sm text-slate-900"><?= htmlspecialchars($mohtamimName) ?></div>
            <a href="tel:<?= htmlspecialchars($mohtamimPhone) ?>" class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all font-mono">
                <i class="fa-solid fa-phone"></i>
                <span><?= htmlspecialchars($mohtamimPhone) ?></span>
            </a>
            <div class="text-[10px] text-slate-500">
                <?= $lang === 'bn' ? 'যেকোনো অনুদান, পরামর্শ বা মাদ্রাসার তথ্যের জন্য সরাসরি যোগাযোগ করুন।' : 'Contact directly for any donations or information.' ?>
            </div>
        </div>
    </aside>

    <!-- Main Viewport Content -->
    <main class="flex-1 min-w-0 space-y-5">
        <?php if ($route === 'dashboard'): ?>
            <!-- 3 Top Stats Cards (Photo 3 Style: ৳ ১০৮,৩০০.০০ | ৳ ৮০,৮২০.০০ | ৳ ২৭,৪৮০.০০) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Total Income -->
                <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div class="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0"></div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                <?= $lang === 'bn' ? 'সর্বমোট আয় (ক্রেডিট)' : 'Total Income (Credit)' ?>
                            </p>
                            <h3 class="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
                                ৳ <?= numFmt($totalIncome, $lang) ?>
                            </h3>
                            <p class="text-[11px] text-emerald-600 mt-1 font-medium">
                                <?= $lang === 'bn' ? 'মোট '.toBnNum(count($incomeList)).' টি জমা এন্ট্রি' : count($incomeList).' Total Income Entries' ?>
                            </p>
                        </div>
                        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
                            <i class="fa-solid fa-arrow-down-left"></i>
                        </div>
                    </div>
                </div>

                <!-- Total Expense -->
                <div class="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div class="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0"></div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                                <?= $lang === 'bn' ? 'সর্বমোট ব্যয় (ডেবিট)' : 'Total Expense (Debit)' ?>
                            </p>
                            <h3 class="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-1 font-mono">
                                ৳ <?= numFmt($totalExpense, $lang) ?>
                            </h3>
                            <p class="text-[11px] text-rose-600 mt-1 font-medium">
                                <?= $lang === 'bn' ? 'মোট '.toBnNum(count($expenseList)).' টি খরচ এন্ট্রি' : count($expenseList).' Total Expense Entries' ?>
                            </p>
                        </div>
                        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner">
                            <i class="fa-solid fa-arrow-up-right"></i>
                        </div>
                    </div>
                </div>

                <!-- Net Balance -->
                <div class="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div class="absolute right-0 top-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0"></div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                                <?= $lang === 'bn' ? 'বর্তমান নিট স্থিতি / হাতে নগদ' : 'Net Balance / Surplus' ?>
                            </p>
                            <h3 class="text-2xl sm:text-3xl font-extrabold text-sky-950 mt-1 font-mono">
                                ৳ <?= numFmt($netBalance, $lang) ?>
                            </h3>
                            <p class="text-[11px] text-sky-600 mt-1 font-medium">
                                <?= $lang === 'bn' ? 'বর্তমান তহবিল স্থিতি (সারপ্লাস)' : 'Current Fund Surplus' ?>
                            </p>
                        </div>
                        <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl shadow-inner">
                            <i class="fa-solid fa-vault"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 6 Interactive Navigation Cards (Photo 3 Style with Top-Right Pill Badge & Link Icon) -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-sky-600"></i>
                        <span><?= $lang === 'bn' ? 'প্রধান মডিউল ও হিসাব বিবরণী' : 'Main Modules & Statements' ?></span>
                    </h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Module 01 -->
                    <a href="index.php?route=dashboard" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-700 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-gauge-high"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০১' : 'Module 01' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                                <?= $lang === 'bn' ? '০১. ড্যাশবোর্ড' : '01. Dashboard' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-sky-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>

                    <!-- Module 02 -->
                    <a href="index.php?route=category-income" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০২' : 'Module 02' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                <?= $lang === 'bn' ? '০২. খাতওয়ারী আয়' : '02. Category Income' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>

                    <!-- Module 03 -->
                    <a href="index.php?route=category-expense" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-700 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০৩' : 'Module 03' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-rose-50 text-slate-400 group-hover:text-rose-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                                <?= $lang === 'bn' ? '০৩. খাতওয়ারী ব্যয়' : '03. Category Expense' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-rose-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>

                    <!-- Module 04 -->
                    <a href="index.php?route=daily-income" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-700 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-calendar-days"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০৪' : 'Module 04' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                <?= $lang === 'bn' ? '০৪. দিনওয়ারী আয়' : '04. Daily Income' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>

                    <!-- Module 05 -->
                    <a href="index.php?route=daily-expense" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-calendar-check"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০৫' : 'Module 05' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-amber-50 text-slate-400 group-hover:text-amber-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                                <?= $lang === 'bn' ? '০৫. দিনওয়ারী ব্যয়' : '05. Daily Expense' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>

                    <!-- Module 06 -->
                    <a href="index.php?route=summary" class="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col justify-between">
                        <div class="flex items-center justify-between w-full mb-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-800 text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-file-invoice-dollar"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors border border-slate-200/60">
                                    <?= $lang === 'bn' ? 'মডিউল ০৬' : 'Module 06' ?>
                                </span>
                                <div class="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-purple-50 text-slate-400 group-hover:text-purple-600 flex items-center justify-center text-xs transition-colors border border-slate-200/40">
                                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                                <?= $lang === 'bn' ? '০৬. Summary (সারসংক্ষেপ)' : '06. Summary & Audit' ?>
                            </h3>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
                                <span><?= $lang === 'bn' ? 'বিস্তারিত প্রতিবেদন দেখুন' : 'View Detailed Report' ?></span>
                                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </p>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Recent Ledger Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-book-journal-whills text-sky-700"></i>
                        <span><?= $lang === 'bn' ? 'সর্বশেষ লেনদেন খতিয়ান' : 'Recent Transactions Ledger' ?></span>
                    </h3>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span><?= $lang === 'bn' ? 'প্রিন্ট' : 'Print' ?></span>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-100 text-slate-700">
                            <tr>
                                <th class="p-2.5 font-bold">তারিখ</th>
                                <th class="p-2.5 font-bold">ধরন</th>
                                <th class="p-2.5 font-bold">খাত / উৎস</th>
                                <th class="p-2.5 font-bold">বিবরণ ও দাতার নাম</th>
                                <th class="p-2.5 text-right font-bold">পরিমাণ (৳)</th>
                                <th class="p-2.5 font-bold text-center">মাধ্যম</th>
                                <th class="p-2.5 text-center font-bold">ভাউচার</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach (array_slice($transactions, 0, 10) as $r): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="p-2.5 font-mono text-slate-600"><?= htmlspecialchars($r['date']) ?></td>
                                <td class="p-2.5">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $r['type'] === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800' ?>">
                                        <?= $r['type'] === 'income' ? ($lang === 'bn' ? 'আয়' : 'Income') : ($lang === 'bn' ? 'ব্যয়' : 'Expense') ?>
                                    </span>
                                </td>
                                <td class="p-2.5 font-medium text-slate-700">
                                    <span class="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                                        <?= htmlspecialchars(getCatName($r['category_id'], $categories, $lang)) ?>
                                    </span>
                                </td>
                                <td class="p-2.5 font-medium text-slate-800"><?= htmlspecialchars($r['title_bn']) ?></td>
                                <td class="p-2.5 text-right font-mono font-bold <?= $r['type'] === 'income' ? 'text-emerald-700' : 'text-rose-700' ?>">
                                    <?= $r['type'] === 'income' ? '+' : '-' ?><?= numFmt($r['amount'], $lang) ?> ৳
                                </td>
                                <td class="p-2.5 text-center text-slate-600"><?= htmlspecialchars($r['payment_method']) ?></td>
                                <td class="p-2.5 text-center">
                                    <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 inline-flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all text-xs" title="ভাউচার রশিদ দেখুন">
                                        <i class="fa-solid fa-eye"></i>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($route === 'category-income'): ?>
            <!-- Category Income Page -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
                <div class="flex justify-between items-center border-b pb-3">
                    <div>
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-layer-group text-emerald-600"></i>
                            <span><?= $lang === 'bn' ? 'খাতওয়ারী আয়ের বিবরণী' : 'Category-wise Income Statement' ?></span>
                        </h2>
                        <p class="text-xs text-slate-500">চাঁদা, লিল্লাহ ফান্ড ও অনুদানের খাতভিত্তিক পূর্ণাঙ্গ খতিয়ান</p>
                    </div>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট</span>
                    </button>
                </div>
                <!-- Category Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <?php
                    $incomeCats = array_filter($categories, function($c) { return $c['type'] === 'income'; });
                    foreach ($incomeCats as $cat):
                        $catTxs = array_filter($incomeList, function($t) use ($cat) { return $t['category_id'] == $cat['id']; });
                        $catSum = array_sum(array_column($catTxs, 'amount'));
                        $catPct = $totalIncome > 0 ? ($catSum / $totalIncome) * 100 : 0;
                    ?>
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-xs text-slate-800"><?= htmlspecialchars($lang === 'bn' ? $cat['name_bn'] : $cat['name_en']) ?></span>
                            <span class="text-xs font-mono font-bold text-emerald-700">৳ <?= numFmt($catSum, $lang) ?></span>
                        </div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div class="bg-emerald-600 h-full rounded-full" style="width: <?= min(100, $catPct) ?>%"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span><?= toBnNum(count($catTxs)) ?> টি এন্ট্রি</span>
                            <span><?= round($catPct, 1) ?>%</span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <!-- Transactions Table -->
                <div class="overflow-x-auto pt-2">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-100 text-slate-700">
                            <tr>
                                <th class="p-2.5 font-bold">তারিখ</th>
                                <th class="p-2.5 font-bold">খাত</th>
                                <th class="p-2.5 font-bold">বিবরণ / দাতার নাম</th>
                                <th class="p-2.5 font-bold">মাধ্যম</th>
                                <th class="p-2.5 text-right font-bold">টাকার পরিমাণ (৳)</th>
                                <th class="p-2.5 text-center font-bold">রশিদ</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($incomeList as $r): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="p-2.5 font-mono text-slate-600"><?= htmlspecialchars($r['date']) ?></td>
                                <td class="p-2.5 font-medium text-emerald-800"><?= htmlspecialchars(getCatName($r['category_id'], $categories, $lang)) ?></td>
                                <td class="p-2.5 font-medium text-slate-800"><?= htmlspecialchars($r['title_bn']) ?></td>
                                <td class="p-2.5 text-slate-600"><?= htmlspecialchars($r['payment_method']) ?></td>
                                <td class="p-2.5 text-right font-mono font-bold text-emerald-700">+<?= numFmt($r['amount'], $lang) ?> ৳</td>
                                <td class="p-2.5 text-center">
                                    <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="text-sky-600 hover:text-sky-800"><i class="fa-solid fa-eye"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($route === 'category-expense'): ?>
            <!-- Category Expense Page -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
                <div class="flex justify-between items-center border-b pb-3">
                    <div>
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-receipt text-rose-600"></i>
                            <span><?= $lang === 'bn' ? 'খাতওয়ারী ব্যয়ের বিবরণী' : 'Category-wise Expense Statement' ?></span>
                        </h2>
                        <p class="text-xs text-slate-500">বেতন, মেস খাবার ও প্রাতিষ্ঠানিক পরিচালনা ব্যয়ের খতিয়ান</p>
                    </div>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট</span>
                    </button>
                </div>
                <!-- Category Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <?php
                    $expenseCats = array_filter($categories, function($c) { return $c['type'] === 'expense'; });
                    foreach ($expenseCats as $cat):
                        $catTxs = array_filter($expenseList, function($t) use ($cat) { return $t['category_id'] == $cat['id']; });
                        $catSum = array_sum(array_column($catTxs, 'amount'));
                        $catPct = $totalExpense > 0 ? ($catSum / $totalExpense) * 100 : 0;
                    ?>
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-xs text-slate-800"><?= htmlspecialchars($lang === 'bn' ? $cat['name_bn'] : $cat['name_en']) ?></span>
                            <span class="text-xs font-mono font-bold text-rose-700">৳ <?= numFmt($catSum, $lang) ?></span>
                        </div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div class="bg-rose-600 h-full rounded-full" style="width: <?= min(100, $catPct) ?>%"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span><?= toBnNum(count($catTxs)) ?> টি ভাউচার</span>
                            <span><?= round($catPct, 1) ?>%</span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <!-- Expense Table -->
                <div class="overflow-x-auto pt-2">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-100 text-slate-700">
                            <tr>
                                <th class="p-2.5 font-bold">তারিখ</th>
                                <th class="p-2.5 font-bold">খাত</th>
                                <th class="p-2.5 font-bold">বিবরণ / খরচকারী</th>
                                <th class="p-2.5 font-bold">ভাউচার নং</th>
                                <th class="p-2.5 text-right font-bold">টাকার পরিমাণ (৳)</th>
                                <th class="p-2.5 text-center font-bold">ভাউচার</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($expenseList as $r): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="p-2.5 font-mono text-slate-600"><?= htmlspecialchars($r['date']) ?></td>
                                <td class="p-2.5 font-medium text-rose-800"><?= htmlspecialchars(getCatName($r['category_id'], $categories, $lang)) ?></td>
                                <td class="p-2.5 font-medium text-slate-800"><?= htmlspecialchars($r['title_bn']) ?></td>
                                <td class="p-2.5 font-mono text-slate-500"><?= htmlspecialchars($r['voucher_no']) ?></td>
                                <td class="p-2.5 text-right font-mono font-bold text-rose-700">-<?= numFmt($r['amount'], $lang) ?> ৳</td>
                                <td class="p-2.5 text-center">
                                    <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="text-sky-600 hover:text-sky-800"><i class="fa-solid fa-eye"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($route === 'daily-income'): ?>
            <!-- Daily Income Breakdown -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-calendar-days text-blue-600"></i>
                        <span><?= $lang === 'bn' ? 'দিনওয়ারী দৈনিক জমা রিপোর্ট' : 'Daily Income Report' ?></span>
                    </h2>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট</span>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-100 text-slate-700">
                            <tr>
                                <th class="p-2.5 font-bold">তারিখ</th>
                                <th class="p-2.5 font-bold">বিবরণ ও দাতার নাম</th>
                                <th class="p-2.5 font-bold">হিসাবের খাত</th>
                                <th class="p-2.5 text-right font-bold">পরিমাণ (৳)</th>
                                <th class="p-2.5 text-center font-bold">রশিদ</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($incomeList as $r): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="p-2.5 font-mono text-slate-600 font-bold"><?= htmlspecialchars($r['date']) ?></td>
                                <td class="p-2.5 text-slate-800 font-medium"><?= htmlspecialchars($r['title_bn']) ?></td>
                                <td class="p-2.5 text-slate-600"><?= htmlspecialchars(getCatName($r['category_id'], $categories, $lang)) ?></td>
                                <td class="p-2.5 text-right font-mono font-bold text-emerald-700">+<?= numFmt($r['amount'], $lang) ?> ৳</td>
                                <td class="p-2.5 text-center">
                                    <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="text-sky-600 hover:text-sky-800"><i class="fa-solid fa-eye"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($route === 'daily-expense'): ?>
            <!-- Daily Expense Breakdown -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-calendar-check text-amber-600"></i>
                        <span><?= $lang === 'bn' ? 'দিনওয়ারী দৈনিক খরচ রিপোর্ট' : 'Daily Expense Report' ?></span>
                    </h2>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট</span>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-slate-100 text-slate-700">
                            <tr>
                                <th class="p-2.5 font-bold">তারিখ</th>
                                <th class="p-2.5 font-bold">বিবরণ / খরচ খাত</th>
                                <th class="p-2.5 font-bold">ভাউচার নং</th>
                                <th class="p-2.5 text-right font-bold">পরিমাণ (৳)</th>
                                <th class="p-2.5 text-center font-bold">ভাউচার</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($expenseList as $r): ?>
                            <tr class="hover:bg-slate-50">
                                <td class="p-2.5 font-mono text-slate-600 font-bold"><?= htmlspecialchars($r['date']) ?></td>
                                <td class="p-2.5 text-slate-800 font-medium"><?= htmlspecialchars($r['title_bn']) ?></td>
                                <td class="p-2.5 font-mono text-slate-500"><?= htmlspecialchars($r['voucher_no']) ?></td>
                                <td class="p-2.5 text-right font-mono font-bold text-rose-700">-<?= numFmt($r['amount'], $lang) ?> ৳</td>
                                <td class="p-2.5 text-center">
                                    <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="text-sky-600 hover:text-sky-800"><i class="fa-solid fa-eye"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($route === 'summary'): ?>
            <!-- Summary Audit View -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-6">
                <div class="flex justify-between items-center border-b pb-3">
                    <div>
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-file-invoice-dollar text-purple-600"></i>
                            <span><?= $lang === 'bn' ? 'সারসংক্ষেপ ও অডিট খতিয়ান' : 'Summary & Audit Sheet' ?></span>
                        </h2>
                        <p class="text-xs text-slate-500">চলতি হিসাব ও সার্বিক আর্থিক স্থিতির প্রতিবেদন</p>
                    </div>
                    <button onclick="window.print()" class="btn-shine px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1">
                        <i class="fa-solid fa-print"></i><span>প্রিন্ট</span>
                    </button>
                </div>
                <!-- Breakdown Table -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <div class="text-xs text-emerald-800 font-bold">মোট আদায়কৃত অনুদান</div>
                        <div class="text-2xl font-mono font-extrabold text-emerald-900 mt-1">৳ <?= numFmt($totalIncome, $lang) ?></div>
                    </div>
                    <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                        <div class="text-xs text-rose-800 font-bold">মোট পরিশোধিত ব্যয়</div>
                        <div class="text-2xl font-mono font-extrabold text-rose-900 mt-1">৳ <?= numFmt($totalExpense, $lang) ?></div>
                    </div>
                    <div class="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-center">
                        <div class="text-xs text-sky-800 font-bold">বর্তমানে ব্যাংকে ও হাতে নগদ</div>
                        <div class="text-2xl font-mono font-extrabold text-sky-950 mt-1">৳ <?= numFmt($netBalance, $lang) ?></div>
                    </div>
                </div>
            </div>

        <?php elseif ($route === 'admin-login'): ?>
            <!-- Admin Login Form (Photo 5 Style: Phone + Pass + Quick Fill) -->
            <div class="max-w-md mx-auto my-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <div class="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h2 class="text-lg font-extrabold text-center text-slate-900">অ্যাডমিন সিকিউরিটি লগইন</h2>
                <p class="text-center text-xs text-slate-500 mb-5">ফয়জুল উলুম হাফেজিয়া মাদ্রাসা প্রশাসন</p>
                <?php if (!empty($loginError)): ?>
                    <div class="p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded-xl mb-4 font-semibold">
                        <i class="fa-solid fa-circle-exclamation mr-1"></i><?= htmlspecialchars($loginError) ?>
                    </div>
                <?php endif; ?>
                <form method="POST" action="index.php?route=admin-login" class="space-y-4 text-xs">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">অ্যাডমিন ফোন নম্বর:</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                            <input type="text" id="login_phone" name="phone" placeholder="01832693837" required class="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">সিক্রেট পাসওয়ার্ড:</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <i class="fa-solid fa-key"></i>
                            </span>
                            <input type="password" id="login_pass" name="password" placeholder="••••••••" required class="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none">
                        </div>
                    </div>
                    <!-- Quick Autofill Button (As circled in Photo 5) -->
                    <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div class="text-[11px] text-amber-800 font-mono">
                            <i class="fa-solid fa-key mr-1"></i>ফোন: 01832693837 | পাস: 524434
                        </div>
                        <button type="button" onclick="document.getElementById('login_phone').value='01832693837'; document.getElementById('login_pass').value='524434';" class="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-[10px] font-bold shadow-xs">
                            অটো পূরণ
                        </button>
                    </div>
                    <button type="submit" name="admin_login_submit" class="btn-shine w-full py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
                        <i class="fa-solid fa-right-to-bracket"></i><span>লগইন করুন</span>
                    </button>
                </form>
            </div>

        <?php elseif ($route === 'admin-panel' && $isAdmin): ?>
            <!-- Admin Panel with Full Edit, Delete, View Voucher, and Image Upload -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-6">
                <!-- Header with Download Options -->
                <div class="flex flex-wrap justify-between items-center border-b pb-4 gap-3">
                    <div>
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-screwdriver-wrench text-amber-600"></i>
                            <span>অ্যাডমিন হিসাব কন্ট্রোল ও পূর্ণ ব্যবস্থাপনা প্যানেল</span>
                        </h2>
                        <p class="text-xs text-slate-500 mt-0.5">মুহতামিম: <?= htmlspecialchars($mohtamimName) ?> (<?= htmlspecialchars($mohtamimPhone) ?>)</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <a href="index.php?action=download_php" class="btn-shine px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                            <i class="fa-solid fa-file-code"></i><span>Download index.php</span>
                        </a>
                        <a href="index.php?action=download_full_zip" class="btn-shine px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                            <i class="fa-solid fa-file-zipper text-yellow-300"></i><span>Download Full PHP Source (.ZIP)</span>
                        </a>
                    </div>
                </div>

                <?php if (isset($_GET['msg']) && $_GET['msg'] === 'deleted'): ?>
                    <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-rose-600"></i> লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে!
                    </div>
                <?php elseif (isset($_GET['msg']) && $_GET['msg'] === 'added'): ?>
                    <div class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i> নতুন লেনদেন সফলভাবে সংরক্ষণ করা হয়েছে!
                    </div>
                <?php endif; ?>

                <!-- Add Transaction Form with Voucher Image Upload -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h3 class="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5">
                        <i class="fa-solid fa-plus-circle text-sky-600"></i>
                        <span>নতুন লেনদেন / ভাউচার এন্ট্রি ফরম:</span>
                    </h3>
                    <form method="POST" action="index.php?route=admin-panel" enctype="multipart/form-data" class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">লেনদেনের ধরন:</label>
                            <select name="type" class="w-full border border-slate-300 p-2 rounded-xl bg-white font-bold">
                                <option value="income">আয় (Income)</option>
                                <option value="expense">ব্যয় (Expense)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">তারিখ:</label>
                            <input type="date" name="date" value="<?= date('Y-m-d') ?>" class="w-full border border-slate-300 p-2 rounded-xl bg-white font-mono">
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">হিসাবের খাত:</label>
                            <select name="category_id" class="w-full border border-slate-300 p-2 rounded-xl bg-white">
                                <?php foreach ($categories as $cat): ?>
                                    <option value="<?= $cat['id'] ?>"><?= htmlspecialchars($cat['name_bn']) ?> (<?= $cat['type'] === 'income' ? 'আয়' : 'ব্যয়' ?>)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">টাকার পরিমাণ (৳):</label>
                            <input type="number" step="0.01" name="amount" placeholder="৫০০০" required class="w-full border border-slate-300 p-2 rounded-xl bg-white font-mono font-bold text-slate-800">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-slate-600 font-bold mb-1">বিবরণ / দাতার নাম / খাতের বর্ণনা:</label>
                            <input type="text" name="title_bn" placeholder="যেমন: হাফেজ মোশাররফ হোসেন (মাসিক চাঁদা)" required class="w-full border border-slate-300 p-2 rounded-xl bg-white">
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">পেমেন্ট মাধ্যম:</label>
                            <select name="payment_method" class="w-full border border-slate-300 p-2 rounded-xl bg-white">
                                <option value="ক্যাশ">ক্যাশ</option>
                                <option value="বিকাশ">বিকাশ</option>
                                <option value="নগদ">নগদ</option>
                                <option value="ব্যাংক">ব্যাংক</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1">ভাউচার / রশিদ নং:</label>
                            <input type="text" name="voucher_no" value="V-<?= rand(1000, 9999) ?>" class="w-full border border-slate-300 p-2 rounded-xl bg-white font-mono">
                        </div>
                        <div class="md:col-span-3">
                            <label class="block text-slate-600 font-bold mb-1">ভাউচার / রসিদের ছবি আপলোড (ঐচ্ছিক):</label>
                            <input type="file" name="voucher_image_file" accept="image/*" class="w-full border border-slate-300 p-1.5 bg-white rounded-xl text-xs">
                        </div>
                        <div class="flex items-end">
                            <button type="submit" name="add_transaction" class="btn-shine w-full py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-check"></i><span>সংরক্ষণ করুন</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Transaction Management Table (Photo 6 Style with Eye & Trash Icons) -->
                <div>
                    <h3 class="font-bold text-xs text-slate-700 mb-2">লেনদেন তালিকা (মুছে ফেলা ও রসিদ দেখার ব্যবস্থা):</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-100 text-slate-700">
                                <tr>
                                    <th class="p-2.5 font-bold">তারিখ</th>
                                    <th class="p-2.5 font-bold">ধরন</th>
                                    <th class="p-2.5 font-bold">খাত</th>
                                    <th class="p-2.5 font-bold">বিবরণ</th>
                                    <th class="p-2.5 font-bold">মাধ্যম</th>
                                    <th class="p-2.5 text-right font-bold">পরিমাণ (৳)</th>
                                    <th class="p-2.5 text-center font-bold">বিল/ছবি</th>
                                    <th class="p-2.5 text-center font-bold">কার্যক্রম</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <?php foreach ($transactions as $r): ?>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2.5 font-mono text-slate-600"><?= htmlspecialchars($r['date']) ?></td>
                                    <td class="p-2.5">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $r['type'] === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800' ?>">
                                            <?= $r['type'] === 'income' ? 'আয়' : 'ব্যয়' ?>
                                        </span>
                                    </td>
                                    <td class="p-2.5 text-slate-700"><?= htmlspecialchars(getCatName($r['category_id'], $categories, $lang)) ?></td>
                                    <td class="p-2.5 font-medium text-slate-800"><?= htmlspecialchars($r['title_bn']) ?></td>
                                    <td class="p-2.5 text-slate-600"><?= htmlspecialchars($r['payment_method']) ?></td>
                                    <td class="p-2.5 text-right font-mono font-bold <?= $r['type'] === 'income' ? 'text-emerald-700' : 'text-rose-700' ?>">
                                        <?= $r['type'] === 'income' ? '+' : '-' ?><?= numFmt($r['amount'], $lang) ?> ৳
                                    </td>
                                    <td class="p-2.5 text-center">
                                        <?php if (!empty($r['voucher_image'])): ?>
                                            <a href="<?= htmlspecialchars($r['voucher_image']) ?>" target="_blank" class="text-sky-600 hover:text-sky-800 text-xs font-bold" title="ছবি দেখুন">
                                                <i class="fa-solid fa-image"></i>
                                            </a>
                                        <?php else: ?>
                                            <span class="text-slate-300">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="p-2.5 text-center">
                                        <div class="flex items-center justify-center gap-1.5">
                                            <!-- View Voucher (Eye Icon) -->
                                            <a href="index.php?route=voucher&id=<?= $r['id'] ?>" class="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all" title="রশিদ দেখুন">
                                                <i class="fa-solid fa-eye text-xs"></i>
                                            </a>
                                            <!-- Delete Button (Trash Icon as Circled in Photo 6) -->
                                            <a href="index.php?action=delete_tx&id=<?= $r['id'] ?>" onclick="return confirm('আপনি কি নিশ্চিত যে এই লেনদেনটি সম্পূর্ণ মুছে ফেলতে চান?');" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all" title="মুছুন">
                                                <i class="fa-solid fa-trash-can text-xs"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        <?php elseif ($route === 'voucher'): ?>
            <!-- Official Money Receipt Voucher (Photo 7 Style with Print Slip) -->
            <?php
            $vId = intval($_GET['id'] ?? 0);
            $txItem = null;
            foreach ($transactions as $t) {
                if (intval($t['id']) === $vId) {
                    $txItem = $t;
                    break;
                }
            }
            if (!$txItem) $txItem = $transactions[0] ?? null;
            ?>
            <div class="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-sky-800 printable-area relative overflow-hidden">
                <div class="text-center font-bold text-sky-800 mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <!-- Header -->
                <div class="flex items-center justify-between border-b-2 border-sky-800 pb-4 mb-4 gap-3">
                    <img src="logo.png" onerror="this.src='/logo.png'; this.onerror=null;" alt="Logo" class="w-16 h-16 rounded-full border-2 border-sky-800 p-0.5">
                    <div class="text-center flex-1">
                        <h2 class="text-base sm:text-xl font-extrabold text-sky-900"><?= $madrasaNameBn ?></h2>
                        <div class="text-xs text-slate-600"><?= $madrasaSubtitleBn ?></div>
                        <div class="text-[10px] text-sky-700 font-semibold"><?= $madrasaMetaBn ?></div>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="px-3 py-1 rounded-full text-xs font-bold <?= $txItem['type'] === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800' ?>">
                            <?= $txItem['type'] === 'income' ? 'আদায় রশিদ' : 'খরচ ভাউচার' ?>
                        </span>
                        <div class="text-[11px] font-mono text-slate-500 mt-1">#<?= htmlspecialchars($txItem['voucher_no']) ?></div>
                    </div>
                </div>

                <!-- Info Table -->
                <table class="w-full text-xs mb-6 border-collapse">
                    <tr class="border-b border-slate-100">
                        <td class="py-2 text-slate-500 font-bold w-1/4">তারিখ:</td>
                        <td class="py-2 font-mono font-bold text-slate-800"><?= htmlspecialchars($txItem['date']) ?></td>
                        <td class="py-2 text-slate-500 font-bold w-1/4">পেমেন্ট মাধ্যম:</td>
                        <td class="py-2 font-bold text-slate-800"><?= htmlspecialchars($txItem['payment_method']) ?></td>
                    </tr>
                    <tr class="border-b border-slate-100">
                        <td class="py-2 text-slate-500 font-bold"><?= $txItem['type'] === 'income' ? 'দাতার নাম / উৎস:' : 'প্রাপকের নাম / খাত:' ?></td>
                        <td colspan="3" class="py-2 font-bold text-sm text-slate-900"><?= htmlspecialchars($txItem['title_bn']) ?></td>
                    </tr>
                    <tr class="border-b border-slate-100">
                        <td class="py-2 text-slate-500 font-bold">হিসাবের খাত:</td>
                        <td colspan="3" class="py-2 font-medium text-slate-700"><?= htmlspecialchars(getCatName($txItem['category_id'], $categories, $lang)) ?></td>
                    </tr>
                    <tr class="border-b border-slate-100 bg-slate-50">
                        <td class="py-3 px-2 text-slate-700 font-bold">টাকার পরিমাণ:</td>
                        <td colspan="3" class="py-3 px-2 font-mono font-extrabold text-lg sm:text-xl <?= $txItem['type'] === 'income' ? 'text-emerald-700' : 'text-rose-700' ?>">
                            ৳ <?= numFmt($txItem['amount'], $lang) ?> (<?= toBnNum($txItem['amount']) ?> টাকা মাত্র)
                        </td>
                    </tr>
                    <?php if (!empty($txItem['remarks'])): ?>
                    <tr class="border-b border-slate-100">
                        <td class="py-2 text-slate-500 font-bold">মন্তব্য:</td>
                        <td colspan="3" class="py-2 text-slate-600"><?= htmlspecialchars($txItem['remarks']) ?></td>
                    </tr>
                    <?php endif; ?>
                </table>

                <?php if (!empty($txItem['voucher_image'])): ?>
                <div class="mb-6 p-2 border border-slate-200 rounded-xl bg-slate-50 text-center">
                    <p class="text-[11px] font-bold text-slate-600 mb-2">সংযুক্ত বিল / ভাউচার কপি:</p>
                    <img src="<?= htmlspecialchars($txItem['voucher_image']) ?>" alt="Voucher Bill" class="max-h-64 mx-auto rounded-lg shadow-sm">
                </div>
                <?php endif; ?>

                <!-- Signatures -->
                <div class="flex justify-between items-end pt-8 mt-6 border-t border-dashed border-slate-300 text-center text-xs">
                    <div>
                        <div class="w-36 border-t border-slate-600 pt-1 font-bold text-slate-800">আদায়কারী / ক্যাশিয়ার</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">ফয়জুল উলুম হাফেজিয়া মাদ্রাসা</div>
                    </div>
                    <div>
                        <div class="w-44 border-t border-slate-600 pt-1 font-bold text-slate-800"><?= htmlspecialchars($mohtamimName) ?></div>
                        <div class="text-[10px] text-sky-800 font-bold mt-0.5">মুহতামিম ও সভাপতি (<?= htmlspecialchars($mohtamimPhone) ?>)</div>
                    </div>
                </div>

                <!-- Print & Back Buttons -->
                <div class="mt-8 flex justify-center gap-3 no-print">
                    <button onclick="window.print()" class="btn-shine px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <i class="fa-solid fa-print"></i><span>রশিদ প্রিন্ট করুন</span>
                    </button>
                    <a href="index.php?route=dashboard" class="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-sm">
                        ফিরে যান
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </main>
</div>

<!-- Footer Area with Mohtamim Contact at Bottom Corner (Bengali Prominent) -->
<footer class="bg-slate-900 text-slate-300 text-xs mt-auto py-6 border-t border-slate-800 no-print">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <div class="font-bold text-white text-sm"><?= $madrasaNameBn ?></div>
            <div class="text-[11px] text-slate-400 mt-0.5"><?= $madrasaSubtitleBn ?> | <?= $madrasaMetaBn ?></div>
        </div>
        <!-- Bottom Right Corner: Mohtamim Mostofa Kamal -->
        <div class="text-center md:text-right">
            <div class="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 inline-block shadow-sm">
                <div class="text-amber-300 font-bold text-xs">মুহতামিম: <?= htmlspecialchars($mohtamimName) ?> (Mostofa kamal)</div>
                <div class="text-[11px] text-emerald-400 font-mono mt-0.5">
                    মোবাইল: <a href="tel:<?= htmlspecialchars($mohtamimPhone) ?>" class="hover:underline"><?= htmlspecialchars($mohtamimPhone) ?></a>
                </div>
            </div>
            <div class="text-slate-500 text-[10px] mt-1">© ২০২৪-২০২৬ ফয়জুল উলুম হাফেজিয়া মাদ্রাসা | সর্বস্বত্ব সংরক্ষিত।</div>
        </div>
    </div>
</footer>

<!-- Mobile Sidebar Drawer Toggle Script -->
<script>
function toggleMobileSidebar() {
    var drawer = document.getElementById('mobile-sidebar-drawer');
    var overlay = document.getElementById('mobile-sidebar-overlay');
    if (drawer.classList.contains('-translate-x-full')) {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}
</script>
</body>
</html>
