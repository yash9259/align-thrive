import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Shield, Instagram, Youtube, Twitter } from "lucide-react";
import {
  fetchBrandCampaigns,
  fetchDiscoverCreators,
  fetchPendingInviteCreatorIds,
  getCurrentBrandContext,
  inviteCreatorForCampaign,
  type BrandCampaignListItem,
  type DiscoverCreator,
} from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

type Creator = DiscoverCreator;

const creators: Creator[] = [];

const platformIcon: Record<string, any> = { instagram: Instagram, youtube: Youtube, twitter: Twitter };
const getRackAvg = (r: Creator["rack"]) => Math.round((r.reliability + r.activity + r.contentQuality + r.knowledge) / 4);

const rackLabels: { key: keyof Creator["rack"]; label: string; color: string; desc: string }[] = [
  { key: "reliability", label: "Reliability", color: "bg-success", desc: "On-time delivery & responsiveness" },
  { key: "activity", label: "Activity", color: "bg-primary", desc: "Platform engagement frequency" },
  { key: "contentQuality", label: "Content Quality", color: "bg-accent", desc: "Average content rating" },
  { key: "knowledge", label: "Knowledge", color: "bg-warning", desc: "Niche expertise level" },
];

const BrandCreators = () => {
  const [data, setData] = useState<Creator[]>(creators);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [followerFilter, setFollowerFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rack");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<BrandCampaignListItem[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [pendingInviteCreatorIds, setPendingInviteCreatorIds] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const context = await getCurrentBrandContext();
        setBrandId(context.userId);

        const [creatorsData, campaigns] = await Promise.all([
          fetchDiscoverCreators(),
          fetchBrandCampaigns(context.userId),
        ]);

        setData(creatorsData);
        setCampaigns(campaigns);
        const firstOpenCampaign = campaigns.find((c) => c.status === "Open" || c.status === "In Review") ?? campaigns[0];
        setCampaignId(firstOpenCampaign?.id ?? null);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load creators.";
        toast({ title: "Creators error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const loadPendingInvites = async () => {
      if (!brandId || !campaignId) {
        setPendingInviteCreatorIds([]);
        return;
      }

      try {
        const ids = await fetchPendingInviteCreatorIds(brandId, campaignId);
        setPendingInviteCreatorIds(ids);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load invite status.";
        toast({ title: "Invite status error", description: message, variant: "destructive" });
      }
    };

    void loadPendingInvites();
  }, [brandId, campaignId, toast]);

  const parseFollowers = (value: string) => {
    const num = Number(value.replace(/[^0-9.]/g, ""));
    if (value.toLowerCase().includes("m")) return num * 1000000;
    if (value.toLowerCase().includes("k")) return num * 1000;
    return num;
  };

  const filtered = useMemo(() => {
    let list = data.filter((c) => {
      const text = `${c.name} ${c.niche}`.toLowerCase();
      const searchOk = !search.trim() || text.includes(search.trim().toLowerCase());
      const categoryOk = category === "all" || c.niche.toLowerCase().includes(category);

      const followers = parseFollowers(c.followers);
      const followerOk =
        followerFilter === "all" ||
        (followerFilter === "10k" && followers >= 10000) ||
        (followerFilter === "50k" && followers >= 50000) ||
        (followerFilter === "100k" && followers >= 100000);

      return searchOk && categoryOk && followerOk;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "followers") return parseFollowers(b.followers) - parseFollowers(a.followers);
      if (sortBy === "engagement") return Number(b.engagement.replace("%", "")) - Number(a.engagement.replace("%", ""));
      return getRackAvg(b.rack) - getRackAvg(a.rack);
    });

    return list;
  }, [data, search, category, followerFilter, sortBy]);

  const openInvite = (creator: Creator) => {
    setSelectedCreator(creator);
    const campaignName = campaigns.find((c) => c.id === campaignId)?.name ?? "our campaign";
    setInviteMessage(`Hi ${creator.name}, we'd like to invite you for ${campaignName}. Please share your Instagram collaboration interest and availability.`);
    setIsInviteOpen(true);
  };

  const onInvite = async () => {
    if (!brandId || !campaignId || !selectedCreator) {
      toast({ title: "No campaign available", description: "Create or open a campaign before inviting creators.", variant: "destructive" });
      return;
    }

    if (!inviteMessage.trim()) {
      toast({ title: "Validation", description: "Please add an invite message.", variant: "destructive" });
      return;
    }

    setIsInviting(true);
    try {
      await inviteCreatorForCampaign(campaignId, selectedCreator.id, brandId, inviteMessage.trim());
      toast({ title: "Invitation sent", description: `Invitation sent to ${selectedCreator.name}.` });
      setPendingInviteCreatorIds((prev) => (prev.includes(selectedCreator.id) ? prev : [...prev, selectedCreator.id]));
      setIsInviteOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send invitation.";
      toast({ title: "Invite failed", description: message, variant: "destructive" });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Discover Creators" userInitials="TF">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search creators by name, niche..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4">
            <Select value={campaignId ?? "none"} onValueChange={(value) => setCampaignId(value === "none" ? null : value)}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Select Campaign" /></SelectTrigger>
              <SelectContent>
                {campaigns.length === 0 && <SelectItem value="none">No Campaigns</SelectItem>}
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
            <Select value={followerFilter} onValueChange={setFollowerFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Followers</SelectItem>
                <SelectItem value="10k">10K+</SelectItem>
                <SelectItem value="50k">50K+</SelectItem>
                <SelectItem value="100k">100K+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rack">RACK Score</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading creators...</p>}

        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            Registered creators found: <span className="font-semibold text-foreground">{filtered.length}</span>
          </p>
        )}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => {
            const PlatformIcon = platformIcon[c.platform] || Instagram;
            const avg = getRackAvg(c.rack);
            const isAlreadyInvited = pendingInviteCreatorIds.includes(c.id);
            return (
              <Card key={c.name} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {c.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-success flex items-center justify-center text-[8px] text-success-foreground">✓</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <PlatformIcon className="h-3 w-3" />{c.niche}
                      </p>
                    </div>
                    {isAlreadyInvited && <Badge className="bg-success/10 text-success">Invited</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded bg-secondary/50 p-2 text-center">
                      <p className="text-sm font-bold">{c.followers}</p>
                      <p className="text-[10px] text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded bg-secondary/50 p-2 text-center">
                      <p className="text-sm font-bold">{c.engagement}</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                  </div>

                  {/* RACK Score - read only */}
                  <div className="w-full rounded-lg border border-border/50 bg-muted/30 p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" /> RACK Score
                      </span>
                      <span className="font-bold text-sm">{avg}/100</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {rackLabels.map(({ key, color }) => (
                        <div key={key}>
                          <div className="h-1 rounded-full bg-secondary">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${c.rack[key]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/brand/creators/${c.id}${campaignId ? `?campaign=${campaignId}` : ""}`}>
                      <Button size="sm" variant="outline" className="w-full">View Profile</Button>
                    </Link>
                    <Button
                      size="sm"
                      className="w-full gradient-primary text-primary-foreground"
                      onClick={() => openInvite(c)}
                      disabled={isAlreadyInvited}
                    >
                      {isAlreadyInvited ? "Invited" : "Invite"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Send Creator Invitation</DialogTitle>
              <DialogDescription>
                Send a direct campaign request to {selectedCreator?.name ?? "creator"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCampaign">Campaign</Label>
                <Select value={campaignId ?? "none"} onValueChange={(value) => setCampaignId(value === "none" ? null : value)}>
                  <SelectTrigger id="inviteCampaign"><SelectValue placeholder="Select Campaign" /></SelectTrigger>
                  <SelectContent>
                    {campaigns.length === 0 && <SelectItem value="none">No Campaigns</SelectItem>}
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteMessage">Message</Label>
                <Textarea
                  id="inviteMessage"
                  rows={5}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Write your collaboration request"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isInviting}>Cancel</Button>
              <Button onClick={() => void onInvite()} disabled={isInviting}>{isInviting ? "Sending..." : "Send Invitation"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

    </DashboardLayout>
  );
};

export default BrandCreators;
