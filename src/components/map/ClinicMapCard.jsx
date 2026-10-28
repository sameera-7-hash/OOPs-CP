import React from "react";
import { Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { Building2, MapPinOff, Navigation } from "lucide-react";
import BeaconMap, { FitTo, pinIcon } from "@/components/map/BeaconMap";
import { distanceKm, formatDistance, hasPoint } from "@/lib/geo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Where a Beacon doctor practises: the pin the doctor dropped on their
// clinic profile, with the patient's own pin for scale when known.
function ClinicMapCard({ doctorName, clinic, origin }) {
  const { t } = useTranslation();

  if (!clinic) {
    return (
      <p className="flex items-start gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        <MapPinOff aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        {t("{{doctor}} hasn't added their clinic location yet.", { doctor: doctorName })}
      </p>
    );
  }

  const withOrigin = hasPoint(origin);
  const directions = `https://www.openstreetmap.org/directions?${new URLSearchParams({
    ...(withOrigin ? { from: `${origin.lat},${origin.lng}` } : {}),
    to: `${clinic.lat},${clinic.lng}`,
  })}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
            <Building2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">{clinic.name}</p>
            {clinic.address && <p className="text-sm text-muted-foreground">{clinic.address}</p>}
            {withOrigin && (
              <p className="text-sm text-muted-foreground">
                {t("{{distance}} from you", { distance: formatDistance(distanceKm(origin, clinic)) })}
              </p>
            )}
          </div>
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
        >
          <Navigation aria-hidden="true" className="h-4 w-4" />
          {t("Directions")}
        </a>
      </div>
      <BeaconMap center={clinic} className="h-60 rounded-none border-x-0 border-b-0 sm:h-72" label={t("{{doctor}}'s clinic", { doctor: doctorName })}>
        <Marker position={[clinic.lat, clinic.lng]} icon={pinIcon("clinic", true)}>
          <Popup>
            <strong>{clinic.name}</strong>
            <div>{doctorName}</div>
          </Popup>
        </Marker>
        {withOrigin && <Marker position={[origin.lat, origin.lng]} icon={pinIcon("patient")} />}
        <FitTo points={withOrigin ? [clinic, origin] : [clinic]} maxZoom={15} />
      </BeaconMap>
    </div>
  );
}

export default ClinicMapCard;
