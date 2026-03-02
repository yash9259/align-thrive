import { Link } from "react-router-dom";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Star, Users, Megaphone, Shield, Zap, TrendingUp, CheckCircle, BarChart3, Globe, Award, Play } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-20 pb-28 lg:pt-28 lg:pb-36 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/6 blur-[140px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Trusted by 3,200+ brands and 12,500+ creators</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-6 font-display text-5xl font-extrabold tracking-tight leading-[1.1] lg:text-7xl">
              The Smarter Way to{" "}
              <span className="gradient-text">Collaborate</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Align connects brands with verified creators through merit-based matching. Post campaigns, discover talent, and build partnerships — all on one platform.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground rounded-lg px-8 h-13 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-lg px-8 h-13 text-base font-semibold">
                  <Play className="mr-2 h-4 w-4" /> How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                <span className="ml-1 font-medium">4.9/5 rating</span>
              </div>
              <span className="text-border">|</span>
              <span>8,400+ campaigns completed</span>
              <span className="text-border">|</span>
              <span>$2.4M+ paid to creators</span>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/40" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-[11px] text-muted-foreground bg-muted rounded px-3 py-0.5">app.align.com/dashboard</span>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Active Campaigns", value: "24", change: "+12%", color: "text-primary" },
                    { label: "Total Creators", value: "1,284", change: "+8%", color: "text-foreground" },
                    { label: "Collaborations", value: "342", change: "+24%", color: "text-foreground" },
                    { label: "Avg. Engagement", value: "4.8%", change: "+0.6%", color: "text-foreground" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border/60 bg-card p-3.5">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                        <span className="text-[10px] font-medium text-success">{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-lg border border-border/60 bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-muted-foreground">Campaign Performance</span>
                      <span className="text-[10px] text-muted-foreground border border-border rounded px-2 py-0.5">Last 30 days</span>
                    </div>
                    <div className="flex items-end gap-[5px] h-28">
                      {[30, 45, 35, 60, 50, 75, 55, 80, 65, 90, 70, 85, 60, 78, 65, 82, 72, 88, 75, 92].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-primary/80 hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-card p-4">
                    <span className="text-xs font-medium text-muted-foreground">Top Creators</span>
                    <div className="mt-3 space-y-2.5">
                      {[
                        { name: "Priya K.", score: 95, initials: "PK" },
                        { name: "Sarah J.", score: 92, initials: "SJ" },
                        { name: "Emma C.", score: 91, initials: "EC" },
                        { name: "Mike T.", score: 88, initials: "MT" },
                      ].map((c) => (
                        <div key={c.name} className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground">{c.initials}</div>
                          <span className="text-[11px] font-medium flex-1">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ LOGOS ═══════ */}
      <section className="py-10 border-y border-border/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground/60 mb-6">Brands on Align</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-30">
            {["TechFlow", "StyleCo", "GadgetHub", "FitLife", "ByteWare", "ShopNow", "CloudBase"].map((brand) => (
              <span key={brand} className="text-base font-bold tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold">Simple Process, Powerful Results</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Megaphone,
                title: "Post a Campaign",
                desc: "Brands define their goals, budget, timeline, and ideal creator profile. Campaigns go live in minutes.",
              },
              {
                step: "02",
                icon: Users,
                title: "Discover & Connect",
                desc: "Creators browse opportunities and submit proposals. Chillies boost priority placement. Brands review RACK scores.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Collaborate & Grow",
                desc: "Work together on deliverables, track progress, and build lasting partnerships. Both sides grow.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-8 h-full hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-4xl font-extrabold text-muted-foreground/20 font-display">{item.step}</span>
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Platform Features</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Built for Serious Collaboration</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything brands and creators need to find each other, work together, and measure results.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { icon: Flame, title: "Chillies Priority System", desc: "Creators earn or buy Chillies to boost their visibility and earn a verified badge. Free applications always available.", color: "text-accent" },
              { icon: Shield, title: "RACK Trust Score", desc: "Reliability, Activity, Content quality, and Knowledge — a transparent scoring system that builds real trust.", color: "text-primary" },
              { icon: BarChart3, title: "Campaign Analytics", desc: "Track applicants, engagement, budget utilization, and campaign performance in real-time dashboards.", color: "text-success" },
              { icon: Award, title: "Verified Badges", desc: "Stand out with time-limited verification badges. Show brands you're serious and invested in quality.", color: "text-warning" },
              { icon: Globe, title: "Creator Discovery", desc: "Advanced filters by niche, followers, engagement rate, and RACK score. Find exactly who you need.", color: "text-primary" },
              { icon: Zap, title: "Instant Messaging", desc: "Built-in chat between brands and creators. Discuss deliverables, share files, and stay aligned.", color: "text-accent" },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-6 h-full hover:border-primary/15 hover:shadow-md transition-all duration-300">
                  <feature.icon className={`h-5 w-5 ${feature.color} mb-3`} />
                  <h3 className="text-sm font-bold mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOR BRANDS / FOR CREATORS ═══════ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Link to="/brand" className="block group">
                <div className="rounded-xl border border-border/50 bg-card p-8 lg:p-10 h-full hover:border-primary/25 hover:shadow-xl transition-all duration-300">
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">For Brands</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Find the Right Creators, Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Post campaigns, review verified creator profiles with RACK scores, and build a roster of trusted collaborators. No wasted time, no guesswork.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {["Access 12,500+ verified creators", "Merit-based matching via RACK", "Built-in campaign analytics", "Secure messaging & contracts"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    View Brand Dashboard <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Creator */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }}>
              <Link to="/creator" className="block group">
                <div className="rounded-xl border border-border/50 bg-card p-8 lg:p-10 h-full hover:border-accent/25 hover:shadow-xl transition-all duration-300">
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">For Creators</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Get Seen. Get Hired. Get Paid.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Browse campaigns, submit proposals, and use Chillies to boost your visibility. Everyone can apply for free — Chillies give you the edge.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {["Free to apply — always", "Chillies boost your ranking", "Build your RACK reputation", "Earn through brand campaigns"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all">
                    View Creator Dashboard <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Testimonials</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold">What Our Community Says</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                text: "Align helped us find 50+ quality creators in our first week. The RACK scoring system saved us countless hours of manual vetting.",
                name: "David Chen",
                role: "Marketing Director, TechFlow",
                initials: "DC",
              },
              {
                text: "I went from zero brand deals to five in my first month. The Chillies system actually rewards creators who are serious about their craft.",
                name: "Priya Sharma",
                role: "Fashion & Lifestyle Creator",
                initials: "PS",
              },
              {
                text: "Finally a platform that treats creators as professionals. Transparent scoring, clear communication, and brands that respect your work.",
                name: "Alex Rodriguez",
                role: "Tech & Lifestyle Creator",
                initials: "AR",
              },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-6 h-full flex flex-col">
                  <div className="mb-4 flex gap-0.5">
                    {Array(5).fill(0).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                  <div className="mt-5 flex items-center gap-3 pt-5 border-t border-border/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 max-w-4xl mx-auto text-center">
            {[
              { value: "12,500+", label: "Active Creators" },
              { value: "3,200+", label: "Trusted Brands" },
              { value: "8,400+", label: "Campaigns Completed" },
              { value: "$2.4M+", label: "Paid to Creators" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }} viewport={{ once: true }}>
                <p className="text-3xl lg:text-4xl font-display font-extrabold gradient-text mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl gradient-primary p-12 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
                Join thousands of brands and creators already growing together. Free to start, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-card text-foreground hover:bg-card/90 rounded-lg px-8 h-12 font-semibold shadow-lg">
                    Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg px-8 h-12 font-semibold">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Index;
