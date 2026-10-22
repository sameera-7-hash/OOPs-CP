// Photography, hotlinked from Unsplash (free to use under the Unsplash
// License). Every ID below was checked to resolve and to show what its
// name says. Swap an ID here to change a photo everywhere it is used.

const PHOTOS = {
  consultation: {
    id: "1631217868264-e5b90bb7e133",
    alt: "A smiling doctor talking with a patient in a consulting room",
  },
  // Full-bleed Home hero: subject sits right of centre, clear of the text.
  hero: {
    id: "1758691461935-202e2ef6b69f",
    alt: "A doctor talking with a patient across his desk in a clinic",
  },
  // Role cards (Home, RoleSelection, Login). crop: "faces" keeps heads in
  // frame at every aspect ratio.
  patient: {
    id: "1584516150909-c43483ee7932",
    alt: "A smiling patient in a hospital bed talking with her doctor",
    crop: "faces",
  },
  doctor: {
    id: "1758691462651-611d730c5272",
    alt: "A doctor with a stethoscope at her desk in a clinic office",
    crop: "faces",
  },
  nurse: {
    id: "1765896387387-0538bc9f997e",
    alt: "A nurse sharing a laugh with an elderly patient",
    crop: "faces",
  },
  records: {
    id: "1666214280557-f1b5022eb634",
    alt: "Two clinicians reviewing patient information on a screen",
  },
  reception: {
    id: "1519494026892-80bbd2d6fd0d",
    alt: "A bright, quiet clinic reception desk",
  },
};

const WIDTHS = [480, 800, 1200, 1600];

// Builds src/srcSet for one photo, cropped to the given aspect ratio.
export function photo(name, { aspect = 4 / 3, sizes = "100vw" } = {}) {
  const p = PHOTOS[name];
  const url = (w) =>
    `https://images.unsplash.com/photo-${p.id}?w=${w}&h=${Math.round(w / aspect)}&q=70&auto=format&fit=crop${p.crop ? `&crop=${p.crop}` : ""}`;
  return {
    src: url(800),
    srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(", "),
    sizes,
    alt: p.alt,
  };
}
