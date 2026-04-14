'use client';

import { useState, useEffect, useMemo, useRef } from "react"; // Adicionado useRef
import Image from "next/image"; // Adicionado import do Image
import { saveBanner } from "@/app/actions/banner";

const Banner = ({ initialData, isLoading, onSaveSuccess }) => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("Compre Agora");
  const [primaryButtonLink, setPrimaryButtonLink] = useState("#novidades");
  const [secondaryButtonText, setSecondaryButtonText] = useState("Ver Coleções");
  const [secondaryButtonLink, setSecondaryButtonLink] = useState("link");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/banner.jpg");
  const [saving, setSaving] = useState(false);

  // --- DEFINIÇÕES QUE FALTAVAM ---
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // -------------------------------

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubTitle(initialData.subTitle || "");
      setPrimaryButtonText(initialData.primaryButtonText || "Compre Agora");
      setPrimaryButtonLink(initialData.primaryButtonLink || "#lançamentos");
      setSecondaryButtonText(initialData.secondaryButtonText || "Ver Coleções");
      setSecondaryButtonLink(initialData.secondaryButtonLink || "/home");
      setImagePreview(initialData.imageUrl || "/banner.jpg");
    }
  }, [initialData]);

  const hasChanges = useMemo(() => {
    return (
      title !== (initialData?.title || "") ||
      subTitle !== (initialData?.subTitle || "") ||
      primaryButtonText !== (initialData?.primaryButtonText || "Compre Agora") ||
      primaryButtonLink !== (initialData?.primaryButtonLink || "#lançamentos") ||
      secondaryButtonText !== (initialData?.secondaryButtonText || "Ver Coleções") ||
      secondaryButtonLink !== (initialData?.secondaryButtonLink || "/home") ||
      imageFile !== null
    );
  }, [title, subTitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, imageFile, initialData]);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subTitle', subTitle);
    formData.append('primaryButtonText', primaryButtonText);
    formData.append('primaryButtonLink', primaryButtonLink);
    formData.append('secondaryButtonText', secondaryButtonText);
    formData.append('secondaryButtonLink', secondaryButtonLink);
    if (imageFile) formData.append('imageFile', imageFile);
    formData.append('oldImageUrl', initialData?.imageUrl || '');

    const result = await saveBanner(formData);
    
    if (result.success) {
      onSaveSuccess(result.data);
      setImageFile(null);
      alert("Banner atualizado!");
    }
    setSaving(false);
  };

  if (isLoading) return <div className="p-10 animate-pulse text-gray-400">Carregando dados do banner...</div>;

  return (
    <div className="pb-6">
      <div className="font-bold mb-2">GESTÃO DO BANNER PRINCIPAL</div>
      
      <div className="border border-[var(--logo2)] rounded-sm flex flex-col pb-4 gap-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*"
          className="hidden" 
        />

        <div 
          className="relative group cursor-pointer overflow-hidden" 
          onClick={handleImageClick}
          title="Clique para trocar a imagem"
        >
          <Image
            src={imagePreview}
            alt="banner"
            width={1000}
            height={400}
            priority
            className="w-full lg:w-[800px] h-[300px] object-cover object-center fade transition-opacity group-hover:opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              Trocar Imagem
            </span>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div>
            <label className="font-bold block mb-1">Título banner</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Subtítulo banner</label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="SubTítulo"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold mb-4 text-gray-700">Botões do Banner</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-bold block mb-1 text-sm">Texto do Botão Primário</label>
                <input
                  type="text"
                  value={primaryButtonText}
                  onChange={(e) => setPrimaryButtonText(e.target.value)}
                  placeholder="Ex: Compre Agora"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="font-bold block mb-1 text-sm">Link do Botão Primário</label>
                <input
                  type="text"
                  value={primaryButtonLink}
                  onChange={(e) => setPrimaryButtonLink(e.target.value)}
                  placeholder="Ex: #novidades ou /produtos"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1 text-sm">Texto do Botão Secundário</label>
                <input
                  type="text"
                  value={secondaryButtonText}
                  onChange={(e) => setSecondaryButtonText(e.target.value)}
                  placeholder="Ex: Ver Coleções"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="font-bold block mb-1 text-sm">Link do Botão Secundário</label>
                <input
                  type="text"
                  value={secondaryButtonLink}
                  onChange={(e) => setSecondaryButtonLink(e.target.value)}
                  placeholder="Ex: #novidades ou /produtos"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`w-full md:w-max px-8 py-3 font-bold rounded-xl active:scale-95 transition-all shadow-md ${
              hasChanges && !saving 
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;