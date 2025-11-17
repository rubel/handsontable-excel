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
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 14px;
    padding: 0 8px;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
  `;

  const source = cellProperties.source || [];
  source.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  select.value = value ?? "";

  select.addEventListener("change", () => {
    const newValue = select.value;
    if (instance.getDataAtCell(row, col) !== newValue) {
      instance.setDataAtCell(row, col, newValue);
    }
  });

  td.addEventListener(
    "mousedown",
    (e) => {
      e.preventDefault();
      select.focus();
      setTimeout(() => select.click(), 0);
    },
    { once: true }
  );

  td.appendChild(select);
  return td;
}

export function destroySelectRenderer(instance, td) {
  Handsontable.dom.empty(td);
}
