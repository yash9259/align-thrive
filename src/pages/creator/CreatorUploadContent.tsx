import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image, Video, Flame, Zap, Clock, CheckCircle } from "lucide-react";

const uploadHistory = [
  { type: "Video", title: "Why I Love Align - Creator Review", status: "Approved", chillies: 50, badge: "50 days", date: "Feb 15, 2026" },
  { type: "Image", title: "My Align Dashboard Screenshot", status: "Pending", chillies: 10, badge: "15 days", date: "Mar 1, 2026" },
  { type: "Video", title: "Align Tutorial for New Creators", status: "Rejected", chillies: 0, badge: "—", date: "Jan 20, 2026", reason: "Content doesn't meet guidelines" },
];

const statusColors: Record<string, string> = {
  "Approved": "bg-success/10 text-success",
  "Pending": "bg-warning/10 text-warning",
  "Rejected": "bg-destructive/10 text-destructive",
};

const CreatorUploadContent = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Upload Content" userInitials="SJ">
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

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Upload className="h-4 w-4" />Submit Content for Review</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Content Type</Label>
            <Select defaultValue="video">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="image">📸 Image Post</SelectItem>
                <SelectItem value="video">🎬 Video/Reel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input defaultValue="My Experience with Align Platform" />
          </div>
          <div>
            <Label>Social Media Link</Label>
            <Input defaultValue="https://instagram.com/p/example123" placeholder="Paste your post/reel URL" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea defaultValue="A detailed review of how Align helped me land premium brand collaborations..." rows={3} />
          </div>
          <div className="rounded-lg border-2 border-dashed border-border p-6 sm:p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Upload screenshot or media file</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 50MB</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-3">
            <p className="text-xs text-muted-foreground"><Flame className="h-3 w-3 inline text-accent mr-1" />Your content will be reviewed by our admin team. Once approved, Chillies and badges are awarded automatically.</p>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground">Submit for Review</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Upload History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadHistory.map((u) => (
              <div key={u.title} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-3 sm:p-4 gap-2 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {u.type === "Video" ? <Video className="h-5 w-5 text-primary shrink-0" /> : <Image className="h-5 w-5 text-accent shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{u.title}</p>
                    <p className="text-xs text-muted-foreground">{u.date}</p>
                    {u.reason && <p className="text-xs text-destructive mt-0.5">{u.reason}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap pl-8 sm:pl-0">
                  {u.chillies > 0 && <span className="text-xs text-accent font-medium">🌶️ {u.chillies}</span>}
                  {u.badge !== "—" && <span className="text-xs text-success">{u.badge}</span>}
                  <Badge variant="secondary" className={statusColors[u.status]}>{u.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default CreatorUploadContent;
