import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Shield, DollarSign, Briefcase, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { fetchCreatorDashboardData, getCurrentCreatorContext, type CreatorDashboardData } from "@/lib/creator-api";

const emptyData: CreatorDashboardData = {
  chilliesBalance: 0,
  recentChilliesDelta: 0,
  isVerified: false,
  badgeStatus: "Inactive",
  activeBidsCount: 0,
  shortlistedCount: 0,
  totalEarnings: 0,
  earningsOverTime: [],
  activeBids: [],
};

const statusColors: Record<string, string> = {
  Applied: "bg-primary/10 text-primary",
  Shortlisted: "bg-success/10 text-success",
  Accepted: "bg-accent/10 text-accent",
  Rejected: "bg-destructive/10 text-destructive",
};

const CreatorDashboard = () => {
  const [dashboard, setDashboard] = useState<CreatorDashboardData>(emptyData);
  const [userInitials, setUserInitials] = useState("CR");
  const [rackScore, setRackScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const context = await getCurrentCreatorContext();
        const data = await fetchCreatorDashboardData(context.userId);
        if (!active) return;
        setUserInitials(context.initials);
        setRackScore(context.rackScore);
        setDashboard(data);
      } catch (error) {
        if (!active) return;
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

  const rackBreakdown = useMemo(() => {
    return [
      { label: "Reliability", score: Math.min(100, rackScore + 4), color: "bg-success" },
      { label: "Activity", score: Math.max(0, rackScore - 4), color: "bg-primary" },
      { label: "Content Quality", score: Math.min(100, rackScore + 2), color: "bg-accent" },
      { label: "Knowledge", score: Math.max(0, rackScore - 1), color: "bg-warning" },
    ];
  }, [rackScore]);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Dashboard" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-4 sm:p-5">
              <Flame className="mb-2 h-5 w-5 text-accent" />
              <p className="text-2xl font-bold text-accent sm:text-3xl">{isLoading ? "..." : dashboard.chilliesBalance}</p>
              <p className="text-xs text-muted-foreground">Chillies Balance</p>
              <p className="mt-1 text-xs text-success">{dashboard.recentChilliesDelta >= 0 ? "+" : ""}{dashboard.recentChilliesDelta} this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <Shield className="h-5 w-5 text-success" />
                <Badge className="bg-success/10 text-success text-[10px]">{dashboard.badgeStatus}</Badge>
              </div>
              <p className="text-base font-bold sm:text-lg">{dashboard.isVerified ? "Verified ?" : "Not verified"}</p>
              <p className="text-xs text-muted-foreground">Buy Chillies or complete reviews to improve visibility.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <Briefcase className="mb-2 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold sm:text-3xl">{isLoading ? "..." : dashboard.activeBidsCount}</p>
              <p className="text-xs text-muted-foreground">Active Bids</p>
              <p className="mt-1 text-xs text-success">{dashboard.shortlistedCount} shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <DollarSign className="mb-2 h-5 w-5 text-success" />
              <p className="text-2xl font-bold sm:text-3xl">{isLoading ? "..." : `$${dashboard.totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}</p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="mt-1 flex items-center gap-0.5 text-xs text-success"><ArrowUpRight className="h-3 w-3" />Live from paid campaigns</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader><CardTitle className="text-base">Earnings Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboard.earningsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value: number) => [`$${value}`, "Earnings"]} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(262, 80%, 50%)" fill="hsl(262, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">RACK Score</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary sm:h-32 sm:w-32">
                  <div className="text-center">
                    <p className="text-2xl font-bold sm:text-3xl">{isLoading ? "..." : rackScore}</p>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {rackBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{item.label}</span><span className="font-medium">{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
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
              {dashboard.activeBids.length ? dashboard.activeBids.map((bid) => (
                <div key={`${bid.campaign}-${bid.brand}`} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{bid.campaign}</p>
                    <p className="text-xs text-muted-foreground">{bid.brand}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-0.5 text-xs text-accent"><Flame className="h-3 w-3" />{bid.chillies} used</span>
                    <span className="font-bold text-success">{bid.bid}</span>
                    <Badge variant="secondary" className={statusColors[bid.status] ?? "bg-muted text-muted-foreground"}>{bid.status}</Badge>
                  </div>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No bids yet. Start applying to live campaigns from the Projects page.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
