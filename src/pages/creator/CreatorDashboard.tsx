import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Shield, TrendingUp, DollarSign, Star, Briefcase, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const earningsData = [
  { month: "Jan", earnings: 420 }, { month: "Feb", earnings: 680 }, { month: "Mar", earnings: 550 },
  { month: "Apr", earnings: 890 }, { month: "May", earnings: 1200 }, { month: "Jun", earnings: 980 },
  { month: "Jul", earnings: 1450 }, { month: "Aug", earnings: 1100 },
];

const activeBids = [
  { campaign: "Brand Awareness Push", brand: "TechFlow Inc.", bid: "$350", status: "Shortlisted", chillies: 30 },
  { campaign: "Instagram Reel Promo", brand: "StyleCo", bid: "$280", status: "Applied", chillies: 20 },
  { campaign: "Product Review Series", brand: "GadgetHub", bid: "$500", status: "Shortlisted", chillies: 50 },
];

const statusColors: Record<string, string> = {
  "Applied": "bg-primary/10 text-primary",
  "Shortlisted": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

const CreatorDashboard = () => (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Dashboard" userInitials="SJ">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="p-5">
            <Flame className="h-5 w-5 text-accent mb-2" />
            <p className="text-3xl font-bold text-accent">245</p>
            <p className="text-xs text-muted-foreground">Chillies Balance</p>
            <p className="mt-1 text-xs text-success">+50 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-success" />
              <Badge className="bg-success/10 text-success text-[10px]">Active</Badge>
            </div>
            <p className="text-lg font-bold">Verified ✓</p>
            <p className="text-xs text-muted-foreground">Badge expires in 28 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Briefcase className="h-5 w-5 text-primary mb-2" />
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Active Bids</p>
            <p className="mt-1 text-xs text-success">3 shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <DollarSign className="h-5 w-5 text-success mb-2" />
            <p className="text-3xl font-bold">$7,270</p>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="mt-1 text-xs text-success flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />+18% this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader><CardTitle className="text-base">Earnings Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Earnings"]} />
                <Area type="monotone" dataKey="earnings" stroke="hsl(262, 80%, 50%)" fill="hsl(262, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">RACK Score</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary">
                <div className="text-center">
                  <p className="text-3xl font-bold">92</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Reliability", score: 95, color: "bg-success" },
                { label: "Activity", score: 88, color: "bg-primary" },
                { label: "Content Quality", score: 94, color: "bg-accent" },
                { label: "Knowledge", score: 91, color: "bg-warning" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{r.label}</span><span className="font-medium">{r.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Active Bids</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeBids.map((b) => (
              <div key={b.campaign} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div>
                  <p className="font-medium">{b.campaign}</p>
                  <p className="text-xs text-muted-foreground">{b.brand}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-accent flex items-center gap-0.5"><Flame className="h-3 w-3" />{b.chillies} used</span>
                  <span className="font-bold text-success">{b.bid}</span>
                  <Badge variant="secondary" className={statusColors[b.status]}>{b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default CreatorDashboard;
