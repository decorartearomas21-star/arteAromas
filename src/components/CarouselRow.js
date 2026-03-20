"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

export default function TestimonialSection() {
  const comments = ["João", "Maria", "Pedro", "Ana", "Lucas"];

  // 1. Carrossel Superior: Movimento contínuo para a esquerda
  const [emblaRef1] = useEmblaCarousel({ 
    loop: true 
  }, [
    AutoScroll({ 
      speed: 0.5, // Velocidade (ajuste conforme necessário)
      stopOnInteraction: false,
      stopOnMouseEnter: true // Para quando o mouse passa por cima
    })
  ]);

  // 2. Carrossel Inferior: Movimento contínuo para a direita (Espelhado)
  const [emblaRef2] = useEmblaCarousel({ 
    loop: true, 
    direction: 'rtl' 
  }, [
    AutoScroll({ 
      speed: .5, 
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  ]);

  const Card = ({ name }) => (
    <div 
      dir="ltr"
      className="flex-[0_0_auto] min-w-[280px] md:min-w-[300px] mx-3 flex items-center border border-[var(--logo2)] rounded-full p-3 bg-white select-none shadow-sm"
    >
      <Image
        src="/aaa.webp"
        alt={name}
        width={40}
        height={40}
        className="h-10 w-10 object-cover rounded-full mr-4 pointer-events-none"
      />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800 leading-tight">{name}</span>
        <span className="text-xs md:text-sm text-gray-500 leading-tight">
          Comentário de {name}, muito legal!
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full space-y-4  overflow-hidden">
      
      {/* Linha 1 */}
      <div className="embla overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef1}>
        <div className="embla__container flex">
          {/* Dica: Com AutoScroll, não precisa duplicar o array, o Embla cuida do loop */}
          {comments.map((name, idx) => (
            <Card key={`top-${idx}`} name={name} />
          ))}
        </div>
      </div>

      {/* Linha 2 (Espelhada) */}
      <div className="embla overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef2} dir="rtl">
        <div className="embla__container flex">
          {comments.map((name, idx) => (
            <Card key={`bottom-${idx}`} name={name} />
          ))}
        </div>
      </div>

      

    </section>
  );
}