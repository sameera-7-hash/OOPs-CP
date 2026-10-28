import React from "react";
import { Link } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import BeaconMap, { FitTo, pinIcon } from "@/components/map/BeaconMap";
import { approxPositionNear, distanceKm, formatDistance } from "@/lib/geo";

// The patient's pin, directory doctors placed around it (approximate: the
// dataset has no addresses), and Beacon clinics at their real pins.
// `bookingPath(doc)` links a directory doctor's popup to booking.
function NearbyDoctorsMap({ origin, doctors = [], clinics = [], bookingPath, className }) {
  const { t } = useTranslation();
  const placed = doctors.map((doc) => ({ doc, pos: approxPositionNear(doc.id, origin) }));

  return (
    <BeaconMap center={origin} className={className} label={t("Doctors near you")}>
      <Marker position={[origin.lat, origin.lng]} icon={pinIcon("patient", true)} zIndexOffset={200}>
        <Popup>
          <strong>{t("You")}</strong>
          {origin.label && <div>{origin.label}</div>}
        </Popup>
      </Marker>

      {/* Clinics draw above the patient's pin: a nearby clinic would
          otherwise sit under it and couldn't be clicked. */}
      {clinics.map((c) => (
        <Marker key={c.doctorId} position={[c.clinic.lat, c.clinic.lng]} icon={pinIcon("clinic")} zIndexOffset={500}>
          <Popup>
            <strong>{c.clinic.name}</strong>
            <div>{c.doctorName} · {t("Beacon doctor")}</div>
            {c.clinic.address && <div>{c.clinic.address}</div>}
            <div>{t("{{distance}} away", { distance: formatDistance(distanceKm(origin, c.clinic)) })}</div>
          </Popup>
        </Marker>
      ))}

      {placed.map(({ doc, pos }) => (
        <Marker key={doc.id} position={[pos.lat, pos.lng]} icon={pinIcon("directory")}>
          <Popup>
            <strong>{doc.name}</strong>
            <div>{doc.specialties.join(", ")}</div>
            <div>{t("About {{distance}} away (approximate)", { distance: formatDistance(distanceKm(origin, pos)) })}</div>
            {bookingPath && (
              <Link to={bookingPath(doc)} className="font-semibold text-primary">
                {t("Book")}
              </Link>
            )}
          </Popup>
        </Marker>
      ))}

      <FitTo points={[origin, ...placed.map((p) => p.pos)]} maxZoom={14} />
    </BeaconMap>
  );
}

export default NearbyDoctorsMap;
