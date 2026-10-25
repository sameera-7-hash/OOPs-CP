import React from "react";
import { ChevronUp, ChevronsUp, Minus, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

// Triage priority -> colour + icon + label (never colour alone).
const PRIORITY = {
  critical: { variant: "danger", icon: TriangleAlert },
  high: { variant: "warning", icon: ChevronsUp },
  medium: { variant: "info", icon: ChevronUp },
  normal: { variant: "success", icon: Minus },
};

function PriorityBadge({ priority }) {
  const { variant, icon: Icon } = PRIORITY[String(priority).toLowerCase()] || PRIORITY.normal;
  const { t } = useTranslation();
  const label =
    { critical: t("Critical"), high: t("High"), medium: t("Medium"), normal: t("Normal") }[String(priority).toLowerCase()] || priority;
  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}

export default PriorityBadge;
