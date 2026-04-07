import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Megaphone, CreditCard, MessageSquare, BarChart3, Flame, LogOut, FileCheck } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { signOutAndRedirect } from "@/lib/auth";

export const adminSidebarItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Campaigns", url: "/admin/campaigns", icon: Megaphone },
  { title: "Content Review", url: "/admin/content-review", icon: FileCheck },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Communication", url: "/admin/communication", icon: MessageSquare },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (url: string) => {
    const isSectionRoot = url.split("/").filter(Boolean).length === 1;
    return isSectionRoot ? location.pathname === url : location.pathname === url || location.pathname.startsWith(`${url}/`);
  };

  const handleLogout = async () => {
    await signOutAndRedirect();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Flame className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold">Align Admin</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminSidebarItems.map((item) => (
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

export default AdminSidebar;
