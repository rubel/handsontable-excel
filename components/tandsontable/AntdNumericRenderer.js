// app/lib/antd-numeric-renderer.js
import React from "react";
import { createRoot } from "react-dom/client";
import { InputNumber } from "antd";

// ---------------------------------------------------------------------
// React root cache – one root per cell container
// ---------------------------------------------------------------------
const rootCache = new WeakMap();

// ---------------------------------------------------------------------
// Renderer (called by Handsontable)
// ---------------------------------------------------------------------
export function AntdNumericRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  // ---- 1. Reset cell -------------------------------------------------
  td.innerHTML = "";
  td.style.textAlign = "right";
  td.style.padding = "0 8px";
  td.className = "htNumeric";

  // ---- 2. Accept **only numbers** ------------------------------------
  if (typeof value !== "number" || Number.isNaN(value)) {
    td.classList.add("htInvalid");
    return td;
  }

  // ---- 3. Formatting (numericFormat.pattern) -------------------------
  const numericFormat = cellProperties?.numericFormat;
  const decimals = numericFormat?.pattern
    ? (numericFormat.pattern.split(".")[1] || "").replace(/[^0]/g, "").length
    : 0;
  const culture = numericFormat?.culture || "en-US";

  // ---- 4. Container for React ----------------------------------------
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "flex-end";
  td.appendChild(container);

  // ---- 5. Reuse or create React root ---------------------------------
  let root = rootCache.get(container);
  if (!root) {
    root = createRoot(container);
    rootCache.set(container, root);
  }

  // ---- 6. Render AntD InputNumber (read-only) -------------------------
  root.render(
    React.createElement(InputNumber, {
      value,
      readOnly: true,
      bordered: false,
      controls: false,
      // formatter mirrors numericFormat
      formatter: (val) =>
        new Intl.NumberFormat(culture, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: true,
        }).format(val),

      style: {
        width: "100%",
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
        background: "transparent",
        boxShadow: "none",
        color: value < 0 ? "#ff4d4f" : undefined, // optional red for negatives
      },
    })
  );

  return td;
}

// ---------------------------------------------------------------------
// Destroyer – unmount React root when Handsontable re-uses the cell
// ---------------------------------------------------------------------
export function destroyNumericAntdRenderer(td) {
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
