"use client";
import Handsontable from "handsontable";

export function SelectRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td);

  const select = document.createElement("select");
  select.style.cssText = `
    width: 90%;
    height: 28px;          /* natural select height */
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 8px;
    box-sizing: border-box;
    font-size: 14px;
    cursor: pointer;
    background-color: #fff;
    color: #000;
  `;

  // Dark mode support
  const darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (darkMode) {
    select.style.backgroundColor = "#1e1e1e";
    select.style.color = "#fff";
    select.style.border = "1px solid #555";
  }

  const source = cellProperties.source || [];
  source.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  select.value = value ?? "";

  // Update Handsontable data on blur instead of change
  // This prevents Handsontable from replacing the select while choosing
  select.addEventListener("blur", () => {
    const newValue = select.value;
    if (instance.getDataAtCell(row, col) !== newValue) {
      instance.setDataAtCell(row, col, newValue);
    }
  });

  // Optional: open dropdown on focus
  select.addEventListener("mousedown", (e) => {
    e.stopPropagation(); // prevent Handsontable cell focus from interfering
  });

  td.appendChild(select);

  return td;
}

export function destroySelectRenderer(instance, td) {
  Handsontable.dom.empty(td);
}
