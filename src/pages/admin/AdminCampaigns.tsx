import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchAdminCampaigns, getCurrentAdminContext, type AdminCampaignListItem } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const sc: Record<string,string> = { "Open": "bg-success/10 text-success", "In Review": "bg-warning/10 text-warning", "Completed": "bg-muted text-muted-foreground" };
const ac: Record<string,string> = { "Approved": "bg-success/10 text-success", "Pending": "bg-warning/10 text-warning" };

const AdminCampaigns = () => {
  const [rows, setRows] = useState<AdminCampaignListItem[]>([]);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, data] = await Promise.all([getCurrentAdminContext(), fetchAdminCampaigns()]);
        if (!active) return;
        setUserInitials(context.initials);
        setRows(data);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load campaigns.";
        toast({ title: "Campaigns error", description: message, variant: "destructive" });
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
    <DashboardLayout sidebar={<AdminSidebar />} title="Campaign Management" userInitials={userInitials}>
      <Card>
        <CardHeader><CardTitle className="text-base">All Campaigns</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Campaign</th>
                <th className="p-4 font-medium">Brand</th>
                <th className="p-4 font-medium">Budget</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Applicants</th>
                <th className="p-4 font-medium">Approval</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="p-4 text-muted-foreground" colSpan={7}>Loading campaigns...</td></tr>
              ) : rows.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4 font-medium">{campaign.name}</td>
                  <td className="p-4 text-muted-foreground">{campaign.brand}</td>
                  <td className="p-4 font-medium">{campaign.budget}</td>
                  <td className="p-4"><Badge variant="secondary" className={sc[campaign.status] ?? "bg-muted text-muted-foreground"}>{campaign.status}</Badge></td>
                  <td className="p-4">{campaign.applicants}</td>
                  <td className="p-4"><Badge variant="secondary" className={ac[campaign.approval]}>{campaign.approval}</Badge></td>
                  <td className="p-4"><Button variant="outline" size="sm">Manage</Button></td>
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr><td className="p-4 text-muted-foreground" colSpan={7}>No campaigns found.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminCampaigns;
