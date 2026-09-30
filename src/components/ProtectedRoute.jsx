import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/context/UserContext";

// Gates a role's dashboard subtree: sends a signed-out visitor to Home,
// and a signed-in visitor of the wrong role to their own dashboard rather
// than showing them someone else's data.
function ProtectedRoute({ role, children }) {
  const { user } = useCurrentUser();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;

  return children;
}

export default ProtectedRoute;
