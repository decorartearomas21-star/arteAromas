"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { saveProductsList, uploadProductImage } from "@/app/actions/products";
import { currency } from "@/utils/currency";

const ProductsComponent = ({ initialData, isLoading, onSaveSuccess }) => {
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // Controla qual card está aberto

  useEffect(() => {
    if (initialData) setProducts(initialData);
  }, [initialData]);

  const handleChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("oldUrl", products[index].image);

    const res = await uploadProductImage(formData);
    if (res.success) {
      handleChange(index, "image", res.url);
    }
  };

  const addNewProduct = () => {
    const newId = Date.now();
    setProducts([
      ...products,
      {
        name: "",
        description: "",
        price: 0,
        discount: "",
        image: "",
        rating: 10,
        interactions: 0,
        isActive: true,
        id: newId,
      },
    ]);
    setEditingId(newId);
  };

  const removeProduct = (index) => {
    if (confirm("Deseja excluir este produto?")) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const result = await saveProductsList(products);
    if (result.success) {
      onSaveSuccess(result.data);
      setEditingId(null);
    }
    setSaving(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const val = i * 2;
      stars.push(
        <span key={i} className={rating >= val ? "text-yellow-400" : "text-gray-200"}>★</span>
      );
    }
    return stars;
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400">Carregando catálogo...</div>;

  return (
    <div className="relative pb-32">
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold uppercase tracking-wide text-gray-600 text-sm">Gestão de Produtos</div>
        <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
          {products.length} Itens no total
        </div>
      </div>

      <div className="space-y-6">
        {products.map((product, index) => {
          const isEditing = editingId === product.id;

          if (!isEditing) {
            return (
              /* --- MODO VISUALIZAÇÃO (LISTA ENXUTA) --- */
              <div 
                key={product.id}
                className="flex items-center justify-between p-4 bg-white border rounded-[28px] shadow-sm hover:shadow-md transition-all border-gray-100"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[8px] text-gray-300 font-bold uppercase">S/ Foto</div>
                    )}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{product.name || "Produto sem nome"}</h3>
                    <p className="text-blue-600 font-black text-xs">{currency(product.price)}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setEditingId(product.id)}
                  className="ml-4 px-5 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                >
                  Editar
                </button>
              </div>
            );
          }

          /* --- SEU COMPONENTE ORIGINAL (MODO EDIÇÃO COMPLETO) --- */
          return (
            <div
              key={product.id}
              className={`p-5 border rounded-3xl bg-white shadow-sm transition-all ${!product.isActive ? "opacity-60 grayscale" : ""}`}
            >
              {/* Status e Delete Row */}
              <div className="flex justify-between items-center mb-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.isActive}
                    onChange={(e) => handleChange(index, "isActive", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                  <span className="ml-3 text-[10px] font-black uppercase text-gray-400 tracking-tight">
                    {product.isActive ? "Visível no Catálogo" : "Produto Oculto"}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                                    <button
                    onClick={() => removeProduct(index)}
                    className="p-2 text-red-500 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => setEditingId(null)}
                    className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-500 px-2"
                  >
                    Fechar
                  </button>

                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Coluna de Mídia */}
                <div className="w-full lg:w-56 space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-gray-50 bg-gray-50">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-gray-300 font-bold">SEM FOTO</div>
                    )}
                  </div>
                  <label className="flex items-center justify-center w-full py-3 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 cursor-pointer hover:bg-gray-200 transition-all uppercase">
                    SUBIR NOVA IMAGEM
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(index, e.target.files[0])} />
                  </label>
                </div>

                {/* Coluna de Dados */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome do Produto</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-full px-4 py-3.5 mt-1 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-400 text-sm font-bold shadow-inner"
                        placeholder="Nome..."
                      />
                    </div>

                    <div className="sm:col-span-2 bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] font-black text-yellow-700 uppercase">Popularidade</label>
                        <div className="text-sm flex gap-1">{renderStars(product.rating)}</div>
                      </div>
                      <input
                        type="range" min="1" max="10" step="1"
                        value={product.rating || 10}
                        onChange={(e) => handleChange(index, "rating", parseInt(e.target.value))}
                        className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Preço Atual</label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          value={currency(product.price)}
                          onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, "");
                            handleChange(index, "price", Number(onlyNumbers) / 100);
                          }}
                          className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-400 text-sm shadow-inner font-bold text-blue-900"
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Desconto</label>
                      <input
                        type="text"
                        value={product.discount}
                        onChange={(e) => handleChange(index, "discount", e.target.value)}
                        className="w-full px-4 py-3.5 mt-1 rounded-2xl bg-green-50 border-none focus:ring-2 focus:ring-green-400 text-sm text-green-700 font-bold shadow-inner"
                        placeholder="Ex: -15%"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Descrição Breve</label>
                      <textarea
                        value={product.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        className="w-full px-4 py-3.5 mt-1 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-400 text-sm shadow-inner"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addNewProduct}
        className="w-full mt-8 py-10 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-black text-xs hover:border-blue-400 hover:text-blue-500 transition-all uppercase tracking-widest bg-white/50"
      >
        + Adicionar Novo Produto ao Catálogo
      </button>

      {/* FAB de Salvar */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
        {saving && (
          <div className="bg-white px-4 py-2 rounded-full shadow-xl border text-[10px] font-bold text-blue-600 animate-bounce">
            A guardar alterações...
          </div>
        )}
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="pointer-events-auto bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all"
        >
          {saving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductsComponent;