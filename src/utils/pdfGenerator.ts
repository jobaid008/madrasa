import { MadrasaInfo, Transaction, Language } from '../types';
import { formatCurrency, formatDate, toBengaliNumber } from '../translations';

export function printVoucher(tx: Transaction, madrasa: MadrasaInfo, lang: Language) {
  const isIncome = tx.type === 'income';
  const title = isIncome
    ? (lang === 'bn' ? 'আদায় মানি রসিদ (Money Receipt)' : 'Official Collection Receipt')
    : (lang === 'bn' ? 'ব্যয় ভাউচার (Payment Voucher)' : 'Official Expense Voucher');

  const printWindow = window.open('', '_blank', 'width=850,height=750');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${title} - ${tx.voucherNo || tx.sl}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Hind Siliguri', Arial, sans-serif;
          margin: 0;
          padding: 24px;
          color: #1e293b;
          background: #f8fafc;
        }
        .action-bar {
          background: #064e3b;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .action-btn {
          background: #fbbf24;
          color: #0f172a;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        .voucher-box {
          border: 2px solid ${isIncome ? '#047857' : '#b91c1c'};
          border-radius: 12px;
          padding: 28px;
          background: #fff;
          max-width: 750px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .arabic-bismillah {
          font-size: 14px;
          font-weight: bold;
          color: #064e3b;
          margin-bottom: 4px;
        }
        .madrasa-name {
          font-size: 21px;
          font-weight: bold;
          color: #064e3b;
          margin: 4px 0;
        }
        .sub-header {
          font-size: 12px;
          color: #475569;
          margin: 2px 0;
        }
        .voucher-title {
          display: inline-block;
          background: ${isIncome ? '#059669' : '#dc2626'};
          color: white;
          padding: 5px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          margin-top: 10px;
          letter-spacing: 0.5px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 16px;
          color: #334155;
          padding: 6px 10px;
          background: #f1f5f9;
          border-radius: 6px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .data-table th, .data-table td {
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          text-align: left;
          font-size: 13px;
        }
        .data-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #334155;
          width: 32%;
        }
        .amount-highlight {
          font-size: 20px;
          font-weight: bold;
          color: ${isIncome ? '#047857' : '#b91c1c'};
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
          padding-top: 10px;
          font-size: 12px;
          text-align: center;
        }
        .sig-block {
          border-top: 1px solid #64748b;
          width: 170px;
          padding-top: 6px;
        }
        @media print {
          body { padding: 0; background: white; }
          .action-bar { display: none !important; }
          .voucher-box { box-shadow: none; border: 2px solid #000; }
        }
      </style>
    </head>
    <body>
      <div class="action-bar">
        <span><strong>পিডিএফ সেভ / প্রিন্ট:</strong> প্রিন্টার ডায়ালগে "Save as PDF" নির্বাচন করুন যাতে সম্পূর্ণ বাংলা লেখা স্পষ্ট ও নিখুঁত থাকে।</span>
        <button class="action-btn" onclick="window.print()">🖨️ প্রিন্ট / Save PDF</button>
      </div>

      <div class="voucher-box">
        <div class="header">
          <div class="arabic-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 6px 0;">
            <img src="/madrasa_logo.png" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid #fbbf24; object-fit: contain;" alt="Logo" />
            <div>
              <div class="madrasa-name">${lang === 'bn' ? madrasa.nameBn : madrasa.nameEn}</div>
              <div class="sub-header">${lang === 'bn' ? madrasa.addressBn : madrasa.addressEn}</div>
            </div>
          </div>
          <div class="sub-header">${lang === 'bn' ? madrasa.establishedBn : madrasa.establishedEn} | ${lang === 'bn' ? madrasa.registrationBn : madrasa.registrationEn}</div>
          <div class="voucher-title">${title}</div>
        </div>

        <div class="meta-row">
          <div><strong>${lang === 'bn' ? 'ভাউচার / রসিদ নং:' : 'Voucher No:'}</strong> ${tx.voucherNo || `TX-${tx.sl}`}</div>
          <div><strong>${lang === 'bn' ? 'তারিখ:' : 'Date:'}</strong> ${formatDate(tx.date, lang)}</div>
        </div>

        <table class="data-table">
          <tr>
            <th>${lang === 'bn' ? (isIncome ? 'দাতা / জমার উৎস:' : 'গ্রহীতা / ব্যয়ের ক্ষেত্র:') : (isIncome ? 'Donor / Source:' : 'Payee / Purpose:')}</th>
            <td><strong>${tx.donorOrPayee || (lang === 'bn' ? 'সাধারণ শুভাকাঙ্ক্ষী' : 'General')}</strong></td>
          </tr>
          <tr>
            <th>${lang === 'bn' ? 'হিসাবের খাত:' : 'Accounting Head:'}</th>
            <td>${lang === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}</td>
          </tr>
          <tr>
            <th>${lang === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</th>
            <td style="text-transform: capitalize; font-weight: 600;">${tx.paymentMethod}</td>
          </tr>
          <tr>
            <th>${lang === 'bn' ? 'বিবরণ:' : 'Description:'}</th>
            <td>${tx.description}</td>
          </tr>
          <tr>
            <th>${lang === 'bn' ? 'মোট টাকার পরিমাণ:' : 'Total Amount:'}</th>
            <td class="amount-highlight">${formatCurrency(tx.amount, lang)}</td>
          </tr>
        </table>

        <div class="signatures">
          <div class="sig-block">${lang === 'bn' ? 'আদায়কারী / গ্রহণকারী' : 'Received / Issued By'}</div>
          <div class="sig-block">${lang === 'bn' ? 'হিসাবরক্ষক' : 'Accountant'}</div>
          <div class="sig-block">
            <strong>${lang === 'bn' ? 'মাওলানা মোস্তফা কামাল' : 'Mawlana Md. Mostafa Kamal'}</strong><br>
            <span>${lang === 'bn' ? 'মুহতামিম (+8801744618311)' : 'Principal (+8801744618311)'}</span>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}

export function printFinancialReport(
  title: string,
  transactions: Transaction[],
  madrasa: MadrasaInfo,
  lang: Language,
  dateFilterText?: string
) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) return;

  const rowsHtml = transactions
    .map(
      (tx) => `
      <tr>
        <td style="text-align: center; font-weight: 600;">${lang === 'bn' ? toBengaliNumber(tx.sl) : tx.sl}</td>
        <td style="white-space: nowrap;">${formatDate(tx.date, lang)}</td>
        <td style="color: ${tx.type === 'income' ? '#047857' : '#b91c1c'}; font-weight: bold; text-align: center;">
          ${tx.type === 'income' ? (lang === 'bn' ? 'আয়' : 'Income') : (lang === 'bn' ? 'ব্যয়' : 'Expense')}
        </td>
        <td><strong>${lang === 'bn' ? tx.categoryNameBn : tx.categoryNameEn}</strong></td>
        <td>${tx.description}</td>
        <td>${tx.donorOrPayee || '-'}</td>
        <td style="text-align: right; font-weight: bold; color: ${tx.type === 'income' ? '#047857' : '#b91c1c'}; white-space: nowrap;">
          ${formatCurrency(tx.amount, lang)}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${title} - ${madrasa.nameBn}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Hind Siliguri', Arial, sans-serif;
          padding: 24px;
          color: #0f172a;
          background: #f8fafc;
        }
        .action-bar {
          background: #064e3b;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .action-btn {
          background: #fbbf24;
          color: #0f172a;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
        }
        .report-card {
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #065f46;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .name {
          font-size: 22px;
          font-weight: bold;
          color: #064e3b;
          margin: 0 0 4px 0;
        }
        .sub {
          font-size: 12px;
          color: #475569;
          margin: 2px 0;
        }
        .report-title {
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
          color: #1e293b;
          background: #f1f5f9;
          display: inline-block;
          padding: 4px 18px;
          border-radius: 20px;
        }
        .summary-bar {
          display: flex;
          justify-content: space-around;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 18px;
          font-size: 13px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 10px;
        }
        th {
          background-color: #064e3b;
          color: white;
          text-align: left;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          font-size: 12px;
          text-align: center;
        }
        .sig-block {
          border-top: 1px solid #64748b;
          width: 170px;
          padding-top: 6px;
        }
        @media print {
          body { padding: 0; background: white; }
          .action-bar { display: none !important; }
          .report-card { border: none; box-shadow: none; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="action-bar">
        <span><strong>পিডিএফ হিসেবে সংরক্ষণ করতে:</strong> প্রিন্ট ডায়ালগে "Save as PDF" নির্বাচন করুন।</span>
        <button class="action-btn" onclick="window.print()">🖨️ প্রিন্ট / Save as PDF</button>
      </div>

      <div class="report-card">
        <div class="header">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px;">
            <img src="/madrasa_logo.png" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid #fbbf24; object-fit: contain;" alt="Logo" />
            <div>
              <div class="name">${lang === 'bn' ? madrasa.nameBn : madrasa.nameEn}</div>
              <div class="sub">${lang === 'bn' ? madrasa.addressBn : madrasa.addressEn}</div>
            </div>
          </div>
          <div class="sub">${lang === 'bn' ? madrasa.establishedBn : madrasa.establishedEn} | ${lang === 'bn' ? madrasa.registrationBn : madrasa.registrationEn}</div>
          <div class="report-title">${title} ${dateFilterText ? `(${dateFilterText})` : ''}</div>
        </div>

        <div class="summary-bar">
          <div>${lang === 'bn' ? 'মোট আয়:' : 'Total Income:'} <span style="color:#047857; font-weight:bold; font-size:14px;">${formatCurrency(totalIncome, lang)}</span></div>
          <div>${lang === 'bn' ? 'মোট ব্যয়:' : 'Total Expense:'} <span style="color:#b91c1c; font-weight:bold; font-size:14px;">${formatCurrency(totalExpense, lang)}</span></div>
          <div>${lang === 'bn' ? 'বর্তমান নিট স্থিতি:' : 'Net Balance:'} <span style="color:#1d4ed8; font-weight:bold; font-size:14px;">${formatCurrency(balance, lang)}</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">${lang === 'bn' ? 'ক্রম' : 'SL'}</th>
              <th>${lang === 'bn' ? 'তারিখ' : 'Date'}</th>
              <th style="text-align: center;">${lang === 'bn' ? 'ধরন' : 'Type'}</th>
              <th>${lang === 'bn' ? 'খাতের নাম' : 'Category'}</th>
              <th>${lang === 'bn' ? 'বিবরণ' : 'Description'}</th>
              <th>${lang === 'bn' ? 'দাতা / গ্রহীতা' : 'Donor / Payee'}</th>
              <th style="text-align: right;">${lang === 'bn' ? 'পরিমাণ (৳)' : 'Amount (BDT)'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-block">${lang === 'bn' ? 'প্রস্তুতকারী হিসাবরক্ষক' : 'Prepared By'}</div>
          <div class="sig-block">${lang === 'bn' ? 'অভ্যন্তরীণ অডিটর' : 'Internal Auditor'}</div>
          <div class="sig-block">
            <strong>${lang === 'bn' ? 'মাওলানা মোস্তফা কামাল' : 'Mawlana Md. Mostafa Kamal'}</strong><br>
            <span>${lang === 'bn' ? 'মুহতামিম (+8801744618311)' : 'Principal (+8801744618311)'}</span>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Seamless Bengali PDF Export: triggers high-resolution printable Unicode statement dialog
export function exportPdfDocument(
  title: string,
  transactions: Transaction[],
  madrasa: MadrasaInfo
) {
  printFinancialReport(title, transactions, madrasa, 'bn');
}
