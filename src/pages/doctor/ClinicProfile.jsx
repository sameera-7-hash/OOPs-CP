import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, CircleAlert, Phone } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useProfile } from "@/hooks/useProfile";
import { saveProfile } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import LocationPicker from "@/components/map/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doctorMenu } from "@/lib/nav";

// A doctor's clinic or hospital: its name, address and the pin patients
// see when they book with this doctor. The phone number stays private.
function ClinicProfile() {
  const notify = useToast();
  const { t } = useTranslation();
  const { profile, setProfile, loading, error: loadError } = useProfile();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [point, setPoint] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fill the form once the saved profile arrives.
  useEffect(() => {
    if (!profile) return;
    setPhone(profile.phone || "");
    setName(profile.clinic?.name || "");
    setAddress(profile.clinic?.address || "");
    setPoint(profile.clinic ? { lat: profile.clinic.lat, lng: profile.clinic.lng } : null);
  }, [profile]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (point && !name.trim()) {
      setError(t("Give your clinic or hospital a name."));
      return;
    }
    if (name.trim() && !point) {
      setError(t("Drop a pin on the map where your clinic is."));
      return;
    }
    setSaving(true);
    try {
      const { profile: saved } = await saveProfile({
        phone: phone.trim(),
        clinic: point ? { name: name.trim(), address: address.trim(), ...point } : null,
      });
      setProfile(saved);
      notify({ message: t("Clinic details saved.") });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title={t("My clinic")}>
      <PageHeading
        eyebrow={t("Doctor portal")}
        title={t("My clinic")}
        description={t("Pin where you practise. Patients booking with you see this location on a map.")}
      />

      <Panel title={t("Clinic or hospital")}>
        {loadError && <Notice tone="danger" role="alert" className="mb-4">{loadError}</Notice>}
        {loading && !profile ? (
          <SkeletonRows rows={4} label={t("Loading…")} />
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic-name">{t("Clinic or hospital name")}</Label>
                <div className="relative">
                  <Building2 aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="clinic-name" className="pl-9" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="clinic-phone">{t("Phone number")} {t("(optional)")}</Label>
                <div className="relative">
                  <Phone aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="clinic-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t("Kept private. Patients don't see it.")}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t("Location")}</span>
              <LocationPicker
                value={point}
                kind="clinic"
                label={t("Clinic location")}
                onChange={(p, suggested) => {
                  setPoint(p);
                  if (suggested && !address.trim()) setAddress(suggested);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="clinic-address">{t("Address")}</Label>
              <Input
                id="clinic-address"
                maxLength={200}
                placeholder={t("e.g. 12 FC Road, Shivajinagar, Pune")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 text-sm font-medium text-destructive">
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>{saving ? t("Saving…") : t("Save clinic details")}</Button>
              {point && (
                <Button type="button" variant="ghost" onClick={() => { setPoint(null); setName(""); setAddress(""); }}>
                  {t("Remove clinic")}
                </Button>
              )}
            </div>
          </form>
        )}
      </Panel>
    </DashboardShell>
  );
}

export default ClinicProfile;
