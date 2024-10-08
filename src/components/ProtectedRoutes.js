// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from '/pages/utils/auth.js';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  return isLoggedIn() ? children : null;
};

export default ProtectedRoute;

// Usage in a page file:
// import ProtectedRoute from '../components/ProtectedRoute';
//
// const DashboardPage = () => {
//   return (
//     <ProtectedRoute>
//       <h1>Dashboard</h1>
//       {/* Dashboard content */}
//     </ProtectedRoute>
//   );
// };