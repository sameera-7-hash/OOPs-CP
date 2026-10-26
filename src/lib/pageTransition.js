// Hands the landing page's "step into the light" exit over to Home: the
// landing marks it just before navigating, and Home reads it on mount to
// fade in from the same light. Module state (not history state) so a
// reload of /home never replays it.
export const arrival = { fromLanding: false };
