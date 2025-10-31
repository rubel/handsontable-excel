import { createRoot } from "react-dom/client";

const rootCache = new WeakMap();

export function StringCellRenderer(
  _instance,
  td,
  _row,
  _col,
  _prop,
  value,
  cellProperties
) {
  td.style.textAlign = "left";
  td.style.padding = "0 8px";
  td.className = "htString";

  const { min, max } = cellProperties || {};
  const isString = typeof value === "string";
  const length = isString ? value.length : 0;
  const isInvalid =
    !isString ||
    (typeof min === "number" && length < min) ||
    (typeof max === "number" && length > max);

  // --- Invalid value ---
  if (isInvalid) {
    const tooltip = `Minimum: ${min ?? "N/A"}, Maximum: ${
      max ?? "N/A"
    } character${(min || max) > 1 ? "s" : ""} allowed`;

    td.style.background = "crimson";
    td.style.color = "white";
    td.style.fontWeight = "bold";
    td.textContent = value != null ? String(value) : "";
    td.title = tooltip;

    // ✅ Remove any previously mounted React root for safety
    const prevContainer = td.firstChild;
    if (prevContainer) {
      const prevRoot = rootCache.get(prevContainer);
      if (prevRoot) {
        prevRoot.unmount();
        rootCache.delete(prevContainer);
      }
    }

    return td;
  }

  // --- Valid value ---
  td.style.background = "";
  td.style.color = "";
  td.style.fontWeight = "";
  td.title = "";

  // --- Ensure valid container ---
  let container = td.firstChild;
  if (!container || !(container instanceof HTMLElement)) {
    container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "flex-start";
    td.innerHTML = "";
    td.appendChild(container);
  }

  // --- Reuse or create React root safely ---
  let root = rootCache.get(container);
  if (!root) {
    root = createRoot(container);
    rootCache.set(container, root);
  }

  root.render(
    <div
      style={{
        width: "100%",
        textAlign: "left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value}
    </div>
  );

  return td;
}

export function destroyStringCellRenderer(td) {
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
