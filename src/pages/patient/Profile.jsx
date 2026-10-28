import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, UserRound } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { useProfile } from "@/hooks/useProfile";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import PatientProfileForm from "@/components/profile/PatientProfileForm";
import { patientMenu } from "@/lib/nav";

// Name and email come from signup; phone and location are optional here
// and only become required when booking an appointment.
function Profile() {
  const { user } = useCurrentUser();
  const notify = useToast();
  const { t } = useTranslation();
  const { profile, setProfile, loading, error } = useProfile();

  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("My profile")}>
      <PageHeading
        eyebrow={t("Patient portal")}
        title={t("My profile")}
        description={t("Your phone number and location are optional. You'll need both to book an appointment.")}
      />

      <Panel title={t("Account")}>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <UserRound aria-hidden="true" className="h-5 w-5 text-primary" />
            <div>
              <dt className="text-muted-foreground">{t("Full name")}</dt>
              <dd className="font-semibold">{user?.name}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail aria-hidden="true" className="h-5 w-5 text-primary" />
            <div>
              <dt className="text-muted-foreground">{t("Email")}</dt>
              <dd className="font-semibold">{user?.email}</dd>
            </div>
          </div>
        </dl>
      </Panel>

      <Panel title={t("Contact and location")}>
        {error && <Notice tone="danger" role="alert" className="mb-4">{error}</Notice>}
        {loading && !profile ? (
          <SkeletonRows rows={4} label={t("Loading…")} />
        ) : (
          <PatientProfileForm
            profile={profile}
            onSaved={(saved) => {
              setProfile(saved);
              notify({ message: t("Profile saved.") });
            }}
          />
        )}
      </Panel>
    </DashboardShell>
  );
}

export default Profile;
