import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, DollarSign, Calendar, Eye, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCreatorProjects, getCurrentCreatorContext, type CreatorProjectListItem } from "@/lib/creator-api";

const statusColors: Record<string, string> = {
  Open: "bg-secondary text-secondary-foreground",
  "In Review": "bg-warning/10 text-warning",
  Applied: "bg-primary/10 text-primary",
  Shortlisted: "bg-success/10 text-success",
  Accepted: "bg-accent/10 text-accent",
  Rejected: "bg-destructive/10 text-destructive",
};

const CreatorProjects = () => {
  const [projects, setProjects] = useState<CreatorProjectListItem[]>([]);
  const [userInitials, setUserInitials] = useState("CR");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentCreatorContext();
        const rows = await fetchCreatorProjects(context.userId);
        if (!active) return;
        setUserInitials(context.initials);
        setProjects(rows);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load projects.";
        toast({ title: "Projects error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Projects" userInitials={userInitials}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Available Projects</h2>
          <p className="text-sm text-muted-foreground">Browse live campaigns, track your bids, and apply with or without Chillies.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                  <div className="mt-6 h-9 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group transition-all hover:border-primary/20 hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <Badge variant="secondary" className={statusColors[project.status] ?? "bg-muted text-muted-foreground"}>{project.status}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-accent" />{project.chillies} req.
                    </Badge>
                  </div>
                  <h3 className="mb-1 font-semibold transition-colors group-hover:text-primary">{project.name}</h3>
                  <p className="mb-4 flex items-center gap-1 text-xs text-muted-foreground"><Building className="h-3 w-3" />{project.brand}</p>
                  <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" />{project.budget}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{project.deadline}</div>
                    <div className="text-muted-foreground">{project.category}</div>
                  </div>
                  <Link to={`/creator/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="w-full"><Eye className="mr-2 h-3 w-3" />{project.hasBid ? "View Bid" : "View & Bid"}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No open campaigns are available right now. Check back soon for new brand projects.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreatorProjects;
