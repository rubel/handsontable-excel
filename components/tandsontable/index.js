"use client";

import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

import { useRef, useState } from "react";
import { tableData, tableHeaders } from "./data";

registerAllModules();

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

  title: {
    margin: "0 0 8px 0",
    fontSize: "2.5rem",
    fontWeight: 800,
    background: "linear-gradient(90deg, #667eea, #ff0000)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#64748b",
    fontWeight: 500,
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
