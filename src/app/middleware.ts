import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setBorrowAlert, type BooksState } from '../features/books/booksSlice';

interface RootStateShape {
  books: BooksState;
}

export const maxBorrowLimitMiddleware: Middleware<{}, RootStateShape> = (storeAPI) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = storeAPI.getState();
    const targetBookId = action.payload;
    const currentBorrowed = state.books.borrowedBookIds;
    const targetBook = state.books.items.find((book) => book.id === targetBookId);

    if (currentBorrowed.includes(targetBookId)) {
      storeAPI.dispatch(
        setBorrowAlert(`Bạn đã đang mượn cuốn "${targetBook?.title || 'này'}" rồi. Mỗi đầu sách chỉ mượn 1 bản!`)
      );
      return;
    }

    if (currentBorrowed.length >= 3) {
      storeAPI.dispatch(
        setBorrowAlert(
          'CẢNH BÁO: Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc! Vui lòng trả bớt sách trước khi mượn cuốn mới.'
        )
      );
      return;
    }

    if (targetBook && targetBook.availableCopies <= 0) {
      storeAPI.dispatch(
        setBorrowAlert(`Cuốn "${targetBook.title}" hiện tại đã hết bản tại thư viện!`)
      );
      return;
    }
  }

  return next(action);
};
