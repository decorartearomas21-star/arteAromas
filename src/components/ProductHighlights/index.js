'use client';

import { useEffect, useMemo, useState, startTransition } from "react";
import { saveProductHighlights } from "@/app/actions/productHighlights";
import {
  DEFAULT_PRODUCT_HIGHLIGHTS,
  ensureEditableProductHighlights,
  normalizeProductHighlight,
  normalizeProductHighlightsPayload,
} from "@/lib/product-highlights";

const createEmptyHighlight = () => ({
  id: `highlight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: "",
});

const extractHighlightItems = (data) => normalizeProductHighlightsPayload(data);

const buildPayload = (sourceItems) =>
  sourceItems
    .map((item) => normalizeProductHighlight(item))
    .filter(Boolean)
    .map((item) => ({
      id: String(item.id),
      label: String(item.label).trim(),
    }));

const buildComparablePayload = (sourceItems) =>
  sourceItems
    .map((item) => normalizeProductHighlight(item))
    .filter(Boolean)
    .map((item) => ({
      label: String(item.label).trim(),
    }));

export default function ProductHighlights({ initialData, isLoading, onSaveSuccess }) {
  const [items, setItems] = useState([createEmptyHighlight()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const normalized = extractHighlightItems(initialData);
      setItems(
        ensureEditableProductHighlights(
          normalized.length ? normalized : DEFAULT_PRODUCT_HIGHLIGHTS,
        ),
      );
    });
  }, [initialData]);

  const hasChanges = useMemo(() => {
    const normalizedCurrent = buildComparablePayload(items);
    const normalizedInitial = buildComparablePayload(
      extractHighlightItems(initialData).length
        ? extractHighlightItems(initialData)
        : DEFAULT_PRODUCT_HIGHLIGHTS,
    );

    return JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedInitial);
  }, [items, initialData]);

  const persistItems = async (nextItems, successMessage) => {
    setSaving(true);

    const payload = buildPayload(nextItems);
    const result = await saveProductHighlights({ items: payload });

    if (result.success) {
      const nextData = result.data || [];
      onSaveSuccess?.(nextData);
      setItems(ensureEditableProductHighlights(nextData));

      if (successMessage) {
        alert(successMessage);
      }
    } else {
      alert("Erro ao atualizar: " + result.error);
    }

    setSaving(false);
  };

  const handleChange = (index, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        label: value,
      };

      return ensureEditableProductHighlights(updated);
    });
  };

  const removeItem = async (index) => {
    const nextItems = ensureEditableProductHighlights(items.filter((_, itemIndex) => itemIndex !== index));
    setItems(nextItems);
    await persistItems(nextItems);
  };

  const handleUpdate = async () => {
    await persistItems(items, "Destaques da página do produto atualizados com sucesso!");
  };

  if (isLoading) {
    return <div className="p-10 animate-pulse text-gray-400 text-center">Carregando destaques...</div>;
  }

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-bold uppercase tracking-wide text-gray-600 text-sm">
            Destaques da página do produto
          </div>
          <p className="mt-1 text-xs text-gray-500">
            O que for ajustado aqui aparece em todas as páginas de produto.
          </p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={!hasChanges || saving}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide transition-all ${
            hasChanges && !saving
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              : "cursor-not-allowed bg-gray-200 text-gray-500"
          }`}
          title="Salvar destaques"
        >
          {saving ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
          <span>{saving ? "Salvando..." : "Salvar"}</span>
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, index) => {
            const isEmpty = !item.label.trim();

            return (
              <div key={item.id || index} className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wide text-gray-400">
                  Destaque {index + 1}
                </label>
                <div className="flex items-start gap-3">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    placeholder={`Ex: ${
                      index < DEFAULT_PRODUCT_HIGHLIGHTS.length
                        ? DEFAULT_PRODUCT_HIGHLIGHTS[index].label
                        : "Novo destaque"
                    }`}
                  />
                  {!isEmpty && (
                    <button
                      onClick={() => removeItem(index)}
                      disabled={saving}
                      className="p-2 text-red-500 transition-colors hover:text-red-600"
                      title="Remover destaque"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
