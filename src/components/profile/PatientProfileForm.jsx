import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert, Phone } from "lucide-react";
import { saveProfile } from "@/Services/api";
import LocationPicker from "@/components/map/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Phone + home location for a patient. Both are optional on the profile
// page; booking passes `required` so both must be filled before saving.
function PatientProfileForm({ profile, onSaved, required = false, submitLabel }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(profile?.phone || "");
  const [point, setPoint] = useState(profile?.location ? { lat: profile.location.lat, lng: profile.location.lng } : null);
  const [label, setLabel] = useState(profile?.location?.label || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (required && (!phone.trim() || !point)) {
      setError(t("Add your phone number and pin your location to book."));
      return;
    }
    setSaving(true);
    try {
      const { profile: saved } = await saveProfile({
        phone: phone.trim(),
        location: point ? { ...point, label: label.trim() } : null,
      });
      onSaved?.(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const optional = required ? "" : ` ${t("(optional)")}`;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="flex max-w-sm flex-col gap-2">
        <Label htmlFor="profile-phone">{t("Phone number")}{optional}</Label>
        <div className="relative">
          <Phone aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className="pl-9"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{t("Your location")}{optional}</span>
        <p className="text-sm text-muted-foreground">
          {t("Used to show doctors near you. Only you can see it.")}
        </p>
        <LocationPicker
          value={point}
          kind="patient"
          label={t("Your location")}
          onChange={(p, suggested) => {
            setPoint(p);
            if (suggested) setLabel(suggested);
          }}
        />
      </div>

      {point && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-location-label">{t("Area or address")}</Label>
          <Input
            id="profile-location-label"
            maxLength={200}
            placeholder={t("e.g. Shivajinagar, Pune")}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2 text-sm font-medium text-destructive">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? t("Saving…") : submitLabel || t("Save profile")}
        </Button>
        {point && !required && (
          <Button type="button" variant="ghost" onClick={() => { setPoint(null); setLabel(""); }}>
            {t("Remove location")}
          </Button>
        )}
      </div>
    </form>
  );
}

export default PatientProfileForm;
