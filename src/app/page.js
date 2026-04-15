import TestimonialSection from "@/components/CarouselRow";
import CarouselText from "@/components/CarouselText";
import { Header } from "@/components/Header/Header";
import HomeGallerySection from "@/components/HomeGallerySection";
import HomeProductsHydrator from "@/components/HomeProductsHydrator";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ProductCard from "@/components/ProductCard";
import { getHomeData } from "@/app/actions/home";
import { notoSerif } from "@/app/fonts";
import { sanitizeImageSrc, sanitizeLinkHref } from "@/utils/url";
import Image from "next/image";
import Link from "next/link";

const toCategorySlug = (category) =>
  String(category || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const BANNER_MAX_HEIGHT = 602;

export default async function Home({ searchParams }) {
  const homeData = await getHomeData();
  const resolvedSearchParams = (await searchParams) || {};
  const selectedCategorySlug = String(resolvedSearchParams?.categoria || "").trim();
  const selectedLinhaSlug = String(resolvedSearchParams?.linha || "").trim();

  const categoryMap = new Map(
    homeData.products
      .map((product) => String(product?.category || "").trim())
      .filter(Boolean)
      .map((category) => [toCategorySlug(category), category]),
  );

  const selectedCategoryLabel = selectedCategorySlug
    ? categoryMap.get(selectedCategorySlug) || ""
    : "";
  const bannerTitle = homeData.banner?.title?.trim() || "Transforme sua casa em um refugio acolhedor";
  const bannerSubTitle = homeData.banner?.subTitle?.trim() || "Velas artesanais com aromas unicos";
  const bannerImage = sanitizeImageSrc(homeData.banner?.imageUrl, "/banner.jpg");
  const primaryButtonText = homeData.banner?.primaryButtonText || "Compre Agora";
  const primaryButtonLink = sanitizeLinkHref(homeData.banner?.primaryButtonLink, "#lancamentos");
  const secondaryButtonText = homeData.banner?.secondaryButtonText || "Ver Colecoes";
  const secondaryButtonLink = sanitizeLinkHref(homeData.banner?.secondaryButtonLink, "/home");

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden bg-[radial-gradient(circle_at_top,#fff6e9,#f2e9d8_58%)]">
      <div className="pointer-events-none absolute -left-16 top-168 z-0 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-260 z-0 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <HomeProductsHydrator products={homeData.products} />
      <header className="relative flex flex-1 w-full items-center justify-center">
        <Header />
        <div
          id="banner"
          className="relative flex w-full flex-col items-center"
          style={{ height: `min(100vh, ${BANNER_MAX_HEIGHT}px)` }}
        >
          <div className="absolute flex h-full w-full items-center justify-center">
            <div className=" w-full lg:w-200 p-4 slideReveal">
              <p className={`${notoSerif.className} text-4xl lg:text-6xl text-(--logo1) text-shadow-lg font-bold`}>
                {bannerTitle}
              </p>
              <p className="text-1xl lg:text-2xl text-(--logo1) text-shadow-lg my-4 font-bold">
                {bannerSubTitle}
              </p>

              <div className="flex gap-4 mt-6">
                <Link
                  href={primaryButtonLink}
                  className="bg-(--logo1) rounded-sm text-(--logo2) py-2 px-4"
                >
                  {primaryButtonText}
                </Link>
                <Link
                  href={secondaryButtonLink}
                  className="border-2 border-(--logo1) rounded-sm text-(--logo1) py-2 px-4 "
                >
                  {secondaryButtonText}
                </Link>
              </div>

              <div className="flex w-full gap-2 lg:w-150 justify-between mt-10">
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-(--logo1) text-shadow-md mt-4">
                  <Image
                    src="/shipping-fast-solid-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 lg:h-6 lg:w-6 fade rounded-sm"
                  />
                  Entregas para todo Brasil
                </p>
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-(--logo1) text-shadow-md mt-4">
                  <Image
                    src="/security-verified-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 lg:h-6 lg:w-6 rounded-full fade"
                  />{" "}
                  Compra Segura
                </p>
              </div>
              <div className="flex w-full gap-2 lg:w-150 justify-between">
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-(--logo1) text-shadow-md mt-4">
                  <Image
                    src="/art-design-paint-pallet-format-text-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 lg:h-6 lg:w-6 fade"
                  />{" "}
                  Produto Artesanal
                </p>

                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-(--logo1) text-shadow-md mt-4">
                  <Image
                    src="/present-svgrepo-com.png"
                    alt="banner"
                    width={500}
                    height={500}
                    priority
                    className="h-4 w-4 lg:h-6 lg:w-6 fade"
                  />{" "}
                  Ideal para presente
                </p>
              </div>
            </div>
          </div>
          <Image
            src={bannerImage}
            alt="banner"
            width={1000}
            height={20}
            priority
            className="h-full w-full object-cover object-center fade"
          />
        </div>
      </header>
      <main id="lancamentos" className="relative w-full max-w-7xl px-2 pb-10 pt-6 fade lg:px-6">
        <ScrollFadeIn>
          <section className="rounded-3xl border border-white/60 bg-white/65 p-3 shadow-xl backdrop-blur-sm lg:p-5">
            <CarouselText phrases={homeData.texts} />
          </section>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <p className={`${notoSerif.className} text-3xl lg:text-4xl font-medium mt-8 mb-4 px-2 lg:px-5`}>
            Lançamentos
          </p>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <section className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-sm lg:p-5">
            <div className="flex gap-4 overflow-x-auto px-2 pb-2 lg:px-2 lg:overflow-visible">
              {homeData.launches.length === 0 && (
                <p className="text-gray-500 px-4">Nenhum lancamento cadastrado no painel.</p>
              )}
              {homeData.launches.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="w-50 shrink-0 lg:w-65"
                />
              ))}
            </div>
          </section>
        </ScrollFadeIn>
        <HomeGallerySection
          products={homeData.products}
          selectedCategorySlug={selectedCategorySlug}
          selectedCategoryLabel={selectedCategoryLabel}
          initialSelectedLinhaSlug={selectedLinhaSlug}
          titleClassName={`${notoSerif.className} mt-10 mb-4 px-2 text-3xl font-medium lg:px-5 lg:text-4xl`}
        />

        {homeData.comments.length > 0 && (
          <>
            <ScrollFadeIn>
              <p className={`${notoSerif.className} text-3xl lg:text-3xl font-medium mt-10 mb-4 px-2 lg:px-5`}>
                Comentários
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <section className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-sm lg:p-5">
                <TestimonialSection comments={homeData.comments} />
              </section>
            </ScrollFadeIn>
          </>
        )}
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
