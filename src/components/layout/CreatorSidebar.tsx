import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Flame, MessageSquare, User, Upload, LogOut, MailOpen, History, Users, Building2 } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { getCurrentCreatorContext } from "@/lib/creator-api";
import { signOutAndRedirect } from "@/lib/auth";

export const creatorSidebarItems = [
  { title: "Dashboard", url: "/creator", icon: LayoutDashboard },
  { title: "Projects", url: "/creator/projects", icon: FolderOpen },
  { title: "Invitations", url: "/creator/invitations", icon: MailOpen },
  { title: "Upload Content", url: "/creator/upload", icon: Upload },
  { title: "Buy Chillies", url: "/creator/buy-chillies", icon: Flame },
  { title: "Payment History", url: "/creator/payment-history", icon: History },
  { title: "Creator Community", url: "/creator/community", icon: Users },
  { title: "Company Community", url: "/creator/company-community", icon: Building2 },
  { title: "Messages", url: "/creator/messages", icon: MessageSquare },
  { title: "Profile", url: "/creator/profile", icon: User },
];

const CreatorSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [creatorName, setCreatorName] = useState("Creator");
  const [isVerified, setIsVerified] = useState(false);
  const [chilliesBalance, setChilliesBalance] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await getCurrentCreatorContext();
        setCreatorName(context.fullName);
        setIsVerified(context.isVerified);
        setChilliesBalance(context.chilliesBalance);
      } catch {
        setCreatorName("Creator");
        setIsVerified(false);
        setChilliesBalance(0);
      }
    };

    void load();
  }, [location.pathname]);

  const sidebarLabel = useMemo(() => creatorName || "Creator", [creatorName]);

  const isItemActive = (url: string) => {
    const isSectionRoot = url.split("/").filter(Boolean).length === 1;
    return isSectionRoot ? location.pathname === url : location.pathname === url || location.pathname.startsWith(`${url}/`);
  };

  const handleLogout = () => {
    void signOutAndRedirect("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Flame className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold">Align</span>}
        </div>
        {!collapsed && (
          <div className="mx-3 mt-3 rounded-lg bg-accent/10 p-3">
            <p className="text-xs font-medium text-accent">Creator Account</p>
            <p className="text-sm font-semibold truncate">{sidebarLabel}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-accent">
              <Flame className="h-3 w-3" /> {chilliesBalance} Chillies
            </p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {creatorSidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto border-t border-sidebar-border p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default CreatorSidebar;
