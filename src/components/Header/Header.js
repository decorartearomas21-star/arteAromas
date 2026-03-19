"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LiGroup = ({ isOpen, setIsOpen }) => (
  <li
    className="relative group"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
  >
    {/* Gatilho: No desktop é Hover, no Mobile pode ser Clique */}
    <button
      className="flex items-center gap-1 text-gray-600 group-hover:text-blue-600 transition-colors py-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      Produtos
      <svg
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      className={`
        absolute left-[-10px] w-48 pt-2
        ${isOpen ? "block" : "hidden"} 
        md:group-hover:block
      `}
    >
      <ul className="bg-[var(--background)] border border-gray-100 rounded-lg shadow-xl overflow-hidden">
        <li>
          <Link
            href="/eletronicos"
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Eletrônicos
          </Link>
        </li>
        <li>
          <Link
            href="/roupas"
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Roupas
          </Link>
        </li>
        <li>
          <Link
            href="/acessorios"
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Acessórios
          </Link>
        </li>
      </ul>
    </div>
  </li>
);

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="shadow-sm sticky top-0 z-50 w-full bg-[var(--background)]">
      <nav className="container mx-auto flex items-center justify-center w-full">
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Inicio
            </Link>
          </li>
          <LiGroup isOpen={isOpen} setIsOpen={setIsOpen} />
          <li>
            <Link href="/">
              <Image
                src="/logo.jpg"
                alt="logo"
                width={50}
                height={20}
                priority
                className="w-full md:h-auto object-cover"
              />
            </Link>
          </li>
          <li>
            <Link
              href="/contato"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              instagram
            </Link>
          </li>
          <li>
            <Link
              href="/contato"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contato
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
