interface SearchWidgetProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchWidget = ({ searchTerm, onSearchChange }: SearchWidgetProps) => {
  return (
    <div className="single-sidebar-widget">
      <div className="wid-title fade-in">
        <h3>Search</h3>
      </div>
      <div className="search_widget fade-in">
        <form>
          <input
            type="text"
            placeholder="Keywords here...."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="button">
            <i className="fal fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchWidget;
