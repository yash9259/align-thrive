import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Eye } from "lucide-react";

const campaigns = [
  { id: 1, name: "Brand Awareness Campaign", desc: "Looking for lifestyle creators with 10K+ followers for Instagram posts and stories.", budget: "$2,500", status: "Open", applicants: 34, deadline: "Mar 15, 2026", category: "Lifestyle" },
  { id: 2, name: "Instagram Reel Promotion", desc: "Need creators to produce engaging reels for our new product line launch.", budget: "$800", status: "In Review", applicants: 18, deadline: "Mar 22, 2026", category: "Tech" },
  { id: 3, name: "Product Launch Campaign", desc: "Major product launch requiring multi-platform content creation.", budget: "$5,000", status: "Completed", applicants: 56, deadline: "Feb 28, 2026", category: "Fashion" },
  { id: 4, name: "Holiday Season Sale", desc: "Seasonal promotion campaign for Q4 holiday sales.", budget: "$1,200", status: "Open", applicants: 12, deadline: "Apr 1, 2026", category: "E-Commerce" },
  { id: 5, name: "Tech Review Series", desc: "Weekly tech review content series across YouTube and Instagram.", budget: "$3,000", status: "In Review", applicants: 28, deadline: "Mar 30, 2026", category: "Tech" },
  { id: 6, name: "Fitness Challenge Promo", desc: "30-day fitness challenge promotion with daily content.", budget: "$1,500", status: "Open", applicants: 22, deadline: "Apr 15, 2026", category: "Fitness" },
];

const statusColors: Record<string, string> = {
  "Open": "bg-success/10 text-success",
  "In Review": "bg-warning/10 text-warning",
  "Completed": "bg-muted text-muted-foreground",
};

const BrandCampaigns = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Campaigns" userInitials="TF">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Campaigns</h2>
          <p className="text-sm text-muted-foreground">Manage and track all your campaigns</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">+ New Campaign</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <Card key={c.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className={statusColors[c.status]}>{c.status}</Badge>
                <Badge variant="outline">{c.category}</Badge>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.desc}</p>
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" />{c.budget}</div>
                <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />{c.applicants} bids</div>
                <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{c.deadline}</div>
              </div>
              <Link to={`/brand/campaigns/${c.id}`}>
                <Button variant="outline" size="sm" className="w-full"><Eye className="mr-2 h-3 w-3" />View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default BrandCampaigns;
