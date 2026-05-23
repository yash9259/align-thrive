import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Flame, Megaphone, UserCheck, MessageSquare, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
  userInitials?: string;
  hideMobileNav?: boolean;
}

const typeMap: Record<string, { icon: LucideIcon; color: string }> = {
  message: { icon: MessageSquare, color: "text-primary" },
  bid: { icon: UserCheck, color: "text-success" },
  campaign: { icon: Megaphone, color: "text-primary" },
  payment: { icon: Flame, color: "text-accent" },
  system: { icon: Megaphone, color: "text-warning" },
};

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

const staticFallbackNotifications = [
  { id: "static-1", icon: Megaphone, title: "New Campaign Match", desc: "Brand Awareness Campaign matches your profile", time: "2m ago", unread: true, color: "text-primary" },
  { id: "static-2", icon: UserCheck, title: "Shortlisted!", desc: "TechFlow Inc. shortlisted you for Reel Promo", time: "15m ago", unread: true, color: "text-success" },
  { id: "static-3", icon: Flame, title: "Chillies Reward", desc: "You earned 10 Chillies for your upload", time: "1h ago", unread: true, color: "text-accent" },
  { id: "static-4", icon: MessageSquare, title: "New Message", desc: "Sarah Johnson sent you a message", time: "3h ago", unread: false, color: "text-primary" },
  { id: "static-5", icon: Megaphone, title: "Campaign Update", desc: "Holiday Season Sale deadline extended", time: "5h ago", unread: false, color: "text-warning" },
];

const DashboardLayout = ({ children, sidebar, title, userInitials = "JD", hideMobileNav = false }: DashboardLayoutProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const isStaticAdmin = typeof window !== "undefined" && localStorage.getItem("isStaticAdmin") === "true";
    if (isStaticAdmin || !isSupabaseConfigured || !supabase) {
      setNotifs(staticFallbackNotifications);
      return;
    }

    const initNotifs = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!active || !user) return;

        setCurrentUserId(user.id);

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!active) return;

        const mapped = (data || []).map((item: any) => {
          const mapping = typeMap[item.type] || { icon: Megaphone, color: "text-primary" };
          return {
            id: item.id,
            icon: mapping.icon,
            color: mapping.color,
            title: item.title,
            desc: item.body || "",
            time: formatRelativeTime(item.created_at),
            unread: !item.is_read,
            created_at: item.created_at,
          };
        });

        setNotifs(mapped);

        const channel = supabase
          .channel(`user-notifications-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                const item = payload.new;
                const mapping = typeMap[item.type] || { icon: Megaphone, color: "text-primary" };

                setNotifs((prev) => {
                  if (prev.some((n) => n.id === item.id)) return prev;
                  return [
                    {
                      id: item.id,
                      icon: mapping.icon,
                      color: mapping.color,
                      title: item.title,
                      desc: item.body || "",
                      time: "now",
                      unread: !item.is_read,
                      created_at: item.created_at,
                    },
                    ...prev,
                  ];
                });
              } else if (payload.eventType === "UPDATE") {
                const item = payload.new;
                setNotifs((prev) =>
                  prev.map((n) => (n.id === item.id ? { ...n, unread: !item.is_read } : n))
                );
              } else if (payload.eventType === "DELETE") {
                setNotifs((prev) => prev.filter((n) => n.id !== payload.old.id));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    const cleanupPromise = initNotifs();

    return () => {
      active = false;
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      }).catch(err => console.error(err));
    };
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleNotificationClick = async (notif: any) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );

    if (supabase && currentUserId && !notif.id.toString().includes("static-")) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notif.id);
    }
  };

  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

    if (supabase && currentUserId) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", currentUserId)
        .eq("is_read", false);
    }
  };

  return (
    <SidebarProvider>
      <div className="dashboard-shell min-h-screen flex w-full">
        {sidebar}
        <div className="flex-1 flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/70 bg-background/92 px-3 backdrop-blur-md sm:px-4">
            {!hideMobileNav && <SidebarTrigger className="inline-flex" />}
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-64 pl-8 h-9" />
              </div>

              {/* Notification Bell */}
              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-96 p-0" align="end" sideOffset={8}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notifs.map((n) => {
                      const isUnread = n.unread;
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/30 last:border-0 ${isUnread ? "bg-primary/5" : ""}`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5`}>
                            <n.icon className={`h-4 w-4 ${n.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{n.title}</p>
                              {isUnread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                    {notifs.length === 0 && (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No notifications yet
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-border text-center">
                    <button className="text-xs text-primary hover:underline font-medium">View All Notifications</button>
                  </div>
                </PopoverContent>
              </Popover>

              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs gradient-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 pb-6 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;