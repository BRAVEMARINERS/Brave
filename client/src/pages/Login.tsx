import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { CDN } from "@shared/constants";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff, Phone, Waves } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح!");
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      toast.error(err.message || "بيانات الدخول غير صحيحة");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginMethod === "email" ? email : phone;
    if (!identifier) {
      toast.error(loginMethod === "email" ? "يرجى إدخال البريد الإلكتروني" : "يرجى إدخال رقم الهاتف");
      return;
    }
    loginMutation.mutate({ email: loginMethod === "email" ? email : phone, password });
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
            <h1 className="text-3xl font-bold text-foreground">مرحباً بعودتك</h1>
            <p className="text-muted-foreground font-sans mt-2">سجّل دخولك إلى حسابك في BraveMarines</p>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-navy-950/5 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {/* Login method toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6 bg-secondary/50 p-1 rounded-xl">
                <button type="button" onClick={() => setLoginMethod("email")}
                  className={`py-2.5 rounded-lg text-sm font-bold font-sans transition-all ${
                    loginMethod === "email" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <Mail className="h-4 w-4 inline ml-1" /> البريد الإلكتروني
                </button>
                <button type="button" onClick={() => setLoginMethod("phone")}
                  className={`py-2.5 rounded-lg text-sm font-bold font-sans transition-all ${
                    loginMethod === "phone" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <Phone className="h-4 w-4 inline ml-1" /> رقم الهاتف
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {loginMethod === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-sans font-bold">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@example.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-sans font-bold">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+963 XXX XXX XXX" value={phone}
                        onChange={(e) => setPhone(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" dir="ltr" required />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-sans font-bold">كلمة المرور</Label>
                    <Link href="/forgot-password" className="text-sm text-gold-500 hover:text-gold-600 font-sans font-medium">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة المرور"
                      value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 pl-10 h-12 font-sans rounded-xl" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 gold-gradient text-navy-950 font-bold font-sans text-base hover:opacity-90 rounded-xl glow-gold-sm transition-all"
                  disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : null}
                  تسجيل الدخول
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground font-sans mt-6">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="text-gold-500 hover:text-gold-600 font-bold">
                  أنشئ حساباً
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
