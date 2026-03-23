/**
 * CV Generator - Generates a professional PDF CV for seafarers
 * Uses HTML template + weasyprint/puppeteer approach via HTML string
 */

export interface CVData {
  name: string;
  email?: string | null;
  phone?: string | null;
  nationality?: string | null;
  birthDate?: Date | null;
  rank?: string | null;
  experience?: number | null;
  availability?: string | null;
  bio?: string | null;
  education?: string | null;
  profileImageUrl?: string | null;
  documents?: Array<{
    docType?: string | null;
    expiryDate?: Date | null;
  }>;
  shipTypes?: string[];
}

export function generateCVHtml(data: CVData, lang: "ar" | "en" = "ar"): string {
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const fontFamily = isAr ? "'Noto Sans Arabic', 'Arial', sans-serif" : "'Arial', sans-serif";

  const availabilityLabel = {
    available: isAr ? "متاح للعمل" : "Available",
    onboard: isAr ? "على متن السفينة" : "On Board",
    unavailable: isAr ? "غير متاح" : "Unavailable",
  }[data.availability || "available"] || (isAr ? "متاح" : "Available");

  const experienceText = data.experience
    ? isAr
      ? `${Math.floor(data.experience / 12)} سنة ${data.experience % 12 ? `و ${data.experience % 12} أشهر` : ""}`
      : `${Math.floor(data.experience / 12)} year(s) ${data.experience % 12 ? `${data.experience % 12} month(s)` : ""}`
    : isAr ? "غير محدد" : "Not specified";

  const docsRows = (data.documents || []).map(doc => {
    const expiry = doc.expiryDate
      ? new Date(doc.expiryDate).toLocaleDateString(isAr ? "ar-SA" : "en-US")
      : isAr ? "بدون تاريخ" : "No expiry";
    return `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;">${doc.docType || (isAr ? "وثيقة" : "Document")}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;">${expiry}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${data.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      direction: ${dir};
      color: #1a1a2e;
      background: #fff;
      font-size: 13px;
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      color: white;
      padding: 32px 40px;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .avatar {
      width: 90px; height: 90px;
      border-radius: 50%;
      border: 3px solid #d4af37;
      object-fit: cover;
      background: #2a2a4e;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; color: #d4af37; font-weight: bold;
      flex-shrink: 0;
    }
    .header-info h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .header-info .rank { color: #d4af37; font-size: 15px; font-weight: 600; margin-bottom: 8px; }
    .header-info .contact { font-size: 12px; color: #c5c5d5; }
    .badge {
      display: inline-block;
      background: #d4af37;
      color: #1a1a2e;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-top: 8px;
    }
    .body { padding: 28px 40px; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f3460;
      border-bottom: 2px solid #d4af37;
      padding-bottom: 6px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-item label { font-size: 11px; color: #6b7280; font-weight: 600; }
    .info-item span { font-size: 13px; color: #1a1a2e; display: block; }
    .bio { font-size: 13px; color: #374151; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; }
    th {
      background: #f3f4f6;
      padding: 8px 10px;
      text-align: ${isAr ? "right" : "left"};
      font-size: 12px;
      font-weight: 600;
      color: #374151;
    }
    .ship-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .ship-tag {
      background: #e0e7ff;
      color: #3730a3;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    .footer {
      margin-top: 32px;
      padding: 16px 40px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
    }
    .footer strong { color: #d4af37; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="avatar">
      ${data.profileImageUrl
        ? `<img src="${data.profileImageUrl}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;" />`
        : data.name.charAt(0).toUpperCase()}
    </div>
    <div class="header-info">
      <h1>${data.name}</h1>
      <div class="rank">${data.rank || (isAr ? "بحّار" : "Seafarer")}</div>
      <div class="contact">
        ${data.email ? `📧 ${data.email}` : ""}
        ${data.email && data.phone ? " &nbsp;|&nbsp; " : ""}
        ${data.phone ? `📞 ${data.phone}` : ""}
      </div>
      <div class="badge">${availabilityLabel}</div>
    </div>
  </div>

  <div class="body">
    <!-- Personal Info -->
    <div class="section">
      <div class="section-title">${isAr ? "المعلومات الشخصية" : "Personal Information"}</div>
      <div class="info-grid">
        ${data.nationality ? `<div class="info-item"><label>${isAr ? "الجنسية" : "Nationality"}</label><span>${data.nationality}</span></div>` : ""}
        ${data.birthDate ? `<div class="info-item"><label>${isAr ? "تاريخ الميلاد" : "Date of Birth"}</label><span>${new Date(data.birthDate).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span></div>` : ""}
        ${data.education ? `<div class="info-item"><label>${isAr ? "المستوى التعليمي" : "Education"}</label><span>${data.education}</span></div>` : ""}
        <div class="info-item"><label>${isAr ? "الخبرة البحرية" : "Sea Experience"}</label><span>${experienceText}</span></div>
      </div>
    </div>

    ${data.bio ? `
    <!-- Bio -->
    <div class="section">
      <div class="section-title">${isAr ? "نبذة شخصية" : "Professional Summary"}</div>
      <p class="bio">${data.bio}</p>
    </div>` : ""}

    ${data.shipTypes && data.shipTypes.length > 0 ? `
    <!-- Ship Types -->
    <div class="section">
      <div class="section-title">${isAr ? "أنواع السفن" : "Ship Types"}</div>
      <div class="ship-tags">
        ${data.shipTypes.map(s => `<span class="ship-tag">${s}</span>`).join("")}
      </div>
    </div>` : ""}

    ${data.documents && data.documents.length > 0 ? `
    <!-- Documents -->
    <div class="section">
      <div class="section-title">${isAr ? "الشهادات والوثائق" : "Certificates & Documents"}</div>
      <table>
        <thead>
          <tr>
            <th>${isAr ? "نوع الوثيقة" : "Document Type"}</th>
            <th style="text-align:center;">${isAr ? "تاريخ الانتهاء" : "Expiry Date"}</th>
          </tr>
        </thead>
        <tbody>${docsRows}</tbody>
      </table>
    </div>` : ""}
  </div>

  <div class="footer">
    ${isAr ? "تم إنشاء هذه السيرة الذاتية بواسطة" : "Generated by"} <strong>BraveMarines</strong> &mdash; ${new Date().toLocaleDateString(isAr ? "ar-SA" : "en-US")}
  </div>
</body>
</html>`;
}
