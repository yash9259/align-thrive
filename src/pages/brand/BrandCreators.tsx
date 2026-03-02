import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Star, Search, Filter, Instagram, Youtube, Twitter } from "lucide-react";

const creators = [
  { name: "Sarah Johnson", niche: "Lifestyle", followers: "125K", engagement: "4.8%", rack: 92, chillies: 245, verified: true, platform: "instagram" },
  { name: "Mike Thompson", niche: "Tech", followers: "89K", engagement: "5.2%", rack: 88, chillies: 120, verified: true, platform: "youtube" },
  { name: "Priya Kapoor", niche: "Fashion", followers: "210K", engagement: "3.9%", rack: 95, chillies: 380, verified: true, platform: "instagram" },
  { name: "Alex Rivera", niche: "Fitness", followers: "67K", engagement: "6.1%", rack: 78, chillies: 50, verified: false, platform: "instagram" },
  { name: "Emma Chen", niche: "Food", followers: "156K", engagement: "4.5%", rack: 91, chillies: 200, verified: true, platform: "youtube" },
  { name: "Jordan Williams", niche: "Travel", followers: "342K", engagement: "3.2%", rack: 89, chillies: 310, verified: true, platform: "instagram" },
  { name: "Lisa Park", niche: "Beauty", followers: "98K", engagement: "5.7%", rack: 85, chillies: 175, verified: true, platform: "instagram" },
  { name: "David Kumar", niche: "Tech", followers: "178K", engagement: "4.1%", rack: 93, chillies: 290, verified: true, platform: "twitter" },
];

const platformIcon: Record<string, any> = { instagram: Instagram, youtube: Youtube, twitter: Twitter };

const BrandCreators = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Discover Creators" userInitials="TF">
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search creators by name, niche..." className="pl-9" />
        </div>
        <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Followers</SelectItem>
            <SelectItem value="10k">10K+</SelectItem>
            <SelectItem value="50k">50K+</SelectItem>
            <SelectItem value="100k">100K+</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="rack"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rack">RACK Score</SelectItem>
            <SelectItem value="followers">Followers</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
            <SelectItem value="chillies">Chillies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {creators.map((c) => {
          const PlatformIcon = platformIcon[c.platform] || Instagram;
          return (
            <Card key={c.name} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    {c.verified && <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-success flex items-center justify-center text-[8px] text-success-foreground">✓</div>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><PlatformIcon className="h-3 w-3" />{c.niche}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded bg-secondary/50 p-2 text-center">
                    <p className="text-sm font-bold">{c.followers}</p>
                    <p className="text-[10px] text-muted-foreground">Followers</p>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 text-center">
                    <p className="text-sm font-bold">{c.engagement}</p>
                    <p className="text-[10px] text-muted-foreground">Engagement</p>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 text-center">
                    <p className="text-sm font-bold flex items-center justify-center gap-0.5"><Star className="h-3 w-3 text-warning" />{c.rack}</p>
                    <p className="text-[10px] text-muted-foreground">RACK Score</p>
                  </div>
                  <div className="rounded bg-secondary/50 p-2 text-center">
                    <p className="text-sm font-bold flex items-center justify-center gap-0.5 text-accent"><Flame className="h-3 w-3" />{c.chillies}</p>
                    <p className="text-[10px] text-muted-foreground">Chillies</p>
                  </div>
                </div>
                <Button size="sm" className="w-full gradient-primary text-primary-foreground">Invite to Campaign</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
);

export default BrandCreators;
