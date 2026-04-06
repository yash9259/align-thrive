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
import { Flame, Info, Eye, EyeOff, Instagram, Youtube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

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

const estimateFollowersFromRange = (range: string): number => {
  switch (range) {
    case "0-5k":
      return 2500;
    case "5k-10k":
      return 7500;
    case "10k-50k":
      return 30000;
    case "50k-100k":
      return 75000;
    case "100k-500k":
      return 300000;
    case "500k-1M":
      return 750000;
    case "1M+":
      return 1200000;
    default:
      return 0;
  }
};

const computeFollowersByPlatform = (
  selectedPlatforms: string[],
  followerRange: string,
  youtubeCountInput: number | null,
) => {
  const estimatedFollowers = estimateFollowersFromRange(followerRange);
  const platformKeyMap: Record<string, "instagram" | "youtube" | "tiktok" | "snapchat"> = {
    Instagram: "instagram",
    YouTube: "youtube",
    TikTok: "tiktok",
    Snapchat: "snapchat",
  };

  const selectedPlatformKeys = selectedPlatforms
    .map((p) => platformKeyMap[p])
    .filter((p): p is "instagram" | "youtube" | "tiktok" | "snapchat" => Boolean(p));

  const followersByPlatform = {
    instagram: 0,
    youtube: 0,
    tiktok: 0,
    snapchat: 0,
  };

  const youtubeCount = youtubeCountInput ?? 0;
  if (youtubeCount > 0) {
    followersByPlatform.youtube = youtubeCount;
  }

  const remainingFollowers = Math.max(estimatedFollowers - followersByPlatform.youtube, 0);
  const distributionTargets = selectedPlatformKeys.filter((p) => !(p === "youtube" && followersByPlatform.youtube > 0));

  if (remainingFollowers > 0 && distributionTargets.length > 0) {
    const share = Math.floor(remainingFollowers / distributionTargets.length);
    let remainder = remainingFollowers - share * distributionTargets.length;
    distributionTargets.forEach((key) => {
      followersByPlatform[key] += share;
      if (remainder > 0) {
        followersByPlatform[key] += 1;
        remainder -= 1;
      }
    });
  }

  if (estimatedFollowers > 0 && Object.values(followersByPlatform).every((v) => v === 0)) {
    followersByPlatform.instagram = estimatedFollowers;
  }

  return followersByPlatform;
};

const creatorSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  address: z.string().trim().min(3, "Address is required").max(300),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  promotionFee: z.string().trim().min(1, "Enter your per promotion fee"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  instagramLink: z.string().trim().optional(),
  youtubeLink: z.string().trim().optional(),
  tiktokLink: z.string().trim().optional(),
  snapchatLink: z.string().trim().optional(),
  niche: z.string().trim().min(2, "Enter your content niche"),
  language: z.string().trim().min(2, "Enter your content language"),
  followers: z.string().min(1, "Select follower range"),
  engagementRate: z.string().trim().min(1, "Enter engagement rate percentage"),
  nationality: z.string().trim().min(2, "Enter your nationality"),
  audienceNationality: z.string().trim().min(2, "Enter audience nationality"),
  description: z.string().trim().min(10, "Describe your work (min 10 characters)").max(1000),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((d) => {
  return !!(d.instagramLink || d.youtubeLink || d.tiktokLink || d.snapchatLink);
}, {
  message: "Add at least one social media link",
  path: ["instagramLink"],
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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAudience, setIsFetchingAudience] = useState(false);
  const [youtubeSubscribers, setYoutubeSubscribers] = useState<number | null>(null);

  // Creator state
  const [creator, setCreator] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    address: "", phone: "", promotionFee: "", platforms: [] as string[],
    instagramLink: "", youtubeLink: "", tiktokLink: "", snapchatLink: "",
    niche: "", language: "", followers: "",
    engagementRate: "2.5",
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

  const normalizeUrlLikeInput = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const extractHandle = (url: string): string | null => {
    const raw = url.trim();
    if (!raw) return null;

    if (raw.startsWith("@")) {
      return raw.slice(1).trim() || null;
    }

    // Allow direct username/channel inputs without full URL.
    if (!raw.includes("/") && !raw.includes(".") && !raw.includes(" ")) {
      return raw;
    }

    try {
      const parsed = new URL(normalizeUrlLikeInput(raw));
      const host = parsed.hostname.toLowerCase();
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (!parts.length) return null;

      if (host.includes("snapchat.com") && parts[0]?.toLowerCase() === "add" && parts[1]) {
        return parts[1];
      }

      if (host.includes("youtube.com") && parts[0]?.startsWith("@")) {
        return parts[0].slice(1);
      }

      const last = parts[parts.length - 1];
      return last?.startsWith("@") ? last.slice(1) : last || null;
    } catch {
      return raw.replace(/^@/, "") || null;
    }
  };

  const followerRangeFromCount = (count: number): string => {
    if (count < 5000) return "0-5k";
    if (count < 10000) return "5k-10k";
    if (count < 50000) return "10k-50k";
    if (count < 100000) return "50k-100k";
    if (count < 500000) return "100k-500k";
    if (count < 1000000) return "500k-1M";
    return "1M+";
  };

  const parseYouTubeIdentifier = (youtubeUrl: string): { kind: "handle" | "channelId"; value: string } | null => {
    const raw = youtubeUrl.trim();
    if (!raw) return null;

    if (raw.startsWith("@") && raw.length > 1) {
      return { kind: "handle", value: raw.slice(1) };
    }

    if (/^UC[\w-]{6,}$/i.test(raw)) {
      return { kind: "channelId", value: raw };
    }

    try {
      const parsed = new URL(normalizeUrlLikeInput(raw));
      const parts = parsed.pathname.split("/").filter(Boolean);
      const first = parts[0] ?? "";
      const second = parts[1] ?? "";

      if (first.startsWith("@")) {
        return { kind: "handle", value: first.slice(1) };
      }

      if (first === "channel" && second) {
        return { kind: "channelId", value: second };
      }

      return null;
    } catch {
      return null;
    }
  };

  const fetchYouTubeSubscribers = async () => {
    if (!creator.youtubeLink.trim()) {
      toast({ title: "Add YouTube link", description: "Paste a YouTube handle or channel URL first.", variant: "destructive" });
      return;
    }

    const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      toast({
        title: "YouTube API key missing",
        description: "Set VITE_YOUTUBE_API_KEY to auto-fetch subscriber count.",
        variant: "destructive",
      });
      return;
    }

    const identifier = parseYouTubeIdentifier(creator.youtubeLink);
    if (!identifier) {
      toast({ title: "Invalid YouTube URL", description: "Use format like youtube.com/@handle or youtube.com/channel/ID", variant: "destructive" });
      return;
    }

    setIsFetchingAudience(true);
    try {
      const query = identifier.kind === "handle"
        ? `forHandle=${encodeURIComponent(identifier.value)}`
        : `id=${encodeURIComponent(identifier.value)}`;
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&${query}&key=${youtubeApiKey}`;
      const response = await fetch(url);
      const payload = await response.json();

      const subscriberCount = Number(payload?.items?.[0]?.statistics?.subscriberCount ?? 0);
      if (!Number.isFinite(subscriberCount) || subscriberCount <= 0) {
        toast({ title: "No channel stats found", description: "Could not fetch subscriber count from this URL.", variant: "destructive" });
        return;
      }

      setYoutubeSubscribers(subscriberCount);
      updateCreator("followers", followerRangeFromCount(subscriberCount));
      toast({ title: "YouTube subscribers fetched", description: `${subscriberCount.toLocaleString()} subscribers detected.` });
    } catch {
      toast({ title: "Fetch failed", description: "Could not fetch subscriber count. Try again later.", variant: "destructive" });
    } finally {
      setIsFetchingAudience(false);
    }
  };

  const createCreatorProfile = async (userId: string) => {
    if (!supabase) return;

    const followersByPlatform = computeFollowersByPlatform(creator.platforms, creator.followers, youtubeSubscribers);

    const parsedEngagementRate = Number(creator.engagementRate);
    const engagementRate = Number.isFinite(parsedEngagementRate) && parsedEngagementRate >= 0
      ? parsedEngagementRate
      : 2.5;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      role: "creator",
      full_name: creator.fullName,
      email: creator.email,
      phone: creator.phone,
    });

    if (profileError) throw profileError;

    const { error: creatorProfileError } = await supabase.from("creator_profiles").upsert({
      id: userId,
      bio: creator.description,
      niche: creator.niche,
      languages: [creator.language],
      location: creator.address,
      instagram_handle: extractHandle(creator.instagramLink),
      youtube_channel: extractHandle(creator.youtubeLink),
      tiktok_handle: extractHandle(creator.tiktokLink),
      snapchat_handle: extractHandle(creator.snapchatLink),
      instagram_followers: followersByPlatform.instagram,
      youtube_subscribers: followersByPlatform.youtube,
      tiktok_followers: followersByPlatform.tiktok,
      snapchat_followers: followersByPlatform.snapchat,
      engagement_rate: engagementRate,
    });

    if (creatorProfileError) throw creatorProfileError;
  };

  const createBrandProfile = async (userId: string) => {
    if (!supabase) return;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      role: "brand",
      full_name: brand.fullName,
      email: brand.email,
      phone: brand.phone,
    });

    if (profileError) throw profileError;

    const { error: brandProfileError } = await supabase.from("brand_profiles").upsert({
      id: userId,
      company_name: brand.companyName,
      industry: brand.businessField,
      location: brand.officeAddress,
      about: brand.businessDescription,
    });

    if (brandProfileError) throw brandProfileError;
  };

  const togglePlatform = (platform: string) => {
    const current = creator.platforms;
    const updated = current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform];
    updateCreator("platforms", updated);
  };

  const handleCreatorSubmit = async () => {
    const result = creatorSchema.safeParse(creator);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
      setCreatorErrors(errs);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast({ title: "Supabase not configured", description: "Set Supabase URL and anon key in .env", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: creator.email,
        password: creator.password,
        options: {
          data: {
            role: "creator",
            full_name: creator.fullName,
            bio: creator.description,
            niche: creator.niche,
            language: creator.language,
            location: creator.address,
            instagram_handle: extractHandle(creator.instagramLink),
            youtube_channel: extractHandle(creator.youtubeLink),
            tiktok_handle: extractHandle(creator.tiktokLink),
            snapchat_handle: extractHandle(creator.snapchatLink),
            followers_range: creator.followers,
            engagement_rate: Number(creator.engagementRate) || 2.5,
            instagram_followers: computeFollowersByPlatform(creator.platforms, creator.followers, youtubeSubscribers).instagram,
            youtube_subscribers: computeFollowersByPlatform(creator.platforms, creator.followers, youtubeSubscribers).youtube,
            tiktok_followers: computeFollowersByPlatform(creator.platforms, creator.followers, youtubeSubscribers).tiktok,
            snapchat_followers: computeFollowersByPlatform(creator.platforms, creator.followers, youtubeSubscribers).snapchat,
          },
        },
      });

      if (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        return;
      }

      if (data.user && data.session) {
        await createCreatorProfile(data.user.id);
        toast({ title: "Creator account created!", description: "Welcome to Align." });
        navigate("/creator");
        return;
      }

      toast({
        title: "Verify your email",
        description: "Account created. Please verify your email, then sign in.",
      });
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandSubmit = async () => {
    const result = brandSchema.safeParse(brand);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => { errs[e.path[0] as string] = e.message; });
      setBrandErrors(errs);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast({ title: "Supabase not configured", description: "Set Supabase URL and anon key in .env", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: brand.email,
        password: brand.password,
        options: {
          data: {
            role: "brand",
            full_name: brand.fullName,
            company_name: brand.companyName,
          },
        },
      });

      if (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        return;
      }

      if (data.user && data.session) {
        await createBrandProfile(data.user.id);
        toast({ title: "Brand account created!", description: "Welcome to Align." });
        navigate("/brand");
        return;
      }

      toast({
        title: "Verify your email",
        description: "Account created. Please verify your email, then sign in.",
      });
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
                  <Label className="mb-2 block">Social Media Links</Label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500 shrink-0" />
                        <Input placeholder="https://instagram.com/yourhandle" value={creator.instagramLink} onChange={(e) => updateCreator("instagramLink", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                        <Input placeholder="https://youtube.com/@yourchannel" value={creator.youtubeLink} onChange={(e) => updateCreator("youtubeLink", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.97a8.35 8.35 0 0 0 4.77 1.52V7.04a4.84 4.84 0 0 1-1.01-.35z"/></svg>
                        <Input placeholder="https://tiktok.com/@yourhandle" value={creator.tiktokLink} onChange={(e) => updateCreator("tiktokLink", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.41 7.15-1.76 8.28a.74.74 0 0 1-1.06.46l-2.69-2-1.42 1.37a.5.5 0 0 1-.47.13l.21-3.06 5.53-5a.24.24 0 0 0-.29-.38L8.69 13.5l-2.63-.82a.49.49 0 0 1 0-.94l10.25-3.94a.74.74 0 0 1 1.1.55z"/></svg>
                        <Input placeholder="https://snapchat.com/add/yourusername" value={creator.snapchatLink} onChange={(e) => updateCreator("snapchatLink", e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={fetchYouTubeSubscribers} disabled={isFetchingAudience}>
                      {isFetchingAudience ? "Fetching..." : "Fetch YouTube Subscribers"}
                    </Button>
                    <p className="text-xs text-muted-foreground">Instagram/TikTok/Snapchat follower fetch needs platform business APIs (not available directly from client).</p>
                  </div>
                  {youtubeSubscribers !== null && (
                    <p className="text-xs text-success mt-2">Detected YouTube subscribers: {youtubeSubscribers.toLocaleString()}</p>
                  )}
                  <FieldError msg={creatorErrors.instagramLink} />
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

                <div>
                  <Label>Average Engagement Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 3.5"
                    value={creator.engagementRate}
                    onChange={(e) => updateCreator("engagementRate", e.target.value)}
                  />
                  <FieldError msg={creatorErrors.engagementRate} />
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


                <Button className="w-full gradient-primary text-primary-foreground h-11 text-sm font-semibold" onClick={handleCreatorSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Creator Account"}
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

                <Button className="w-full gradient-primary text-primary-foreground h-11 text-sm font-semibold" onClick={handleBrandSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Brand Account"}
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
