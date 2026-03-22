import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CDN } from "@shared/constants";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  Anchor, Ship, Users, Building2, Briefcase, Shield,
  Globe, Award, Search, ArrowRight, CheckCircle2,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function Home() {
  const { data: faqs } = trpc.content.faqs.useQuery();
  const { data: jobCount } = trpc.jobs.count.useQuery();
  const { data: seafarerCount } = trpc.seafarers.count.useQuery();
  const { data: companyCount } = trpc.companies.count.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 pt-24 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-400 font-sans text-sm font-semibold uppercase tracking-widest">Maritime Recruitment Platform</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Navigate Your <br />
              <span className="text-gold-gradient">Maritime Career</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-navy-200 font-sans leading-relaxed mb-10 max-w-2xl">
              Connect with top shipping companies worldwide. Whether you're a seasoned captain or starting your maritime journey, find your next opportunity here.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-navy-950 font-semibold font-sans text-base px-8 h-14 hover:opacity-90 transition-opacity shadow-lg shadow-gold-400/20">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-navy-400/30 text-white hover:bg-white/10 font-sans text-base px-8 h-14 bg-transparent">
                  Browse Jobs <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-navy-700/50">
              {[
                { value: jobCount ?? 0, label: "Active Jobs", icon: Briefcase },
                { value: seafarerCount ?? 0, label: "Seafarers", icon: Users },
                { value: companyCount ?? 0, label: "Companies", icon: Building2 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white font-sans">{stat.value}+</p>
                    <p className="text-xs text-navy-300 font-sans">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-500 font-sans text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
              <div className="h-px w-12 bg-gold-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Your Gateway to the <span className="text-gold-500">Maritime Industry</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg">
              We provide comprehensive tools and services to connect maritime professionals with the best opportunities.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Ship, title: "Maritime Jobs", desc: "Browse hundreds of positions across all vessel types and ranks, from deck officers to engineers." },
              { icon: Shield, title: "Verified Profiles", desc: "All companies and seafarers go through a verification process to ensure trust and authenticity." },
              { icon: Globe, title: "Global Network", desc: "Connect with shipping companies and seafarers from around the world in one platform." },
              { icon: Award, title: "Career Growth", desc: "Access resources, certifications tracking, and career development tools for maritime professionals." },
              { icon: Users, title: "Crew Management", desc: "Companies can manage their crew, track availability, and find qualified replacements quickly." },
              { icon: Anchor, title: "Industry Insights", desc: "Stay updated with maritime news, regulations, and industry trends through our blog." },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="group h-full border-border/50 hover:border-gold-400/30 hover:shadow-lg hover:shadow-gold-400/5 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center mb-6 group-hover:bg-gold-400/10 transition-colors">
                      <feature.icon className="h-6 w-6 text-gold-400" />
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
      <section className="py-24 navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="container relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-400 font-sans text-sm font-semibold uppercase tracking-widest">How It Works</span>
              <div className="h-px w-12 bg-gold-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Start Your Journey in <span className="text-gold-400">3 Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Register as a seafarer or company. Complete your profile with credentials and documents." },
              { step: "02", title: "Get Verified", desc: "Submit verification documents. Our team reviews and approves your account for trust." },
              { step: "03", title: "Connect & Apply", desc: "Browse jobs, apply to positions, or post vacancies. Start building your maritime career." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                  <span className="text-6xl font-bold text-gold-400/20 font-sans absolute top-4 right-6">{item.step}</span>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-6">
                      <span className="text-navy-950 font-bold font-sans text-lg">{item.step}</span>
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
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Seafarers */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full overflow-hidden border-border/50 hover:shadow-xl transition-shadow">
                <div className="h-48 relative">
                  <img src={CDN.CREW_TEAM} alt="Seafarers" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-gold-400 font-sans text-sm font-semibold uppercase tracking-wider">For Seafarers</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Launch Your Maritime Career</h3>
                  <ul className="space-y-3 mb-8">
                    {["Create your professional maritime CV", "Upload certificates & documents", "Set your availability status", "Apply to jobs worldwide", "Get verified for priority access"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground font-sans">
                        <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90">
                      Register as Seafarer <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Companies */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full overflow-hidden border-border/50 hover:shadow-xl transition-shadow">
                <div className="h-48 relative">
                  <img src={CDN.ABOUT_BG} alt="Companies" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-gold-400 font-sans text-sm font-semibold uppercase tracking-wider">For Companies</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Find Qualified Crew</h3>
                  <ul className="space-y-3 mb-8">
                    {["Post job listings for any position", "Browse verified seafarer profiles", "Track applications & manage crew", "Manage your fleet & vessels", "Company verification for trust"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground font-sans">
                        <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="bg-navy-950 text-white font-semibold font-sans hover:bg-navy-800">
                      Register as Company <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-24 bg-secondary/30">
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-12 bg-gold-400" />
                <span className="text-gold-500 font-sans text-sm font-semibold uppercase tracking-widest">FAQ</span>
                <div className="h-px w-12 bg-gold-400" />
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                Frequently Asked <span className="text-gold-500">Questions</span>
              </motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="bg-card rounded-xl border border-border/50 px-6">
                    <AccordionTrigger className="text-left font-sans font-semibold text-foreground hover:text-gold-500 py-5">
                      {faq.questionEn}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                      {faq.answerEn}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CDN.HERO_BG_2} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/90" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Set Sail?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-navy-200 font-sans text-lg max-w-2xl mx-auto mb-10">
              Join thousands of maritime professionals and companies on BraveMarines. Your next opportunity is waiting.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-navy-950 font-semibold font-sans text-base px-10 h-14 hover:opacity-90 shadow-lg shadow-gold-400/20">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-navy-400/30 text-white hover:bg-white/10 font-sans text-base px-10 h-14 bg-transparent">
                  Explore Jobs
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
