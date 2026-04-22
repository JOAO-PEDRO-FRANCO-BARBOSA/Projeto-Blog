import Link from 'next/link';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="bg-gray-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-6 pt-6 lg:px-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
        >
          Gerir Categorias
        </Link>
      </div>
      <AdminDashboard />
    </div>
  );
}
