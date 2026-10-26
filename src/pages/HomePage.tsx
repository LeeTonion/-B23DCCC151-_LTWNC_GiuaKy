import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchBooks, borrowBook, returnBook } from '../features/books/booksSlice';
import { useFilterStore } from '../features/filter/filterStore';
import { BookCard } from '../components/BookCard';
import { FilterBar } from '../components/FilterBar';
import { BorrowStatusBanner } from '../components/BorrowStatusBanner';
import { AlertCircle, RefreshCw, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBookIds, status, error } = useAppSelector((state) => state.books);
  const { searchQuery, selectedCategory } = useFilterStore();

  const [simulateError, setSimulateError] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks(simulateError));
    }
  }, [dispatch, status, simulateError]);

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks(simulateError));
  }, [dispatch, simulateError]);

  const handleBorrow = useCallback((bookId: string) => {
    dispatch(borrowBook(bookId));
  }, [dispatch]);

  const handleReturn = useCallback((bookId: string) => {
    dispatch(returnBook(bookId));
  }, [dispatch]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      const matchesQuery =
        normalizedQuery === '' ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="icon-xs" />
            <span>Hệ thống Quản lý Thư viện Số</span>
          </div>
          <h1 className="hero-title">Tra cứu & Mượn sách Chuyên ngành</h1>
          <p className="hero-subtitle">
            Hỗ trợ sinh viên khoa tra cứu tài liệu học tập, giáo trình CNTT, Kinh tế và Ngoại ngữ nhanh chóng, theo dõi hạn mượn và số bản khả dụng theo thời gian thực.
          </p>

          <div className="api-test-panel">
            <span className="api-test-label">Thử nghiệm API:</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="api-test-mode-text">
              {simulateError ? '⚠️ Chế độ Giả lập Lỗi API' : '✅ Chế độ Hoạt động Bình thường'}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleRetry}
              title="Gọi lại API với thiết lập hiện tại"
            >
              <RefreshCw className="icon-xs" />
              <span>Gọi lại API</span>
            </button>
          </div>
        </div>
      </section>

      <BorrowStatusBanner />

      <FilterBar totalResults={filteredBooks.length} />

      {status === 'loading' && (
        <div className="state-panel loading-panel" role="status">
          <Loader2 className="spinner-icon" />
          <h3 className="state-title">Đang tải danh sách sách...</h3>
          <p className="state-desc">Đang kết nối API giả lập thư viện (độ trễ 500ms)...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="state-panel error-panel" role="alert">
          <div className="error-icon-wrapper">
            <AlertTriangle className="error-icon" />
          </div>
          <h3 className="state-title">Không thể tải dữ liệu thư viện!</h3>
          <p className="state-desc">{error}</p>
          <div className="error-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <RefreshCw className="icon-sm" />
              <span>Thử lại ngay</span>
            </button>
            {simulateError && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSimulateError(false);
                  dispatch(fetchBooks(false));
                }}
              >
                Tắt chế độ lỗi & Tải lại
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          {filteredBooks.length === 0 ? (
            <div className="state-panel empty-panel">
              <AlertCircle className="empty-icon" />
              <h3 className="state-title">Không tìm thấy sách phù hợp</h3>
              <p className="state-desc">
                Không có đầu sách nào khớp với từ khóa &ldquo;{searchQuery}&rdquo; trong danh mục đã chọn. Vui lòng thử tìm từ khóa khác hoặc xóa bộ lọc.
              </p>
            </div>
          ) : (
            <div className="books-grid" id="books-list" aria-label="Danh sách sách">
              {filteredBooks.map((book) => {
                const isBorrowed = borrowedBookIds.includes(book.id);
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    isBorrowed={isBorrowed}
                    onBorrow={handleBorrow}
                    onReturn={handleReturn}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
