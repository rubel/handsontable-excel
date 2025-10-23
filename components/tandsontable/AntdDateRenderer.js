// components/AntdDatePickerRenderer.js
"use client";

import { createRoot } from "react-dom/client";
import { DatePicker } from "antd";
import Handsontable from "handsontable";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

function AntdDateCell({ value, onChange }) {
  // Accept both DD.MM.YYYY and YYYY-MM-DD
  const dateValue = value
    ? dayjs(value, ["DD.MM.YYYY", "YYYY-MM-DD"], true)
    : null;

  return (
    <DatePicker
      style={{ width: "100%" }}
      value={dateValue}
      onChange={(date) => {
        // Always store as YYYY-MM-DD
        const formatted = date ? date.format("YYYY-MM-DD") : null;
        onChange(formatted);
      }}
      format="DD.MM.YYYY" // Display format
      size="small"
      variant="borderless"
      getPopupContainer={() => document.body}
      dropdownStyle={{ zIndex: 9999 }}
    />
  );
}

export function antdDatePickerRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.dom.empty(td);

  const wrapper = document.createElement("div");
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  td.appendChild(wrapper);

  const root = createRoot(wrapper);

  const handleChange = (val) => {
    instance.setDataAtCell(row, col, val);
  };

  root.render(<AntdDateCell value={value} onChange={handleChange} />);
  td._antdRoot = root;
  return td;
}

export function destroyAntdDatePickerRenderer(instance, td) {
  const root = td._antdRoot;
  if (root) {
    root.unmount();
    delete td._antdRoot;
  }
}
