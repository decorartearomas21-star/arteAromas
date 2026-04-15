import TestimonialSection from "@/components/CarouselRow";
import CarouselText from "@/components/CarouselText";
import { Header } from "@/components/Header/Header";
import HomeProductsHydrator from "@/components/HomeProductsHydrator";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ProductCard from "@/components/ProductCard";
import { getHomeData } from "@/app/actions/home";
import { notoSerif } from "@/app/fonts";
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

  const linhaMap = new Map(
    homeData.products
      .map((product) => String(product?.linha || "").trim())
      .filter(Boolean)
      .map((linha) => [toCategorySlug(linha), linha]),
  );

  const selectedCategoryLabel = selectedCategorySlug
    ? categoryMap.get(selectedCategorySlug) || ""
    : "";

  const selectedLinhaLabel = selectedLinhaSlug
    ? linhaMap.get(selectedLinhaSlug) || ""
    : "";

  const galleryProducts = selectedCategoryLabel
    ? homeData.products.filter(
        (product) => toCategorySlug(product?.category || "") === selectedCategorySlug,
      )
    : homeData.products;

  const filteredGalleryProducts = selectedLinhaLabel
    ? galleryProducts.filter(
        (product) => String(product?.linha || "").trim() === selectedLinhaLabel,
      )
    : galleryProducts;

  const galleryTitle = selectedCategoryLabel
    ? `Galeria ${selectedCategoryLabel}`
    : "Galeria";
  const bannerTitle = homeData.banner?.title?.trim() || "Transforme sua casa em um refugio acolhedor";
  const bannerSubTitle = homeData.banner?.subTitle?.trim() || "Velas artesanais com aromas unicos";
  const bannerImage = homeData.banner?.imageUrl || "/banner.jpg";
  const primaryButtonText = homeData.banner?.primaryButtonText || "Compre Agora";
  const primaryButtonLink = homeData.banner?.primaryButtonLink || "#lancamentos";
  const secondaryButtonText = homeData.banner?.secondaryButtonText || "Ver Colecoes";
  const secondaryButtonLink = homeData.banner?.secondaryButtonLink || "/home";

  return (
    <div className="flex flex-col items-center">
      <HomeProductsHydrator products={homeData.products} />
      <header className="flex flex-1 w-full items-center justify-center">
        <Header />
        <div id="banner" className="w-full relative flex flex-col items-center">
          <div className=" absolute w-full flex justify-center items-center h-screen">
            <div className=" w-full lg:w-[800px] p-4 slideReveal">
              <p className={`${notoSerif.className} text-4xl lg:text-6xl text-[var(--logo1)] text-shadow-lg font-bold`}>
                {bannerTitle}
              </p>
              <p className="text-1xl lg:text-2xl text-[var(--logo1)] text-shadow-lg my-4 font-bold">
                {bannerSubTitle}
              </p>

              <div className="flex gap-4 mt-6">
                <Link
                  href={primaryButtonLink}
                  className="bg-[var(--logo1)] rounded-sm text-[var(--logo2)] py-2 px-4"
                >
                  {primaryButtonText}
                </Link>
                <Link
                  href={secondaryButtonLink}
                  className="border-2 border-[var(--logo1)] rounded-sm text-[var(--logo1)] py-2 px-4 "
                >
                  {secondaryButtonText}
                </Link>
              </div>

              <div className="flex w-full gap-2 lg:w-[600px] justify-between mt-10">
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
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
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
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
              <div className="flex w-full gap-2 lg:w-[600px] justify-between">
                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
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

                <p className="flex w-full items-center gap-2 text-sm lg:text-1xl text-[var(--logo1)] text-shadow-md mt-4">
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
            className="h-screen w-full object-cover object-center fade"
          />
          <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #F2E9D8)" }} />
        </div>
      </header>
      <main id="lancamentos" className="w-full lg:w-7xl pt-4 fade">
        <ScrollFadeIn>
          <CarouselText phrases={homeData.texts} />
        </ScrollFadeIn>

        <ScrollFadeIn>
          <p className={`${notoSerif.className} text-3xl lg:text-4xl font-medium mt-4 mb-4 px-2 lg:px-10`}>
            Lançamentos
          </p>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <div className="flex gap-4 overflow-x-auto px-2 pb-2 lg:px-10 lg:overflow-visible">
            {homeData.launches.length === 0 && (
              <p className="text-gray-500 px-4">Nenhum lancamento cadastrado no painel.</p>
            )}
            {homeData.launches.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[200px] shrink-0 lg:w-[260px]"
              />
            ))}
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <p
            id="galeria"
            className={`${notoSerif.className} text-3xl lg:text-4xl font-medium mt-10 mb-4 px-2 lg:px-10`}
          >
            {galleryTitle}
          </p>
        </ScrollFadeIn>

        {linhaMap.size > 0 && (
          <ScrollFadeIn>
            <div className="flex items-center gap-3 px-2 lg:px-10 mt-2 mb-4 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--logo2)]/50 mr-1">Linha</span>
              <Link
                href={selectedCategorySlug ? `?categoria=${selectedCategorySlug}` : "?"}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  !selectedLinhaSlug
                    ? "bg-[var(--logo2)] text-[var(--logo1)] border-[var(--logo2)]"
                    : "border-[var(--logo2)]/30 text-[var(--logo2)] hover:border-[var(--logo2)]"
                }`}
              >
                Todas
              </Link>
              {[...linhaMap.entries()].map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`?${selectedCategorySlug ? `categoria=${selectedCategorySlug}&` : ""}linha=${slug}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    selectedLinhaSlug === slug
                      ? "bg-[var(--logo2)] text-[var(--logo1)] border-[var(--logo2)]"
                      : "border-[var(--logo2)]/30 text-[var(--logo2)] hover:border-[var(--logo2)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </ScrollFadeIn>
        )}

        <div className="grid grid-cols-1 gap-5 mt-4 px-2 lg:px-10 lg:grid-cols-3">
          {filteredGalleryProducts.map((product) => (
            <ScrollFadeIn key={product.id}>
              <ProductCard product={product} className="w-full" />
            </ScrollFadeIn>
          ))}
          {filteredGalleryProducts.length === 0 && (
            <p className="text-gray-500 col-span-1 lg:col-span-3 text-center py-8">
              {selectedLinhaLabel
                ? `Nenhum produto encontrado na linha ${selectedLinhaLabel}.`
                : selectedCategoryLabel
                ? `Nenhum produto encontrado na categoria ${selectedCategoryLabel}.`
                : "Nenhum produto cadastrado no painel."}
            </p>
          )}
        </div>

        {homeData.comments.length > 0 && (
          <>
            <ScrollFadeIn>
              <p className={`${notoSerif.className} text-3xl lg:text-3xl font-medium mt-10 mb-4 px-2 lg:px-10`}>
                Comentários
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <TestimonialSection comments={homeData.comments} />
            </ScrollFadeIn>
          </>
        )}
        <ScrollFadeIn>
          <div className="flex w-full text-sm justify-between gap-4 p-2 mt-4">
            <p className="">Privacidade e seguranca</p>
            <p className="">Termos de uso</p>
            <p className="">Regulamentos</p>
            <p className="">Trabalhe conosco</p>
          </div>
        </ScrollFadeIn>
      </main>
    </div>
  );
}
