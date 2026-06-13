import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Globe, Mail, MapPin, Phone, Calendar } from "lucide-react";
import { fetchBrandProfileData } from "@/lib/brand-api";
import { useToast } from "@/hooks/use-toast";

const BrandProfileView = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!brandId) {
        toast({ title: "Brand missing", description: "Brand id is required.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchBrandProfileData(brandId);
        setProfile(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load brand profile.";
        toast({ title: "Profile error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [brandId, toast]);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Brand Profile" userInitials="BR">
      <div className="max-w-4xl space-y-6">
        {isLoading && <p className="text-sm text-muted-foreground">Loading brand profile...</p>}

        {!isLoading && profile && (
          <>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl gradient-primary text-xl sm:text-2xl font-bold text-primary-foreground">
                    {(profile.companyName || "BR").split(" ").filter(Boolean).map((word: string) => word[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold">{profile.companyName || "Brand"}</h2>
                      <Badge className="bg-success/10 text-success w-fit">Verified Brand</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{profile.about || "Brand description will appear here."}</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4 shrink-0" />{profile.industry || "General"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4 shrink-0" />{profile.website || "-"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{profile.location || "-"}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" />Live Account</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{profile.email || "-"}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{profile.phone || "-"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>Contact person: {profile.fullName || "-"}</div>
                  <div>Total campaigns: {profile.totalCampaigns ?? 0}</div>
                  <div>Creators worked with: {profile.creatorsWorkedWith ?? 0}</div>
                  <div>Total spent: ${profile.totalSpent?.toLocaleString() ?? 0}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrandProfileView;
