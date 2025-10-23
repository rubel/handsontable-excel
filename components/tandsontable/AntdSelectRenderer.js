"use client";

import { createRoot } from "react-dom/client";
import { Select } from "antd";
import Handsontable from "handsontable";

function AntdSelectCell({ value, options, onChange }) {
  return (
    <Select
      style={{ width: "100%" }}
      value={value}
      options={options}
      onChange={onChange}
      size="small"
      dropdownStyle={{ zIndex: 9999 }}
      variant={"outlined"}
      popupMatchSelectWidth={false}
      getPopupContainer={() => document.body}
    />
  );
}

export function antdSelectRenderer(
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
  td.appendChild(wrapper);

  const root = createRoot(wrapper);
  const options = (cellProperties.source || []).map((item) => ({
    label: item,
    value: item,
  }));
  const handleChange = (val) => instance.setDataAtCell(row, col, val);

  root.render(
    <AntdSelectCell value={value} options={options} onChange={handleChange} />
  );
  td._antdRoot = root;
  return td;
}

export function destroyAntdSelectRenderer(instance, td) {
  const root = td._antdRoot;
  if (root) {
    root.unmount();
    delete td._antdRoot;
  }
}
