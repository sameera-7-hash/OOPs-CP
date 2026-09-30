import React from "react";

function MedicalHistory() {

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">MEDICAL INFORMATION</span>
          <h1>Medical History</h1>
          <p>Your previous medical information.</p>
        </div>

      </div>


      <section className="card">

        <div className="timeline">

          <div className="timeline-item">
            <span>02 Sep 2026</span>

            <div>
              <h3>General Consultation</h3>
              <p>Consultation with Dr. Ananya Mehta.</p>
            </div>
          </div>


          <div className="timeline-item">
            <span>20 Aug 2026</span>

            <div>
              <h3>Chest X-Ray</h3>
              <p>Chest X-Ray report added to medical records.</p>
            </div>
          </div>


          <div className="timeline-item">
            <span>15 Aug 2026</span>

            <div>
              <h3>Blood Pressure Check</h3>
              <p>Blood pressure recorded during routine checkup.</p>
            </div>
          </div>


          <div className="timeline-item">
            <span>02 Aug 2026</span>

            <div>
              <h3>General Health Checkup</h3>
              <p>Routine health examination completed.</p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}

export default MedicalHistory;