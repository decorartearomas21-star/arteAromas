"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { getProductById } from "@/app/actions/products";
import { Header } from "@/components/Header/Header";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { useProducts } from "@/context/ProductsContext";
import { currency } from "@/utils/currency";
import { normalizeProduct } from "@/utils/product";
import Image from "next/image";
import Link from "next/link";

const getCommentInitial = (name) => {
  const trimmedName = String(name || "").trim();
  return (trimmedName.charAt(0) || "C").toUpperCase();
};

const whatsapp = (item, valorComDesconto) => {
  let mensagem = `✨ *Olá! Tudo bem?*  
Tenho interesse na *${item.name}*  

💰 *Valor:* ${currency(item.price)}  

Pode me passar mais informações? 😊`;

  if (item.discountPercent > 0) {
    mensagem = `✨ *Olá! Tudo bem?*  
Tenho interesse na *${item.name}*  

🔥 *Promoção de ${item.discountPercent}% OFF!*  
💰 De: ~~${currency(item.price)}~~  
💸 Por: *${currency(valorComDesconto)}*  

Quero aproveitar! Pode me passar mais detalhes? 😍`;
  }
  return `https://wa.me/5516982660880?text=${encodeURIComponent(mensagem)}`;
};

const aplicarDesconto = (valorOriginal, percentualDesconto) => {
  const valorFinal = valorOriginal * (1 - percentualDesconto / 100);
  return valorFinal;
};

const renderWhatsAppInline = (text, keyPrefix) => {
  const inlineRegex = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g;
  const nodes = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of text.matchAll(inlineRegex)) {
    const start = match.index ?? 0;
    const token = match[0] || "";

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const content = token.slice(1, -1);
    const nodeKey = `${keyPrefix}-${tokenIndex}`;

    if (token.startsWith("*")) {
      nodes.push(<strong key={nodeKey}>{content}</strong>);
    } else if (token.startsWith("_")) {
      nodes.push(<em key={nodeKey}>{content}</em>);
    } else {
      nodes.push(<s key={nodeKey}>{content}</s>);
    }

    lastIndex = start + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const renderWhatsAppText = (text) => {
  const safeText = String(text || "");
  const lines = safeText.split(/\r?\n/);

  return lines.map((line, lineIndex) => (
    <Fragment key={`line-${lineIndex}`}>
      {renderWhatsAppInline(line, `line-${lineIndex}`)}
      {lineIndex < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
};

export default function PagePdp({ productId }) {
  const { getProductById: getCachedProductById, isHydrated, upsertProduct } = useProducts();
  const [fallbackItem, setFallbackItem] = useState(null);
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);
  const cachedItem = getCachedProductById(productId);

  useEffect(() => {
    let isMounted = true;

    async function loadFallbackProduct() {
      if (!isHydrated || cachedItem || !productId) return;

      setIsFetchingFallback(true);
      const serverProduct = await getProductById(productId);

      if (!isMounted) return;

      if (serverProduct) {
        setFallbackItem(serverProduct);
        upsertProduct(serverProduct);
      }

      setIsFetchingFallback(false);
    }

    loadFallbackProduct();

    return () => {
      isMounted = false;
    };
  }, [cachedItem, isHydrated, productId, upsertProduct]);

  const item = useMemo(
    () => normalizeProduct(cachedItem || fallbackItem),
    [cachedItem, fallbackItem],
  );

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-[radial-gradient(circle_at_top,#fff6e9,#f2e9d8_60%)]">
        <Header />
        <main className="w-full max-w-3xl px-4 pt-32 text-center text-black">
          <p className="text-2xl font-semibold">
            {isFetchingFallback ? "Carregando produto..." : "Produto não encontrado."}
          </p>
          <p className="mt-2 text-gray-600">
            {isHydrated
              ? "Tente voltar para a Home e abrir o produto novamente."
              : "Carregando cache local..."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-sm bg-(--logo2) px-6 py-3 font-semibold text-white"
          >
            Voltar para Home
          </Link>
        </main>
      </div>
    );
  }

  const valorComDesconto = aplicarDesconto(item.price, item.discountPercent);
  const hasDiscount = item.discountPercent > 0;
  const value = hasDiscount ? valorComDesconto : item.price;
  const savings = item.price - value;

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-[radial-gradient(circle_at_top,#fff6e9,#f2e9d8_58%)] pb-16">
      <Header />
      <div className="pointer-events-none absolute -left-16 top-36 z-0 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-52 z-0 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />

      <main id="lancamentos" className="relative z-10 w-full max-w-6xl px-4 pt-28 lg:px-8 lg:pt-32">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-sm lg:p-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#efe4d2]">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name || "Produto"}
                  width={1280}
                  height={900}
                  priority
                  className="h-85 w-full object-cover object-center lg:h-130"
                />
              )}
              {hasDiscount && (
                <div className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-sm font-bold tracking-wide text-white lg:text-base">
                  {item.discountPercent}% OFF
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--logo2)/60">
                Essencia artesanal
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-(--logo2) lg:text-4xl">
                {item.name}
              </h1>

              <div className="mt-5 space-y-3 rounded-2xl bg-[#f7efe2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-(--logo2)/60">
                  Valor final
                </p>
                <p className="text-4xl font-black tracking-tight text-(--logo2) lg:text-5xl">
                  {currency(value)}
                </p>
                {hasDiscount && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-(--logo2)/60 line-through">{currency(item.price)}</span>
                    <span className="rounded-full bg-linear-to-r from-red-500 to-orange-400 px-3 py-1 font-semibold text-white">
                      Economia {currency(savings)}
                    </span>
                  </div>
                )}
                <p className="text-sm text-(--logo2)/70">ou em 2x de {currency(value / 2)} sem juros</p>
              </div>

              <Link
                href={whatsapp(item, value)}
                className="mt-5 flex h-13 w-full items-center justify-center rounded-2xl bg-(--logo2) text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Image
                  src="/whatsapp.png"
                  alt="comprar"
                  width={36}
                  height={36}
                  className="mr-2 h-7 w-7 object-cover invert"
                />
                Pedir agora
              </Link>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-(--logo2)/80">
                <div className="rounded-xl border border-(--logo2)/10 bg-white p-2 text-center">
                  Entrega nacional
                </div>
                <div className="rounded-xl border border-(--logo2)/10 bg-white p-2 text-center">
                  Compra segura
                </div>
                <div className="rounded-xl border border-(--logo2)/10 bg-white p-2 text-center">
                  Produto artesanal
                </div>
                <div className="rounded-xl border border-(--logo2)/10 bg-white p-2 text-center">
                  Presenteavel
                </div>
              </div>
            </div>
          </div>
        </section>

        {item.description && (
          <section className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-sm lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--logo2)/60">
              Sobre o produto
            </p>
            <p className="mt-3 text-base leading-7 text-(--logo2)/90 lg:text-lg">
              {renderWhatsAppText(item.description)}
            </p>
          </section>
        )}

        <ScrollFadeIn>
          <section className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-sm lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--logo2)/60">
              Comentarios
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-(--logo2) lg:text-3xl">Quem comprou, recomenda</h2>

            {item.comments.length === 0 && (
              <p className="mt-3 text-sm text-(--logo2)/70">
                Este produto ainda nao possui comentarios cadastrados.
              </p>
            )}

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {item.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 rounded-2xl border border-(--logo2)/10 bg-white/85 p-4 shadow-sm"
                >
                  {comment.image ? (
                    <Image
                      src={comment.image}
                      alt={comment.name || "Cliente"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--logo2) text-lg font-bold text-white">
                      {getCommentInitial(comment.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-(--logo2)">{comment.name || "Cliente"}</p>
                    <p className="text-sm text-(--logo2)/80">{comment.phrase}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-4 text-xs font-medium uppercase tracking-wide text-(--logo2)/60 lg:text-sm">
            <p>Privacidade e seguranca</p>
            <p>Termos de uso</p>
            <p>Regulamentos</p>
            <p>Trabalhe conosco</p>
          </footer>
        </ScrollFadeIn>
      </main>
    </div>
  );
}
