import { ProductsProvider } from "@/context/ProductsContext";
import { inter, notoSerif, roboto } from "@/app/fonts";
import { getSiteOrigin } from "@/utils/url";
import "./globals.css";

const siteOrigin = getSiteOrigin();

export const metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Decor Arte Aromas",
  description: "Velas e itens para relaxar & transformar ambientes.",
  manifest: "/manifest.json",
  icons: {
    apple: [
      {
        url: "logo.jpg", 
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "ComandaGo",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${notoSerif.className} min-h-full flex flex-col`}>
        <ProductsProvider>{children}</ProductsProvider>
      </body>
    </html>
  );
}
