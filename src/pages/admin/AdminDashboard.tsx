import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, DollarSign, Flame, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12400 }, { month: "Feb", revenue: 18200 }, { month: "Mar", revenue: 15800 },
  { month: "Apr", revenue: 22100 }, { month: "May", revenue: 28500 }, { month: "Jun", revenue: 24300 },
  { month: "Jul", revenue: 31200 }, { month: "Aug", revenue: 27800 },
];
const userGrowth = [
  { month: "Jan", creators: 800, brands: 200 }, { month: "Feb", creators: 1200, brands: 350 },
  { month: "Mar", creators: 1800, brands: 480 }, { month: "Apr", creators: 2500, brands: 620 },
  { month: "May", creators: 3400, brands: 780 }, { month: "Jun", creators: 4200, brands: 950 },
];

const AdminDashboard = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Admin Dashboard" userInitials="AD">
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Brands", value: "3,248", icon: Users, change: "+124 this month", color: "text-primary" },
          { label: "Total Creators", value: "12,584", icon: Users, change: "+892 this month", color: "text-accent" },
          { label: "Active Campaigns", value: "486", icon: Megaphone, change: "+48 this week", color: "text-success" },
          { label: "Revenue", value: "$182K", icon: DollarSign, change: "+22% MoM", color: "text-warning" },
        ].map((kpi) => (
          <Card key={kpi.label}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3"><kpi.icon className={`h-5 w-5 ${kpi.color}`} /><ArrowUpRight className="h-4 w-4 text-success" /></div>
            <p className="text-2xl font-bold">{kpi.value}</p><p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-xs text-success">{kpi.change}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Revenue</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v/1000}K`} /><Tooltip /><Bar dataKey="revenue" fill="hsl(262,80%,50%)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowth}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="creators" stroke="hsl(262,80%,50%)" strokeWidth={2} />
              <Line type="monotone" dataKey="brands" stroke="hsl(16,90%,55%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  </DashboardLayout>
);
export default AdminDashboard;
