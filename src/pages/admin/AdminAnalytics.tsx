import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { fetchAdminAnalytics, getCurrentAdminContext, type AdminAnalyticsData } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(262,80%,50%)", "hsl(16,90%,55%)", "hsl(174,62%,47%)", "hsl(43,96%,56%)", "hsl(340,75%,55%)"];
const emptyData: AdminAnalyticsData = {
  signupsAndCampaigns: [],
  creatorCategories: [],
  chilliesDistribution: [],
};

const AdminAnalytics = () => {
  const [data, setData] = useState<AdminAnalyticsData>(emptyData);
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, analytics] = await Promise.all([getCurrentAdminContext(), fetchAdminAnalytics()]);
        if (!active) return;
        setUserInitials(context.initials);
        setData(analytics);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load analytics.";
        toast({ title: "Analytics error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const categoryData = data.creatorCategories.length ? data.creatorCategories : [{ name: "No data", value: 1 }];

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Analytics" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardHeader><CardTitle className="text-base">Signups & Campaigns</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.signupsAndCampaigns}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
                <Line type="monotone" dataKey="signups" stroke="hsl(262,80%,50%)" strokeWidth={2} name="Signups" />
                <Line type="monotone" dataKey="campaigns" stroke="hsl(16,90%,55%)" strokeWidth={2} name="Campaigns" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Creator Categories</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base">Chillies Distribution</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.chilliesDistribution}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Bar dataKey="sold" fill="hsl(16,90%,55%)" name="Sold" radius={[4,4,0,0]} />
              <Bar dataKey="free" fill="hsl(160,60%,45%)" name="Free (Promo)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        {isLoading && <p className="text-sm text-muted-foreground">Loading analytics...</p>}
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
