import Image from 'next/image';
import Link from 'next/link';
import { Code2, Lightbulb, PenSquare } from 'lucide-react';

const skills = [
  {
    title: 'Desenvolvimento Web',
    description: 'Experiências web rápidas, escaláveis e intuitivas com foco em performance e SEO.',
    icon: Code2,
  },
  {
    title: 'Conteúdo Estratégico',
    description: 'Temas complexos transformados em guias práticos para ajudar devs e criadores a evoluírem mais rápido.',
    icon: PenSquare,
  },
  {
    title: 'IA e Produtividade',
    description: 'Ferramentas e fluxos com IA para reduzir esforço operacional e aumentar resultado real.',
    icon: Lightbulb,
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-60">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute right-0 top-52 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-500/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <header className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Sobre</p>
          <h1 className="mt-3 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl">
            Sobre o Zentrixa
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
            O Zentrixa é um espaço onde tecnologia, inteligência artificial e produtividade se encontram
            para gerar conteúdo útil de verdade. A proposta é simples: menos hype, mais clareza, mais ação.
          </p>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-cyan-200/60 via-blue-200/40 to-indigo-200/50 p-2 dark:border-gray-700 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-indigo-500/20">
              <Image
                src="/Zentrixa_Logo.png"
                alt="Logo oficial do Zentrixa"
                fill
                className="rounded-[1.3rem] object-contain p-3"
                sizes="224px"
                priority
              />
            </div>
            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
              Logo oficial do Zentrixa.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A história por trás do projeto</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                O Zentrixa nasceu da vontade de criar um blog que realmente ajudasse pessoas a aplicarem tecnologia no
                dia a dia, sem enrolação e sem promessas vazias. Cada artigo é pensado para ser objetivo e prático.
              </p>
              <p>
                Trabalhamos para ligar tendências a casos reais: IA aplicada a fluxo de trabalho, ferramentas digitais que
                poupam tempo e estratégias de execução que aumentam produtividade.
              </p>
              <p>
                O foco está em entregar valor contínuo para programadores, criadores e profissionais que querem ganhar
                vantagem competitiva através de conhecimento aplicado.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-12">
          <header className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">O que eu faço</h2>
            <p className="mt-2 max-w-2xl text-gray-700 dark:text-gray-300">
              Três frentes principais que orientam o conteúdo e a construção do Zentrixa.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {skills.map((skill) => {
              const Icon = skill.icon;

              return (
                <article
                  key={skill.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-cyan-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{skill.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg dark:border-cyan-500/30 dark:from-blue-700 dark:to-cyan-700 sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Vamos construir algo incrível juntos?</h2>
          <p className="mt-3 max-w-2xl text-sm text-blue-50 sm:text-base">
            Se tens uma ideia, dúvida ou queres acompanhar conteúdos práticos sobre tecnologia, IA e produtividade,
            fale conosco ou subscreva para não perder os próximos artigos e novidades.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:zentrixa512@gmail.com"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Entrar em contato
            </a>
            <Link
              href="/#newsletter"
              className="rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Subscrever newsletter
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
