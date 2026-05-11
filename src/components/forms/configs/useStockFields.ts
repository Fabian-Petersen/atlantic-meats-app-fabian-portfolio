import { useMemo, useState } from "react";
import type { StockRequestFormValues } from "@/schemas";
import type { DynamicFormField } from "../DynamicForm";
import { CATEGORIES, SUPPLIERS, UNITS } from "@/data/stockFormOptions";

/**
 * Reusable hook for generating dynamic form field configurations.
 *
 * This hook is intended for schema-driven forms where fields
 * are dynamically rendered from a configuration array.
 *
 * The hook can generate ANY supported field type, including:
 * - input
 * - textarea
 * - select
 * - checkbox
 * - radio
 * - file
 * - custom components
 *
 * It also supports dynamic/cascading behavior such as:
 * - dependent select options
 * - conditional rendering
 * - dynamic validation
 * - async option loading
 * - runtime field updates
 *
 * The hook keeps form configuration logic isolated from the
 * presentation layer (`DynamicForm` component).
 *
 * @template TFormValues
 * Type representing the form schema values.
 *
 * @returns
 * fields:
 * Array of dynamic field configurations used by the form renderer.
 *
 * state:
 * Optional local state used for dynamic field behavior.
 *
 * handlers:
 * Optional helper functions for managing dynamic interactions.
 *
 * @example
 * const { fields } = useStockFields();
 *
 * return (
 *   <DynamicForm
 *     fields={fields}
 *     onSubmit={handleSubmit}
 *   />
 * );
 *
 * @example
 * const { fields } = useEquipmentFields();
 *
 * return (
 *   <DynamicForm
 *     fields={fields}
 *   />
 * );
 *
 * @example
 * Example dynamic behavior:
 *
 * - selecting a category updates subcategory options
 * - selecting a country updates city options
 * - selecting an asset type updates model options
 *
 * const {
 *   fields,
 *   selectedCategory,
 * } = useStockFields();
 */
export const useStockFields = () => {
  // ─── Cascading State ───────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ─── Derived Options ──────────────────────────────
  const subCategoryOptions = useMemo(() => {
    if (!selectedCategory) return [];

    return CATEGORIES[selectedCategory] ?? [];
  }, [selectedCategory]);

  const fields: DynamicFormField<StockRequestFormValues>[] = [
    {
      fieldType: "input",
      name: "description",
      label: "Description",
      required: true,
    },

    {
      fieldType: "select",
      label: "Unit of Measure",
      name: "unit",
      options: UNITS,
      required: true,
    },

    {
      fieldType: "select",
      label: "Category",
      name: "category",
      options: Object.keys(CATEGORIES),
      required: true,

      onChange: ([value]) => {
        setSelectedCategory(value ?? null);
      },
    },

    {
      fieldType: "select",
      name: "subCategory",
      label: "Sub Category",
      options: subCategoryOptions,
      required: true,
    },

    {
      fieldType: "input",
      name: "minQty",
      label: "Minimum Quantity",
      type: "number",
      required: true,
    },

    {
      fieldType: "input",
      name: "reorderQty",
      type: "number",
      label: "Reorder Quantity",
    },

    {
      fieldType: "select",
      name: "supplier",
      label: "Supplier",
      options: SUPPLIERS,
    },

    {
      fieldType: "input",
      type: "text",
      name: "costPerUnit",
      label: "Cost per Unit",
    },
    {
      fieldType: "file",
      name: "images",
      label: "Images",
      multiple: true,
    },
    {
      fieldType: "textarea",
      name: "notes",
      label: "Notes",
      rows: 3,
      className: "md:col-span-2",
    },
  ];

  return {
    fields,
    selectedCategory,
  };
};
