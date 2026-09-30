import React, { useEffect, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getAppointments, getAvailability, bookAppointment } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function Appointments() {
  const { user } = useCurrentUser();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .then((data) => setAppointments([...data].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))))
      .catch(() => {})
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
      alert("Appointment booked! You, your doctor and the nursing staff have been notified.");
      cancelBooking();
      loadAppointments();
    } catch (err) {
      alert("Could not book that slot: " + err.message);
      getAvailability({ date: bookingDate }).then(setDoctorOptions).catch(() => {});
    } finally {
      setBooking(false);
    }
  };

  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Appointments">
      <PageHeading
        eyebrow="Patient Portal"
        title="Appointments"
        description="View and manage your appointments."
        action={
          !bookingStage && (
            <Button onClick={startBooking}>
              <Plus className="h-4 w-4" />
              Book Appointment
            </Button>
          )
        }
      />

      <Dialog open={bookingStage === "asking"} onOpenChange={(open) => !open && cancelBooking()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Would you like to book an appointment?</DialogTitle>
            <DialogDescription>
              You&apos;ll pick a date, then a doctor&apos;s open time slot, on the next step.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelBooking}>No, not now</Button>
            <Button onClick={() => setBookingStage("picking")}>Yes, book one</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {bookingStage === "picking" && (
        <Panel title="Book a Slot">
          <div className="mb-4 max-w-xs">
            <Label htmlFor="booking-date">Date</Label>
            <Input
              id="booking-date"
              type="date"
              className="mt-1.5"
              value={bookingDate}
              min={todayIso()}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          {loadingSlots && <p className="text-sm text-muted-foreground">Loading available doctors...</p>}

          {!loadingSlots && doctorOptions.length === 0 && (
            <p className="text-sm text-muted-foreground">No doctors have posted availability for this date yet. Try another date.</p>
          )}

          <div className="flex flex-col gap-4">
            {!loadingSlots && doctorOptions.map((doc) => {
              const openSlots = (doc.slots || []).filter((s) => !s.booked);
              if (openSlots.length === 0) return null;
              return (
                <div key={doc.doctorId}>
                  <h4 className="mb-2 text-xs font-bold">{doc.doctorName}</h4>
                  <div className="flex flex-wrap gap-2">
                    {openSlots.map((s) => {
                      const active = chosen && chosen.doctorId === doc.doctorId && chosen.time === s.time;
                      return (
                        <button
                          type="button"
                          key={s.time}
                          onClick={() => setChosen({ doctorId: doc.doctorId, doctorName: doc.doctorName, time: s.time })}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/50"
                          )}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {chosen && (
            <div className="mt-5 flex flex-col gap-3">
              <div>
                <Label htmlFor="reason">Reason for visit</Label>
                <Textarea
                  id="reason"
                  className="mt-1.5"
                  placeholder="Briefly describe why you're booking this appointment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Booking with <strong className="text-foreground">{chosen.doctorName}</strong> on{" "}
                <strong className="text-foreground">{bookingDate}</strong> at{" "}
                <strong className="text-foreground">{chosen.time}</strong>.
              </p>

              <Button onClick={confirmBooking} disabled={booking}>
                {booking ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          )}

          <Button variant="ghost" size="sm" className="mt-3" onClick={cancelBooking}>
            Cancel
          </Button>
        </Panel>
      )}

      <div className="flex flex-col gap-3">
        {!loading && appointments.length === 0 && (
          <p className="text-sm text-muted-foreground">You have no appointments yet.</p>
        )}

        {appointments.map((a) => (
          <Card key={a.id} className="flex items-center gap-4 p-4">
            <div className="flex w-14 flex-shrink-0 flex-col items-center rounded-lg bg-muted py-2 text-center">
              <strong className="text-lg leading-none">{a.date.split("-")[2]}</strong>
              <span className="mt-1 text-[9px] text-muted-foreground">{a.date}</span>
            </div>

            <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-4.5 w-4.5" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold">{a.doctorName}</h3>
              <p className="text-xs text-muted-foreground">{a.reason || "Consultation"}</p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <small className="text-xs text-muted-foreground">{a.time}</small>
              <Badge variant={a.status === "Pending" ? "warning" : "success"}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export default Appointments;
