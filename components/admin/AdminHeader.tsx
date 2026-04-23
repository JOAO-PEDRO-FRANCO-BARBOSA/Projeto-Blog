'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Layers, MessageCircle, Bell, LogOut } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string): boolean => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <Home size={18} />, isActive: isActive('/admin') },
    { label: 'Posts', href: '/admin', icon: <FileText size={18} />, isActive: isActive('/admin/posts') },
    { label: 'Categorias', href: '/admin/categories', icon: <Layers size={18} />, isActive: isActive('/admin/categories') },
    { label: 'Comentários', href: '/admin', icon: <MessageCircle size={18} />, isActive: isActive('/admin/comments') },
    { label: 'Newsletter', href: '/admin', icon: <Bell size={18} />, isActive: isActive('/admin/newsletter') },
  ];

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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/50 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zentrixa
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 ml-8">
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    item.isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/50 transition-colors ml-4"
            title="Sair"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
