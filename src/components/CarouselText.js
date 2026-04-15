"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { notoSerif } from "@/app/fonts";

const defaultItems = [
  {
    titulo: "Luz que acolhe",
    descricao: "Uma vela nao perde nada de sua luz ao compartilhar sua chama com outra; ela apenas torna o mundo um pouco mais iluminado.",
  },
  {
    titulo: "Silencio e memoria",
    descricao: "Ha um silencio sagrado que so a danca de uma chama sabe traduzir. Velas transformam casas em lares e momentos em memorias.",
  },
  {
    titulo: "Brilho persistente",
    descricao: "Mesmo a menor das velas e capaz de desafiar a escuridao mais profunda. Que a sua luz interior brilhe com a mesma persistencia.",
  },
  {
    titulo: "Ritual de calma",
    descricao: "Luz suave, aroma calmo e alma em paz. As vezes, tudo o que precisamos e acender uma vela e deixar o tempo passar devagar.",
  },
];

const normalizeItem = (item) => {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const titulo = String(item.titulo || item.title || "").trim();
    const descricao = String(item.descricao || item.description || item.texto || item.text || "").trim();

    if (!titulo && !descricao) {
      return null;
    }

    return { titulo, descricao };
  }

  const descricao = String(item || "").trim();

  if (!descricao) {
    return null;
  }

  return { titulo: "", descricao };
};

export default function CarouselText({ phrases = [] }) {
  const carouselPhrases =
    Array.isArray(phrases) && phrases.length > 0
      ? phrases.map(normalizeItem).filter(Boolean)
      : defaultItems;

  // 1. Carrossel Superior: Esquerda para Direita
  const [emblaRef1] = useEmblaCarousel({ 
    loop: true, 
    startIndex: 0 
  }, [
    Autoplay({ delay: 15000, stopOnInteraction: false })
  ]);

const Card = ({ title, description }) => (
  <div 
    dir="ltr" 
    className="flex-[0_0_auto] w-[280px] md:w-[1200px] mx-3 flex flex-col items-center justify-center select-none p-2 rounded-2xl"
  >
    <div className="flex flex-col items-center text-center w-full">
      {title && (
        <span className={`${notoSerif.className} mb-2 text-lg font-semibold uppercase tracking-[0.18em] text-[var(--logo2)]`}>
          {title}
        </span>
      )}
      <span className="text-sm md:text-base text-gray-500 leading-relaxed whitespace-normal break-words w-full">
        {description}
      </span>
    </div>
  </div>
);

  return (
    <section className="w-full space-y-8 overflow-hidden">
      
      {/* Carrossel 1: Fluxo Padrão */}
      <div className="embla overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef1}>
        <div className="embla__container flex">
          {carouselPhrases.map((phrase, idx) => (
            <Card key={`top-${idx}`} title={phrase.titulo} description={phrase.descricao} />
          ))}
        </div>
      </div>
    </section>
  );
}