interface CategoryBadgeProps {
  name: string;
  slug: string;
  onClick?: (slug: string) => void;
}

export function CategoryBadge({ name, slug, onClick }: CategoryBadgeProps) {
  return (
    <button
      onClick={() => onClick?.(slug)}
      className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
    >
      {name}
    </button>
  );
}
