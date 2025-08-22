import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary dark:bg-dark-primary">
      <Navbar />
      <main className="flex-grow">
        {/* All your nested routes will be rendered here */}
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" />
      <Footer />
    </div>
  );
};

export default MainLayout;