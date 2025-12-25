import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPaginationRange } from '../../utils/getPaginationRange';

interface PaginationProps {
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
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Генерируем массив страниц с многоточиями
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-purple-900/30 gap-4 rounded-xl">
      {/* Текст статистики */}
      <div className="text-xs md:text-sm text-purple-300 text-center md:text-left">
        Показано <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
        <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> из{' '}
        <span className="font-semibold text-white">{totalItems}</span>
      </div>

      {/* Кнопки управления */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 md:p-2 bg-purple-900/50 rounded-lg text-purple-200
            hover:bg-purple-800/50 transition-colors disabled:opacity-30
            disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>

        {paginationRange.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-purple-400">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[36px] h-9 px-2 rounded-lg transition-all text-sm font-medium ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/50'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 md:p-2 bg-purple-900/50 rounded-lg text-purple-200
            hover:bg-purple-800/50 transition-colors disabled:opacity-30
            disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}