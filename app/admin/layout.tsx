import { redirect } from 'next/navigation';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAccessTokenFromCookies, verifyAdminToken } from '@/lib/admin-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth verification
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    redirect('/admin/login');
  }

  // Verify token is still valid
  const authResult = await verifyAdminToken(accessToken);
  if (!authResult.user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Fixed Header */}
      <AdminHeader />

      {/* Main Content with minimal top padding */}
      <main className="pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
