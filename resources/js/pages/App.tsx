import ProfessionalDashboardPage from './Dashboard/ProfessionalDashboardPage';
import AdminDashboardPage from './Dashboard/AdminDashboardPage';

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard/admin')) {
    return <AdminDashboardPage />;
  }
  return <ProfessionalDashboardPage />;
}
