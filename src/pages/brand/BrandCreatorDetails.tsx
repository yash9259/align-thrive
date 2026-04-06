import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Flame, Globe, Instagram, MapPin, Phone, Shield, Youtube } from "lucide-react";
import {
  fetchBrandCampaigns,
  fetchBrandCreatorProfileDetails,
  fetchPendingInviteCreatorIds,
  getCurrentBrandContext,
  inviteCreatorForCampaign,
  type BrandCampaignListItem,
  type BrandCreatorProfileDetails,
} from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const emptyCreator: BrandCreatorProfileDetails = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  isVerified: false,
  rackScore: 0,
  chilliesBalance: 0,
  bio: "",
  niche: "",
  languages: [],
  location: "",
  instagramHandle: "",
  instagramFollowers: 0,
  youtubeChannel: "",
  youtubeSubscribers: 0,
  tiktokHandle: "",
  tiktokFollowers: 0,
  snapchatHandle: "",
  snapchatFollowers: 0,
  engagementRate: 0,
  combinedAudience: 0,
  primaryPlatform: "instagram",
};

const formatFollowers = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
};

const normalizeHandle = (value: string): string => value.trim().replace(/^@/, "");
const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value.trim());

const instagramUrl = (handle: string): string => {
  if (isHttpUrl(handle)) return handle.trim();
  const h = normalizeHandle(handle);
  return h ? `https://www.instagram.com/${h}` : "";
};

const youtubeUrl = (channel: string): string => {
  if (isHttpUrl(channel)) return channel.trim();
  const c = normalizeHandle(channel);
  if (!c) return "";
  if (c.startsWith("UC")) return `https://www.youtube.com/channel/${c}`;
  return `https://www.youtube.com/@${c}`;
};

const tiktokUrl = (handle: string): string => {
  if (isHttpUrl(handle)) return handle.trim();
  const h = normalizeHandle(handle);
  return h ? `https://www.tiktok.com/@${h}` : "";
};

const snapchatUrl = (handle: string): string => {
  if (isHttpUrl(handle)) return handle.trim();
  const h = normalizeHandle(handle);
  return h ? `https://www.snapchat.com/add/${h}` : "";
};

const BrandCreatorDetails = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [searchParams] = useSearchParams();
  const initialCampaignFromUrl = searchParams.get("campaign");

  const [brandId, setBrandId] = useState<string | null>(null);
  const [creator, setCreator] = useState<BrandCreatorProfileDetails>(emptyCreator);
  const [campaigns, setCampaigns] = useState<BrandCampaignListItem[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(initialCampaignFromUrl);
  const [pendingInviteCreatorIds, setPendingInviteCreatorIds] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!creatorId) {
        toast({ title: "Creator missing", description: "Creator id is required.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      try {
        const context = await getCurrentBrandContext();
        setBrandId(context.userId);

        const [creatorData, campaignData] = await Promise.all([
          fetchBrandCreatorProfileDetails(creatorId),
          fetchBrandCampaigns(context.userId),
        ]);

        setCreator(creatorData);
        setCampaigns(campaignData);

        const selected = initialCampaignFromUrl && campaignData.some((c) => c.id === initialCampaignFromUrl)
          ? initialCampaignFromUrl
          : campaignData[0]?.id ?? null;
        setCampaignId(selected);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load creator details.";
        toast({ title: "Creator error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [creatorId]);

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

  const isAlreadyInvited = useMemo(() => pendingInviteCreatorIds.includes(creator.id), [pendingInviteCreatorIds, creator.id]);

  const openInvite = () => {
    if (!campaignId) {
      toast({ title: "No campaign available", description: "Please create a campaign first.", variant: "destructive" });
      return;
    }

    const campaignName = campaigns.find((c) => c.id === campaignId)?.name ?? "our campaign";
    setInviteMessage(`Hi ${creator.fullName}, we'd like to invite you for ${campaignName}. Please share your collaboration interest and availability.`);
    setIsInviteOpen(true);
  };

  const onInvite = async () => {
    if (!brandId || !campaignId || !creator.id) {
      toast({ title: "Invite failed", description: "Creator or campaign is missing.", variant: "destructive" });
      return;
    }

    if (!inviteMessage.trim()) {
      toast({ title: "Validation", description: "Please add invite message.", variant: "destructive" });
      return;
    }

    setIsInviting(true);
    try {
      await inviteCreatorForCampaign(campaignId, creator.id, brandId, inviteMessage.trim());
      setPendingInviteCreatorIds((prev) => (prev.includes(creator.id) ? prev : [...prev, creator.id]));
      setIsInviteOpen(false);
      toast({ title: "Invitation sent", description: `Invitation sent to ${creator.fullName}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send invite.";
      toast({ title: "Invite failed", description: message, variant: "destructive" });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Creator Profile" userInitials="TF">
      <div className="space-y-6">
        <Link to="/brand/creators" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to creators
        </Link>

        {isLoading && <p className="text-sm text-muted-foreground">Loading creator details...</p>}

        {!isLoading && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-xl font-bold text-primary-foreground">
                    {creator.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold">{creator.fullName}</h2>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{creator.niche || "General"}</Badge>
                      {creator.isVerified && <Badge className="bg-success/10 text-success">Verified</Badge>}
                      {isAlreadyInvited && <Badge className="bg-success/10 text-success">Invited</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{creator.bio || "No bio provided yet."}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{creator.location || "-"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{creator.phone || "-"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" />RACK {creator.rackScore}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Flame className="h-4 w-4" />{creator.chilliesBalance} Chillies</div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[300px] space-y-3">
                    <div className="space-y-1">
                      <Label>Campaign</Label>
                      <Select value={campaignId ?? "none"} onValueChange={(value) => setCampaignId(value === "none" ? null : value)}>
                        <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                        <SelectContent>
                          {campaigns.length === 0 && <SelectItem value="none">No Campaigns</SelectItem>}
                          {campaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full gradient-primary text-primary-foreground" onClick={openInvite} disabled={isAlreadyInvited || !campaignId}>
                      {isAlreadyInvited ? "Already Invited" : "Invite Creator"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{formatFollowers(creator.combinedAudience)}</p><p className="text-sm text-muted-foreground">Total Audience</p></CardContent></Card>
              <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{creator.engagementRate.toFixed(1)}%</p><p className="text-sm text-muted-foreground">Engagement Rate</p></CardContent></Card>
              <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{creator.languages.length || 0}</p><p className="text-sm text-muted-foreground">Languages</p></CardContent></Card>
              <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{creator.primaryPlatform}</p><p className="text-sm text-muted-foreground">Top Platform</p></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">Platform Details</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Instagram</p>
                    <p className="font-semibold">{creator.instagramHandle || "-"}</p>
                    <p className="text-sm text-muted-foreground">Followers: {formatFollowers(creator.instagramFollowers)}</p>
                    {instagramUrl(creator.instagramHandle) && (
                      <a className="text-xs text-primary hover:underline" href={instagramUrl(creator.instagramHandle)} target="_blank" rel="noreferrer">
                        Open profile
                      </a>
                    )}
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">YouTube</p>
                    <p className="font-semibold">{creator.youtubeChannel || "-"}</p>
                    <p className="text-sm text-muted-foreground">Subscribers: {formatFollowers(creator.youtubeSubscribers)}</p>
                    {youtubeUrl(creator.youtubeChannel) && (
                      <a className="text-xs text-primary hover:underline" href={youtubeUrl(creator.youtubeChannel)} target="_blank" rel="noreferrer">
                        Open channel
                      </a>
                    )}
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">TikTok</p>
                    <p className="font-semibold">{creator.tiktokHandle || "-"}</p>
                    <p className="text-sm text-muted-foreground">Followers: {formatFollowers(creator.tiktokFollowers)}</p>
                    {tiktokUrl(creator.tiktokHandle) && (
                      <a className="text-xs text-primary hover:underline" href={tiktokUrl(creator.tiktokHandle)} target="_blank" rel="noreferrer">
                        Open profile
                      </a>
                    )}
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Snapchat</p>
                    <p className="font-semibold">{creator.snapchatHandle || "-"}</p>
                    <p className="text-sm text-muted-foreground">Followers: {formatFollowers(creator.snapchatFollowers)}</p>
                    {snapchatUrl(creator.snapchatHandle) && (
                      <a className="text-xs text-primary hover:underline" href={snapchatUrl(creator.snapchatHandle)} target="_blank" rel="noreferrer">
                        Open profile
                      </a>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Email: {creator.email}</div>
                  <div className="flex items-center gap-2 mt-1"><Instagram className="h-4 w-4" /> Primary Social: {creator.primaryPlatform}</div>
                  <div className="flex items-center gap-2 mt-1"><Youtube className="h-4 w-4" /> Languages: {creator.languages.join(", ") || "-"}</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Send Creator Invitation</DialogTitle>
              <DialogDescription>
                Send a direct campaign request to {creator.fullName || "creator"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="detailInviteMessage">Message</Label>
                <Textarea
                  id="detailInviteMessage"
                  rows={5}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Write collaboration request"
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

export default BrandCreatorDetails;
