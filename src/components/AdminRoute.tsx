import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../data/firebase';

const AdminRoute: React.FC = () => {
  const context = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult(true); // Force refresh token
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [context?.user]);

  if (isAdmin === null) {
    return <div>Checking permissions...</div>; // Or a loading spinner
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;