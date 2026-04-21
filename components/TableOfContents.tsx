interface TOCItem {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items.length) return null;

  return (
    <nav className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Índice</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
            <a
              href={`#${item.id}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
