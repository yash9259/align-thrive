import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Star, ArrowLeft, DollarSign, Calendar, Target, CheckCircle, ExternalLink, FileText, UserCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  fetchCampaignContentSubmissions,
  fetchBrandCampaignDetails,
  fetchCampaignInvitations,
  fetchCampaignBids,
  getCurrentBrandContext,
  inviteCreatorForCampaign,
  updateContentSubmissionStatus,
  updateBidStatus,
  type BrandCampaignDetailsData,
  type BrandCampaignInvitation,
  type BrandCampaignContentSubmission,
  type BrandCreatorBid,
} from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const emptyCampaign: BrandCampaignDetailsData = {
  id: "",
  title: "",
  description: "",
  category: "",
  platform: "",
  budgetMin: 0,
  budgetMax: 0,
  minFollowers: 0,
  deadline: null,
  status: "draft",
  priorityChilliesCost: 0,
  totalBids: 0,
  deliverables: [],
};

const BrandCampaignDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<BrandCampaignDetailsData>(emptyCampaign);
  const [bids, setBids] = useState<BrandCreatorBid[]>([]);
  const [invitations, setInvitations] = useState<BrandCampaignInvitation[]>([]);
  const [submissions, setSubmissions] = useState<BrandCampaignContentSubmission[]>([]);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Your Brand");
  const [userInitials, setUserInitials] = useState("BR");
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const context = await getCurrentBrandContext();
      setBrandId(context.userId);
      setCompanyName(context.companyName || "Your Brand");
      setUserInitials(
        (context.companyName || context.fullName || "Brand")
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "BR",
      );

      const [campaignData, bidData, invitationData, submissionData] = await Promise.all([
        fetchBrandCampaignDetails(context.userId, id),
        fetchCampaignBids(id),
        fetchCampaignInvitations(id),
        fetchCampaignContentSubmissions(id),
      ]);

      setCampaign(campaignData);
      setBids(bidData);
      setInvitations(invitationData);
      setSubmissions(submissionData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load campaign details.";
      toast({ title: "Campaign error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const onUpdateBid = async (bidId: string, status: "shortlisted" | "accepted" | "rejected") => {
    try {
      await updateBidStatus(bidId, status);
      setBids((prev) => prev.map((b) => (b.bidId === bidId ? { ...b, status } : b)));
      toast({ title: "Bid updated", description: `Marked as ${status}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update bid.";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    }
  };

  const onInvite = async (bid: BrandCreatorBid) => {
    if (!id || !brandId) return;
    try {
      await inviteCreatorForCampaign(id, bid.creatorId, brandId, `Hi ${bid.name}, we'd love to discuss this campaign with you.`);
      setInvitations((prev) => [
        {
          id: `${bid.creatorId}-${Date.now()}`,
          creatorId: bid.creatorId,
          creatorName: bid.name,
          creatorNiche: bid.niche,
          status: "pending",
          message: `Hi ${bid.name}, we'd love to discuss this campaign with you.`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      toast({ title: "Invitation sent", description: `Invitation sent to ${bid.name}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send invitation.";
      toast({ title: "Invite failed", description: message, variant: "destructive" });
    }
  };

  const onUpdateSubmission = async (submissionId: string, status: "approved" | "revision_requested" | "rejected") => {
    try {
      await updateContentSubmissionStatus(submissionId, status);
      setSubmissions((prev) => prev.map((submission) => (
        submission.id === submissionId
          ? { ...submission, status, approvedAt: status === "approved" ? new Date().toISOString() : null }
          : submission
      )));
      toast({ title: "Submission updated", description: `Marked submission as ${status.replace(/_/g, " ")}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update submission.";
      toast({ title: "Review failed", description: message, variant: "destructive" });
    }
  };

  const budgetValue = useMemo(() => {
    const max = Number(campaign.budgetMax ?? 0);
    const min = Number(campaign.budgetMin ?? 0);
    return `$${Math.max(max, min).toLocaleString()}`;
  }, [campaign]);

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Campaign Details" userInitials={userInitials}>
      <div className="space-y-6">
        <Link to="/brand/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>

        {isLoading && <p className="text-sm text-muted-foreground">Loading campaign details...</p>}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4">
                  <Badge className="bg-success/10 text-success mb-2">{campaign.status}</Badge>
                  <h2 className="text-xl sm:text-2xl font-bold">{campaign.title || "Campaign"}</h2>
                  <p className="text-muted-foreground">by {companyName}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {campaign.description || "No description added yet."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-success" />
                    <p className="text-base sm:text-lg font-bold">{budgetValue}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-base sm:text-lg font-bold">{campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "TBD"}</p>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Target className="h-4 w-4 mx-auto mb-1 text-accent" />
                    <p className="text-base sm:text-lg font-bold">{campaign.deliverables.length}</p>
                    <p className="text-xs text-muted-foreground">Deliverables</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Flame className="h-4 w-4 mx-auto mb-1 text-accent" />
                    <p className="text-base sm:text-lg font-bold">{campaign.priorityChilliesCost}</p>
                    <p className="text-xs text-muted-foreground">Chillies Req.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Deliverables</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaign.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      <span className="text-sm">{d}</span>
                    </div>
                  ))}
                  {!campaign.deliverables.length && <p className="text-sm text-muted-foreground">No deliverables configured yet.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader><CardTitle className="text-base">Campaign Info</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{campaign.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">{campaign.platform}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">Flexible</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Min Followers</span><span className="font-medium">{campaign.minFollowers?.toLocaleString() ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Applications</span><span className="font-medium">{campaign.totalBids}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Creator Bids</CardTitle>
              <Badge variant="secondary">{bids.length} bids</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bids.map((c) => (
                <div key={c.bidId} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-3 sm:p-4 hover:border-primary/20 transition-colors gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-sm">{c.name}</span>
                        {c.verified && <Badge className="bg-success/10 text-success text-[10px] px-1.5">✓</Badge>}
                        {c.priority && <Badge className="bg-accent/10 text-accent text-[10px] px-1.5"><Flame className="h-2.5 w-2.5 mr-0.5" />Priority</Badge>}
                        <Badge variant="outline" className="text-[10px] px-1.5">{c.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{c.niche}</span>
                        <span>{c.followers}</span>
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-warning" />{c.rack}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 pl-12 sm:pl-0 flex-wrap">
                    <span className="font-bold text-success">{c.bid}</span>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => void onUpdateBid(c.bidId, "shortlisted")}>Shortlist</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => void onUpdateBid(c.bidId, "rejected")}>Reject</Button>
                    <Button size="sm" className="gradient-primary text-primary-foreground h-8 text-xs" onClick={() => void onInvite(c)}>Invite</Button>
                  </div>
                </div>
              ))}
              {!bids.length && <p className="text-sm text-muted-foreground">No bids yet for this campaign.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Invite Tracker</CardTitle>
                <Badge variant="secondary">{invitations.length} invites</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="rounded-lg border border-border/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{invitation.creatorName}</p>
                        <p className="text-xs text-muted-foreground">{invitation.creatorNiche}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(invitation.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge variant="secondary" className={
                        invitation.status === "accepted"
                          ? "bg-success/10 text-success"
                          : invitation.status === "declined"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                      }>
                        {invitation.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{invitation.message || "No message added."}</p>
                  </div>
                ))}
                {!invitations.length && <p className="text-sm text-muted-foreground">No invitations sent for this campaign yet.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Content Review</CardTitle>
                <Badge variant="secondary">{submissions.length} submissions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="rounded-lg border border-border/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{submission.title}</p>
                        <p className="text-xs text-muted-foreground">by {submission.creatorName}</p>
                      </div>
                      <Badge variant="secondary" className={
                        submission.status === "approved"
                          ? "bg-success/10 text-success"
                          : submission.status === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : submission.status === "revision_requested"
                              ? "bg-warning/10 text-warning"
                              : "bg-primary/10 text-primary"
                      }>
                        {submission.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    {submission.caption && <p className="text-sm text-muted-foreground mt-2">{submission.caption}</p>}
                    <div className="mt-3 space-y-2">
                      {submission.mediaUrls.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <ExternalLink className="h-4 w-4" /> {url}
                        </a>
                      ))}
                      {!submission.mediaUrls.length && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4" /> No media links attached.</p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => void onUpdateSubmission(submission.id, "revision_requested")}>Request Revision</Button>
                      <Button size="sm" variant="outline" onClick={() => void onUpdateSubmission(submission.id, "rejected")}>Reject</Button>
                      <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => void onUpdateSubmission(submission.id, "approved")}>
                        <UserCheck className="mr-1 h-3 w-3" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
                {!submissions.length && <p className="text-sm text-muted-foreground">No content submissions yet for this campaign.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrandCampaignDetails;