"use client";

import { useState, useEffect } from "react";
import { saveTexts } from "@/app/actions/texts";

const toTextsArray = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => String(item || "")).filter((item) => item.trim().length > 0);
  }

  if (data && typeof data === "object") {
    return Object.keys(data)
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
      .map((key) => String(data[key] || ""))
      .filter((item) => item.trim().length > 0);
  }

  return [];
};

const ensureEditableTexts = (textsArray) => {
  const safeTexts = Array.isArray(textsArray) ? [...textsArray] : [];

  if (safeTexts.length === 0 || safeTexts[safeTexts.length - 1].trim().length > 0) {
    safeTexts.push("");
  }

  return safeTexts;
};

export default function Texts({ initialData, isLoading, onSaveSuccess }) {
  const [phrases, setPhrases] = useState([""]);
  const [saving, setSaving] = useState(false);

  // Sincroniza com os dados vindos do Vercel Blob (via PainelPage)
  useEffect(() => {
    setPhrases(ensureEditableTexts(toTextsArray(initialData)));
  }, [initialData]);

  const handleChange = (index, value) => {
    setPhrases((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return ensureEditableTexts(updated);
    });
  };

  const removePhrase = (index) => {
    setPhrases((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      return ensureEditableTexts(updated);
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    const payload = phrases.map((item) => item.trim()).filter(Boolean);
    const result = await saveTexts(payload);

    if (result.success) {
      onSaveSuccess(result.data);
      setPhrases(ensureEditableTexts(result.data));
      alert("Textos rotativos atualizados com sucesso!");
    } else {
      alert("Erro ao atualizar: " + result.error);
    }
    setSaving(false);
  };

  if (isLoading) return <div className="p-10 animate-pulse text-gray-400 text-center">Carregando textos...</div>;

  return (
    <div className="pb-6">
      <div className="font-bold mb-2">TEXTOS ROTATIVOS</div>
      <div className="border border-(--logo2) rounded-sm p-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          {phrases.map((phrase, index) => {
            const isEmpty = phrase.trim().length === 0;

            return (
              <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={phrase}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
                placeholder={`Texto ${index + 1}`}
              />
              {!isEmpty && (
                <button
                  onClick={() => removePhrase(index)}
                  className="p-2 text-red-500 transition-colors hover:text-red-600"
                  title="Remover texto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
            );
          })}
        </div>
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className={`w-full md:w-max px-10 py-3 font-bold rounded-xl transition-all shadow-md ${
              saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-100"
            }`}
          >
            {saving ? "Salvando..." : "Atualizar Textos"}
          </button>
        </div>
      </div>
    </div>
  );
}