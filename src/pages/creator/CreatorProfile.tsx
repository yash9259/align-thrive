import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Star, Shield, Instagram, Youtube, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCreatorProfileData, getCurrentCreatorContext, syncCreatorSocialMetricsFromSession, updateCreatorProfile, type CreatorProfileData, type CreatorProfileUpdateInput } from "@/lib/creator-api";
import { supabase } from "@/lib/supabase";

const emptyProfile: CreatorProfileData = {
  fullName: "",
  email: "",
  phone: "",
  isVerified: false,
  chilliesBalance: 0,
  rackScore: 0,
  bio: "",
  niche: "",
  location: "",
  languages: [],
  instagramHandle: "",
  instagramFollowers: 0,
  youtubeChannel: "",
  youtubeSubscribers: 0,
  tiktokHandle: "",
  tiktokFollowers: 0,
  snapchatHandle: "",
  snapchatFollowers: 0,
  combinedAudience: 0,
  engagementRate: 0,
  communityStats: {
    creatorFollowers: 0,
    creatorFollowing: 0,
    creatorPendingIncoming: 0,
    companyFollowers: 0,
    companyFollowing: 0,
    companyPendingIncoming: 0,
  },
  joinedAt: "",
  collaborationsCount: 0,
  pastCollaborations: [],
};

const buildSocialUrl = (platform: "instagram" | "youtube" | "tiktok" | "snapchat", value: string) => {
  const clean = value.trim();
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;
  const normalized = clean.startsWith("@") ? clean.slice(1) : clean;
  if (platform === "instagram") return `https://instagram.com/${normalized}`;
  if (platform === "youtube") return `https://youtube.com/${normalized}`;
  if (platform === "tiktok") return `https://tiktok.com/@${normalized.replace(/^@/, "")}`;
  return `https://snapchat.com/add/${normalized}`;
};

const CreatorProfile = () => {
  const [profile, setProfile] = useState<CreatorProfileData>(emptyProfile);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("CR");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingSocial, setIsSyncingSocial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState<CreatorProfileUpdateInput>({
    fullName: "",
    phone: "",
    bio: "",
    niche: "",
    location: "",
    languages: [],
    instagramHandle: "",
    instagramFollowers: 0,
    youtubeChannel: "",
    youtubeSubscribers: 0,
    tiktokHandle: "",
    tiktokFollowers: 0,
    snapchatHandle: "",
    snapchatFollowers: 0,
    engagementRate: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentCreatorContext();
        const data = await fetchCreatorProfileData(context.userId);
        if (!active) return;
        setCreatorId(context.userId);
        setUserInitials(context.initials);
        setProfile(data);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load profile.";
        toast({ title: "Profile error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const rackBreakdown = useMemo(() => {
    return [
      { label: "Reliability", score: Math.min(100, profile.rackScore + 4), desc: "On-time delivery rate" },
      { label: "Activity", score: Math.max(0, profile.rackScore - 4), desc: "Platform engagement" },
      { label: "Content Quality", score: Math.min(100, profile.rackScore + 2), desc: "Content rating average" },
      { label: "Knowledge", score: Math.max(0, profile.rackScore - 1), desc: "Niche expertise level" },
    ];
  }, [profile.rackScore]);

  const openEdit = () => {
    setEditForm({
      fullName: profile.fullName,
      phone: profile.phone,
      bio: profile.bio,
      niche: profile.niche,
      location: profile.location,
      languages: profile.languages,
      instagramHandle: profile.instagramHandle,
      instagramFollowers: profile.instagramFollowers,
      youtubeChannel: profile.youtubeChannel,
      youtubeSubscribers: profile.youtubeSubscribers,
      tiktokHandle: profile.tiktokHandle,
      tiktokFollowers: profile.tiktokFollowers,
      snapchatHandle: profile.snapchatHandle,
      snapchatFollowers: profile.snapchatFollowers,
      engagementRate: profile.engagementRate,
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!creatorId) return;
    setIsSaving(true);
    try {
      await updateCreatorProfile(creatorId, editForm);
      const refreshed = await fetchCreatorProfileData(creatorId);
      setProfile(refreshed);
      setUserInitials(refreshed.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CR");
      setIsEditOpen(false);
      toast({ title: "Profile updated", description: "Your creator profile was saved." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save profile.";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialSync = async () => {
    if (!creatorId || !supabase) return;
    setIsSyncingSocial(true);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        toast({ title: "Session required", description: "Please sign in with Google or Facebook first.", variant: "destructive" });
        return;
      }

      const syncResult = await syncCreatorSocialMetricsFromSession(session, creatorId);
      const refreshed = await fetchCreatorProfileData(creatorId);
      setProfile(refreshed);

      toast({
        title: "Social metrics synced",
        description: syncResult.details.join(" "),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sync social metrics.";
      toast({ title: "Sync failed", description: message, variant: "destructive" });
    } finally {
      setIsSyncingSocial(false);
    }
  };

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Profile" userInitials={userInitials}>
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-xl font-bold text-primary-foreground sm:h-20 sm:w-20 sm:text-2xl">{userInitials}</div>
                {profile.isVerified && <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-xs text-success-foreground sm:h-6 sm:w-6">?</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold sm:text-2xl">{isLoading ? "Loading..." : profile.fullName}</h2>
                  {profile.isVerified && <Badge className="bg-success/10 text-success"><Shield className="mr-1 h-3 w-3" />Verified</Badge>}
                  <Badge className="bg-accent/10 text-accent"><Flame className="mr-1 h-3 w-3" />{profile.chilliesBalance}</Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{profile.bio || "Add your creator story, niche, and what makes your content stand out."}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 shrink-0" />{profile.location || "Location not set"}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4 shrink-0" />Joined {profile.joinedAt || "recently"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.instagramHandle && (
                    <a href={buildSocialUrl("instagram", profile.instagramHandle)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600 transition-colors hover:bg-pink-500/20">
                      <Instagram className="h-3.5 w-3.5" />Instagram<ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.youtubeChannel && (
                    <a href={buildSocialUrl("youtube", profile.youtubeChannel)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20">
                      <Youtube className="h-3.5 w-3.5" />YouTube<ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.tiktokHandle && (
                    <a href={buildSocialUrl("tiktok", profile.tiktokHandle)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/20">
                      <span>TikTok</span><ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.snapchatHandle && (
                    <a href={buildSocialUrl("snapchat", profile.snapchatHandle)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-600 transition-colors hover:bg-yellow-500/20">
                      <span>Snapchat</span><ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
                <Button variant="outline" className="w-full" onClick={() => void handleSocialSync()} disabled={isSyncingSocial}>
                  {isSyncingSocial ? "Syncing..." : "Sync Social Metrics"}
                </Button>
                <Button variant="outline" className="w-full" onClick={openEdit}>Edit Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-7">
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.instagramFollowers.toLocaleString()}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Instagram Followers</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.youtubeSubscribers.toLocaleString()}</p><p className="text-[10px] text-muted-foreground sm:text-xs">YouTube Subscribers</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.combinedAudience.toLocaleString()}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Combined Audience</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.engagementRate.toFixed(1)}%</p><p className="text-[10px] text-muted-foreground sm:text-xs">Engagement Rate</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="flex items-center justify-center gap-1 text-xl font-bold sm:text-2xl"><Star className="h-4 w-4 text-warning" />{profile.rackScore}</p><p className="text-[10px] text-muted-foreground sm:text-xs">RACK Score</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="flex items-center justify-center gap-1 text-xl font-bold text-accent sm:text-2xl"><Flame className="h-4 w-4" />{profile.chilliesBalance}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Chillies</p></CardContent></Card>
          <Card className="col-span-2 sm:col-span-1"><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.collaborationsCount}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Collaborations</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.communityStats.creatorFollowing}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Creator Following</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.communityStats.creatorFollowers}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Creator Followers</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.communityStats.companyFollowing}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Company Following</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center sm:p-4"><p className="text-xl font-bold sm:text-2xl">{profile.communityStats.companyFollowers}</p><p className="text-[10px] text-muted-foreground sm:text-xs">Company Followers</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 p-3">
                <p className="font-medium">Creator Community Requests</p>
                <p className="mt-1 text-muted-foreground">Pending incoming: {profile.communityStats.creatorPendingIncoming}</p>
              </div>
              <div className="rounded-lg border border-border/60 p-3">
                <p className="font-medium">Company Community Requests</p>
                <p className="mt-1 text-muted-foreground">Pending incoming: {profile.communityStats.companyPendingIncoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">RACK Score Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {rackBreakdown.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="relative mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary sm:h-16 sm:w-16">
                    <span className="text-base font-bold sm:text-lg">{item.score}</span>
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Past Collaborations</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm">
                <thead><tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Brand</th><th className="pb-3 font-medium">Campaign</th><th className="pb-3 font-medium">Earned</th><th className="pb-3 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {profile.pastCollaborations.length ? profile.pastCollaborations.map((collab) => (
                    <tr key={`${collab.brand}-${collab.campaign}`} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{collab.brand}</td>
                      <td className="py-3 text-muted-foreground">{collab.campaign}</td>
                      <td className="py-3 font-medium text-success">{collab.earned}</td>
                      <td className="py-3 text-muted-foreground">{collab.date}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">No collaboration history yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Creator Profile</DialogTitle>
              <DialogDescription>Update the profile brands use to discover and evaluate your work.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={editForm.fullName} onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={editForm.phone} onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche</Label>
                  <Input id="niche" value={editForm.niche} onChange={(event) => setEditForm((prev) => ({ ...prev, niche: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={editForm.location} onChange={(event) => setEditForm((prev) => ({ ...prev, location: event.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={editForm.bio} onChange={(event) => setEditForm((prev) => ({ ...prev, bio: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Input id="languages" value={editForm.languages.join(", ")} onChange={(event) => setEditForm((prev) => ({ ...prev, languages: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) }))} placeholder="English, Hindi" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagramHandle">Instagram</Label>
                  <Input id="instagramHandle" value={editForm.instagramHandle} onChange={(event) => setEditForm((prev) => ({ ...prev, instagramHandle: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                  <Input id="instagramFollowers" type="number" value={editForm.instagramFollowers} onChange={(event) => setEditForm((prev) => ({ ...prev, instagramFollowers: Number(event.target.value) || 0 }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="youtubeChannel">YouTube</Label>
                  <Input id="youtubeChannel" value={editForm.youtubeChannel} onChange={(event) => setEditForm((prev) => ({ ...prev, youtubeChannel: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeSubscribers">YouTube Subscribers</Label>
                  <Input id="youtubeSubscribers" type="number" value={editForm.youtubeSubscribers} onChange={(event) => setEditForm((prev) => ({ ...prev, youtubeSubscribers: Number(event.target.value) || 0 }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tiktokHandle">TikTok</Label>
                  <Input id="tiktokHandle" value={editForm.tiktokHandle} onChange={(event) => setEditForm((prev) => ({ ...prev, tiktokHandle: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktokFollowers">TikTok Followers</Label>
                  <Input id="tiktokFollowers" type="number" value={editForm.tiktokFollowers} onChange={(event) => setEditForm((prev) => ({ ...prev, tiktokFollowers: Number(event.target.value) || 0 }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="snapchatHandle">Snapchat</Label>
                  <Input id="snapchatHandle" value={editForm.snapchatHandle} onChange={(event) => setEditForm((prev) => ({ ...prev, snapchatHandle: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snapchatFollowers">Snapchat Followers</Label>
                  <Input id="snapchatFollowers" type="number" value={editForm.snapchatFollowers} onChange={(event) => setEditForm((prev) => ({ ...prev, snapchatFollowers: Number(event.target.value) || 0 }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
                <Input id="engagementRate" type="number" step="0.1" value={editForm.engagementRate} onChange={(event) => setEditForm((prev) => ({ ...prev, engagementRate: Number(event.target.value) || 0 }))} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={() => void handleSave()} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CreatorProfile;
