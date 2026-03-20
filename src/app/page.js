"use client";

import TestimonialSection from "@/components/CarouselRow";
import { Header } from "@/components/Header/Header";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { currency } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Vela Aromatica Lumière Cimento 1",
    price: 200,
    img: "/imagem1.jpg",
    discont: 0,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 2",
    price: 130,
    img: "/imagem1.jpg",
    discont: 30,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 3",
    price: 110,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 4",
    price: 100,
    img: "/imagem1.jpg",
    discont: 3,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 5",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 6",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 7",
    price: 200,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 8",
    price: 130,
    img: "/imagem1.jpg",
    discont: 30,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 9",
    price: 110,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 10",
    price: 100,
    img: "/imagem1.jpg",
    discont: 3,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 11",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
  {
    name: "Vela Aromatica Lumière Cimento 12",
    price: 100,
    img: "/imagem1.jpg",
    discont: 10,
    description: "Descrição do produto",
  },
];

const whatsapp = (item, valorComDesconto) => {
  let mensagem = `✨ *Olá! Tudo bem?*  
Tenho interesse na *${item.name}*  

💰 *Valor:* ${currency(item.price)}  

Pode me passar mais informações? 😊`;

  if (item.discont) {
    mensagem = `✨ *Olá! Tudo bem?*  
Tenho interesse na *${item.name}*  

🔥 *Promoção de ${item.discont}% OFF!*  
💰 De: ~~${currency(item.price)}~~  
💸 Por: *${currency(valorComDesconto)}*  

Quero aproveitar! Pode me passar mais detalhes? 😍`;
  }
  return `https://wa.me/5516993140835?text=${encodeURIComponent(mensagem)}`;
};

const aplicarDesconto = (valorOriginal, percentualDesconto) => {
  const valorFinal = valorOriginal * (1 - percentualDesconto / 100);
  return valorFinal;
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <header className="flex flex-1 w-full items-center justify-center">
        <Header />
        <div id="banner" className="w-full relative flex flex-col items-center">
          <div className=" absolute w-full flex justify-center items-center h-[600px]">
            <div className=" w-full md:w-[800px] p-4 slideReveal">
              <p className=" text-4xl md:text-6xl text-[var(--logo1)] text-shadow-lg font-bold">
                ✨ Transforme
              </p>
              <p className=" text-4xl md:text-6xl text-[var(--logo1)] text-shadow-lg font-bold">
                sua casa em um
              </p>
              <p className=" text-4xl md:text-6xl text-[var(--logo1)] text-shadow-lg font-bold">
                refújo acolhedor
              </p>
              <p className="text-1xl md:text-2xl text-[var(--logo1)] text-shadow-lg my-4 font-bold">
                Velas artesanais com aromas únicos
              </p>

              <div className="flex gap-4 mt-6">
                <Link
                  href="#novidades"
                  className="bg-[var(--logo1)] rounded-sm text-[var(--logo2)] py-2 px-4"
                >
                  Compre Agora
                </Link>
                <Link
                  href="produtos"
                  className="border-2 border-[var(--logo1)] rounded-sm text-[var(--logo1)] py-2 px-4 "
                >
                  Ver Coleçãos
                </Link>
              </div>

              <div className="flex w-full gap-2 md:w-[600px] justify-between mt-10">
                <p className="flex w-full items-center gap-2 text-sm md:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
                  <Image
                    src="/shipping-fast-solid-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 md:h-6 md:w-6 fade"
                  />
                  Entregas para todo Brasil
                </p>
                <p className="flex w-full items-center gap-2 text-sm md:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
                  <Image
                    src="/security-verified-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 md:h-6 md:w-6 fade"
                  />{" "}
                  Compra Segura
                </p>
              </div>
              <div className="flex w-full gap-2 md:w-[600px] justify-between">
                <p className="flex w-full items-center gap-2 text-sm md:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
                  <Image
                    src="/art-design-paint-pallet-format-text-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 md:h-6 md:w-6 fade"
                  />{" "}
                  Produto Artesanal
                </p>

                <p className="flex w-full items-center gap-2 text-sm md:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
                  <Image
                    src="/present-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 md:h-6 md:w-6 fade"
                  />{" "}
                  Ideal para presente
                </p>
              </div>
            </div>
          </div>
          <Image
            src="/banner.jpg"
            alt="banner"
            width={1000}
            height={20}
            priority
            className="h-[600px] w-full object-cover object-center fade"
          />
        </div>
      </header>
      <main id="novidades" className="w-full md:w-7xl fade">
        <ScrollFadeIn>
          <p className="text-3xl md:text-5xl font-medium mt-4 mb-4 px-5 md:px-10">
            NOVIDADES
          </p>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <Image
                src="/imagem1.jpg"
                alt="banner"
                width={500}
                height={500}
                priority
                className="h-32 w-32 md:h-68 md:w-68 rounded-full object-cover object-center fade  border p-1 border-black"
              />
              <p className="text-1xl md:text-2xl mt-4">Produto 1</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/banner.jpg"
                alt="banner"
                width={500}
                height={500}
                priority
                className="h-32 w-32 md:h-68 md:w-68 rounded-full object-cover object-center fade  border p-1 border-black"
              />
              <p className="text-1xl md:text-2xl mt-4">Produto 2</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/imagem1.jpg"
                alt="banner"
                width={500}
                height={500}
                priority
                className="h-32 w-32 md:h-68 md:w-68 rounded-full object-cover object-center fade border p-1 border-black"
              />
              <p className="text-1xl md:text-2xl mt-4">Produto 3</p>
            </div>
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <p
            id="produtos"
            className="text-3xl md:text-5xl font-medium mt-10 mb-4 px-5 md:px-10"
          >
            PRODUTOS
          </p>
        </ScrollFadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 px-2 md:px-10">
          {products.map((item, i) => {
            const valorComDesconto = aplicarDesconto(item.price, item.discont);
            return (
              <ScrollFadeIn key={i}>
                <div className="flex flex-col items-center border p-1 border-black rounded-md">
                  <div className="relative">
                    <Image
                      src={item.img}
                      alt="banner"
                      width={500}
                      height={500}
                      priority
                      className="h-full w-full md:h-68 md:w-68 object-cover object-center rounded-sm"
                    />
                    {item.discont > 0 && (
                      <div className="absolute bottom-0 left-0 rounded-full bg-black text-white px-2 py-1 m-2 text-sm md:text-xl">
                        {item.discont}% OFF
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-1xl md:text-2xl mt-2 px-1 font-semibold">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex justify-center mt-2 items-center">
                    <p className="text-1xl md:text-2xl ">
                      {item.discont > 0 ? (
                        <>
                          <span className="text-sm md:text-base line-through mr-2">
                            {currency(item.price)}
                          </span>
                          <span className="font-semibold text-2xl">
                            {currency(valorComDesconto)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-2xl">
                          {currency(item.price)}
                        </span>
                      )}
                    </p>
                  </div>

                  <Link
                    href={whatsapp(item, valorComDesconto)}
                    className="flex justify-center items-center text-1xl md:text-2xl  mt-4 bg-[var(--logo2)] text-[var(--logo1)] rounded-sm w-full h-12 md:h-16"
                  >
                    <Image
                      src="/whatsapp-color-svgrepo-com.png"
                      alt="comprar"
                      width={40}
                      height={40}
                      className="h-6 w-6 object-cover mr-2"
                    />
                    Comprar
                  </Link>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>

        <ScrollFadeIn>
          <p className="text-3xl md:text-5xl font-medium mt-10 mb-4 px-5 md:px-10">
            Comentarios
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <TestimonialSection />
        </ScrollFadeIn>
        <ScrollFadeIn>
          <div className="flex w-full text-sm justify-between gap-4 p-2 mt-4">
            <p className="">Privacidade e segurança</p>
            <p className="">Termos de uso</p>
            <p className="">Regulamentos</p>
            <p className="">Trabalhe conosco</p>
          </div>
        </ScrollFadeIn>
      </main>
    </div>
  );
}
