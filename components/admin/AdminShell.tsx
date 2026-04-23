'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { Bell, FileText, Home, LogOut, MessageSquare, X } from 'lucide-react';

interface AdminNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  const navItems: AdminNavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <Home size={20} /> },
    { label: 'Posts', href: '/admin/posts', icon: <FileText size={20} /> },
    { label: 'Comentários', href: '/admin/comments', icon: <MessageSquare size={20} /> },
    { label: 'Newsletter', href: '/admin/newsletter', icon: <Bell size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-800 bg-gray-900 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white md:hidden"
        >
          <X size={24} />
        </button>

        <div className="border-b border-gray-800 px-6 py-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            Zentrixa
          </h1>
          <p className="mt-1 text-sm text-gray-400">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-800 px-4 py-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-gray-800"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden md:pl-72">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-4 md:hidden">
          <h2 className="font-semibold text-white">Admin</h2>
          <button onClick={() => setIsMobileSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <FileText size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-auto bg-gray-950 text-white">{children}</main>
      </div>
    </div>
  );
}
