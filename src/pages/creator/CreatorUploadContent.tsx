import { useEffect, useState, type ChangeEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Image, Video, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentCreatorContext,
  fetchCreatorSubmissionCampaignOptions,
  fetchCreatorContentSubmissions,
  createCreatorContentSubmission,
  uploadCreatorSubmissionFile,
  type CreatorSubmissionCampaignOption,
  type CreatorContentSubmissionItem,
} from "@/lib/creator-api";

const statusColors: Record<string, string> = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-destructive/10 text-destructive",
};

const DIRECT_UPLOAD_VALUE = "__direct_upload__";
const allowedUploadTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"];

const CreatorUploadContent = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creatorId, setCreatorId] = useState("");
  const [userInitials, setUserInitials] = useState("CR");
  const [campaigns, setCampaigns] = useState<CreatorSubmissionCampaignOption[]>([]);
  const [submissions, setSubmissions] = useState<CreatorContentSubmissionItem[]>([]);

  const [selectedCampaign, setSelectedCampaign] = useState(DIRECT_UPLOAD_VALUE);
  const [contentType, setContentType] = useState("video");
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getCurrentCreatorContext();
        if (!ctx) return;
        setCreatorId(ctx.userId);
        setUserInitials(ctx.initials);
        const [camps, subs] = await Promise.all([
          fetchCreatorSubmissionCampaignOptions(ctx.userId),
          fetchCreatorContentSubmissions(ctx.userId),
        ]);
        setCampaigns(camps);
        setSubmissions(subs);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!allowedUploadTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Upload JPG, PNG, WEBP, GIF, or MP4 files only.",
        variant: "destructive",
      });
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB.",
        variant: "destructive",
      });
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Missing fields", description: "Please add a title.", variant: "destructive" });
      return;
    }

    if (!mediaUrl.trim() && !selectedFile) {
      toast({ title: "Missing media", description: "Please add a media URL or upload a file.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionMediaUrls: string[] = [];

      if (mediaUrl.trim()) {
        submissionMediaUrls.push(mediaUrl.trim());
      }

      if (selectedFile) {
        const uploadedMediaRef = await uploadCreatorSubmissionFile(creatorId, selectedFile);
        submissionMediaUrls.push(uploadedMediaRef);
      }

      const campaignId = selectedCampaign === DIRECT_UPLOAD_VALUE ? null : selectedCampaign;
      await createCreatorContentSubmission(creatorId, campaignId, title.trim(), caption.trim(), submissionMediaUrls);
      toast({ title: "Submitted!", description: "Your content has been submitted for review." });
      setTitle("");
      setMediaUrl("");
      setSelectedFile(null);
      setCaption("");
      setSelectedCampaign(DIRECT_UPLOAD_VALUE);
      const updated = await fetchCreatorContentSubmissions(creatorId);
      setSubmissions(updated);
    } catch {
      toast({ title: "Error", description: "Could not submit content. Try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Upload Content" userInitials={userInitials}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Upload Content & Earn Chillies</h2>
          <p className="text-sm text-muted-foreground">Share posts or videos about Align to earn free Chillies and verification badges</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-5 sm:p-6 text-center">
              <Image className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-1">📸 Image Post</h3>
              <p className="text-sm text-muted-foreground mb-2">Post about Align on social media</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <Badge className="bg-accent/10 text-accent">🌶️ 10 Chillies</Badge>
                <Badge className="bg-success/10 text-success">15-day badge</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5 sm:p-6 text-center">
              <Video className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">🎬 Video/Reel Post</h3>
              <p className="text-sm text-muted-foreground mb-2">Create a video about Align</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <Badge className="bg-accent/10 text-accent">🌶️ 50 Chillies</Badge>
                <Badge className="bg-success/10 text-success">50-day badge</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4" />Submit Content for Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => <Skeleton key={n} className="h-10 w-full" />)}
              </div>
            ) : (
              <>
                <div>
                  <Label>Campaign (Optional)</Label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DIRECT_UPLOAD_VALUE}>Direct upload (No campaign)</SelectItem>
                      {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title} — {c.brandName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">📸 Image Post</SelectItem>
                      <SelectItem value="video">🎬 Video/Reel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Experience with Align Platform" />
                </div>
                <div>
                  <Label>Social Media Link / Media URL (Optional)</Label>
                  <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://instagram.com/p/example123" />
                </div>
                <div>
                  <Label>Upload File (Image or MP4)</Label>
                  <Input type="file" accept="image/*,video/mp4" onChange={handleFileChange} />
                  {selectedFile ? (
                    <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFile.name}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">You can upload JPG, PNG, WEBP, GIF, or MP4 files up to 100MB.</p>
                  )}
                </div>
                <div>
                  <Label>Caption / Description</Label>
                  <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="A detailed review of how Align helped me..." rows={3} />
                </div>
                <div className="rounded-lg bg-accent/10 p-3">
                  <p className="text-xs text-muted-foreground"><Flame className="h-3 w-3 inline text-accent mr-1" />Your content will be reviewed by our admin team. Once approved, Chillies and badges are awarded automatically.</p>
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full gradient-primary text-primary-foreground">
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* History */}
        {!isLoading && submissions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Submission History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-3 sm:p-4 gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Video className="h-5 w-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.campaignTitle}{s.brandName ? ` — ${s.brandName}` : ""} · {s.submittedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-8 sm:pl-0">
                      <Badge variant="secondary" className={statusColors[s.status.toLowerCase()] ?? "bg-muted text-muted-foreground"}>
                        {s.status}
                      </Badge>
                      {s.mediaUrls[0] && (
                        <a href={s.mediaUrls[0]} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreatorUploadContent;
