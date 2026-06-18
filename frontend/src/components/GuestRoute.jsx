import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import Loader from './Loader';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (isAuthenticated) {
    const redirect = user.role === ROLES.ADMIN ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default GuestRoute;
