import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PencilLine } from "lucide-react";
import { getProfile } from "@/Services/api";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Where each role edits the details shown here (nurses have no page yet).
const EDIT_PATH = { Patient: "/patient/profile", Doctor: "/doctor/profile" };

const placeLabel = (p) => p?.label || p?.address || (p ? `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : "");

export function ProfileItem({ label, value, wide = false }) {
  return (
    <div className={cn("rounded-lg bg-muted p-3", wide && "sm:col-span-2")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

// The signed-in user's details: name, email, and the profile fields for
// their role (phone; location for patients, clinic for doctors). Loaded
// fresh each time it opens. `extra` adds role-specific items at the end.
function ProfileDialog({ open, onOpenChange, user, role, extra }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setError("");
    getProfile()
      .then((data) => !cancelled && setProfile(data.profile || {}))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [open]);

  const roleLabel = { Patient: t("Patient"), Doctor: t("Doctor"), Nurse: t("Nurse") }[role] || role;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (role || "?").charAt(0);
  const notAdded = <span className="font-normal text-muted-foreground">{t("Not added")}</span>;
  const pending = profile === null && !error;
  const field = (value) => (pending ? <Skeleton className="mt-1 h-4 w-24" /> : value || notAdded);
  const editPath = EDIT_PATH[role];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogHeader className="items-center pr-0 text-center">
          <Avatar className="mx-auto mb-2 h-16 w-16">
            <AvatarFallback className="text-xl">{initial}</AvatarFallback>
          </Avatar>
          <DialogTitle>{user?.name || roleLabel}</DialogTitle>
          <p className="text-sm text-muted-foreground">{roleLabel}</p>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          <ProfileItem label={t("Name")} value={user?.name || "—"} />
          <ProfileItem label={t("Email")} value={user?.email || "—"} />
          <ProfileItem label={t("Phone number")} value={field(profile?.phone)} />
          {role === "Patient" && <ProfileItem label={t("Location")} value={field(placeLabel(profile?.location))} />}
          {role === "Doctor" && (
            <ProfileItem
              label={t("Clinic or hospital")}
              value={field(profile?.clinic && [profile.clinic.name, profile.clinic.address].filter(Boolean).join(", "))}
            />
          )}
          {extra}
        </dl>

        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

        {editPath && (
          <div className="mt-5 flex justify-center">
            <Link
              to={editPath}
              onClick={() => onOpenChange(false)}
              className={cn(buttonVariants({ variant: "outline" }), "w-full no-underline sm:w-auto")}
            >
              <PencilLine aria-hidden="true" />
              {t("Edit profile")}
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
