import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageClassName?: string;
  summaryClassName?: string;
  showSummaryOnly?: boolean; // Add this
  showPagesOnly?: boolean;   // Add this
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageClassName = '',
  summaryClassName = '',
  showSummaryOnly = false,
  showPagesOnly = false,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pages.filter(page => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  // Add ellipsis where needed
  const pagesWithEllipsis = visiblePages.reduce((acc: (number | string)[], page, i) => {
    if (i === 0) {
      acc.push(page);
      return acc;
    }
    const prevPage = visiblePages[i - 1];
    if (page - prevPage > 1) {
      acc.push('...');
    }
    acc.push(page);
    return acc;
  }, []);

  // Only show summary
  if (showSummaryOnly) {
    return (
      <p className={`text-sm text-neutral-700 ${summaryClassName}`}>
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </p>
    );
  }

  // Only show page numbers
  if (showPagesOnly) {
    return (
      <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/20" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-all duration-200"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {pagesWithEllipsis.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700`}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl ${pageClassName} ${
                currentPage === page
                  ? 'z-10 bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg'
                  : 'text-neutral-900 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-all duration-200"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    );
  }

  // Default: show both (for mobile)
  return (
    <div className="flex items-center justify-between w-full">
      <p className={`text-sm text-neutral-700 ${summaryClassName}`}>
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </p>
      <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/20" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-all duration-200"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {pagesWithEllipsis.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700`}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl ${pageClassName} ${
                currentPage === page
                  ? 'z-10 bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg'
                  : 'text-neutral-900 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-all duration-200"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;