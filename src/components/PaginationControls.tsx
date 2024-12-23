import { useMemo } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onLimitChange?: (limit: number) => void;
  showItemsPerPage?: boolean;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onLimitChange,
  showItemsPerPage = true,
}: PaginationControlsProps) {
  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = window.innerWidth < 640 ? 1 : 2; // Smaller delta on mobile

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current page
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const rangeText = useMemo(() => {
    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end} of ${totalItems}`;
  }, [currentPage, itemsPerPage, totalItems]);

  const pageSizeOptions = useMemo(() => [10, 25, 50, 100], []);

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile Layout */}
      <div className="flex flex-col-reverse gap-4 sm:hidden">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="dashboard-button-secondary px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>

          {pageNumbers.map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1">...</span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(Number(pageNum))}
                className={`px-3 py-1 ${
                  pageNum === currentPage
                    ? 'dashboard-button bg-[var(--primary)] text-white'
                    : 'dashboard-button-secondary'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="dashboard-button-secondary px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--textSecondary)]">
            {rangeText}
          </div>
          
          {showItemsPerPage && onLimitChange && (
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="form-select"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-[var(--textSecondary)]">per page</span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--textSecondary)]">
          Showing {rangeText} results
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="dashboard-button-secondary px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>

          {pageNumbers.map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(Number(pageNum))}
                className={`px-3 py-1 ${
                  pageNum === currentPage
                    ? 'dashboard-button bg-[var(--primary)] text-white'
                    : 'dashboard-button-secondary'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="dashboard-button-secondary px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {showItemsPerPage && onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--textSecondary)]">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="form-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-[var(--textSecondary)]">entries</span>
          </div>
        )}
      </div>
    </div>
  );
} 