import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarPlus, ChevronLeft, ChevronRight, Contact, Search, Stethoscope } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getDirectoryDoctors, getDoctorSpecialties } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import MockDoctorTag from "@/components/feedback/MockDoctorTag";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorMenu, nurseMenu, patientMenu } from "@/lib/nav";
import { cn } from "@/lib/utils";

const MENUS = { Patient: patientMenu, Doctor: doctorMenu, Nurse: nurseMenu };
const ALL = "__all";
const PAGE_SIZE = 24;

const bookingPath = (doctor, specialty) =>
  `/patient/appointments?${new URLSearchParams({
    doctorId: doctor.id,
    specialty: doctor.specialties.includes(specialty) ? specialty : doctor.specialties[0],
  })}`;

// Browse the mock doctor directory (Zocdoc dataset). Every role can look;
// patients can jump straight to booking one of these doctors.
function DoctorDirectory() {
  const { user } = useCurrentUser();
  const role = user?.role || "Patient";
  const canBook = role === "Patient";
  const { t } = useTranslation();

  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState(ALL);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctorSpecialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  // Debounce typing so each keystroke isn't a request.
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => setOffset(0), [specialty, query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDirectoryDoctors({ specialty: specialty === ALL ? "" : specialty, q: query, offset, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError("");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [specialty, query, offset]);

  const total = data?.total ?? 0;
  const doctors = data?.doctors ?? [];
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <DashboardShell role={role} menu={MENUS[role] || patientMenu} title={t("Doctor directory")}>
      <PageHeading
        eyebrow={{ Patient: t("Patient portal"), Doctor: t("Doctor portal"), Nurse: t("Nurse portal") }[role]}
        title={t("Doctor directory")}
        description={t("Specialists from the Zocdoc dataset, by specialty.")}
      />

      <Notice icon={Contact} title={t("Directory listings are sample data")} className="mb-6">
        {t(
          "These doctors come from a public dataset and don't have Beacon logins. Patients can book their generated open times; the doctors themselves are never notified."
        )}
      </Notice>

      <Panel>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="directory-search">{t("Search by name")}</Label>
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="directory-search"
                type="search"
                className="pl-10"
                placeholder={t("e.g. Peters")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-72">
            <Label htmlFor="directory-specialty-filter">{t("Specialty")}</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger id="directory-specialty-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("All specialties")}</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name} ({s.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          {loading && !data
            ? t("Loading doctors…")
            : total === 1
              ? t("Showing {{from}}–{{to}} of 1 doctor.", { from, to })
              : t("Showing {{from}}–{{to}} of {{total}} doctors.", { from, to, total })}
        </p>

        {error && (
          <Notice tone="danger" role="alert" title={t("Couldn't load the directory")} className="mb-4">
            {error}
          </Notice>
        )}

        {loading && !data && <SkeletonRows rows={4} label={t("Loading doctors…")} />}

        {!loading && !error && doctors.length === 0 && (
          <EmptyState className="py-6" title={t("No doctors match")}>
            {t("Try a different name or specialty.")}
          </EmptyState>
        )}

        {doctors.length > 0 && (
          <ul className={cn("grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3", loading && "opacity-60")}>
            {doctors.map((doc) => (
              <li key={doc.id}>
                <Card className="flex h-full flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <Stethoscope aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold leading-snug">{doc.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {doc.specialties.map((s) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    <MockDoctorTag />
                    {canBook && (
                      <Link
                        to={bookingPath(doc, specialty)}
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "no-underline")}
                        aria-label={t("Book {{name}}", { name: doc.name })}
                      >
                        <CalendarPlus aria-hidden="true" />
                        {t("Book")}
                      </Link>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {total > PAGE_SIZE && (
          <nav aria-label={t("Directory pages")} className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              <ChevronLeft aria-hidden="true" />
              {t("Previous")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("Page {{page}} of {{pages}}", { page: Math.floor(offset / PAGE_SIZE) + 1, pages: Math.ceil(total / PAGE_SIZE) })}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={to >= total || loading}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              {t("Next")}
              <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        )}
      </Panel>
    </DashboardShell>
  );
}

export default DoctorDirectory;
