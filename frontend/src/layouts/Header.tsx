import { useState } from 'react';
import { Sun, Moon, Sparkles, Trophy, X } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { useAuthContext } from '../context/AuthContext';
import { NotificationBell } from '../components/ui/NotificationBell';
import { useNotifications } from '../hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthContext();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 border-b border-border bg-card/65 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: user stats summary */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="hidden sm:flex items-center space-x-3 text-sm">
            <div className="flex items-center text-yellow-600 bg-yellow-500/10 px-2.5 py-1 rounded-full font-semibold border border-yellow-500/20">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{user.pointsBalance} pts</span>
            </div>
            <div className="flex items-center text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
              <Trophy className="h-4 w-4 mr-1 text-emerald-500" />
              <span>{user.xpBalance} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side: notifications & theme */}
      <div className="flex items-center space-x-3">
        <NotificationBell onClick={() => setIsDrawerOpen(true)} />

        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Slide-out notifications drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl p-6 z-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
                  <h3 className="font-bold text-base text-foreground">Notifications</h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground font-semibold">
                    {notifications.filter(n => !n.isRead).length} Unread
                  </span>
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Notifications list */}
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-10">All caught up!</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                          n.isRead
                            ? 'bg-secondary/20 border-border/50 opacity-70'
                            : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-foreground">{n.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-muted-foreground/80 block mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Header;
