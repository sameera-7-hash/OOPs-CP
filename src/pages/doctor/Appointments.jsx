import React, { useEffect, useState } from "react";
import { Clock, Plus, UserRound, X } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { getAvailability, setAvailability, getAppointments } from "@/Services/api";
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
import { doctorMenu } from "@/lib/nav";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function Appointments() {
  const { user } = useCurrentUser();
  const notify = useToast();

  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState([]); // [{time, booked, patientName}]
  const [slotInput, setSlotInput] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoadingSlots(true);

    getAvailability({ doctorId: user.id, date })
      .then((records) => {
        if (cancelled) return;
        setSlots(records[0]?.slots || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => { cancelled = true; };
  }, [user, date]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getAppointments({ doctorId: user.id })
      .then((data) => {
        if (cancelled) return;
        setAppointments([...data].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
      })
      .catch((err) => {
        if (!cancelled) setAppointmentsError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingAppointments(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  const addSlot = () => {
    const time = slotInput.trim();
    if (!time) return;
    if (slots.some((s) => s.time === time)) {
      setSlotInput("");
      return;
    }
    setSlots([...slots, { time, booked: false }]);
    setSlotInput("");
  };

  const removeSlot = (time) => setSlots(slots.filter((s) => s.time !== time));

  const saveAvailability = async () => {
    if (!user) return;
    setSavingAvailability(true);
    try {
      const record = await setAvailability({
        doctorId: user.id,
        doctorName: user.name,
        date,
        slots: slots.map((s) => s.time),
      });
      setSlots(record.slots || []);
      notify({ message: `Availability saved for ${date}.` });
    } catch (err) {
      notify({ tone: "error", message: `Could not save availability: ${err.message}` });
    } finally {
      setSavingAvailability(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Appointments">
      <PageHeading eyebrow="Doctor portal" title="Appointments" description="Set your availability and see booked consultations." />

      <Panel title="My availability" description="Add the times you're free on a date, then save.">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2 sm:w-52">
            <Label htmlFor="availability-date">Date</Label>
            <Input id="availability-date" type="date" value={date} min={todayIso()} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="slot-input">Add a time slot</Label>
            <div className="flex gap-2">
              <Input
                id="slot-input"
                placeholder="e.g. 09:00 AM"
                value={slotInput}
                onChange={(e) => setSlotInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSlot(); } }}
              />
              <Button type="button" variant="outline" onClick={addSlot}>
                <Plus aria-hidden="true" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {loadingSlots ? (
          <div role="status" className="mb-6 flex flex-wrap gap-2">
            <span className="sr-only">Loading slots…</span>
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-28 rounded-full" />)}
          </div>
        ) : (
          <ul aria-label={`Time slots for ${date}`} className="mb-6 flex flex-wrap gap-2">
            {slots.length === 0 && <li className="text-sm text-muted-foreground">No slots set for this date yet.</li>}
            {slots.map((s) => (
              <li
                key={s.time}
                className={
                  s.booked
                    ? "flex h-10 items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 text-sm font-semibold text-warning"
                    : "flex h-10 items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1 text-sm font-semibold"
                }
              >
                {s.booked ? <UserRound aria-hidden="true" className="h-4 w-4" /> : <Clock aria-hidden="true" className="h-4 w-4 text-primary" />}
                {s.time}
                {s.booked ? (
                  <span className="font-medium">· booked by {s.patientName || "a patient"}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeSlot(s.time)}
                    aria-label={`Remove ${s.time}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <Button onClick={saveAvailability} disabled={savingAvailability}>
          {savingAvailability ? "Saving…" : "Save availability"}
        </Button>
      </Panel>

      <Panel title="Booked appointments">
        {loadingAppointments && <SkeletonRows rows={3} label="Loading appointments…" />}
        {!loadingAppointments && appointmentsError && (
          <p role="alert" className="text-sm text-destructive">Couldn&apos;t load appointments: {appointmentsError}</p>
        )}
        {!loadingAppointments && !appointmentsError && appointments.length === 0 && (
          <EmptyState art={CalendarCheckArt} title="No appointments yet">
            When a patient books one of your open slots, it will show up here.
          </EmptyState>
        )}
        {!loadingAppointments && appointments.length > 0 && (
          <div className="relative -mx-6 overflow-x-auto px-6">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Time</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Patient</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Reason</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4">{a.date}</td>
                    <td className="py-3 pr-4">{a.time}</td>
                    <td className="py-3 pr-4 font-medium">{a.patientName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{a.reason || "—"}</td>
                    <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}

export default Appointments;
