"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import { Select } from "antd";
import Handsontable from "handsontable";

// Cache React roots per <td>
const rootCache = new WeakMap();

// -------------------------------------------------------------------
// React component for AntD Select inside Handsontable cell
// -------------------------------------------------------------------
function AntdSelectCell({ value, options, onChange }) {
  return (
    <Select
      value={value}
      options={options}
      onChange={onChange}
      size="small"
      style={{ width: "100%" }}
      popupMatchSelectWidth={false}
      getPopupContainer={() => document.body}
      // ✅ modern way: replaces deprecated dropdownStyle
      styles={{
        popup: {
          zIndex: 9999,
        },
      }}
    />
  );
}

// -------------------------------------------------------------------
// Renderer function for Handsontable
// -------------------------------------------------------------------
export function antdSelectRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  // --- 1. Reset & style the cell ---
  Handsontable.dom.empty(td);
  td.style.padding = "0";
  td.style.overflow = "visible"; // important for dropdown visibility

  // --- 2. Create or reuse container ---
  let container = td.firstChild;
  if (!container || container.nodeType !== 1) {
    container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    td.appendChild(container);
  }

  // --- 3. Reuse or create React root ---
  let root = rootCache.get(td);
  if (!root) {
    root = createRoot(container);
    rootCache.set(td, root);
  }

  // --- 4. Prepare select options ---
  const options = (cellProperties.source || []).map((item) => ({
    label: item,
    value: item,
  }));

  // --- 5. Update handler ---
  const handleChange = (val) => {
    // avoid redundant updates
    if (instance.getDataAtCell(row, col) !== val) {
      instance.setDataAtCell(row, col, val);
    }
  };

  // --- 6. Render the React Select component ---
  root.render(
    <AntdSelectCell value={value} options={options} onChange={handleChange} />
  );

  return td;
}

// -------------------------------------------------------------------
// Destroyer – unmount React root on cell cleanup
// -------------------------------------------------------------------
export function destroyAntdSelectRenderer(_instance, td) {
  const root = rootCache.get(td);
  if (root) {
    root.unmount();
    rootCache.delete(td);
  }
  td.innerHTML = "";
}
