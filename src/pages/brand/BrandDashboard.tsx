import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Users, DollarSign, UserCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { fetchBrandDashboardData, getCurrentBrandContext, type BrandDashboardData } from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const emptyData: BrandDashboardData = {
  activeCampaigns: 0,
  totalApplicants: 0,
  budgetSpent: 0,
  shortlisted: 0,
  campaignsOverTime: [],
  applicantsThisWeek: [],
  recentCampaigns: [],
};

const statusColors: Record<string, string> = {
  "Open": "bg-success/10 text-success",
  "In Review": "bg-warning/10 text-warning",
  "Completed": "bg-muted text-muted-foreground",
};

const BrandDashboard = () => {
  const [data, setData] = useState<BrandDashboardData>(emptyData);
  const [companyName, setCompanyName] = useState("Brand");
  const [userInitials, setUserInitials] = useState("BR");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentBrandContext();
        if (active) {
          setCompanyName(context.companyName || "Brand");
          setUserInitials(
            (context.companyName || context.fullName || "Brand")
              .split(" ")
              .filter(Boolean)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "BR",
          );
        }
        const dashboard = await fetchBrandDashboardData(context.userId);
        if (active) setData(dashboard);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load dashboard.";
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
      { label: "Active Campaigns", value: String(data.activeCampaigns), icon: Megaphone, change: "Live", color: "text-primary" },
      { label: "Total Applicants", value: String(data.totalApplicants), icon: Users, change: "Live", color: "text-accent" },
      { label: "Budget Spent", value: `$${data.budgetSpent.toLocaleString()}`, icon: DollarSign, change: "Paid only", color: "text-success" },
      { label: "Shortlisted", value: String(data.shortlisted), icon: UserCheck, change: "Live", color: "text-primary" },
    ];
  }, [data]);

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Dashboard" userInitials={userInitials}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{companyName}</h2>
          <p className="text-sm text-muted-foreground">Live overview of campaigns, applicants, and brand operations.</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
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
            <CardHeader><CardTitle className="text-base">Campaigns Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.campaignsOverTime}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="campaigns" fill="hsl(262, 80%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Applicants This Week</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.applicantsThisWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applicants" stroke="hsl(16, 90%, 55%)" strokeWidth={2} dot={{ fill: "hsl(16, 90%, 55%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Campaigns</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Applicants</th>
                  <th className="pb-3 font-medium">Budget</th>
                </tr></thead>
                <tbody>
                  {data.recentCampaigns.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3"><Badge variant="secondary" className={statusColors[c.status] ?? "bg-muted text-muted-foreground"}>{c.status}</Badge></td>
                      <td className="py-3">{c.applicants}</td>
                      <td className="py-3 font-medium">{c.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BrandDashboard;
