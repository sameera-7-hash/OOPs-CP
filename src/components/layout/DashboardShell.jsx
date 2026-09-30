import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogOut, Menu, Plus } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <div className="mb-6 flex items-center gap-2.5 px-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg font-bold text-accent-foreground">
        <Plus className="h-5 w-5" strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-sm font-bold leading-none text-secondary-foreground">PatientCare</h2>
        <p className="mt-1 text-[10px] text-secondary-foreground/60">Secure Healthcare Management</p>
      </div>
    </div>
  );
}

function NavList({ menu, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {menu.map((item) => {
        const active = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onNavigate?.();
            }}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
              active ? "text-primary" : "text-secondary-foreground/75 hover:text-secondary-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="dashboard-active-nav"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SidebarBottom({ onLogout }) {
  return (
    <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3">
      <Button
        variant="ghost"
        className="justify-start gap-3 text-secondary-foreground/85 hover:bg-white/10 hover:text-secondary-foreground"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}

// Shared sidebar + topbar shell for the three role dashboards. `menu` is
// an array of { label, icon (lucide component), path }; `role` picks the
// header label and avatar fallback.
function DashboardShell({ role, menu, title, children }) {
  const { user, logout } = useCurrentUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : role.charAt(0);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-secondary p-4 lg:flex">
        <Brand />
        <NavList menu={menu} />
        <SidebarBottom onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex lg:hidden">
          <Brand />
          <NavList menu={menu} onNavigate={() => setMobileOpen(false)} />
          <SidebarBottom onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-4.5 w-4.5" />
            </Button>
            <h1 className="text-sm font-bold sm:text-base">{title || `${role} Dashboard`}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell role={role} userId={user?.id} />

            <div className="flex items-center gap-2 pl-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-bold">{user?.name || role}</p>
                <p className="text-[10px] text-muted-foreground">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
