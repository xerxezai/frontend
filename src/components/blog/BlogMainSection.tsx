import { blogMainPosts } from "../../data";
import { useState, useMemo, useEffect } from "react";
import FilterSummary from "./FilterSummary";
import BlogPostList from "./BlogPostList";
import BlogPagination from "./BlogPagination";
import BlogSidebar from "./BlogSidebar";

const BlogMainSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const categories = useMemo(() => {
    const categoryCount: { [key: string]: number } = {};
    blogMainPosts.forEach((post) => {
      categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
    });
    return categoryCount;
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogMainPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, []);

  const totalBlogComment = useMemo(
    () => blogMainPosts.reduce((sum, post) => sum + (post.comments ?? 0), 0),
    [blogMainPosts]
  );


  // Filter posts based on search, category, and tags
  const filteredPosts = useMemo(() => {
    return blogMainPosts.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || post.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTags]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const ResetSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  return (
    <section className="blog-wrapper section-padding">
      <div className="container">
        <div className="news-area">
          <div className="row">
            <div className="col-12 col-lg-8">
              <FilterSummary
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                filteredCount={filteredPosts.length}
                totalCount={blogMainPosts.length}
                onClearFilters={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedTags([]);
                  setCurrentPage(1);
                }}
              />

              <BlogPostList
                posts={paginatedPosts}
                isEmpty={filteredPosts.length === 0}
                onClearFilters={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedTags([]);
                  setCurrentPage(1);
                }}
                resetFunction={ResetSearch}
                totalBlogComment={totalBlogComment}
              />

              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  document
                    .querySelector(".blog-posts")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                show={filteredPosts.length > 0 && totalPages > 1}
              />
            </div>

            <div className="col-12 col-lg-4">
              <BlogSidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setSelectedTags([]);
                }}
                selectedTags={selectedTags}
                onTagsChange={(tags) => {
                  setSelectedTags(tags);
                  setSelectedCategory("");
                }}
                categories={categories}
                allTags={allTags}
                recentPosts={blogMainPosts.slice(0, 3)}
                totalPosts={blogMainPosts.length}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogMainSection;
