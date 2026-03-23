import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className={`flex items-center gap-1.5 font-sans text-sm font-bold ${className}`}
      title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
    >
      <Globe className="h-4 w-4" />
      {lang === "ar" ? "EN" : "عر"}
    </Button>
  );
}
