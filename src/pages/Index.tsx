import { Link } from "react-router-dom";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Star, Users, Megaphone, Shield, Zap, Sparkles, Heart, TrendingUp, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const cubicEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: cubicEase as unknown as [number, number, number, number] } },
});

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PublicNavbar />

      {/* ═══════ HERO — CINEMATIC ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg">
        {/* Ambient Orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-[15%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-[10%] h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[60%] left-[50%] h-[300px] w-[300px] rounded-full bg-success/5 blur-[100px] animate-pulse-soft" style={{ animationDelay: "4s" }} />
        </div>

        {/* Orbiting Elements */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-lg glow-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit-reverse">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shadow-lg glow-accent">
              <Star className="h-4 w-4 text-accent-foreground" />
            </div>
          </div>
        </div>

        {/* Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 mb-10 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">The future of creator-brand collaboration</span>
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="mb-8 font-display text-6xl font-extrabold tracking-tight leading-[1.05] lg:text-8xl xl:text-[6.5rem]">
              <span className="block">Creators Meet</span>
              <span className="block mt-2">
                Brands on{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Align</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 rounded-full gradient-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: cubicEase as unknown as [number, number, number, number] }}
                    style={{ transformOrigin: "left" }}
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="mx-auto mb-14 max-w-xl text-lg lg:text-xl text-muted-foreground leading-relaxed font-body">
              The collaboration platform where talent meets opportunity. No barriers. Just real partnerships that grow your brand and your career.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row justify-center gap-5">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground rounded-full px-12 h-16 text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 group">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg font-semibold border-border/60 hover:bg-card hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  I'm a Brand
                </Button>
              </Link>
            </motion.div>

            {/* Floating Social Proof */}
            <motion.div {...fadeUp(0.5)} className="mt-20 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3 glass-card rounded-full px-5 py-3">
                <div className="flex -space-x-2.5">
                  {["SJ", "PK", "MT", "AR", "EC"].map((initials, i) => (
                    <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card gradient-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {initials}
                    </div>
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                    +12K
                  </div>
                </div>
                <span className="text-sm font-medium">Creators are thriving</span>
              </div>

              <div className="glass-card rounded-full px-5 py-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <span className="text-sm font-medium">4.9 out of 5</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
          </div>
        </motion.div>
      </section>

      {/* ═══════ STORYTELLING SECTION ═══════ */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true, margin: "-100px" }}>
              <p className="text-center text-sm uppercase tracking-[0.3em] text-primary font-medium mb-6">The Problem</p>
              <h2 className="text-center text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-8">
                Creators are <span className="text-muted-foreground/40 line-through decoration-destructive/40">invisible</span>.<br />
                Brands are <span className="text-muted-foreground/40 line-through decoration-destructive/40">lost</span>.<br />
                <span className="gradient-text mt-2 block">We fix that.</span>
              </h2>
              <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Every day, incredible creators go unnoticed while brands struggle to find the right voices. Align brings them together with a system built on merit, trust, and fair access.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS — VISUAL JOURNEY ═══════ */}
      <section className="py-32 bg-secondary/20 relative noise-bg">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold">Three Steps. Infinite Possibilities.</h2>
          </motion.div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />

            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: Megaphone,
                  title: "Brands Set the Stage",
                  desc: "Create a campaign in minutes. Define your vision, audience, and goals. Your perfect creators are waiting.",
                  color: "primary",
                },
                {
                  step: "02",
                  icon: Flame,
                  title: "Creators Rise Up",
                  desc: "Browse campaigns, showcase your talent, and let your work speak. Chillies 🌶️ boost your visibility to the top.",
                  color: "accent",
                },
                {
                  step: "03",
                  icon: Heart,
                  title: "Magic Happens",
                  desc: "Collaborate, create, and grow together. Build lasting partnerships that fuel both your stories.",
                  color: "success",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: cubicEase as unknown as [number, number, number, number] }}
                  viewport={{ once: true }}
                  className="hover-lift group"
                >
                  <div className="rounded-3xl bg-card border border-border/40 p-8 h-full relative overflow-hidden">
                    <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-${item.color}/5 blur-[50px] group-hover:bg-${item.color}/10 transition-colors duration-500`} />
                    <span className="text-6xl font-extrabold text-muted/60 font-display">{item.step}</span>
                    <div className={`mt-4 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color === 'primary' ? 'gradient-primary' : item.color === 'accent' ? 'bg-accent' : 'bg-success'} shadow-lg`}>
                      <item.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold font-display mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CHILLIES TEASER — EMOTIONAL ═══════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/8 blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid gap-16 lg:grid-cols-2 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: cubicEase as unknown as [number, number, number, number] }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 mb-6">
                <Flame className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Chillies 🌶️</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-6">
                Your Secret Weapon to{" "}
                <span className="gradient-text">Stand Out</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Every creator can apply for free — always. But those who want to stand out earn Chillies. They boost your priority, unlock a verified badge, and put your name at the top of every brand's list.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Get seen first by brands looking for talent" },
                  { icon: Shield, text: "Earn a verified badge that builds instant trust" },
                  { icon: TrendingUp, text: "Climb the RACK leaderboard and build your reputation" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 text-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual — Floating Chilli Cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: cubicEase as unknown as [number, number, number, number] }} viewport={{ once: true }} className="relative">
              <div className="relative h-[500px]">
                {/* Central Chilli */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-2xl glow-accent">
                    <span className="text-5xl">🌶️</span>
                  </div>
                </div>

                {/* Orbiting Cards */}
                <div className="absolute top-8 left-4 animate-float">
                  <div className="glass-card rounded-2xl p-4 w-48">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">SJ</div>
                      <div>
                        <p className="text-xs font-semibold">Sarah J.</p>
                        <p className="text-[10px] text-success font-medium">✓ Verified</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Lifestyle Creator • 125K</p>
                  </div>
                </div>

                <div className="absolute top-16 right-0 animate-float-delayed">
                  <div className="glass-card rounded-2xl p-4 w-44">
                    <p className="text-xs font-semibold mb-1">RACK Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[92%] rounded-full gradient-primary" />
                      </div>
                      <span className="text-xs font-bold">92</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 left-0 animate-float-delayed" style={{ animationDelay: "0.5s" }}>
                  <div className="glass-card rounded-2xl p-4 w-52">
                    <div className="flex items-center gap-2 mb-1">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <p className="text-xs font-semibold">New Campaign</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Brand Awareness Push</p>
                    <p className="text-[10px] text-success font-medium mt-1">34 creators interested</p>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 animate-float">
                  <div className="glass-card rounded-2xl p-4 w-40">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flame className="h-3.5 w-3.5 text-accent" />
                      <p className="text-xs font-semibold text-accent">Priority Bid</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">You're #1 in the queue</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ BRAND & CREATOR SPLIT ═══════ */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
            {/* Brand Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/brand" className="block group">
                <div className="relative rounded-3xl bg-card border border-border/40 p-10 lg:p-12 overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full">
                  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="relative z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">For Brands</p>
                    <h3 className="text-3xl font-display font-bold mb-4">Find Voices That Amplify Yours</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Access a curated network of verified creators. Post campaigns, discover perfect matches through RACK scoring, and build partnerships that drive real results.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                      Explore Brand Dashboard <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Creator Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/creator" className="block group">
                <div className="relative rounded-3xl bg-card border border-border/40 p-10 lg:p-12 overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 h-full">
                  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/5 blur-[80px] group-hover:bg-accent/10 transition-colors duration-700" />
                  <div className="relative z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Flame className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.2em] text-accent font-semibold mb-3">For Creators</p>
                    <h3 className="text-3xl font-display font-bold mb-4">Turn Your Passion Into Partnerships</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Browse premium campaigns, bid on projects you love, and earn Chillies to rise above the crowd. Free to start — always. Your talent deserves to be seen.
                    </p>
                    <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all duration-300">
                      Explore Creator Dashboard <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF — TESTIMONIALS ═══════ */}
      <section className="py-32 bg-secondary/20 relative noise-bg">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Community Love</p>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold">Real People. Real Growth.</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                text: "I went from 0 brand deals to 5 in my first month. Align's Chillies system actually works — brands noticed me instantly.",
                name: "Priya Sharma",
                role: "Fashion Creator",
                initials: "PS",
              },
              {
                text: "We found our entire creator roster for Q4 in under a week. The RACK score saved us hours of vetting. Game changer.",
                name: "TechFlow Inc.",
                role: "SaaS Brand",
                initials: "TF",
              },
              {
                text: "Other platforms felt like shouting into the void. On Align, my portfolio speaks and brands actually listen.",
                name: "Alex Rodriguez",
                role: "Lifestyle Creator",
                initials: "AR",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="hover-lift"
              >
                <div className="rounded-3xl bg-card border border-border/40 p-8 h-full flex flex-col">
                  <div className="mb-4 flex gap-1">
                    {Array(5).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-border/30">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS TICKER ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4 max-w-4xl mx-auto text-center">
            {[
              { value: "12,500+", label: "Creators", icon: Users },
              { value: "3,200+", label: "Brands", icon: Megaphone },
              { value: "8,400+", label: "Campaigns", icon: TrendingUp },
              { value: "$2.4M+", label: "Earned by Creators", icon: Zap },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08, duration: 0.5 }} viewport={{ once: true }}>
                <s.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
                <p className="text-4xl lg:text-5xl font-display font-extrabold gradient-text mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA — EMOTIONAL ═══════ */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: cubicEase as unknown as [number, number, number, number] }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-[2rem] gradient-primary p-16 lg:p-20 text-center text-primary-foreground relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="absolute top-10 right-10 text-6xl opacity-20 animate-float">🌶️</div>
            <div className="absolute bottom-10 left-10 text-4xl opacity-15 animate-float-delayed">✨</div>

            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/60 font-medium mb-6">Your Next Chapter Starts Here</p>
              <h2 className="text-4xl lg:text-6xl font-display font-extrabold mb-6 leading-tight">
                Stop Scrolling.<br />Start Aligning.
              </h2>
              <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto mb-12 leading-relaxed">
                Join the fastest-growing creator economy platform. It takes 30 seconds to start — and it's completely free.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link to="/register">
                  <Button size="lg" className="bg-card text-foreground hover:bg-card/90 rounded-full px-12 h-16 text-lg font-semibold shadow-2xl hover:scale-[1.02] transition-all duration-300">
                    Join Align Free <ArrowRight className="ml-2 h-5 w-5" />
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
