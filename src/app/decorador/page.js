import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md">
      <Image
        src="/logo.jpg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
        className="w-full h-48 md:w-48 md:h-auto object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Aprendendo Tailwind</h2>
        <p className="mt-2 text-gray-600">
          No mobile, este texto fica abaixo da imagem. No desktop (md+), ele
          pula para o lado.
        </p>
      </div>
    </div>
  );
}
