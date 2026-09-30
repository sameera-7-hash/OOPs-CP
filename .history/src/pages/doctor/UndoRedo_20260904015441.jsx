import React, { useState } from "react";
import { DoctorLayout } from "./DoctorDashboard";

function UndoRedo({ navigate, logout }) {

  const [undoStack, setUndoStack] = useState([
    "Add Patient P124",
    "Update Diagnosis P122",
    "Edit Patient P123",
    "Delete Patient P119"
  ]);

  const [redoStack, setRedoStack] = useState([]);

  const undo = () => {

    if (undoStack.length === 0) return;

    const newUndo = [...undoStack];
    const action = newUndo.pop();

    setUndoStack(newUndo);
    setRedoStack([...redoStack, action]);
  };

  const redo = () => {

    if (redoStack.length === 0) return;

    const newRedo = [...redoStack];
    const action = newRedo.pop();

    setRedoStack(newRedo);
    setUndoStack([...undoStack, action]);
  };

  return (
    <DoctorLayout
      active="undo-redo"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Undo / Redo</h1>

        <p>
          Action history using Stack data structure.
        </p>

      </div>

      <div className="stack-container">

        <div className="panel">

          <h3>Undo Stack</h3>

          <div className="stack-label">
            TOP
          </div>

          {undoStack
            .slice()
            .reverse()
            .map((action, index) => (

              <div
                className={
                  index === 0
                    ? "stack-item top-item"
                    : "stack-item"
                }
                key={index}
              >
                {action}
              </div>

            ))}

          {undoStack.length === 0 && (
            <div className="empty-state">
              Stack is empty
            </div>
          )}

        </div>

        <div className="panel">

          <h3>Redo Stack</h3>

          <div className="stack-label">
            TOP
          </div>

          {redoStack
            .slice()
            .reverse()
            .map((action, index) => (

              <div
                className="stack-item"
                key={index}
              >
                {action}
              </div>

            ))}

          {redoStack.length === 0 && (
            <div className="empty-state">
              Stack is empty
            </div>
          )}

        </div>

      </div>

      <div className="action-buttons">

        <button
          className="primary-button"
          onClick={undo}
          disabled={undoStack.length === 0}
        >
          ↶ Undo
        </button>

        <button
          className="primary-button"
          onClick={redo}
          disabled={redoStack.length === 0}
        >
          ↷ Redo
        </button>

      </div>

      <div className="dsainfo">
        📚 Stack follows LIFO — Last In, First Out.
        The most recent action is processed first.
      </div>

    </DoctorLayout>
  );
}

const doctorMenu = [
  ["▦", "Dashboard", "doctor-dashboard"],
  ["👥", "Patients", "doctor-patients"],
  ["📅", "Appointments", "doctor-appointments"],
  ["➕", "Add Patient", "add-patient"],
  ["📊", "Analytics", "analytics"],
  ["↶", "Undo / Redo", "undo-redo"],
  ["💾", "Backup & Restore", "backup-restore"]
];

export default UndoRedo;