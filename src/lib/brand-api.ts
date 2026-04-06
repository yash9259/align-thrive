import { supabase } from "@/lib/supabase";

export type BrandContext = {
  userId: string;
  companyName: string;
  fullName: string;
};

export type BrandDashboardData = {
  activeCampaigns: number;
  totalApplicants: number;
  budgetSpent: number;
  shortlisted: number;
  campaignsOverTime: Array<{ month: string; campaigns: number }>;
  applicantsThisWeek: Array<{ day: string; applicants: number }>;
  recentCampaigns: Array<{ id: string; name: string; status: string; applicants: number; budget: string }>;
};

export type BrandCampaignListItem = {
  id: string;
  name: string;
  desc: string;
  budget: string;
  status: string;
  applicants: number;
  deadline: string;
  category: string;
  platform: string;
};

export type BrandCampaignFormInput = {
  title: string;
  description: string;
  category: string;
  platform: string;
  budgetMin: number;
  budgetMax: number;
  minFollowers: number;
  minEngagementRate: number;
  deadline: string | null;
  status: "draft" | "open" | "in_review" | "closed" | "completed" | "cancelled";
  priorityChilliesCost: number;
  deliverables: string[];
};

export type BrandCampaignDetailsData = {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  budgetMin: number | null;
  budgetMax: number | null;
  minFollowers: number | null;
  deadline: string | null;
  status: string;
  priorityChilliesCost: number;
  totalBids: number;
  deliverables: string[];
};

export type BrandCreatorBid = {
  bidId: string;
  creatorId: string;
  name: string;
  niche: string;
  followers: string;
  rack: number;
  chillies: number;
  bid: string;
  verified: boolean;
  priority: boolean;
  status: string;
};

export type BrandCampaignInvitation = {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorNiche: string;
  status: string;
  message: string;
  createdAt: string;
};

export type BrandCampaignContentSubmission = {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  caption: string;
  mediaUrls: string[];
  submittedAt: string;
  approvedAt: string | null;
  status: string;
};

export type DiscoverCreator = {
  id: string;
  name: string;
  niche: string;
  followers: string;
  engagement: string;
  rack: {
    reliability: number;
    activity: number;
    contentQuality: number;
    knowledge: number;
  };
  chillies: number;
  verified: boolean;
  platform: string;
};

export type BrandCreatorProfileDetails = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  rackScore: number;
  chilliesBalance: number;
  bio: string;
  niche: string;
  languages: string[];
  location: string;
  instagramHandle: string;
  instagramFollowers: number;
  youtubeChannel: string;
  youtubeSubscribers: number;
  tiktokHandle: string;
  tiktokFollowers: number;
  snapchatHandle: string;
  snapchatFollowers: number;
  engagementRate: number;
  combinedAudience: number;
  primaryPlatform: string;
};

export type BrandProfileData = {
  fullName: string;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  about: string;
  email: string;
  phone: string;
  totalCampaigns: number;
  creatorsWorkedWith: number;
  totalSpent: number;
  campaignHistory: Array<{ name: string; status: string; creators: number; spent: string }>;
};

export type BrandProfileUpdateInput = {
  fullName: string;
  phone: string;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  about: string;
};

export type BrandCommunityMemberStatus = "none" | "requested" | "incoming" | "following";

export type BrandCommunityMember = {
  id: string;
  name: string;
  isVerified: boolean;
  headline: string;
  location: string;
  status: BrandCommunityMemberStatus;
  requestId: string | null;
};

export type BrandCommunityDirectory = {
  members: BrandCommunityMember[];
  followingCount: number;
  incomingCount: number;
  pendingCount: number;
};

type CommunityRelationRow = {
  id: string;
  requester_id: string;
  target_id: string;
  status: string;
  requester: { id: string; role: string } | null;
  target: { id: string; role: string } | null;
};

const monthLabel = (d: Date) => d.toLocaleDateString([], { month: "short" });
const dayLabel = (d: Date) => d.toLocaleDateString([], { weekday: "short" });

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const displayStatus = (status: string) => status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getCurrentBrandContext = async (): Promise<BrandContext> => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "You are not signed in.");
  }

  const user = authData.user;
  const userId = user.id;

  const fullNameFromMeta = (user.user_metadata?.full_name as string | undefined)?.trim();
  const companyNameFromMeta = (user.user_metadata?.company_name as string | undefined)?.trim();
  const roleFromMeta = (user.user_metadata?.role as string | undefined)?.trim();
  const fallbackName = fullNameFromMeta || user.email?.split("@")[0] || "Brand User";
  const fallbackCompany = companyNameFromMeta || "Brand";

  let { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .limit(1);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profileRows?.length) {
    const { error: insertProfileError } = await supabase.from("profiles").upsert({
      id: userId,
      role: roleFromMeta === "brand" ? "brand" : "brand",
      full_name: fallbackName,
      email: user.email ?? "",
    });

    if (insertProfileError) {
      throw new Error(insertProfileError.message);
    }

    const { error: insertBrandProfileError } = await supabase.from("brand_profiles").upsert({
      id: userId,
      company_name: fallbackCompany,
    });

    if (insertBrandProfileError) {
      throw new Error(insertBrandProfileError.message);
    }

    const retry = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", userId)
      .limit(1);

    profileRows = retry.data ?? [];
    profileError = retry.error;
  }

  if (profileError) {
    throw new Error(profileError.message);
  }

  const profile = profileRows?.[0];

  if (profileError || !profile) {
    throw new Error(profileError?.message ?? "Profile not found.");
  }

  if (profile.role !== "brand") {
    throw new Error("Only brand accounts can access this section.");
  }

  const { data: brandProfileRows } = await supabase
    .from("brand_profiles")
    .select("company_name")
    .eq("id", userId)
    .limit(1);

  const brandProfile = brandProfileRows?.[0];

  return {
    userId,
    companyName: brandProfile?.company_name ?? "Brand",
    fullName: profile.full_name,
  };
};

export const fetchBrandDashboardData = async (brandId: string): Promise<BrandDashboardData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("id, title, status, budget_max, budget_min, created_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (campaignsError) throw campaignsError;

  const campaignIds = (campaigns ?? []).map((c) => c.id);

  const { data: bids, error: bidsError } = campaignIds.length
    ? await supabase
        .from("bids")
        .select("campaign_id, status, created_at")
        .in("campaign_id", campaignIds)
    : { data: [], error: null };

  if (bidsError) throw bidsError;

  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount, status")
    .eq("brand_id", brandId)
    .eq("status", "paid");

  if (paymentsError) throw paymentsError;

  const activeCampaigns = (campaigns ?? []).filter((c) => c.status === "open" || c.status === "in_review").length;
  const totalApplicants = (bids ?? []).length;
  const shortlisted = (bids ?? []).filter((b) => b.status === "shortlisted").length;
  const budgetSpent = (payments ?? []).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const monthBuckets = new Map<string, number>();
  (campaigns ?? []).forEach((c) => {
    const label = monthLabel(new Date(c.created_at));
    monthBuckets.set(label, (monthBuckets.get(label) ?? 0) + 1);
  });

  const campaignsOverTime = Array.from(monthBuckets.entries())
    .map(([month, count]) => ({ month, campaigns: count }))
    .slice(-8);

  const today = new Date();
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
  const dayKeyToCount = new Map<string, number>(weekDays.map((d) => [d.toDateString(), 0]));

  (bids ?? []).forEach((b) => {
    const d = new Date(b.created_at);
    const key = d.toDateString();
    if (dayKeyToCount.has(key)) {
      dayKeyToCount.set(key, (dayKeyToCount.get(key) ?? 0) + 1);
    }
  });

  const applicantsThisWeek = weekDays.map((d) => ({ day: dayLabel(d), applicants: dayKeyToCount.get(d.toDateString()) ?? 0 }));

  const bidCountByCampaign = new Map<string, number>();
  (bids ?? []).forEach((b) => {
    bidCountByCampaign.set(b.campaign_id, (bidCountByCampaign.get(b.campaign_id) ?? 0) + 1);
  });

  const recentCampaigns = (campaigns ?? []).slice(0, 5).map((c) => {
    const budgetValue = Number(c.budget_max ?? c.budget_min ?? 0);
    return {
      id: c.id,
      name: c.title,
      status: c.status,
      applicants: bidCountByCampaign.get(c.id) ?? 0,
      budget: money(budgetValue),
    };
  });

  return {
    activeCampaigns,
    totalApplicants,
    budgetSpent,
    shortlisted,
    campaignsOverTime,
    applicantsThisWeek,
    recentCampaigns,
  };
};

export const fetchBrandCampaigns = async (brandId: string): Promise<BrandCampaignListItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("id, title, description, category, platform, budget_min, budget_max, status, deadline, created_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const { data: bids } = campaignIds.length
    ? await supabase.from("bids").select("campaign_id").in("campaign_id", campaignIds)
    : { data: [] as Array<{ campaign_id: string }> };

  const bidCountByCampaign = new Map<string, number>();
  (bids ?? []).forEach((b) => {
    bidCountByCampaign.set(b.campaign_id, (bidCountByCampaign.get(b.campaign_id) ?? 0) + 1);
  });

  return (campaigns ?? []).map((c) => ({
    id: c.id,
    name: c.title,
    desc: c.description ?? "",
    budget: money(Number(c.budget_max ?? c.budget_min ?? 0)),
    status: displayStatus(c.status),
    applicants: bidCountByCampaign.get(c.id) ?? 0,
    deadline: c.deadline ? new Date(c.deadline).toLocaleDateString() : "N/A",
    category: c.category ?? "General",
    platform: c.platform ?? "Any",
  }));
};

export const createBrandCampaign = async (brandId: string, input?: Partial<BrandCampaignFormInput>): Promise<string> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const normalizedDeliverables = (input?.deliverables ?? []).map((d) => d.trim()).filter(Boolean);

  const payload = {
    brand_id: brandId,
    title: input?.title?.trim() || `New Campaign ${new Date().toLocaleDateString()}`,
    description: input?.description?.trim() || "Add your campaign details and publish.",
    category: input?.category?.trim() || "General",
    platform: input?.platform?.trim() || "Instagram",
    budget_min: input?.budgetMin ?? 0,
    budget_max: input?.budgetMax ?? 0,
    min_followers: input?.minFollowers ?? 0,
    min_engagement_rate: input?.minEngagementRate ?? 0,
    deadline: input?.deadline || null,
    priority_chillies_cost: input?.priorityChilliesCost ?? 0,
    deliverables: normalizedDeliverables.length ? normalizedDeliverables : ["Define deliverables"],
    status: input?.status ?? "draft",
  };

  const { data: rows, error } = await supabase.from("campaigns").insert(payload).select("id").limit(1);
  const data = rows?.[0];
  if (error || !data) throw error ?? new Error("Unable to create campaign.");

  return data.id;
};

export const updateBrandCampaign = async (brandId: string, campaignId: string, input: BrandCampaignFormInput): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const deliverables = input.deliverables.map((d) => d.trim()).filter(Boolean);

  const payload = {
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim() || "General",
    platform: input.platform.trim() || "Instagram",
    budget_min: input.budgetMin,
    budget_max: input.budgetMax,
    min_followers: input.minFollowers,
    min_engagement_rate: input.minEngagementRate,
    deadline: input.deadline || null,
    status: input.status,
    priority_chillies_cost: input.priorityChilliesCost,
    deliverables,
  };

  const { error } = await supabase.from("campaigns").update(payload).eq("id", campaignId).eq("brand_id", brandId);
  if (error) throw error;
};

export const deleteBrandCampaign = async (brandId: string, campaignId: string): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("campaigns").delete().eq("id", campaignId).eq("brand_id", brandId);
  if (error) throw error;
};

export const fetchBrandCampaignDetails = async (brandId: string, campaignId: string): Promise<BrandCampaignDetailsData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error } = await supabase
    .from("campaigns")
    .select("id, title, description, category, platform, budget_min, budget_max, min_followers, deadline, status, priority_chillies_cost, total_bids, deliverables")
    .eq("id", campaignId)
    .eq("brand_id", brandId)
    .limit(1);

  const data = rows?.[0];

  if (error || !data) throw error ?? new Error("Campaign not found.");

  const deliverablesRaw = Array.isArray(data.deliverables) ? data.deliverables : [];
  const deliverables = deliverablesRaw.map((d) => String(d));

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    category: data.category ?? "General",
    platform: data.platform ?? "Any",
    budgetMin: data.budget_min,
    budgetMax: data.budget_max,
    minFollowers: data.min_followers,
    deadline: data.deadline,
    status: data.status,
    priorityChilliesCost: data.priority_chillies_cost ?? 0,
    totalBids: data.total_bids ?? 0,
    deliverables,
  };
};

export const fetchCampaignBids = async (campaignId: string): Promise<BrandCreatorBid[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: bids, error: bidsError } = await supabase
    .from("bids")
    .select("id, creator_id, amount, status, used_chillies, chillies_spent")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (bidsError) throw bidsError;

  const creatorIds = (bids ?? []).map((b) => b.creator_id);
  if (!creatorIds.length) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, is_verified, rack_score, chillies_balance")
    .in("id", creatorIds);
  if (profilesError) throw profilesError;

  const { data: creatorProfiles, error: creatorProfilesError } = await supabase
    .from("creator_profiles")
    .select("id, niche, combined_audience")
    .in("id", creatorIds);
  if (creatorProfilesError) throw creatorProfilesError;

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const creatorProfileMap = new Map((creatorProfiles ?? []).map((p) => [p.id, p]));

  return (bids ?? []).map((b) => {
    const p = profileMap.get(b.creator_id);
    const cp = creatorProfileMap.get(b.creator_id);
    return {
      bidId: b.id,
      creatorId: b.creator_id,
      name: p?.full_name ?? "Creator",
      niche: cp?.niche ?? "General",
      followers: `${Math.max(0, Math.round((cp?.combined_audience ?? 0) / 1000))}K`,
      rack: p?.rack_score ?? 0,
      chillies: p?.chillies_balance ?? 0,
      bid: money(Number(b.amount ?? 0)),
      verified: Boolean(p?.is_verified),
      priority: Boolean(b.used_chillies),
      status: b.status,
    };
  });
};

export const updateBidStatus = async (bidId: string, status: "shortlisted" | "accepted" | "rejected") => {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("bids").update({ status }).eq("id", bidId);
  if (error) throw error;
};

export const fetchCampaignInvitations = async (campaignId: string): Promise<BrandCampaignInvitation[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: invitationRows, error: invitationsError } = await supabase
    .from("invitations")
    .select("id, creator_id, status, message, created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (invitationsError) throw invitationsError;

  const creatorIds = (invitationRows ?? []).map((row) => row.creator_id);
  if (!creatorIds.length) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds);
  if (profilesError) throw profilesError;

  const { data: creatorProfiles, error: creatorProfilesError } = await supabase
    .from("creator_profiles")
    .select("id, niche")
    .in("id", creatorIds);
  if (creatorProfilesError) throw creatorProfilesError;

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const creatorProfileMap = new Map((creatorProfiles ?? []).map((profile) => [profile.id, profile]));

  return (invitationRows ?? []).map((row) => ({
    id: row.id,
    creatorId: row.creator_id,
    creatorName: profileMap.get(row.creator_id)?.full_name ?? "Creator",
    creatorNiche: creatorProfileMap.get(row.creator_id)?.niche ?? "General",
    status: row.status,
    message: row.message ?? "",
    createdAt: row.created_at,
  }));
};

export const fetchCampaignContentSubmissions = async (campaignId: string): Promise<BrandCampaignContentSubmission[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: submissionRows, error: submissionsError } = await supabase
    .from("content_submissions")
    .select("id, creator_id, title, caption, media_urls, submitted_at, approved_at, status")
    .eq("campaign_id", campaignId)
    .order("submitted_at", { ascending: false });

  if (submissionsError) throw submissionsError;

  const creatorIds = (submissionRows ?? []).map((row) => row.creator_id);
  if (!creatorIds.length) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds);
  if (profilesError) throw profilesError;

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));

  return (submissionRows ?? []).map((row) => ({
    id: row.id,
    creatorId: row.creator_id,
    creatorName: profileMap.get(row.creator_id) ?? "Creator",
    title: row.title ?? "Untitled submission",
    caption: row.caption ?? "",
    mediaUrls: Array.isArray(row.media_urls) ? row.media_urls.map((url) => String(url)) : [],
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at,
    status: row.status ?? "submitted",
  }));
};

export const updateContentSubmissionStatus = async (submissionId: string, status: "approved" | "revision_requested" | "rejected") => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const payload = {
    status,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("content_submissions").update(payload).eq("id", submissionId);
  if (error) throw error;
};

export const inviteCreatorForCampaign = async (campaignId: string, creatorId: string, brandId: string, message: string) => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: existingRows, error: existingError } = await supabase
    .from("invitations")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .eq("brand_id", brandId)
    .eq("status", "pending")
    .limit(1);

  if (existingError) throw existingError;
  if (existingRows?.length) {
    throw new Error("You already sent a pending invite to this creator for this campaign.");
  }

  const { error } = await supabase.from("invitations").insert({
    campaign_id: campaignId,
    brand_id: brandId,
    creator_id: creatorId,
    message,
    status: "pending",
  });
  if (error) throw error;
};

export const fetchPendingInviteCreatorIds = async (brandId: string, campaignId: string): Promise<string[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("invitations")
    .select("creator_id")
    .eq("brand_id", brandId)
    .eq("campaign_id", campaignId)
    .eq("status", "pending");

  if (error) throw error;
  return (data ?? []).map((row) => row.creator_id);
};

export const fetchDiscoverCreators = async (): Promise<DiscoverCreator[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, is_verified, rack_score, chillies_balance, role")
    .eq("role", "creator");
  if (profileError) throw profileError;

  const ids = (profiles ?? []).map((p) => p.id);
  if (!ids.length) return [];

  const { data: creatorProfiles, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id, niche, combined_audience, engagement_rate, instagram_followers, youtube_subscribers, tiktok_followers, snapchat_followers")
    .in("id", ids);
  if (creatorError) throw creatorError;

  const cpMap = new Map((creatorProfiles ?? []).map((c) => [c.id, c]));

  return (profiles ?? []).map((p) => {
    const cp = cpMap.get(p.id);
    const insta = cp?.instagram_followers ?? 0;
    const yt = cp?.youtube_subscribers ?? 0;
    const tt = cp?.tiktok_followers ?? 0;
    const sc = cp?.snapchat_followers ?? 0;

    let platform = "instagram";
    const maxVal = Math.max(insta, yt, tt, sc);
    if (maxVal === yt) platform = "youtube";
    if (maxVal === tt) platform = "tiktok";
    if (maxVal === sc) platform = "snapchat";

    return {
      id: p.id,
      name: p.full_name,
      niche: cp?.niche ?? "General",
      followers: `${Math.max(0, Math.round((cp?.combined_audience ?? 0) / 1000))}K`,
      engagement: `${Number(cp?.engagement_rate ?? 0).toFixed(1)}%`,
      rack: {
        reliability: p.rack_score ?? 0,
        activity: Math.max(0, (p.rack_score ?? 0) - 5),
        contentQuality: Math.min(100, (p.rack_score ?? 0) + 2),
        knowledge: Math.max(0, (p.rack_score ?? 0) - 2),
      },
      chillies: p.chillies_balance ?? 0,
      verified: Boolean(p.is_verified),
      platform,
    };
  });
};

export const fetchBrandCreatorProfileDetails = async (creatorId: string): Promise<BrandCreatorProfileDetails> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_verified, rack_score, chillies_balance, role")
    .eq("id", creatorId)
    .limit(1);

  const profile = profileRows?.[0];
  if (profileError || !profile) throw profileError ?? new Error("Creator not found.");
  if (profile.role !== "creator") throw new Error("This user is not a creator.");

  const { data: creatorRows, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("bio, niche, languages, location, instagram_handle, instagram_followers, youtube_channel, youtube_subscribers, tiktok_handle, tiktok_followers, snapchat_handle, snapchat_followers, engagement_rate, combined_audience")
    .eq("id", creatorId)
    .limit(1);

  const creator = creatorRows?.[0];
  if (creatorError || !creator) throw creatorError ?? new Error("Creator profile not found.");

  const instagramFollowers = creator.instagram_followers ?? 0;
  const youtubeSubscribers = creator.youtube_subscribers ?? 0;
  const tiktokFollowers = creator.tiktok_followers ?? 0;
  const snapchatFollowers = creator.snapchat_followers ?? 0;

  let primaryPlatform = "instagram";
  const maxVal = Math.max(instagramFollowers, youtubeSubscribers, tiktokFollowers, snapchatFollowers);
  if (maxVal === youtubeSubscribers) primaryPlatform = "youtube";
  if (maxVal === tiktokFollowers) primaryPlatform = "tiktok";
  if (maxVal === snapchatFollowers) primaryPlatform = "snapchat";

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? "",
    isVerified: Boolean(profile.is_verified),
    rackScore: profile.rack_score ?? 0,
    chilliesBalance: profile.chillies_balance ?? 0,
    bio: creator.bio ?? "",
    niche: creator.niche ?? "General",
    languages: Array.isArray(creator.languages) ? creator.languages : [],
    location: creator.location ?? "",
    instagramHandle: creator.instagram_handle ?? "",
    instagramFollowers,
    youtubeChannel: creator.youtube_channel ?? "",
    youtubeSubscribers,
    tiktokHandle: creator.tiktok_handle ?? "",
    tiktokFollowers,
    snapchatHandle: creator.snapchat_handle ?? "",
    snapchatFollowers,
    engagementRate: Number(creator.engagement_rate ?? 0),
    combinedAudience: creator.combined_audience ?? 0,
    primaryPlatform,
  };
};

export const fetchBrandProfileData = async (brandId: string): Promise<BrandProfileData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", brandId)
    .limit(1);
  const profile = profileRows?.[0];
  if (profileError || !profile) throw profileError ?? new Error("Profile not found.");

  let { data: brandProfileRows, error: brandProfileError } = await supabase
    .from("brand_profiles")
    .select("company_name, website, industry, location, about")
    .eq("id", brandId)
    .limit(1);

  if (!brandProfileError && !brandProfileRows?.length) {
    const { error: insertBrandProfileError } = await supabase.from("brand_profiles").upsert({
      id: brandId,
      company_name: "Brand",
    });
    if (insertBrandProfileError) throw insertBrandProfileError;

    const retry = await supabase
      .from("brand_profiles")
      .select("company_name, website, industry, location, about")
      .eq("id", brandId)
      .limit(1);
    brandProfileRows = retry.data ?? [];
    brandProfileError = retry.error;
  }

  const brandProfile = brandProfileRows?.[0];
  if (brandProfileError || !brandProfile) throw brandProfileError ?? new Error("Brand profile not found.");

  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("id, title, status")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });
  if (campaignsError) throw campaignsError;

  const campaignIds = (campaigns ?? []).map((c) => c.id);

  const { data: bids } = campaignIds.length
    ? await supabase.from("bids").select("campaign_id, creator_id").in("campaign_id", campaignIds)
    : { data: [] as Array<{ campaign_id: string; creator_id: string }> };

  const { data: payments } = await supabase.from("payments").select("amount, status").eq("brand_id", brandId).eq("status", "paid");

  const creatorsWorkedWith = new Set((bids ?? []).map((b) => b.creator_id)).size;
  const totalSpent = (payments ?? []).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const bidCountsByCampaign = new Map<string, number>();
  (bids ?? []).forEach((b) => {
    bidCountsByCampaign.set(b.campaign_id, (bidCountsByCampaign.get(b.campaign_id) ?? 0) + 1);
  });

  const campaignHistory = (campaigns ?? []).slice(0, 5).map((c) => ({
    name: c.title,
    status: c.status,
    creators: bidCountsByCampaign.get(c.id) ?? 0,
    spent: "$0",
  }));

  return {
    fullName: profile.full_name,
    companyName: brandProfile.company_name,
    website: brandProfile.website ?? "",
    industry: brandProfile.industry ?? "",
    location: brandProfile.location ?? "",
    about: brandProfile.about ?? "",
    email: profile.email,
    phone: profile.phone ?? "",
    totalCampaigns: (campaigns ?? []).length,
    creatorsWorkedWith,
    totalSpent,
    campaignHistory,
  };
};

export const updateBrandProfile = async (brandId: string, input: BrandProfileUpdateInput): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || "Brand User",
      phone: input.phone.trim() || null,
    })
    .eq("id", brandId);

  if (profileError) throw profileError;

  const { error: brandProfileError } = await supabase.from("brand_profiles").upsert({
    id: brandId,
    company_name: input.companyName.trim() || "Brand",
    website: input.website.trim() || null,
    industry: input.industry.trim() || null,
    location: input.location.trim() || null,
    about: input.about.trim() || null,
  });

  if (brandProfileError) throw brandProfileError;
};

const fetchBrandCommunityRelations = async (brandId: string): Promise<CommunityRelationRow[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status, requester:profiles!community_requests_requester_id_fkey(id, role), target:profiles!community_requests_target_id_fkey(id, role)")
    .or(`requester_id.eq.${brandId},target_id.eq.${brandId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CommunityRelationRow[];
};

const sendBrandAcceptanceMessage = async (brandId: string, otherUserId: string) => {
  if (!supabase) return;

  await supabase.from("messages").insert({
    sender_id: brandId,
    receiver_id: otherUserId,
    content: "Your brand community request was accepted. Let's connect.",
    content_type: "text",
  });
};

export const fetchBrandCommunityDirectory = async (brandId: string): Promise<BrandCommunityDirectory> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const [relations, profilesResult, brandProfilesResult] = await Promise.all([
    fetchBrandCommunityRelations(brandId),
    supabase
      .from("profiles")
      .select("id, full_name, is_verified")
      .eq("role", "brand")
      .neq("id", brandId)
      .order("full_name", { ascending: true }),
    supabase
      .from("brand_profiles")
      .select("id, company_name, industry, location"),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (brandProfilesResult.error) throw brandProfilesResult.error;

  const profiles = profilesResult.data ?? [];
  const brandMap = new Map((brandProfilesResult.data ?? []).map((row) => [row.id, row]));

  const members: BrandCommunityMember[] = profiles.map((profile) => {
    const outgoing = relations.find((row) => row.requester_id === brandId && row.target_id === profile.id && (row.status === "pending" || row.status === "accepted"));
    const incoming = relations.find((row) => row.requester_id === profile.id && row.target_id === brandId && row.status === "pending");

    let status: BrandCommunityMemberStatus = "none";
    let requestId: string | null = null;

    if (incoming) {
      status = "incoming";
      requestId = incoming.id;
    } else if (outgoing?.status === "accepted") {
      status = "following";
      requestId = outgoing.id;
    } else if (outgoing?.status === "pending") {
      status = "requested";
      requestId = outgoing.id;
    }

    const brandDetails = brandMap.get(profile.id);

    return {
      id: profile.id,
      name: brandDetails?.company_name || profile.full_name,
      isVerified: Boolean(profile.is_verified),
      headline: brandDetails?.industry || "Brand",
      location: brandDetails?.location || "Location not set",
      status,
      requestId,
    };
  });

  return {
    members,
    followingCount: members.filter((member) => member.status === "following" || member.status === "requested").length,
    incomingCount: members.filter((member) => member.status === "incoming").length,
    pendingCount: members.filter((member) => member.status === "requested").length,
  };
};

export const sendBrandCommunityRequest = async (
  brandId: string,
  targetBrandId: string,
  message = "",
): Promise<{ status: "pending" | "accepted"; requestId: string }> => {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (brandId === targetBrandId) throw new Error("You cannot request yourself.");

  const { data: existingRows, error: existingError } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status")
    .or(`and(requester_id.eq.${brandId},target_id.eq.${targetBrandId}),and(requester_id.eq.${targetBrandId},target_id.eq.${brandId})`)
    .limit(5);
  if (existingError) throw existingError;

  const existing = existingRows ?? [];
  const outgoing = existing.find((row) => row.requester_id === brandId && row.target_id === targetBrandId);
  const incoming = existing.find((row) => row.requester_id === targetBrandId && row.target_id === brandId);

  if (outgoing?.status === "accepted") {
    return { status: "accepted", requestId: outgoing.id };
  }

  if (outgoing?.status === "pending") {
    return { status: "pending", requestId: outgoing.id };
  }

  if (incoming?.status === "pending") {
    const { error: acceptError } = await supabase
      .from("community_requests")
      .update({ status: "accepted", responded_at: new Date().toISOString(), message: message.trim() || null })
      .eq("id", incoming.id)
      .eq("target_id", brandId);
    if (acceptError) throw acceptError;

    await sendBrandAcceptanceMessage(brandId, targetBrandId);
    return { status: "accepted", requestId: incoming.id };
  }

  if (outgoing) {
    const { error: resetError } = await supabase
      .from("community_requests")
      .update({ status: "pending", responded_at: null, message: message.trim() || null })
      .eq("id", outgoing.id)
      .eq("requester_id", brandId);
    if (resetError) throw resetError;

    return { status: "pending", requestId: outgoing.id };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("community_requests")
    .insert({
      requester_id: brandId,
      target_id: targetBrandId,
      status: "pending",
      message: message.trim() || null,
    })
    .select("id")
    .limit(1);
  if (insertError) throw insertError;

  return {
    status: "pending",
    requestId: inserted?.[0]?.id ?? "",
  };
};

export const respondToBrandCommunityRequest = async (
  brandId: string,
  requestId: string,
  action: "accepted" | "declined",
): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error: fetchError } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status")
    .eq("id", requestId)
    .eq("target_id", brandId)
    .limit(1);

  const row = rows?.[0];
  if (fetchError || !row) throw fetchError ?? new Error("Request not found.");
  if (row.status !== "pending") return;

  const { error: updateError } = await supabase
    .from("community_requests")
    .update({ status: action, responded_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("target_id", brandId);
  if (updateError) throw updateError;

  if (action === "accepted") {
    await sendBrandAcceptanceMessage(brandId, row.requester_id);
  }
};
