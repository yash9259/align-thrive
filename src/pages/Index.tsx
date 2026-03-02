import { Link } from "react-router-dom";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, Megaphone, Users, Handshake, CheckCircle, Star, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Flame className="mr-1 h-3 w-3" /> Powered by Chillies 🌶️
            </Badge>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
              Where Brands & Creators{" "}
              <span className="gradient-text">Align</span>{" "}
              to Grow Together
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              The collaboration platform that connects brands with top creators. Use our Chillies 🌶️ priority system to stand out, get verified, and land premium campaigns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-base">
                  Join as Brand <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                  Join as Creator <Flame className="ml-2 h-4 w-4 text-accent" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Mock Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <span className="ml-2 text-xs text-muted-foreground">align.app/dashboard</span>
              </div>
              <div className="grid grid-cols-4 gap-3 p-4">
                {[
                  { label: "Active Campaigns", value: "24", icon: Megaphone, color: "text-primary" },
                  { label: "Creators", value: "1,284", icon: Users, color: "text-accent" },
                  { label: "Collaborations", value: "342", icon: Handshake, color: "text-success" },
                  { label: "Chillies Earned", value: "18.5K", icon: Flame, color: "text-chilli" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-secondary/50 p-4">
                    <item.icon className={`h-5 w-5 ${item.color} mb-2`} />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                <div className="col-span-2 rounded-lg bg-secondary/30 p-4 h-40 flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t gradient-primary" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="rounded-lg bg-secondary/30 p-4 h-40 flex flex-col justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Top Creators</p>
                  {["Sarah J.", "Mike T.", "Priya K.", "Alex R."].map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full gradient-primary" />
                      <span className="text-xs">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">How Align Works</h2>
            <p className="text-muted-foreground">Three simple steps to powerful collaborations</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { icon: Megaphone, title: "Brands Post Campaigns", desc: "Create campaigns with budgets, deliverables, and timelines. Reach thousands of verified creators instantly." },
              { icon: Users, title: "Creators Apply or Bid", desc: "Browse campaigns, submit proposals, and use Chillies 🌶️ to boost your visibility and priority." },
              { icon: Handshake, title: "Collaborate & Grow", desc: "Work together, deliver content, get paid. Build lasting partnerships and grow your portfolio." },
            ].map((item, i) => (
              <Card key={i} className="group relative overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">Step {i + 1}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chillies System */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">🌶️ Chillies System</Badge>
            <h2 className="mb-3 text-3xl font-bold">The Priority Currency That Sets You Apart</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every creator can apply for free. But with Chillies, you get a verification badge, top priority in search results, and higher chances of landing campaigns.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-12">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-accent" /> Project Chillies Required
                </h3>
                <div className="space-y-3">
                  {[
                    { range: "$0 – $50", chillies: 10 },
                    { range: "$50 – $200", chillies: 20 },
                    { range: "$200 – $500", chillies: 30 },
                    { range: "$500 – $1,000", chillies: 50 },
                    { range: "$1,000 – $5,000", chillies: 100 },
                    { range: "$5,000+", chillies: 150 },
                  ].map((item) => (
                    <div key={item.range} className="flex items-center justify-between rounded-lg bg-card p-3 border border-border/50">
                      <span className="text-sm font-medium">{item.range}</span>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        🌶️ {item.chillies} Chillies
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Buy Chillies
                </h3>
                <div className="space-y-3">
                  {[
                    { chillies: 10, price: "$3", badge: "1 week" },
                    { chillies: 50, price: "$8", badge: "15 days" },
                    { chillies: 100, price: "$10", badge: "30 days" },
                    { chillies: 300, price: "$15", badge: "45 days" },
                    { chillies: 500, price: "$22", badge: "60 days" },
                  ].map((item) => (
                    <div key={item.chillies} className="flex items-center justify-between rounded-lg bg-card p-3 border border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-accent">🌶️ {item.chillies}</span>
                        <span className="text-sm text-muted-foreground">— {item.price}</span>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <CheckCircle className="mr-1 h-3 w-3" /> {item.badge} badge
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Free Chillies Promotion */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-success/20 bg-gradient-to-r from-success/5 to-primary/5">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-success" /> Earn Free Chillies!
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-card p-4 border border-border/50">
                    <p className="font-semibold mb-1">📸 Upload an Image Post</p>
                    <p className="text-sm text-muted-foreground">Post about Align on social media and earn <span className="font-bold text-accent">10 Chillies + 15-day verification badge</span></p>
                  </div>
                  <div className="rounded-lg bg-card p-4 border border-border/50">
                    <p className="font-semibold mb-1">🎬 Upload a Reel/Video</p>
                    <p className="text-sm text-muted-foreground">Create a video about Align and earn <span className="font-bold text-accent">50 Chillies + 50-day verification badge</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Brands / For Creators */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">For Brands</Badge>
                <h3 className="mb-4 text-2xl font-bold">Scale Your Influence</h3>
                <ul className="space-y-3">
                  {[
                    "Access 10,000+ verified creators",
                    "Post campaigns with flexible budgets",
                    "AI-powered creator matching",
                    "RACK score for quality assurance",
                    "Real-time campaign analytics",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/brand" className="mt-6 inline-block">
                  <Button className="gradient-primary text-primary-foreground">Explore Brand Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">For Creators</Badge>
                <h3 className="mb-4 text-2xl font-bold">Monetize Your Talent</h3>
                <ul className="space-y-3">
                  {[
                    "Browse & bid on premium campaigns",
                    "Free to apply — Chillies for priority",
                    "Get verified with Chillies badges",
                    "Build your RACK reputation score",
                    "Direct messaging with brands",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/creator" className="mt-6 inline-block">
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">Explore Creator Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Loved by Brands & Creators</h2>
            <p className="text-muted-foreground">See what our community has to say</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { name: "Priya Sharma", role: "Fashion Creator", text: "Align's Chillies system gave me priority access to premium campaigns. My income doubled in 3 months!", avatar: "PS", rating: 5 },
              { name: "TechFlow Inc.", role: "SaaS Brand", text: "We found 50+ quality creators in our first week. The RACK scoring ensures we only work with the best.", avatar: "TF", rating: 5 },
              { name: "Alex Rodriguez", role: "Lifestyle Creator", text: "The free Chillies promo let me get verified without spending a dime. Now brands come to me!", avatar: "AR", rating: 5 },
            ].map((t, i) => (
              <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl gradient-primary p-12 text-center text-primary-foreground">
            <h2 className="mb-4 text-3xl font-bold">Ready to Align?</h2>
            <p className="mb-8 text-primary-foreground/80">Join thousands of brands and creators already growing together on Align.</p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-card text-foreground hover:bg-card/90">Get Started Free</Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Index;
