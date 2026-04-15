"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { currency } from "@/utils/currency";

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

const applyDiscount = (price, discountPercent) => {
  return price * (1 - discountPercent / 100);
};

export default function ProductCard({ product, className = "" }) {
  const discountPercent = product.discountPercent || 0;
  const valorComDesconto = applyDiscount(product.price || 0, discountPercent);
  const value = discountPercent > 0 ? valorComDesconto : product.price;

  return (
    <Link
      href={`/pdp/${product.id}`}
      prefetch
      className={`flex flex-col rounded-2xl text-[var(--logo2)] p-1 mb-12 transition-all`}
    >
      <div className="relative h-80 overflow-hidden rounded-xl lg:h-80">
        <Image
          src={product.image || "/imagem1.jpg"}
          alt={product.name || "Produto"}
          width={500}
          height={500}
          priority
          className="h-full w-full object-cover object-center"
        />
        {discountPercent > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-[var(--logo1)] px-3 py-1 text-xs font-semibold text-[var(--logo2)] shadow-md lg:text-sm">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p
          className="text-3xl  overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name || "Produto sem nome"}
        </p>
        <p className="text-2xl whitespace-nowrap">{currency(value)}</p>
      </div>

      <p
        className="mt-2 text-base text-[var(--logo2)]/80 overflow-hidden min-h-12"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {renderWhatsAppText(product.description || "Aroma artesanal para transformar ambientes com aconchego.")}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex h-11 min-w-40 items-center justify-center rounded-full bg-[var(--logo2)] px-5 text-sm font-semibold uppercase tracking-wide text-[var(--logo1)]">
          Ver Detalhes
        </span>
        <span className="text-xl text-[var(--logo2)]/80"></span>
      </div>
    </Link>
  );
}
