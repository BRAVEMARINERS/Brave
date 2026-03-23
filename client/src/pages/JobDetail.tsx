import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { toast } from "sonner";
import { useState } from "react";
import { Briefcase, DollarSign, Clock, ArrowRight, Loader2, Send, Building2 } from "lucide-react";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading } = trpc.jobs.get.useQuery({ id: parseInt(id || "0") });
  const [coverLetter, setCoverLetter] = useState("");
  const [showApply, setShowApply] = useState(false);

  const applyMutation = trpc.jobs.submitApplication.useMutation({
    onSuccess: () => { toast.success("تم تقديم الطلب بنجاح!"); setShowApply(false); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-28 text-center">
        <h1 className="text-2xl font-bold text-foreground">الوظيفة غير موجودة</h1>
        <Link href="/jobs"><Button className="mt-4 font-sans font-bold rounded-xl">العودة للوظائف</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-28 pb-16">
        <Link href="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-sans mb-6">
          <ArrowRight className="h-4 w-4" /> العودة للوظائف
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-navy-950 flex items-center justify-center shrink-0">
                    <Briefcase className="h-7 w-7 text-gold-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{job.titleAr || job.titleEn}</h1>
                    {job.titleEn && job.titleAr && <p className="text-lg text-muted-foreground font-sans mt-1">{job.titleEn}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {job.salary && <Badge variant="outline" className="font-sans gap-1"><DollarSign className="h-3 w-3" /> {job.salary} {job.currency || "USD"}</Badge>}
                  {job.contractDuration && <Badge variant="outline" className="font-sans gap-1"><Clock className="h-3 w-3" /> {job.contractDuration}</Badge>}
                  <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30 font-sans">نشطة</Badge>
                </div>
                {(job.descriptionAr || job.descriptionEn) && (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-bold text-foreground font-sans mb-3">الوصف</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed whitespace-pre-wrap">{job.descriptionAr || job.descriptionEn}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {showApply && (
              <Card className="border-gold-400/30 rounded-2xl">
                <CardHeader><CardTitle className="font-sans">التقديم على هذا المنصب</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="اكتب رسالة تعريفية (اختياري)..." className="font-sans min-h-[150px] rounded-xl" />
                    <div className="flex gap-3">
                      <Button onClick={() => applyMutation.mutate({ jobId: job.id, coverLetter: coverLetter || undefined })}
                        className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm" disabled={applyMutation.isPending}>
                        {applyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Send className="h-4 w-4 ml-2" />}
                        إرسال الطلب
                      </Button>
                      <Button variant="outline" onClick={() => setShowApply(false)} className="font-sans font-bold rounded-xl">إلغاء</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                {isAuthenticated ? (
                  <Button onClick={() => setShowApply(true)} className="w-full gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 h-12 rounded-xl glow-gold-sm">
                    قدّم الآن
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button className="w-full gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 h-12 rounded-xl glow-gold-sm">
                      سجّل دخولك للتقديم
                    </Button>
                  </Link>
                )}
                <p className="text-xs text-muted-foreground font-sans text-center">نُشرت {new Date(job.createdAt).toLocaleDateString("ar")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
