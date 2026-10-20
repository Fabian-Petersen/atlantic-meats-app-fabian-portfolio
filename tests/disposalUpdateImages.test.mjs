import assert from "node:assert/strict";
import test from "node:test";

import { normalizeDeletedImageKeys } from "../src/utils/disposalUpdateImages.ts";

test("no deleted images produces an empty array", () => {
  assert.deepEqual(normalizeDeletedImageKeys(), []);
});

test("null deleted images are excluded", () => {
  assert.deepEqual(normalizeDeletedImageKeys([null]), []);
});

test("image metadata is converted to its key", () => {
  assert.deepEqual(
    normalizeDeletedImageKeys([{ key: "disposals/123/image.webp" }]),
    ["disposals/123/image.webp"],
  );
});

test("an existing key string is retained", () => {
  assert.deepEqual(normalizeDeletedImageKeys(["disposals/123/image.webp"]), [
    "disposals/123/image.webp",
  ]);
});

test("malformed and empty values are excluded", () => {
  assert.deepEqual(
    normalizeDeletedImageKeys([
      undefined,
      "",
      "   ",
      12,
      false,
      {},
      { key: null },
      { key: "   " },
    ]),
    [],
  );
});

test("keys are trimmed and duplicates are removed", () => {
  assert.deepEqual(
    normalizeDeletedImageKeys([
      " disposals/123/image.webp ",
      { key: "disposals/123/image.webp" },
      { key: " disposals/123/other.webp " },
    ]),
    ["disposals/123/image.webp", "disposals/123/other.webp"],
  );
});
