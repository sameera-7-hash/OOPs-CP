import React from "react";

function RoleCard({ icon, role, description, onClick, color }) {
  return (
    <div className={`role-card ${color}`}>
      <div className="role-icon">{icon}</div>

      <h2>{role}</h2>

      <p>{description}</p>

      <button onClick={onClick}>
        Continue as {role}
      </button>
    </div>
  );
}

export default RoleCard;