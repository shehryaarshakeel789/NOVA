import { NavLink } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="border-b bg-background sticky top-0 z-999">
      <div className="mx-auto flex h-18 max-w-8xl items-center justify-between px-8 ">
        <h1 className="text-2xl font-bold tracking-tight">NOVA</h1>

        <NavigationMenu>
          <NavigationMenuList className="gap-2 navList">
            <NavigationMenuItem>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`
                }
              >
                Home
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="navListItem">
              <NavLink
                to="/men"
                className={({ isActive }) =>
                  `rounded-full px-5 py-3 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`
                }
              >
                Men
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink
                to="/women"
                className={({ isActive }) =>
                  `rounded-full px-5 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-primary"}`
                }
              >
                Women
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink
                to="/sale"
                className={({ isActive }) =>
                  `rounded-full px-6 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-primary"}`
                }
              >
                Sale
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink
                to="/new-arrivals"
                className={({ isActive }) =>
                  `rounded-full px-4 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-primary"}`
                }
              >
                New Arrivals
              </NavLink>
            </NavigationMenuItem>
            {isLoggedIn && user?.role === "admin" && (
              <NavigationMenuItem>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-primary"}`
                  }
                >
                  Admin
                </NavLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <NavLink to="/profile" className="flex items-center justify-center">
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </NavLink>
          ) : (
            <NavLink to="/register">
              <Button className="rounded-full bg-black text-white hover:bg-zinc-800 px-5 cursor-pointer">
                Sign Up
              </Button>
            </NavLink>
          )}

          <NavLink to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {itemCount}
              </span>
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
