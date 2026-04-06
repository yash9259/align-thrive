import { ReactNode, useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Flame, Megaphone, UserCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useLocation } from "react-router-dom";
import { brandSidebarItems } from "@/components/layout/BrandSidebar";
import { creatorSidebarItems } from "@/components/layout/CreatorSidebar";
import { adminSidebarItems } from "@/components/layout/AdminSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
  userInitials?: string;
  hideMobileNav?: boolean;
}

const notifications = [
  { id: 1, icon: Megaphone, title: "New Campaign Match", desc: "Brand Awareness Campaign matches your profile", time: "2m ago", unread: true, color: "text-primary" },
  { id: 2, icon: UserCheck, title: "Shortlisted!", desc: "TechFlow Inc. shortlisted you for Reel Promo", time: "15m ago", unread: true, color: "text-success" },
  { id: 3, icon: Flame, title: "Chillies Reward", desc: "You earned 10 Chillies for your upload", time: "1h ago", unread: true, color: "text-accent" },
  { id: 4, icon: MessageSquare, title: "New Message", desc: "Sarah Johnson sent you a message", time: "3h ago", unread: false, color: "text-primary" },
  { id: 5, icon: Megaphone, title: "Campaign Update", desc: "Holiday Season Sale deadline extended", time: "5h ago", unread: false, color: "text-warning" },
];

const DashboardLayout = ({ children, sidebar, title, userInitials = "JD", hideMobileNav = false }: DashboardLayoutProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread && !readIds.includes(n.id)).length;

  const markAllRead = () => setReadIds(notifications.map(n => n.id));

  const mobileNavItems = useMemo(() => {
    if (location.pathname.startsWith("/brand")) {
      return brandSidebarItems.filter((item) => ["Dashboard", "Campaigns", "Creators", "Messages"].includes(item.title));
    }

    if (location.pathname.startsWith("/creator")) {
      return creatorSidebarItems.filter((item) => ["Dashboard", "Projects", "Invitations", "Messages"].includes(item.title));
    }

    if (location.pathname.startsWith("/admin")) {
      return adminSidebarItems.filter((item) => ["Dashboard", "Users", "Campaigns", "Analytics"].includes(item.title));
    }

    return [];
  }, [location.pathname]);

  const isNavItemActive = (url: string) => {
    const isSectionRoot = url.split("/").filter(Boolean).length === 1;
    return isSectionRoot ? location.pathname === url : location.pathname === url || location.pathname.startsWith(`${url}/`);
  };

  return (
    <SidebarProvider>
      <div className="dashboard-shell min-h-screen flex w-full">
        {sidebar}
        <div className="flex-1 flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/70 bg-background/92 px-3 backdrop-blur-md sm:px-4">
            <SidebarTrigger className={mobileNavItems.length ? "hidden md:inline-flex" : "inline-flex"} />
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
                    {notifications.map((n) => {
                      const isUnread = n.unread && !readIds.includes(n.id);
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/30 last:border-0 ${isUnread ? "bg-primary/5" : ""}`}
                          onClick={() => setReadIds(prev => [...prev, n.id])}
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
          <main className="flex-1 overflow-auto p-3 pb-32 sm:p-6 md:pb-6">{children}</main>

          {!!mobileNavItems.length && !hideMobileNav && (
            <div className="fixed inset-x-0 bottom-2 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px))] md:hidden">
              <div className="mobile-dock mx-auto w-full rounded-[1.75rem] px-2 py-1.5">
                <div className="grid grid-cols-4 items-end gap-1">
                  {mobileNavItems.map((item) => {
                    const active = isNavItemActive(item.url);
                    return (
                      <Link
                        key={item.title}
                        to={item.url}
                        className="mobile-dock-item relative flex flex-col items-center justify-end pb-1 pt-3 text-[10px] font-medium transition-colors"
                        aria-label={item.title}
                      >
                        <span
                          className={active ? "mobile-dock-icon mobile-dock-icon-active absolute -top-5 h-12 w-12" : "mobile-dock-icon mb-1 h-9 w-9"}
                        >
                          <item.icon className="h-5 w-5" />
                        </span>
                        <span className={active ? "mt-7 text-[hsl(var(--dock-foreground))]" : "mt-0"}>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;