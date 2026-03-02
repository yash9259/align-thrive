import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, ArrowLeft, DollarSign, Calendar, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const creatorBids = [
  { name: "Sarah Johnson", niche: "Lifestyle", followers: "125K", rack: 92, chillies: 45, bid: "$350", verified: true, priority: true },
  { name: "Mike Thompson", niche: "Tech", followers: "89K", rack: 88, chillies: 20, bid: "$280", verified: true, priority: false },
  { name: "Priya Kapoor", niche: "Fashion", followers: "210K", rack: 95, chillies: 100, bid: "$500", verified: true, priority: true },
  { name: "Alex Rivera", niche: "Fitness", followers: "67K", rack: 78, chillies: 0, bid: "$200", verified: false, priority: false },
  { name: "Emma Chen", niche: "Food", followers: "156K", rack: 91, chillies: 30, bid: "$400", verified: true, priority: true },
];

const BrandCampaignDetails = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Campaign Details" userInitials="TF">
    <div className="space-y-6">
      <Link to="/brand/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Campaigns
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-success/10 text-success mb-2">Open</Badge>
                  <h2 className="text-2xl font-bold">Brand Awareness Campaign</h2>
                  <p className="text-muted-foreground">by TechFlow Inc.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                We're looking for lifestyle and tech creators with 10K+ followers to create Instagram posts, stories, and reels showcasing our new product line. Content should be authentic, engaging, and align with our brand values.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <DollarSign className="h-4 w-4 mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold">$2,500</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">Mar 15</p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Target className="h-4 w-4 mx-auto mb-1 text-accent" />
                  <p className="text-lg font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Deliverables</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Flame className="h-4 w-4 mx-auto mb-1 text-chilli" />
                  <p className="text-lg font-bold">30</p>
                  <p className="text-xs text-muted-foreground">Chillies Req.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Deliverables</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["2x Instagram Feed Posts with product showcase", "3x Instagram Stories with swipe-up links", "1x Instagram Reel (30-60 seconds)"].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm">{d}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Campaign Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">Lifestyle</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">Instagram</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">2 Weeks</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Min Followers</span><span className="font-medium">10,000</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Applications</span><span className="font-medium">34</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Creator Bids</CardTitle>
            <Badge variant="secondary">{creatorBids.length} bids</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {creatorBids.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {c.verified && <Badge className="bg-success/10 text-success text-[10px] px-1.5">✓ Verified</Badge>}
                      {c.priority && <Badge className="bg-accent/10 text-accent text-[10px] px-1.5"><Flame className="h-2.5 w-2.5 mr-0.5" />Priority</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{c.niche}</span>
                      <span>{c.followers} followers</span>
                      <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-warning" />RACK: {c.rack}</span>
                      {c.chillies > 0 && <span className="flex items-center gap-0.5 text-accent"><Flame className="h-3 w-3" />{c.chillies}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-success">{c.bid}</span>
                  <Button size="sm" variant="outline">Shortlist</Button>
                  <Button size="sm" className="gradient-primary text-primary-foreground">Invite</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default BrandCampaignDetails;
