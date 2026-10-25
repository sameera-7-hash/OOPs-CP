import React from "react";
import { Contact } from "lucide-react";
import { useTranslation } from "react-i18next";

// Marks a doctor from the Zocdoc directory dataset. They are listing-only
// (no Beacon login), so they never see bookings or notifications.
function MockDoctorTag() {
  const { t } = useTranslation();
  return (
    <span
      title={t("From the Zocdoc directory dataset. This doctor has no Beacon login.")}
      className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground px-2 py-0.5 text-xs font-medium text-muted-foreground"
    >
      <Contact aria-hidden="true" className="h-3 w-3" />
      {t("Directory listing")}
    </span>
  );
}

export default MockDoctorTag;
