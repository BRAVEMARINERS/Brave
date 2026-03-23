import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Users, Search, Loader2, User, CheckCircle2, Anchor } from "lucide-react";
import { AVAILABILITY_STATUS } from "@shared/constants";

const statusAr: Record<string, string> = {
  available: "متاح",
  onboard: "على متن السفينة",
  unavailable: "غير متاح",
};

export default function SeafarersList() {
  const { data: seafarers, isLoading } = trpc.seafarers.list.useQuery({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!seafarers) return [];
    if (!search) return seafarers;
    const q = search.toLowerCase();
    return seafarers.filter((s: any) =>
      s.firstNameEn?.toLowerCase().includes(q) || s.lastNameEn?.toLowerCase().includes(q) ||
      s.firstNameAr?.includes(q) || s.lastNameAr?.includes(q)
    );
  }, [seafarers, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="navy-gradient pt-28 pb-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">دليل البحّارة</h1>
          <p className="text-navy-200 font-sans mb-8">تصفح المحترفين البحريين المؤهلين</p>
          <div className="relative max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم..." className="pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-navy-400 font-sans text-base rounded-xl" />
          </div>
        </div>
      </section>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s: any) => {
              const status = AVAILABILITY_STATUS[s.availabilityStatus as keyof typeof AVAILABILITY_STATUS];
              return (
                <Card key={s.id} className="border-border/50 hover:border-gold-400/30 hover:shadow-lg transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-navy-950/10 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-navy-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground font-sans">
                            {s.firstNameAr || s.firstNameEn} {s.lastNameAr || s.lastNameEn || ""}
                          </h3>
                          {s.isVerified && <CheckCircle2 className="h-4 w-4 text-gold-500" />}
                        </div>
                        {s.availabilityStatus && (
                          <Badge className={`mt-1 text-xs ${status?.color || "bg-gray-500"} text-white border-0`}>
                            {statusAr[s.availabilityStatus] || status?.en}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {s.bio && <p className="text-sm text-muted-foreground font-sans mt-4 line-clamp-2">{s.bio}</p>}
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground font-sans">
                      <Anchor className="h-3 w-3" />
                      {s.experienceMonths ? `${Math.floor(s.experienceMonths / 12)} سنة و ${s.experienceMonths % 12} شهر خبرة` : "الخبرة غير محددة"}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="h-20 w-20 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground font-sans mb-2">لا يوجد بحّارة</h3>
            <p className="text-muted-foreground font-sans">عد لاحقاً</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
