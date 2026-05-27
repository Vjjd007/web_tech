import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
