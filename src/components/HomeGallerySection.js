"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ScrollFadeIn from "@/components/ScrollFadeIn";

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

  const selectedLinhaLabel = selectedLinhaSlug
    ? linhaMap.get(selectedLinhaSlug) || ""
    : "";

  useEffect(() => {
    if (selectedLinhaSlug && !linhaMap.has(selectedLinhaSlug)) {
      setSelectedLinhaSlug("");
    }
  }, [linhaMap, selectedLinhaSlug]);

  const filteredGalleryProducts = useMemo(() => {
    if (!selectedLinhaLabel) return galleryProducts;

    return galleryProducts.filter(
      (product) => String(product?.linha || "").trim() === selectedLinhaLabel,
    );
  }, [galleryProducts, selectedLinhaLabel]);

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
                !selectedLinhaSlug
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
                  selectedLinhaSlug === slug
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
        <div className="mt-1 grid grid-cols-1 gap-5 px-1 lg:grid-cols-3 lg:px-1">
          {filteredGalleryProducts.map((product) => (
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
      </section>
    </>
  );
}
