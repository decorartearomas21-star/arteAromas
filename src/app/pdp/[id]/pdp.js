"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getProductById } from "@/app/actions/products";
import { Header } from "@/components/Header/Header";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { DEFAULT_PRODUCT_HIGHLIGHTS, normalizeProductHighlightsPayload } from "@/lib/product-highlights";
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

const ShareIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 458.624 458.624"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M339.588,314.529c-14.215,0-27.456,4.133-38.621,11.239l-112.682-78.67c1.809-6.315,2.798-12.976,2.798-19.871c0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764,8.356,26.133,13.286,41.662,13.286c39.79,0,72.047-32.257,72.047-72.047C411.634,32.258,379.378,0,339.588,0c-39.79,0-72.047,32.257-72.047,72.047c0,5.255,0.578,10.373,1.646,15.308l-112.424,78.491c-10.974-6.759-23.892-10.666-37.727-10.666c-39.79,0-72.047,32.257-72.047,72.047s32.256,72.047,72.047,72.047c13.834,0,26.753-3.907,37.727-10.666l113.292,79.097c-1.629,6.017-2.514,12.34-2.514,18.872c0,39.79,32.257,72.047,72.047,72.047c39.79,0,72.047-32.257,72.047-72.047C411.635,346.787,379.378,314.529,339.588,314.529z" />
  </svg>
);

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

export default function PagePdp({ productId, productHighlights }) {
  const { getProductById: getCachedProductById, isHydrated, upsertProduct } = useProducts();
  const [fallbackItem, setFallbackItem] = useState(null);
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryScrollRef = useRef(null);
  const galleryDragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
  });
  const cachedItem = getCachedProductById(productId);
  const highlightItems = normalizeProductHighlightsPayload(productHighlights);

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

  const galleryImages = useMemo(() => {
    if (!item) return [];

    return [item.image, ...(Array.isArray(item.images) ? item.images : [])]
      .map((image) => String(image || "").trim())
      .filter(Boolean)
      .slice(0, 5);
  }, [item]);

  useEffect(() => {
    const nextIndex = Math.min(activeImageIndex, Math.max(galleryImages.length - 1, 0));
    setActiveImageIndex(nextIndex);
  }, [activeImageIndex, galleryImages.length]);

  useEffect(() => {
    setActiveImageIndex(0);

    const galleryElement = galleryScrollRef.current;
    if (galleryElement) {
      galleryElement.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [item?.id]);

  const handleGalleryScroll = () => {
    const galleryElement = galleryScrollRef.current;
    if (!galleryElement) return;

    const nextIndex = Math.round(galleryElement.scrollLeft / galleryElement.clientWidth);
    const clampedIndex = Math.min(Math.max(nextIndex, 0), Math.max(galleryImages.length - 1, 0));

    setActiveImageIndex(clampedIndex);
  };

  const scrollToGalleryImage = (index) => {
    const galleryElement = galleryScrollRef.current;
    const clampedIndex = Math.min(Math.max(index, 0), Math.max(galleryImages.length - 1, 0));

    setActiveImageIndex(clampedIndex);

    if (!galleryElement) return;

    galleryElement.scrollTo({
      left: clampedIndex * galleryElement.clientWidth,
      behavior: "smooth",
    });
  };

  const handleGalleryPointerDown = (event) => {
    if (galleryImages.length <= 1 || event.button !== 0) return;

    const galleryElement = galleryScrollRef.current;
    if (!galleryElement) return;

    galleryDragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: galleryElement.scrollLeft,
    };

    galleryElement.setPointerCapture(event.pointerId);
  };

  const handleGalleryPointerMove = (event) => {
    const galleryElement = galleryScrollRef.current;
    const dragState = galleryDragRef.current;

    if (!galleryElement || !dragState.isDragging || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    const distance = event.clientX - dragState.startX;
    galleryElement.scrollLeft = dragState.startScrollLeft - distance;
  };

  const finishGalleryDrag = (event) => {
    const galleryElement = galleryScrollRef.current;
    const dragState = galleryDragRef.current;

    if (!galleryElement || dragState.pointerId !== event.pointerId) return;

    const dragDistance = event.clientX - dragState.startX;
    const galleryWidth = galleryElement.clientWidth || 1;
    const swipeThreshold = Math.max(40, galleryWidth * 0.12);
    const currentIndex = Math.round(galleryElement.scrollLeft / galleryWidth);
    let targetIndex = currentIndex;

    if (Math.abs(dragDistance) > swipeThreshold) {
      targetIndex = dragDistance > 0 ? currentIndex - 1 : currentIndex + 1;
    }

    targetIndex = Math.min(Math.max(targetIndex, 0), Math.max(galleryImages.length - 1, 0));

    galleryDragRef.current = {
      isDragging: false,
      pointerId: null,
      startX: 0,
      startScrollLeft: 0,
    };

    if (galleryElement.hasPointerCapture(event.pointerId)) {
      galleryElement.releasePointerCapture(event.pointerId);
    }

    if (galleryImages.length > 0) {
      scrollToGalleryImage(targetIndex);
    }
  };

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-[radial-gradient(circle_at_top,#fff6e9,#f2e9d8_60%)]">
        <Header disable />
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

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: item.name || "Decor Arte Aromas",
      text: item.name ? `Veja este produto: ${item.name}` : "Veja este produto",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Link compartilhado");
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus("Link copiado");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setShareStatus("Link copiado");
    }
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-[radial-gradient(circle_at_top,#fff6e9,#f2e9d8_58%)] pb-16">
      <Header disable />
      <div className="pointer-events-none absolute -left-16 top-36 z-0 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-52 z-0 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />

      <main id="lancamentos" className="relative z-10 w-full max-w-6xl px-4 pt-24 lg:px-8 lg:pt-32">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-sm lg:p-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#efe4d2]">
              <div
                ref={galleryScrollRef}
                onScroll={handleGalleryScroll}
                onPointerDown={handleGalleryPointerDown}
                onPointerMove={handleGalleryPointerMove}
                onPointerUp={finishGalleryDrag}
                onPointerCancel={finishGalleryDrag}
                onPointerLeave={finishGalleryDrag}
                className="relative flex aspect-square w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden lg:aspect-[4/3]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
              >
                {galleryImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative min-w-full snap-center">
                    <Image
                      src={image}
                      alt={item.name || "Produto"}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      draggable={false}
                      className="select-none object-cover object-center"
                    />
                  </div>
                ))}
                {galleryImages.length === 0 && (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-(--logo2)/40">
                    Sem imagens
                  </div>
                )}
              </div>

              {hasDiscount && (
                <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-black/80 px-3 py-1 text-sm font-bold tracking-wide text-white lg:text-base">
                  {item.discountPercent}% OFF
                </div>
              )}

              {galleryImages.length > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-center justify-center px-4">
                  <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md">
                    {galleryImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => scrollToGalleryImage(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          activeImageIndex === index
                            ? "w-8 bg-white"
                            : "w-2.5 bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Ver imagem ${index + 1}`}
                        aria-current={activeImageIndex === index}
                      />
                    ))}
                  </div>
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
                  Por apenas
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
                <p className="text-sm text-(--logo2)/70">Pagamento via pix</p>
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

              <button
                type="button"
                onClick={handleShare}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-(--logo2)/15 bg-white/90 text-sm font-semibold text-(--logo2) transition-all hover:-translate-y-0.5 hover:border-(--logo2)/30 hover:shadow-md"
                aria-label="Compartilhar produto"
              >
                <ShareIcon className="h-4 w-4" />
                Compartilhar
              </button>
              {shareStatus && (
                <p className="mt-2 text-center text-xs font-medium text-(--logo2)/60">
                  {shareStatus}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-(--logo2)/80">
                {(highlightItems.length ? highlightItems : DEFAULT_PRODUCT_HIGHLIGHTS).map((item) => (
                  <div key={item.id} className="rounded-xl border border-(--logo2)/10 bg-white p-2 text-center">
                    {item.label}
                  </div>
                ))}
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
          <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/60 bg-white/70 p-4 text-xs font-medium uppercase tracking-wide text-(--logo2)/60 lg:text-sm">
            <Link href="/privacidade-e-seguranca" className="transition-colors hover:text-[var(--logo2)]">
              Privacidade e seguranca
            </Link>
            <Link href="/termos-de-uso" className="transition-colors hover:text-[var(--logo2)]">
              Termos de uso
            </Link>
            <Link href="/regulamentos" className="transition-colors hover:text-[var(--logo2)]">
              Regulamentos
            </Link>
            <Link href="/trabalhe-conosco" className="transition-colors hover:text-[var(--logo2)]">
              Trabalhe conosco
            </Link>
          </div>
        </ScrollFadeIn>
      </main>
    </div>
  );
}
