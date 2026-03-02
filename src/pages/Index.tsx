import { Link } from "react-router-dom";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, Megaphone, Users, Handshake, Star, Play, CheckCircle, Sparkles, Zap, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-accent/6 blur-[80px]" />

        <div className="container mx-auto px-4 relative">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-5xl text-center">
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-4 py-1.5 text-sm cursor-default">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> The #1 Creator-Brand Collaboration Platform
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} className="mb-6 text-5xl font-extrabold tracking-tight leading-[1.1] lg:text-7xl xl:text-8xl">
              Where Brands &<br />
              Creators{" "}
              <span className="relative">
                <span className="gradient-text">Align</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 Q50 2, 100 6 T198 4" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mx-auto mb-12 max-w-2xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Stop searching. Start collaborating. Join 12,500+ creators and 3,200+ brands already growing together on the platform built for real partnerships.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground px-10 h-14 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="px-10 h-14 text-base rounded-full group">
                  <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof Strip */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["SJ", "MT", "PK", "AR", "EC"].map((initials, i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background gradient-primary text-[10px] font-bold text-primary-foreground">
                      {initials}
                    </div>
                  ))}
                </div>
                <span>12,500+ Creators</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                <span className="ml-1">4.9/5 Rating</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>🌶️ 2.1M+ Chillies Earned</span>
            </motion.div>
          </motion.div>

          {/* Hero Visual — Floating Dashboard */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }} className="mx-auto mt-20 max-w-5xl perspective-1000">
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/8 overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/40 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-warning/50" />
                  <div className="h-3 w-3 rounded-full bg-success/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground">align.app/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-5">
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Active Campaigns", value: "24", trend: "+12%", icon: Megaphone, color: "from-primary/10 to-primary/5" },
                    { label: "Total Creators", value: "1,284", trend: "+8%", icon: Users, color: "from-accent/10 to-accent/5" },
                    { label: "Collaborations", value: "342", trend: "+24%", icon: Handshake, color: "from-success/10 to-success/5" },
                    { label: "Chillies Earned", value: "18.5K", trend: "+31%", icon: Flame, color: "from-chilli/10 to-chilli/5" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl bg-gradient-to-br ${item.color} p-4 border border-border/30`}>
                      <div className="flex items-center justify-between mb-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-[11px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">{item.trend}</span>
                      </div>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Chart Area */}
                  <div className="col-span-2 rounded-xl bg-secondary/20 border border-border/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Campaign Performance</p>
                    <div className="flex items-end gap-[6px] h-32">
                      {[35, 55, 40, 70, 50, 85, 65, 90, 55, 95, 70, 80, 60, 88, 75, 92].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm gradient-primary opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Side List */}
                  <div className="rounded-xl bg-secondary/20 border border-border/30 p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Top Creators</p>
                    <div className="space-y-3">
                      {[
                        { name: "Sarah J.", score: 92, initials: "SJ" },
                        { name: "Priya K.", score: 95, initials: "PK" },
                        { name: "Mike T.", score: 88, initials: "MT" },
                        { name: "Emma C.", score: 91, initials: "EC" },
                      ].map((c) => (
                        <div key={c.name} className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground">{c.initials}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{c.name}</p>
                          </div>
                          <span className="text-[10px] font-medium text-warning flex items-center"><Star className="h-2.5 w-2.5 mr-0.5 fill-warning" />{c.score}</span>
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

      {/* ═══════ TRUSTED BY ═══════ */}
      <section className="py-12 border-y border-border/30 bg-secondary/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Trusted by Leading Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {["TechFlow", "StyleCo", "GadgetHub", "FitLife", "ByteWare", "ShopNow"].map((brand) => (
              <span key={brand} className="text-lg font-bold tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VALUE PROPS ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Everything You Need to Collaborate</h2>
            <p className="text-lg text-muted-foreground">One platform. Brands find creators. Creators find opportunities. Everyone grows.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Megaphone, title: "Post & Discover", desc: "Brands post campaigns in seconds. Creators discover opportunities matched to their niche, audience, and style.",
                gradient: "from-primary/10 to-primary/5", iconColor: "text-primary"
              },
              {
                icon: Flame, title: "Chillies Priority 🌶️", desc: "Stand out with Chillies — your priority currency. Get verified, rank higher, and land campaigns before anyone else.",
                gradient: "from-accent/10 to-accent/5", iconColor: "text-accent"
              },
              {
                icon: Shield, title: "RACK Trust Score", desc: "Our Reliability, Activity, Content, Knowledge scoring system ensures brands work with quality creators every time.",
                gradient: "from-success/10 to-success/5", iconColor: "text-success"
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className={`group rounded-2xl bg-gradient-to-br ${item.gradient} border border-border/30 p-8 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300`}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm border border-border/30">
                  <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SPLIT CTA — BRANDS & CREATORS ═══════ */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Brand Side */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="group relative rounded-2xl bg-card border border-border/50 p-10 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-[60px]" />
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">For Brands</Badge>
              <h3 className="text-3xl font-bold mb-4">Find Your Perfect Creators</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">Access a curated network of verified creators. Post campaigns, review bids, and collaborate — all in one place.</p>
              <div className="space-y-3 mb-8">
                {["10,000+ verified creators", "Smart creator matching", "Campaign analytics & tracking"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/brand">
                <Button className="gradient-primary text-primary-foreground rounded-full px-8 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                  Explore Brand Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Creator Side */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="group relative rounded-2xl bg-card border border-border/50 p-10 overflow-hidden hover:border-accent/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent/5 blur-[60px]" />
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">For Creators</Badge>
              <h3 className="text-3xl font-bold mb-4">Land Premium Campaigns</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">Browse opportunities, submit bids, and grow your career. Use Chillies to get priority access to the best campaigns.</p>
              <div className="space-y-3 mb-8">
                {["Free to apply, always", "Chillies boost your ranking", "Build your RACK reputation"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/creator">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 rounded-full px-8">
                  Explore Creator Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 max-w-4xl mx-auto text-center">
            {[
              { value: "12,500+", label: "Active Creators", icon: Users },
              { value: "3,200+", label: "Brands", icon: TrendingUp },
              { value: "8,400+", label: "Campaigns Done", icon: Megaphone },
              { value: "$2.4M+", label: "Paid to Creators", icon: Zap },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                <p className="text-4xl font-extrabold gradient-text mb-2">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Loved by Our Community</h2>
            <p className="text-lg text-muted-foreground">Real stories from real creators and brands</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { name: "Priya Sharma", role: "Fashion Creator • 210K followers", text: "Align completely changed how I work with brands. The Chillies system gave me priority access and my income doubled in 3 months!", avatar: "PS" },
              { name: "TechFlow Inc.", role: "SaaS Brand • 24 campaigns", text: "We found 50+ quality creators in our first week. The RACK scoring ensures we only work with reliable, talented people.", avatar: "TF" },
              { name: "Alex Rodriguez", role: "Lifestyle Creator • 125K followers", text: "The free Chillies promo is genius — I got verified without spending anything. Now brands reach out to me directly!", avatar: "AR" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className="rounded-2xl bg-card border border-border/50 p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-3xl gradient-primary p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold">Ready to Align?</h2>
              <p className="mb-10 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Join the fastest-growing creator-brand platform. It's free to start — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-card text-foreground hover:bg-card/90 rounded-full px-10 h-14 text-base shadow-lg">
                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
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
