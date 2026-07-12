import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../lib/utils';

interface NotificationBellProps {
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ onClick, className }: NotificationBellProps) {
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none transition-colors duration-200',
        className
      )}
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
export default NotificationBell;
