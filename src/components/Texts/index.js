"use client";

import { useState, useEffect } from "react";
import { saveTexts } from "@/app/actions/texts";

export default function Texts({ initialData, isLoading, onSaveSuccess }) {
  const [phrases, setPhrases] = useState({
    phrase1: "", phrase2: "", phrase3: "",
    phrase4: "", phrase5: "", phrase6: "",
  });
  const [saving, setSaving] = useState(false);

  // Sincroniza com os dados vindos do Vercel Blob (via PainelPage)
  useEffect(() => {
    if (initialData) {
      setPhrases(initialData);
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setPhrases((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    const result = await saveTexts(phrases);

    if (result.success) {
      onSaveSuccess(result.data);
      alert("Textos rotativos atualizados com sucesso!");
    } else {
      alert("Erro ao atualizar: " + result.error);
    }
    setSaving(false);
  };

  const inputs = [
    { id: "phrase1", label: "Frase 1" }, { id: "phrase2", label: "Frase 2" },
    { id: "phrase3", label: "Frase 3" }, { id: "phrase4", label: "Frase 4" },
    { id: "phrase5", label: "Frase 5" }, { id: "phrase6", label: "Frase 6" },
  ];

  if (isLoading) return <div className="p-10 animate-pulse text-gray-400 text-center">Carregando textos...</div>;

  return (
    <div className="pb-6">
      <div className="font-bold mb-2">TEXTOS ROTATIVOS (6 FRASES)</div>
      <div className="border border-[var(--logo2)] rounded-sm p-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inputs.map((input) => (
            <div key={input.id}>
              <label className="font-bold text-sm text-gray-700 block mb-1">{input.label}</label>
              <input
                type="text"
                value={phrases[input.id] || ""}
                onChange={(e) => handleChange(input.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
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