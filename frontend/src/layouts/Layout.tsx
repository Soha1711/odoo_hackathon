import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Panel */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default Layout;
