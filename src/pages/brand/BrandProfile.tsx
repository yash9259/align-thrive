import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Globe, Mail, Phone, MapPin, Calendar, Megaphone } from "lucide-react";

const pastCampaigns = [
  { name: "Summer Collection Launch", status: "Completed", creators: 8, spent: "$4,200" },
  { name: "App Download Drive", status: "Completed", creators: 12, spent: "$6,800" },
  { name: "Holiday Gift Guide", status: "Completed", creators: 5, spent: "$2,100" },
];

const BrandProfile = () => (
  <DashboardLayout sidebar={<BrandSidebar />} title="Profile" userInitials="TF">
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl gradient-primary text-xl sm:text-2xl font-bold text-primary-foreground">TF</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold">TechFlow Inc.</h2>
                <Badge className="bg-success/10 text-success w-fit">Verified Brand</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Leading SaaS company specializing in workflow automation and productivity tools for modern teams.</p>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4 shrink-0" />Technology</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4 shrink-0" />techflow.com</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />San Francisco, CA</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" />Joined Jan 2025</div>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto shrink-0">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">24</p><p className="text-sm text-muted-foreground">Total Campaigns</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">142</p><p className="text-sm text-muted-foreground">Creators Worked With</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">$45.2K</p><p className="text-sm text-muted-foreground">Total Spent</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Campaign History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Campaign</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Creators</th><th className="pb-3 font-medium">Spent</th>
              </tr></thead>
              <tbody>
                {pastCampaigns.map(c => (
                  <tr key={c.name} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3"><Badge variant="secondary" className="bg-muted text-muted-foreground">{c.status}</Badge></td>
                    <td className="py-3">{c.creators}</td>
                    <td className="py-3 font-medium">{c.spent}</td>
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

export default BrandProfile;