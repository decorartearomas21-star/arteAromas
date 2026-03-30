"use client";

import { useState } from "react";

export default function Texts() {
  // Centralizando as frases em um único objeto para facilitar o envio
  const [phrases, setPhrases] = useState({
    phrase1: "",
    phrase2: "",
    phrase3: "",
    phrase4: "",
    phrase5: "",
    phrase6: "",
  });

  const handleChange = (key, value) => {
    setPhrases((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdate = () => {
    console.log("Enviando textos:", phrases);
    alert("Textos rotativos atualizados!");
  };

  // Array auxiliar para renderizar os inputs em pares (grid)
  const inputs = [
    { id: "phrase1", label: "Frase 1" },
    { id: "phrase2", label: "Frase 2" },
    { id: "phrase3", label: "Frase 3" },
    { id: "phrase4", label: "Frase 4" },
    { id: "phrase5", label: "Frase 5" },
    { id: "phrase6", label: "Frase 6" },
  ];

  return (
    <div className="pb-6">
      <div className="font-bold mb-2">TEXTOS ROTATIVOS (6 FRASES)</div>
      
      <div className="border border-[var(--logo2)] rounded-sm p-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inputs.map((input) => (
            <div key={input.id} className="w-full">
              <label className="font-bold text-sm text-gray-700 block mb-1">
                {input.label}
              </label>
              <input
                type="text"
                value={phrases[input.id]}
                onChange={(e) => handleChange(input.id, e.target.value)}
                placeholder={input.label}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Botão de Ação */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            className="w-full md:w-max px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100"
          >
            Atualizar Textos
          </button>
        </div>
      </div>
    </div>
  );
}