export const DEFAULT_PRODUCT_HIGHLIGHTS = [
  { id: "highlight-1", label: "Entrega nacional" },
  { id: "highlight-2", label: "Compra segura" },
  { id: "highlight-3", label: "Produto artesanal" },
  { id: "highlight-4", label: "Presenteavel" },
];

const createHighlightId = () =>
  `highlight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function normalizeProductHighlight(item, index = 0) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const id = String(item.id || item._id || `${createHighlightId()}-${index}`);
    const label = String(item.label || item.title || item.text || item.descricao || "")
      .trim();

    if (!label) {
      return null;
    }

    return { id, label };
  }

  const label = String(item || "").trim();
  if (!label) {
    return null;
  }

  return {
    id: `${createHighlightId()}-${index}`,
    label,
  };
}

export function normalizeProductHighlightsPayload(payload) {
  let items = [];

  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === "object") {
    if (Array.isArray(payload.items)) {
      items = payload.items;
    } else if (payload.data && Array.isArray(payload.data.items)) {
      items = payload.data.items;
    } else if (Array.isArray(payload.data)) {
      items = payload.data;
    }
  }

  const normalizedItems = items
    .map((item, index) => normalizeProductHighlight(item, index))
    .filter(Boolean);

  return normalizedItems.length ? normalizedItems : DEFAULT_PRODUCT_HIGHLIGHTS;
}

export function ensureEditableProductHighlights(items) {
  const safeItems = Array.isArray(items)
    ? items
        .filter(Boolean)
        .map((item) => ({
          id: String(item?.id || createHighlightId()),
          label: String(item?.label || "").trim(),
        }))
    : [];

  const lastItem = safeItems[safeItems.length - 1];

  if (!lastItem || lastItem.label.trim().length > 0) {
    safeItems.push({ id: createHighlightId(), label: "" });
  }

  return safeItems;
}

