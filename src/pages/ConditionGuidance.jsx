import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarPlus, LoaderCircle, MessageCircleQuestion, RefreshCw, Search, ShieldCheck, Siren } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getTriage, getTriageDiseases } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import { Skeleton, SkeletonRows } from "@/components/feedback/Skeleton";
import { EmergencyNumbers } from "@/components/emergency/Emergency";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GUIDANCE_DISCLAIMER } from "@/lib/emergency";
import { doctorMenu, nurseMenu, patientMenu } from "@/lib/nav";
import { cn } from "@/lib/utils";

const MENUS = { Patient: patientMenu, Doctor: doctorMenu, Nurse: nurseMenu };
const SLOW_AFTER_MS = 2000;
// nextSteps ids that mean "open booking". Anything else is shown as text.
const BOOKING_STEPS = new Set(["BOOK_DOCTOR", "BOOK_GENERAL_PHYSICIAN"]);
// Booking opens with directory specialists recommended for the condition.
const bookingPath = (disease) =>
  `/patient/appointments?${new URLSearchParams({ from: "triage", ...(disease ? { condition: disease } : {}) })}`;

// True once `active` has stayed true for SLOW_AFTER_MS: the backend may be
// on a free tier that cold-starts, so a slow first call gets a friendlier
// message than a bare spinner.
function useSlow(active) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (!active) return undefined;
    const t = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [active]);
  return slow;
}

// Names may contain double spaces; match on a collapsed, lower-case form
// but always send back the exact string the API gave us. Condition names,
// precautions and step labels are dataset text from the API and are shown
// as the API sends them (English); only this page's own copy is translated.
const searchKey = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();

function WakingNotice() {
  const { t } = useTranslation();
  return (
    <Notice tone="info" icon={LoaderCircle} className="mb-4" role="status" title={t("The server is waking up")}>
      {t("This can take up to a minute on first load. We'll keep waiting.")}
    </Notice>
  );
}

function ErrorNotice({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <Notice
      tone="danger"
      role="alert"
      className="mb-4"
      title={t("Something went wrong")}
      action={
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          {t("Try again")}
        </Button>
      }
    >
      {message}
    </Notice>
  );
}

// Searchable single-select list (ARIA combobox with an inline listbox).
function ConditionPicker({ diseases, selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();
  const listRef = useRef(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i) => `${baseId}-opt-${i}`;

  const matches = useMemo(() => {
    const q = searchKey(query);
    return q ? diseases.filter((d) => searchKey(d).includes(q)) : diseases;
  }, [diseases, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e) => {
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(matches.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(matches[active]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${baseId}-input`}>{t("Search conditions")}</Label>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={`${baseId}-input`}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={focused && matches.length ? optionId(active) : undefined}
          autoComplete="off"
          placeholder={t("Type to filter, e.g. migraine")}
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {t("{{shown}} of {{total}} conditions. Use the arrow keys and Enter to choose.", {
          shown: matches.length,
          total: diseases.length,
        })}
      </p>

      {matches.length === 0 ? (
        <EmptyState className="py-4" title={t("No matching conditions")}>
          {t("Try a shorter or different word.")}
        </EmptyState>
      ) : (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label={t("Conditions")}
          className="max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1"
        >
          {matches.map((name, i) => {
            const isSelected = name === selected;
            return (
              <li
                key={name}
                id={optionId(i)}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the input
                onClick={() => {
                  setActive(i);
                  onSelect(name);
                }}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-sm",
                  focused && i === active && "outline-2 -outline-offset-2 outline-ring",
                  isSelected ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                {name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

// EMERGENCY: message, then call/copy, then the dataset's own suggestions
// (visually secondary, attributed, never phrased as our instruction).
// Rendered without animation so it appears instantly. No self-help or
// booking here by design.
function EmergencyResult({ result }) {
  const block = result.emergency || {};
  const suggestions = Array.isArray(block.datasetSuggestions) ? block.datasetSuggestions : [];
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="emergency-heading"
      className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 sm:p-6"
    >
      <h2 id="emergency-heading" className="flex items-center gap-2 text-lg font-bold text-destructive">
        <Siren aria-hidden="true" className="h-6 w-6" />
        {t("Emergency")}
      </h2>
      {block.message && <p className="mt-2 text-base font-semibold">{block.message}</p>}
      <EmergencyNumbers className="mt-4" />
      {suggestions.length > 0 && (
        <div className="mt-6 border-t border-destructive/25 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("Listed in the dataset for this condition")}
          </h3>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            {suggestions.map((s, i) => (
              <li key={i}>
                <q>{s.text}</q>
                {s.note && <span className="block text-xs italic">({s.note})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function NextSteps({ steps, action, canBook, disease }) {
  const valid = Array.isArray(steps) ? steps.filter((s) => s && typeof s.label === "string" && s.label) : [];
  const items = valid
    .map((step) => {
      if (BOOKING_STEPS.has(step.id)) {
        if (!canBook) return null;
        const quiet = action === "SELF_CARE";
        return (
          <Link
            key={step.id}
            to={bookingPath(disease)}
            className={cn(buttonVariants({ variant: quiet ? "outline" : "default" }), "no-underline")}
          >
            <CalendarPlus aria-hidden="true" />
            {step.label}
          </Link>
        );
      }
      // The emergency block already has the call buttons.
      if (step.id === "CALL_EMERGENCY") return null;
      return (
        <p key={step.id || step.label} className="text-sm text-muted-foreground">
          {step.label}
        </p>
      );
    })
    .filter(Boolean);

  if (!items.length) return null;
  return <div className="flex flex-wrap items-center gap-3">{items}</div>;
}

function GuidanceResult({ result, canBook }) {
  const { t } = useTranslation();
  if (result.action === "EMERGENCY") {
    return (
      <div className="flex flex-col gap-4">
        <EmergencyResult result={result} />
        <p className="text-xs text-muted-foreground">{t(GUIDANCE_DISCLAIMER)}</p>
      </div>
    );
  }

  const precautions = Array.isArray(result.precautions) ? result.precautions : [];
  const discuss = Array.isArray(result.discussWithDoctor) ? result.discussWithDoctor : [];
  const isFallback = result.action === "GENERAL_PHYSICIAN_FALLBACK";

  return (
    <div className="stagger flex flex-col gap-4">
      {isFallback && result.message && (
        <Notice tone="info" title={t("We couldn't narrow this down")}>
          {result.message}
        </Notice>
      )}

      {precautions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary" />
              {t("Self-help steps")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList items={precautions} />
          </CardContent>
        </Card>
      )}

      {discuss.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircleQuestion aria-hidden="true" className="h-5 w-5 text-primary" />
              {t("Talk to a doctor about")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList items={discuss} />
          </CardContent>
        </Card>
      )}

      {!isFallback && precautions.length === 0 && discuss.length === 0 && (
        <EmptyState className="py-4" title={t("No precautions listed")}>
          {t("The dataset has no precautions recorded for this condition.")}
        </EmptyState>
      )}

      <div>
        <NextSteps steps={result.nextSteps} action={result.action} canBook={canBook} disease={result.disease} />
      </div>
      <p className="text-xs text-muted-foreground">{t(GUIDANCE_DISCLAIMER)}</p>
    </div>
  );
}

function ConditionGuidance() {
  const { user } = useCurrentUser();
  const role = user?.role || "Patient";
  const canBook = role === "Patient";
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [diseases, setDiseases] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [result, setResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState("");
  const requestId = useRef(0);

  const selected = searchParams.get("condition") || "";

  const loadDiseases = useCallback(() => {
    setListLoading(true);
    setListError("");
    getTriageDiseases()
      .then((names) => setDiseases(Array.isArray(names) ? names.filter((n) => typeof n === "string") : []))
      .catch((err) => setListError(err.message))
      .finally(() => setListLoading(false));
  }, []);

  useEffect(loadDiseases, [loadDiseases]);

  // Only names the API listed are ever sent back, exactly as given.
  const validSelection = diseases && diseases.includes(selected) ? selected : "";

  const loadResult = useCallback((name) => {
    const id = ++requestId.current;
    setResult(null);
    setResultError("");
    if (!name) {
      setResultLoading(false);
      return;
    }
    setResultLoading(true);
    getTriage(name)
      .then((data) => id === requestId.current && setResult(data))
      .catch((err) => id === requestId.current && setResultError(err.message))
      .finally(() => id === requestId.current && setResultLoading(false));
  }, []);

  useEffect(() => loadResult(validSelection), [validSelection, loadResult]);

  const choose = (name) => setSearchParams(name ? { condition: name } : {}, { replace: true });

  const listSlow = useSlow(listLoading);
  const resultSlow = useSlow(resultLoading);

  return (
    <DashboardShell role={role} menu={MENUS[role] || patientMenu} title={t("Condition guidance")}>
      <PageHeading
        eyebrow={t("Guidance")}
        title={t("Condition guidance")}
        description={t("Choose a condition to see the general precautions our dataset lists for it, and what to do next.")}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel title={t("Pick a condition")} className="mb-0 self-start">
          {listLoading && listSlow && <WakingNotice />}
          {listError && <ErrorNotice message={listError} onRetry={loadDiseases} />}
          {listLoading && <SkeletonRows rows={4} label={t("Loading conditions…")} />}
          {!listLoading && !listError && diseases && diseases.length === 0 && (
            <EmptyState className="py-4" title={t("No conditions available")}>
              {t("The server returned an empty list.")}
            </EmptyState>
          )}
          {!listLoading && diseases && diseases.length > 0 && (
            <ConditionPicker diseases={diseases} selected={validSelection} onSelect={choose} />
          )}
        </Panel>

        <section aria-labelledby="result-heading" className="min-w-0">
          <h2 id="result-heading" className="mb-3 text-xl font-semibold">
            {result?.disease ? t("Guidance for {{condition}}", { condition: result.disease }) : t("Guidance")}
          </h2>
          <div aria-live="polite" aria-busy={resultLoading}>
            {resultLoading && resultSlow && <WakingNotice />}
            {resultError && <ErrorNotice message={resultError} onRetry={() => loadResult(validSelection)} />}
            {resultLoading && (
              <div role="status" className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
                <span className="sr-only">{t("Loading guidance…")}</span>
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="w-full" />
                <Skeleton className="w-5/6" />
                <Skeleton className="w-2/3" />
              </div>
            )}
            {!resultLoading && !resultError && !result && (
              <EmptyState className="rounded-xl border border-dashed border-border" title={t("Nothing selected yet")}>
                {t("Pick a condition from the list to see its guidance here.")}
              </EmptyState>
            )}
            {result && <GuidanceResult result={result} canBook={canBook} />}
          </div>
          {!canBook && result && result.action !== "EMERGENCY" && (
            <p className="mt-3 text-xs text-muted-foreground">{t("Read-only view. Booking is available to patients.")}</p>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

export default ConditionGuidance;
