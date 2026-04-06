import { useEffect, useMemo, useState } from "react";
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
import { Search, Flame, Shield, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminUsersData, getCurrentAdminContext, updateAdminCreatorRackScore, type AdminCreatorUser, type AdminBrandUser } from "@/lib/admin-api";

type Creator = AdminCreatorUser;
type Brand = AdminBrandUser;

const sc: Record<string, string> = { Approved: "bg-success/10 text-success", Suspended: "bg-destructive/10 text-destructive" };

const getRackAvg = (r: Creator["rack"]) => Math.round((r.reliability + r.activity + r.contentQuality + r.knowledge) / 4);

const AdminUsers = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [editRack, setEditRack] = useState({ reliability: 0, activity: 0, contentQuality: 0, knowledge: 0 });
  const [userInitials, setUserInitials] = useState("AD");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [context, users] = await Promise.all([getCurrentAdminContext(), fetchAdminUsersData()]);
        if (!active) return;
        setUserInitials(context.initials);
        setCreators(users.creators);
        setBrands(users.brands);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unable to load users.";
        toast({ title: "Users error", description: message, variant: "destructive" });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [toast]);

  const openEdit = (c: Creator) => {
    setEditingCreator(c);
    setEditRack({ ...c.rack });
  };

  const saveRack = async () => {
    if (!editingCreator) return;

    const nextScore = getRackAvg(editRack);

    try {
      await updateAdminCreatorRackScore(editingCreator.id, nextScore);
      setCreators((prev) =>
        prev.map((c) => (c.id === editingCreator.id ? { ...c, rack: { ...editRack } } : c)),
      );
      toast({ title: "RACK Score Updated", description: `${editingCreator.name}'s score is now ${nextScore}.` });
      setEditingCreator(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save RACK score.";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    }
  };

  const rackLabels: { key: keyof Creator["rack"]; label: string; color: string }[] = [
    { key: "reliability", label: "Reliability", color: "bg-success" },
    { key: "activity", label: "Activity", color: "bg-primary" },
    { key: "contentQuality", label: "Content Quality", color: "bg-accent" },
    { key: "knowledge", label: "Knowledge", color: "bg-warning" },
  ];

  const filteredCreators = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return creators;
    return creators.filter((creator) =>
      creator.name.toLowerCase().includes(q) ||
      creator.email.toLowerCase().includes(q) ||
      creator.niche.toLowerCase().includes(q),
    );
  }, [creators, search]);

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(q) ||
      brand.email.toLowerCase().includes(q) ||
      brand.industry.toLowerCase().includes(q),
    );
  }, [brands, search]);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="User Management" userInitials={userInitials}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="creators">
          <TabsList>
            <TabsTrigger value="creators">Creators ({filteredCreators.length})</TabsTrigger>
            <TabsTrigger value="brands">Brands ({filteredBrands.length})</TabsTrigger>
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
                    {isLoading ? (
                      <tr>
                        <td className="p-4 text-muted-foreground" colSpan={8}>Loading creators...</td>
                      </tr>
                    ) : filteredCreators.map((c) => (
                      <tr key={c.id} className="border-b border-border/50 last:border-0">
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
                    {!isLoading && filteredCreators.length === 0 && (
                      <tr>
                        <td className="p-4 text-muted-foreground" colSpan={8}>No creators found.</td>
                      </tr>
                    )}
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
                    {isLoading ? (
                      <tr>
                        <td className="p-4 text-muted-foreground" colSpan={6}>Loading brands...</td>
                      </tr>
                    ) : filteredBrands.map((b) => (
                      <tr key={b.id} className="border-b border-border/50 last:border-0">
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
                    {!isLoading && filteredBrands.length === 0 && (
                      <tr>
                        <td className="p-4 text-muted-foreground" colSpan={6}>No brands found.</td>
                      </tr>
                    )}
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
