// Photography, hotlinked from Unsplash (free to use under the Unsplash
// License). Every ID below was checked to resolve and to show what its
// name says. Swap an ID here to change a photo everywhere it is used.

const PHOTOS = {
  consultation: {
    id: "1631217868264-e5b90bb7e133",
    alt: "A smiling doctor talking with a patient in a consulting room",
  },
  bedside: {
    id: "1581056771107-24ca5f033842",
    alt: "A doctor reviewing notes with a patient at her bedside",
  },
  doctor: {
    id: "1612349317150-e413f6a5b16d",
    alt: "A doctor in a white coat with a stethoscope",
  },
  nurse: {
    id: "1622253692010-333f2da6031d",
    alt: "A smiling nurse in blue scrubs with a stethoscope",
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
    `https://images.unsplash.com/photo-${p.id}?w=${w}&h=${Math.round(w / aspect)}&q=70&auto=format&fit=crop`;
  return {
    src: url(800),
    srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(", "),
    sizes,
    alt: p.alt,
  };
}
