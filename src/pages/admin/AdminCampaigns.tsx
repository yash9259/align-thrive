import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const campaigns = [
  { name: "Brand Awareness Push", brand: "TechFlow Inc.", budget: "$2,500", status: "Open", applicants: 34, approval: "Approved" },
  { name: "Instagram Reel Promo", brand: "StyleCo", budget: "$800", status: "In Review", applicants: 18, approval: "Pending" },
  { name: "Product Launch", brand: "GadgetHub", budget: "$5,000", status: "Completed", applicants: 56, approval: "Approved" },
  { name: "Holiday Season Sale", brand: "ShopNow", budget: "$1,200", status: "Open", applicants: 12, approval: "Approved" },
  { name: "Fitness Challenge", brand: "FitLife", budget: "$1,500", status: "In Review", applicants: 22, approval: "Pending" },
  { name: "Tech Review Series", brand: "ByteWare", budget: "$3,000", status: "Open", applicants: 28, approval: "Approved" },
];
const sc: Record<string,string> = { "Open": "bg-success/10 text-success", "In Review": "bg-warning/10 text-warning", "Completed": "bg-muted text-muted-foreground" };
const ac: Record<string,string> = { "Approved": "bg-success/10 text-success", "Pending": "bg-warning/10 text-warning" };

const AdminCampaigns = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Campaign Management" userInitials="AD">
    <Card><CardHeader><CardTitle className="text-base">All Campaigns</CardTitle></CardHeader>
      <CardContent className="p-0"><table className="w-full text-sm">
        <thead><tr className="border-b border-border text-left text-muted-foreground">
          <th className="p-4 font-medium">Campaign</th><th className="p-4 font-medium">Brand</th><th className="p-4 font-medium">Budget</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Applicants</th><th className="p-4 font-medium">Approval</th><th className="p-4 font-medium">Actions</th>
        </tr></thead>
        <tbody>{campaigns.map(c => (
          <tr key={c.name} className="border-b border-border/50 last:border-0">
            <td className="p-4 font-medium">{c.name}</td><td className="p-4 text-muted-foreground">{c.brand}</td><td className="p-4 font-medium">{c.budget}</td>
            <td className="p-4"><Badge variant="secondary" className={sc[c.status]}>{c.status}</Badge></td>
            <td className="p-4">{c.applicants}</td>
            <td className="p-4"><Badge variant="secondary" className={ac[c.approval]}>{c.approval}</Badge></td>
            <td className="p-4"><Button variant="outline" size="sm">Manage</Button></td>
          </tr>
        ))}</tbody>
      </table></CardContent>
    </Card>
  </DashboardLayout>
);
export default AdminCampaigns;
