import { useEffect, useRef } from "react";

interface Params {
  location: string | undefined;

  validity: {
    area: boolean;
    equipment: boolean;
    assetID: boolean;
  };

  resetArea: () => void;
  resetEquipment: () => void;
  resetAssetID: () => void;

  /**
   * Fired whenever `location` changes to a different value.
   * Should clear area, equipment, assetID, and any assetID-adjacent
   * fields (e.g. the unidentified-asset reason fields).
   */
  resetAll: () => void;
}

export const useAssetFilterReset = ({
  location,
  validity,
  resetArea,
  resetEquipment,
  resetAssetID,
  resetAll,
}: Params) => {
  // $ ─── Hard reset on location change ───────────────────────────────
  const previousLocation = useRef(location);

  useEffect(() => {
    if (previousLocation.current !== location) {
      resetAll();
      previousLocation.current = location;
    }
  }, [location, resetAll]);

  // $ ─── Existing per-field validity resets ──────────────────────────
  useEffect(() => {
    if (!validity.area) resetArea();
  }, [validity.area, resetArea]);

  useEffect(() => {
    if (!validity.equipment) resetEquipment();
  }, [validity.equipment, resetEquipment]);

  useEffect(() => {
    if (!validity.assetID) resetAssetID();
  }, [validity.assetID, resetAssetID]);
};
