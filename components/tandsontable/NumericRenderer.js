// app/lib/antd-numeric-renderer.js
import React from "react";
import { createRoot } from "react-dom/client";

// Cache React roots per cell container
const rootCache = new WeakMap();

export function NumericCellRenderer(
  _instance,
  td,
  _row,
  _col,
  _prop,
  value,
  cellProperties
) {
  // --- 1. Reset cell ---
  td.innerHTML = "";
  td.style.textAlign = "right";
  td.style.padding = "0 8px";
  td.className = "htNumeric";

  const { min, max } = cellProperties || {};

  const isNumber = typeof value === "number" && !Number.isNaN(value);
  const isOutOfRange =
    isNumber &&
    ((typeof min === "number" && value < min) ||
      (typeof max === "number" && value > max));

  // --- 2. Invalid or out-of-range value ---
  if (!isNumber || isOutOfRange) {
    const tooltip = `Only number between ${min} & ${max} allowed`;

    td.style.background = "crimson";
    td.style.color = "white";
    td.style.fontWeight = "bold";
    td.textContent = value != null ? String(value) : "";
    td.title = tooltip;
    return td;
  }

  // --- 3. Create or reuse container ---
  let container = td.firstChild;
  if (!container) {
    container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "flex-end";
    td.appendChild(container);
  }

  // --- 4. Reuse or create React root ---
  let root = rootCache.get(container);
  if (!root) {
    root = createRoot(container);
    rootCache.set(container, root);
  }

  // --- 5. Render value with minimal React ---
  root.render(
    <div
      style={{
        width: "100%",
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  );

  return td;
}

// --- 6. Cleanup renderer on cell reuse ---
export function destroyNumericCellRenderer(td) {
  const container = td.firstChild;
  if (container) {
    const root = rootCache.get(container);
    if (root) {
      root.unmount();
      rootCache.delete(container);
    }
  }
  td.innerHTML = "";
}
