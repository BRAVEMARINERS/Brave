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
import { Loader2, Mail, Lock, User, Eye, EyeOff, Ship, Building2, Phone, FileText, Globe, Hash } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1); // 1=type, 2=info, 3=company details (if company)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"seafarer" | "company">("seafarer");
  const [showPassword, setShowPassword] = useState(false);

  // Company fields
  const [companyNameEn, setCompanyNameEn] = useState("");
  const [companyNameAr, setCompanyNameAr] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح!");
      if (accountType === "company") {
        toast.info("سيتم مراجعة حساب الشركة من قبل الإدارة");
      }
      window.location.href = "/dashboard";
    },
    onError: (err) => toast.error(err.message === "Email already registered" ? "البريد الإلكتروني مسجل مسبقاً" : err.message || "فشل التسجيل"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("كلمتا المرور غير متطابقتين"); return; }
    if (password.length < 6) { toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (!email) { toast.error("يرجى إدخال البريد الإلكتروني"); return; }

    if (accountType === "company" && step === 2) {
      setStep(3);
      return;
    }

    registerMutation.mutate({ name, email, password, accountType, phone: phoneNum });
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameEn && !companyNameAr) { toast.error("يرجى إدخال اسم الشركة"); return; }
    if (!regNumber) { toast.error("يرجى إدخال رقم التسجيل التجاري"); return; }
    registerMutation.mutate({ name, email, password, accountType, phone: phoneNum });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-800 mb-5 glow-gold-sm">
              <img src={CDN.LOGO} alt="BraveMarines" className="h-12 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {step === 1 ? "أنشئ حسابك" : step === 2 ? "معلومات الحساب" : "معلومات الشركة"}
            </h1>
            <p className="text-muted-foreground font-sans mt-2">
              {step === 1 ? "انضم إلى مجتمع BraveMarines" : step === 2 ? "أكمل بياناتك الشخصية" : "أدخل بيانات شركتك للمراجعة"}
            </p>
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {[1, 2, ...(accountType === "company" ? [3] : [])].map((s) => (
                <div key={s} className={`h-2 rounded-full transition-all ${s === step ? "w-10 bg-gold-400" : s < step ? "w-6 bg-gold-400/50" : "w-6 bg-border"}`} />
              ))}
            </div>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-navy-950/5 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {/* Step 1: Account Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <p className="text-center text-muted-foreground font-sans text-sm">اختر نوع الحساب</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setAccountType("seafarer")}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        accountType === "seafarer" ? "border-gold-400 bg-gold-400/5 shadow-md shadow-gold-400/10" : "border-border hover:border-gold-400/30"
                      }`}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${accountType === "seafarer" ? "bg-gold-400/10" : "bg-secondary"}`}>
                        <Ship className={`h-8 w-8 ${accountType === "seafarer" ? "text-gold-500" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-sm font-bold font-sans ${accountType === "seafarer" ? "text-gold-500" : "text-muted-foreground"}`}>بحّار</span>
                      <span className="text-xs text-muted-foreground font-sans">ابحث عن فرص عمل بحرية</span>
                    </button>
                    <button type="button" onClick={() => setAccountType("company")}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        accountType === "company" ? "border-gold-400 bg-gold-400/5 shadow-md shadow-gold-400/10" : "border-border hover:border-gold-400/30"
                      }`}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${accountType === "company" ? "bg-gold-400/10" : "bg-secondary"}`}>
                        <Building2 className={`h-8 w-8 ${accountType === "company" ? "text-gold-500" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-sm font-bold font-sans ${accountType === "company" ? "text-gold-500" : "text-muted-foreground"}`}>شركة</span>
                      <span className="text-xs text-muted-foreground font-sans">وظّف طاقم بحري مؤهل</span>
                    </button>
                  </div>
                  {accountType === "company" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-sans">
                      <strong>ملاحظة:</strong> تسجيل الشركات يتطلب مراجعة من الإدارة. ستحتاج لتقديم رقم التسجيل التجاري ومعلومات الشركة للتحقق.
                    </div>
                  )}
                  <Button onClick={() => setStep(2)} className="w-full h-12 gold-gradient text-navy-950 font-bold font-sans text-base hover:opacity-90 rounded-xl glow-gold-sm">
                    التالي
                  </Button>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-sans font-bold">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" placeholder="أدخل اسمك الكامل" value={name}
                        onChange={(e) => setName(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-sans font-bold">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@example.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-sans font-bold">رقم الهاتف <span className="text-muted-foreground text-xs">(اختياري)</span></Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+963 XXX XXX XXX" value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-sans font-bold">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="6 أحرف على الأقل"
                        value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 pl-10 h-12 font-sans rounded-xl" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-sans font-bold">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" placeholder="أعد كتابة كلمة المرور"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10 h-12 font-sans rounded-xl" required />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 font-sans font-bold rounded-xl">
                      رجوع
                    </Button>
                    <Button type="submit" className="flex-1 h-12 gold-gradient text-navy-950 font-bold font-sans text-base hover:opacity-90 rounded-xl glow-gold-sm"
                      disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : null}
                      {accountType === "company" ? "التالي" : "إنشاء الحساب"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Company Details */}
              {step === 3 && (
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 font-sans mb-2">
                    هذه المعلومات مطلوبة لمراجعة وتوثيق حساب الشركة من قبل الإدارة.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="font-sans font-bold">اسم الشركة (إنجليزي)</Label>
                      <Input placeholder="Company Name" value={companyNameEn}
                        onChange={(e) => setCompanyNameEn(e.target.value)} className="h-11 font-sans rounded-xl" dir="ltr" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-bold">اسم الشركة (عربي)</Label>
                      <Input placeholder="اسم الشركة" value={companyNameAr}
                        onChange={(e) => setCompanyNameAr(e.target.value)} className="h-11 font-sans rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-bold">رقم التسجيل التجاري <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="أدخل رقم السجل التجاري" value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)} className="pr-10 h-11 font-sans rounded-xl" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="font-sans font-bold">إيميل الشركة</Label>
                      <Input type="email" placeholder="info@company.com" value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)} className="h-11 font-sans rounded-xl" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-sans font-bold">هاتف الشركة</Label>
                      <Input type="tel" placeholder="+963..." value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)} className="h-11 font-sans rounded-xl" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-bold">الموقع الإلكتروني <span className="text-muted-foreground text-xs">(اختياري)</span></Label>
                    <div className="relative">
                      <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="url" placeholder="https://www.company.com" value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)} className="pr-10 h-11 font-sans rounded-xl" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-bold">وصف الشركة</Label>
                    <textarea placeholder="اكتب وصفاً مختصراً عن الشركة ونشاطها..." value={companyDesc}
                      onChange={(e) => setCompanyDesc(e.target.value)}
                      className="w-full min-h-[80px] rounded-xl border border-input bg-background px-4 py-3 text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="h-12 font-sans font-bold rounded-xl">
                      رجوع
                    </Button>
                    <Button type="submit" className="flex-1 h-12 gold-gradient text-navy-950 font-bold font-sans text-base hover:opacity-90 rounded-xl glow-gold-sm"
                      disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : null}
                      تسجيل الشركة
                    </Button>
                  </div>
                </form>
              )}

              {step <= 2 && (
                <p className="text-center text-sm text-muted-foreground font-sans mt-6">
                  لديك حساب بالفعل؟{" "}
                  <Link href="/login" className="text-gold-500 hover:text-gold-600 font-bold">
                    تسجيل الدخول
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
