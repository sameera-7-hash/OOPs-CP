import { useCallback, useEffect, useState } from "react";
import { getProfile } from "@/Services/api";

// The signed-in user's profile (phone, location / clinic). `profile` is
// null until loaded; setProfile lets a form publish what it just saved.
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    return getProfile()
      .then((data) => {
        setProfile(data.profile || {});
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { profile, setProfile, loading, error, reload };
}

// What booking needs from a patient: a phone number and a location.
export const bookingReady = (profile) => Boolean(profile?.phone && profile?.location);
