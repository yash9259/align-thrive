import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, Shield, Users, Zap } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">About Align</Badge>
        <h1 className="mb-4 text-4xl font-extrabold lg:text-5xl">Built for the Creator Economy</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          We believe every creator deserves equal access to opportunities — and every brand deserves quality collaborations. Align makes it happen.
        </p>
      </div>
    </section>

    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">To be the world's most trusted collaboration platform where brands and creators align seamlessly, powered by transparent merit-based systems.</p>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="p-8">
              <Eye className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">Democratize brand-creator collaborations through our Chillies priority system, RACK scoring, and zero-barrier applications.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Align Exists</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { icon: Heart, title: "Fair Access", desc: "Every creator can apply for free. No paywalls, no gatekeeping. Chillies only boost priority — they never block access." },
            { icon: Shield, title: "Trust & Transparency", desc: "Our RACK scoring system ensures quality. Brands see real metrics. Creators build real reputations." },
            { icon: Users, title: "Community First", desc: "Align is built by creators, for creators and brands. We reinvest in the community through free Chillies promotions." },
          ].map((item, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Mission in Action</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Merit-Based Matching",
                desc: "Our platform connects brands with creators based on genuine fit — not follower counts. RACK scores reflect real reliability, activity, content quality, and knowledge.",
              },
              {
                title: "Zero-Barrier Access",
                desc: "Every creator can apply to any campaign for free. Chillies only boost visibility — they never block anyone from applying or being considered.",
              },
              {
                title: "Transparent Growth",
                desc: "Brands see verified creator metrics. Creators build real reputations. Both sides grow together through clear expectations and honest collaboration.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default About;
