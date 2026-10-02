import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronDown,
  PackagePlus,
  Plus,
  ReceiptText,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import {
  get,
  useFieldArray,
  useWatch,
  type FieldError,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

import FormRowInput from "@/../customComponents/FormRowInput";
import { cn } from "@/lib/utils";
import type { ActionRequestFormValues } from "@/schemas";
import { motionVariants } from "@/styles/motionStyles";
import { sharedStyles } from "@/styles/shared";

type ExpenseKind = "part_items" | "sundry_items";

type ExpenseConfig = {
  name: ExpenseKind;
  singular: string;
  plural: string;
  descriptionLabel: string;
  icon: LucideIcon;
};

const EXPENSE_CONFIGS: ExpenseConfig[] = [
  {
    name: "part_items",
    singular: "Part",
    plural: "Parts",
    descriptionLabel: "Part / Material Description",
    icon: Wrench,
  },
  {
    name: "sundry_items",
    singular: "Sundry",
    plural: "Sundries",
    descriptionLabel: "Sundry Description",
    icon: ReceiptText,
  },
];

function AddExpenseButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs transition-all hover:cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:border-emerald-400/45 dark:hover:bg-emerald-400/15"
    >
      <span className="relative flex size-6 items-center justify-center rounded-md bg-emerald-500 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-emerald-400 dark:text-gray-950">
        <PackagePlus className="size-3.5" aria-hidden="true" />
        <Plus
          className="absolute -right-1 -top-1 size-3 rounded-full bg-white p-0.5 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-gray-900 dark:text-emerald-300"
          aria-hidden="true"
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

function SectionHeader({
  title,
  number,
  summary,
  isOpen,
  icon: Icon,
  onToggle,
  onRemove,
}: {
  title: string;
  number?: number;
  summary: string;
  isOpen: boolean;
  icon: LucideIcon;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-t-md px-3 py-3 transition-colors sm:px-4",
        isOpen
          ? "bg-gray-50/80 dark:bg-gray-800/35"
          : "hover:bg-gray-50/70 dark:hover:bg-gray-800/25",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </span>
            {number !== undefined && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-gray-900 px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-white dark:bg-gray-100 dark:text-gray-900">
                {number}
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
            {summary}
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors group-hover:bg-white group-hover:text-gray-700 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-200">
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${title.toLowerCase()}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function ExpenseSection({
  form,
  config,
  fields,
  values,
  openIndex,
  setOpenIndex,
  remove,
}: {
  form: UseFormReturn<ActionRequestFormValues>;
  config: ExpenseConfig;
  fields: { id: string }[];
  values: { description: string; cost: string }[];
  openIndex: number;
  setOpenIndex: React.Dispatch<React.SetStateAction<number>>;
  remove: (index: number) => void;
}) {
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const isOpen = openIndex === index;
        const descriptionPath =
          `${config.name}.${index}.description` as Path<ActionRequestFormValues>;
        const costPath =
          `${config.name}.${index}.cost` as Path<ActionRequestFormValues>;
        const descriptionError = get(
          form.formState.errors,
          descriptionPath,
        ) as FieldError | undefined;
        const costError = get(
          form.formState.errors,
          costPath,
        ) as FieldError | undefined;
        const summary = values[index]?.description?.trim()
          ? `${values[index].description} · R ${values[index].cost || "0"}`
          : `${config.singular} details not completed`;

        return (
          <div
            key={field.id}
            className={cn(sharedStyles.formInputDefault, "px-0 py-0")}
          >
            <SectionHeader
              title={config.singular}
              number={index + 1}
              summary={summary}
              isOpen={isOpen}
              icon={Icon}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? -1 : index))
              }
              onRemove={() => {
                remove(index);
                setOpenIndex((current) => {
                  if (current === index) return Math.max(-1, index - 1);
                  if (current > index) return current - 1;
                  return current;
                });
              }}
            />
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  variants={motionVariants.expandable}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 px-3 py-4 md:grid-cols-2 md:px-4">
                    <FormRowInput
                      name={descriptionPath}
                      label={config.descriptionLabel}
                      register={form.register}
                      control={form.control}
                      error={descriptionError}
                      required
                      className="mb-0"
                    />
                    <FormRowInput
                      name={costPath}
                      label={`Cost: ${config.singular}`}
                      type="number"
                      min="0"
                      step="0.01"
                      register={form.register}
                      control={form.control}
                      error={costError}
                      required
                      className="mb-0"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function ActionExpenseFields({
  form,
}: {
  form: UseFormReturn<ActionRequestFormValues>;
}) {
  const [openPartIndex, setOpenPartIndex] = useState(-1);
  const [openSundryIndex, setOpenSundryIndex] = useState(-1);
  const [contractorOpen, setContractorOpen] = useState(true);

  const parts = useFieldArray({ control: form.control, name: "part_items" });
  const sundries = useFieldArray({
    control: form.control,
    name: "sundry_items",
  });
  const partValues =
    useWatch({ control: form.control, name: "part_items" }) ?? [];
  const sundryValues =
    useWatch({ control: form.control, name: "sundry_items" }) ?? [];
  const contractorEnabled = useWatch({
    control: form.control,
    name: "contractor_enabled",
  });
  const contractorName = useWatch({
    control: form.control,
    name: "contractor",
  });

  return (
    <div className="col-span-2 space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <AddExpenseButton
          label="Add Part"
          onClick={() => {
            parts.append({ description: "", cost: "" });
            setOpenPartIndex(parts.fields.length);
          }}
        />
        <AddExpenseButton
          label="Add Sundry"
          onClick={() => {
            sundries.append({ description: "", cost: "" });
            setOpenSundryIndex(sundries.fields.length);
          }}
        />
        <AddExpenseButton
          label="Add Contractor"
          disabled={contractorEnabled}
          onClick={() => {
            form.setValue("contractor_enabled", true, { shouldDirty: true });
            setContractorOpen(true);
          }}
        />
      </div>

      {EXPENSE_CONFIGS.map((config) => (
        <ExpenseSection
          key={config.name}
          form={form}
          config={config}
          fields={
            config.name === "part_items" ? parts.fields : sundries.fields
          }
          values={
            config.name === "part_items" ? partValues : sundryValues
          }
          openIndex={
            config.name === "part_items" ? openPartIndex : openSundryIndex
          }
          setOpenIndex={
            config.name === "part_items"
              ? setOpenPartIndex
              : setOpenSundryIndex
          }
          remove={config.name === "part_items" ? parts.remove : sundries.remove}
        />
      ))}

      {contractorEnabled && (
        <div className={cn(sharedStyles.formInputDefault, "px-0 py-0")}>
          <SectionHeader
            title="Contractor"
            summary={contractorName?.trim() || "Contractor details not completed"}
            isOpen={contractorOpen}
            icon={BriefcaseBusiness}
            onToggle={() => setContractorOpen((current) => !current)}
            onRemove={() => {
              form.setValue("contractor_enabled", false, { shouldDirty: true });
              form.setValue("contractor", "", { shouldDirty: true });
              form.setValue("total_cost_contractor", "", {
                shouldDirty: true,
              });
              form.clearErrors(["contractor", "total_cost_contractor"]);
            }}
          />
          <AnimatePresence initial={false}>
            {contractorOpen && (
              <motion.div
                variants={motionVariants.expandable}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden"
              >
                <div className="grid gap-4 px-3 py-4 md:grid-cols-2 md:px-4">
                  <FormRowInput
                    name="contractor"
                    label="Contractor Name"
                    register={form.register}
                    control={form.control}
                    error={form.formState.errors.contractor}
                    required
                    className="mb-0"
                  />
                  <FormRowInput
                    name="total_cost_contractor"
                    label="Cost: Contractor"
                    type="number"
                    min="0"
                    step="0.01"
                    register={form.register}
                    control={form.control}
                    error={form.formState.errors.total_cost_contractor}
                    required
                    className="mb-0"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
