import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { CDN } from "@shared/constants";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => { setDone(true); toast.success("تم تغيير كلمة المرور بنجاح!"); },
    onError: (err) => toast.error(err.message || "فشل في تغيير كلمة المرور"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("كلمتا المرور غير متطابقتين"); return; }
    resetMutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-800 mb-5 glow-gold-sm">
              <img src={CDN.LOGO} alt="BraveMarines" className="h-12 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">كلمة مرور جديدة</h1>
          </div>
          <Card className="border-border/50 shadow-2xl shadow-navy-950/5 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2 font-sans">تم تحديث كلمة المرور!</h3>
                  <p className="text-muted-foreground font-sans mb-6">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
                  <Link href="/login"><Button className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm">تسجيل الدخول</Button></Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-sans font-bold">كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="6 أحرف على الأقل" value={password}
                        onChange={(e) => setPassword(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans font-bold">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="أعد كتابة كلمة المرور" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm"
                    disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : null}
                    تغيير كلمة المرور
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
