import booksReducer, {
  borrowBook,
  returnBook,
  setBorrowAlert,
  clearBorrowAlert,
  fetchBooks,
  type BooksState,
  initialState,
} from '../booksSlice';
import type { Book } from '../../../types/book';

const mockBook1: Book = {
  id: 'b-01',
  title: 'Cấu trúc dữ liệu và Giải thuật',
  author: 'Nguyễn Văn A',
  category: 'CNTT',
  publicationYear: 2022,
  availableCopies: 3,
  totalCopies: 5,
  description: 'Mô tả sách cấu trúc dữ liệu',
  isbn: '123-456-789',
};

const mockBook2: Book = {
  id: 'b-02',
  title: 'Kinh tế học Vi mô',
  author: 'Trần Thị B',
  category: 'Kinh tế',
  publicationYear: 2021,
  availableCopies: 0,
  totalCopies: 2,
  description: 'Mô tả sách kinh tế',
  isbn: '987-654-321',
};

describe('booksSlice reducer tests', () => {
  test('1. should return initial state when passed an empty action', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  test('2. should handle fetchBooks pending, fulfilled, and rejected states', () => {
    const pendingState = booksReducer(initialState, fetchBooks.pending('req-id', false));
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    const booksList = [mockBook1, mockBook2];
    const fulfilledState = booksReducer(pendingState, fetchBooks.fulfilled(booksList, 'req-id', false));
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.items).toHaveLength(2);
    expect(fulfilledState.items[0].id).toBe('b-01');

    const errorMessage = 'Máy chủ thư viện quá tải!';
    const rejectedState = booksReducer(pendingState, fetchBooks.rejected(new Error(errorMessage), 'req-id', false, errorMessage));
    expect(rejectedState.status).toBe('failed');
    expect(rejectedState.error).toBe(errorMessage);
  });

  test('3. should handle borrowBook action by decreasing availableCopies and adding to borrowedBookIds', () => {
    const startState: BooksState = {
      items: [{ ...mockBook1, availableCopies: 3 }],
      borrowedBookIds: [],
      status: 'succeeded',
      error: null,
      borrowAlert: null,
    };

    const nextState = booksReducer(startState, borrowBook('b-01'));

    expect(nextState.borrowedBookIds).toContain('b-01');
    expect(nextState.items[0].availableCopies).toBe(2);
    expect(nextState.borrowAlert).toBeNull();
  });

  test('4. should handle returnBook action by increasing availableCopies and removing from borrowedBookIds', () => {
    const startState: BooksState = {
      items: [{ ...mockBook1, availableCopies: 2 }],
      borrowedBookIds: ['b-01'],
      status: 'succeeded',
      error: null,
      borrowAlert: null,
    };

    const nextState = booksReducer(startState, returnBook('b-01'));

    expect(nextState.borrowedBookIds).not.toContain('b-01');
    expect(nextState.items[0].availableCopies).toBe(3);
  });

  test('5. should handle setBorrowAlert and clearBorrowAlert correctly', () => {
    const alertMsg = 'Mỗi sinh viên chỉ được mượn tối đa 3 cuốn!';
    const stateWithAlert = booksReducer(initialState, setBorrowAlert(alertMsg));
    expect(stateWithAlert.borrowAlert).toBe(alertMsg);

    const clearedState = booksReducer(stateWithAlert, clearBorrowAlert());
    expect(clearedState.borrowAlert).toBeNull();
  });
});
