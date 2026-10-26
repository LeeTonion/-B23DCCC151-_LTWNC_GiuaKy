import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { borrowBook, fetchBooks } from '../../features/books/booksSlice';
import { maxBorrowLimitMiddleware } from '../middleware';
import type { Book } from '../../types/book';

const sampleBooks: Book[] = [
  {
    id: 'b-1',
    title: 'Sách 1',
    author: 'Tác giả 1',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 2,
    totalCopies: 2,
    description: '',
    isbn: '1',
  },
  {
    id: 'b-2',
    title: 'Sách 2',
    author: 'Tác giả 2',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 2,
    totalCopies: 2,
    description: '',
    isbn: '2',
  },
  {
    id: 'b-3',
    title: 'Sách 3',
    author: 'Tác giả 3',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 2,
    totalCopies: 2,
    description: '',
    isbn: '3',
  },
  {
    id: 'b-4',
    title: 'Sách 4',
    author: 'Tác giả 4',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 2,
    totalCopies: 2,
    description: '',
    isbn: '4',
  },
  {
    id: 'b-5',
    title: 'Sách hết',
    author: 'Tác giả 5',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 0,
    totalCopies: 2,
    description: '',
    isbn: '5',
  },
];

describe('maxBorrowLimitMiddleware', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        books: booksReducer,
      },
      middleware: (getDefault) => getDefault().concat(maxBorrowLimitMiddleware),
    });
  };

  test('allows borrowing up to 3 books', () => {
    const store = createTestStore();
    store.dispatch(fetchBooks.fulfilled(sampleBooks, 'req', false));

    store.dispatch(borrowBook('b-1'));
    expect(store.getState().books.borrowedBookIds).toEqual(['b-1']);

    store.dispatch(borrowBook('b-2'));
    expect(store.getState().books.borrowedBookIds).toEqual(['b-1', 'b-2']);

    store.dispatch(borrowBook('b-3'));
    expect(store.getState().books.borrowedBookIds).toEqual(['b-1', 'b-2', 'b-3']);
    expect(store.getState().books.borrowAlert).toBeNull();
  });

  test('blocks borrowing the 4th book and sets borrowAlert', () => {
    const store = createTestStore();
    store.dispatch(fetchBooks.fulfilled(sampleBooks, 'req', false));

    store.dispatch(borrowBook('b-1'));
    store.dispatch(borrowBook('b-2'));
    store.dispatch(borrowBook('b-3'));

    store.dispatch(borrowBook('b-4'));

    expect(store.getState().books.borrowedBookIds).toEqual(['b-1', 'b-2', 'b-3']);
    expect(store.getState().books.borrowAlert).toContain('tối đa 3 cuốn');
  });

  test('blocks borrowing if book has 0 available copies', () => {
    const store = createTestStore();
    store.dispatch(fetchBooks.fulfilled(sampleBooks, 'req', false));

    store.dispatch(borrowBook('b-5'));
    expect(store.getState().books.borrowedBookIds).toHaveLength(0);
    expect(store.getState().books.borrowAlert).toContain('hết bản');
  });
});
