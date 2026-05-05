interface CategoriesWidgetProps {
  categories: { [key: string]: number };
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalPosts: number;
}

const CategoriesWidget = ({
  categories,
  selectedCategory,
  onCategoryChange,
  totalPosts,
}: CategoriesWidgetProps) => {
  const handleCategoryClick = (category: string) => {
    // Toggle category selection - if same category is clicked, deselect it
    const newCategory = category === selectedCategory ? "" : category;
    onCategoryChange(newCategory);
  };

  return (
    <div className="single-sidebar-widget">
      <div className="wid-title fade-in">
        <h3>Categories</h3>
      </div>
      <div className="widget_categories fade-in">
        <ul>
          {/* All Categories option */}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCategoryChange("");
              }}
            >
              All Categories{" "}
              <span>{totalPosts.toString().padStart(2, "0")}</span>
            </a>
          </li>

          {/* Individual Categories */}
          {Object.entries(categories).map(([category, count]) => (
            <li key={category}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category);
                }}
              >
                {category} <span>{count.toString().padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesWidget;
