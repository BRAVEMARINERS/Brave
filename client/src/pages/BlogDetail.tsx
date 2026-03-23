import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Loader2, ArrowRight, Calendar } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading } = trpc.content.blog.useQuery({ slug: slug || "" });

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="container pt-28 text-center">
        <h1 className="text-2xl font-bold text-foreground">المقال غير موجود</h1>
        <Link href="/blog" className="text-gold-500 font-sans mt-4 inline-block">العودة للمدونة</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="container pt-28 pb-16 max-w-3xl mx-auto">
        <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-sans mb-6">
          <ArrowRight className="h-4 w-4" /> العودة للمدونة
        </Link>
        {blog.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
            <img src={blog.imageUrl} alt={blog.titleAr || blog.titleEn || ""} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{blog.titleAr || blog.titleEn}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-8">
          <Calendar className="h-4 w-4" />
          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("ar") : "مسودة"}
        </div>
        <div className="prose prose-lg max-w-none">
          <Streamdown>{blog.contentAr || blog.contentEn || ""}</Streamdown>
        </div>
      </article>
      <Footer />
    </div>
  );
}
