import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getAvailability, setAvailability, getAppointments } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { doctorMenu } from "@/lib/nav";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function Appointments() {
  const { user } = useCurrentUser();

  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState([]); // [{time, booked, patientName}]
  const [slotInput, setSlotInput] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

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
      .catch(() => {})
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
      alert(`Availability saved for ${date}.`);
    } catch (err) {
      alert("Could not save availability: " + err.message);
    } finally {
      setSavingAvailability(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Appointments">
      <PageHeading eyebrow="Doctor Portal" title="Appointments" description="Set your availability and manage booked consultations." />

      <Panel title="My Availability">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="sm:w-48">
            <Label>Date</Label>
            <Input type="date" className="mt-1.5" value={date} min={todayIso()} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="flex-1">
            <Label>Add a time slot</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                placeholder="e.g. 09:00 AM"
                value={slotInput}
                onChange={(e) => setSlotInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSlot(); } }}
              />
              <Button type="button" variant="outline" onClick={addSlot}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {loadingSlots ? (
          <p className="text-sm text-muted-foreground">Loading slots...</p>
        ) : (
          <div className="mb-4 flex flex-wrap gap-2">
            {slots.length === 0 && <p className="text-sm text-muted-foreground">No slots set for this date yet.</p>}
            {slots.map((s) => (
              <span
                key={s.time}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  s.booked ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-card"
                )}
              >
                {s.time}
                {s.booked ? (
                  ` · booked (${s.patientName || "patient"})`
                ) : (
                  <button type="button" onClick={() => removeSlot(s.time)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <Button onClick={saveAvailability} disabled={savingAvailability}>
          {savingAvailability ? "Saving..." : "Save Availability"}
        </Button>
      </Panel>

      <Panel title="Booked Appointments">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase text-muted-foreground">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Patient</th>
                <th className="py-2 pr-3">Reason</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loadingAppointments && appointments.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-muted-foreground">No appointments booked yet.</td></tr>
              )}
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-3">{a.date}</td>
                  <td className="py-2.5 pr-3">{a.time}</td>
                  <td className="py-2.5 pr-3">{a.patientName}</td>
                  <td className="py-2.5 pr-3">{a.reason || "—"}</td>
                  <td className="py-2.5 pr-3"><Badge variant="success">{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </DashboardShell>
  );
}

export default Appointments;
