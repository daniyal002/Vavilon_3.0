import { Search } from 'lucide-react';

interface GenresTableControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export function TableControls({
  searchQuery,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
}: GenresTableControlsProps) {
  return (
    <div className="bg-purple-950/50 rounded-xl p-4 md:p-6 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full pl-10 pr-4 py-2 bg-purple-900/50 border border-purple-700/30 rounded-lg 
                text-purple-200 placeholder-purple-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-purple-200 text-sm">Показывать по:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="flex-1 md:flex-none bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-200 
              p-2 focus:outline-none focus:border-purple-500"
          >
            {[5, 10, 15, 20].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
