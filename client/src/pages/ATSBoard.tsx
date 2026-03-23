import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  User, Briefcase, MessageSquare, ChevronRight, Loader2,
  FileText, Clock, CheckCircle, XCircle, Star, Send,
} from "lucide-react";

type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "interview" | "accepted" | "rejected";

const STATUS_COLUMNS: { status: ApplicationStatus; labelAr: string; labelEn: string; color: string; icon: React.ReactNode }[] = [
  { status: "pending", labelAr: "جديد", labelEn: "New", color: "bg-gray-500/10 text-gray-600 border-gray-500/30", icon: <Clock className="h-3.5 w-3.5" /> },
  { status: "reviewed", labelAr: "قيد المراجعة", labelEn: "Reviewing", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: <FileText className="h-3.5 w-3.5" /> },
  { status: "shortlisted", labelAr: "مختار", labelEn: "Shortlisted", color: "bg-purple-500/10 text-purple-600 border-purple-500/30", icon: <Star className="h-3.5 w-3.5" /> },
  { status: "interview", labelAr: "مقابلة", labelEn: "Interview", color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { status: "accepted", labelAr: "مقبول", labelEn: "Accepted", color: "bg-green-500/10 text-green-600 border-green-500/30", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  { status: "rejected", labelAr: "مرفوض", labelEn: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/30", icon: <XCircle className="h-3.5 w-3.5" /> },
];

// ─── Application Detail Dialog ────────────────────────────────────────────────
function ApplicationDetail({ app, onClose, onRefresh }: { app: any; onClose: () => void; onRefresh: () => void }) {
  const { lang, t } = useI18n();
  const [noteText, setNoteText] = useState("");
  const utils = trpc.useUtils();

  const { data: notes, isLoading: notesLoading } = trpc.ats.getNotes.useQuery({ applicationId: app.application.id });

  const updateStatus = trpc.ats.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(lang === "ar" ? "تم تحديث الحالة" : "Status updated");
      utils.ats.getCompanyApplications.invalidate();
      onRefresh();
    },
    onError: (e) => toast.error(e.message),
  });

  const addNote = trpc.ats.addNote.useMutation({
    onSuccess: () => {
      setNoteText("");
      utils.ats.getNotes.invalidate({ applicationId: app.application.id });
      toast.success(lang === "ar" ? "تمت إضافة الملاحظة" : "Note added");
    },
    onError: (e) => toast.error(e.message),
  });

  const seafarerName = app.seafarer
    ? (lang === "ar" && app.seafarer.firstNameAr
        ? `${app.seafarer.firstNameAr} ${app.seafarer.lastNameAr || ""}`
        : `${app.seafarer.firstNameEn || ""} ${app.seafarer.lastNameEn || ""}`).trim()
    : (lang === "ar" ? "بحّار" : "Seafarer");

  const currentStatus = STATUS_COLUMNS.find(s => s.status === app.application.status);

  return (
    <div className="space-y-5">
      {/* Applicant Info */}
      <div className="flex items-start gap-4 p-4 bg-secondary/40 rounded-xl">
        <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
          {app.seafarer?.profileImageUrl
            ? <img src={app.seafarer.profileImageUrl} alt="" className="w-full h-full object-cover" />
            : <User className="h-7 w-7 text-navy-400" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold font-sans">{seafarerName}</h3>
            {app.seafarer?.isVerified && (
              <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30 text-[10px] px-1.5 py-0">
                {lang === "ar" ? "موثّق" : "Verified"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            {lang === "ar" ? "الخبرة:" : "Experience:"} {app.seafarer?.experienceMonths
              ? `${Math.floor(app.seafarer.experienceMonths / 12)} ${lang === "ar" ? "سنة" : "years"}`
              : (lang === "ar" ? "غير محدد" : "N/A")}
          </p>
          <p className="text-xs text-muted-foreground font-sans">
            {lang === "ar" ? "تقدم في:" : "Applied:"} {new Date(app.application.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
          </p>
        </div>
      </div>

      {/* Job Info */}
      {app.job && (
        <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{lang === "ar" && app.job.titleAr ? app.job.titleAr : app.job.titleEn}</span>
        </div>
      )}

      {/* Cover Letter */}
      {app.application.coverLetter && (
        <div>
          <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-wide mb-2">
            {t.ats.coverLetter}
          </p>
          <p className="text-sm font-sans text-foreground/80 bg-secondary/30 rounded-xl p-3 leading-relaxed">
            {app.application.coverLetter}
          </p>
        </div>
      )}

      {/* Status Update */}
      <div>
        <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-wide mb-2">
          {t.ats.updateStatus}
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_COLUMNS.map(col => (
            <button
              key={col.status}
              onClick={() => updateStatus.mutate({ id: app.application.id, status: col.status })}
              disabled={updateStatus.isPending || app.application.status === col.status}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium border transition-all ${
                app.application.status === col.status
                  ? `${col.color} border-current`
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {col.icon}
              {lang === "ar" ? col.labelAr : col.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-wide mb-2">
          {t.ats.notes}
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {notesLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {notes?.length === 0 && (
            <p className="text-xs text-muted-foreground font-sans italic">
              {lang === "ar" ? "لا توجد ملاحظات بعد" : "No notes yet"}
            </p>
          )}
          {notes?.map(({ note, author }: any) => (
            <div key={note.id} className="bg-secondary/40 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-sans">{author?.name || (lang === "ar" ? "مشرف" : "Admin")}</span>
                <span className="text-xs text-muted-foreground font-sans">
                  {new Date(note.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                </span>
              </div>
              <p className="text-xs font-sans text-foreground/80">{note.note}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder={lang === "ar" ? "أضف ملاحظة داخلية..." : "Add internal note..."}
            className="font-sans text-sm rounded-xl resize-none min-h-[60px]"
            rows={2}
          />
          <Button
            size="sm"
            disabled={!noteText.trim() || addNote.isPending}
            onClick={() => addNote.mutate({ applicationId: app.application.id, note: noteText.trim() })}
            className="h-auto bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl px-3"
          >
            {addNote.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────
function ApplicationCard({ app, onClick }: { app: any; onClick: () => void }) {
  const { lang } = useI18n();
  const status = STATUS_COLUMNS.find(s => s.status === app.application.status);
  const seafarerName = app.seafarer
    ? (lang === "ar" && app.seafarer.firstNameAr
        ? `${app.seafarer.firstNameAr} ${app.seafarer.lastNameAr || ""}`
        : `${app.seafarer.firstNameEn || ""} ${app.seafarer.lastNameEn || ""}`).trim()
    : (lang === "ar" ? "بحّار" : "Seafarer");

  return (
    <div
      onClick={onClick}
      className="p-3 bg-background border border-border/50 rounded-xl cursor-pointer hover:border-gold-400/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
          {app.seafarer?.profileImageUrl
            ? <img src={app.seafarer.profileImageUrl} alt="" className="w-full h-full object-cover" />
            : <User className="h-4 w-4 text-navy-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold font-sans truncate">{seafarerName}</span>
            {app.seafarer?.isVerified && (
              <CheckCircle className="h-3 w-3 text-gold-500 shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground font-sans truncate">
            {app.seafarer?.experienceMonths
              ? `${Math.floor(app.seafarer.experienceMonths / 12)} ${lang === "ar" ? "سنة خبرة" : "yrs exp"}`
              : ""}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      {app.job && (
        <p className="text-xs text-muted-foreground font-sans mt-2 truncate">
          {lang === "ar" && app.job.titleAr ? app.job.titleAr : app.job.titleEn}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ATSBoard() {
  const { lang, t } = useI18n();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [filterJobId, setFilterJobId] = useState<string>("");

  const { data: applications, isLoading, refetch } = trpc.ats.getCompanyApplications.useQuery(
    filterJobId ? { jobId: parseInt(filterJobId) } : {}
  );
  const { data: jobs } = trpc.company.getJobs.useQuery();

  const appsByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.status] = applications?.filter((a: any) => a.application.status === col.status) || [];
    return acc;
  }, {} as Record<ApplicationStatus, any[]>);

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      {/* Header */}
      <section className="navy-gradient pt-28 pb-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-8 w-8 text-gold-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.ats.title}</h1>
          </div>
          <p className="text-navy-200 font-sans">
            {lang === "ar" ? "تتبع وإدارة طلبات التوظيف بكفاءة" : "Track and manage job applications efficiently"}
          </p>
        </div>
      </section>

      <div className="container py-8">
        {/* Filter by Job */}
        <div className="flex items-center gap-3 mb-6">
          <Select value={filterJobId} onValueChange={setFilterJobId}>
            <SelectTrigger className="w-64 font-sans rounded-xl border-border/50 bg-background">
              <SelectValue placeholder={lang === "ar" ? "كل الوظائف" : "All Jobs"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" className="font-sans">{lang === "ar" ? "كل الوظائف" : "All Jobs"}</SelectItem>
              {jobs?.map((j: any) => (
                <SelectItem key={j.id} value={j.id.toString()} className="font-sans">
                  {lang === "ar" && j.titleAr ? j.titleAr : j.titleEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground font-sans">
            {applications?.length || 0} {lang === "ar" ? "طلب" : "applications"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : (
          /* Kanban Board */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map(col => (
              <div key={col.status} className="min-w-[200px]">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border mb-3 ${col.color}`}>
                  {col.icon}
                  <span className="text-xs font-bold font-sans">
                    {lang === "ar" ? col.labelAr : col.labelEn}
                  </span>
                  <span className="text-xs font-sans mr-auto">
                    ({appsByStatus[col.status]?.length || 0})
                  </span>
                </div>
                <div className="space-y-2">
                  {appsByStatus[col.status]?.map((app: any) => (
                    <ApplicationCard
                      key={app.application.id}
                      app={app}
                      onClick={() => setSelectedApp(app)}
                    />
                  ))}
                  {appsByStatus[col.status]?.length === 0 && (
                    <div className="h-16 border-2 border-dashed border-border/30 rounded-xl flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-sans">
                        {lang === "ar" ? "لا يوجد" : "Empty"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans">
              {lang === "ar" ? "تفاصيل الطلب" : "Application Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <ApplicationDetail
              app={selectedApp}
              onClose={() => setSelectedApp(null)}
              onRefresh={refetch}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
