import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, BookOpen, Calendar, ArrowRight } from "lucide-react";

export default function BlogList() {
  const { data: blogs, isLoading } = trpc.content.blogs.useQuery({});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="navy-gradient pt-28 pb-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Maritime Blog</h1>
          <p className="text-navy-200 font-sans">Industry news, insights, and updates</p>
        </div>
      </section>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <Card className="h-full border-border/50 hover:border-gold-400/30 hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                  {blog.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={blog.imageUrl} alt={blog.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground font-sans mb-2 group-hover:text-gold-500 transition-colors">{blog.titleEn}</h3>
                    {blog.excerptEn && <p className="text-sm text-muted-foreground font-sans line-clamp-3 mb-4">{blog.excerptEn}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <Calendar className="h-3 w-3" />
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "Draft"}
                      </div>
                      <span className="text-sm text-gold-500 font-sans font-medium flex items-center gap-1">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground font-sans mb-2">No Articles Yet</h3>
            <p className="text-muted-foreground font-sans">Check back soon for maritime insights</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
