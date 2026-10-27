import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, BookOpenCheck, CalendarDays, Plus, Stethoscope } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { getAppointments, getAvailability, bookAppointment } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import StatusBadge from "@/components/feedback/StatusBadge";
import EmptyState from "@/components/feedback/EmptyState";
import { Skeleton, SkeletonRows } from "@/components/feedback/Skeleton";
import { CalendarCheckArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { patientMenu } from "@/lib/nav";
import { parseBookingPrefill } from "@/lib/navigation";
import { sameTime, todayIst } from "@/lib/time";
import { currentLocale, msg } from "@/i18n";
import Notice from "@/components/feedback/Notice";
import MockDoctorTag from "@/components/feedback/MockDoctorTag";
import SlotChip from "@/components/booking/SlotChip";
import DirectorySpecialists from "@/components/booking/DirectorySpecialists";

function todayIso() {
  return todayIst();
}

function Appointments() {
  const { user } = useCurrentUser();
  const notify = useToast();
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ?doctorId=&date=&time=&from=triage&condition=&specialty= (e.g. from
  // Condition guidance or the Doctor directory) opens the picker directly,
  // seeded with whatever values are valid. It only pre-selects; the
  // patient still confirms the booking.
  const [searchParams] = useSearchParams();
  const [prefill] = useState(() => parseBookingPrefill(searchParams, todayIso()));
  const pendingSlot = useRef(prefill.doctorId && prefill.time ? prefill : null);

  // Booking flow: null -> "asking" (yes/no) -> "picking" (date/doctor/slot/confirm).
  const [bookingStage, setBookingStage] = useState(prefill.any ? "picking" : null);
  const [bookingDate, setBookingDate] = useState(prefill.date || todayIso());
  const [doctorOptions, setDoctorOptions] = useState([]); // [{doctorId, doctorName, slots}]
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [chosen, setChosen] = useState(null); // {doctorId, doctorName, time, specialty?, directory?}
  const [directoryRefresh, setDirectoryRefresh] = useState(0);
  // Arriving from guidance or the directory, specialists come first.
  const directoryFirst = Boolean(prefill.fromTriage || prefill.condition || prefill.specialty);
  const pinnedDirectoryDoctor = prefill.doctorId?.startsWith("Z-") ? prefill.doctorId : null;
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  const loadAppointments = () => {
    if (!user) return;
    setLoading(true);
    getAppointments({ patientId: user.id })
      .then((data) => {
        setAppointments([...data].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadAppointments, [user]);

  // Every date's availability, to point at the next day a Beacon doctor
  // has open slots when the chosen date has none.
  const [allAvailability, setAllAvailability] = useState([]);
  useEffect(() => {
    if (bookingStage !== "picking") return;
    getAvailability().then(setAllAvailability).catch(() => setAllAvailability([]));
  }, [bookingStage, directoryRefresh]);

  useEffect(() => {
    if (bookingStage !== "picking") return;
    setLoadingSlots(true);
    setChosen(null);
    getAvailability({ date: bookingDate })
      .then((records) => {
        setDoctorOptions(records);
        applyPendingSlot(records);
      })
      .catch(() => setDoctorOptions([]))
      .finally(() => setLoadingSlots(false));
  }, [bookingStage, bookingDate]);

  // One-shot: select the linked doctor's slot if it is still open. Slot
  // strings are free text ("9 am", "09:00 AM"), so compare by time value
  // and keep the slot's own string for booking. Missing/taken = no-op.
  function applyPendingSlot(records) {
    const want = pendingSlot.current;
    if (!want) return;
    pendingSlot.current = null;
    if (want.date && want.date !== bookingDate) return;
    const doc = (records || []).find((r) => r.doctorId === want.doctorId);
    const slot = doc && (doc.slots || []).find((sl) => !sl.booked && sameTime(sl.time, want.time));
    if (slot) setChosen({ doctorId: doc.doctorId, doctorName: doc.doctorName, time: slot.time });
  }

  const startBooking = () => setBookingStage("asking");

  const cancelBooking = () => {
    setBookingStage(null);
    setChosen(null);
    setReason("");
  };

  const confirmBooking = async () => {
    if (!chosen || !user) return;
    setBooking(true);
    try {
      await bookAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: chosen.doctorId,
        doctorName: chosen.doctorName,
        date: bookingDate,
        time: chosen.time,
        reason,
        specialty: chosen.specialty,
      });
      notify({
        message: chosen.directory
          ? t("Appointment booked. You and the nursing staff have been notified.")
          : t("Appointment booked. You, your doctor and the nursing staff have been notified."),
      });
      cancelBooking();
      loadAppointments();
    } catch (err) {
      notify({ tone: "error", message: t("Could not book that slot: {{error}}", { error: err.message }) });
      getAvailability({ date: bookingDate }).then(setDoctorOptions).catch(() => {});
      setDirectoryRefresh((n) => n + 1);
    } finally {
      setBooking(false);
    }
  };

  const doctorsWithSlots = doctorOptions
    .map((doc) => ({ ...doc, openSlots: (doc.slots || []).filter((s) => !s.booked) }))
    .filter((doc) => doc.openSlots.length > 0);

  // The next date (after the chosen one if possible, else the soonest
  // upcoming) on which any Beacon doctor still has an open slot.
  const openDates = [
    ...new Set(
      allAvailability
        .filter((rec) => rec.date >= todayIso() && rec.date !== bookingDate && (rec.slots || []).some((s) => !s.booked))
        .map((rec) => rec.date)
    ),
  ].sort();
  const nextOpenDate = openDates.find((d) => d > bookingDate) || openDates[0];
  const shortDate = (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString(currentLocale(), { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

  const browseSpecialists = () => {
    document.getElementById("directory-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("directory-specialty")?.focus({ preventScroll: true });
  };

  const clinicSection = (
    <section aria-labelledby="clinic-doctors-heading" className="flex flex-col gap-4">
      <h3 id="clinic-doctors-heading" className="text-base font-semibold">{t("Beacon doctors")}</h3>
      {loadingSlots && (
        <div role="status" className="flex flex-col gap-3">
          <span className="sr-only">{t("Loading available doctors…")}</span>
          <Skeleton className="w-40" />
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
        </div>
      )}

      {!loadingSlots && doctorsWithSlots.length === 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("No Beacon doctor has opened times on this date.")}
          </p>
          <div className="flex flex-wrap gap-2">
            {nextOpenDate && (
              <Button size="sm" variant="outline" className="arrow-nudge" onClick={() => setBookingDate(nextOpenDate)}>
                {t("Show {{date}}", { date: shortDate(nextOpenDate) })}
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={browseSpecialists}>
              <Stethoscope aria-hidden="true" />
              {t("Browse specialists")}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {!loadingSlots && doctorsWithSlots.map((doc) => (
          <fieldset key={doc.doctorId}>
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Stethoscope aria-hidden="true" className="h-4 w-4 text-primary" />
              {doc.doctorName}
            </legend>
            <div className="flex flex-wrap gap-2">
              {doc.openSlots.map((s) => (
                <SlotChip
                  key={s.time}
                  name="booking-slot"
                  value={s.time}
                  checked={Boolean(chosen && chosen.doctorId === doc.doctorId && chosen.time === s.time)}
                  onChange={() => setChosen({ doctorId: doc.doctorId, doctorName: doc.doctorName, time: s.time })}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );

  const directorySection = (
    <DirectorySpecialists
      date={bookingDate}
      condition={prefill.condition}
      initialSpecialty={prefill.specialty}
      pinnedDoctorId={pinnedDirectoryDoctor}
      chosen={chosen}
      onChoose={setChosen}
      refreshKey={directoryRefresh}
    />
  );

  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("Appointments")}>
      <PageHeading
        eyebrow={t("Patient portal")}
        title={t("Appointments")}
        description={t("Book a doctor's open slot and see your upcoming visits.")}
        action={
          !bookingStage && (
            <Button onClick={startBooking}>
              <Plus aria-hidden="true" />
              {t("Book appointment")}
            </Button>
          )
        }
      />

      <Dialog open={bookingStage === "asking"} onOpenChange={(open) => !open && cancelBooking()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Book an appointment?")}</DialogTitle>
            <DialogDescription>
              {t("Next you'll pick a date, then one of a doctor's open time slots.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelBooking}>{t("Not now")}</Button>
            <Button onClick={() => setBookingStage("picking")}>{t("Yes, continue")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {bookingStage === "picking" && (
        <Panel title={t("Book a slot")} description={t("Only times a doctor has opened can be booked.")}>
          {prefill.fromTriage && (
            <Notice tone="info" icon={BookOpenCheck} className="mb-4">
              {prefill.condition ? (
                <Trans
                  i18nKey="You came here from Condition guidance for <strong>{{condition}}</strong>. Recommended specialists are listed first. Pick a time below to book."
                  values={{ condition: prefill.condition }}
                  components={{ strong: <strong /> }}
                />
              ) : (
                t("You came here from Condition guidance. Recommended specialists are listed first. Pick a time below to book.")
              )}
            </Notice>
          )}
          <div className="mb-6 flex max-w-xs flex-col gap-2">
            <Label htmlFor="booking-date">{t("Date")}</Label>
            <Input
              id="booking-date"
              type="date"
              value={bookingDate}
              min={todayIso()}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-8">
            {directoryFirst ? directorySection : clinicSection}
            <hr className="border-border" />
            {directoryFirst ? clinicSection : directorySection}
          </div>

          {chosen && (
            <div className="mt-6 flex animate-rise flex-col gap-4 border-t border-border pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reason">{t("Reason for visit")}</Label>
                <Textarea
                  id="reason"
                  placeholder={t("Briefly describe why you're booking")}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <p className="rounded-lg bg-secondary p-4 text-sm">
                <Trans
                  i18nKey={
                    chosen.specialty
                      ? msg("Booking with <strong>{{doctor}}</strong> ({{specialty}}) on <strong>{{date}}</strong> at <strong>{{time}}</strong>.")
                      : msg("Booking with <strong>{{doctor}}</strong> on <strong>{{date}}</strong> at <strong>{{time}}</strong>.")
                  }
                  values={{ doctor: chosen.doctorName, specialty: chosen.specialty, date: bookingDate, time: chosen.time }}
                  components={{ strong: <strong /> }}
                />
              </p>

              <Button onClick={confirmBooking} disabled={booking} className="self-start">
                {booking ? t("Booking…") : t("Confirm booking")}
              </Button>
            </div>
          )}

          <Button variant="ghost" size="sm" className="mt-4" onClick={cancelBooking}>
            {t("Cancel")}
          </Button>
        </Panel>
      )}

      <h2 className="mb-4 text-lg">{t("Your appointments")}</h2>

      {loading && appointments.length === 0 && <SkeletonRows rows={3} label={t("Loading appointments…")} />}
      {!loading && loadError && (
        <p role="alert" className="text-sm text-destructive">{t("Couldn't load your appointments: {{error}}", { error: loadError })}</p>
      )}
      {!loading && !loadError && appointments.length === 0 && (
        <Card>
          <EmptyState
            art={CalendarCheckArt}
            title={t("No appointments yet")}
            action={!bookingStage && <Button onClick={startBooking}>{t("Book your first appointment")}</Button>}
          >
            {t("Book a slot with a doctor and it will appear here.")}
          </EmptyState>
        </Card>
      )}

      <ul className="stagger flex flex-col gap-3">
        {appointments.map((a) => (
          <li key={a.id}>
            <Card className="card-lift flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-secondary py-2 text-center">
                <strong className="text-xl leading-none text-accent-foreground">{a.date.split("-")[2]}</strong>
                <span className="mt-1 text-xs text-muted-foreground">{a.date.slice(0, 7)}</span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base">{a.doctorName}</h3>
                {a.directoryDoctor && (
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {a.specialty}
                    <MockDoctorTag />
                  </p>
                )}
                <p className="text-sm text-muted-foreground">{a.reason || t("Consultation")}</p>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  {a.time}
                </span>
                <StatusBadge status={a.status} />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}

export default Appointments;
