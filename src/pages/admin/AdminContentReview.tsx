import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image, Video, Flame, CheckCircle, XCircle, MessageSquare, Eye } from "lucide-react";

const contentItems = [
  { id: 1, creator: "Sarah Johnson", type: "Video", title: "Why I Love Align - Creator Review", link: "instagram.com/reel/abc123", status: "Pending", date: "Mar 1, 2026", chilliesReward: 50, badgeDays: 50 },
  { id: 2, creator: "Mike Thompson", type: "Image", title: "My Align Dashboard Screenshot", link: "instagram.com/p/xyz456", status: "Pending", date: "Feb 28, 2026", chilliesReward: 10, badgeDays: 15 },
  { id: 3, creator: "Priya Kapoor", type: "Video", title: "Align Platform Walkthrough", link: "youtube.com/watch?v=def789", status: "Approved", date: "Feb 25, 2026", chilliesReward: 50, badgeDays: 50 },
  { id: 4, creator: "Emma Chen", type: "Image", title: "Align Collaboration Success Story", link: "instagram.com/p/ghi012", status: "Approved", date: "Feb 22, 2026", chilliesReward: 10, badgeDays: 15 },
  { id: 5, creator: "Alex Rivera", type: "Video", title: "Getting Started with Align", link: "instagram.com/reel/jkl345", status: "Rejected", date: "Feb 20, 2026", chilliesReward: 0, badgeDays: 0, reason: "Low quality content, doesn't mention Align features" },
  { id: 6, creator: "Jordan Williams", type: "Image", title: "Align Earnings Screenshot", link: "twitter.com/post/mno678", status: "Pending", date: "Mar 2, 2026", chilliesReward: 10, badgeDays: 15 },
];

const statusColors: Record<string, string> = {
  "Pending": "bg-warning/10 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const AdminContentReview = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Content Review" userInitials="AD">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Review</h2>
        <p className="text-sm text-muted-foreground">Review creator-uploaded posts and videos for free Chillies rewards</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">3</p><p className="text-sm text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">2</p><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">1</p><p className="text-sm text-muted-foreground">Rejected</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Submissions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentItems.map((item) => (
              <div key={item.id} className={`rounded-lg border p-4 ${item.status === 'Pending' ? 'border-warning/30 bg-warning/5' : 'border-border/50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {item.type === "Video" ? <Video className="h-5 w-5 text-primary mt-0.5" /> : <Image className="h-5 w-5 text-accent mt-0.5" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{item.title}</span>
                        <Badge variant="secondary" className={statusColors[item.status]}>{item.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">by <span className="font-medium text-foreground">{item.creator}</span> • {item.date}</p>
                      <p className="text-xs text-primary hover:underline cursor-pointer">{item.link}</p>
                      {item.chilliesReward > 0 && (
                        <p className="text-xs text-accent mt-1 flex items-center gap-1">
                          <Flame className="h-3 w-3" /> Reward: {item.chilliesReward} Chillies + {item.badgeDays}-day badge
                        </p>
                      )}
                      {item.reason && <p className="text-xs text-destructive mt-1">Reason: {item.reason}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "Pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10">
                          <CheckCircle className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" /> Suggest
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminContentReview;
