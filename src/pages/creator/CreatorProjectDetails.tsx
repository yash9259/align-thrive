import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flame, ArrowLeft, DollarSign, Calendar, Building, CheckCircle, Zap } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchCreatorProjectDetails, getCurrentCreatorContext, submitCreatorBid, type CreatorProjectDetailsData } from "@/lib/creator-api";

const emptyProject: CreatorProjectDetailsData = {
  id: "",
  title: "",
  description: "",
  brandId: "",
  brandName: "",
  brandIndustry: "",
  brandLocation: "",
  brandCampaignCount: 0,
  budgetLabel: "Budget on request",
  budgetValue: 0,
  deadline: null,
  priorityChilliesCost: 0,
  deliverables: [],
  totalBids: 0,
  avgBidAmount: 0,
  category: "General",
  platform: "Any",
  status: "open",
  existingBid: null,
};

const CreatorProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<CreatorProjectDetailsData>(emptyProject);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("CR");
  const [chilliesBalance, setChilliesBalance] = useState(0);
  const [bidAmount, setBidAmount] = useState("0");
  const [coverMessage, setCoverMessage] = useState("");
  const [bidMode, setBidMode] = useState<"priority" | "normal">("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) return;
      try {
        const context = await getCurrentCreatorContext();
        const data = await fetchCreatorProjectDetails(context.userId, id);
        if (!active) return;
        setCreatorId(context.userId);
        setUserInitials(context.initials);
        setChilliesBalance(context.chilliesBalance);
        setProject(data);
        setBidAmount(String(data.existingBid?.amount ?? Math.max(data.budgetValue, 0)));
        setCoverMessage(data.existingBid?.coverMessage ?? "");
        setBidMode(data.existingBid?.usedChillies ? "priority" : "normal");
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load project.";
        toast({ title: "Project error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [id, toast]);

  const handleSubmitBid = async () => {
    if (!creatorId || !id) return;
    const amountValue = Number(bidAmount);
    if (!amountValue || amountValue <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid bid amount.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitCreatorBid(creatorId, id, amountValue, coverMessage, bidMode === "priority");
      const refreshed = await fetchCreatorProjectDetails(creatorId, id);
      setProject(refreshed);
      setBidMode(refreshed.existingBid?.usedChillies ? "priority" : "normal");
      setChilliesBalance((prev) => Math.max(0, prev - (bidMode === "priority" && !project.existingBid?.usedChillies ? project.priorityChilliesCost : 0)));
      toast({ title: project.existingBid ? "Bid updated" : "Bid submitted", description: "Your application is now live for the brand." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit bid.";
      toast({ title: "Bid failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Project Details" userInitials={userInitials}>
      <div className="space-y-6">
        <Link to="/creator/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Badge className="mb-2 bg-primary/10 text-primary">{project.existingBid ? project.existingBid.status.replace(/\b\w/g, (c) => c.toUpperCase()) : project.status.replace(/_/g, " ")}</Badge>
                <h2 className="mb-1 text-2xl font-bold">{isLoading ? "Loading..." : project.title}</h2>
                <p className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><Building className="h-4 w-4" />{project.brandName}</p>
                <p className="mb-6 text-sm text-muted-foreground">{project.description || "Campaign description will appear here."}</p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <DollarSign className="mx-auto mb-1 h-4 w-4 text-success" />
                    <p className="text-lg font-bold">{project.budgetLabel}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Calendar className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-lg font-bold">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Flexible"}</p>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Flame className="mx-auto mb-1 h-4 w-4 text-accent" />
                    <p className="text-lg font-bold">{project.priorityChilliesCost}</p>
                    <p className="text-xs text-muted-foreground">Priority Cost</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <CheckCircle className="mx-auto mb-1 h-4 w-4 text-success" />
                    <p className="text-lg font-bold">{project.deliverables.length}</p>
                    <p className="text-xs text-muted-foreground">Deliverables</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Deliverables</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.deliverables.length ? project.deliverables.map((deliverable) => (
                    <div key={deliverable} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                      <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                      <span className="text-sm">{deliverable}</span>
                    </div>
                  )) : (
                    <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                      This campaign has no deliverables listed yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Brand Profile</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground">{project.brandName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                  <div>
                    <p className="font-semibold">{project.brandName}</p>
                    <p className="text-xs text-muted-foreground">{project.brandIndustry} • {project.brandLocation} • {project.brandCampaignCount} campaigns posted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-accent" /> {project.existingBid ? "Update Your Bid" : "Submit Your Bid"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Bid Amount ($)</Label>
                  <Input type="number" value={bidAmount} onChange={(event) => setBidAmount(event.target.value)} />
                </div>
                <div>
                  <Label>Cover Message</Label>
                  <Textarea value={coverMessage} onChange={(event) => setCoverMessage(event.target.value)} rows={4} placeholder="Tell the brand why you're a strong fit for this campaign." />
                </div>
                <div>
                  <Label>Application Type</Label>
                  <div className="mt-2 grid gap-2">
                    <button
                      type="button"
                      onClick={() => setBidMode("priority")}
                      className={`rounded-lg border p-3 text-left transition-colors ${bidMode === "priority" ? "border-accent bg-accent/10" : "border-border hover:bg-secondary/30"}`}
                    >
                      <p className="flex items-center gap-1 text-sm font-medium text-accent">
                        <Flame className="h-3.5 w-3.5" /> Priority application ({project.priorityChilliesCost} Chillies)
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Your bid appears higher in the brand's queue.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidMode("normal")}
                      className={`rounded-lg border p-3 text-left transition-colors ${bidMode === "normal" ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/30"}`}
                    >
                      <p className="text-sm font-medium">Normal application (0 Chillies)</p>
                      <p className="mt-1 text-xs text-muted-foreground">Submit without spending Chillies.</p>
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-accent/10 p-3">
                  <p className="mb-1 flex items-center gap-1 text-xs font-medium text-accent">
                    <Flame className="h-3 w-3" /> Chillies Boost
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bidMode === "priority"
                      ? `You are applying with ${project.priorityChilliesCost} Chillies for priority placement.`
                      : "You are applying without Chillies as a normal application."}
                  </p>
                  <p className="mt-1 text-xs font-medium text-accent">Your balance: {chilliesBalance} Chillies</p>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={() => void handleSubmitBid()} disabled={isSubmitting || isLoading}>
                  {isSubmitting ? "Saving..." : bidMode === "priority" ? `Submit Priority Bid (${project.priorityChilliesCost} ???)` : "Submit Normal Bid (0 ???)"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Project Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Bids</span><span className="font-medium">{project.totalBids}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Avg Bid</span><span className="font-medium">${project.avgBidAmount.toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{project.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">{project.platform}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorProjectDetails;
