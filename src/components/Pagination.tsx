interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageClassName?: string;      // Add this line
  summaryClassName?: string;   // Add this line
}