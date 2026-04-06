import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image, Video, Flame, CheckCircle, XCircle, MessageSquare, Eye } from "lucide-react";
import { fetchAdminContentSubmissions, getCurrentAdminContext, updateAdminContentSubmissionStatus, type AdminContentSubmission } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  "Pending": "bg-warning/10 text-warning",
  "Approved": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const AdminContentReview = () => {
  const [rows, setRows] = useState<AdminContentSubmission[]>([]);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, submissions] = await Promise.all([getCurrentAdminContext(), fetchAdminContentSubmissions()]);
        if (!active) return;
        setUserInitials(context.initials);
        setRows(submissions);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load content submissions.";
        toast({ title: "Content review error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const pending = useMemo(() => rows.filter((item) => item.status === "Pending").length, [rows]);
  const approved = useMemo(() => rows.filter((item) => item.status === "Approved").length, [rows]);
  const rejected = useMemo(() => rows.filter((item) => item.status === "Rejected").length, [rows]);

  const updateStatus = async (id: string, nextStatus: "approved" | "rejected") => {
    try {
      await updateAdminContentSubmissionStatus(id, nextStatus);
      setRows((prev) => prev.map((item) => (
        item.id === id
          ? { ...item, status: nextStatus === "approved" ? "Approved" : "Rejected" }
          : item
      )));
      toast({ title: "Submission updated", description: `Marked as ${nextStatus}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update submission.";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Content Review" userInitials={userInitials}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Content Review</h2>
          <p className="text-sm text-muted-foreground">Review creator-uploaded posts and videos for free Chillies rewards</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">{pending}</p><p className="text-sm text-muted-foreground">Pending Review</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">{approved}</p><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">{rejected}</p><p className="text-sm text-muted-foreground">Rejected</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">All Submissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading submissions...</p>
              ) : rows.map((item) => (
                <div key={item.id} className={`rounded-lg border p-4 ${item.status === "Pending" ? "border-warning/30 bg-warning/5" : "border-border/50"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {item.type === "Video" ? <Video className="mt-0.5 h-5 w-5 text-primary" /> : <Image className="mt-0.5 h-5 w-5 text-accent" />}
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold">{item.title}</span>
                          <Badge variant="secondary" className={statusColors[item.status]}>{item.status}</Badge>
                        </div>
                        <p className="mb-1 text-xs text-muted-foreground">by <span className="font-medium text-foreground">{item.creator}</span> • {item.date}</p>
                        <a className="cursor-pointer text-xs text-primary hover:underline" href={item.link.startsWith("http") ? item.link : `https://${item.link}`} target="_blank" rel="noreferrer">{item.link}</a>
                        {item.status === "Approved" && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                            <Flame className="h-3 w-3" /> Reward issued
                          </p>
                        )}
                        {item.reason && <p className="mt-1 text-xs text-destructive">Reason: {item.reason}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "Pending" && (
                        <>
                          <Button size="sm" variant="outline" className="border-success/30 text-success hover:bg-success/10" onClick={() => void updateStatus(item.id, "approved")}>
                            <CheckCircle className="mr-1 h-3 w-3" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => void updateStatus(item.id, "rejected")}>
                            <XCircle className="mr-1 h-3 w-3" /> Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-1 h-3 w-3" /> Suggest
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
              {!isLoading && rows.length === 0 && (
                <p className="text-sm text-muted-foreground">No submissions found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminContentReview;
