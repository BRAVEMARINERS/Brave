import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import {
  User, Image, Heart, MessageCircle, Share2, Send,
  Trash2, XCircle, Globe, Loader2, ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Comment Section ──────────────────────────────────────────────────────────
function CommentSection({ postId, commentsCount }: { postId: number; commentsCount: number }) {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const utils = trpc.useUtils();

  const { data: comments, isLoading } = trpc.feed.getComments.useQuery(
    { postId },
    { enabled: open }
  );

  const addComment = trpc.feed.addComment.useMutation({
    onSuccess: () => {
      setText("");
      utils.feed.getComments.invalidate({ postId });
      utils.feed.list.invalidate();
      toast.success("تم إضافة التعليق");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteComment = trpc.feed.deleteComment.useMutation({
    onSuccess: () => {
      utils.feed.getComments.invalidate({ postId });
      utils.feed.list.invalidate();
    },
  });

  return (
    <div className="border-t border-border/30 mt-3 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {commentsCount > 0 ? `${commentsCount} تعليق` : "التعليقات"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />}
          {comments?.map(({ comment, user: commentUser }: any) => (
            <div key={comment.id} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
                {commentUser?.avatarUrl
                  ? <img src={commentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <User className="h-3.5 w-3.5 text-navy-400" />}
              </div>
              <div className="flex-1 bg-secondary/50 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans">{commentUser?.name || "مستخدم"}</span>
                  {user?.id === comment.userId && (
                    <button
                      onClick={() => deleteComment.mutate({ id: comment.id })}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs font-sans text-foreground/80 mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}

          {isAuthenticated && (
            <div className="flex gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <User className="h-3.5 w-3.5 text-navy-400" />}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
                      e.preventDefault();
                      addComment.mutate({ postId, content: text.trim() });
                    }
                  }}
                  placeholder="اكتب تعليقاً..."
                  className="flex-1 text-xs font-sans bg-secondary/50 border border-border/30 rounded-xl px-3 py-1.5 outline-none focus:border-gold-400/50"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!text.trim() || addComment.isPending}
                  onClick={() => addComment.mutate({ postId, content: text.trim() })}
                  className="h-8 w-8 p-0"
                >
                  <Send className="h-3.5 w-3.5 text-gold-500" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ postData }: { postData: any }) {
  const { user, isAuthenticated } = useAuth();
  const { post, user: postUser, likedByMe } = postData;
  const utils = trpc.useUtils();

  const toggleLike = trpc.feed.toggleLike.useMutation({
    onSuccess: () => utils.feed.list.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const deletePost = trpc.feed.delete.useMutation({
    onSuccess: () => {
      utils.feed.list.invalidate();
      toast.success("تم حذف المنشور");
    },
  });

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })
    : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "BraveMarines", text: post.content || "", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    }
  };

  return (
    <Card className="border-border/50 rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden cursor-pointer">
              {postUser?.avatarUrl
                ? <img src={postUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                : <User className="h-5 w-5 text-navy-400" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm font-sans">{postUser?.name || "مستخدم"}</span>
                {postUser?.isVerified && (
                  <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30 text-[10px] px-1.5 py-0">موثّق</Badge>
                )}
                {postUser?.accountType === "company" && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-sans">شركة</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-sans">{timeAgo}</span>
            </div>
          </div>
          {user?.id === post.userId && (
            <button
              onClick={() => deletePost.mutate({ id: post.id })}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {post.content && (
          <p className="text-sm font-sans text-foreground/90 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
        )}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3 max-h-96">
            <img src={post.imageUrl} alt="صورة المنشور" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={() => isAuthenticated ? toggleLike.mutate({ postId: post.id }) : toast.error("يجب تسجيل الدخول أولاً")}
            className={`flex items-center gap-1.5 text-sm transition-colors ${likedByMe ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
          >
            <Heart className={`h-4 w-4 ${likedByMe ? "fill-current" : ""}`} />
            <span className="font-sans text-xs">{post.likesCount || 0}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span className="font-sans text-xs">{post.commentsCount || 0}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <CommentSection postId={post.id} commentsCount={post.commentsCount || 0} />
      </CardContent>
    </Card>
  );
}

// ─── Create Post ──────────────────────────────────────────────────────────────
function CreatePost() {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const createPost = trpc.feed.create.useMutation({
    onSuccess: () => {
      setText("");
      setImageFile(null);
      setImagePreview(null);
      utils.feed.list.invalidate();
      toast.success("تم نشر المنشور!");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!text.trim() && !imageFile) return;
    let imageBase64: string | undefined;
    let imageFileName: string | undefined;
    let imageFileType: string | undefined;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      imageBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      imageFileName = imageFile.name;
      imageFileType = imageFile.type;
    }
    createPost.mutate({ content: text.trim() || undefined, imageBase64, imageFileName, imageFileType });
  };

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <Card className="border-border/50 rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <User className="h-5 w-5 text-navy-400" />}
          </div>
          <div className="flex-1">
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="شارك أخبارك وتجاربك البحرية..."
              className="min-h-[80px] resize-none border-border/30 bg-secondary/30 font-sans text-sm rounded-xl focus-visible:ring-gold-400/30"
            />
            {imagePreview && (
              <div className="relative mt-2 rounded-xl overflow-hidden max-h-48">
                <img src={imagePreview} alt="" className="w-full object-cover" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                >
                  <XCircle className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => imageRef.current?.click()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-500 transition-colors font-sans"
              >
                <Image className="h-4 w-4" /> صورة
              </button>
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <Button
                size="sm"
                disabled={(!text.trim() && !imageFile) || createPost.isPending}
                onClick={handlePost}
                className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold font-sans rounded-xl px-5"
              >
                {createPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "نشر"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Feed Page ───────────────────────────────────────────────────────────
export default function Feed() {
  const { data: posts, isLoading } = trpc.feed.list.useQuery({ limit: 30 });

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
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
          <CreatePost />

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            </div>
          )}

          {!isLoading && (!posts || posts.length === 0) && (
            <Card className="border-border/50 rounded-2xl">
              <CardContent className="p-12 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-sans">لا توجد منشورات بعد. كن أول من يشارك!</p>
              </CardContent>
            </Card>
          )}

          {posts?.map((postData: any) => (
            <PostCard key={postData.post.id} postData={postData} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
