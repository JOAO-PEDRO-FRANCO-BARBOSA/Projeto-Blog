export default function ToolsPage() {
  const tools = [
    {
      name: 'ChatGPT',
      category: 'IA',
      price: 'Free / $20',
      description: 'Modelo de linguagem conversacional para múltiplas tarefas',
      link: 'https://chat.openai.com',
    },
    {
      name: 'Claude',
      category: 'IA',
      price: 'Free / $20',
      description: 'Excelente para textos longos e análise de documentos',
      link: 'https://claude.ai',
    },
    {
      name: 'Notion',
      category: 'Produtividade',
      price: 'Free / $10+',
      description: 'Workspace tudo-em-um com IA integrada',
      link: 'https://notion.so',
    },
    {
      name: 'VS Code',
      category: 'Programação',
      price: 'Grátis',
      description: 'O editor de código mais usado do mundo',
      link: 'https://code.visualstudio.com',
    },
    {
      name: 'Perplexity',
      category: 'IA',
      price: 'Free / $20',
      description: 'Buscador com IA e fontes citadas',
      link: 'https://perplexity.ai',
    },
    {
      name: 'Canva',
      category: 'Design',
      price: 'Free / $12',
      description: 'Design gráfico com IA integrada',
      link: 'https://canva.com',
    },
  ];

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ferramentas Recomendadas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Seleção curada de ferramentas testadas pela equipe. Alguns links são de afiliados e ajudam a manter o blog.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tool.name}</h3>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {tool.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">{tool.price}</span>
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  Acessar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
