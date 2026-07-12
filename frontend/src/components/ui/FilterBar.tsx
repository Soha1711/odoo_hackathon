import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FilterBarProps {
  onSearchChange?: (val: string) => void;
  onDeptChange?: (val: string) => void;
  onDateChange?: (start: string, end: string) => void;
  departments?: { id: string; name: string }[];
  searchPlaceholder?: string;
  className?: string;
}

export function FilterBar({
  onSearchChange,
  onDeptChange,
  onDateChange,
  departments = [],
  searchPlaceholder = 'Search records...',
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm mb-6',
        className
      )}
    >
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      )}

      {/* Dropdowns / Date filters */}
      <div className="flex flex-wrap items-center gap-3">
        {onDeptChange && departments.length > 0 && (
          <select
            onChange={(e) => onDeptChange(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        {onDateChange && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              onChange={(e) => onDateChange(e.target.value, '')}
              className="h-10 px-2 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground text-xs">to</span>
            <input
              type="date"
              onChange={(e) => onDateChange('', e.target.value)}
              className="h-10 px-2 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default FilterBar;
