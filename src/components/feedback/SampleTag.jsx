import React from "react";
import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";
import Notice from "./Notice";

// Marks placeholder content. Anything hard-coded in the UI (not loaded
// from the backend) must carry one of these so it is never mistaken for
// real clinic data.
function SampleTag() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <FlaskConical aria-hidden="true" className="h-3 w-3" />
      {t("Sample data")}
    </span>
  );
}

export function SampleDataNotice({ children }) {
  const { t } = useTranslation();
  return (
    <Notice tone="warning" icon={FlaskConical} title={t("Sample data")} className="mb-6">
      {children || t("This screen shows placeholder content. It isn't connected to the backend yet.")}
    </Notice>
  );
}

export default SampleTag;
