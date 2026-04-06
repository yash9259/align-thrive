import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAdminPayments, getCurrentAdminContext, type AdminPaymentsData } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const sc: Record<string,string> = { "Paid": "bg-success/10 text-success", "Pending": "bg-warning/10 text-warning", "Processing": "bg-primary/10 text-primary" };

const emptyData: AdminPaymentsData = {
  totalRevenue: 0,
  paidOut: 0,
  pending: 0,
  rows: [],
};

const AdminPayments = () => {
  const [data, setData] = useState<AdminPaymentsData>(emptyData);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, payments] = await Promise.all([getCurrentAdminContext(), fetchAdminPayments()]);
        if (!active) return;
        setUserInitials(context.initials);
        setData(payments);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load payments.";
        toast({ title: "Payments error", description: message, variant: "destructive" });
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
    <DashboardLayout sidebar={<AdminSidebar />} title="Payments" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">${data.totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">${data.paidOut.toLocaleString()}</p><p className="text-sm text-muted-foreground">Paid Out</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">${data.pending.toLocaleString()}</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base">Payout History</CardTitle></CardHeader>
          <CardContent className="p-0"><table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-medium">Creator</th><th className="p-4 font-medium">Campaign</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th></tr></thead>
            <tbody>
              {isLoading ? (
                <tr><td className="p-4 text-muted-foreground" colSpan={5}>Loading payments...</td></tr>
              ) : data.rows.map((payment) => (
                <tr key={payment.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4 font-medium">{payment.creator}</td><td className="p-4 text-muted-foreground">{payment.campaign}</td><td className="p-4 font-medium">{payment.amount}</td>
                  <td className="p-4"><Badge variant="secondary" className={sc[payment.status] ?? "bg-muted text-muted-foreground"}>{payment.status}</Badge></td><td className="p-4 text-muted-foreground">{payment.date}</td>
                </tr>
              ))}
              {!isLoading && data.rows.length === 0 && (
                <tr><td className="p-4 text-muted-foreground" colSpan={5}>No payments found.</td></tr>
              )}
            </tbody>
          </table></CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayments;
