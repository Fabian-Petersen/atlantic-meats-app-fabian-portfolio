type VerifiedLocationDisplay = {
  label: string;
  value: string;
};

export const formatVerifiedLocation = (
  location: unknown,
): VerifiedLocationDisplay | null => {
  if (typeof location === "string") {
    const value = location.trim();
    return value ? { label: "Location", value } : null;
  }

  if (!location || typeof location !== "object") return null;

  const value = location as Record<string, unknown>;
  const { latitude, longitude } = value;

  if (typeof latitude === "number" && typeof longitude === "number") {
    return {
      label: "GPS Coordinates",
      value: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }

  if (typeof value.location === "string" && value.location.trim()) {
    return { label: "Location", value: value.location.trim() };
  }

  return null;
};
