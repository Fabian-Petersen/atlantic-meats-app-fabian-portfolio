import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import { MapPin, Wrench, Factory } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssetTableRow } from "@/schemas";

type MobileAssetFilterToolbarProps = {
  table: Table<AssetTableRow>;
  locations: string[];
  areas: string[];
  equipment: string[];
};

type FilterOption = {
  value: string;
  label: string;
};

const ALL_OPTIONS_VALUE = "__all__";

const titleCase = (value: string) =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

function CompactSelect({
  ariaLabel,
  value,
  onChange,
  options,
  icon,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon: ReactNode;
}) {
  return (
    <Select
      value={value || ALL_OPTIONS_VALUE}
      onValueChange={(selectedValue) =>
        onChange(selectedValue === ALL_OPTIONS_VALUE ? "" : selectedValue)
      }
    >
      <SelectTrigger
        aria-label={ariaLabel}
        title={ariaLabel}
        className="h-9 w-full min-w-0 rounded-xl border-slate-200 bg-slate-50/80 px-2.5 text-xs font-medium text-slate-700 shadow-sm hover:border-amber-300 hover:bg-primary/10 focus-visible:border-amber-400 focus-visible:ring-primary/25 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-amber-600 dark:hover:bg-primary/15"
      >
        <span className="shrink-0 text-amber-600 dark:text-amber-400">
          {icon}
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align="start"
        sideOffset={6}
        className="max-h-72 max-w-[calc(100vw-2rem)] rounded-xl border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer rounded-lg py-2 text-xs capitalize focus:bg-primary/15 dark:focus:bg-primary/20"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MobileAssetFilterToolbar({
  table,
  locations,
  areas,
  equipment,
}: MobileAssetFilterToolbarProps) {
  const locationColumn = table.getColumn("location");
  const areaColumn = table.getColumn("area");
  const equipmentColumn = table.getColumn("equipment");
  const selectedLocation =
    (locationColumn?.getFilterValue() as string | undefined) ?? "";
  const selectedArea =
    (areaColumn?.getFilterValue() as string | undefined) ?? "";

  const availableAreas = selectedLocation
    ? Array.from(
        new Set(
          table
            .getCoreRowModel()
            .rows.filter((row) => row.original.location === selectedLocation)
            .map((row) => row.original.area)
            .filter(
              (area): area is string =>
                typeof area === "string" && area.trim().length > 0,
            ),
        ),
      ).sort((a, b) => a.localeCompare(b))
    : areas;

  const availableEquipment =
    selectedLocation || selectedArea
      ? Array.from(
          new Set(
            table
              .getCoreRowModel()
              .rows.filter(
                (row) =>
                  (!selectedLocation ||
                    row.original.location === selectedLocation) &&
                  (!selectedArea || row.original.area === selectedArea),
              )
              .map((row) => row.original.equipment)
              .filter(
                (item): item is string =>
                  typeof item === "string" && item.trim().length > 0,
              ),
          ),
        ).sort((a, b) => a.localeCompare(b))
      : equipment;

  const updateFilter = (column: typeof locationColumn, value: string) => {
    column?.setFilterValue(value || undefined);
    table.setPageIndex(0);
  };

  const locationOptions: FilterOption[] = [
    { value: ALL_OPTIONS_VALUE, label: "All Locations" },
    ...locations.map((location) => ({
      value: location,
      label: titleCase(location),
    })),
  ];

  const areaOptions: FilterOption[] = [
    { value: ALL_OPTIONS_VALUE, label: "All Areas" },
    ...availableAreas.map((area) => ({
      value: area,
      label: titleCase(area),
    })),
  ];

  const equipmentOptions: FilterOption[] = [
    { value: ALL_OPTIONS_VALUE, label: "All Equipment" },
    ...availableEquipment.map((item) => ({
      value: item,
      label: titleCase(item),
    })),
  ];

  const updateLocationFilter = (value: string) => {
    const selectedEquipment = equipmentColumn?.getFilterValue();
    const isAreaAvailable =
      !selectedArea ||
      !value ||
      table
        .getCoreRowModel()
        .rows.some(
          (row) =>
            row.original.location === value &&
            row.original.area === selectedArea,
        );

    if (!isAreaAvailable) areaColumn?.setFilterValue(undefined);

    if (value && typeof selectedEquipment === "string" && selectedEquipment) {
      const isEquipmentAvailable = table
        .getCoreRowModel()
        .rows.some(
          (row) =>
            row.original.location === value &&
            (!isAreaAvailable ||
              !selectedArea ||
              row.original.area === selectedArea) &&
            row.original.equipment === selectedEquipment,
        );

      if (!isEquipmentAvailable) equipmentColumn?.setFilterValue(undefined);
    }

    updateFilter(locationColumn, value);
  };

  const updateAreaFilter = (value: string) => {
    const selectedEquipment = equipmentColumn?.getFilterValue();

    if (value && typeof selectedEquipment === "string" && selectedEquipment) {
      const isEquipmentAvailable = table
        .getCoreRowModel()
        .rows.some(
          (row) =>
            (!selectedLocation || row.original.location === selectedLocation) &&
            row.original.area === value &&
            row.original.equipment === selectedEquipment,
        );

      if (!isEquipmentAvailable) equipmentColumn?.setFilterValue(undefined);
    }

    updateFilter(areaColumn, value);
  };

  return (
    <div
      className="grid grid-cols-3 gap-2 py-2"
      aria-label="Asset list options"
    >
      <CompactSelect
        ariaLabel="Filter by location"
        value={selectedLocation}
        onChange={updateLocationFilter}
        options={locationOptions}
        icon={<MapPin className="size-3.5" aria-hidden="true" />}
      />

      <CompactSelect
        ariaLabel="Filter by area"
        value={selectedArea}
        onChange={updateAreaFilter}
        options={areaOptions}
        icon={<Factory className="size-3.5" aria-hidden="true" />}
      />

      <CompactSelect
        ariaLabel="Filter by equipment"
        value={(equipmentColumn?.getFilterValue() as string) ?? ""}
        onChange={(value) => updateFilter(equipmentColumn, value)}
        options={equipmentOptions}
        icon={<Wrench className="size-3.5" aria-hidden="true" />}
      />
    </div>
  );
}
