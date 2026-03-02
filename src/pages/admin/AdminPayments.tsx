import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const payments = [
  { creator: "Sarah Johnson", campaign: "Brand Awareness", amount: "$350", status: "Paid", date: "Feb 28, 2026" },
  { creator: "Priya Kapoor", campaign: "Product Launch", amount: "$500", status: "Pending", date: "Mar 1, 2026" },
  { creator: "Mike Thompson", campaign: "Tech Review", amount: "$280", status: "Paid", date: "Feb 25, 2026" },
  { creator: "Emma Chen", campaign: "Holiday Sale", amount: "$400", status: "Processing", date: "Mar 2, 2026" },
  { creator: "Jordan Williams", campaign: "Travel Promo", amount: "$600", status: "Paid", date: "Feb 22, 2026" },
];
const sc: Record<string,string> = { "Paid": "bg-success/10 text-success", "Pending": "bg-warning/10 text-warning", "Processing": "bg-primary/10 text-primary" };

const AdminPayments = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Payments" userInitials="AD">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">$45.2K</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">$38.1K</p><p className="text-sm text-muted-foreground">Paid Out</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">$7.1K</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Payout History</CardTitle></CardHeader>
        <CardContent className="p-0"><table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-medium">Creator</th><th className="p-4 font-medium">Campaign</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th></tr></thead>
          <tbody>{payments.map(p => (
            <tr key={p.creator+p.campaign} className="border-b border-border/50 last:border-0">
              <td className="p-4 font-medium">{p.creator}</td><td className="p-4 text-muted-foreground">{p.campaign}</td><td className="p-4 font-medium">{p.amount}</td>
              <td className="p-4"><Badge variant="secondary" className={sc[p.status]}>{p.status}</Badge></td><td className="p-4 text-muted-foreground">{p.date}</td>
            </tr>
          ))}</tbody>
        </table></CardContent>
      </Card>
    </div>
  </DashboardLayout>
);
export default AdminPayments;
