import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type CreatorContext = {
  userId: string;
  fullName: string;
  email: string;
  initials: string;
  chilliesBalance: number;
  isVerified: boolean;
  rackScore: number;
};

export type CreatorDashboardData = {
  chilliesBalance: number;
  recentChilliesDelta: number;
  isVerified: boolean;
  badgeStatus: string;
  activeBidsCount: number;
  shortlistedCount: number;
  totalEarnings: number;
  earningsOverTime: Array<{ month: string; earnings: number }>;
  activeBids: Array<{ campaign: string; brand: string; bid: string; status: string; chillies: number }>;
};

export type CreatorProjectListItem = {
  id: string;
  name: string;
  brand: string;
  budget: string;
  status: string;
  chillies: number;
  deadline: string;
  category: string;
  hasBid: boolean;
};

export type CreatorProjectDetailsData = {
  id: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  brandIndustry: string;
  brandLocation: string;
  brandCampaignCount: number;
  budgetLabel: string;
  budgetValue: number;
  deadline: string | null;
  priorityChilliesCost: number;
  deliverables: string[];
  totalBids: number;
  avgBidAmount: number;
  category: string;
  platform: string;
  status: string;
  existingBid: null | {
    id: string;
    amount: number;
    coverMessage: string;
    usedChillies: boolean;
    chilliesSpent: number;
    status: string;
  };
};

export type CreatorInvitationItem = {
  id: string;
  brandId: string;
  brand: string;
  brandInitials: string;
  campaignId: string | null;
  campaign: string;
  budget: string;
  deadline: string;
  message: string;
  receivedAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
};

export type CreatorProfileData = {
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  chilliesBalance: number;
  rackScore: number;
  bio: string;
  niche: string;
  location: string;
  languages: string[];
  instagramHandle: string;
  instagramFollowers: number;
  youtubeChannel: string;
  youtubeSubscribers: number;
  tiktokHandle: string;
  tiktokFollowers: number;
  snapchatHandle: string;
  snapchatFollowers: number;
  combinedAudience: number;
  engagementRate: number;
  communityStats: CreatorCommunityStats;
  joinedAt: string;
  collaborationsCount: number;
  pastCollaborations: Array<{ brand: string; campaign: string; earned: string; date: string }>;
};

export type CreatorCommunityStats = {
  creatorFollowers: number;
  creatorFollowing: number;
  creatorPendingIncoming: number;
  companyFollowers: number;
  companyFollowing: number;
  companyPendingIncoming: number;
};

export type CreatorCommunityMemberStatus = "none" | "requested" | "incoming" | "following";

export type CreatorCommunityMember = {
  id: string;
  name: string;
  isVerified: boolean;
  headline: string;
  location: string;
  audienceLabel: string;
  status: CreatorCommunityMemberStatus;
  requestId: string | null;
  requestedAt: string | null;
};

export type CreatorCommunityDirectory = {
  members: CreatorCommunityMember[];
  followingCount: number;
  incomingCount: number;
  pendingCount: number;
};

export type CreatorProfileUpdateInput = {
  fullName: string;
  phone: string;
  bio: string;
  niche: string;
  location: string;
  languages: string[];
  instagramHandle: string;
  instagramFollowers: number;
  youtubeChannel: string;
  youtubeSubscribers: number;
  tiktokHandle: string;
  tiktokFollowers: number;
  snapchatHandle: string;
  snapchatFollowers: number;
  engagementRate: number;
};

export type CreatorSubmissionCampaignOption = {
  id: string;
  title: string;
  brandName: string;
};

export type CreatorContentSubmissionItem = {
  id: string;
  campaignId: string | null;
  campaignTitle: string;
  brandName: string;
  title: string;
  caption: string;
  mediaUrls: string[];
  submittedAt: string;
  status: string;
};

export type CreatorPurchaseHistoryItem = {
  id: string;
  date: string;
  chillies: number;
  price: string;
  method: "card" | "upi" | "paypal";
  badge: string;
  status: "completed";
};

export type CreatorSocialSyncResult = {
  provider: string | null;
  youtubeSubscribers: number | null;
  facebookFollowers: number | null;
  instagramFollowers: number | null;
  details: string[];
};

type CommunityRole = "creator" | "brand";

type CommunityRelationRow = {
  id: string;
  requester_id: string;
  target_id: string;
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
  requester: { id: string; role: string; full_name: string; is_verified: boolean } | null;
  target: { id: string; role: string; full_name: string; is_verified: boolean } | null;
};

const emptyCommunityStats = (): CreatorCommunityStats => ({
  creatorFollowers: 0,
  creatorFollowing: 0,
  creatorPendingIncoming: 0,
  companyFollowers: 0,
  companyFollowing: 0,
  companyPendingIncoming: 0,
});

const monthLabel = (date: Date) => date.toLocaleDateString([], { month: "short" });

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: Number.isInteger(value) ? 0 : 2 })}`;

const formatBudget = (min?: number | null, max?: number | null) => {
  const minValue = Number(min ?? 0);
  const maxValue = Number(max ?? 0);

  if (minValue > 0 && maxValue > 0 && minValue !== maxValue) {
    return `${money(minValue)} - ${money(maxValue)}`;
  }

  if (maxValue > 0) return money(maxValue);
  if (minValue > 0) return money(minValue);
  return "Budget on request";
};

const displayStatus = (status: string) => status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const initialsFor = (value: string) => value.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CR";

const parseFollowersCount = (value: unknown): number | null => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.round(num);
};

const normalizeCommunityRole = (value: unknown): CommunityRole | null => {
  if (value === "creator" || value === "brand") {
    return value;
  }
  return null;
};

const fetchCommunityRelationRows = async (creatorId: string): Promise<CommunityRelationRow[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status, message, created_at, updated_at, requester:profiles!community_requests_requester_id_fkey(id, role, full_name, is_verified), target:profiles!community_requests_target_id_fkey(id, role, full_name, is_verified)")
    .or(`requester_id.eq.${creatorId},target_id.eq.${creatorId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CommunityRelationRow[];
};

const sendCommunityAcceptanceMessage = async (senderId: string, receiverId: string) => {
  if (!supabase) return;

  await supabase.from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content: "Your community request was accepted. Happy to connect!",
    content_type: "text",
  });
};

const fetchYouTubeSubscribers = async (accessToken: string) => {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("YouTube API request failed.");
  }

  const payload = await response.json() as {
    items?: Array<{
      snippet?: { title?: string };
      statistics?: { subscriberCount?: string };
    }>;
  };

  const channel = payload.items?.[0];
  const subscribers = parseFollowersCount(channel?.statistics?.subscriberCount);

  return {
    subscribers,
    channelName: channel?.snippet?.title ?? "",
  };
};

const fetchFacebookAndInstagramFollowers = async (accessToken: string) => {
  const meResponse = await fetch("https://graph.facebook.com/v20.0/me?fields=id,name,followers_count&access_token=" + encodeURIComponent(accessToken));
  if (!meResponse.ok) {
    throw new Error("Facebook API request failed.");
  }

  const mePayload = await meResponse.json() as { followers_count?: number; name?: string };
  let facebookFollowers = parseFollowersCount(mePayload.followers_count);

  const pagesResponse = await fetch("https://graph.facebook.com/v20.0/me/accounts?fields=name,followers_count,fan_count,instagram_business_account{id,username,followers_count}&access_token=" + encodeURIComponent(accessToken));
  if (!pagesResponse.ok) {
    return {
      facebookFollowers,
      instagramFollowers: null as number | null,
      instagramHandle: "",
      pageName: "",
    };
  }

  const pagesPayload = await pagesResponse.json() as {
    data?: Array<{
      name?: string;
      followers_count?: number;
      fan_count?: number;
      instagram_business_account?: { username?: string; followers_count?: number };
    }>;
  };

  const pages = pagesPayload.data ?? [];
  let bestPageName = "";
  let bestPageFollowers = facebookFollowers;
  let instagramFollowers: number | null = null;
  let instagramHandle = "";

  pages.forEach((page) => {
    const pageFollowers = parseFollowersCount(page.followers_count) ?? parseFollowersCount(page.fan_count);
    if ((pageFollowers ?? -1) > (bestPageFollowers ?? -1)) {
      bestPageFollowers = pageFollowers;
      bestPageName = page.name ?? "";
    }

    const igFollowers = parseFollowersCount(page.instagram_business_account?.followers_count);
    if ((igFollowers ?? -1) > (instagramFollowers ?? -1)) {
      instagramFollowers = igFollowers;
      instagramHandle = page.instagram_business_account?.username ?? "";
    }
  });

  if (bestPageFollowers !== null) {
    facebookFollowers = bestPageFollowers;
  }

  return {
    facebookFollowers,
    instagramFollowers,
    instagramHandle,
    pageName: bestPageName,
  };
};

const ensureCreatorAccount = async (): Promise<CreatorContext> => {
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
  const fallbackName = fullNameFromMeta || user.email?.split("@")[0] || "Creator";

  let { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, role, chillies_balance, is_verified, rack_score")
    .eq("id", userId)
    .limit(1);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profileRows?.length) {
    const { error: insertProfileError } = await supabase.from("profiles").upsert({
      id: userId,
      role: "creator",
      full_name: fallbackName,
      email: user.email ?? "",
    });

    if (insertProfileError) {
      throw new Error(insertProfileError.message);
    }

    const { error: insertCreatorError } = await supabase.from("creator_profiles").upsert({
      id: userId,
    });

    if (insertCreatorError) {
      throw new Error(insertCreatorError.message);
    }

    const retry = await supabase
      .from("profiles")
      .select("full_name, email, role, chillies_balance, is_verified, rack_score")
      .eq("id", userId)
      .limit(1);

    profileRows = retry.data ?? [];
    profileError = retry.error;
  }

  if (profileError) {
    throw new Error(profileError.message);
  }

  const profile = profileRows?.[0];
  if (!profile) {
    throw new Error("Creator profile not found.");
  }

  if (profile.role !== "creator") {
    throw new Error("Only creator accounts can access this section.");
  }

  const { data: creatorRows, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("id", userId)
    .limit(1);

  if (creatorError) {
    throw new Error(creatorError.message);
  }

  if (!creatorRows?.length) {
    const { error: insertCreatorError } = await supabase.from("creator_profiles").upsert({ id: userId });
    if (insertCreatorError) {
      throw new Error(insertCreatorError.message);
    }
  }

  return {
    userId,
    fullName: profile.full_name,
    email: profile.email,
    initials: initialsFor(profile.full_name),
    chilliesBalance: profile.chillies_balance ?? 0,
    isVerified: Boolean(profile.is_verified),
    rackScore: profile.rack_score ?? 0,
  };
};

export const getCurrentCreatorContext = async (): Promise<CreatorContext> => ensureCreatorAccount();

export const fetchCreatorDashboardData = async (creatorId: string): Promise<CreatorDashboardData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("chillies_balance, is_verified")
    .eq("id", creatorId)
    .limit(1);

  if (profileError) throw profileError;

  const profile = profileRows?.[0];

  const { data: bids, error: bidsError } = await supabase
    .from("bids")
    .select("campaign_id, amount, status, chillies_spent, created_at")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (bidsError) throw bidsError;

  const { data: walletRows, error: walletError } = await supabase
    .from("wallet_transactions")
    .select("amount, direction, created_at")
    .eq("user_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (walletError) throw walletError;

  const { data: paymentRows, error: paymentError } = await supabase
    .from("payments")
    .select("amount, created_at")
    .eq("creator_id", creatorId)
    .eq("status", "paid")
    .order("created_at", { ascending: true });

  if (paymentError) throw paymentError;

  const campaignIds = Array.from(new Set((bids ?? []).map((bid) => bid.campaign_id)));
  const { data: campaignRows, error: campaignError } = campaignIds.length
    ? await supabase
        .from("campaigns")
        .select("id, title, brand_id")
        .in("id", campaignIds)
    : { data: [], error: null };

  if (campaignError) throw campaignError;

  const brandIds = Array.from(new Set((campaignRows ?? []).map((campaign) => campaign.brand_id)));
  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase
        .from("brand_profiles")
        .select("id, company_name")
        .in("id", brandIds)
    : { data: [], error: null };

  if (brandError) throw brandError;

  const campaignMap = new Map((campaignRows ?? []).map((campaign) => [campaign.id, campaign]));
  const brandMap = new Map((brandRows ?? []).map((brand) => [brand.id, brand.company_name]));
  let communityStats = emptyCommunityStats();

  try {
    communityStats = await fetchCreatorCommunityStats(creatorId);
  } catch {
    communityStats = emptyCommunityStats();
  }

  const totalEarnings = (paymentRows ?? []).reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const earningsByMonth = new Map<string, number>();
  (paymentRows ?? []).forEach((payment) => {
    const month = monthLabel(new Date(payment.created_at));
    earningsByMonth.set(month, (earningsByMonth.get(month) ?? 0) + Number(payment.amount ?? 0));
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentChilliesDelta = (walletRows ?? []).reduce((sum, row) => {
    const createdAt = new Date(row.created_at);
    if (createdAt < sevenDaysAgo) return sum;
    return sum + (row.direction === "credit" ? Number(row.amount ?? 0) : -Number(row.amount ?? 0));
  }, 0);

  const shortlistedCount = (bids ?? []).filter((bid) => bid.status === "shortlisted").length;
  const activeBidsCount = (bids ?? []).filter((bid) => ["applied", "shortlisted", "accepted"].includes(bid.status)).length;

  return {
    chilliesBalance: profile?.chillies_balance ?? 0,
    recentChilliesDelta,
    isVerified: Boolean(profile?.is_verified),
    badgeStatus: Boolean(profile?.is_verified) ? "Active" : "Inactive",
    activeBidsCount,
    shortlistedCount,
    totalEarnings,
    earningsOverTime: Array.from(earningsByMonth.entries()).map(([month, earnings]) => ({ month, earnings })).slice(-8),
    activeBids: (bids ?? []).slice(0, 5).map((bid) => {
      const campaign = campaignMap.get(bid.campaign_id);
      return {
        campaign: campaign?.title ?? "Campaign",
        brand: brandMap.get(campaign?.brand_id ?? "") ?? "Brand",
        bid: money(Number(bid.amount ?? 0)),
        status: displayStatus(bid.status),
        chillies: bid.chillies_spent ?? 0,
      };
    }),
  };
};

export const fetchCreatorProjects = async (creatorId: string): Promise<CreatorProjectListItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("id, title, category, brand_id, budget_min, budget_max, deadline, priority_chillies_cost, status, created_at")
    .in("status", ["open", "in_review"])
    .order("created_at", { ascending: false });

  if (campaignsError) throw campaignsError;

  const campaignIds = (campaigns ?? []).map((campaign) => campaign.id);
  const brandIds = Array.from(new Set((campaigns ?? []).map((campaign) => campaign.brand_id)));

  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase.from("brand_profiles").select("id, company_name").in("id", brandIds)
    : { data: [], error: null };
  if (brandError) throw brandError;

  const { data: bidRows, error: bidError } = campaignIds.length
    ? await supabase
        .from("bids")
        .select("campaign_id, status")
        .eq("creator_id", creatorId)
        .in("campaign_id", campaignIds)
    : { data: [], error: null };
  if (bidError) throw bidError;

  const brandMap = new Map((brandRows ?? []).map((brand) => [brand.id, brand.company_name]));
  const bidMap = new Map((bidRows ?? []).map((bid) => [bid.campaign_id, bid.status]));

  return (campaigns ?? []).map((campaign) => ({
    id: campaign.id,
    name: campaign.title,
    brand: brandMap.get(campaign.brand_id) ?? "Brand",
    budget: formatBudget(campaign.budget_min, campaign.budget_max),
    status: displayStatus(bidMap.get(campaign.id) ?? campaign.status),
    chillies: campaign.priority_chillies_cost ?? 0,
    deadline: campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "Flexible",
    category: campaign.category ?? "General",
    hasBid: bidMap.has(campaign.id),
  }));
};

export const fetchCreatorProjectDetails = async (creatorId: string, campaignId: string): Promise<CreatorProjectDetailsData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, title, description, brand_id, budget_min, budget_max, deadline, priority_chillies_cost, deliverables, total_bids, category, platform, status")
    .eq("id", campaignId)
    .limit(1);

  const campaign = campaignRows?.[0];
  if (campaignError || !campaign) throw campaignError ?? new Error("Campaign not found.");

  const { data: brandProfileRows, error: brandProfileError } = await supabase
    .from("brand_profiles")
    .select("company_name, industry, location")
    .eq("id", campaign.brand_id)
    .limit(1);
  if (brandProfileError) throw brandProfileError;

  const { data: brandCampaignRows, error: brandCampaignError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("brand_id", campaign.brand_id);
  if (brandCampaignError) throw brandCampaignError;

  const { data: existingBidRows, error: existingBidError } = await supabase
    .from("bids")
    .select("id, amount, cover_message, used_chillies, chillies_spent, status")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .limit(1);
  if (existingBidError) throw existingBidError;

  const { data: bidRows, error: bidError } = await supabase
    .from("bids")
    .select("amount")
    .eq("campaign_id", campaignId);
  if (bidError) throw bidError;

  const bidValues = (bidRows ?? []).map((row) => Number(row.amount ?? 0)).filter((value) => value > 0);
  const avgBidAmount = bidValues.length ? bidValues.reduce((sum, value) => sum + value, 0) / bidValues.length : 0;
  const brandProfile = brandProfileRows?.[0];
  const existingBid = existingBidRows?.[0];

  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description ?? "",
    brandId: campaign.brand_id,
    brandName: brandProfile?.company_name ?? "Brand",
    brandIndustry: brandProfile?.industry ?? "General",
    brandLocation: brandProfile?.location ?? "Remote",
    brandCampaignCount: brandCampaignRows?.length ?? 0,
    budgetLabel: formatBudget(campaign.budget_min, campaign.budget_max),
    budgetValue: Number(campaign.budget_max ?? campaign.budget_min ?? 0),
    deadline: campaign.deadline,
    priorityChilliesCost: campaign.priority_chillies_cost ?? 0,
    deliverables: Array.isArray(campaign.deliverables) ? campaign.deliverables.map((item) => String(item)) : [],
    totalBids: campaign.total_bids ?? 0,
    avgBidAmount,
    category: campaign.category ?? "General",
    platform: campaign.platform ?? "Any",
    status: campaign.status,
    existingBid: existingBid
      ? {
          id: existingBid.id,
          amount: Number(existingBid.amount ?? 0),
          coverMessage: existingBid.cover_message ?? "",
          usedChillies: Boolean(existingBid.used_chillies),
          chilliesSpent: existingBid.chillies_spent ?? 0,
          status: existingBid.status,
        }
      : null,
  };
};

export const submitCreatorBid = async (creatorId: string, campaignId: string, amount: number, coverMessage: string, usePriority: boolean): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("priority_chillies_cost")
    .eq("id", campaignId)
    .limit(1);
  const campaign = campaignRows?.[0];
  if (campaignError || !campaign) throw campaignError ?? new Error("Campaign not found.");

  const priorityCost = usePriority ? Number(campaign.priority_chillies_cost ?? 0) : 0;

  const { data: existingRows, error: existingError } = await supabase
    .from("bids")
    .select("id, used_chillies")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .limit(1);

  if (existingError) throw existingError;

  const existingBid = existingRows?.[0];
  const shouldChargePriority = Boolean(usePriority && priorityCost > 0 && !existingBid?.used_chillies);

  if (shouldChargePriority) {
    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select("chillies_balance")
      .eq("id", creatorId)
      .limit(1);
    if (profileError) throw profileError;
    const balance = profileRows?.[0]?.chillies_balance ?? 0;
    if (balance < priorityCost) {
      throw new Error("You do not have enough Chillies for a priority bid.");
    }
  }

  if (existingBid) {
    const { error } = await supabase
      .from("bids")
      .update({
        amount,
        cover_message: coverMessage,
        used_chillies: usePriority,
        chillies_spent: usePriority ? priorityCost : 0,
      })
      .eq("id", existingBid.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("bids").insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      amount,
      cover_message: coverMessage,
      used_chillies: usePriority,
      chillies_spent: usePriority ? priorityCost : 0,
      status: "applied",
    });
    if (error) throw error;
  }

  if (shouldChargePriority) {
    const { error: walletError } = await supabase.from("wallet_transactions").insert({
      user_id: creatorId,
      direction: "debit",
      amount: priorityCost,
      reason: "Priority bid upgrade",
      ref_type: "priority_bid",
      ref_id: campaignId,
    });
    if (walletError) throw walletError;
  }
};

export const fetchCreatorInvitations = async (creatorId: string): Promise<CreatorInvitationItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error } = await supabase
    .from("invitations")
    .select("id, brand_id, campaign_id, message, status, created_at")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const campaignIds = Array.from(new Set((rows ?? []).map((row) => row.campaign_id).filter(Boolean))) as string[];
  const brandIds = Array.from(new Set((rows ?? []).map((row) => row.brand_id)));

  const { data: campaignRows, error: campaignError } = campaignIds.length
    ? await supabase.from("campaigns").select("id, title, budget_min, budget_max, deadline").in("id", campaignIds)
    : { data: [], error: null };
  if (campaignError) throw campaignError;

  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase.from("brand_profiles").select("id, company_name").in("id", brandIds)
    : { data: [], error: null };
  if (brandError) throw brandError;

  const campaignMap = new Map((campaignRows ?? []).map((campaign) => [campaign.id, campaign]));
  const brandMap = new Map((brandRows ?? []).map((brand) => [brand.id, brand.company_name]));

  return (rows ?? []).map((row) => {
    const campaign = row.campaign_id ? campaignMap.get(row.campaign_id) : null;
    const brandName = brandMap.get(row.brand_id) ?? "Brand";
    return {
      id: row.id,
      brandId: row.brand_id,
      brand: brandName,
      brandInitials: initialsFor(brandName),
      campaignId: row.campaign_id,
      campaign: campaign?.title ?? "Direct invitation",
      budget: formatBudget(campaign?.budget_min, campaign?.budget_max),
      deadline: campaign?.deadline ? new Date(campaign.deadline).toLocaleDateString() : "Flexible",
      message: row.message ?? "",
      receivedAt: new Date(row.created_at).toLocaleString(),
      status: row.status,
    };
  });
};

export const updateCreatorInvitationStatus = async (creatorId: string, invitationId: string, status: "accepted" | "declined") => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error: fetchError } = await supabase
    .from("invitations")
    .select("id, brand_id, campaign_id")
    .eq("id", invitationId)
    .eq("creator_id", creatorId)
    .limit(1);

  const invitation = rows?.[0];
  if (fetchError || !invitation) throw fetchError ?? new Error("Invitation not found.");

  const { error: updateError } = await supabase.from("invitations").update({ status }).eq("id", invitationId);
  if (updateError) throw updateError;

  if (status === "accepted") {
    let campaignTitle = "your campaign";
    if (invitation.campaign_id) {
      const { data: campaignRows } = await supabase
        .from("campaigns")
        .select("title")
        .eq("id", invitation.campaign_id)
        .limit(1);
      campaignTitle = campaignRows?.[0]?.title ?? campaignTitle;
    }

    const { error: messageError } = await supabase.from("messages").insert({
      sender_id: creatorId,
      receiver_id: invitation.brand_id,
      content: `Hi! I accepted your invitation for ${campaignTitle}. Looking forward to collaborating.`,
      content_type: "text",
    });

    if (messageError) throw messageError;
  }
};

export const fetchCreatorProfileData = async (creatorId: string): Promise<CreatorProfileData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, phone, is_verified, chillies_balance, rack_score, created_at")
    .eq("id", creatorId)
    .limit(1);
  const profile = profileRows?.[0];
  if (profileError || !profile) throw profileError ?? new Error("Profile not found.");

  const { data: creatorRows, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("bio, niche, location, languages, instagram_handle, instagram_followers, youtube_channel, youtube_subscribers, tiktok_handle, tiktok_followers, snapchat_handle, snapchat_followers, combined_audience, engagement_rate")
    .eq("id", creatorId)
    .limit(1);
  const creatorProfile = creatorRows?.[0];
  if (creatorError || !creatorProfile) throw creatorError ?? new Error("Creator profile not found.");

  const { data: bidRows, error: bidError } = await supabase
    .from("bids")
    .select("campaign_id, amount, created_at, status")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (bidError) throw bidError;

  const campaignIds = Array.from(new Set((bidRows ?? []).map((row) => row.campaign_id)));
  const { data: campaignRows, error: campaignError } = campaignIds.length
    ? await supabase.from("campaigns").select("id, title, brand_id").in("id", campaignIds)
    : { data: [], error: null };
  if (campaignError) throw campaignError;

  const brandIds = Array.from(new Set((campaignRows ?? []).map((campaign) => campaign.brand_id)));
  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase.from("brand_profiles").select("id, company_name").in("id", brandIds)
    : { data: [], error: null };
  if (brandError) throw brandError;

  const campaignMap = new Map((campaignRows ?? []).map((campaign) => [campaign.id, campaign]));
  const brandMap = new Map((brandRows ?? []).map((brand) => [brand.id, brand.company_name]));

  return {
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone ?? "",
    isVerified: Boolean(profile.is_verified),
    chilliesBalance: profile.chillies_balance ?? 0,
    rackScore: profile.rack_score ?? 0,
    bio: creatorProfile.bio ?? "",
    niche: creatorProfile.niche ?? "General",
    location: creatorProfile.location ?? "",
    languages: Array.isArray(creatorProfile.languages) ? creatorProfile.languages : [],
    instagramHandle: creatorProfile.instagram_handle ?? "",
    instagramFollowers: creatorProfile.instagram_followers ?? 0,
    youtubeChannel: creatorProfile.youtube_channel ?? "",
    youtubeSubscribers: creatorProfile.youtube_subscribers ?? 0,
    tiktokHandle: creatorProfile.tiktok_handle ?? "",
    tiktokFollowers: creatorProfile.tiktok_followers ?? 0,
    snapchatHandle: creatorProfile.snapchat_handle ?? "",
    snapchatFollowers: creatorProfile.snapchat_followers ?? 0,
    combinedAudience: creatorProfile.combined_audience ?? 0,
    engagementRate: Number(creatorProfile.engagement_rate ?? 0),
    communityStats,
    joinedAt: new Date(profile.created_at).toLocaleDateString([], { month: "short", year: "numeric" }),
    collaborationsCount: bidRows?.length ?? 0,
    pastCollaborations: (bidRows ?? []).slice(0, 5).map((bid) => {
      const campaign = campaignMap.get(bid.campaign_id);
      return {
        brand: brandMap.get(campaign?.brand_id ?? "") ?? "Brand",
        campaign: campaign?.title ?? "Campaign",
        earned: money(Number(bid.amount ?? 0)),
        date: new Date(bid.created_at).toLocaleDateString([], { month: "short", year: "numeric" }),
      };
    }),
  };
};

export const updateCreatorProfile = async (creatorId: string, input: CreatorProfileUpdateInput): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || "Creator",
      phone: input.phone.trim() || null,
    })
    .eq("id", creatorId);
  if (profileError) throw profileError;

  const { error: creatorError } = await supabase
    .from("creator_profiles")
    .update({
      bio: input.bio.trim() || null,
      niche: input.niche.trim() || null,
      location: input.location.trim() || null,
      languages: input.languages.filter(Boolean),
      instagram_handle: input.instagramHandle.trim() || null,
      instagram_followers: input.instagramFollowers,
      youtube_channel: input.youtubeChannel.trim() || null,
      youtube_subscribers: input.youtubeSubscribers,
      tiktok_handle: input.tiktokHandle.trim() || null,
      tiktok_followers: input.tiktokFollowers,
      snapchat_handle: input.snapchatHandle.trim() || null,
      snapchat_followers: input.snapchatFollowers,
      engagement_rate: input.engagementRate,
    })
    .eq("id", creatorId);
  if (creatorError) throw creatorError;
};

export const fetchCreatorSubmissionCampaignOptions = async (creatorId: string): Promise<CreatorSubmissionCampaignOption[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: bidRows, error: bidError } = await supabase
    .from("bids")
    .select("campaign_id")
    .eq("creator_id", creatorId)
    .eq("status", "accepted");
  if (bidError) throw bidError;

  const { data: inviteRows, error: inviteError } = await supabase
    .from("invitations")
    .select("campaign_id")
    .eq("creator_id", creatorId)
    .eq("status", "accepted")
    .not("campaign_id", "is", null);
  if (inviteError) throw inviteError;

  const campaignIds = Array.from(new Set([...(bidRows ?? []).map((row) => row.campaign_id), ...(inviteRows ?? []).map((row) => row.campaign_id)].filter(Boolean))) as string[];

  if (!campaignIds.length) return [];

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, title, brand_id")
    .in("id", campaignIds);
  if (campaignError) throw campaignError;

  const brandIds = Array.from(new Set((campaignRows ?? []).map((row) => row.brand_id)));
  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase.from("brand_profiles").select("id, company_name").in("id", brandIds)
    : { data: [], error: null };
  if (brandError) throw brandError;

  const brandMap = new Map((brandRows ?? []).map((row) => [row.id, row.company_name]));

  return (campaignRows ?? []).map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    brandName: brandMap.get(campaign.brand_id) ?? "Brand",
  }));
};

export const fetchCreatorContentSubmissions = async (creatorId: string): Promise<CreatorContentSubmissionItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error } = await supabase
    .from("content_submissions")
    .select("id, campaign_id, title, caption, media_urls, submitted_at, status")
    .eq("creator_id", creatorId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;

  const campaignIds = Array.from(new Set((rows ?? []).map((row) => row.campaign_id).filter(Boolean))) as string[];
  const { data: campaignRows, error: campaignError } = campaignIds.length
    ? await supabase.from("campaigns").select("id, title, brand_id").in("id", campaignIds)
    : { data: [], error: null };
  if (campaignError) throw campaignError;

  const brandIds = Array.from(new Set((campaignRows ?? []).map((campaign) => campaign.brand_id)));
  const { data: brandRows, error: brandError } = brandIds.length
    ? await supabase.from("brand_profiles").select("id, company_name").in("id", brandIds)
    : { data: [], error: null };
  if (brandError) throw brandError;

  const campaignMap = new Map((campaignRows ?? []).map((campaign) => [campaign.id, campaign]));
  const brandMap = new Map((brandRows ?? []).map((brand) => [brand.id, brand.company_name]));

  const resolveMediaUrl = async (rawValue: string): Promise<string> => {
    const value = rawValue.trim();
    const storagePrefix = "storage://creator-content/";
    if (!value.startsWith(storagePrefix)) return value;

    const filePath = value.slice(storagePrefix.length);
    if (!filePath) return value;

    const { data, error } = await supabase.storage.from("creator-content").createSignedUrl(filePath, 60 * 60 * 24 * 7);
    if (error || !data?.signedUrl) {
      return value;
    }
    return data.signedUrl;
  };

  const submissionRows = rows ?? [];
  const mapped = await Promise.all(submissionRows.map(async (row) => {
    const campaign = row.campaign_id ? campaignMap.get(row.campaign_id) : undefined;
    const rawMediaUrls = Array.isArray(row.media_urls) ? row.media_urls.map((url) => String(url)) : [];
    const mediaUrls = await Promise.all(rawMediaUrls.map((url) => resolveMediaUrl(url)));

    return {
      id: row.id,
      campaignId: row.campaign_id,
      campaignTitle: campaign?.title ?? "Direct upload",
      brandName: brandMap.get(campaign?.brand_id ?? "") ?? "",
      title: row.title ?? "Untitled submission",
      caption: row.caption ?? "",
      mediaUrls,
      submittedAt: row.submitted_at,
      status: row.status ?? "submitted",
    };
  }));

  return mapped;
};

export const uploadCreatorSubmissionFile = async (creatorId: string, file: File): Promise<string> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${creatorId}/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage.from("creator-content").upload(filePath, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  return `storage://creator-content/${filePath}`;
};

export const createCreatorContentSubmission = async (
  creatorId: string,
  campaignId: string | null,
  title: string,
  caption: string,
  mediaUrls: string[],
): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const sanitizedMediaUrls = mediaUrls.map((url) => url.trim()).filter(Boolean);
  if (!sanitizedMediaUrls.length) {
    throw new Error("Add at least one content link or media URL.");
  }

  const { error } = await supabase.from("content_submissions").insert({
    campaign_id: campaignId,
    creator_id: creatorId,
    title: title.trim() || "Content submission",
    caption: caption.trim() || null,
    media_urls: sanitizedMediaUrls,
    status: "submitted",
  });
  if (error) throw error;
};

const parsePurchaseRef = (refType: string | null) => {
  const parts = (refType ?? "").split(":");
  return {
    method: (parts[1] as "card" | "upi" | "paypal" | undefined) ?? "card",
    price: parts[2] ?? "$0",
    badge: parts[3] ? decodeURIComponent(parts[3]) : "Active badge",
  };
};

export const fetchCreatorPurchaseHistory = async (creatorId: string): Promise<CreatorPurchaseHistoryItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error } = await supabase
    .from("wallet_transactions")
    .select("id, amount, created_at, ref_type")
    .eq("user_id", creatorId)
    .eq("direction", "credit")
    .like("ref_type", "purchase:%")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (rows ?? []).map((row) => {
    const purchase = parsePurchaseRef(row.ref_type);
    return {
      id: row.id,
      date: new Date(row.created_at).toLocaleDateString(),
      chillies: row.amount ?? 0,
      price: purchase.price,
      method: purchase.method,
      badge: purchase.badge,
      status: "completed",
    };
  });
};

export const purchaseCreatorChillies = async (
  creatorId: string,
  chillies: number,
  price: string,
  badge: string,
  method: "card" | "upi" | "paypal",
): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error: walletError } = await supabase.from("wallet_transactions").insert({
    user_id: creatorId,
    direction: "credit",
    amount: chillies,
    reason: "Chillies purchase",
    ref_type: `purchase:${method}:${price}:${encodeURIComponent(badge)}`,
  });

  if (walletError) throw walletError;

  const { error: profileError } = await supabase.from("profiles").update({ is_verified: true }).eq("id", creatorId);
  if (profileError) throw profileError;
};

export const fetchCreatorCommunityStats = async (creatorId: string): Promise<CreatorCommunityStats> => {
  const stats = emptyCommunityStats();
  const rows = await fetchCommunityRelationRows(creatorId);

  rows.forEach((row) => {
    const requesterRole = normalizeCommunityRole(row.requester?.role);
    const targetRole = normalizeCommunityRole(row.target?.role);

    if (row.requester_id === creatorId) {
      const countedFollowing = row.status === "pending" || row.status === "accepted";
      if (countedFollowing && targetRole === "creator") stats.creatorFollowing += 1;
      if (countedFollowing && targetRole === "brand") stats.companyFollowing += 1;
    }

    if (row.target_id === creatorId) {
      if (row.status === "accepted" && requesterRole === "creator") stats.creatorFollowers += 1;
      if (row.status === "accepted" && requesterRole === "brand") stats.companyFollowers += 1;
      if (row.status === "pending" && requesterRole === "creator") stats.creatorPendingIncoming += 1;
      if (row.status === "pending" && requesterRole === "brand") stats.companyPendingIncoming += 1;
    }
  });

  return stats;
};

export const fetchCreatorCommunityDirectory = async (
  creatorId: string,
  targetRole: CommunityRole,
): Promise<CreatorCommunityDirectory> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const [relationRows, profilesResult] = await Promise.all([
    fetchCommunityRelationRows(creatorId),
    supabase
      .from("profiles")
      .select("id, full_name, is_verified, role")
      .eq("role", targetRole)
      .neq("id", creatorId)
      .order("full_name", { ascending: true }),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  const baseProfiles = profilesResult.data ?? [];
  const targetIds = baseProfiles.map((row) => row.id);

  const creatorDetailsResult = targetRole === "creator" && targetIds.length
    ? await supabase
        .from("creator_profiles")
        .select("id, niche, location, combined_audience")
        .in("id", targetIds)
    : { data: [], error: null };
  if (creatorDetailsResult.error) throw creatorDetailsResult.error;

  const brandDetailsResult = targetRole === "brand" && targetIds.length
    ? await supabase
        .from("brand_profiles")
        .select("id, company_name, industry, location")
        .in("id", targetIds)
    : { data: [], error: null };
  if (brandDetailsResult.error) throw brandDetailsResult.error;

  const creatorDetailMap = new Map((creatorDetailsResult.data ?? []).map((row) => [row.id, row]));
  const brandDetailMap = new Map((brandDetailsResult.data ?? []).map((row) => [row.id, row]));

  const members: CreatorCommunityMember[] = baseProfiles.map((profile) => {
    const outgoing = relationRows.find((row) => row.requester_id === creatorId && row.target_id === profile.id && (row.status === "pending" || row.status === "accepted"));
    const incoming = relationRows.find((row) => row.requester_id === profile.id && row.target_id === creatorId && row.status === "pending");

    let status: CreatorCommunityMemberStatus = "none";
    let requestId: string | null = null;
    let requestedAt: string | null = null;

    if (incoming) {
      status = "incoming";
      requestId = incoming.id;
      requestedAt = incoming.created_at;
    } else if (outgoing?.status === "accepted") {
      status = "following";
      requestId = outgoing.id;
      requestedAt = outgoing.created_at;
    } else if (outgoing?.status === "pending") {
      status = "requested";
      requestId = outgoing.id;
      requestedAt = outgoing.created_at;
    }

    if (targetRole === "creator") {
      const details = creatorDetailMap.get(profile.id);
      return {
        id: profile.id,
        name: profile.full_name,
        isVerified: Boolean(profile.is_verified),
        headline: details?.niche || "Creator",
        location: details?.location || "Location not set",
        audienceLabel: `${Number(details?.combined_audience ?? 0).toLocaleString()} audience`,
        status,
        requestId,
        requestedAt,
      };
    }

    const details = brandDetailMap.get(profile.id);
    return {
      id: profile.id,
      name: details?.company_name || profile.full_name,
      isVerified: Boolean(profile.is_verified),
      headline: details?.industry || "Company",
      location: details?.location || "Location not set",
      audienceLabel: "Company account",
      status,
      requestId,
      requestedAt,
    };
  });

  return {
    members,
    followingCount: members.filter((member) => member.status === "following" || member.status === "requested").length,
    incomingCount: members.filter((member) => member.status === "incoming").length,
    pendingCount: members.filter((member) => member.status === "requested").length,
  };
};

export const sendCreatorCommunityRequest = async (
  creatorId: string,
  targetId: string,
  message = "",
): Promise<{ status: "pending" | "accepted"; requestId: string }> => {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (creatorId === targetId) throw new Error("You cannot request yourself.");

  const { data: existingRows, error: existingError } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status")
    .or(`and(requester_id.eq.${creatorId},target_id.eq.${targetId}),and(requester_id.eq.${targetId},target_id.eq.${creatorId})`)
    .limit(5);
  if (existingError) throw existingError;

  const existing = existingRows ?? [];
  const outgoing = existing.find((row) => row.requester_id === creatorId && row.target_id === targetId);
  const incoming = existing.find((row) => row.requester_id === targetId && row.target_id === creatorId);

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
      .eq("target_id", creatorId);
    if (acceptError) throw acceptError;

    await sendCommunityAcceptanceMessage(creatorId, targetId);
    return { status: "accepted", requestId: incoming.id };
  }

  if (outgoing) {
    const { error: resetError } = await supabase
      .from("community_requests")
      .update({ status: "pending", responded_at: null, message: message.trim() || null })
      .eq("id", outgoing.id)
      .eq("requester_id", creatorId);
    if (resetError) throw resetError;

    return { status: "pending", requestId: outgoing.id };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("community_requests")
    .insert({
      requester_id: creatorId,
      target_id: targetId,
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

export const respondToCreatorCommunityRequest = async (
  creatorId: string,
  requestId: string,
  action: "accepted" | "declined",
): Promise<void> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: rows, error: fetchError } = await supabase
    .from("community_requests")
    .select("id, requester_id, target_id, status")
    .eq("id", requestId)
    .eq("target_id", creatorId)
    .limit(1);

  const row = rows?.[0];
  if (fetchError || !row) throw fetchError ?? new Error("Request not found.");
  if (row.status !== "pending") return;

  const { error: updateError } = await supabase
    .from("community_requests")
    .update({ status: action, responded_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("target_id", creatorId);
  if (updateError) throw updateError;

  if (action === "accepted") {
    await sendCommunityAcceptanceMessage(creatorId, row.requester_id);
  }
};

export const syncCreatorSocialMetricsFromSession = async (
  session: Session,
  creatorId?: string,
): Promise<CreatorSocialSyncResult> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const userId = creatorId ?? session.user.id;
  const provider = session.user.app_metadata?.provider as string | undefined;
  const providerToken = (session as Session & { provider_token?: string }).provider_token;

  const result: CreatorSocialSyncResult = {
    provider: provider ?? null,
    youtubeSubscribers: null,
    facebookFollowers: null,
    instagramFollowers: null,
    details: [],
  };

  if (!provider || !providerToken) {
    result.details.push("No provider token available in this session.");
    return result;
  }

  if (provider === "google") {
    try {
      const yt = await fetchYouTubeSubscribers(providerToken);
      result.youtubeSubscribers = yt.subscribers;
      if (yt.subscribers !== null) {
        const { error } = await supabase
          .from("creator_profiles")
          .update({
            youtube_subscribers: yt.subscribers,
            youtube_channel: yt.channelName || undefined,
          })
          .eq("id", userId);
        if (error) throw error;
        result.details.push("YouTube subscribers synced.");
      } else {
        result.details.push("No YouTube channel metrics found on this Google account.");
      }
    } catch (error) {
      result.details.push(error instanceof Error ? error.message : "YouTube sync failed.");
    }
  }

  if (provider === "facebook") {
    try {
      const social = await fetchFacebookAndInstagramFollowers(providerToken);
      result.facebookFollowers = social.facebookFollowers;
      result.instagramFollowers = social.instagramFollowers;

      const updates: {
        instagram_followers?: number;
        instagram_handle?: string;
      } = {};

      if (social.instagramFollowers !== null) {
        updates.instagram_followers = social.instagramFollowers;
      }
      if (social.instagramHandle) {
        updates.instagram_handle = social.instagramHandle;
      }

      if (Object.keys(updates).length) {
        const { error } = await supabase
          .from("creator_profiles")
          .update(updates)
          .eq("id", userId);
        if (error) throw error;
      }

      if (social.facebookFollowers !== null) {
        result.details.push("Facebook followers fetched (display only).");
      } else {
        result.details.push("No Facebook follower metric found for this account/page.");
      }

      if (social.instagramFollowers !== null) {
        result.details.push("Instagram followers synced from connected professional account.");
      } else {
        result.details.push("No Instagram professional account connected via Facebook pages.");
      }
    } catch (error) {
      result.details.push(error instanceof Error ? error.message : "Facebook/Instagram sync failed.");
    }
  }

  if (!result.details.length) {
    result.details.push("No supported social provider detected for sync.");
  }

  return result;
};