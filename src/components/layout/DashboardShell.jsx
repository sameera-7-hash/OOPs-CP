import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Siren } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { useEmergency } from "@/components/emergency/Emergency";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <div className="mb-6 flex items-center gap-3 px-2">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card shadow-sm">
        <BrandMark className="h-7 w-7" />
      </span>
      <div>
        <p className="text-base font-semibold leading-none">PatientCare</p>
        <p className="mt-1 text-xs text-muted-foreground">Clinic management</p>
      </div>
    </div>
  );
}

function NavList({ menu, onNavigate }) {
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
      {menu.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary bg-primary-gradient font-semibold text-primary-foreground shadow-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-accent-foreground"
              )
            }
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function SidebarBottom({ onLogout }) {
  return (
    <div className="mt-auto border-t border-border pt-3">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-3 text-muted-foreground"
        onClick={onLogout}
      >
        <LogOut aria-hidden="true" />
        Log out
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
  const { openEmergency } = useEmergency();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : role.charAt(0);

  return (
    <div className="page-wash flex min-h-screen text-foreground">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-card px-4 py-2 shadow-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-brand-soft p-4 lg:flex">
        <Brand />
        <NavList menu={menu} />
        <SidebarBottom onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          title={`${role} menu`}
          className="bg-brand-soft lg:hidden"
        >
          <Brand />
          <NavList menu={menu} onNavigate={() => setMobileOpen(false)} />
          {/* Same dialog as the fixed pill, which the open sheet covers. */}
          <Button
            variant="destructive"
            className="mt-3 w-full justify-start gap-3 px-3"
            onClick={() => {
              setMobileOpen(false);
              openEmergency();
            }}
          >
            <Siren aria-hidden="true" />
            Emergency
          </Button>
          <SidebarBottom onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <header className="accent-top sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-border bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu aria-hidden="true" className="size-5!" />
            </Button>
            <p className="truncate text-base font-semibold">{title || `${role} Dashboard`}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell role={role} userId={user?.id} />

            <div className="flex items-center gap-2 pl-1">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold">{user?.name || role}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl app-enter animate-in px-4 py-6 pill-clearance focus:outline-none sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
