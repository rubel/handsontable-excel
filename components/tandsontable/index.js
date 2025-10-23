"use client";

import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";

import { useRef, useState } from "react";
import { colWidths, tableData, tableHeaders } from "./data";
import {
  antdSelectRenderer,
  destroyAntdSelectRenderer,
} from "./AntdSelectRenderer";
import {
  antdDatePickerRenderer,
  destroyAntdDatePickerRenderer,
} from "./AntdDateRenderer";
import {
  AntdNumericRenderer,
  destroyNumericAntdRenderer,
} from "./AntdNumericRenderer";

registerAllModules();

export const columnSettings = [
  {
    data: "equipmentNo",
    type: "numeric",
    allowInvalid: false,
  },
  { data: "assetCode" },
  {
    data: "systemStatus",
    type: "dropdown",
    source: ["Active", "Mark Deleted"],
    strict: true,
    allowInvalid: false,
    renderer: antdSelectRenderer,
    destroyRenderer: destroyAntdSelectRenderer,
  },
  { data: "functionalLocation" },
  { data: "partnerID" },
  { data: "cCSSuperiorEquipmentNo" },
  { data: "cCSSuperiorEquipmentTechnicalIDNo" },
  { data: "technicalIDNo" },
  { data: "authorizationGroup" },
  { data: "plannerGroup" },
  { data: "mainWorkCentre" },
  { data: "division" },
  {
    data: "startUpDate",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  { data: "manufacturer" },
  { data: "manufacturerCountryOrRegion" },
  { data: "modelNo" },
  { data: "manufacturerSerialNo" },
  { data: "acquisitionValue" },
  { data: "currency" },
  {
    data: "acquisitionDate",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  { data: "inventoryNo" },
  { data: "roomOrFloor" },
  { data: "assetTagNo" },
  { data: "zoneTagNo" },
  { data: "userStatus" },
  {
    data: "customerWarrantyStart",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  {
    data: "customerWarrantyEnd",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  {
    data: "vendorWarrantyStart",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  {
    data: "vendorWarrantyEnd",
    type: "date",
    dateFormat: "DD.MM.YYYY",
    correctFormat: true,
    renderer: antdDatePickerRenderer,
    destroyRenderer: destroyAntdDatePickerRenderer,
  },
  { data: "equipmentLongText" },
  { data: "equipmentDescription" },
  { data: "make" },
  {
    data: "quantity",
    type: "numeric",
    renderer: AntdNumericRenderer,
    destroyRenderer: destroyNumericAntdRenderer,
  },
  { data: "equipmentLocation" },
  {
    data: "motor",
    type: "dropdown",
    source: ["AC MOTOR", "DC MOTOR"],
    strict: true,
    allowInvalid: false,
    renderer: antdSelectRenderer,
    destroyRenderer: destroyAntdSelectRenderer,
  },
  {
    data: "coolingCapacitykW",
    type: "numeric",
    renderer: AntdNumericRenderer,
    destroyRenderer: destroyNumericAntdRenderer,
  },
];

export default function HandsontableDemo() {
  const hotRef = useRef(null);
  const [data, setData] = useState(tableData);

  const handleAfterChange = (changes) => {
    if (!changes) return;
    const newData = [...data];
    changes.forEach(([row, col, , newVal]) => {
      newData[row][col] = newVal;
    });
    setData(newData);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <HotTable
          ref={hotRef}
          data={data}
          colWidths={colWidths}
          colHeaders={tableHeaders}
          rowHeaders={true}
          licenseKey="non-commercial-and-evaluation"
          stretchH="all"
          autoColumnSize={true}
          dragToScroll
          filters={true}
          dropdownMenu={[
            "alignment",
            "filter_by_condition",
            "filter_by_value",
            "filter_operators",
            "filter_action_bar",
          ]}
          columnSorting={{
            indicator: true,
            headerAction: true,
            sortEmptyCells: true,
          }}
          multiColumnSorting={true}
          afterChange={handleAfterChange}
          settings={{
            colHeaderClassName: "ht-header",
            rowHeaderClassName: "ht-row-header",
            className: "ht-table",
          }}
          columns={columnSettings}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)",
    padding: "32px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  header: {
    marginBottom: "28px",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    boxShadow: `
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 8px 10px -6px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    overflow: "hidden",
    height: "calc(100vh - 180px)",
  },
};
