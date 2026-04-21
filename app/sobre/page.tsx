export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">Sobre o Zentrix</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            O Zentrix nasceu para descomplicar tecnologia. Nossa missão é entregar conteúdo prático, honesto e direto ao ponto sobre <strong>inteligência artificial, ferramentas digitais e produtividade</strong> para criadores e devs.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Para quem escrevemos</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Programadores iniciantes, estudantes, criadores de conteúdo e qualquer pessoa que quer usar a tecnologia para trabalhar melhor — e ganhar dinheiro online de forma sustentável.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Nossos valores</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white block mb-1">Honestidade:</strong>
                <span className="text-gray-700 dark:text-gray-300">reviews reais, sem hype. Marcamos sempre quando algo é afiliado.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white block mb-1">Praticidade:</strong>
                <span className="text-gray-700 dark:text-gray-300">conteúdo que você usa hoje mesmo. Não cursos caros, mas soluções reais.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white block mb-1">Acessibilidade:</strong>
                <span className="text-gray-700 dark:text-gray-300">linguagem clara, sem jargão desnecessário. Tudo explicado.</span>
              </div>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Como nos sustentamos</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Através de Google AdSense e links de afiliados (sempre marcados). Nunca recomendamos algo que não usamos ou acreditamos. Você sempre tem a opção de usar um ad blocker — sem rancor 😊
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Conecte-se conosco</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Dúvidas, sugestões ou quer colaborar? Nos encontre nas redes:
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Twitter</a>
            <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">LinkedIn</a>
            <a href="mailto:contato@zentr1xa.com" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">Email</a>
          </div>
        </div>
      </div>
    </div>
  );
}
