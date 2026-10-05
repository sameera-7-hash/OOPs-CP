import React from "react";
import PatientRecords from "@/components/PatientRecords";
import { nurseMenu } from "@/lib/nav";

function Patients() {
  return <PatientRecords role="Nurse" menu={nurseMenu} />;
}

export default Patients;
