'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Layers, MessageCircle, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string): boolean => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <Home size={18} /> },
    { label: 'Posts', href: '/admin', icon: <FileText size={18} /> },
    { label: 'Categorias', href: '/admin/categories', icon: <Layers size={18} /> },
    { label: 'Comentários', href: '/admin', icon: <MessageCircle size={18} /> },
    { label: 'Newsletter', href: '/admin', icon: <Bell size={18} /> },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Zentrixa
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <nav className="flex-1 hidden md:flex items-center gap-1 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button - Right */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto md:ml-4"
            title="Sair da conta"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
          </button>
        </div>

        {/* Mobile Navigation - Below header */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                isActive(item.href)
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

