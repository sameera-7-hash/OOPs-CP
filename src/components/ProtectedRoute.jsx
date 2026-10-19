import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/context/UserContext";

// Gates a role's dashboard subtree: sends a signed-out visitor to Home,
// and a signed-in visitor of the wrong role to their own dashboard rather
// than showing them someone else's data. Pass `role` for a single-role
// route or `roles` for one shared by several roles.
//
// Patient-only routes send a signed-out visitor to the Patient login with
// ?next= so they land back where they were (e.g. a prefilled booking
// link). Shared routes keep going to Home, since we can't know which
// role's login they need.
function ProtectedRoute({ role, roles, children }) {
  const { user } = useCurrentUser();
  const location = useLocation();
  const allowed = roles || [role];

  if (!user) {
    if (allowed.length === 1 && allowed[0] === "Patient") {
      const next = encodeURIComponent(`${location.pathname}${location.search}`);
      return <Navigate to={`/login/Patient?next=${next}`} replace />;
    }
    return <Navigate to="/" replace />;
  }
  if (!allowed.includes(user.role)) return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;

  return children;
}

export default ProtectedRoute;
