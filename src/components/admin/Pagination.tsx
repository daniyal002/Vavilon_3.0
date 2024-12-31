import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenresPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: GenresPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-purple-900/30 gap-4">
      <div className="text-xs md:text-sm text-purple-300 text-center md:text-left">
        Показано {(currentPage - 1) * itemsPerPage + 1} -{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
      </div>
      <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 md:p-2 bg-purple-900/50 rounded-lg text-purple-200 
            hover:bg-purple-800/50 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="md:w-5 md:h-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-sm ${
              currentPage === page
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 md:p-2 bg-purple-900/50 rounded-lg text-purple-200 
            hover:bg-purple-800/50 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
