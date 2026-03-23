import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Briefcase, MapPin, DollarSign, Clock, Building2, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function Jobs() {
  const { data: jobs, isLoading } = trpc.jobs.list.useQuery({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!jobs) return [];
    if (!search) return jobs;
    const q = search.toLowerCase();
    return jobs.filter((j: any) =>
      j.titleEn?.toLowerCase().includes(q) || j.titleAr?.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="navy-gradient pt-28 pb-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">الوظائف البحرية</h1>
          <p className="text-navy-200 font-sans mb-8">اعثر على فرصتك القادمة في البحر</p>
          <div className="relative max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن وظيفة..." className="pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-navy-400 font-sans text-base rounded-xl" />
          </div>
        </div>
      </section>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job: any) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="h-full border-border/50 hover:border-gold-400/30 hover:shadow-lg transition-all cursor-pointer group rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-gold-400" />
                      </div>
                      <Badge variant="outline" className="font-sans text-xs">نشطة</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-sans mb-2 group-hover:text-gold-500 transition-colors">{job.titleAr || job.titleEn}</h3>
                    <div className="space-y-2 mb-4">
                      {job.salary && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                          <DollarSign className="h-4 w-4 text-gold-500" /> {job.salary} {job.currency || "USD"}
                        </div>
                      )}
                      {job.contractDuration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                          <Clock className="h-4 w-4 text-gold-500" /> {job.contractDuration}
                        </div>
                      )}
                    </div>
                    {(job.descriptionAr || job.descriptionEn) && (
                      <p className="text-sm text-muted-foreground font-sans line-clamp-2">{job.descriptionAr || job.descriptionEn}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground font-sans">نُشرت {new Date(job.createdAt).toLocaleDateString("ar")}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground font-sans mb-2">لا توجد وظائف حالياً</h3>
            <p className="text-muted-foreground font-sans">عد لاحقاً للاطلاع على الفرص الجديدة</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
