import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, DollarSign, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { fetchAdminDashboardData, getCurrentAdminContext, type AdminDashboardData } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const emptyData: AdminDashboardData = {
  totalBrands: 0,
  totalCreators: 0,
  activeCampaigns: 0,
  totalRevenue: 0,
  revenueByMonth: [],
  userGrowthByMonth: [],
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardData>(emptyData);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentAdminContext();
        const data = await fetchAdminDashboardData();
        if (!active) return;
        setUserInitials(context.initials);
        setDashboard(data);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load admin dashboard.";
        toast({ title: "Dashboard error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const kpis = useMemo(() => {
    return [
      { label: "Total Brands", value: dashboard.totalBrands.toLocaleString(), icon: Users, change: "Live", color: "text-primary" },
      { label: "Total Creators", value: dashboard.totalCreators.toLocaleString(), icon: Users, change: "Live", color: "text-accent" },
      { label: "Active Campaigns", value: dashboard.activeCampaigns.toLocaleString(), icon: Megaphone, change: "Live", color: "text-success" },
      { label: "Revenue", value: `$${dashboard.totalRevenue.toLocaleString()}`, icon: DollarSign, change: "Paid campaigns", color: "text-warning" },
    ];
  }, [dashboard]);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Admin Dashboard" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <ArrowUpRight className="h-4 w-4 text-success" />
                </div>
                <p className="text-2xl font-bold">{isLoading ? "..." : kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-xs text-success">{kpi.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboard.revenueByMonth}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Math.round(value / 1000)}K`} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="hsl(262,80%,50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dashboard.userGrowthByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="creators" stroke="hsl(262,80%,50%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="brands" stroke="hsl(16,90%,55%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
