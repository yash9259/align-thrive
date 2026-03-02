import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const categoryData = [
  { name: "Lifestyle", value: 35 }, { name: "Tech", value: 25 }, { name: "Fashion", value: 20 }, { name: "Fitness", value: 12 }, { name: "Food", value: 8 },
];
const COLORS = ["hsl(262,80%,50%)", "hsl(16,90%,55%)", "hsl(174,62%,47%)", "hsl(43,96%,56%)", "hsl(340,75%,55%)"];
const performanceData = [
  { month: "Jan", signups: 320, campaigns: 45, revenue: 12400 },
  { month: "Feb", signups: 480, campaigns: 62, revenue: 18200 },
  { month: "Mar", signups: 550, campaigns: 58, revenue: 15800 },
  { month: "Apr", signups: 720, campaigns: 78, revenue: 22100 },
  { month: "May", signups: 890, campaigns: 92, revenue: 28500 },
  { month: "Jun", signups: 1050, campaigns: 85, revenue: 24300 },
];
const chilliesData = [
  { month: "Jan", sold: 4200, free: 1800 }, { month: "Feb", sold: 6800, free: 2400 },
  { month: "Mar", sold: 5500, free: 3200 }, { month: "Apr", sold: 8900, free: 2800 },
  { month: "May", sold: 11200, free: 3600 }, { month: "Jun", sold: 9800, free: 4100 },
];

const AdminAnalytics = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="Analytics" userInitials="AD">
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Signups & Campaigns</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="signups" stroke="hsl(262,80%,50%)" strokeWidth={2} name="Signups" />
              <Line type="monotone" dataKey="campaigns" stroke="hsl(16,90%,55%)" strokeWidth={2} name="Campaigns" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Creator Categories</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Chillies Distribution</CardTitle></CardHeader><CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chilliesData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
            <Bar dataKey="sold" fill="hsl(16,90%,55%)" name="Sold" radius={[4,4,0,0]} />
            <Bar dataKey="free" fill="hsl(160,60%,45%)" name="Free (Promo)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent></Card>
    </div>
  </DashboardLayout>
);
export default AdminAnalytics;
