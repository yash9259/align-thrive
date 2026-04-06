import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BrandSidebar from "@/components/layout/BrandSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building, Globe, Mail, Phone, MapPin, Calendar, Megaphone } from "lucide-react";
import {
  fetchBrandProfileData,
  getCurrentBrandContext,
  updateBrandProfile,
  type BrandProfileData,
  type BrandProfileUpdateInput,
} from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const emptyProfile: BrandProfileData = {
  fullName: "",
  companyName: "",
  website: "",
  industry: "",
  location: "",
  about: "",
  email: "",
  phone: "",
  totalCampaigns: 0,
  creatorsWorkedWith: 0,
  totalSpent: 0,
  campaignHistory: [],
};

const BrandProfile = () => {
  const [profile, setProfile] = useState<BrandProfileData>(emptyProfile);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<BrandProfileUpdateInput>({
    fullName: "",
    phone: "",
    companyName: "",
    website: "",
    industry: "",
    location: "",
    about: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const context = await getCurrentBrandContext();
        setBrandId(context.userId);
        const data = await fetchBrandProfileData(context.userId);
        setProfile(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load profile.";
        toast({ title: "Profile error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const openEdit = () => {
    setEditForm({
      fullName: profile.fullName,
      phone: profile.phone,
      companyName: profile.companyName,
      website: profile.website,
      industry: profile.industry,
      location: profile.location,
      about: profile.about,
    });
    setIsEditOpen(true);
  };

  const onSaveProfile = async () => {
    if (!brandId) return;
    if (!editForm.companyName.trim()) {
      toast({ title: "Validation", description: "Company name is required.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await updateBrandProfile(brandId, editForm);
      setProfile((prev) => ({
        ...prev,
        fullName: editForm.fullName,
        phone: editForm.phone,
        companyName: editForm.companyName,
        website: editForm.website,
        industry: editForm.industry,
        location: editForm.location,
        about: editForm.about,
      }));
      setIsEditOpen(false);
      toast({ title: "Profile updated", description: "Your brand profile was saved." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile.";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profile.companyName
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BR";

  return (
    <DashboardLayout sidebar={<BrandSidebar />} title="Profile" userInitials="TF">
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl gradient-primary text-xl sm:text-2xl font-bold text-primary-foreground">{initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold">{isLoading ? "Loading..." : profile.companyName}</h2>
                  <Badge className="bg-success/10 text-success w-fit">Verified Brand</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{profile.about || "Add brand description."}</p>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4 shrink-0" />{profile.industry || "General"}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4 shrink-0" />{profile.website || "-"}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{profile.location || "-"}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" />Live Account</div>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto shrink-0" onClick={openEdit}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{profile.totalCampaigns}</p><p className="text-sm text-muted-foreground">Total Campaigns</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">{profile.creatorsWorkedWith}</p><p className="text-sm text-muted-foreground">Creators Worked With</p></CardContent></Card>
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold gradient-text">${profile.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p><p className="text-sm text-muted-foreground">Total Spent</p></CardContent></Card>
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
                  {profile.campaignHistory.map((c) => (
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

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Brand Profile</DialogTitle>
              <DialogDescription>Update your company details that creators can see.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Contact Name</Label>
                  <Input
                    id="fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={editForm.industry}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editForm.website}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  rows={4}
                  value={editForm.about}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, about: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={() => void onSaveProfile()} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BrandProfile;