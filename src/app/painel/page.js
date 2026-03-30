"use client";

import { useState } from "react";
import Banner from "@/components/Banner";
import CommentsComponent from "@/components/CommentsComponent";
import { Header } from "@/components/Header/Header";
import Texts from "@/components/Texts";

export default function PainelPage() {
  const [activeTab, setActiveTab] = useState("banner");

  const tabs = [
    { id: "banner", label: "Banner", icon: "🖼️" },
    { id: "textos", label: "Textos", icon: "📝" },
    { id: "comentarios", label: "Comentários", icon: "💬" },
    { id: "produtos", label: "Produtos", icon: "📦" },
  ];

  return (
    <div className="flex flex-col pt-20 items-center min-h-screen bg-gray-50">
      <header className="flex w-full items-center justify-center bg-white shadow-sm">
        <Header disable />
      </header>

      {/* Barra de Navegação Horizontal */}
      <nav className="w-full sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-[800px] mx-auto flex overflow-x-auto no-scrollbar py-4 px-4 space-x-3 scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="w-full lg:w-[800px] text-black pt-8 px-4 pb-20">
        {/* Renderização Condicional baseada na Tab Ativa */}
        
        {activeTab === "banner" && (
          <section className="fade-in">
            <Banner />
          </section>
        )}

        {activeTab === "textos" && (
          <section className="fade-in">
            <Texts />
          </section>
        )}

        {activeTab === "comentarios" && (
          <section className="fade-in">
            <div className="font-bold mb-4 uppercase tracking-wide text-gray-600 text-sm">
              Gestão de Comentários
            </div>
            <div className="border border-gray-200 rounded-xl bg-white p-2 shadow-sm">
              <CommentsComponent />
            </div>
          </section>
        )}

        {activeTab === "produtos" && (
          <section className="fade-in p-10 text-center border-2 border-dashed border-gray-300 rounded-2xl">
            <p className="text-gray-500 font-medium">📦 Módulo de Produtos em desenvolvimento...</p>
          </section>
        )}
      </main>
    </div>
  );
}