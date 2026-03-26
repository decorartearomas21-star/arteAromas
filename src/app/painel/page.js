"use client";

import { Header } from "@/components/Header/Header";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import Image from "next/image";
import { useState } from "react";

export default function PainelPage() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [phraseOne, setPhraseOne] = useState("");
  const [phraseTwo, setPhraseTwo] = useState("");
  const [phraseThree, setPhraseThree] = useState("");
  const [phraseFor, setPhraseFor] = useState("");
  const [phraseFive, setPhraseFive] = useState("");
  const [phraseSix, setPhraseSix] = useState("");

  return (
    <div className="flex flex-col items-center">
      <header className="flex flex-1 w-full items-center justify-center">
        <Header disable />
      </header>
      <main
        id="novidades"
        className="w-full lg:w-[800px] text-black fade pt-20 px-2"
      >
        <div className="pb-6">
          <div className="font-bold">GESTÃO DO BANNER PRINCIPAL</div>
          <div className="border border-[var(--logo2)] rounded-sm flex flex-col pb-2 gap-2">
            <div>
              <Image
                src="/banner.jpg"
                alt="banner"
                width={1000}
                height={20}
                priority
                className="w-full lg:w-[800px] object-cover object-center fade"
              />
            </div>
            <div className="px-2">
              <label className="font-bold">Titulo banner</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titulo"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200   outline-none transition-all text-gray-800 placeholder:text-gray-400"
              />
              <label className="font-bold">Subtitulo banner</label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="SubTitulo"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200   outline-none transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="font-bold">TEXTOS ROTATIVOS (5 FRASES)</div>
          <div className="border border-[var(--logo2)] rounded-sm flex flex-col py-2 gap-2">
            <div className="flex w-full flex-col lg:flex-row">
              <div className="px-2 w-full">
                <label className="font-bold">Frase 1</label>
                <input
                  type="text"
                  value={phraseOne}
                  onChange={(e) => setPhraseOne(e.target.value)}
                  placeholder="Frase 1"
                  className="w-full  px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="px-2 w-full">
                <label className="font-bold">Frase 2</label>
                <input
                  type="text"
                  value={phraseTwo}
                  onChange={(e) => setPhraseTwo(e.target.value)}
                  placeholder="Frase 2"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row">
              <div className="px-2 w-full">
                <label className="font-bold">Frase 3</label>
                <input
                  type="text"
                  value={phraseThree}
                  onChange={(e) => setPhraseThree(e.target.value)}
                  placeholder="Frase 3"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="px-2 w-full">
                <label className="font-bold">Frase 4</label>
                <input
                  type="text"
                  value={phraseFor}
                  onChange={(e) => setPhraseFor(e.target.value)}
                  placeholder="Frase 4"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row">
              <div className="px-2 w-full">
                <label className="font-bold">Frase 5</label>
                <input
                  type="text"
                  value={phraseFive}
                  onChange={(e) => setPhraseFive(e.target.value)}
                  placeholder="Frase 5"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="px-2 w-full">
                <label className="font-bold">Frase 6</label>
                <input
                  type="text"
                  value={phraseSix}
                  onChange={(e) => setPhraseSix(e.target.value)}
                  placeholder="Frase 6"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        <ScrollFadeIn>
          <p className="text-1xl lg:text-1xl font-medium mt-10 lg:px-10">
            Comentarios
          </p>
          <p className="text-sm">
            "Cheiro maravilhoso, deixou minha casa super aconchegante!"
          </p>
        </ScrollFadeIn>
      </main>
    </div>
  );
}
