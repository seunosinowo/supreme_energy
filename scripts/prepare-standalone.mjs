import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Next's standalone server needs these assets alongside the traced runtime.
const root = new URL("../", import.meta.url);
for (const [source, destination] of [
  ["public", ".next/standalone/public"],
  [".next/static", ".next/standalone/.next/static"],
]) {
  cpSync(fileURLToPath(new URL(source, root)), fileURLToPath(new URL(destination, root)), {
    recursive: true,
  });
}
