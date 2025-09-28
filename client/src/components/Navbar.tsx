import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sparkles, Menu, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/memory-orb", label: "Memory Orb" },
    { href: "/pet", label: "My Pet" },
    { href: "/friends", label: "Friends" },
    { href: "/chat", label: "Chat" },
    { href: "/games", label: "Games" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="relative z-50 glassmorphism border-b border-border/50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Glimmer
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}>
                <motion.span
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-accent to-primary cursor-pointer" data-testid="avatar-user">
                    <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                      {user?.displayName?.[0] || user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glassmorphism border-border/50" data-testid="dropdown-user">
                <DropdownMenuItem disabled className="text-muted-foreground">
                  {user?.displayName || user?.username}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/features" data-testid="link-features">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Features
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  className="text-destructive"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            data-testid="mobile-menu"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
