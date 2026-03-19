import { Header } from "@/components/Header/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <Header />
      <main className="flex flex-1 w-full">
        <Image
          src="/banner.jpg"
          alt="banner"
          width={1000}
          height={20}
          priority
          className="h-200 w-full object-cover object-center"
        />
      </main>
    </div>
  );
}
