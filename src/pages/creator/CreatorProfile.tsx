import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, Shield, Instagram, Youtube, MapPin, Calendar, Briefcase, ExternalLink } from "lucide-react";

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
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl gradient-primary text-xl sm:text-2xl font-bold text-primary-foreground">SJ</div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-success flex items-center justify-center text-xs text-success-foreground">✓</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold">Sarah Johnson</h2>
                <Badge className="bg-success/10 text-success"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
                <Badge className="bg-accent/10 text-accent"><Flame className="h-3 w-3 mr-1" />245</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Lifestyle & tech content creator passionate about authentic storytelling. 3+ years creating engaging content for brands across Instagram and YouTube.</p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 shrink-0" />Los Angeles, CA</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4 shrink-0" />Joined Sep 2024</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href="https://instagram.com/sarahjcreates" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 text-pink-600 px-3 py-1.5 text-xs font-medium hover:bg-pink-500/20 transition-colors">
                  <Instagram className="h-3.5 w-3.5" />Instagram
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://youtube.com/@sarahjohnson" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-500/20 transition-colors">
                  <Youtube className="h-3.5 w-3.5" />YouTube
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://tiktok.com/@sarahjcreates" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 text-foreground px-3 py-1.5 text-xs font-medium hover:bg-foreground/20 transition-colors">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.97a8.35 8.35 0 0 0 4.77 1.52V7.04a4.84 4.84 0 0 1-1.01-.35z"/></svg>
                  TikTok
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://snapchat.com/add/sarahjcreates" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-600 px-3 py-1.5 text-xs font-medium hover:bg-yellow-500/20 transition-colors">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.41 7.15-1.76 8.28a.74.74 0 0 1-1.06.46l-2.69-2-1.42 1.37a.5.5 0 0 1-.47.13l.21-3.06 5.53-5a.24.24 0 0 0-.29-.38L8.69 13.5l-2.63-.82a.49.49 0 0 1 0-.94l10.25-3.94a.74.74 0 0 1 1.1.55z"/></svg>
                  Snapchat
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto shrink-0">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <Card><CardContent className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-bold">125K</p><p className="text-[10px] sm:text-xs text-muted-foreground">Followers</p></CardContent></Card>
        <Card><CardContent className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-bold">4.8%</p><p className="text-[10px] sm:text-xs text-muted-foreground">Engagement</p></CardContent></Card>
        <Card><CardContent className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-1"><Star className="h-4 w-4 text-warning" />92</p><p className="text-[10px] sm:text-xs text-muted-foreground">RACK Score</p></CardContent></Card>
        <Card><CardContent className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-bold text-accent flex items-center justify-center gap-1"><Flame className="h-4 w-4" />245</p><p className="text-[10px] sm:text-xs text-muted-foreground">Chillies</p></CardContent></Card>
        <Card className="col-span-2 sm:col-span-1"><CardContent className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-bold">18</p><p className="text-[10px] sm:text-xs text-muted-foreground">Collaborations</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">RACK Score Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[
              { label: "Reliability", score: 95, desc: "On-time delivery rate" },
              { label: "Activity", score: 88, desc: "Platform engagement" },
              { label: "Content Quality", score: 94, desc: "Content rating average" },
              { label: "Knowledge", score: 91, desc: "Niche expertise level" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div className="relative mx-auto mb-2 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-4 border-primary">
                  <span className="text-base sm:text-lg font-bold">{r.score}</span>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
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
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default CreatorProfile;