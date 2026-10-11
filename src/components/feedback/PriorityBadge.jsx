import React from "react";
import { ChevronUp, ChevronsUp, Minus, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Triage priority -> colour + icon + label (never colour alone).
const PRIORITY = {
  critical: { variant: "danger", icon: TriangleAlert },
  high: { variant: "warning", icon: ChevronsUp },
  medium: { variant: "info", icon: ChevronUp },
  normal: { variant: "success", icon: Minus },
};

function PriorityBadge({ priority }) {
  const { variant, icon: Icon } = PRIORITY[String(priority).toLowerCase()] || PRIORITY.normal;
  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {priority}
    </Badge>
  );
}

export default PriorityBadge;
