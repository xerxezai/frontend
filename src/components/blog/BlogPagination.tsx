interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  show: boolean;
}

const BlogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  show,
}: PaginationProps) => {
  if (!show) return null;

  return (
    <div className="page-nav-wrap text-center fade-in">
      <ul>
        {currentPage > 1 && (
          <li>
            <a
              className="page-numbers"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
            >
              <i className="far fa-long-arrow-left"></i>
            </a>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <a
              className={`page-numbers ${currentPage === page ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page.toString().padStart(2, "0")}
            </a>
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <a
              className="page-numbers"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
            >
              <i className="far fa-long-arrow-right"></i>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};
export default BlogPagination;
