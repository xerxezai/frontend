interface TagsWidgetProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsWidget = ({
  allTags,
  selectedTags,
  onTagsChange,
}: TagsWidgetProps) => {
  const handleTagClick = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    let newTags: string[];

    if (isSelected) {
      // Remove tag if already selected
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      // Add tag if not selected
      newTags = [...selectedTags, tag];
    }

    onTagsChange(newTags);
  };

  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  return (
    <div className="single-sidebar-widget">
        <div className="wid-title fade-in">
          <h3>Popular Tags</h3>
        </div>
        <div className="tagcloud fade-in">
          {allTags.map((tag) => (
            <a
              key={tag}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTagClick(tag);
              }}
              className={isTagSelected(tag) ? "selected-tag" : ""}
            >
              {tag}
            </a>
          ))}
        </div>

        {/* Optional: Show selected tags count */}
        {selectedTags.length > 0 && (
          <div className="selected-tags-info mt-2">
            <small className="text-muted">
              {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}{" "}
              selected
            </small>
          </div>
        )}
    </div>
  );
};

export default TagsWidget;
