import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Leaf, Users, Shield, Trophy, FileBarChart, Settings, LogOut, Compass } from 'lucide-react';
import { AppRoutes } from '../constants/routes';
import { useAuthContext } from '../context/AuthContext';
import { cn } from '../lib/utils';

export function Sidebar() {
  const { logout, user } = useAuthContext();

  const links = [
    { name: 'Dashboard', path: AppRoutes.DASHBOARD, icon: LayoutDashboard },
    { name: 'Environmental', path: AppRoutes.ENVIRONMENTAL, icon: Leaf },
    { name: 'Social', path: AppRoutes.SOCIAL, icon: Users },
    { name: 'Governance', path: AppRoutes.GOVERNANCE, icon: Shield },
    { name: 'Leaderboards', path: AppRoutes.GAMIFICATION, icon: Trophy },
    { name: 'Reports', path: AppRoutes.REPORTS, icon: FileBarChart },
    { name: 'Settings', path: AppRoutes.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card text-card-foreground flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="h-16 px-6 border-b border-border/50 flex items-center space-x-2">
          <Compass className="h-6 w-6 text-emerald-500" />
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </div>

        {/* User Mini Profile */}
        {user && (
          <div className="px-6 py-4 border-b border-border/40 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              {user.firstName[0]}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">{user.role}</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary/60 hover:text-foreground',
                    {
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': isActive,
                      'text-muted-foreground': !isActive,
                    }
                  )
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout option at the bottom */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/5 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
