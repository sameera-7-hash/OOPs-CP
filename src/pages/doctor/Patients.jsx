import React from "react";
import PatientRecords from "@/components/PatientRecords";
import { doctorMenu } from "@/lib/nav";

function Patients() {
  return <PatientRecords role="Doctor" menu={doctorMenu} />;
}

export default Patients;
