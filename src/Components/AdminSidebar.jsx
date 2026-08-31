import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Package,
  ShoppingCart,
  Users,
  LayoutDashboard,
  Tag,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Products", icon: Package, path: "/admin" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Promos", icon: Tag, path: "/admin/promos" },
  { label: "Chats", icon: MessageSquare, path: "/admin/chats" },
  { label: "Alerts", icon: AlertTriangle, path: "/admin/alerts" },
];

function AdminSidebar({ activeItem, children }) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-white my-15">
        <SidebarContent>
          <SidebarGroup className="px-2 py-4">
            <SidebarMenu>
              {navItems.map(({ label, icon: Icon, path }) => {
                const disabled = !path;
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      disabled={disabled}
                      isActive={activeItem === label}
                      onClick={() => path && navigate(path)}
                      className={`flex items-center gap-3 h-10 px-3 rounded-xl my-1 ${
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-zinc-100 cursor-pointer"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{label}</span>
                      {disabled && (
                        <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default AdminSidebar;
