import { supabase } from "@/lib/supabase";

export type AdminContext = {
  userId: string;
  fullName: string;
  initials: string;
};

export type AdminDashboardData = {
  totalBrands: number;
  totalCreators: number;
  activeCampaigns: number;
  totalRevenue: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  userGrowthByMonth: Array<{ month: string; creators: number; brands: number }>;
};

export type AdminCreatorUser = {
  id: string;
  name: string;
  email: string;
  niche: string;
  rack: {
    reliability: number;
    activity: number;
    contentQuality: number;
    knowledge: number;
  };
  chillies: number;
  status: string;
  joined: string;
};

export type AdminBrandUser = {
  id: string;
  name: string;
  email: string;
  industry: string;
  campaigns: number;
  status: string;
  joined: string;
};

export type AdminUsersData = {
  creators: AdminCreatorUser[];
  brands: AdminBrandUser[];
};

export type AdminCampaignListItem = {
  id: string;
  name: string;
  brand: string;
  budget: string;
  status: string;
  applicants: number;
  approval: string;
};

export type AdminContentSubmission = {
  id: string;
  creator: string;
  type: "Video" | "Image";
  title: string;
  link: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  reason?: string;
};

export type AdminPaymentsData = {
  totalRevenue: number;
  paidOut: number;
  pending: number;
  rows: Array<{
    id: string;
    creator: string;
    campaign: string;
    amount: string;
    status: string;
    date: string;
  }>;
};

export type AdminCommunicationData = {
  totalConversations: number;
  flaggedMessages: number;
  cleanRate: number;
  rows: Array<{
    id: string;
    from: string;
    to: string;
    preview: string;
    time: string;
    flagged: boolean;
  }>;
};

export type AdminAnalyticsData = {
  signupsAndCampaigns: Array<{ month: string; signups: number; campaigns: number }>;
  creatorCategories: Array<{ name: string; value: number }>;
  chilliesDistribution: Array<{ month: string; sold: number; free: number }>;
};

const initialsFor = (name: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "AD";
};

const displayStatus = (status: string) =>
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};

const formatMoney = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const formatMonth = (date: Date) => date.toLocaleDateString([], { month: "short" });

const formatRelativeTime = (dateString: string) => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const isPolicyError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const message = "message" in error && typeof (error as { message?: string }).message === "string"
    ? (error as { message: string }).message.toLowerCase()
    : "";

  return message.includes("row-level security") || message.includes("permission denied");
};

const safeQuery = async <T>(query: unknown, fallback: T) => {
  const { data, error } = await (query as Promise<{ data: T; error: unknown }>);
  if (error) {
    if (isPolicyError(error)) {
      return fallback;
    }
    throw error;
  }
  return data ?? fallback;
};

const ensureAdmin = async (): Promise<AdminContext> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "You are not signed in.");
  }

  const user = authData.user;
  const fallbackName = (user.user_metadata?.full_name as string | undefined)?.trim() || user.email?.split("@")[0] || "Admin";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);

  const roleFromProfile = profile?.role;
  const roleFromMetadata = (user.user_metadata?.role as string | undefined)?.toLowerCase();
  const role = roleFromProfile ?? roleFromMetadata;

  if (role !== "admin") {
    throw new Error("Only admin accounts can access this section.");
  }

  const fullName = profile?.full_name || fallbackName;
  return {
    userId: user.id,
    fullName,
    initials: initialsFor(fullName),
  };
};

export const getCurrentAdminContext = async (): Promise<AdminContext> => ensureAdmin();

const buildRecentMonthLabels = (count: number) => {
  const now = new Date();
  return [...Array(count)].map((_, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - index - 1), 1);
    return formatMonth(d);
  });
};

export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const profiles = await safeQuery(
    supabase
      .from("profiles")
      .select("role, created_at"),
    [],
  );

  const campaigns = await safeQuery(
    supabase
      .from("campaigns")
      .select("status, created_at"),
    [],
  );

  const payments = await safeQuery(
    supabase
      .from("payments")
      .select("amount, status, created_at"),
    [],
  );

  const totalBrands = profiles.filter((p) => p.role === "brand").length;
  const totalCreators = profiles.filter((p) => p.role === "creator").length;
  const activeCampaigns = campaigns.filter((c) => c.status === "open" || c.status === "in_review").length;
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const monthLabels = buildRecentMonthLabels(6);
  const revenueByMonthMap = new Map(monthLabels.map((label) => [label, 0]));
  const creatorsByMonthMap = new Map(monthLabels.map((label) => [label, 0]));
  const brandsByMonthMap = new Map(monthLabels.map((label) => [label, 0]));

  payments.forEach((payment) => {
    if (payment.status !== "paid") return;
    const label = formatMonth(new Date(payment.created_at));
    if (revenueByMonthMap.has(label)) {
      revenueByMonthMap.set(label, (revenueByMonthMap.get(label) ?? 0) + Number(payment.amount ?? 0));
    }
  });

  profiles.forEach((profile) => {
    const label = formatMonth(new Date(profile.created_at));
    if (profile.role === "creator" && creatorsByMonthMap.has(label)) {
      creatorsByMonthMap.set(label, (creatorsByMonthMap.get(label) ?? 0) + 1);
    }
    if (profile.role === "brand" && brandsByMonthMap.has(label)) {
      brandsByMonthMap.set(label, (brandsByMonthMap.get(label) ?? 0) + 1);
    }
  });

  return {
    totalBrands,
    totalCreators,
    activeCampaigns,
    totalRevenue,
    revenueByMonth: monthLabels.map((month) => ({ month, revenue: revenueByMonthMap.get(month) ?? 0 })),
    userGrowthByMonth: monthLabels.map((month) => ({
      month,
      creators: creatorsByMonthMap.get(month) ?? 0,
      brands: brandsByMonthMap.get(month) ?? 0,
    })),
  };
};

export const fetchAdminUsersData = async (): Promise<AdminUsersData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const profiles = await safeQuery(
    supabase
      .from("profiles")
      .select("id, full_name, email, role, rack_score, chillies_balance, is_verified, created_at"),
    [],
  );

  const creatorProfiles = await safeQuery(
    supabase
      .from("creator_profiles")
      .select("id, niche"),
    [],
  );

  const brandProfiles = await safeQuery(
    supabase
      .from("brand_profiles")
      .select("id, company_name, industry"),
    [],
  );

  const campaigns = await safeQuery(
    supabase
      .from("campaigns")
      .select("brand_id"),
    [],
  );

  const creatorMap = new Map(creatorProfiles.map((item) => [item.id, item]));
  const brandMap = new Map(brandProfiles.map((item) => [item.id, item]));
  const campaignCountByBrand = new Map<string, number>();

  campaigns.forEach((campaign) => {
    campaignCountByBrand.set(campaign.brand_id, (campaignCountByBrand.get(campaign.brand_id) ?? 0) + 1);
  });

  const creators: AdminCreatorUser[] = profiles
    .filter((profile) => profile.role === "creator")
    .map((profile) => {
      const rackScore = Number(profile.rack_score ?? 0);
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        niche: creatorMap.get(profile.id)?.niche ?? "General",
        rack: {
          reliability: Math.min(100, rackScore + 4),
          activity: Math.max(0, rackScore - 4),
          contentQuality: Math.min(100, rackScore + 2),
          knowledge: Math.max(0, rackScore - 1),
        },
        chillies: Number(profile.chillies_balance ?? 0),
        status: profile.is_verified ? "Approved" : "Suspended",
        joined: formatDate(profile.created_at),
      };
    });

  const brands: AdminBrandUser[] = profiles
    .filter((profile) => profile.role === "brand")
    .map((profile) => ({
      id: profile.id,
      name: brandMap.get(profile.id)?.company_name ?? profile.full_name,
      email: profile.email,
      industry: brandMap.get(profile.id)?.industry ?? "-",
      campaigns: campaignCountByBrand.get(profile.id) ?? 0,
      status: profile.is_verified ? "Approved" : "Suspended",
      joined: formatDate(profile.created_at),
    }));

  return {
    creators,
    brands,
  };
};

export const updateAdminCreatorRackScore = async (creatorId: string, rackScore: number) => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("profiles")
    .update({ rack_score: rackScore })
    .eq("id", creatorId);

  if (error) throw new Error(error.message);
};

export const fetchAdminCampaigns = async (): Promise<AdminCampaignListItem[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const campaigns = await safeQuery(
    supabase
      .from("campaigns")
      .select("id, title, status, total_bids, budget_min, budget_max, brand_id, created_at")
      .order("created_at", { ascending: false }),
    [],
  );

  const brandIds = Array.from(new Set(campaigns.map((campaign) => campaign.brand_id)));
  const brandProfiles = brandIds.length
    ? await safeQuery(
        supabase
          .from("brand_profiles")
          .select("id, company_name")
          .in("id", brandIds),
        [],
      )
    : [];

  const brandMap = new Map(brandProfiles.map((brand) => [brand.id, brand.company_name]));

  return campaigns.map((campaign) => {
    const minValue = Number(campaign.budget_min ?? 0);
    const maxValue = Number(campaign.budget_max ?? 0);
    const budget = minValue > 0 && maxValue > minValue
      ? `${formatMoney(minValue)} - ${formatMoney(maxValue)}`
      : formatMoney(Math.max(minValue, maxValue));

    return {
      id: campaign.id,
      name: campaign.title,
      brand: brandMap.get(campaign.brand_id) ?? "Brand",
      budget: budget === "$0" ? "Budget on request" : budget,
      status: displayStatus(campaign.status),
      applicants: Number(campaign.total_bids ?? 0),
      approval: campaign.status === "in_review" ? "Pending" : "Approved",
    };
  });
};

export const fetchAdminContentSubmissions = async (): Promise<AdminContentSubmission[]> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const rows = await safeQuery(
    supabase
      .from("content_submissions")
      .select("id, creator_id, title, caption, media_urls, status, submitted_at")
      .order("submitted_at", { ascending: false }),
    [],
  );

  const creatorIds = Array.from(new Set(rows.map((row) => row.creator_id)));
  const profileRows = creatorIds.length
    ? await safeQuery(
        supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", creatorIds),
        [],
      )
    : [];

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile.full_name]));

  return rows.map((row) => {
    const firstUrl = Array.isArray(row.media_urls) && row.media_urls.length ? String(row.media_urls[0]) : "";
    const type: "Video" | "Image" = /mp4|mov|avi|youtube|youtu\.be|reel|video/i.test(firstUrl) ? "Video" : "Image";
    const normalizedStatus = row.status === "approved"
      ? "Approved"
      : row.status === "rejected"
        ? "Rejected"
        : "Pending";

    return {
      id: row.id,
      creator: profileMap.get(row.creator_id) ?? "Creator",
      type,
      title: row.title || row.caption || "Untitled submission",
      link: firstUrl || "No media link",
      status: normalizedStatus,
      date: formatDate(row.submitted_at),
    };
  });
};

export const updateAdminContentSubmissionStatus = async (id: string, status: "approved" | "rejected") => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const payload = status === "approved"
    ? { status, approved_at: new Date().toISOString() }
    : { status, approved_at: null };

  const { error } = await supabase
    .from("content_submissions")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const fetchAdminPayments = async (): Promise<AdminPaymentsData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const rows = await safeQuery(
    supabase
      .from("payments")
      .select("id, creator_id, campaign_id, amount, status, paid_at, created_at")
      .order("created_at", { ascending: false }),
    [],
  );

  const creatorIds = Array.from(new Set(rows.map((row) => row.creator_id).filter(Boolean)));
  const campaignIds = Array.from(new Set(rows.map((row) => row.campaign_id).filter(Boolean)));

  const creators = creatorIds.length
    ? await safeQuery(
        supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", creatorIds),
        [],
      )
    : [];

  const campaigns = campaignIds.length
    ? await safeQuery(
        supabase
          .from("campaigns")
          .select("id, title")
          .in("id", campaignIds),
        [],
      )
    : [];

  const creatorMap = new Map(creators.map((creator) => [creator.id, creator.full_name]));
  const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign.title]));

  const totalRevenue = rows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const paidOut = rows
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const pending = rows
    .filter((row) => row.status !== "paid")
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

  return {
    totalRevenue,
    paidOut,
    pending,
    rows: rows.map((row) => ({
      id: row.id,
      creator: creatorMap.get(row.creator_id) ?? "-",
      campaign: campaignMap.get(row.campaign_id) ?? "-",
      amount: formatMoney(Number(row.amount ?? 0)),
      status: displayStatus(row.status),
      date: formatDate(row.paid_at || row.created_at),
    })),
  };
};

export const fetchAdminCommunication = async (): Promise<AdminCommunicationData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const messages = await safeQuery(
    supabase
      .from("messages")
      .select("id, sender_id, receiver_id, content, created_at, conversation_key")
      .order("created_at", { ascending: false })
      .limit(100),
    [],
  );

  const userIds = Array.from(
    new Set(messages.flatMap((msg) => [msg.sender_id, msg.receiver_id])),
  );

  const profiles = userIds.length
    ? await safeQuery(
        supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds),
        [],
      )
    : [];

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile.full_name]));

  const flaggedPattern = /whatsapp|outside|phone number|personal number|telegram|email me|dm me/i;
  const flaggedMessages = messages.filter((message) => flaggedPattern.test(message.content || ""));
  const totalConversations = new Set(messages.map((message) => message.conversation_key)).size;
  const cleanRate = messages.length
    ? Math.max(0, ((messages.length - flaggedMessages.length) / messages.length) * 100)
    : 100;

  return {
    totalConversations,
    flaggedMessages: flaggedMessages.length,
    cleanRate,
    rows: messages.slice(0, 10).map((message) => ({
      id: message.id,
      from: profileMap.get(message.sender_id) ?? "User",
      to: profileMap.get(message.receiver_id) ?? "User",
      preview: message.content || "(no content)",
      time: formatRelativeTime(message.created_at),
      flagged: flaggedPattern.test(message.content || ""),
    })),
  };
};

export const fetchAdminAnalytics = async (): Promise<AdminAnalyticsData> => {
  if (!supabase) throw new Error("Supabase is not configured.");

  const monthLabels = buildRecentMonthLabels(6);

  const profiles = await safeQuery(
    supabase
      .from("profiles")
      .select("role, created_at"),
    [],
  );

  const campaigns = await safeQuery(
    supabase
      .from("campaigns")
      .select("created_at"),
    [],
  );

  const creatorProfiles = await safeQuery(
    supabase
      .from("creator_profiles")
      .select("niche"),
    [],
  );

  const walletTransactions = await safeQuery(
    supabase
      .from("wallet_transactions")
      .select("direction, reason, amount, created_at"),
    [],
  );

  const signupsByMonth = new Map(monthLabels.map((label) => [label, 0]));
  const campaignsByMonth = new Map(monthLabels.map((label) => [label, 0]));

  profiles.forEach((profile) => {
    const label = formatMonth(new Date(profile.created_at));
    if (signupsByMonth.has(label) && (profile.role === "creator" || profile.role === "brand")) {
      signupsByMonth.set(label, (signupsByMonth.get(label) ?? 0) + 1);
    }
  });

  campaigns.forEach((campaign) => {
    const label = formatMonth(new Date(campaign.created_at));
    if (campaignsByMonth.has(label)) {
      campaignsByMonth.set(label, (campaignsByMonth.get(label) ?? 0) + 1);
    }
  });

  const categoryMap = new Map<string, number>();
  creatorProfiles.forEach((creator) => {
    const category = creator.niche?.trim() || "Other";
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
  });

  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const soldByMonth = new Map(monthLabels.map((label) => [label, 0]));
  const freeByMonth = new Map(monthLabels.map((label) => [label, 0]));

  walletTransactions.forEach((txn) => {
    const label = formatMonth(new Date(txn.created_at));
    if (!soldByMonth.has(label) || txn.direction !== "debit") return;

    const amount = Number(txn.amount ?? 0);
    if (txn.reason?.toLowerCase().includes("free") || txn.reason?.toLowerCase().includes("reward")) {
      freeByMonth.set(label, (freeByMonth.get(label) ?? 0) + amount);
    } else {
      soldByMonth.set(label, (soldByMonth.get(label) ?? 0) + amount);
    }
  });

  return {
    signupsAndCampaigns: monthLabels.map((month) => ({
      month,
      signups: signupsByMonth.get(month) ?? 0,
      campaigns: campaignsByMonth.get(month) ?? 0,
    })),
    creatorCategories: topCategories,
    chilliesDistribution: monthLabels.map((month) => ({
      month,
      sold: soldByMonth.get(month) ?? 0,
      free: freeByMonth.get(month) ?? 0,
    })),
  };
};
