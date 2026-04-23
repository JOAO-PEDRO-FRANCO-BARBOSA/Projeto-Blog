'use client';

import { CategoryModal } from '@/components/admin/CategoryModal';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Fixed Header */}
      <AdminHeader />

      {/* Main Content with top padding for fixed header */}
      <main className="pt-16">
        {children}
      </main>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
