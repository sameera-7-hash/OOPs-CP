import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
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

// Reminder bell for the top bar. Polls /api/notifications for the current
// role/user every 15s (appointment booking is what creates these, see
// pushNotification() in main.cpp) and lets the viewer mark one read.
function NotificationBell({ role, userId }) {
  const [items, setItems] = useState([]);

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
        <Button type="button" variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Reminders</DropdownMenuLabel>

        {items.length === 0 && (
          <p className="px-3 py-3 text-xs text-muted-foreground">You&apos;re all caught up.</p>
        )}

        {items.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => dismiss(n.id)}
            className={cn(!n.read && "bg-primary/5")}
          >
            <p className="text-foreground">{n.message}</p>
            <small className="mt-0.5 block text-[10px] text-muted-foreground">
              {new Date(n.createdAt).toLocaleString()}
            </small>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
