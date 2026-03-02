import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Star, Flame, Shield, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Creator {
  name: string;
  email: string;
  niche: string;
  rack: { reliability: number; activity: number; contentQuality: number; knowledge: number };
  chillies: number;
  status: string;
  joined: string;
}

const initialCreators: Creator[] = [
  { name: "Sarah Johnson", email: "sarah@creator.com", niche: "Lifestyle", rack: { reliability: 95, activity: 88, contentQuality: 94, knowledge: 91 }, chillies: 245, status: "Approved", joined: "Sep 2024" },
  { name: "Mike Thompson", email: "mike@creator.com", niche: "Tech", rack: { reliability: 90, activity: 82, contentQuality: 88, knowledge: 92 }, chillies: 120, status: "Approved", joined: "Oct 2024" },
  { name: "Priya Kapoor", email: "priya@creator.com", niche: "Fashion", rack: { reliability: 97, activity: 93, contentQuality: 96, knowledge: 94 }, chillies: 380, status: "Approved", joined: "Aug 2024" },
  { name: "Alex Rivera", email: "alex@creator.com", niche: "Fitness", rack: { reliability: 72, activity: 80, contentQuality: 78, knowledge: 82 }, chillies: 50, status: "Suspended", joined: "Nov 2024" },
  { name: "Emma Chen", email: "emma@creator.com", niche: "Food", rack: { reliability: 93, activity: 89, contentQuality: 91, knowledge: 90 }, chillies: 200, status: "Approved", joined: "Dec 2024" },
];

const brands = [
  { name: "TechFlow Inc.", email: "hello@techflow.com", industry: "Technology", campaigns: 24, status: "Approved", joined: "Jan 2025" },
  { name: "StyleCo", email: "info@styleco.com", industry: "Fashion", campaigns: 12, status: "Approved", joined: "Feb 2025" },
  { name: "GadgetHub", email: "team@gadgethub.com", industry: "Electronics", campaigns: 8, status: "Suspended", joined: "Mar 2025" },
  { name: "FitLife", email: "hi@fitlife.com", industry: "Health", campaigns: 15, status: "Approved", joined: "Jan 2025" },
];

const sc: Record<string, string> = { Approved: "bg-success/10 text-success", Suspended: "bg-destructive/10 text-destructive" };

const getRackAvg = (r: Creator["rack"]) => Math.round((r.reliability + r.activity + r.contentQuality + r.knowledge) / 4);

const AdminUsers = () => {
  const [creators, setCreators] = useState(initialCreators);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [editRack, setEditRack] = useState({ reliability: 0, activity: 0, contentQuality: 0, knowledge: 0 });
  const { toast } = useToast();

  const openEdit = (c: Creator) => {
    setEditingCreator(c);
    setEditRack({ ...c.rack });
  };

  const saveRack = () => {
    if (!editingCreator) return;
    setCreators((prev) =>
      prev.map((c) => (c.email === editingCreator.email ? { ...c, rack: { ...editRack } } : c))
    );
    toast({ title: "RACK Score Updated", description: `${editingCreator.name}'s scores have been saved.` });
    setEditingCreator(null);
  };

  const rackLabels: { key: keyof Creator["rack"]; label: string; color: string }[] = [
    { key: "reliability", label: "Reliability", color: "bg-success" },
    { key: "activity", label: "Activity", color: "bg-primary" },
    { key: "contentQuality", label: "Content Quality", color: "bg-accent" },
    { key: "knowledge", label: "Knowledge", color: "bg-warning" },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="User Management" userInitials="AD">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="creators">
          <TabsList>
            <TabsTrigger value="creators">Creators ({creators.length})</TabsTrigger>
            <TabsTrigger value="brands">Brands ({brands.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Creator</th>
                      <th className="p-4 font-medium">Niche</th>
                      <th className="p-4 font-medium">RACK Score</th>
                      <th className="p-4 font-medium">Breakdown</th>
                      <th className="p-4 font-medium">Chillies</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Joined</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((c) => (
                      <tr key={c.email} className="border-b border-border/50 last:border-0">
                        <td className="p-4">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </td>
                        <td className="p-4">{c.niche}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-bold text-base">{getRackAvg(c.rack)}</span>
                            <span className="text-xs text-muted-foreground">/ 100</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5">
                            {rackLabels.map(({ key, label, color }) => (
                              <div key={key} className="text-center" title={label}>
                                <div className="h-1.5 w-10 rounded-full bg-secondary mb-0.5">
                                  <div className={`h-full rounded-full ${color}`} style={{ width: `${c.rack[key]}%` }} />
                                </div>
                                <span className="text-[9px] text-muted-foreground">{label[0]}: {c.rack[key]}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 text-accent">
                            <Flame className="h-3 w-3" />{c.chillies}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={sc[c.status]}>{c.status}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{c.joined}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(c)} className="gap-1.5">
                              <Pencil className="h-3 w-3" /> RACK
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brands">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Brand</th>
                      <th className="p-4 font-medium">Industry</th>
                      <th className="p-4 font-medium">Campaigns</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Joined</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((b) => (
                      <tr key={b.email} className="border-b border-border/50 last:border-0">
                        <td className="p-4">
                          <p className="font-medium">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.email}</p>
                        </td>
                        <td className="p-4">{b.industry}</td>
                        <td className="p-4">{b.campaigns}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className={sc[b.status]}>{b.status}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{b.joined}</td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* RACK Edit Dialog */}
      <Dialog open={!!editingCreator} onOpenChange={(open) => !open && setEditingCreator(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Edit RACK Score — {editingCreator?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overall score preview */}
            <div className="flex items-center justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary">
                <div className="text-center">
                  <p className="text-2xl font-bold">{getRackAvg(editRack)}</p>
                  <p className="text-[10px] text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>

            {/* Individual sliders */}
            {rackLabels.map(({ key, label, color }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{label}</Label>
                  <span className="text-sm font-bold">{editRack[key]}</span>
                </div>
                <Slider
                  value={[editRack[key]]}
                  onValueChange={([v]) => setEditRack((prev) => ({ ...prev, [key]: v }))}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-1.5 rounded-full bg-secondary -mt-1">
                  <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${editRack[key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCreator(null)}>Cancel</Button>
            <Button onClick={saveRack} className="gradient-primary text-primary-foreground">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUsers;
