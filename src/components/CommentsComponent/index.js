"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { saveCommentsList, uploadCommentImage } from "@/app/actions/comments";

const CommentsComponent = ({ initialData, isLoading, onSaveSuccess }) => {
  const [comments, setComments] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setComments(initialData);
    }
  }, [initialData]);

  const handleChange = (index, field, value) => {
    const newComments = [...comments];
    newComments[index][field] = value;
    setComments(newComments);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('oldUrl', comments[index].image);

    const res = await uploadCommentImage(formData);
    if (res.success) {
      handleChange(index, "image", res.url);
    } else {
      alert("Erro no upload: " + res.error);
    }
  };

  const addNewComment = () => {
    setComments([
      ...comments,
      { name: "", phrase: "", image: "", id: Date.now() }
    ]);
  };

  const removeComment = (index) => {
    if (confirm("Deseja remover este comentário?")) {
      const newComments = comments.filter((_, i) => i !== index);
      setComments(newComments);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const result = await saveCommentsList(comments);
    if (result.success) {
      onSaveSuccess(result.data);
      alert("Lista de comentários atualizada!");
    }
    setSaving(false);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400 animate-pulse">Carregando comentários...</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
        <span className="text-sm text-gray-500 font-medium">Total: {comments.length}</span>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50"
        >
          {saving ? "Salvando..." : "SALVAR TODAS ALTERAÇÕES"}
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((item, index) => (
          <div key={item.id} className="p-6 border rounded-2xl bg-white shadow-sm space-y-4 relative group">
            <button 
              onClick={() => removeComment(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>

            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Comentário #{index + 1}</h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50">
                  {item.image ? (
                    <Image src={item.image} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 text-xs">Sem foto</div>
                  )}
                </div>
                <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:underline">
                  TROCAR FOTO
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(index, e.target.files[0])} 
                  />
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase">Nome do Cliente</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                    placeholder="Ex: Erick Andrade"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase">Depoimento</span>
                  <textarea
                    value={item.phrase}
                    onChange={(e) => handleChange(index, "phrase", e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                    placeholder="O que o cliente disse?"
                    rows="2"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addNewComment}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium hover:border-blue-300 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Adicionar Novo Depoimento
      </button>
    </div>
  );
};

export default CommentsComponent;