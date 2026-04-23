'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, FileText, Layers, Bell, LogOut, X } from 'lucide-react';
import { CategoryModal } from '@/components/admin/CategoryModal';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string): boolean => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <Home size={20} /> },
    { label: 'Posts', href: '/admin', icon: <FileText size={20} /> },
    { label: 'Categorias', href: '#', icon: <Layers size={20} />, onClick: () => setIsCategoryModalOpen(true) },
    { label: 'Newsletter', href: '/admin', icon: <Bell size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Logo/Branding */}
        <div className="px-6 py-8 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zentrixa
          </h1>
          <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold">Admin</h2>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <FileText size={24} />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-950 text-white">
          {children}
        </main>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
