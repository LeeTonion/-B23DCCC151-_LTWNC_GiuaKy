import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { returnBook } from '../features/books/booksSlice';
import type { BookCategory, CategoryStatistics } from '../types/book';
import {
  BarChart3,
  BookOpen,
  Layers,
  BookCheck,
  RotateCcw,
  Library,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBookIds } = useAppSelector((state) => state.books);

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const categoryTitleCounts = useMemo<CategoryStatistics>(() => {
    const stats: CategoryStatistics = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (stats[book.category] !== undefined) {
        stats[book.category] += 1;
      }
    });

    return stats;
  }, [books]);

  const categoryCopiesStats = useMemo(() => {
    const stats: Record<BookCategory, { total: number; available: number }> = {
      CNTT: { total: 0, available: 0 },
      'Kinh tế': { total: 0, available: 0 },
      'Ngoại ngữ': { total: 0, available: 0 },
    };

    books.forEach((book) => {
      if (stats[book.category]) {
        stats[book.category].total += book.totalCopies;
        stats[book.category].available += book.availableCopies;
      }
    });

    return stats;
  }, [books]);

  const totalTitles = books.length;
  const totalPhysicalCopies = useMemo(
    () => books.reduce((sum, b) => sum + b.totalCopies, 0),
    [books]
  );
  const totalAvailableCopies = useMemo(
    () => books.reduce((sum, b) => sum + b.availableCopies, 0),
    [books]
  );

  const borrowedBooks = useMemo(
    () => books.filter((book) => borrowedBookIds.includes(book.id)),
    [books, borrowedBookIds]
  );

  const categories: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  const getCategoryColor = (cat: BookCategory) => {
    switch (cat) {
      case 'CNTT':
        return '#2563eb';
      case 'Kinh tế':
        return '#059669';
      case 'Ngoại ngữ':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="page-container stats-page">
      <div className="stats-header">
        <div className="stats-header-icon">
          <BarChart3 className="icon-lg text-primary" />
        </div>
        <div>
          <h1 className="stats-title">Báo cáo & Thống kê Thư viện</h1>
          <p className="stats-subtitle">
            Tổng quan số lượng đầu sách chuyên ngành, tỉ lệ sẵn có và tình trạng mượn sách của sinh viên
          </p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon--blue">
            <Library className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tổng số đầu sách</span>
            <span className="kpi-value">{totalTitles}</span>
            <span className="kpi-subtext">3 chuyên ngành chính</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon--green">
            <BookOpen className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tổng số bản sách vật lý</span>
            <span className="kpi-value">{totalPhysicalCopies}</span>
            <span className="kpi-subtext">{totalAvailableCopies} bản đang sẵn sàng</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon--purple">
            <Layers className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Sách bạn đang mượn</span>
            <span className="kpi-value">{borrowedBooks.length} / 3</span>
            <span className="kpi-subtext">
              {borrowedBooks.length === 3 ? 'Đã đạt giới hạn tối đa' : `Còn mượn được ${3 - borrowedBooks.length} cuốn`}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon--orange">
            <TrendingUp className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tỉ lệ sách khả dụng</span>
            <span className="kpi-value">
              {totalPhysicalCopies > 0
                ? Math.round((totalAvailableCopies / totalPhysicalCopies) * 100)
                : 0}
              %
            </span>
            <span className="kpi-subtext">Trên toàn hệ thống</span>
          </div>
        </div>
      </div>

      <section className="stats-section" aria-label="Thống kê theo thể loại">
        <div className="section-title-wrapper">
          <Award className="icon-sm text-primary" />
          <h2 className="section-title">Số đầu sách và số bản theo từng thể loại</h2>
        </div>

        <div className="category-stats-grid">
          {categories.map((cat) => {
            const titleCount = categoryTitleCounts[cat];
            const copies = categoryCopiesStats[cat];
            const percentage = totalTitles > 0 ? Math.round((titleCount / totalTitles) * 100) : 0;
            const availableRate = copies.total > 0 ? Math.round((copies.available / copies.total) * 100) : 0;

            return (
              <div key={cat} className="category-stat-card">
                <div className="cat-card-header">
                  <div className="cat-badge-with-dot">
                    <span
                      className="cat-dot"
                      style={{ backgroundColor: getCategoryColor(cat) }}
                    />
                    <h3 className="cat-name">{cat}</h3>
                  </div>
                  <span className="cat-percentage">{percentage}% tổng đầu sách</span>
                </div>

                <div className="cat-numbers">
                  <div className="cat-num-item">
                    <span className="cat-num-val">{titleCount}</span>
                    <span className="cat-num-lbl">Đầu sách</span>
                  </div>
                  <div className="cat-num-item">
                    <span className="cat-num-val">{copies.available} / {copies.total}</span>
                    <span className="cat-num-lbl">Bản khả dụng</span>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-labels">
                    <span>Mức độ sẵn sàng</span>
                    <span>{availableRate}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${availableRate}%`,
                        backgroundColor: getCategoryColor(cat),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats-section" aria-label="Danh sách sách đang mượn">
        <div className="section-title-wrapper">
          <BookCheck className="icon-sm text-primary" />
          <h2 className="section-title">
            Danh sách sách bạn đang mượn ({borrowedBooks.length} cuốn)
          </h2>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="empty-borrow-card">
            <BookOpen className="empty-icon" />
            <h3>Hiện tại bạn chưa mượn cuốn sách nào</h3>
            <p>Mỗi sinh viên được mượn tối đa 3 cuốn sách chuyên ngành cùng lúc tại thư viện khoa.</p>
            <Link to="/" className="btn btn-primary">
              Đến trang tra cứu để mượn sách
            </Link>
          </div>
        ) : (
          <div className="borrowed-table-wrapper">
            <table className="borrowed-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Năm XB</th>
                  <th>Hạn mượn dự kiến</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <strong className="table-book-title">{book.title}</strong>
                      <div className="table-book-isbn">ISBN: {book.isbn}</div>
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span className={`category-badge badge-${book.category.toLowerCase().replace(/\s+/g, '')}`}>
                        {book.category}
                      </span>
                    </td>
                    <td>{book.publicationYear}</td>
                    <td>
                      <span className="badge-due">14 ngày (Gia hạn tự động)</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-return"
                        onClick={() => handleReturn(book.id)}
                        aria-label={`Trả sách ${book.title}`}
                      >
                        <RotateCcw className="icon-xs" />
                        <span>Trả sách</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StatsPage;
