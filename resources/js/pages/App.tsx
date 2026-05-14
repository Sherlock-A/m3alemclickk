import { lazy, Suspense } from 'react';

const AdminDashboardPage = lazy(() => import('./Dashboard/AdminDashboardPage'));
const ProfessionalDashboardPage = lazy(() => import('./Dashboard/ProfessionalDashboardPage'));

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard/admin')) {
    return (
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>}>
        <AdminDashboardPage />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>}>
      <ProfessionalDashboardPage />
    </Suspense>
  );
}
