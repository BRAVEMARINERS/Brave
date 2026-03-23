import { useState } from "react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Download, Eye, Globe, Loader2 } from "lucide-react";

export default function CVBuilder() {
  const { lang, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [cvLang, setCvLang] = useState<"ar" | "en">(lang as "ar" | "en");

  const handleGenerateCV = async (action: "view" | "download") => {
    setLoading(true);
    try {
      const url = `/api/cv/generate?lang=${cvLang}`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Failed to generate CV");
      }

      const html = await res.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);

      if (action === "view") {
        window.open(blobUrl, "_blank");
      } else {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `CV-BraveMarines-${new Date().toISOString().split("T")[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        toast.success(lang === "ar" ? "تم تحميل السيرة الذاتية!" : "CV downloaded!");
      }
    } catch (err: any) {
      toast.error(err.message || (lang === "ar" ? "حدث خطأ" : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-sans">
          <FileText className="h-5 w-5 text-gold-500" />
          {t.profile.generateCV}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground font-sans">
          {lang === "ar"
            ? "أنشئ سيرتك الذاتية البحرية الاحترافية بشكل تلقائي من بيانات ملفك الشخصي"
            : "Automatically generate your professional maritime CV from your profile data"}
        </p>

        {/* Language Selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-sans text-muted-foreground">
            {lang === "ar" ? "لغة السيرة الذاتية:" : "CV Language:"}
          </span>
          <div className="flex gap-2">
            {(["ar", "en"] as const).map(l => (
              <button
                key={l}
                onClick={() => setCvLang(l)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-all border ${
                  cvLang === l
                    ? "bg-gold-400/20 border-gold-400/50 text-gold-600"
                    : "border-border/50 text-muted-foreground hover:border-border"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {l === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* CV Preview Info */}
        <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-wide">
            {lang === "ar" ? "محتوى السيرة الذاتية" : "CV Contents"}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              lang === "ar" ? "المعلومات الشخصية" : "Personal Info",
              lang === "ar" ? "الرتبة والخبرة" : "Rank & Experience",
              lang === "ar" ? "نبذة شخصية" : "Professional Summary",
              lang === "ar" ? "أنواع السفن" : "Ship Types",
              lang === "ar" ? "الشهادات والوثائق" : "Certificates",
            ].map(item => (
              <Badge key={item} variant="secondary" className="font-sans text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => handleGenerateCV("view")}
            className="flex-1 font-sans rounded-xl border-border/50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <Eye className="h-4 w-4 ml-2" />
            )}
            {lang === "ar" ? "معاينة" : "Preview"}
          </Button>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleGenerateCV("download")}
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <Download className="h-4 w-4 ml-2" />
            )}
            {lang === "ar" ? "تحميل" : "Download"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground font-sans text-center">
          {lang === "ar"
            ? "* يمكنك طباعة الصفحة كـ PDF من المتصفح بعد المعاينة"
            : "* You can print the page as PDF from the browser after preview"}
        </p>
      </CardContent>
    </Card>
  );
}
