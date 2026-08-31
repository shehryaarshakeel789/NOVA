import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  LayoutDashboard,
  ShoppingCart,
  Tag,
  Heart,
  Headphones,
  Settings,
} from "lucide-react";

export default function CustomSidebar() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-white">
        <SidebarHeader className="border-b px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">NOVA</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-2 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Home className="h-5 w-5 shrink-0" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <ShoppingCart className="h-5 w-5 shrink-0" />
                  <span>Shop</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <LayoutDashboard className="h-5 w-5 shrink-0" />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Tag className="h-5 w-5 shrink-0" />
                  <span>Deals</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Package className="h-5 w-5 shrink-0" />
                  <span>Collections</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Heart className="h-5 w-5 shrink-0" />
                  <span>New Arrivals</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Headphones className="h-5 w-5 shrink-0" />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 h-10 px-3 rounded-xl hover:bg-zinc-100">
                  <Settings className="h-5 w-5 shrink-0" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </SidebarProvider>
  );
}
