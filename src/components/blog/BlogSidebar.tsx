import type { BlogDataType } from "../../types";
import SearchWidget from "./SearchWidget";
import RecentNewsWidget from "./RecentNewsWidget";
import CategoriesWidget from "./CategoriesWidget";
import TagsWidget from "./TagsWidget";

interface BlogSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  categories: { [key: string]: number };
  allTags: string[];
  recentPosts: BlogDataType[];
  totalPosts: number;
}

const BlogSidebar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  categories,
  allTags,
  recentPosts,
  totalPosts,
}: BlogSidebarProps) => {
  return (
    <div className="main-sidebar">
      <SearchWidget searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <RecentNewsWidget recentPosts={recentPosts} />

      <CategoriesWidget
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        totalPosts={totalPosts}
      />

      <TagsWidget
        allTags={allTags}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
      />
    </div>
  );
};
export default BlogSidebar;
