import { useState } from "react";
import { Heart, User, TrendingUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: Heart },
    { name: "AI Chat", href: "/chat", icon: User },
    { 
      name: "Period Tracker", 
      href: "/tracker", 
      icon: TrendingUp, 
      badge: "NEW!" 
    },
    { name: "For Investors", href: "/investors", icon: TrendingUp },
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
              ${mobile ? "w-full justify-start" : ""}
            `}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 bg-background/80 backdrop-blur-md border rounded-full px-4 py-2 shadow-lg">
        <Heart className="h-5 w-5 text-primary mr-2" />
        <NavItems />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-md border shadow-lg"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">GYNO.APP</span>
            </div>
            <div className="flex flex-col gap-2">
              <NavItems mobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};