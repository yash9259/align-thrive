import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { fetchAdminCommunication, getCurrentAdminContext, type AdminCommunicationData } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const emptyData: AdminCommunicationData = {
  totalConversations: 0,
  flaggedMessages: 0,
  cleanRate: 100,
  rows: [],
};

const AdminCommunication = () => {
  const [data, setData] = useState<AdminCommunicationData>(emptyData);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, communication] = await Promise.all([getCurrentAdminContext(), fetchAdminCommunication()]);
        if (!active) return;
        setUserInitials(context.initials);
        setData(communication);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load communication feed.";
        toast({ title: "Communication error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Communication" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold">{data.totalConversations.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Conversations</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">{data.flaggedMessages.toLocaleString()}</p><p className="text-sm text-muted-foreground">Flagged Messages</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">{data.cleanRate.toFixed(1)}%</p><p className="text-sm text-muted-foreground">Clean Rate</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base">Recent Conversations</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            ) : data.rows.map((chat) => (
              <div key={chat.id} className={`flex items-center justify-between rounded-lg border p-4 ${chat.flagged ? "border-destructive/30 bg-destructive/5" : "border-border/50"}`}>
                <div className="flex items-center gap-3">
                  {chat.flagged && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
                  <div>
                    <p className="text-sm"><span className="font-medium">{chat.from}</span> → <span className="font-medium">{chat.to}</span></p>
                    <p className="text-xs text-muted-foreground">{chat.preview}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                  {chat.flagged && <Badge variant="secondary" className="bg-destructive/10 text-destructive">Flagged</Badge>}
                </div>
              </div>
            ))}
            {!isLoading && data.rows.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent conversations found.</p>
            )}
          </div></CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCommunication;
