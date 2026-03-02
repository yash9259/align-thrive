import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const PublicNavbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Align</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-primary' : 'text-muted-foreground'}`}>About</Link>
          <Link to="/login" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/login') ? 'text-primary' : 'text-muted-foreground'}`}>Login</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gradient-primary text-primary-foreground">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
