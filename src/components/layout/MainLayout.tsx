import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Motorcycle,
  Package,
  User,
  LogOut,
  Menu,
  Home,
  Settings,
  Users,
  LayoutDashboard,
} from "lucide-react";

const MainLayout = () => {
  const { user, signOut, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (user?.user_metadata?.name) {
      const nameParts = user.user_metadata.name.split(" ");
      const initials = nameParts
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      setInitials(initials);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5 mr-2" />,
      roles: ["user", "driver", "admin"],
    },
    {
      name: "Driver Dashboard",
      path: "/driver/dashboard",
      icon: <Motorcycle className="h-5 w-5 mr-2" />,
      roles: ["driver"],
    },
    {
      name: "Register as Driver",
      path: "/driver/register",
      icon: <Motorcycle className="h-5 w-5 mr-2" />,
      roles: ["user"],
    },
    {
      name: "Admin Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
      roles: ["admin"],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5 mr-2" />,
      roles: ["user", "driver", "admin"],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Motorcycle className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">La7agli</span>
          </Link>

          <div className="flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6 mt-2">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src="" />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user?.user_metadata?.name || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-1 flex-1">
                    {navItems
                      .filter(
                        (item) => !userRole || item.roles.includes(userRole),
                      )
                      .map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-md ${isActive(item.path) ? "bg-muted font-medium" : "hover:bg-muted/50"}`}
                          onClick={closeSheet}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                  </nav>

                  <div className="border-t pt-4 mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleSignOut();
                        closeSheet();
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} La7agli - Motorcycle & TukTuk
          Delivery App
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
