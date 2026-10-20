export type DisposalUpdateImage = {
  key: string;
  filename: string;
  url: string;
};

const nonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed || undefined;
};

const objectValue = (
  value: Record<string, unknown>,
  properties: string[],
) => {
  for (const property of properties) {
    const candidate = nonEmptyString(value[property]);
    if (candidate) return candidate;
  }

  return undefined;
};

/**
 * Convert the mixed deleted-image state used by update forms into the exact
 * string-array shape required by the disposal API.
 */
export const normalizeDeletedImageKeys = (values: readonly unknown[] = []) => {
  const keys = values.flatMap((value) => {
    const key =
      nonEmptyString(value) ??
      (value !== null && typeof value === "object"
        ? nonEmptyString((value as Record<string, unknown>).key)
        : undefined);

    return key ? [key] : [];
  });

  return [...new Set(keys)];
};

/**
 * Disposal responses have used a few names for their signed display URL.
 * Normalize those runtime responses before passing them to the shared gallery.
 */
export const normalizeDisposalUpdateImages = (
  values: readonly unknown[] = [],
): DisposalUpdateImage[] =>
  values.flatMap((value) => {
    if (value === null || typeof value !== "object") return [];

    const image = value as Record<string, unknown>;
    const key = objectValue(image, ["key", "image_key", "s3_key"]);
    const url = objectValue(image, [
      "url",
      "image_url",
      "presigned_url",
      "signed_url",
    ]);

    if (!key || !url) return [];

    const filename =
      objectValue(image, ["filename", "name"]) ??
      key.split("/").filter(Boolean).at(-1) ??
      "Image";

    return [{ key, filename, url }];
  });
