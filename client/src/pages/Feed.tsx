import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  User, Image, Camera, Heart, MessageCircle, Share2, Send,
  MoreHorizontal, XCircle, Globe, Loader2,
} from "lucide-react";

const INITIAL_POSTS = [
  {
    id: 1, userName: "BraveMarines", userAvatar: null, time: "منذ ساعة",
    text: "مرحباً بكم في منصة BraveMarines! شاركونا تجاربكم البحرية وآخر أخباركم. هذا المكان لكل البحارة والشركات البحرية.",
    image: null, likes: 12, comments: 4, liked: false,
  },
  {
    id: 2, userName: "أحمد محمد", userAvatar: null, time: "منذ 3 ساعات",
    text: "سعيد بانضمامي لهذه المنصة الرائعة! أبحث عن فرص عمل كضابط أول على سفن الحاويات. خبرة 8 سنوات في المجال البحري.",
    image: null, likes: 8, comments: 2, liked: false,
  },
  {
    id: 3, userName: "شركة النجم البحري", userAvatar: null, time: "منذ 5 ساعات",
    text: "نبحث عن طاقم كامل لسفينة حاويات جديدة. الرجاء التقديم عبر صفحة الوظائف. رواتب مجزية وعقود طويلة الأمد.",
    image: null, likes: 15, comments: 7, liked: false,
  },
];

export default function Feed() {
  const { user, isAuthenticated } = useAuth();
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [posts, setPosts] = useState(INITIAL_POSTS);
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
      id: Date.now(), userName: user?.name || "مستخدم", userAvatar: user?.avatarUrl || null,
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
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      {/* Header */}
      <section className="navy-gradient pt-28 pb-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-gold-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">المنشورات</h1>
          </div>
          <p className="text-navy-200 font-sans">شارك أخبارك وتجاربك البحرية مع المجتمع</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Create Post */}
          {isAuthenticated ? (
            <Card className="border-border/50 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.avatarUrl ? (
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
          ) : (
            <Card className="border-border/50 rounded-2xl">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground font-sans mb-4">سجّل دخولك لتتمكن من نشر المنشورات والتفاعل</p>
                <div className="flex justify-center gap-3">
                  <Link href="/login">
                    <Button variant="outline" className="font-sans font-bold rounded-xl">تسجيل الدخول</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm">إنشاء حساب</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          {posts.map((post) => (
            <Card key={post.id} className="border-border/50 rounded-2xl overflow-hidden shadow-sm">
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
      </div>
      <Footer />
    </div>
  );
}
