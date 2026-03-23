import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar as arLocale } from "date-fns/locale";
import {
  Users, Ship, Plus, Trash2, Edit, CheckCircle, XCircle, Clock,
  User, Loader2, Anchor,
} from "lucide-react";

const STATUS_CONFIG = {
  active: { labelAr: "نشط", labelEn: "Active", color: "bg-green-500/10 text-green-600 border-green-500/30", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  completed: { labelAr: "منتهي", labelEn: "Completed", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  cancelled: { labelAr: "ملغي", labelEn: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/30", icon: <XCircle className="h-3.5 w-3.5" /> },
};

interface AssignCrewFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AssignCrewForm({ onClose, onSuccess }: AssignCrewFormProps) {
  const { lang } = useI18n();
  const [form, setForm] = useState({
    vesselId: "",
    seafarerId: "",
    rankId: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const { data: vessels } = trpc.company.getVessels.useQuery();
  const { data: ranks } = trpc.public.getRanks.useQuery();
  const { data: seafarers } = trpc.public.getSeafarers.useQuery({ limit: 100 });

  const assign = trpc.crew.assign.useMutation({
    onSuccess: () => {
      toast.success(lang === "ar" ? "تم تعيين البحّار بنجاح" : "Seafarer assigned successfully");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = () => {
    if (!form.vesselId || !form.seafarerId) {
      toast.error(lang === "ar" ? "يرجى اختيار السفينة والبحّار" : "Please select vessel and seafarer");
      return;
    }
    assign.mutate({
      vesselId: parseInt(form.vesselId),
      seafarerId: parseInt(form.seafarerId),
      rankId: form.rankId ? parseInt(form.rankId) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Vessel */}
      <div className="space-y-1.5">
        <Label className="text-sm font-sans">{lang === "ar" ? "السفينة *" : "Vessel *"}</Label>
        <Select value={form.vesselId} onValueChange={v => setForm(f => ({ ...f, vesselId: v }))}>
          <SelectTrigger className="font-sans rounded-xl">
            <SelectValue placeholder={lang === "ar" ? "اختر السفينة" : "Select Vessel"} />
          </SelectTrigger>
          <SelectContent>
            {vessels?.map((v: any) => (
              <SelectItem key={v.id} value={v.id.toString()} className="font-sans">
                {lang === "ar" && v.nameAr ? v.nameAr : v.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seafarer */}
      <div className="space-y-1.5">
        <Label className="text-sm font-sans">{lang === "ar" ? "البحّار *" : "Seafarer *"}</Label>
        <Select value={form.seafarerId} onValueChange={v => setForm(f => ({ ...f, seafarerId: v }))}>
          <SelectTrigger className="font-sans rounded-xl">
            <SelectValue placeholder={lang === "ar" ? "اختر البحّار" : "Select Seafarer"} />
          </SelectTrigger>
          <SelectContent>
            {seafarers?.map((s: any) => (
              <SelectItem key={s.id} value={s.id.toString()} className="font-sans">
                {`${s.firstNameEn || ""} ${s.lastNameEn || ""}`.trim() || (lang === "ar" ? "بحّار" : "Seafarer")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rank */}
      <div className="space-y-1.5">
        <Label className="text-sm font-sans">{lang === "ar" ? "الرتبة على هذه السفينة" : "Rank on this Vessel"}</Label>
        <Select value={form.rankId} onValueChange={v => setForm(f => ({ ...f, rankId: v }))}>
          <SelectTrigger className="font-sans rounded-xl">
            <SelectValue placeholder={lang === "ar" ? "اختر الرتبة" : "Select Rank"} />
          </SelectTrigger>
          <SelectContent>
            {ranks?.map((r: any) => (
              <SelectItem key={r.id} value={r.id.toString()} className="font-sans">
                {lang === "ar" && r.nameAr ? r.nameAr : r.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-sans">{lang === "ar" ? "تاريخ البدء" : "Start Date"}</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            className="font-sans rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-sans">{lang === "ar" ? "تاريخ الانتهاء" : "End Date"}</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            className="font-sans rounded-xl"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-sm font-sans">{lang === "ar" ? "ملاحظات" : "Notes"}</Label>
        <Textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder={lang === "ar" ? "ملاحظات اختيارية..." : "Optional notes..."}
          className="font-sans rounded-xl resize-none"
          rows={3}
        />
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} className="font-sans rounded-xl">
          {lang === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          disabled={assign.isPending}
          onClick={handleSubmit}
          className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl"
        >
          {assign.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
          {lang === "ar" ? "تعيين" : "Assign"}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Crew Card ────────────────────────────────────────────────────────────────
function CrewCard({ item, onRefresh }: { item: any; onRefresh: () => void }) {
  const { lang } = useI18n();
  const { assignment, seafarer, vessel, rank } = item;
  const statusConfig = STATUS_CONFIG[assignment.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;

  const updateStatus = trpc.crew.update.useMutation({
    onSuccess: () => { toast.success(lang === "ar" ? "تم التحديث" : "Updated"); onRefresh(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = trpc.crew.remove.useMutation({
    onSuccess: () => { toast.success(lang === "ar" ? "تم الإزالة" : "Removed"); onRefresh(); },
    onError: (e) => toast.error(e.message),
  });

  const seafarerName = seafarer
    ? (lang === "ar" && seafarer.firstNameAr ? `${seafarer.firstNameAr} ${seafarer.lastNameAr || ""}` : `${seafarer.firstNameEn || ""} ${seafarer.lastNameEn || ""}`).trim()
    : (lang === "ar" ? "بحّار" : "Seafarer");

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
              {seafarer?.profileImageUrl
                ? <img src={seafarer.profileImageUrl} alt="" className="w-full h-full object-cover" />
                : <User className="h-5 w-5 text-navy-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm font-sans">{seafarerName}</span>
                {seafarer?.isVerified && (
                  <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30 text-[10px] px-1.5 py-0">
                    {lang === "ar" ? "موثّق" : "Verified"}
                  </Badge>
                )}
              </div>
              {rank && (
                <p className="text-xs text-muted-foreground font-sans">
                  {lang === "ar" && rank.nameAr ? rank.nameAr : rank.nameEn}
                </p>
              )}
            </div>
          </div>
          <Badge className={`${statusConfig.color} border text-xs font-sans flex items-center gap-1`}>
            {statusConfig.icon}
            {lang === "ar" ? statusConfig.labelAr : statusConfig.labelEn}
          </Badge>
        </div>

        {vessel && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
            <Ship className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-sans text-muted-foreground">
              {lang === "ar" && vessel.nameAr ? vessel.nameAr : vessel.nameEn}
            </span>
          </div>
        )}

        {(assignment.startDate || assignment.endDate) && (
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-sans text-muted-foreground">
              {assignment.startDate ? new Date(assignment.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US") : ""}
              {assignment.startDate && assignment.endDate ? " → " : ""}
              {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US") : ""}
            </span>
          </div>
        )}

        {assignment.notes && (
          <p className="text-xs text-muted-foreground font-sans mt-2 italic">{assignment.notes}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
          {assignment.status === "active" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-sans rounded-lg h-8"
                onClick={() => updateStatus.mutate({ id: assignment.id, status: "completed" })}
                disabled={updateStatus.isPending}
              >
                <CheckCircle className="h-3.5 w-3.5 ml-1 text-green-500" />
                {lang === "ar" ? "إنهاء" : "Complete"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-sans rounded-lg h-8"
                onClick={() => updateStatus.mutate({ id: assignment.id, status: "cancelled" })}
                disabled={updateStatus.isPending}
              >
                <XCircle className="h-3.5 w-3.5 ml-1 text-red-500" />
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
            onClick={() => remove.mutate({ id: assignment.id })}
            disabled={remove.isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CrewManagement() {
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: crew, isLoading, refetch } = trpc.crew.getByCompany.useQuery();

  const filteredCrew = crew?.filter((item: any) =>
    filterStatus === "all" || item.assignment.status === filterStatus
  ) || [];

  const stats = {
    active: crew?.filter((c: any) => c.assignment.status === "active").length || 0,
    completed: crew?.filter((c: any) => c.assignment.status === "completed").length || 0,
    cancelled: crew?.filter((c: any) => c.assignment.status === "cancelled").length || 0,
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      {/* Header */}
      <section className="navy-gradient pt-28 pb-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Anchor className="h-8 w-8 text-gold-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.crew.title}</h1>
          </div>
          <p className="text-navy-200 font-sans">
            {lang === "ar" ? "إدارة طاقم سفنك وتتبع التعيينات" : "Manage your vessel crew and track assignments"}
          </p>
        </div>
      </section>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { count: stats.active, labelAr: "نشط", labelEn: "Active", color: "text-green-500", bg: "bg-green-500/10" },
            { count: stats.completed, labelAr: "منتهي", labelEn: "Completed", color: "text-blue-500", bg: "bg-blue-500/10" },
            { count: stats.cancelled, labelAr: "ملغي", labelEn: "Cancelled", color: "text-red-500", bg: "bg-red-500/10" },
          ].map((s, i) => (
            <Card key={i} className="border-border/50 rounded-2xl">
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-sm font-sans text-muted-foreground">{lang === "ar" ? s.labelAr : s.labelEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {["all", "active", "completed", "cancelled"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gold-400/20 text-gold-600 border border-gold-400/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {status === "all" ? (lang === "ar" ? "الكل" : "All") :
                 status === "active" ? (lang === "ar" ? "نشط" : "Active") :
                 status === "completed" ? (lang === "ar" ? "منتهي" : "Completed") :
                 (lang === "ar" ? "ملغي" : "Cancelled")}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setShowAssignDialog(true)}
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl"
          >
            <Plus className="h-4 w-4 ml-2" />
            {t.crew.assignCrew}
          </Button>
        </div>

        {/* Crew Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : filteredCrew.length === 0 ? (
          <Card className="border-border/50 rounded-2xl">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-sans">{t.crew.noCrew}</p>
              <Button
                onClick={() => setShowAssignDialog(true)}
                className="mt-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl"
              >
                <Plus className="h-4 w-4 ml-2" />
                {t.crew.assignCrew}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrew.map((item: any) => (
              <CrewCard key={item.assignment.id} item={item} onRefresh={refetch} />
            ))}
          </div>
        )}
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-sans">{t.crew.assignCrew}</DialogTitle>
          </DialogHeader>
          <AssignCrewForm
            onClose={() => setShowAssignDialog(false)}
            onSuccess={() => refetch()}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
