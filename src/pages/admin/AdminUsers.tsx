import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Flame } from "lucide-react";

const creators = [
  { name: "Sarah Johnson", email: "sarah@creator.com", niche: "Lifestyle", rack: 92, chillies: 245, status: "Approved", joined: "Sep 2024" },
  { name: "Mike Thompson", email: "mike@creator.com", niche: "Tech", rack: 88, chillies: 120, status: "Approved", joined: "Oct 2024" },
  { name: "Priya Kapoor", email: "priya@creator.com", niche: "Fashion", rack: 95, chillies: 380, status: "Approved", joined: "Aug 2024" },
  { name: "Alex Rivera", email: "alex@creator.com", niche: "Fitness", rack: 78, chillies: 50, status: "Suspended", joined: "Nov 2024" },
  { name: "Emma Chen", email: "emma@creator.com", niche: "Food", rack: 91, chillies: 200, status: "Approved", joined: "Dec 2024" },
];
const brands = [
  { name: "TechFlow Inc.", email: "hello@techflow.com", industry: "Technology", campaigns: 24, status: "Approved", joined: "Jan 2025" },
  { name: "StyleCo", email: "info@styleco.com", industry: "Fashion", campaigns: 12, status: "Approved", joined: "Feb 2025" },
  { name: "GadgetHub", email: "team@gadgethub.com", industry: "Electronics", campaigns: 8, status: "Suspended", joined: "Mar 2025" },
  { name: "FitLife", email: "hi@fitlife.com", industry: "Health", campaigns: 15, status: "Approved", joined: "Jan 2025" },
];
const sc: Record<string, string> = { "Approved": "bg-success/10 text-success", "Suspended": "bg-destructive/10 text-destructive" };

const AdminUsers = () => (
  <DashboardLayout sidebar={<AdminSidebar />} title="User Management" userInitials="AD">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9" /></div>
      </div>
      <Tabs defaultValue="creators">
        <TabsList><TabsTrigger value="creators">Creators ({creators.length})</TabsTrigger><TabsTrigger value="brands">Brands ({brands.length})</TabsTrigger></TabsList>
        <TabsContent value="creators">
          <Card><CardContent className="p-0"><table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-medium">Creator</th><th className="p-4 font-medium">Niche</th><th className="p-4 font-medium">RACK</th><th className="p-4 font-medium">Chillies</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Joined</th><th className="p-4 font-medium">Actions</th></tr></thead>
            <tbody>{creators.map(c => (
              <tr key={c.email} className="border-b border-border/50 last:border-0">
                <td className="p-4"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.email}</p></td>
                <td className="p-4">{c.niche}</td>
                <td className="p-4"><span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" />{c.rack}</span></td>
                <td className="p-4"><span className="flex items-center gap-1 text-accent"><Flame className="h-3 w-3" />{c.chillies}</span></td>
                <td className="p-4"><Badge variant="secondary" className={sc[c.status]}>{c.status}</Badge></td>
                <td className="p-4 text-muted-foreground">{c.joined}</td>
                <td className="p-4"><Button variant="outline" size="sm">View</Button></td>
              </tr>
            ))}</tbody>
          </table></CardContent></Card>
        </TabsContent>
        <TabsContent value="brands">
          <Card><CardContent className="p-0"><table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-medium">Brand</th><th className="p-4 font-medium">Industry</th><th className="p-4 font-medium">Campaigns</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Joined</th><th className="p-4 font-medium">Actions</th></tr></thead>
            <tbody>{brands.map(b => (
              <tr key={b.email} className="border-b border-border/50 last:border-0">
                <td className="p-4"><p className="font-medium">{b.name}</p><p className="text-xs text-muted-foreground">{b.email}</p></td>
                <td className="p-4">{b.industry}</td><td className="p-4">{b.campaigns}</td>
                <td className="p-4"><Badge variant="secondary" className={sc[b.status]}>{b.status}</Badge></td>
                <td className="p-4 text-muted-foreground">{b.joined}</td>
                <td className="p-4"><Button variant="outline" size="sm">View</Button></td>
              </tr>
            ))}</tbody>
          </table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
);
export default AdminUsers;
