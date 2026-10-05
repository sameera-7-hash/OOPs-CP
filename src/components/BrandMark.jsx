import React from "react";

function BrandMark({ className = "" }) {
  return (
    <img
      src="/patientcare_symbol_only_transparent.svg"
      alt=""
      aria-hidden="true"
      className={`h-9 w-9 shrink-0 object-contain ${className}`}
    />
  );
}

export default BrandMark;
