import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, DollarSign, Calendar, Eye, Building } from "lucide-react";

const projects = [
  { id: 1, name: "Reel Promotion Campaign", brand: "TechFlow Inc.", budget: "$800", status: "Applied", chillies: 20, deadline: "Mar 22, 2026", category: "Tech" },
  { id: 2, name: "Product Review Campaign", brand: "StyleCo", budget: "$1,200", status: "Shortlisted", chillies: 30, deadline: "Mar 30, 2026", category: "Fashion" },
  { id: 3, name: "Brand Awareness Push", brand: "GadgetHub", budget: "$2,500", status: "Applied", chillies: 30, deadline: "Apr 5, 2026", category: "Lifestyle" },
  { id: 4, name: "Fitness Challenge Promo", brand: "FitLife", budget: "$500", status: "Rejected", chillies: 10, deadline: "Mar 10, 2026", category: "Fitness" },
  { id: 5, name: "Holiday Season Content", brand: "ShopNow", budget: "$3,000", status: "Shortlisted", chillies: 50, deadline: "Apr 15, 2026", category: "E-Commerce" },
  { id: 6, name: "Tech Unboxing Series", brand: "ByteWare", budget: "$1,500", status: "Applied", chillies: 30, deadline: "Apr 1, 2026", category: "Tech" },
];

const statusColors: Record<string, string> = {
  "Applied": "bg-primary/10 text-primary",
  "Shortlisted": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const CreatorProjects = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Projects" userInitials="SJ">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Available Projects</h2>
        <p className="text-sm text-muted-foreground">Browse and bid on campaigns from top brands</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className={statusColors[p.status]}>{p.status}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-accent" />{p.chillies} req.
                </Badge>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4"><Building className="h-3 w-3" />{p.brand}</p>
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" />{p.budget}</div>
                <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{p.deadline}</div>
                <div className="text-muted-foreground">{p.category}</div>
              </div>
              <Link to={`/creator/projects/${p.id}`}>
                <Button variant="outline" size="sm" className="w-full"><Eye className="mr-2 h-3 w-3" />View & Bid</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default CreatorProjects;
