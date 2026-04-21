'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDate, readingTime } from '@/lib/utils';
import { NewsletterForm } from '@/components/NewsletterForm';
import { TableOfContents } from '@/components/TableOfContents';
import { ArticleCard } from '@/components/ArticleCard';

// Mock data
const mockPostData: Record<string, any> = {
  'vs-code-15-extensoes-essenciais': {
    id: '1',
    title: 'VS Code: 15 Extensões Essenciais para Programadores Iniciantes',
    slug: 'vs-code-15-extensoes-essenciais',
    excerpt: 'Descubra as 15 extensões mais úteis do VS Code que todo programador iniciante deveria usar para aumentar sua produtividade.',
    author: 'Zentrix',
    category: 'Programação',
    image: '/images/article-1.jpg',
    created_at: new Date().toISOString(),
    content: `
# VS Code: 15 Extensões Essenciais para Programadores Iniciantes

Quando você começa a programar, uma das primeiras ferramentas que aprende é o Visual Studio Code (VS Code). É um editor leve, poderoso e versátil que se tornou o padrão da indústria. Mas o que realmente torna o VS Code especial é seu ecossistema de extensões.

Neste artigo, vou compartilhar as 15 extensões mais essenciais que todo programador iniciante deveria usar para aumentar sua produtividade e melhorar sua experiência de desenvolvimento.

## 1. Prettier - Code formatter

Prettier é um formatador de código opinativo que garante um estilo consistente em todo o seu projeto. Não precisa mais se preocupar com indentação ou espaçamento.

**Por que usar:** Economiza tempo e elimina discussões sobre estilo de código na equipe.

## 2. ESLint

ESLint é um linter JavaScript que ajuda a encontrar e corrigir problemas no seu código.

**Por que usar:** Detecta erros comuns e ajuda a manter a qualidade do código.

## 3. GitLens

GitLens integra Git no VS Code, mostrando informações de commits, histórico e alterações.

**Por que usar:** Facilita a navegação no histórico do projeto sem sair do editor.

## 4. Thunder Client

Cliente HTTP integrado no VS Code para testar APIs.

**Por que usar:** Não precisa abrir outro programa para testar endpoints.

## 5. Todo Tree

Destaca TODO, FIXME e outros comentários no código.

**Por que usar:** Visualiza rapidamente tarefas pendentes no projeto.

## 6. Path Intellisense

Autocomplete para caminhos de arquivo.

**Por que usar:** Aumenta a velocidade de navegação e evita erros de caminho.

## 7. Auto Rename Tag

Renomeia automaticamente tags HTML/XML ao editar.

**Por que usar:** Evita tags desemparelhadas.

## 8. Better Comments

Destaca comentários com cores diferentes para melhor legibilidade.

**Por que usar:** Organiza visualmente diferentes tipos de comentários.

## 9. Live Server

Servidor local para desenvolvimento web com reload automático.

**Por que usar:** Testa mudanças em tempo real no navegador.

## 10. REST Client

Testa APIs REST diretamente no VS Code.

**Por que usar:** Integração perfeita com o editor.

## 11. Peacock

Muda cores do editor para diferenciar workspaces.

**Por que usar:** Fácil identificar qual projeto está aberto.

## 12. Bracket Pair Colorizer

Colore chaves, colchetes e parênteses em pares.

**Por que usar:** Localiza rapidamente blocos de código correspondentes.

## 13. Code Runner

Executa código diretamente do editor.

**Por que usar:** Prototipa e testa código rapidamente.

## 14. Settings Sync

Sincroniza suas configurações do VS Code entre dispositivos.

**Por que usar:** Mesmo setup em qualquer máquina.

## 15. Extension Pack for Java

Pacote completo de ferramentas para desenvolvimento Java.

**Por que usar:** Se está aprendendo Java, tem tudo que precisa.

## Conclusão

Essas 15 extensões vão transformar sua experiência no VS Code, tornando o desenvolvimento mais rápido e agradável. Comece instalando as que faz mais sentido para o seu workflow e vá adicionando conforme necessário.

Qual é sua extensão favorita? Comente abaixo!
    `,
  },
  '10-ferramentas-ia-gratuitas-2025': {
    id: '2',
    title: '10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025',
    slug: '10-ferramentas-ia-gratuitas-2025',
    excerpt: 'Explore 10 ferramentas de IA que você pode usar gratuitamente para melhorar sua produtividade como dev ou criador de conteúdo.',
    author: 'Zentrix',
    category: 'Inteligência Artificial',
    image: '/images/article-2.jpg',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    content: `
# 10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025

A inteligência artificial não é mais um luxo. É agora uma necessidade para qualquer pessoa que quer aumentar sua produtividade. E o melhor: existem ótimas ferramentas **completamente gratuitas**.

Neste artigo, vou compartilhar 10 ferramentas de IA que você pode começar a usar hoje, sem gastar nada.

## 1. ChatGPT (Free Tier)

O ChatGPT oferece uma versão gratuita com capacidades impressionantes.

**Melhor para:** Escrita, brainstorming, programação, pesquisa.

## 2. Copilot (Bing)

Assistente de IA gratuito da Microsoft integrado no Bing e no Edge.

**Melhor para:** Busca com IA, escrita, análise.

## 3. Google Bard (Gemini)

Assistente de IA do Google com acesso a informações em tempo real.

**Melhor para:** Pesquisa, análise, criatividade.

## 4. Hugging Face

Plataforma com modelos de IA open-source gratuitos.

**Melhor para:** Desenvolvedores, machine learning.

## 5. Canva AI

Gerador de imagens com IA integrado no Canva.

**Melhor para:** Design, criação de imagens.

## 6. Grammarly

Verificador de gramática com IA.

**Melhor para:** Escrita, revisão de textos.

## 7. Runway ML

Suite de ferramentas criativas com IA.

**Melhor para:** Vídeo, imagens, criatividade visual.

## 8. Synthesia

Cria vídeos com avatares de IA.

**Melhor para:** Criação de vídeos, apresentações.

## 9. Stable Diffusion (open-source)

Modelo de geração de imagens open-source.

**Melhor para:** Designers, desenvolvedores, criadores.

## 10. LLaMA

Modelo de linguagem open-source do Meta.

**Melhor para:** Desenvolvedores que querem rodar localmente.

## Conclusão

A IA está democratizando a produtividade. Com essas 10 ferramentas gratuitas, você tem acesso a capacidades que era impensável ter alguns anos atrás.

A recomendação: comece com ChatGPT free e Gemini. São os mais versáteis e fáceis de usar.

Qual ferramenta você vai testar primeiro?
    `,
  },
  'ganhar-dinheiro-chatgpt-7-metodos': {
    id: '3',
    title: 'Como Ganhar Dinheiro com ChatGPT: 7 Métodos Comprovados em 2025',
    slug: 'ganhar-dinheiro-chatgpt-7-metodos',
    excerpt: 'Descubra 7 formas práticas e comprovadas de ganhar dinheiro usando ChatGPT em 2025.',
    author: 'Zentrix',
    category: 'Inteligência Artificial',
    image: '/images/article-3.jpg',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    content: `
# Como Ganhar Dinheiro com ChatGPT: 7 Métodos Comprovados em 2025

ChatGPT não é só uma ferramenta para responder perguntas. É uma máquina de fazer dinheiro se você souber como usar. Neste artigo, vou compartilhar 7 formas práticas e comprovadas de ganhar dinheiro com ChatGPT em 2025.

## 1. Freelancer - Escrita e Conteúdo

Plataformas como Upwork, Fiverr e Freelancer têm demanda constante por redatores. Use ChatGPT para:
- Escrever artigos
- Criar copy para vendas
- Produzir conteúdo para redes sociais
- Roteiros para vídeos

**Potencial de renda:** $500-5000/mês dependendo da qualidade

## 2. Email Marketing

Crie campanhas de email para empresas. ChatGPT acelera o processo.

**Como fazer:** Ofereça serviço de email copywriting em agências.

**Potencial de renda:** $1000-3000/projeto

## 3. Criador de Cursos

Use ChatGPT para criar conteúdo de cursos online.

**Plataformas:** Udemy, Teachable, Skillshare

**Potencial de renda:** $100-5000/mês por curso

## 4. Blog com Monetização

Crie um blog, use ChatGPT para gerar conteúdo otimizado para SEO.

**Monetização:** AdSense, afiliados, produtos digitais

**Potencial de renda:** $500-5000/mês (após 6 meses)

## 5. Consultoria

Ofereça consultoria a empresas sobre como usar IA.

**Para quem:** Pequenas empresas querendo implementar IA

**Potencial de renda:** $100-500/hora

## 6. Prompts Especializados

Crie e venda prompts otimizados em plataformas como Prompt Base.

**Como fazer:** Develop prompts que resolvem problemas específicos

**Potencial de renda:** $100-500 por prompt

## 7. Produtos Digitais

Crie e-books, templates, ferramentas usando ChatGPT como base.

**Plataformas:** Gumroad, SendOwl, Podia

**Potencial de renda:** $500-5000/mês

## Dicas Importantes

1. **Qualidade em primeiro lugar:** ChatGPT é um assistente, não uma solução completa
2. **Ética:** Sempre disclose quando usar IA
3. **Especialização:** Foque em nichos específicos
4. **Prática:** Teste diferentes métodos para ver o que funciona

## Conclusão

ChatGPT pode gerar renda real. Mas sucesso requer trabalho, estratégia e autenticidade. Comece hoje com o método que faz mais sentido para você.

Qual método você vai experimentar primeiro?
    `,
  },
};

const relatedPosts = [
  {
    id: '2',
    title: '10 Ferramentas de IA Gratuitas para Aumentar sua Produtividade em 2025',
    slug: '10-ferramentas-ia-gratuitas-2025',
    excerpt: 'Explore 10 ferramentas de IA que você pode usar gratuitamente para melhorar sua produtividade como dev ou criador de conteúdo.',
    content: 'Lorem ipsum...',
    category: 'Inteligência Artificial',
    image: '/images/article-2.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Como Ganhar Dinheiro com ChatGPT: 7 Métodos Comprovados em 2025',
    slug: 'ganhar-dinheiro-chatgpt-7-metodos',
    excerpt: 'Descubra 7 formas práticas e comprovadas de ganhar dinheiro usando ChatGPT em 2025.',
    content: 'Lorem ipsum...',
    category: 'Inteligência Artificial',
    image: '/images/article-3.jpg',
    author: 'Zentrix',
    published: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = mockPostData[slug];

  if (!post) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Artigo não encontrado</h1>
        <Link href="/blog" className="mt-6 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← Voltar para o blog
        </Link>
      </div>
    );
  }

  const readTime = readingTime(post.content);
  const tocItems = post.content.match(/^## (.*?)$/gm)?.map((h: string, i: number) => ({
    level: 2,
    text: h.replace('## ', ''),
    id: `heading-${i}`,
  })) || [];

  return (
    <article>
      {/* Hero */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 transition">
            ← Voltar para o blog
          </Link>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
            {post.category}
          </span>
          <span>Por {post.author}</span>
          <span>{formatDate(post.created_at)}</span>
          <span>•</span>
          <span>{readTime} min de leitura</span>
        </div>
      </div>

      {/* Image */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
          <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
            [Imagem do artigo - substituir com imagem real]
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose dark:prose-invert max-w-none">
              {post.content.split('\n').map((line: string, i: number) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={i} className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                      {line.replace('# ', '')}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.trim()) {
                  return (
                    <p key={i} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-12 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Não perca as melhores dicas sobre produtividade
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Receba conteúdo exclusivo e ferramentas recomendadas na sua caixa de entrada, sem spam.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* TOC */}
              {tocItems.length > 0 && <TableOfContents items={tocItems} />}

              {/* Related Articles */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Artigos relacionados</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relPost) => (
                    <Link
                      key={relPost.id}
                      href={`/blog/${relPost.slug}`}
                      className="block p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition"
                    >
                      <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        {relPost.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Compartilhar</h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                    Twitter
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition">
                    Link
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Comments Section (Placeholder) */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Comentários</h2>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-gray-950">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Seção de comentários - será implementada após configurar Supabase
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
