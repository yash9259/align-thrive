import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createBrandCampaign,
  deleteBrandCampaign,
  fetchBrandCampaignDetails,
  fetchBrandCampaigns,
  getCurrentBrandContext,
  updateBrandCampaign,
  type BrandCampaignFormInput,
  type BrandCampaignListItem,
} from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const initialCampaigns: BrandCampaignListItem[] = [];

const statusColors: Record<string, string> = {
  Open: "bg-success/10 text-success",
  "In Review": "bg-warning/10 text-warning",
  Draft: "bg-muted text-muted-foreground",
  Closed: "bg-muted text-muted-foreground",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

const emptyForm: BrandCampaignFormInput = {
  title: "",
  description: "",
  category: "General",
  platform: "Instagram",
  budgetMin: 0,
  budgetMax: 0,
  minFollowers: 0,
  minEngagementRate: 0,
  deadline: null,
  status: "draft",
  priorityChilliesCost: 0,
  deliverables: [],
};

const BrandCampaigns = () => {
  const [campaigns, setCampaigns] = useState<BrandCampaignListItem[]>(initialCampaigns);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<BrandCampaignFormInput>(emptyForm);
  const [deliverablesText, setDeliverablesText] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const context = await getCurrentBrandContext();
      setBrandId(context.userId);
      const data = await fetchBrandCampaigns(context.userId);
      setCampaigns(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load campaigns.";
      toast({ title: "Campaigns error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setDeliverablesText("");
    setEditingCampaignId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = async (campaignId: string) => {
    if (!brandId) return;
    setIsSaving(true);
    try {
      const details = await fetchBrandCampaignDetails(brandId, campaignId);
      setEditingCampaignId(campaignId);
      setForm({
        title: details.title,
        description: details.description,
        category: details.category,
        platform: details.platform,
        budgetMin: details.budgetMin ?? 0,
        budgetMax: details.budgetMax ?? 0,
        minFollowers: details.minFollowers ?? 0,
        minEngagementRate: 0,
        deadline: details.deadline,
        status: details.status as BrandCampaignFormInput["status"],
        priorityChilliesCost: details.priorityChilliesCost,
        deliverables: details.deliverables,
      });
      setDeliverablesText(details.deliverables.join("\n"));
      setIsDialogOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load campaign details.";
      toast({ title: "Edit failed", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitCampaign = async () => {
    if (!brandId) return;

    if (!form.title.trim()) {
      toast({ title: "Validation", description: "Campaign title is required.", variant: "destructive" });
      return;
    }

    if (form.budgetMax < form.budgetMin) {
      toast({ title: "Validation", description: "Budget max must be greater than or equal to budget min.", variant: "destructive" });
      return;
    }

    const payload: BrandCampaignFormInput = {
      ...form,
      deliverables: deliverablesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setIsSaving(true);
    try {
      if (editingCampaignId) {
        await updateBrandCampaign(brandId, editingCampaignId, payload);
        toast({ title: "Campaign updated", description: "Your campaign changes were saved." });
      } else {
        const newId = await createBrandCampaign(brandId, payload);
        toast({ title: "Campaign created", description: "Campaign created successfully." });
        navigate(`/brand/campaigns/${newId}`);
      }
      setIsDialogOpen(false);
      resetForm();
      await load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save campaign.";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteCampaign = async (campaignId: string) => {
    if (!brandId) return;

    const confirmed = window.confirm("Delete this campaign? This action cannot be undone.");
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await deleteBrandCampaign(brandId, campaignId);
      toast({ title: "Campaign deleted", description: "Campaign removed successfully." });
      await load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete campaign.";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const visibleCampaigns = useMemo(() => campaigns, [campaigns]);

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Campaigns" userInitials="TF">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Your Campaigns</h2>
            <p className="text-sm text-muted-foreground">Manage and track all your campaigns</p>
          </div>
          <Button className="gradient-primary text-primary-foreground w-full sm:w-auto" onClick={openCreateDialog}>
            + New Campaign
          </Button>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading campaigns...</p>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleCampaigns.map((c) => (
            <Card key={c.id} className="group hover:shadow-lg hover:border-primary/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className={statusColors[c.status] ?? "bg-muted text-muted-foreground"}>{c.status}</Badge>
                  <Badge variant="outline">{c.category}</Badge>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{c.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.desc}</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" />{c.budget}</div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />{c.applicants} bids</div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{c.deadline}</div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/brand/campaigns/${c.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Eye className="mr-2 h-3 w-3" />View Details</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => void openEditDialog(c.id)} disabled={isSaving}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => void onDeleteCampaign(c.id)} disabled={isSaving}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCampaignId ? "Edit Campaign" : "Create Campaign"}</DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingCampaignId ? "update" : "create"} your campaign.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Campaign title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe campaign goals, audience and expectations"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Fashion, Tech, Food"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={form.platform}
                    onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))}
                    placeholder="Instagram, YouTube"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Budget Min (USD)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    min={0}
                    value={form.budgetMin}
                    onChange={(e) => setForm((prev) => ({ ...prev, budgetMin: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Budget Max (USD)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    min={0}
                    value={form.budgetMax}
                    onChange={(e) => setForm((prev) => ({ ...prev, budgetMax: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minFollowers">Minimum Followers</Label>
                  <Input
                    id="minFollowers"
                    type="number"
                    min={0}
                    value={form.minFollowers}
                    onChange={(e) => setForm((prev) => ({ ...prev, minFollowers: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minEngagementRate">Minimum Engagement %</Label>
                  <Input
                    id="minEngagementRate"
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.minEngagementRate}
                    onChange={(e) => setForm((prev) => ({ ...prev, minEngagementRate: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline ? form.deadline.slice(0, 10) : ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as BrandCampaignFormInput["status"] }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorityChilliesCost">Priority Chillies Cost</Label>
                <Input
                  id="priorityChilliesCost"
                  type="number"
                  min={0}
                  value={form.priorityChilliesCost}
                  onChange={(e) => setForm((prev) => ({ ...prev, priorityChilliesCost: Number(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables (one per line)</Label>
                <Textarea
                  id="deliverables"
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="1 Reel\n3 Story frames\n1 Dedicated post"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={() => void onSubmitCampaign()} disabled={isSaving}>
                {isSaving ? "Saving..." : editingCampaignId ? "Update Campaign" : "Create Campaign"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BrandCampaigns;
