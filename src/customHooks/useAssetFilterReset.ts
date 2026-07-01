import { useEffect } from "react";

interface Params {
  validity: {
    area: boolean;
    equipment: boolean;
    assetID: boolean;
  };

  resetArea: () => void;
  resetEquipment: () => void;
  resetAssetID: () => void;
}

export const useAssetFilterReset = ({
  validity,
  resetArea,
  resetEquipment,
  resetAssetID,
}: Params) => {
  useEffect(() => {
    if (!validity.area) {
      resetArea();
    }
  }, [validity.area, resetArea]);

  useEffect(() => {
    if (!validity.equipment) {
      resetEquipment();
    }
  }, [validity.equipment, resetEquipment]);

  useEffect(() => {
    if (!validity.assetID) {
      resetAssetID();
    }
  }, [validity.assetID, resetAssetID]);
};
