import React from 'react';
import { Layers, CheckCircle, Info, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { returnBook } from '../features/books/booksSlice';

export const BorrowStatusBanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, borrowedBookIds } = useAppSelector((state) => state.books);

  const borrowedBooks = items.filter((book) => borrowedBookIds.includes(book.id));
  const maxSlots = 3;

  return (
    <section className="borrow-status-banner" aria-label="Tình trạng mượn sách của sinh viên">
      <div className="borrow-status-header">
        <div className="borrow-status-title">
          <Layers className="icon-sm text-primary" />
          <span>Sách bạn đang mượn ({borrowedBooks.length}/{maxSlots} cuốn)</span>
        </div>
        <div className="borrow-status-note">
          <Info className="icon-xs" />
          <span>Quy chế thư viện: Mượn tối đa 3 cuốn cùng lúc (Kiểm soát bởi Redux Middleware)</span>
        </div>
      </div>

      <div className="borrow-slots-grid">
        {Array.from({ length: maxSlots }).map((_, index) => {
          const book = borrowedBooks[index];
          return (
            <div
              key={`slot-${index}`}
              className={`borrow-slot ${book ? 'borrow-slot--occupied' : 'borrow-slot--empty'}`}
            >
              <div className="slot-index-badge">Suất {index + 1}</div>
              {book ? (
                <div className="slot-content">
                  <div className="slot-book-info">
                    <h4 className="slot-book-title" title={book.title}>{book.title}</h4>
                    <span className="slot-book-author">{book.author} ({book.category})</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-slot-return"
                    onClick={() => dispatch(returnBook(book.id))}
                    title={`Trả cuốn "${book.title}"`}
                  >
                    <RotateCcw className="icon-xs" />
                    <span>Trả sách</span>
                  </button>
                </div>
              ) : (
                <div className="slot-empty-content">
                  <span className="slot-pulse-beacon" />
                  <CheckCircle className="slot-empty-icon" />
                  <span>Vị trí trống — bạn có thể mượn thêm</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
