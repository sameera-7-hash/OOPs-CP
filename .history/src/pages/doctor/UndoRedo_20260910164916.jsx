import React, { useState } from "react";

function UndoRedo() {

  const [message, setMessage] = useState(
    "No action performed yet."
  );

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">ACTION HISTORY</span>
          <h1>Undo / Redo</h1>
          <p>Manage your recent actions.</p>
        </div>
      </div>


      <section className="card action-history">

        <div className="history-icon">
          ↶
        </div>

        <h2>Action History</h2>

        <p>{message}</p>

        <div className="history-buttons">

          <button
            className="primary-btn"
            onClick={() => setMessage("Last action undone.")}
          >
            ↶ Undo
          </button>

          <button
            className="secondary-btn"
            onClick={() => setMessage("Last action restored.")}
          >
            ↷ Redo
          </button>

        </div>

      </section>

    </div>
  );
}

export default UndoRedo;