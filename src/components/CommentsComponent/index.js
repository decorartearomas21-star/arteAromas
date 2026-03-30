import { useState, useEffect } from "react";

const CommentsComponent = () => {
  const [comments, setComments] = useState([
    {
      phrase: "Cheiro maravilhoso, deixou minha casa super aconchegante",
      image: "/aaa.png",
      name: "Erick",
      id: Date.now(),
    },
  ]);

  const handleChange = (index, field, value) => {
    const newComments = [...comments];
    newComments[index][field] = value;
    setComments(newComments);
  };

  useEffect(() => {
    const lastComment = comments[comments.length - 1];

    if (lastComment.name && lastComment.phrase && lastComment.image) {
      setComments([
        ...comments,
        { name: "", phrase: "", image: "", id: Date.now() + 1 },
      ]);
    }
  }, [comments]);

  const handleSave = (item) => {
    console.log("Salvando dados:", item);
    alert(`Comentário de ${item.name} salvo com sucesso!`);
  };

  return (
    <div className="p-4 space-y-8">
      {comments.map((item, index) => (
        <div key={item.id || index} className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Comentário #{index + 1}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-600">Nome</span>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="Ex: Erick"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-600">URL da Imagem</span>
              <input
                type="text"
                value={item.image}
                onChange={(e) => handleChange(index, "image", e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="/caminho/foto.png"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Frase</span>
            <textarea
              value={item.phrase}
              onChange={(e) => handleChange(index, "phrase", e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Escreva o comentário aqui..."
              rows="2"
            />
          </label>
          <button
            onClick={() => handleSave(item)}
            disabled={!item.name || !item.phrase}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Salvar / Atualizar
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommentsComponent;