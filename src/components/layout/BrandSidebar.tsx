import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Megaphone, Users, MessageSquare, User, Flame, LogOut } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/brand", icon: LayoutDashboard },
  { title: "Campaigns", url: "/brand/campaigns", icon: Megaphone },
  { title: "Creators", url: "/brand/creators", icon: Users },
  { title: "Messages", url: "/brand/messages", icon: MessageSquare },
  { title: "Profile", url: "/brand/profile", icon: User },
];

const BrandSidebar = () => {
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
          <div className="mx-3 mt-3 rounded-lg bg-primary/10 p-3">
            <p className="text-xs font-medium text-primary">Brand Account</p>
            <p className="text-sm font-semibold">TechFlow Inc.</p>
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

export default BrandSidebar;
