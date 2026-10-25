import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getNotifications, markNotificationRead } from "@/Services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIstDateTime } from "@/lib/time";
import { currentLocale } from "@/i18n";

// Reminder bell for the top bar. Polls /api/notifications for the current
// role/user every 15s (appointment booking is what creates these, see
// pushNotification() in main.cpp) and lets the viewer mark one read.
function NotificationBell({ role, userId }) {
  const [items, setItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!role) return;
    let cancelled = false;

    const load = () => {
      getNotifications(role, userId)
        .then((data) => {
          if (!cancelled) setItems(data);
        })
        .catch(() => {});
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [role, userId]);

  const unread = items.filter((n) => !n.read).length;

  const dismiss = (id) => {
    markNotificationRead(id).catch(() => {});
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? t("Reminders, {{count}} unread", { count: unread }) : t("Reminders")}
        >
          <Bell aria-hidden="true" className="size-5!" />
          {unread > 0 && (
            <span aria-hidden="true" className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{t("Reminders")}</DropdownMenuLabel>

        {items.length === 0 && (
          <p className="px-4 py-4 text-sm text-muted-foreground">{t("You're all caught up.")}</p>
        )}

        {items.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => dismiss(n.id)}
            className={cn(!n.read && "bg-secondary font-medium")}
          >
            <p className="text-foreground">{n.message}</p>
            <small className="mt-0.5 block text-xs text-muted-foreground">
              {formatIstDateTime(n.createdAt, currentLocale())}
            </small>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
