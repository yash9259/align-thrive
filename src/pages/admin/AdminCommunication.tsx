import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const chats = [
  { from: "Sarah Johnson", to: "TechFlow Inc.", preview: "Sounds great! I'll start on the reels tomorrow.", time: "2m ago", flagged: false },
  { from: "Alex Rivera", to: "FitLife", preview: "Can we negotiate the payment outside the platform?", time: "15m ago", flagged: true },
  { from: "Priya Kapoor", to: "StyleCo", preview: "Thank you! The campaign brief is very clear.", time: "1h ago", flagged: false },
  { from: "Mike Thompson", to: "GadgetHub", preview: "Let me give you my personal WhatsApp number...", time: "3h ago", flagged: true },
  { from: "Emma Chen", to: "ShopNow", preview: "I've uploaded the final deliverables for review.", time: "5h ago", flagged: false },
];

const AdminCommunication = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Communication" userInitials="AD">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold">1,284</p><p className="text-sm text-muted-foreground">Total Conversations</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">12</p><p className="text-sm text-muted-foreground">Flagged Messages</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">98.2%</p><p className="text-sm text-muted-foreground">Clean Rate</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Recent Conversations</CardTitle></CardHeader>
        <CardContent><div className="space-y-3">{chats.map((c, i) => (
          <div key={i} className={`flex items-center justify-between rounded-lg border p-4 ${c.flagged ? 'border-destructive/30 bg-destructive/5' : 'border-border/50'}`}>
            <div className="flex items-center gap-3">
              {c.flagged && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
              <div>
                <p className="text-sm"><span className="font-medium">{c.from}</span> → <span className="font-medium">{c.to}</span></p>
                <p className="text-xs text-muted-foreground">{c.preview}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{c.time}</span>
              {c.flagged && <Badge variant="secondary" className="bg-destructive/10 text-destructive">Flagged</Badge>}
            </div>
          </div>
        ))}</div></CardContent>
      </Card>
    </div>
  </DashboardLayout>
);
export default AdminCommunication;
