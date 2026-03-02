import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, Shield, Instagram, Youtube, MapPin, Calendar, Briefcase } from "lucide-react";

const pastCollabs = [
  { brand: "TechFlow Inc.", campaign: "SaaS Product Launch", earned: "$1,200", date: "Feb 2026" },
  { brand: "StyleCo", campaign: "Summer Fashion Line", earned: "$800", date: "Jan 2026" },
  { brand: "FitLife", campaign: "Fitness App Promo", earned: "$500", date: "Dec 2025" },
  { brand: "GadgetHub", campaign: "Tech Review Series", earned: "$1,500", date: "Nov 2025" },
];

const CreatorProfile = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Profile" userInitials="SJ">
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-primary-foreground">SJ</div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success flex items-center justify-center text-xs text-success-foreground">✓</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Sarah Johnson</h2>
                <Badge className="bg-success/10 text-success"><Shield className="h-3 w-3 mr-1" />Verified Creator</Badge>
                <Badge className="bg-accent/10 text-accent"><Flame className="h-3 w-3 mr-1" />245 Chillies</Badge>
              </div>
              <p className="text-muted-foreground mb-4">Lifestyle & tech content creator passionate about authentic storytelling. 3+ years creating engaging content for brands across Instagram and YouTube.</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Instagram className="h-4 w-4" />@sarahjcreates</span>
                <span className="flex items-center gap-1"><Youtube className="h-4 w-4" />Sarah Johnson</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />Los Angeles, CA</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined Sep 2024</span>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">125K</p><p className="text-xs text-muted-foreground">Followers</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">4.8%</p><p className="text-xs text-muted-foreground">Engagement</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold flex items-center justify-center gap-1"><Star className="h-4 w-4 text-warning" />92</p><p className="text-xs text-muted-foreground">RACK Score</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-accent flex items-center justify-center gap-1"><Flame className="h-4 w-4" />245</p><p className="text-xs text-muted-foreground">Chillies</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">18</p><p className="text-xs text-muted-foreground">Collaborations</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">RACK Score Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Reliability", score: 95, desc: "On-time delivery rate" },
              { label: "Activity", score: 88, desc: "Platform engagement" },
              { label: "Content Quality", score: 94, desc: "Content rating average" },
              { label: "Knowledge", score: 91, desc: "Niche expertise level" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary">
                  <span className="text-lg font-bold">{r.score}</span>
                </div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Past Collaborations</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Brand</th><th className="pb-3 font-medium">Campaign</th><th className="pb-3 font-medium">Earned</th><th className="pb-3 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {pastCollabs.map(c => (
                <tr key={c.campaign} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium">{c.brand}</td>
                  <td className="py-3 text-muted-foreground">{c.campaign}</td>
                  <td className="py-3 font-medium text-success">{c.earned}</td>
                  <td className="py-3 text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default CreatorProfile;
