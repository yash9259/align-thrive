import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Flame, MessageSquare, User, ShoppingCart, Upload, LogOut } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/creator", icon: LayoutDashboard },
  { title: "Projects", url: "/creator/projects", icon: FolderOpen },
  { title: "Upload Content", url: "/creator/upload", icon: Upload },
  { title: "Buy Chillies", url: "/creator/buy-chillies", icon: Flame },
  { title: "Messages", url: "/creator/messages", icon: MessageSquare },
  { title: "Profile", url: "/creator/profile", icon: User },
];

const CreatorSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

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
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-accent">Creator Account</p>
              <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">✓ Verified</span>
            </div>
            <p className="text-sm font-semibold">Sarah Johnson</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-accent">
              <Flame className="h-3 w-3" /> 245 Chillies
            </p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
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
              <SidebarMenuButton asChild>
                <Link to="/">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default CreatorSidebar;
