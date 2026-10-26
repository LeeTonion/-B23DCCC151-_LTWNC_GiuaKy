import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useFilterStore } from '../features/filter/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import type { BookCategoryFilter } from '../types/book';

const CATEGORIES: BookCategoryFilter[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

interface FilterBarProps {
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalResults }) => {
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, resetFilters } =
    useFilterStore();

  const [localInput, setLocalInput] = useState(searchQuery);

  const debouncedInput = useDebounce<string>(localInput, 300);

  useEffect(() => {
    setSearchQuery(debouncedInput);
  }, [debouncedInput, setSearchQuery]);

  const handleClearSearch = () => {
    setLocalInput('');
    setSearchQuery('');
  };

  return (
    <section className="filter-bar" aria-label="Bộ lọc và tìm kiếm sách">
      <div className="filter-container">
        <div className="search-box-wrapper">
          <div className="search-input-group">
            <Search className="search-icon" />
            <input
              type="text"
              id="book-search-input"
              className="search-input"
              placeholder="Tìm theo tên sách hoặc tác giả (vd: Cấu trúc dữ liệu, Uncle Bob...)..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              aria-label="Tìm kiếm sách theo tên hoặc tác giả"
            />
            {localInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Xoá từ khóa tìm kiếm"
              >
                <X className="icon-xs" />
              </button>
            )}
          </div>
        </div>

        <div className="category-filter-group" role="group" aria-label="Lọc theo thể loại">
          <div className="filter-label">
            <Filter className="icon-xs" />
            <span>Thể loại:</span>
          </div>

          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'category-chip--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {(localInput || selectedCategory !== 'Tất cả') && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setLocalInput('');
                resetFilters();
              }}
              title="Đặt lại bộ lọc về mặc định"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        <div className="filter-results-count">
          Tìm thấy <strong>{totalResults}</strong> đầu sách phù hợp
        </div>
      </div>
    </section>
  );
};
