import React from 'react';
import type { Book } from '../types/book';
import { BookOpen, User, Calendar, BookmarkCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  disableBorrow?: boolean;
}

export const BookCard: React.FC<BookCardProps> = React.memo(({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
  disableBorrow = false,
}) => {
  const isOutOfStock = book.availableCopies <= 0;

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'CNTT':
        return 'badge-cntt';
      case 'Kinh tế':
        return 'badge-kinhte';
      case 'Ngoại ngữ':
        return 'badge-ngoaingu';
      default:
        return 'badge-default';
    }
  };

  return (
    <article
      className={`book-card ${isBorrowed ? 'book-card--borrowed' : ''} ${isOutOfStock ? 'book-card--out' : ''}`}
      data-testid={`book-card-${book.id}`}
    >
      <div className="book-card-header">
        <span className={`category-badge ${getCategoryBadgeClass(book.category)}`}>
          {book.category}
        </span>
        <span className="book-isbn">ISBN: {book.isbn}</span>
      </div>

      <div className="book-card-body">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        <div className="book-meta">
          <div className="meta-item">
            <User className="icon-sm" />
            <span className="meta-text" title={book.author}>{book.author}</span>
          </div>
          <div className="meta-item">
            <Calendar className="icon-sm" />
            <span className="meta-text">Năm: {book.publicationYear}</span>
          </div>
        </div>

        <p className="book-description">
          {book.description || 'Không có mô tả chi tiết cho đầu sách này.'}
        </p>
      </div>

      <div className="book-card-footer">
        <div className="copies-info">
          <span className="copies-label">Số bản còn lại:</span>
          <span
            className={`copies-count ${isOutOfStock ? 'copies-count--zero' : ''}`}
            data-testid="available-copies"
          >
            {book.availableCopies} / {book.totalCopies}
          </span>
        </div>

        <div className="book-actions">
          {isBorrowed ? (
            <button
              type="button"
              className="btn btn-return"
              onClick={() => onReturn(book.id)}
              aria-label={`Trả sách ${book.title}`}
            >
              <CheckCircle2 className="icon-sm" />
              <span>Trả sách</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-borrow"
              onClick={() => onBorrow(book.id)}
              disabled={isOutOfStock || disableBorrow}
              aria-label={`Mượn sách ${book.title}`}
            >
              {isOutOfStock ? (
                <>
                  <AlertCircle className="icon-sm" />
                  <span>Hết sách</span>
                </>
              ) : (
                <>
                  <BookOpen className="icon-sm" />
                  <span>Mượn sách</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isBorrowed && (
        <div className="borrowed-indicator">
          <BookmarkCheck className="icon-xs" />
          <span>Bạn đang mượn cuốn này</span>
        </div>
      )}
    </article>
  );
});

BookCard.displayName = 'BookCard';
