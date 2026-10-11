import React, { useEffect, useState } from "react";
import { CalendarDays, Check, Clock, Plus, Stethoscope } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { patientMenu } from "@/lib/nav";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// A selectable time chip. It is a real radio input (so arrow keys move
// between slots); the clock icon swaps to a check when selected.
function SlotChip({ name, value, checked, onChange }) {
  return (
    <label
      className={cn(
        "relative flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span aria-hidden="true" className="relative h-4 w-4">
        <Clock className={cn("absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200", checked ? "scale-50 opacity-0" : "opacity-100")} />
        <Check className={cn("absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200", checked ? "opacity-100" : "scale-50 opacity-0")} />
      </span>
      {value}
    </label>
  );
}

function Appointments() {
  const { user } = useCurrentUser();
  const notify = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Booking flow: null -> "asking" (yes/no) -> "picking" (date/doctor/slot/confirm).
  const [bookingStage, setBookingStage] = useState(null);
  const [bookingDate, setBookingDate] = useState(todayIso());
  const [doctorOptions, setDoctorOptions] = useState([]); // [{doctorId, doctorName, slots}]
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [chosen, setChosen] = useState(null); // {doctorId, doctorName, time}
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

  useEffect(() => {
    if (bookingStage !== "picking") return;
    setLoadingSlots(true);
    setChosen(null);
    getAvailability({ date: bookingDate })
      .then((records) => setDoctorOptions(records))
      .catch(() => setDoctorOptions([]))
      .finally(() => setLoadingSlots(false));
  }, [bookingStage, bookingDate]);

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
      });
      notify({ message: "Appointment booked. You, your doctor and the nursing staff have been notified." });
      cancelBooking();
      loadAppointments();
    } catch (err) {
      notify({ tone: "error", message: `Could not book that slot: ${err.message}` });
      getAvailability({ date: bookingDate }).then(setDoctorOptions).catch(() => {});
    } finally {
      setBooking(false);
    }
  };

  const doctorsWithSlots = doctorOptions
    .map((doc) => ({ ...doc, openSlots: (doc.slots || []).filter((s) => !s.booked) }))
    .filter((doc) => doc.openSlots.length > 0);

  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Appointments">
      <PageHeading
        eyebrow="Patient portal"
        title="Appointments"
        description="Book a doctor's open slot and see your upcoming visits."
        action={
          !bookingStage && (
            <Button onClick={startBooking}>
              <Plus aria-hidden="true" />
              Book appointment
            </Button>
          )
        }
      />

      <Dialog open={bookingStage === "asking"} onOpenChange={(open) => !open && cancelBooking()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book an appointment?</DialogTitle>
            <DialogDescription>
              Next you&apos;ll pick a date, then one of a doctor&apos;s open time slots.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelBooking}>Not now</Button>
            <Button onClick={() => setBookingStage("picking")}>Yes, continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {bookingStage === "picking" && (
        <Panel title="Book a slot" description="Only times a doctor has opened can be booked.">
          <div className="mb-6 flex max-w-xs flex-col gap-2">
            <Label htmlFor="booking-date">Date</Label>
            <Input
              id="booking-date"
              type="date"
              value={bookingDate}
              min={todayIso()}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          {loadingSlots && (
            <div role="status" className="flex flex-col gap-3">
              <span className="sr-only">Loading available doctors…</span>
              <Skeleton className="w-40" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
              </div>
            </div>
          )}

          {!loadingSlots && doctorsWithSlots.length === 0 && (
            <EmptyState art={CalendarCheckArt} className="py-4">
              No doctors have open slots on this date yet. Try another date.
            </EmptyState>
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

          {chosen && (
            <div className="mt-6 flex animate-rise flex-col gap-4 border-t border-border pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reason">Reason for visit</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe why you're booking"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <p className="rounded-lg bg-secondary p-4 text-sm">
                Booking with <strong>{chosen.doctorName}</strong> on <strong>{bookingDate}</strong> at{" "}
                <strong>{chosen.time}</strong>.
              </p>

              <Button onClick={confirmBooking} disabled={booking} className="self-start">
                {booking ? "Booking…" : "Confirm booking"}
              </Button>
            </div>
          )}

          <Button variant="ghost" size="sm" className="mt-4" onClick={cancelBooking}>
            Cancel
          </Button>
        </Panel>
      )}

      <h2 className="mb-4 text-lg">Your appointments</h2>

      {loading && appointments.length === 0 && <SkeletonRows rows={3} label="Loading appointments…" />}
      {!loading && loadError && (
        <p role="alert" className="text-sm text-destructive">Couldn&apos;t load your appointments: {loadError}</p>
      )}
      {!loading && !loadError && appointments.length === 0 && (
        <Card>
          <EmptyState
            art={CalendarCheckArt}
            title="No appointments yet"
            action={!bookingStage && <Button onClick={startBooking}>Book your first appointment</Button>}
          >
            Book a slot with a doctor and it will appear here.
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
                <p className="text-sm text-muted-foreground">{a.reason || "Consultation"}</p>
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
