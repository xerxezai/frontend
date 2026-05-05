interface FilterSummaryProps {
  searchTerm: string;
  selectedCategory: string;
  selectedTags: string[];
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

const FilterSummary = ({
  searchTerm,
  selectedCategory,
  selectedTags,
  filteredCount,
  totalCount,
  onClearFilters,
}: FilterSummaryProps) => {
  const hasFilters = searchTerm || selectedCategory || selectedTags.length > 0;

  if (!hasFilters) return null;

  return (
      <div className="filter-summary mb-4 p-3 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Active Filters:</strong>
            {searchTerm && (
              <span className="badge bg-primary ms-2">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="badge bg-success ms-2">
                Category: {selectedCategory}
              </span>
            )}
            {selectedTags.map((tag) => (
              <span key={tag} className="badge bg-info ms-2">
                Tag: {tag}
              </span>
            ))}
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        </div>
        <small className="text-muted">
          Showing {filteredCount} of {totalCount} posts
        </small>
      </div>
  );
};

export default FilterSummary;
