import { Link } from "react-router-dom";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Star, Users, Megaphone, Shield, Zap, TrendingUp, CheckCircle, BarChart3, Globe, Award, Play, Sparkles, Heart, Target, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  // Handle hash scroll on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <PublicNavbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-36 overflow-hidden">
        {/* Background ambient effects */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/6 blur-[140px]" />
        <div className="pointer-events-none absolute top-40 -right-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-40 h-[300px] w-[300px] rounded-full bg-primary/4 blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-muted-foreground">Trusted by 3,200+ brands & 12,500+ creators</span>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-6 font-display text-5xl font-extrabold tracking-tight leading-[1.1] lg:text-6xl xl:text-7xl">
                The Smarter Way to{" "}
                <span className="gradient-text">Collaborate</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-10 text-lg text-muted-foreground leading-relaxed">
                Align connects brands with verified creators through merit-based matching. Post campaigns, discover talent, and build partnerships — all on one platform.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="gradient-primary text-primary-foreground rounded-lg px-8 h-13 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Button size="lg" variant="outline" className="rounded-lg px-8 h-13 text-base font-semibold">
                    <Play className="mr-2 h-4 w-4" /> How It Works
                  </Button>
                </button>
              </motion.div>

              {/* Trust row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-10 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}
                  <span className="ml-1 font-medium">4.9/5</span>
                </div>
                <span className="text-border">•</span>
                <span>8,400+ campaigns</span>
                <span className="text-border">•</span>
                <span>$2.4M+ paid out</span>
              </motion.div>
            </div>

            {/* Right: Abstract hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Outer glow ring */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-border/30 animate-pulse-soft" />
              <div className="absolute w-[340px] h-[340px] rounded-full border border-primary/10" />

              {/* Central orb */}
              <div className="relative w-64 h-64 rounded-full gradient-primary glow-primary flex items-center justify-center">
                <div className="absolute inset-2 rounded-full bg-background/10 backdrop-blur-sm" />
                <Flame className="h-16 w-16 text-primary-foreground relative z-10" />
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 right-6 glass-card rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Campaign Match</p>
                    <p className="text-[10px] text-success font-semibold">98% Compatible</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 left-0 glass-card rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Flame className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Chillies Earned</p>
                    <p className="text-[10px] text-accent font-semibold">+50 🌶️ Today</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 10, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -left-8 -translate-y-1/2 glass-card rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">RACK Score</p>
                    <p className="text-[10px] text-success font-semibold">92 / 100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [4, -8, 4] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-4 glass-card rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" />
                  <span className="text-[11px] font-bold">12.5k Creators</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-6, 5, -6] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-0 glass-card rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-warning" />
                  <span className="text-[11px] font-bold">Verified ✓</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
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
      <section id="how-it-works" className="py-24 lg:py-32 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm uppercase tracking-widest text-primary font-medium mb-3">How It Works</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="text-3xl lg:text-4xl font-display font-bold">Simple Process, Powerful Results</motion.h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Megaphone, title: "Post a Campaign", desc: "Brands define their goals, budget, timeline, and ideal creator profile. Campaigns go live in minutes." },
              { step: "02", icon: Users, title: "Discover & Connect", desc: "Creators browse opportunities and submit proposals. Chillies boost priority placement. Brands review RACK scores." },
              { step: "03", icon: TrendingUp, title: "Collaborate & Grow", desc: "Work together on deliverables, track progress, and build lasting partnerships. Both sides grow." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.5 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-8 h-full hover:border-primary/20 hover:shadow-lg transition-all duration-300 group hover-lift">
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
      <section id="features" className="py-24 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Platform Features</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="text-3xl lg:text-4xl font-display font-bold mb-4">Built for Serious Collaboration</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-xl mx-auto">Everything brands and creators need to find each other, work together, and measure results.</motion.p>
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
              <motion.div key={i} initial={{ opacity: 0, y: 25, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.07, duration: 0.45 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-6 h-full hover:border-primary/15 hover:shadow-md transition-all duration-300 hover-lift">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
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
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Link to="/brand" className="block group">
                <div className="rounded-xl border border-border/50 bg-card p-8 lg:p-10 h-full hover:border-primary/25 hover:shadow-xl transition-all duration-300 hover-lift">
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">For Brands</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Find the Right Creators, Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Post campaigns, review verified creator profiles with RACK scores, and build a roster of trusted collaborators.
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

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }} viewport={{ once: true }}>
              <Link to="/creator" className="block group">
                <div className="rounded-xl border border-border/50 bg-card p-8 lg:p-10 h-full hover:border-accent/25 hover:shadow-xl transition-all duration-300 hover-lift">
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">For Creators</p>
                  <h3 className="text-2xl font-display font-bold mb-3">Get Seen. Get Hired. Get Paid.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Browse campaigns, submit proposals, and use Chillies to boost your visibility. Everyone can apply for free.
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
      <section id="testimonials" className="py-24 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Testimonials</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="text-3xl lg:text-4xl font-display font-bold">What Our Community Says</motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { text: "Align helped us find 50+ quality creators in our first week. The RACK scoring system saved us countless hours of manual vetting.", name: "David Chen", role: "Marketing Director, TechFlow", initials: "DC" },
              { text: "I went from zero brand deals to five in my first month. The Chillies system actually rewards creators who are serious about their craft.", name: "Priya Sharma", role: "Fashion & Lifestyle Creator", initials: "PS" },
              { text: "Finally a platform that treats creators as professionals. Transparent scoring, clear communication, and brands that respect your work.", name: "Alex Rodriguez", role: "Tech & Lifestyle Creator", initials: "AR" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-6 h-full flex flex-col hover-lift">
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

      {/* ═══════ ABOUT ═══════ */}
      <section id="about" className="py-24 lg:py-32 scroll-mt-20 relative overflow-hidden">
        <div className="pointer-events-none absolute top-20 -right-60 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm uppercase tracking-widest text-primary font-medium mb-3">About Align</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="text-3xl lg:text-5xl font-display font-bold mb-5">Built for the Creator Economy</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              We believe every creator deserves equal access to opportunities — and every brand deserves quality collaborations. Align makes it happen.
            </motion.p>
          </div>

          {/* Vision & Mission */}
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <div className="rounded-xl border border-primary/15 bg-card p-8 h-full hover-lift group">
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-shadow">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">To be the world's most trusted collaboration platform where brands and creators align seamlessly, powered by transparent merit-based systems.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <div className="rounded-xl border border-accent/15 bg-card p-8 h-full hover-lift group">
                <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-shadow">
                  <Eye className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">Democratize brand-creator collaborations through our Chillies priority system, RACK scoring, and zero-barrier applications.</p>
              </div>
            </motion.div>
          </div>

          {/* Why Align Exists */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-16">
            {[
              { icon: Heart, title: "Fair Access", desc: "Every creator can apply for free. No paywalls, no gatekeeping. Chillies only boost priority — they never block access.", color: "text-destructive" },
              { icon: Shield, title: "Trust & Transparency", desc: "Our RACK scoring system ensures quality. Brands see real metrics. Creators build real reputations.", color: "text-primary" },
              { icon: Users, title: "Community First", desc: "Align is built by creators, for creators and brands. We reinvest in the community through free Chillies promotions.", color: "text-accent" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border/50 bg-card p-7 h-full hover-lift">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-border/50 bg-card p-10 lg:p-14 max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { value: "12,500+", label: "Active Creators" },
                { value: "3,200+", label: "Trusted Brands" },
                { value: "8,400+", label: "Campaigns Completed" },
                { value: "$2.4M+", label: "Paid to Creators" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.08, duration: 0.5 }} viewport={{ once: true }}>
                  <p className="text-3xl lg:text-4xl font-display font-extrabold gradient-text mb-1">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl rounded-2xl gradient-primary p-12 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
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
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Index;
