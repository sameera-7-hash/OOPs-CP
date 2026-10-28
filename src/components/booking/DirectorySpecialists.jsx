import React, { useEffect, useState } from "react";
import { MapPin, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDoctorSlots, getDoctorSpecialties, getRecommendedDoctors } from "@/Services/api";
import SlotChip from "@/components/booking/SlotChip";
import MockDoctorTag from "@/components/feedback/MockDoctorTag";
import EmptyState from "@/components/feedback/EmptyState";
import Notice from "@/components/feedback/Notice";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { approxPositionNear, distanceKm, formatDistance } from "@/lib/geo";

// Select value for "the specialties mapped to the guidance condition".
const RECOMMENDED = "__recommended";

const isSunday = (iso) => new Date(`${iso}T00:00:00`).getDay() === 0;

// Bookable specialists from the doctor directory (mock Zocdoc doctors with
// generated open times). After Condition guidance it starts on the
// specialists recommended for that condition; otherwise the patient picks
// a specialty. `pinnedDoctorId` (from the Doctor directory page's Book
// button) is listed first when it has open times on `date`.
// `origin` (the patient's location) adds an approximate distance per doctor.
function DirectorySpecialists({ date, condition, initialSpecialty, pinnedDoctorId, chosen, onChoose, refreshKey, origin }) {
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState(initialSpecialty || (condition ? RECOMMENDED : ""));
  const [result, setResult] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    getDoctorSpecialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  const query = specialty === RECOMMENDED ? (condition ? { disease: condition } : null) : specialty ? { specialty } : null;

  useEffect(() => {
    if (!query) {
      setResult(null);
      setPinned(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      getRecommendedDoctors({ ...query, date }),
      pinnedDoctorId ? getDoctorSlots({ doctorId: pinnedDoctorId, date }).catch(() => null) : null,
    ])
      .then(([rec, pin]) => {
        if (cancelled) return;
        setResult(rec);
        setPinned(pin);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // query is derived from specialty + condition
  }, [specialty, condition, date, pinnedDoctorId, refreshKey]);

  const doctors = [];
  if (pinned?.doctor) {
    const specs = pinned.doctor.specialties || [];
    doctors.push({
      ...pinned.doctor,
      slots: pinned.slots,
      matchedSpecialty: specs.includes(initialSpecialty) ? initialSpecialty : specs[0],
    });
  }
  for (const doc of result?.doctors || []) {
    if (!doctors.some((d) => d.id === doc.id)) doctors.push(doc);
  }
  const bookable = doctors
    .map((doc) => ({ ...doc, openSlots: (doc.slots || []).filter((s) => !s.booked) }))
    .filter((doc) => doc.openSlots.length > 0);

  const showingRecommended = specialty === RECOMMENDED && condition;
  const heading = showingRecommended
    ? t("Specialists for {{condition}}", { condition })
    : t("Specialists from the doctor directory");

  return (
    <section aria-labelledby="directory-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 id="directory-heading" className="text-base font-semibold">{heading}</h3>
        <p className="text-sm text-muted-foreground">
          {t(
            "Directory listings are sample doctors from the Zocdoc dataset. They don't have Beacon logins, so only you and the nursing staff are notified of these bookings."
          )}
        </p>
      </div>

      <div className="flex max-w-sm flex-col gap-2">
        <Label htmlFor="directory-specialty">{t("Specialty")}</Label>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger id="directory-specialty">
            <SelectValue placeholder={t("Choose a specialty")} />
          </SelectTrigger>
          <SelectContent>
            {condition && <SelectItem value={RECOMMENDED}>{t("Recommended for {{condition}}", { condition })}</SelectItem>}
            {specialties.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name} ({s.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showingRecommended && result && (
          <p className="text-xs text-muted-foreground">
            {result.matched
              ? t("Recommended: {{specialties}}.", { specialties: result.specialties.join(", ") })
              : t("We haven't mapped this condition to a specialty, so these are general practice doctors.")}
          </p>
        )}
      </div>

      {error && (
        <Notice tone="danger" role="alert" title={t("Couldn't load specialists")}>
          {error}
        </Notice>
      )}

      {loading && (
        <div role="status" className="flex flex-col gap-3">
          <span className="sr-only">{t("Loading specialists…")}</span>
          <Skeleton className="w-48" />
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
        </div>
      )}

      {!loading && !error && query && bookable.length === 0 && (
        <EmptyState className="py-4">
          {isSunday(date)
            ? t("Directory doctors don't take appointments on Sundays. Try another date.")
            : t("No directory doctors have open times on this date. Try another date.")}
        </EmptyState>
      )}

      {!loading && pinned?.doctor && !bookable.some((d) => d.id === pinned.doctor.id) && !isSunday(date) && (
        <p className="text-sm text-muted-foreground">
          {t("{{name}} has no open times on this date. Other specialists are shown instead.", { name: pinned.doctor.name })}
        </p>
      )}

      {!loading &&
        bookable.map((doc) => (
          <fieldset key={doc.id}>
            <legend className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
              <Stethoscope aria-hidden="true" className="h-4 w-4 text-primary" />
              {doc.name}
              <span className="font-normal text-muted-foreground">{doc.matchedSpecialty}</span>
              {origin && (
                <span className="flex items-center gap-1 font-normal text-muted-foreground">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {t("about {{distance}}", { distance: formatDistance(distanceKm(origin, approxPositionNear(doc.id, origin))) })}
                </span>
              )}
              <MockDoctorTag />
            </legend>
            <div className="flex flex-wrap gap-2">
              {doc.openSlots.map((s) => (
                <SlotChip
                  key={s.time}
                  name="booking-slot"
                  value={s.time}
                  checked={Boolean(chosen && chosen.doctorId === doc.id && chosen.time === s.time)}
                  onChange={() =>
                    onChoose({
                      doctorId: doc.id,
                      doctorName: doc.name,
                      time: s.time,
                      specialty: doc.matchedSpecialty,
                      directory: true,
                    })
                  }
                />
              ))}
            </div>
          </fieldset>
        ))}
    </section>
  );
}

export default DirectorySpecialists;
