import { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Info, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const platforms = ["YouTube", "Instagram", "TikTok", "Snapchat"] as const;

const followerRanges = [
  "0-5k",
  "5k-10k",
  "10k-50k",
  "50k-100k",
  "100k-500k",
  "500k-1M",
  "1M+",
];

const creatorSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  address: z.string().trim().min(3, "Address is required").max(300),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  promotionFee: z.string().trim().min(1, "Enter your per promotion fee"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  channelLinks: z.string().trim().min(3, "Enter at least one link"),
  niche: z.string().trim().min(2, "Enter your content niche"),
  language: z.string().trim().min(2, "Enter your content language"),
  followers: z.string().min(1, "Select follower range"),
  nationality: z.string().trim().min(2, "Enter your nationality"),
  audienceNationality: z.string().trim().min(2, "Enter audience nationality"),
  description: z.string().trim().min(10, "Describe your work (min 10 characters)").max(1000),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const brandSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  companyName: z.string().trim().min(2, "Company name is required").max(200),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  officeAddress: z.string().trim().min(3, "Office address is required").max(300),
  businessField: z.string().trim().min(2, "Business field is required").max(200),
  businessDescription: z.string().trim().min(10, "Describe your business (min 10 characters)").max(1000),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [tab, setTab] = useState("creator");
  const { toast } = useToast();

  // Creator state
  const [creator, setCreator] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    address: "", phone: "", promotionFee: "", platforms: [] as string[],
    channelLinks: "", niche: "", language: "", followers: "",
    nationality: "", audienceNationality: "", description: "",
  });
  const [creatorErrors, setCreatorErrors] = useState<Record<string, string>>({});
  const [showCreatorPw, setShowCreatorPw] = useState(false);
  const [showCreatorCpw, setShowCreatorCpw] = useState(false);

  // Brand state
  const [brand, setBrand] = useState({
    fullName: "", companyName: "", email: "", password: "", confirmPassword: "",
    phone: "", officeAddress: "", businessField: "", businessDescription: "",
  });
  const [brandErrors, setBrandErrors] = useState<Record<string, string>>({});
  const [showBrandPw, setShowBrandPw] = useState(false);
  const [showBrandCpw, setShowBrandCpw] = useState(false);

  const updateCreator = (field: string, value: string | string[]) => {
    setCreator((p) => ({ ...p, [field]: value }));
    setCreatorErrors((p) => ({ ...p, [field]: "" }));
  };

  const updateBrand = (field: string, value: string) => {
    setBrand((p) => ({ ...p, [field]: value }));
    setBrandErrors((p) => ({ ...p, [field]: "" }));
  };

  const togglePlatform = (platform: string) => {
    const current = creator.platforms;
    const updated = current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform];
    updateCreator("platforms", updated);
  };

  const handleCreatorSubmit = () => {
    const result = creatorSchema.safeParse(creator);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
      setCreatorErrors(errs);
      return;
    }
    toast({ title: "Creator account created!", description: "Welcome to Align 🎉" });
  };

  const handleBrandSubmit = () => {
    const result = brandSchema.safeParse(brand);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
      setBrandErrors(errs);
      return;
    }
    toast({ title: "Brand account created!", description: "Welcome to Align 🎉" });
  };

  const FieldError = ({ msg }: { msg?: string }) => msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-10">
        <Card className="w-full max-w-2xl border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-display">Join Align</CardTitle>
            <p className="text-sm text-muted-foreground">Create your account and start collaborating</p>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="creator">🎥 Creator</TabsTrigger>
                <TabsTrigger value="brand">🧑‍💼 Brand</TabsTrigger>
              </TabsList>

              {/* ═══════ CREATOR FORM ═══════ */}
              <TabsContent value="creator" className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your name" value={creator.fullName} onChange={(e) => updateCreator("fullName", e.target.value)} />
                  <FieldError msg={creatorErrors.fullName} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" value={creator.email} onChange={(e) => updateCreator("email", e.target.value)} />
                  <FieldError msg={creatorErrors.email} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input type={showCreatorPw ? "text" : "password"} placeholder="Min 8 characters" value={creator.password} onChange={(e) => updateCreator("password", e.target.value)} />
                      <button type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowCreatorPw(!showCreatorPw)}>
                        {showCreatorPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError msg={creatorErrors.password} />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input type={showCreatorCpw ? "text" : "password"} placeholder="Re-enter password" value={creator.confirmPassword} onChange={(e) => updateCreator("confirmPassword", e.target.value)} />
                      <button type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowCreatorCpw(!showCreatorCpw)}>
                        {showCreatorCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError msg={creatorErrors.confirmPassword} />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input placeholder="Enter your address" value={creator.address} onChange={(e) => updateCreator("address", e.target.value)} />
                  <FieldError msg={creatorErrors.address} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input type="tel" placeholder="Enter your phone number" value={creator.phone} onChange={(e) => updateCreator("phone", e.target.value)} />
                    <FieldError msg={creatorErrors.phone} />
                  </div>
                  <div>
                    <Label>Per Promotion Fee (USD)</Label>
                    <Input type="number" placeholder="Enter your charge" value={creator.promotionFee} onChange={(e) => updateCreator("promotionFee", e.target.value)} />
                    <FieldError msg={creatorErrors.promotionFee} />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Platforms</Label>
                  <div className="flex flex-wrap gap-3">
                    {platforms.map((p) => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={creator.platforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError msg={creatorErrors.platforms} />
                </div>

                <div>
                  <Label>Links to Channel / Page / Handle</Label>
                  <Textarea placeholder="Paste your social media links here (one per line)" rows={3} value={creator.channelLinks} onChange={(e) => updateCreator("channelLinks", e.target.value)} />
                  <FieldError msg={creatorErrors.channelLinks} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Niche of Content</Label>
                    <Input placeholder="e.g. Fashion, Tech, Food" value={creator.niche} onChange={(e) => updateCreator("niche", e.target.value)} />
                    <FieldError msg={creatorErrors.niche} />
                  </div>
                  <div>
                    <Label>Language of Content</Label>
                    <Input placeholder="e.g. English, Hindi" value={creator.language} onChange={(e) => updateCreator("language", e.target.value)} />
                    <FieldError msg={creatorErrors.language} />
                  </div>
                </div>

                <div>
                  <Label>How many Followers / Subscribers do you have?</Label>
                  <Select value={creator.followers} onValueChange={(v) => updateCreator("followers", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {followerRanges.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError msg={creatorErrors.followers} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Your Nationality</Label>
                    <Input placeholder="Enter your nationality" value={creator.nationality} onChange={(e) => updateCreator("nationality", e.target.value)} />
                    <FieldError msg={creatorErrors.nationality} />
                  </div>
                  <div>
                    <Label>Nationality of Majority of Audience</Label>
                    <Input placeholder="Your audience is from?" value={creator.audienceNationality} onChange={(e) => updateCreator("audienceNationality", e.target.value)} />
                    <FieldError msg={creatorErrors.audienceNationality} />
                  </div>
                </div>

                <div>
                  <Label>Describe Your Work</Label>
                  <Textarea placeholder="Tell brands about yourself, your content style, and what makes you unique..." rows={4} value={creator.description} onChange={(e) => updateCreator("description", e.target.value)} />
                  <FieldError msg={creatorErrors.description} />
                </div>


                <Button className="w-full gradient-primary text-primary-foreground h-11 text-sm font-semibold" onClick={handleCreatorSubmit}>
                  Create Creator Account
                </Button>
              </TabsContent>

              {/* ═══════ BRAND FORM ═══════ */}
              <TabsContent value="brand" className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your full name" value={brand.fullName} onChange={(e) => updateBrand("fullName", e.target.value)} />
                  <FieldError msg={brandErrors.fullName} />
                </div>

                <div>
                  <Label>Company / Business Name</Label>
                  <Input placeholder="Enter your company name" value={brand.companyName} onChange={(e) => updateBrand("companyName", e.target.value)} />
                  <FieldError msg={brandErrors.companyName} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="hello@company.com" value={brand.email} onChange={(e) => updateBrand("email", e.target.value)} />
                  <FieldError msg={brandErrors.email} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input type={showBrandPw ? "text" : "password"} placeholder="Min 8 characters" value={brand.password} onChange={(e) => updateBrand("password", e.target.value)} />
                      <button type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowBrandPw(!showBrandPw)}>
                        {showBrandPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError msg={brandErrors.password} />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input type={showBrandCpw ? "text" : "password"} placeholder="Re-enter password" value={brand.confirmPassword} onChange={(e) => updateBrand("confirmPassword", e.target.value)} />
                      <button type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowBrandCpw(!showBrandCpw)}>
                        {showBrandCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError msg={brandErrors.confirmPassword} />
                  </div>
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="Enter your phone number" value={brand.phone} onChange={(e) => updateBrand("phone", e.target.value)} />
                  <FieldError msg={brandErrors.phone} />
                </div>

                <div>
                  <Label>Office Address</Label>
                  <Input placeholder="Enter your office address" value={brand.officeAddress} onChange={(e) => updateBrand("officeAddress", e.target.value)} />
                  <FieldError msg={brandErrors.officeAddress} />
                </div>

                <div>
                  <Label>Field of Business</Label>
                  <Input placeholder="Enter your business field" value={brand.businessField} onChange={(e) => updateBrand("businessField", e.target.value)} />
                  <FieldError msg={brandErrors.businessField} />
                </div>

                <div>
                  <Label>Business Description</Label>
                  <Textarea placeholder="Describe your business, products, and what you're looking for in creators..." rows={4} value={brand.businessDescription} onChange={(e) => updateBrand("businessDescription", e.target.value)} />
                  <FieldError msg={brandErrors.businessDescription} />
                </div>

                <div className="rounded-lg bg-primary/10 p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Brand accounts are reviewed within 24 hours. You'll get access to our full creator network once approved.</p>
                </div>

                <Button className="w-full gradient-primary text-primary-foreground h-11 text-sm font-semibold" onClick={handleBrandSubmit}>
                  Create Brand Account
                </Button>
              </TabsContent>
            </Tabs>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
