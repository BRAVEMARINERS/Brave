import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Building2, Search, Loader2, CheckCircle2, Globe, MapPin } from "lucide-react";

export default function CompaniesList() {
  const { data: companies, isLoading } = trpc.companies.list.useQuery({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!companies) return [];
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter((c: any) => c.nameEn?.toLowerCase().includes(q) || c.nameAr?.toLowerCase().includes(q));
  }, [companies, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="navy-gradient pt-28 pb-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">الشركات البحرية</h1>
          <p className="text-navy-200 font-sans mb-8">شركات الشحن الموثوقة حول العالم</p>
          <div className="relative max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن شركة..." className="pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-navy-400 font-sans text-base rounded-xl" />
          </div>
        </div>
      </section>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c: any) => (
              <Card key={c.id} className="border-border/50 hover:border-gold-400/30 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-navy-950 flex items-center justify-center shrink-0">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.nameAr || c.nameEn} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building2 className="h-6 w-6 text-gold-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground font-sans">{c.nameAr || c.nameEn}</h3>
                        {c.isApproved && <CheckCircle2 className="h-4 w-4 text-gold-500" />}
                      </div>
                      {c.nameEn && c.nameAr && <p className="text-sm text-muted-foreground font-sans">{c.nameEn}</p>}
                    </div>
                  </div>
                  {c.description && <p className="text-sm text-muted-foreground font-sans mt-4 line-clamp-2">{c.description}</p>}
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3">
                    {c.website && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <Globe className="h-3 w-3" /> {c.website}
                      </div>
                    )}
                    {c.address && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                        <MapPin className="h-3 w-3" /> {c.address}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground font-sans mb-2">لا توجد شركات</h3>
            <p className="text-muted-foreground font-sans">عد لاحقاً</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
