import React from "react";
import { BadgeCheck, CalendarClock, CircleCheck, CircleX, Clock, CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Appointment status -> colour + icon + label. Colour is never the only
// signal: every status also has its own icon and its text label.
const STATUS = {
  Confirmed: { variant: "default", icon: CircleCheck },
  Pending: { variant: "warning", icon: Clock },
  Rescheduled: { variant: "info", icon: CalendarClock },
  Completed: { variant: "success", icon: BadgeCheck },
  Rejected: { variant: "danger", icon: CircleX },
};

function StatusBadge({ status }) {
  const { variant, icon: Icon } = STATUS[status] || { variant: "outline", icon: CircleHelp };
  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {status || "Unknown"}
    </Badge>
  );
}

export default StatusBadge;
