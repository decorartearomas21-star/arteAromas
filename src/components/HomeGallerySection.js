"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ScrollFadeIn from "@/components/ScrollFadeIn";

const PAGE_SIZE = 12;

const getVisiblePageItems = (totalPages, currentPage) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const items = [0];
  const windowStart = Math.max(1, currentPage - 1);
  const windowEnd = Math.min(totalPages - 2, currentPage + 1);

  if (windowStart > 1) {
    items.push("ellipsis-start");
  }

  for (let pageIndex = windowStart; pageIndex <= windowEnd; pageIndex += 1) {
    items.push(pageIndex);
  }

  if (windowEnd < totalPages - 2) {
    items.push("ellipsis-end");
  }

  items.push(totalPages - 1);
  return items;
};

const toCategorySlug = (category) =>
  String(category || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function HomeGallerySection({
  products = [],
  selectedCategorySlug = "",
  selectedCategoryLabel = "",
  initialSelectedLinhaSlug = "",
  titleClassName = "",
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const [selectedLinhaSlug, setSelectedLinhaSlug] = useState(initialSelectedLinhaSlug);
  const [currentPage, setCurrentPage] = useState(0);

  const galleryProducts = useMemo(() => {
    if (!selectedCategorySlug) return safeProducts;

    return safeProducts.filter(
      (product) => toCategorySlug(product?.category || "") === selectedCategorySlug,
    );
  }, [safeProducts, selectedCategorySlug]);

  const linhaMap = useMemo(() => {
    return new Map(
      galleryProducts
        .map((product) => String(product?.linha || "").trim())
        .filter(Boolean)
        .map((linha) => [toCategorySlug(linha), linha]),
    );
  }, [galleryProducts]);

  const effectiveSelectedLinhaSlug = linhaMap.has(selectedLinhaSlug) ? selectedLinhaSlug : "";
  const selectedLinhaLabel = effectiveSelectedLinhaSlug
    ? linhaMap.get(effectiveSelectedLinhaSlug) || ""
    : "";

  const filteredGalleryProducts = useMemo(() => {
    if (!selectedLinhaLabel) return galleryProducts;

    return galleryProducts.filter(
      (product) => String(product?.linha || "").trim() === selectedLinhaLabel,
    );
  }, [galleryProducts, selectedLinhaLabel]);

  const totalPages = Math.max(1, Math.ceil(filteredGalleryProducts.length / PAGE_SIZE));
  const pageStart = currentPage * PAGE_SIZE;
  const pageProducts = filteredGalleryProducts.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage((value) => Math.min(value, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategorySlug, selectedLinhaSlug]);

  const goToPage = (page) => {
    const clampedPage = Math.min(Math.max(page, 0), totalPages - 1);
    setCurrentPage(clampedPage);
  };

  const galleryTitle = selectedCategoryLabel
    ? `Galeria ${selectedCategoryLabel}`
    : "Galeria";

  return (
    <>
      <ScrollFadeIn>
        <p id="galeria" className={titleClassName}>
          {galleryTitle}
        </p>
      </ScrollFadeIn>

      {linhaMap.size > 0 && (
        <ScrollFadeIn>
          <div className="mt-2 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-3 shadow-lg backdrop-blur-sm lg:px-5">
            <span className="mr-1 text-xs font-bold uppercase tracking-widest text-(--logo2)/50">
              Linha
            </span>
            <button
              type="button"
              onClick={() => setSelectedLinhaSlug("")}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                !effectiveSelectedLinhaSlug
                  ? "border-(--logo2) bg-(--logo2) text-(--logo1)"
                  : "border-(--logo2)/30 text-(--logo2) hover:border-(--logo2)"
              }`}
            >
              Todas
            </button>

            {[...linhaMap.entries()].map(([slug, label]) => (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedLinhaSlug(slug)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                  effectiveSelectedLinhaSlug === slug
                    ? "border-(--logo2) bg-(--logo2) text-(--logo1)"
                    : "border-(--logo2)/30 text-(--logo2) hover:border-(--logo2)"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </ScrollFadeIn>
      )}

      <section className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-sm lg:p-5">
        {totalPages > 1 && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="rounded-full border border-(--logo2)/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-(--logo2) transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <div className="text-xs font-black uppercase tracking-wide text-(--logo2)/60">
              Página {currentPage + 1}/{totalPages}
            </div>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="rounded-full border border-(--logo2)/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-(--logo2) transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        )}

        <div className="mt-1 grid grid-cols-1 gap-5 px-1 lg:grid-cols-3 lg:px-1">
          {pageProducts.map((product) => (
            <ScrollFadeIn key={product.id}>
              <ProductCard product={product} className="w-full" />
            </ScrollFadeIn>
          ))}

          {filteredGalleryProducts.length === 0 && (
            <p className="col-span-1 py-8 text-center text-gray-500 lg:col-span-3">
              {selectedLinhaLabel
                ? `Nenhum produto encontrado na linha ${selectedLinhaLabel}.`
                : selectedCategoryLabel
                  ? `Nenhum produto encontrado na categoria ${selectedCategoryLabel}.`
                  : "Nenhum produto cadastrado no painel."}
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {getVisiblePageItems(totalPages, currentPage).map((item) => {
              if (typeof item === "string") {
                return (
                  <span
                    key={item}
                    className="px-1 text-sm font-black tracking-wide text-(--logo2)/40"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                );
              }

              const isActive = currentPage === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToPage(item)}
                  className={`min-w-9 rounded-full px-3 py-2 text-sm font-black transition-all ${
                    isActive
                      ? "bg-(--logo2) text-(--logo1) shadow-md"
                      : "border border-(--logo2)/20 bg-white/90 text-(--logo2) hover:border-(--logo2)/40"
                  }`}
                  aria-label={`Ir para a página ${item + 1}`}
                  aria-current={isActive}
                >
                  {item + 1}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
