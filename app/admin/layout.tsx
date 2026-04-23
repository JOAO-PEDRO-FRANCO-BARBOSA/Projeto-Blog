import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { getAdminUserFromCookies } from '@/lib/admin-auth';

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const auth = await getAdminUserFromCookies();

  if (auth.status === 'auth_failed') {
    redirect('/login?error=auth_failed');
  }

  if (!auth.user) {
    redirect('/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
