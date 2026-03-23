import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams, Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  User, FileText, Upload, Shield, Bell, Briefcase, Building2,
  Loader2, CheckCircle2, Clock, XCircle, Camera, Trash2, Ship,
  Home, Settings, Image, Heart, MessageCircle, Share2, Send,
  MapPin, Calendar, Globe, Phone, Mail, Edit3, MoreHorizontal,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ tab?: string }>();
  const activeTab = params.tab || "feed";

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
      </div>
    </div>
  );

  if (!user) return null;

  const sidebarItems = [
    { id: "feed", label: "آخر الأخبار", icon: Home },
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "documents", label: "الوثائق", icon: FileText },
    { id: "applications", label: "طلباتي", icon: Briefcase },
    { id: "verification", label: "التوثيق", icon: Shield },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <div className="container">
          <div className="flex gap-6">
            {/* Sidebar - Left on RTL */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit">
              {/* User Card */}
              <Card className="border-border/50 rounded-2xl overflow-hidden mb-4">
                <div className="h-24 bg-gradient-to-l from-navy-950 to-navy-800 relative">
                  <div className="absolute -bottom-8 right-4">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-navy-100 flex items-center justify-center overflow-hidden shadow-lg">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-navy-400" />
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="pt-10 pb-4 px-4">
                  <h3 className="font-bold text-foreground font-sans text-base">{user.name || "مستخدم"}</h3>
                  <p className="text-xs text-muted-foreground font-sans">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    {user.isVerified && (
                      <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30 text-xs">
                        <CheckCircle2 className="h-3 w-3 ml-1" /> موثّق
                      </Badge>
                    )}
                    <Badge variant="outline" className="font-sans text-xs">
                      {user.accountType === "company" ? "شركة" : "بحّار"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="border-border/50 rounded-2xl">
                <CardContent className="p-2">
                  {sidebarItems.map((item) => (
                    <button key={item.id}
                      onClick={() => navigate(`/dashboard/${item.id}`)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold font-sans transition-all ${
                        activeTab === item.id
                          ? "bg-gold-400/10 text-gold-600"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}>
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 pb-16">
              {/* Mobile Nav */}
              <div className="lg:hidden mb-4 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  {sidebarItems.map((item) => (
                    <button key={item.id}
                      onClick={() => navigate(`/dashboard/${item.id}`)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold font-sans transition-all ${
                        activeTab === item.id ? "bg-gold-400/10 text-gold-600 border border-gold-400/30" : "bg-card text-muted-foreground border border-border/50"
                      }`}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "feed" && <FeedTab user={user} />}
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "documents" && <DocumentsTab />}
              {activeTab === "applications" && <ApplicationsTab />}
              {activeTab === "verification" && <VerificationTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "settings" && <SettingsTab />}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-72 shrink-0 sticky top-24 h-fit space-y-4">
              <Card className="border-border/50 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-sans">روابط سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    <Briefcase className="h-4 w-4 text-gold-500" /> تصفح الوظائف
                  </Link>
                  <Link href="/seafarers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    <Ship className="h-4 w-4 text-gold-500" /> البحث عن بحّارة
                  </Link>
                  <Link href="/companies" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    <Building2 className="h-4 w-4 text-gold-500" /> الشركات
                  </Link>
                  <Link href="/feed" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    <Globe className="h-4 w-4 text-gold-500" /> المنشورات العامة
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border/50 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-sans">معلومات الاتصال</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <Mail className="h-3.5 w-3.5 text-gold-500" /> bravemariners@gmail.com
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <Phone className="h-3.5 w-3.5 text-gold-500" /> <span dir="ltr">+963 980 197 471</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <MapPin className="h-3.5 w-3.5 text-gold-500" /> سوريا
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feed Tab (Social Feed like Facebook) ─── */
function FeedTab({ user }: { user: any }) {
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([
    {
      id: 1, userName: "BraveMarines", userAvatar: null, time: "منذ ساعة",
      text: "مرحباً بكم في منصة BraveMarines! شاركونا تجاربكم البحرية وآخر أخباركم.",
      image: null, likes: 5, comments: 2, liked: false,
    },
  ]);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPostImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!postText.trim() && !postImage) return;
    const newPost = {
      id: Date.now(), userName: user.name || "مستخدم", userAvatar: user.avatarUrl,
      time: "الآن", text: postText, image: postImage,
      likes: 0, comments: 0, liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostText("");
    setPostImage(null);
    toast.success("تم نشر المنشور!");
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Create Post */}
      <Card className="border-border/50 rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-navy-400" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="شارك أخبارك أو تجربتك البحرية..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm font-sans resize-none min-h-[60px] focus:outline-none focus:ring-2 focus:ring-gold-400/30 border border-transparent focus:border-gold-400/30"
                rows={2}
              />
              {postImage && (
                <div className="relative mt-3">
                  <img src={postImage} alt="" className="w-full max-h-64 object-cover rounded-xl" />
                  <button onClick={() => setPostImage(null)}
                    className="absolute top-2 left-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  <button onClick={() => imageRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans text-muted-foreground hover:bg-secondary transition-all">
                    <Image className="h-4 w-4 text-green-500" /> صورة
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans text-muted-foreground hover:bg-secondary transition-all">
                    <Camera className="h-4 w-4 text-blue-500" /> كاميرا
                  </button>
                </div>
                <Button onClick={handlePost} size="sm"
                  className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 glow-gold-sm"
                  disabled={!postText.trim() && !postImage}>
                  <Send className="h-4 w-4 ml-1" /> نشر
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post) => (
        <Card key={post.id} className="border-border/50 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden">
                  {post.userAvatar ? (
                    <img src={post.userAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-navy-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground font-sans text-sm">{post.userName}</p>
                  <p className="text-xs text-muted-foreground font-sans">{post.time}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground p-1">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            {post.text && (
              <p className="px-4 pb-3 text-sm text-foreground font-sans leading-relaxed">{post.text}</p>
            )}
            {post.image && (
              <img src={post.image} alt="" className="w-full max-h-[500px] object-cover" />
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground font-sans">
              <span>{post.likes > 0 ? `${post.likes} إعجاب` : ""}</span>
              <span>{post.comments > 0 ? `${post.comments} تعليق` : ""}</span>
            </div>

            {/* Post Actions */}
            <div className="flex items-center border-t border-border/50">
              <button onClick={() => toggleLike(post.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-sans font-bold transition-all hover:bg-secondary/50 ${
                  post.liked ? "text-red-500" : "text-muted-foreground"
                }`}>
                <Heart className={`h-5 w-5 ${post.liked ? "fill-red-500" : ""}`} /> إعجاب
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-sans font-bold text-muted-foreground hover:bg-secondary/50 transition-all">
                <MessageCircle className="h-5 w-5" /> تعليق
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-sans font-bold text-muted-foreground hover:bg-secondary/50 transition-all">
                <Share2 className="h-5 w-5" /> مشاركة
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Profile Tab ─── */
function ProfileTab() {
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const { data: ranks } = trpc.lookups.ranks.useQuery();
  const { data: countries } = trpc.lookups.countries.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState<Record<string, any>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (profile?.seafarer && !initialized) {
      setForm({
        firstNameEn: profile.seafarer.firstNameEn || "",
        lastNameEn: profile.seafarer.lastNameEn || "",
        firstNameAr: profile.seafarer.firstNameAr || "",
        lastNameAr: profile.seafarer.lastNameAr || "",
        phone: profile.seafarer.phone || "",
        rankId: profile.seafarer.rankId?.toString() || "",
        countryId: profile.seafarer.countryId?.toString() || "",
        experienceMonths: profile.seafarer.experienceMonths?.toString() || "",
        availabilityStatus: profile.seafarer.availabilityStatus || "available",
        bio: profile.seafarer.bio || "",
      });
      setInitialized(true);
    }
  }, [profile, initialized]);

  const updateMutation = trpc.profile.updateSeafarer.useMutation({
    onSuccess: () => { toast.success("تم تحديث الملف الشخصي!"); utils.profile.get.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const avatarRef = useRef<HTMLInputElement>(null);
  const avatarMutation = trpc.profile.uploadFile.useMutation({
    onSuccess: () => { toast.success("تم تحديث الصورة!"); utils.profile.get.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      avatarMutation.mutate({ fileBase64: base64, fileName: file.name, fileType: file.type, purpose: "avatar" });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateMutation.mutate({
      firstNameEn: form.firstNameEn || undefined,
      lastNameEn: form.lastNameEn || undefined,
      firstNameAr: form.firstNameAr || undefined,
      lastNameAr: form.lastNameAr || undefined,
      phone: form.phone || undefined,
      rankId: form.rankId ? parseInt(form.rankId) : undefined,
      countryId: form.countryId ? parseInt(form.countryId) : undefined,
      experienceMonths: form.experienceMonths ? parseInt(form.experienceMonths) : undefined,
      availabilityStatus: form.availabilityStatus as any || undefined,
      bio: form.bio || undefined,
    });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Cover + Avatar */}
      <Card className="border-border/50 rounded-2xl overflow-hidden">
        <div className="h-48 bg-gradient-to-l from-navy-950 via-navy-800 to-navy-900 relative">
          <div className="absolute -bottom-12 right-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-navy-100 flex items-center justify-center overflow-hidden shadow-xl">
                {profile?.user?.avatarUrl ? (
                  <img src={profile.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-14 w-14 text-navy-400" />
                )}
              </div>
              <input ref={avatarRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <button onClick={() => avatarRef.current?.click()}
                className="absolute bottom-1 left-1 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-navy-950 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <CardContent className="pt-16 pb-6 px-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-sans">{profile?.user?.name || "مستخدم"}</h2>
              <p className="text-muted-foreground font-sans text-sm">{profile?.user?.email}</p>
              <div className="flex gap-2 mt-2">
                {profile?.user?.isVerified && (
                  <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30">
                    <CheckCircle2 className="h-3 w-3 ml-1" /> موثّق
                  </Badge>
                )}
                <Badge variant="outline" className="font-sans">
                  {profile?.user?.accountType === "company" ? "شركة" : "بحّار"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-gold-500" /> المعلومات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans font-bold">الاسم الأول (إنجليزي)</Label>
              <Input value={form.firstNameEn || ""} onChange={(e) => setForm({ ...form, firstNameEn: e.target.value })} className="h-11 font-sans rounded-xl" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans font-bold">الكنية (إنجليزي)</Label>
              <Input value={form.lastNameEn || ""} onChange={(e) => setForm({ ...form, lastNameEn: e.target.value })} className="h-11 font-sans rounded-xl" dir="ltr" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans font-bold">الاسم الأول (عربي)</Label>
              <Input value={form.firstNameAr || ""} onChange={(e) => setForm({ ...form, firstNameAr: e.target.value })} className="h-11 font-sans rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans font-bold">الكنية (عربي)</Label>
              <Input value={form.lastNameAr || ""} onChange={(e) => setForm({ ...form, lastNameAr: e.target.value })} className="h-11 font-sans rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans font-bold">رقم الهاتف</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 font-sans rounded-xl" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans font-bold">الرتبة</Label>
              <Select value={form.rankId || ""} onValueChange={(v) => setForm({ ...form, rankId: v })}>
                <SelectTrigger className="h-11 font-sans rounded-xl"><SelectValue placeholder="اختر الرتبة" /></SelectTrigger>
                <SelectContent>
                  {ranks?.map((r) => <SelectItem key={r.id} value={r.id.toString()} className="font-sans">{r.nameAr || r.nameEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans font-bold">البلد</Label>
              <Select value={form.countryId || ""} onValueChange={(v) => setForm({ ...form, countryId: v })}>
                <SelectTrigger className="h-11 font-sans rounded-xl"><SelectValue placeholder="اختر البلد" /></SelectTrigger>
                <SelectContent>
                  {countries?.map((c) => <SelectItem key={c.id} value={c.id.toString()} className="font-sans">{c.nameAr || c.nameEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-sans font-bold">الخبرة (بالأشهر)</Label>
              <Input type="number" value={form.experienceMonths || ""} onChange={(e) => setForm({ ...form, experienceMonths: e.target.value })} className="h-11 font-sans rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-sans font-bold">حالة التوفر</Label>
            <Select value={form.availabilityStatus || "available"} onValueChange={(v) => setForm({ ...form, availabilityStatus: v })}>
              <SelectTrigger className="h-11 font-sans rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available" className="font-sans">متاح</SelectItem>
                <SelectItem value="onboard" className="font-sans">على متن السفينة</SelectItem>
                <SelectItem value="unavailable" className="font-sans">غير متاح</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-sans font-bold">نبذة عنك</Label>
            <Textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="font-sans min-h-[100px] rounded-xl" placeholder="اكتب عن خبرتك البحرية..." />
          </div>
          <Button onClick={handleSave} className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 glow-gold-sm rounded-xl" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Documents Tab ─── */
function DocumentsTab() {
  const { data: docs, isLoading } = trpc.profile.getDocuments.useQuery();
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.profile.uploadFile.useMutation({
    onSuccess: () => { toast.success("تم رفع الوثيقة!"); utils.profile.getDocuments.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.profile.deleteDocument.useMutation({
    onSuccess: () => { toast.success("تم حذف الوثيقة!"); utils.profile.getDocuments.invalidate(); },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({ fileBase64: base64, fileName: file.name, fileType: file.type, purpose: "document", docType: "certificate" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans flex items-center gap-2">
          <FileText className="h-5 w-5 text-gold-500" /> الوثائق والشهادات
        </CardTitle>
        <div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Upload className="h-4 w-4 ml-2" />}
            رفع وثيقة
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : docs && docs.length > 0 ? (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gold-500" />
                  <div>
                    <p className="font-bold font-sans text-foreground">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground font-sans">{doc.docType} • رُفع {new Date(doc.createdAt).toLocaleDateString("ar")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="font-sans rounded-lg">عرض</Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: doc.id })} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans font-bold">لا توجد وثائق مرفوعة</p>
            <p className="text-sm text-muted-foreground/70 font-sans mt-1">ارفع شهاداتك ورخصك ووثائقك البحرية</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Applications Tab ─── */
function ApplicationsTab() {
  const { data: apps, isLoading } = trpc.jobs.myApplications.useQuery();

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    reviewed: { label: "تمت المراجعة", color: "bg-blue-100 text-blue-800 border-blue-200" },
    accepted: { label: "مقبول", color: "bg-green-100 text-green-800 border-green-200" },
    rejected: { label: "مرفوض", color: "bg-red-100 text-red-800 border-red-200" },
  };

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gold-500" /> طلباتي
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : apps && apps.length > 0 ? (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-gold-500" />
                  <div>
                    <p className="font-bold font-sans text-foreground">وظيفة #{app.jobId}</p>
                    <p className="text-xs text-muted-foreground font-sans">تقدمت {new Date(app.createdAt).toLocaleDateString("ar")}</p>
                  </div>
                </div>
                <Badge className={statusMap[app.status as string]?.color || ""}>
                  {statusMap[app.status as string]?.label || app.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans font-bold">لا توجد طلبات بعد</p>
            <p className="text-sm text-muted-foreground/70 font-sans mt-1">تصفح الوظائف المتاحة وقدّم على الفرص المناسبة</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Verification Tab ─── */
function VerificationTab() {
  const { data: verification, isLoading } = trpc.verification.status.useQuery();
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState("");

  const requestMutation = trpc.verification.request.useMutation({
    onSuccess: () => { toast.success("تم تقديم طلب التوثيق!"); utils.verification.status.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        requestMutation.mutate({ documentBase64: base64, fileName: file.name, fileType: file.type, notes });
      };
      reader.readAsDataURL(file);
    } else {
      requestMutation.mutate({ notes });
    }
  };

  const statusInfo: Record<string, { icon: any; label: string; desc: string }> = {
    pending: { icon: <Clock className="h-12 w-12 text-yellow-500" />, label: "قيد المراجعة", desc: "طلب التوثيق الخاص بك قيد المراجعة من قبل فريقنا." },
    approved: { icon: <CheckCircle2 className="h-12 w-12 text-green-500" />, label: "تم التوثيق", desc: "تهانينا! تم توثيق حسابك بنجاح." },
    rejected: { icon: <XCircle className="h-12 w-12 text-red-500" />, label: "مرفوض", desc: "لم تتم الموافقة على طلبك. يمكنك تقديم طلب جديد." },
  };

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold-500" /> توثيق الحساب
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : verification ? (
          <div className="text-center py-10">
            {statusInfo[verification.status as string]?.icon}
            <h3 className="text-xl font-bold text-foreground mt-4 font-sans">{statusInfo[verification.status as string]?.label}</h3>
            <p className="text-muted-foreground font-sans mt-2 max-w-md mx-auto">{statusInfo[verification.status as string]?.desc}</p>
            {verification.adminNotes && (
              <p className="text-sm text-muted-foreground font-sans mt-4 bg-secondary/50 p-4 rounded-xl max-w-md mx-auto">
                ملاحظات الإدارة: {verification.adminNotes}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <p className="text-muted-foreground font-sans">قدّم وثائق التوثيق للحصول على شارة التوثيق على ملفك الشخصي.</p>
            <div className="space-y-2">
              <Label className="font-sans font-bold">وثيقة التوثيق</Label>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                className="block w-full text-sm font-sans file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gold-400/10 file:text-gold-600 hover:file:bg-gold-400/20" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans font-bold">ملاحظات إضافية</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="font-sans rounded-xl" placeholder="أي معلومات إضافية..." />
            </div>
            <Button type="submit" className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm" disabled={requestMutation.isPending}>
              {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Shield className="h-4 w-4 ml-2" />}
              تقديم طلب التوثيق
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab() {
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  const utils = trpc.useUtils();

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });
  const markAllMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { toast.success("تم تحديد الكل كمقروء"); utils.notifications.list.invalidate(); },
  });

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans flex items-center gap-2">
          <Bell className="h-5 w-5 text-gold-500" /> الإشعارات
        </CardTitle>
        {notifications && notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} className="font-sans rounded-lg">
            تحديد الكل كمقروء
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                n.isRead ? "bg-background border-border/50" : "bg-gold-400/5 border-gold-400/20"
              }`} onClick={() => !n.isRead && markReadMutation.mutate({ id: n.id })}>
                <Bell className={`h-5 w-5 mt-0.5 shrink-0 ${n.isRead ? "text-muted-foreground" : "text-gold-500"}`} />
                <div>
                  <p className="font-bold font-sans text-foreground">{n.titleAr || n.titleEn}</p>
                  <p className="text-sm text-muted-foreground font-sans">{n.messageAr || n.messageEn}</p>
                  <p className="text-xs text-muted-foreground/60 font-sans mt-1">{new Date(n.createdAt).toLocaleString("ar")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans font-bold">لا توجد إشعارات</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4">
      <Card className="border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <Settings className="h-5 w-5 text-gold-500" /> إعدادات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="font-bold font-sans text-foreground">البريد الإلكتروني</p>
              <p className="text-sm text-muted-foreground font-sans">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="font-bold font-sans text-foreground">نوع الحساب</p>
              <p className="text-sm text-muted-foreground font-sans">{user?.accountType === "company" ? "شركة" : "بحّار"}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-border/50">
            <Button variant="destructive" onClick={() => { logout(); window.location.href = "/"; }} className="font-sans font-bold rounded-xl">
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
