import { trpc } from "@/lib/trpc";
import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertTriangle, CheckCircle, XCircle, Clock, FileText, Calendar,
} from "lucide-react";
import { useState } from "react";

interface DocumentWithExpiry {
  id: number;
  docType?: string | null;
  fileName?: string | null;
  fileUrl: string;
  expiryDate?: Date | null;
}

interface DocumentExpiryTrackerProps {
  documents: DocumentWithExpiry[];
  onRefresh?: () => void;
}

function getExpiryStatus(expiryDate: Date | null | undefined): {
  status: "expired" | "critical" | "warning" | "valid" | "none";
  daysLeft: number;
  label: { ar: string; en: string };
  color: string;
  icon: React.ReactNode;
} {
  if (!expiryDate) return {
    status: "none", daysLeft: 0,
    label: { ar: "بدون تاريخ انتهاء", en: "No Expiry" },
    color: "text-muted-foreground",
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
  };

  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return {
    status: "expired", daysLeft,
    label: { ar: "منتهية الصلاحية", en: "Expired" },
    color: "text-red-500",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
  };
  if (daysLeft <= 30) return {
    status: "critical", daysLeft,
    label: { ar: `تنتهي خلال ${daysLeft} يوم`, en: `Expires in ${daysLeft} days` },
    color: "text-red-500",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };
  if (daysLeft <= 90) return {
    status: "warning", daysLeft,
    label: { ar: `تنتهي خلال ${daysLeft} يوم`, en: `Expires in ${daysLeft} days` },
    color: "text-amber-500",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
  };
  return {
    status: "valid", daysLeft,
    label: { ar: `سارية (${daysLeft} يوم)`, en: `Valid (${daysLeft} days)` },
    color: "text-green-500",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  };
}

function DocumentRow({ doc, onRefresh }: { doc: DocumentWithExpiry; onRefresh?: () => void }) {
  const { lang } = useI18n();
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [expiryInput, setExpiryInput] = useState(
    doc.expiryDate ? new Date(doc.expiryDate).toISOString().split("T")[0] : ""
  );

  const updateExpiry = trpc.documents.updateExpiry.useMutation({
    onSuccess: () => {
      setEditingExpiry(false);
      toast.success(lang === "ar" ? "تم تحديث تاريخ الانتهاء" : "Expiry date updated");
      onRefresh?.();
    },
    onError: (e) => toast.error(e.message),
  });

  const expiryInfo = getExpiryStatus(doc.expiryDate);

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="shrink-0">{expiryInfo.icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-sans font-medium truncate">{doc.docType || (lang === "ar" ? "وثيقة" : "Document")}</p>
          <p className="text-xs text-muted-foreground font-sans truncate">{doc.fileName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {editingExpiry ? (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={expiryInput}
              onChange={e => setExpiryInput(e.target.value)}
              className="h-7 text-xs font-sans w-36 rounded-lg"
            />
            <Button
              size="sm"
              className="h-7 text-xs font-sans px-2 bg-gold-500 hover:bg-gold-600 text-navy-950"
              disabled={updateExpiry.isPending}
              onClick={() => {
                if (expiryInput) updateExpiry.mutate({ documentId: doc.id, expiryDate: expiryInput });
              }}
            >
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs font-sans px-2"
              onClick={() => setEditingExpiry(false)}
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        ) : (
          <>
            <div className="text-right">
              <span className={`text-xs font-sans font-medium ${expiryInfo.color}`}>
                {expiryInfo.label[lang]}
              </span>
              {doc.expiryDate && (
                <p className="text-xs text-muted-foreground font-sans">
                  {new Date(doc.expiryDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditingExpiry(true)}
              className="text-muted-foreground hover:text-gold-500 transition-colors"
              title={lang === "ar" ? "تعديل تاريخ الانتهاء" : "Edit expiry date"}
            >
              <Calendar className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DocumentExpiryTracker({ documents, onRefresh }: DocumentExpiryTrackerProps) {
  const { lang } = useI18n();

  const expiredDocs = documents.filter(d => {
    if (!d.expiryDate) return false;
    const info = getExpiryStatus(d.expiryDate);
    return info.status === "expired" || info.status === "critical" || info.status === "warning";
  });

  const stats = {
    expired: documents.filter(d => d.expiryDate && getExpiryStatus(d.expiryDate).status === "expired").length,
    critical: documents.filter(d => d.expiryDate && getExpiryStatus(d.expiryDate).status === "critical").length,
    warning: documents.filter(d => d.expiryDate && getExpiryStatus(d.expiryDate).status === "warning").length,
    valid: documents.filter(d => d.expiryDate && getExpiryStatus(d.expiryDate).status === "valid").length,
  };

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      {(stats.expired > 0 || stats.critical > 0) && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold font-sans text-red-600">
              {lang === "ar" ? "تنبيه: وثائق تحتاج تجديد" : "Alert: Documents Need Renewal"}
            </p>
            <p className="text-xs font-sans text-red-500/80 mt-0.5">
              {lang === "ar"
                ? `لديك ${stats.expired} وثيقة منتهية و${stats.critical} وثيقة ستنتهي خلال 30 يوماً`
                : `You have ${stats.expired} expired and ${stats.critical} expiring within 30 days`}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { count: stats.expired, labelAr: "منتهية", labelEn: "Expired", color: "text-red-500", bg: "bg-red-500/10" },
          { count: stats.critical, labelAr: "حرجة", labelEn: "Critical", color: "text-red-400", bg: "bg-red-400/10" },
          { count: stats.warning, labelAr: "تحذير", labelEn: "Warning", color: "text-amber-500", bg: "bg-amber-500/10" },
          { count: stats.valid, labelAr: "سارية", labelEn: "Valid", color: "text-green-500", bg: "bg-green-500/10" },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className={`text-xs font-sans ${s.color}`}>{lang === "ar" ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      {/* Documents List */}
      <Card className="border-border/50 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-sans">
            {lang === "ar" ? "جميع الوثائق" : "All Documents"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans text-center py-6">
              {lang === "ar" ? "لا توجد وثائق مرفوعة" : "No documents uploaded"}
            </p>
          ) : (
            documents.map(doc => (
              <DocumentRow key={doc.id} doc={doc} onRefresh={onRefresh} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
