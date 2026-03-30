import Image from "next/image";
import { useState } from "react";

const Banner = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const handleSave = () => {
    // Aqui você adiciona a lógica para salvar no banco de dados ou API
    console.log("Salvando Banner:", { title, subTitle });
    alert("Banner atualizado com sucesso!");
  };

  return (
    <div className="pb-6">
      <div className="font-bold mb-2">GESTÃO DO BANNER PRINCIPAL</div>
      
      <div className="border border-[var(--logo2)] rounded-sm flex flex-col pb-4 gap-4">
        <div>
          <Image
            src="/banner.jpg"
            alt="banner"
            width={1000}
            height={20}
            priority
            className="w-full lg:w-[800px] object-cover object-center fade"
          />
        </div>

        <div className="px-4 space-y-4">
          {/* Input Título */}
          <div>
            <label className="font-bold block mb-1">Título banner</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input Subtítulo */}
          <div>
            <label className="font-bold block mb-1">Subtítulo banner</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="SubTítulo"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão Salvar */}
          <button
            onClick={handleSave}
            className="w-full md:w-max px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;