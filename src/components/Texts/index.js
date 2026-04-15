"use client";

import { useEffect, useState } from "react";
import { saveTexts } from "@/app/actions/texts";

const createEmptyItem = () => ({ titulo: "", descricao: "" });

const normalizeTextItem = (item) => {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const titulo = String(item.titulo || item.title || "").trim();
    const descricao = String(item.descricao || item.description || item.texto || item.text || "").trim();

    if (!titulo && !descricao) {
      return null;
    }

    return { titulo, descricao };
  }

  const descricao = String(item || "").trim();

  if (!descricao) {
    return null;
  }

  return { titulo: "", descricao };
};

const extractTextItems = (data) => {
  if (Array.isArray(data)) {
    return data.map(normalizeTextItem).filter(Boolean);
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  if (Array.isArray(data.items)) {
    return data.items.map(normalizeTextItem).filter(Boolean);
  }

  if ("frases" in data) {
    const titulo = String(data.titulo || "").trim();

    return (Array.isArray(data.frases) ? data.frases : [])
      .map((descricao) => normalizeTextItem({ titulo, descricao }))
      .filter(Boolean);
  }

  return Object.keys(data)
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((key) => normalizeTextItem(data[key]))
    .filter(Boolean);
};

const ensureEditableItems = (items) => {
  const safeItems = Array.isArray(items)
    ? items.filter(Boolean).map((item) => ({
        titulo: String(item?.titulo || ""),
        descricao: String(item?.descricao || ""),
      }))
    : [];

  const lastItem = safeItems[safeItems.length - 1];

  if (!lastItem || lastItem.titulo.trim().length > 0 || lastItem.descricao.trim().length > 0) {
    safeItems.push(createEmptyItem());
  }

  return safeItems;
};

export default function Texts({ initialData, isLoading, onSaveSuccess }) {
  const [items, setItems] = useState([createEmptyItem()]);
  const [saving, setSaving] = useState(false);

  const hasContent = items.some(
    (item) => String(item?.titulo || "").trim() || String(item?.descricao || "").trim(),
  );

  useEffect(() => {
    setItems(ensureEditableItems(extractTextItems(initialData)));
  }, [initialData]);

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return ensureEditableItems(updated);
    });
  };

  const removeItem = (index) => {
    setItems((prev) => ensureEditableItems(prev.filter((_, itemIndex) => itemIndex !== index)));
  };

  const handleUpdate = async () => {
    setSaving(true);

    const payload = items
      .map((item) => ({
        titulo: String(item?.titulo || "").trim(),
        descricao: String(item?.descricao || "").trim(),
      }))
      .filter((item) => item.titulo || item.descricao);

    const result = await saveTexts({ items: payload });

    if (result.success) {
      onSaveSuccess(result.data);
      setItems(ensureEditableItems(extractTextItems(result.data)));
      alert("Textos rotativos atualizados com sucesso!");
    } else {
      alert("Erro ao atualizar: " + result.error);
    }

    setSaving(false);
  };

  if (isLoading) {
    return <div className="p-10 animate-pulse text-gray-400 text-center">Carregando textos...</div>;
  }

  return (
    <div className="relative pb-24">
      <div className="font-bold mb-2">TEXTOS ROTATIVOS</div>
      <div className="border border-(--logo2) rounded-sm p-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, index) => {
            const isEmpty = !item.titulo.trim() && !item.descricao.trim();

            return (
              <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    value={item.titulo}
                    onChange={(e) => handleChange(index, "titulo", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder={`Título ${index + 1}`}
                  />
                  <textarea
                    value={item.descricao}
                    onChange={(e) => handleChange(index, "descricao", e.target.value)}
                    className="min-h-28 w-full resize-y px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder={`Texto ${index + 1}`}
                  />
                </div>
                {!isEmpty && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 transition-colors hover:text-red-600"
                      title="Remover texto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-60 flex flex-col items-end gap-3 pointer-events-none">
        {saving && (
          <div className="bg-white px-4 py-2 rounded-full shadow-xl border text-[10px] font-bold text-blue-600 animate-bounce">
            A guardar alterações...
          </div>
        )}
        <button
          onClick={handleUpdate}
          disabled={saving || !hasContent}
          className={`pointer-events-auto w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
            saving || !hasContent
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-90"
          }`}
          title="Salvar textos"
        >
          {saving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}