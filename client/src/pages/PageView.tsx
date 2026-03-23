import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";

export default function PageView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = trpc.content.page.useQuery({ slug: slug || "" });

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-28 pb-16 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">{page?.titleAr || page?.titleEn || slug}</h1>
        <div className="prose prose-lg max-w-none">
          <Streamdown>{page?.contentAr || page?.contentEn || "محتوى الصفحة قادم قريباً."}</Streamdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}
