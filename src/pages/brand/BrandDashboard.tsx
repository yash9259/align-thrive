import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Users, DollarSign, UserCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const barData = [
  { month: "Jan", campaigns: 4 }, { month: "Feb", campaigns: 6 }, { month: "Mar", campaigns: 8 },
  { month: "Apr", campaigns: 5 }, { month: "May", campaigns: 12 }, { month: "Jun", campaigns: 9 },
  { month: "Jul", campaigns: 15 }, { month: "Aug", campaigns: 11 },
];

const lineData = [
  { day: "Mon", applicants: 24 }, { day: "Tue", applicants: 32 }, { day: "Wed", applicants: 18 },
  { day: "Thu", applicants: 45 }, { day: "Fri", applicants: 38 }, { day: "Sat", applicants: 52 }, { day: "Sun", applicants: 41 },
];

const recentCampaigns = [
  { name: "Brand Awareness Push", status: "Open", applicants: 34, budget: "$2,500" },
  { name: "Instagram Reel Promo", status: "In Review", applicants: 18, budget: "$800" },
  { name: "Product Launch Campaign", status: "Completed", applicants: 56, budget: "$5,000" },
  { name: "Holiday Season Sale", status: "Open", applicants: 12, budget: "$1,200" },
  { name: "Tech Review Series", status: "In Review", applicants: 28, budget: "$3,000" },
];

const statusColors: Record<string, string> = {
  "Open": "bg-success/10 text-success",
  "In Review": "bg-warning/10 text-warning",
  "Completed": "bg-muted text-muted-foreground",
};

const BrandDashboard = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Dashboard" userInitials="TF">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active Campaigns", value: "12", icon: Megaphone, change: "+3 this month", color: "text-primary" },
          { label: "Total Applicants", value: "284", icon: Users, change: "+48 this week", color: "text-accent" },
          { label: "Budget Spent", value: "$18,450", icon: DollarSign, change: "72% utilized", color: "text-success" },
          { label: "Shortlisted", value: "42", icon: UserCheck, change: "+8 new", color: "text-primary" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
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
              <BarChart data={barData}>
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
              <LineChart data={lineData}>
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
                {recentCampaigns.map((c) => (
                  <tr key={c.name} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3"><Badge variant="secondary" className={statusColors[c.status]}>{c.status}</Badge></td>
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

export default BrandDashboard;
