"use client";

import { useState, useEffect } from "react";
import Banner from "@/components/Banner";
import Texts from "@/components/Texts";
import ProductsComponent from "@/components/ProductsComponent";
import { Header } from "@/components/Header/Header";

import { getBannerData } from "@/app/actions/banner";
import { getTextsData } from "@/app/actions/texts";
import { getProductsData } from "@/app/actions/products";



export default function PainelPage() {
  const [activeTab, setActiveTab] = useState("banner");

  // --- Estados Globais do Painel ---
  const [bannerData, setBannerData] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [textsData, setTextsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregamento centralizado (Executa apenas 1 vez ao abrir o painel)
  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const [banner, texts, prodcuts] = await Promise.all([
          getBannerData(),
          getTextsData(),
          getProductsData()
        ]);

        if (prodcuts) setProductsData(prodcuts);
        if (banner) setBannerData(banner);
        if (texts) setTextsData(texts);
        
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  const tabs = [
    { id: "banner", label: "Banner", icon: "🖼️" },
    { id: "produtos", label: "Produtos", icon: "📦" },
    { id: "textos", label: "Textos", icon: "📝" },
  ];

  return (
    <div className="flex flex-col pt-20 items-center min-h-screen bg-gray-50 text-black">
      <header className="flex w-full items-center justify-center bg-white shadow-sm">
        <Header disable />
      </header>

      {/* Navegação Sticky */}
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

      <main className="w-full lg:w-[800px] pt-8 px-4 pb-20">
        {/* Renderização Condicional com os dados já carregados */}

        {activeTab === "banner" && (
          <section className="fade-in">
            <Banner
              initialData={bannerData}
              isLoading={loading}
              onSaveSuccess={(newData) => setBannerData(newData)}
            />
          </section>
        )}

        {activeTab === "textos" && (
          <section className="fade-in">
            {/* Aqui você passaria os dados para o componente de Textos da mesma forma */}
            <Texts
              initialData={textsData}
              isLoading={loading}
              onSaveSuccess={(newData) => setTextsData(newData)}
            />
          </section>
        )}

        {activeTab === "produtos" && (
          <section className="fade-in">

            <div className="border border-gray-200 rounded-xl bg-white p-2 shadow-sm">
              <ProductsComponent
                initialData={productsData}
                isLoading={loading}
                onSaveSuccess={(newData) => setProductsData(newData)}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
