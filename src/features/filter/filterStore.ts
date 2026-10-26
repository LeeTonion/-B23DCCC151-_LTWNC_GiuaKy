import { create } from 'zustand';
import type { BookCategoryFilter } from '../../types/book';

interface FilterState {
  searchQuery: string;
  selectedCategory: BookCategoryFilter;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: BookCategoryFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategory: 'Tất cả',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: BookCategoryFilter) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: '', selectedCategory: 'Tất cả' }),
}));
