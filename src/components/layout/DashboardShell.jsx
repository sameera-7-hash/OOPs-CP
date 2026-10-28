import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/context/UserContext";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileDialog from "@/components/profile/ProfileDialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEmergency } from "@/components/emergency/Emergency";
import { cn } from "@/lib/utils";

function Brand() {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex items-center gap-3 px-2">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card shadow-sm">
        <BrandMark className="h-7 w-7" />
      </span>
      <div>
        <p className="text-base font-semibold leading-none">Beacon</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("Clinic management")}</p>
      </div>
    </div>
  );
}

function NavList({ menu, onNavigate }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("Main")} className="flex flex-1 flex-col gap-1">
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
            <span>{t(item.label)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function SidebarBottom({ onLogout }) {
  const { t } = useTranslation();
  return (
    <div className="mt-auto border-t border-border pt-3">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-3 text-muted-foreground"
        onClick={onLogout}
      >
        <LogOut aria-hidden="true" />
        {t("Log out")}
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
  const [profileOpen, setProfileOpen] = useState(false);
  const { openEmergency } = useEmergency();
  const { t } = useTranslation();

  // `role` is the backend's English role name; these are its display labels.
  const roleLabel = { Patient: t("Patient"), Doctor: t("Doctor"), Nurse: t("Nurse") }[role] || role;
  const menuTitle = { Patient: t("Patient menu"), Doctor: t("Doctor menu"), Nurse: t("Nurse menu") }[role];
  const defaultTitle = { Patient: t("Patient Dashboard"), Doctor: t("Doctor Dashboard"), Nurse: t("Nurse Dashboard") }[role];

  // Every logout lands on the homepage. Navigate first: clearing the user
  // first would let ProtectedRoute redirect this page to a login screen.
  const handleLogout = () => {
    navigate("/", { replace: true });
    logout();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : role.charAt(0);

  return (
    <div className="page-wash flex min-h-screen text-foreground">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-card px-4 py-2 shadow-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("Skip to content")}
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
          title={menuTitle}
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
            {t("Emergency")}
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
              aria-label={t("Open menu")}
            >
              <Menu aria-hidden="true" className="size-5!" />
            </Button>
            <p className="truncate text-base font-semibold">{title || defaultTitle}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationBell role={role} userId={user?.id} />

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label={t("Open my profile")}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-left transition-colors hover:bg-secondary sm:pr-3"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-semibold">{user?.name || roleLabel}</span>
                <span className="block text-xs text-muted-foreground">{roleLabel}</span>
              </span>
            </button>
            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={user} role={role} />
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
