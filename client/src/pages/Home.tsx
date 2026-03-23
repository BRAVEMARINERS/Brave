import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CDN } from "@shared/constants";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  Anchor, Ship, Users, Briefcase, Shield,
  Globe, Award, Search, ArrowLeft, CheckCircle2,
  Waves, Navigation, Star, Compass,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const fadeRight = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const { data: faqs } = trpc.content.faqs.useQuery();
  const { data: jobCount } = trpc.jobs.count.useQuery();
  const { data: seafarerCount } = trpc.seafarers.count.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Premium */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-navy-950/95 via-navy-950/80 to-navy-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/8 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 pt-24 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mr-0 ml-auto lg:ml-0 lg:mr-0">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="text-gold-400 font-sans text-sm font-bold uppercase tracking-widest">منصة التوظيف البحري</span>
              <div className="h-px w-16 bg-gradient-to-l from-gold-400 to-transparent" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              ابحر نحو{" "}
              <br />
              <span className="text-gold-gradient">مستقبلك البحري</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-navy-200 font-sans leading-relaxed mb-10 max-w-2xl">
              تواصل مع أفضل شركات الشحن حول العالم. سواء كنت قبطاناً محترفاً أو تبدأ رحلتك البحرية، اعثر على فرصتك القادمة هنا.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-navy-950 font-bold font-sans text-base px-8 h-14 hover:opacity-90 transition-all shadow-lg shadow-gold-400/25 glow-gold-sm">
                  ابدأ الآن <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-navy-400/30 text-white hover:bg-white/10 font-sans text-base px-8 h-14 bg-transparent backdrop-blur-sm">
                  تصفح الوظائف <Search className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats - without companies count */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-10 mt-14 pt-8 border-t border-navy-700/40">
              {[
                { value: jobCount ?? 0, label: "وظيفة متاحة", icon: Briefcase },
                { value: seafarerCount ?? 0, label: "بحّار مسجل", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center glow-gold-sm">
                    <stat.icon className="h-6 w-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white font-sans">{stat.value}+</p>
                    <p className="text-sm text-navy-300 font-sans">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gold-400/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-gold-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-background relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-400/5 rounded-full blur-[120px]" />

        <div className="container relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-16 bg-gradient-to-l from-gold-400 to-transparent" />
              <span className="text-gold-500 font-sans text-sm font-bold uppercase tracking-widest">لماذا تختارنا</span>
              <div className="h-px w-16 bg-gradient-to-r from-gold-400 to-transparent" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              بوابتك إلى <span className="text-gold-500">عالم البحار</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg leading-relaxed">
              نوفر لك أدوات وخدمات شاملة لربط المحترفين البحريين بأفضل الفرص المتاحة.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Ship, title: "وظائف بحرية", desc: "تصفح مئات الوظائف عبر جميع أنواع السفن والرتب، من ضباط السطح إلى المهندسين." },
              { icon: Shield, title: "ملفات موثقة", desc: "جميع الشركات والبحارة يمرون بعملية توثيق لضمان الثقة والمصداقية." },
              { icon: Globe, title: "شبكة عالمية", desc: "تواصل مع شركات الشحن والبحارة من جميع أنحاء العالم في منصة واحدة." },
              { icon: Award, title: "تطوير مهني", desc: "احصل على موارد تعليمية وتتبع الشهادات وأدوات التطوير المهني للمحترفين البحريين." },
              { icon: Users, title: "إدارة الطاقم", desc: "يمكن للشركات إدارة طاقمها وتتبع التوفر وإيجاد بدائل مؤهلة بسرعة." },
              { icon: Anchor, title: "أخبار القطاع", desc: "ابقَ على اطلاع بأخبار القطاع البحري واللوائح والاتجاهات عبر مدونتنا." },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="group h-full premium-card rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-800 flex items-center justify-center mb-6 group-hover:from-gold-400/20 group-hover:to-gold-400/5 transition-all duration-500 glow-gold-sm">
                      <feature.icon className="h-7 w-7 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{feature.title}</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        {/* Decorative compass */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
          <Compass className="w-[600px] h-[600px]" />
        </div>

        <div className="container relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-16 bg-gradient-to-l from-gold-400 to-transparent" />
              <span className="text-gold-400 font-sans text-sm font-bold uppercase tracking-widest">كيف يعمل</span>
              <div className="h-px w-16 bg-gradient-to-r from-gold-400 to-transparent" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              ابدأ رحلتك في <span className="text-gold-400">3 خطوات</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "أنشئ حسابك", desc: "سجّل كبحّار أو شركة. أكمل ملفك الشخصي بالمؤهلات والوثائق.", icon: Users },
              { step: "02", title: "احصل على التوثيق", desc: "قدّم وثائق التوثيق. فريقنا يراجع ويوافق على حسابك للثقة.", icon: Shield },
              { step: "03", title: "تواصل وقدّم", desc: "تصفح الوظائف، قدّم على المناصب، أو انشر شواغر. ابدأ بناء مسيرتك البحرية.", icon: Navigation },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:border-gold-400/30 group">
                  <span className="text-7xl font-bold text-gold-400/10 font-sans absolute top-4 left-6">{item.step}</span>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mb-6 group-hover:glow-gold transition-all">
                      <item.icon className="h-6 w-6 text-navy-950" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-sans">{item.title}</h3>
                    <p className="text-navy-200 font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* For Seafarers & Companies */}
      <section className="py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Seafarers */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full overflow-hidden premium-card rounded-3xl">
                <div className="h-52 relative">
                  <img src={CDN.CREW_TEAM} alt="البحارة" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                  <div className="absolute bottom-5 right-7">
                    <div className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-gold-400" />
                      <span className="text-gold-400 font-sans text-sm font-bold uppercase tracking-wider">للبحّارة</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-5">انطلق في مسيرتك البحرية</h3>
                  <ul className="space-y-3 mb-8">
                    {["أنشئ سيرتك الذاتية البحرية المهنية", "ارفع الشهادات والوثائق", "حدّد حالة توفرك", "قدّم على وظائف حول العالم", "احصل على توثيق للأولوية"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground font-sans">
                        <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 glow-gold-sm transition-all">
                      سجّل كبحّار <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Companies */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full overflow-hidden premium-card rounded-3xl">
                <div className="h-52 relative">
                  <img src={CDN.ABOUT_BG} alt="الشركات" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                  <div className="absolute bottom-5 right-7">
                    <div className="flex items-center gap-2">
                      <Anchor className="h-5 w-5 text-gold-400" />
                      <span className="text-gold-400 font-sans text-sm font-bold uppercase tracking-wider">للشركات</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-5">اعثر على طاقم مؤهل</h3>
                  <ul className="space-y-3 mb-8">
                    {["انشر إعلانات وظيفية لأي منصب", "تصفح ملفات البحارة الموثقين", "تتبع الطلبات وإدارة الطاقم", "إدارة أسطولك وسفنك", "توثيق الشركة للمصداقية"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground font-sans">
                        <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="bg-navy-950 text-white font-bold font-sans hover:bg-navy-800 transition-all">
                      سجّل كشركة <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial / Trust Section */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-gold-400 fill-gold-400" />
                ))}
              </div>
              <blockquote className="text-2xl sm:text-3xl font-bold text-foreground mb-6 leading-relaxed">
                "منصة BraveMarines غيّرت طريقة بحثي عن فرص العمل البحرية. وجدت وظيفتي المثالية خلال أسبوع!"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy-950 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gold-400" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground font-sans">أحمد محمد</p>
                  <p className="text-sm text-muted-foreground font-sans">ضابط أول - سوريا</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-28 bg-background">
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-16 bg-gradient-to-l from-gold-400 to-transparent" />
                <span className="text-gold-500 font-sans text-sm font-bold uppercase tracking-widest">الأسئلة الشائعة</span>
                <div className="h-px w-16 bg-gradient-to-r from-gold-400 to-transparent" />
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                أسئلة <span className="text-gold-500">متكررة</span>
              </motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="bg-card rounded-2xl border border-border/50 px-6 premium-card">
                    <AccordionTrigger className="text-right font-sans font-bold text-foreground hover:text-gold-500 py-5">
                      {faq.questionAr || faq.questionEn}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                      {faq.answerAr || faq.answerEn}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.HERO_BG_2} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/50" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-5 py-2 mb-8">
              <Waves className="h-4 w-4 text-gold-400" />
              <span className="text-gold-400 font-sans text-sm font-bold">انضم إلينا اليوم</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              مستعد للإبحار؟
            </motion.h2>
            <motion.p variants={fadeUp} className="text-navy-200 font-sans text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              انضم إلى آلاف المحترفين البحريين والشركات على BraveMarines. فرصتك القادمة بانتظارك.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-navy-950 font-bold font-sans text-base px-10 h-14 hover:opacity-90 shadow-lg shadow-gold-400/25 glow-gold-sm transition-all">
                  أنشئ حساباً مجانياً <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-navy-400/30 text-white hover:bg-white/10 font-sans text-base px-10 h-14 bg-transparent backdrop-blur-sm">
                  استكشف الوظائف
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
