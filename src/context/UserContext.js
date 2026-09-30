import { createContext, useContext } from "react";

// Holds the logged-in user ({id, name, email, role}) plus login/logout, so
// any page/layout can read "who am I" (for the top-right name, notification
// polling, or stamping patientId/doctorId onto a request) without every
// page in the tree having to accept and forward a `user` prop by hand.
export const UserContext = createContext({ user: null, login: () => {}, logout: () => {} });

export function useCurrentUser() {
  return useContext(UserContext);
}
