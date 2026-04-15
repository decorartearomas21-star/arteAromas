import Link from "next/link";
import { Header } from "@/components/Header/Header";
import { notoSerif } from "@/app/fonts";

const StaticPage = ({ eyebrow, title, description, sections, action }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7eb,#f2e9d8_55%)] text-[var(--logo2)]">
      <Header disable />

      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 lg:px-6">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_20px_80px_rgba(75,56,41,0.08)] backdrop-blur-sm">
          <div className="border-b border-black/5 px-6 py-8 lg:px-10">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--logo2)]/50">
              {eyebrow}
            </p>
            <h1 className={`${notoSerif.className} mt-3 text-3xl font-semibold leading-tight lg:text-5xl`}>
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--logo2)]/80 lg:text-base">
              {description}
            </p>
            {action ? (
              <div className="mt-6">
                <Link
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center rounded-full bg-[var(--logo2)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--logo1)] transition-transform hover:scale-[1.02]"
                >
                  {action.label}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 px-6 py-8 lg:px-10">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[24px] border border-black/5 bg-white/80 p-5 shadow-sm"
              >
                <h2 className="text-sm font-black uppercase tracking-[0.24em] text-[var(--logo2)]/60">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--logo2)]/85">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items?.length ? (
                    <ul className="space-y-2 pl-5">
                      {section.items.map((item) => (
                        <li key={item} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaticPage;
