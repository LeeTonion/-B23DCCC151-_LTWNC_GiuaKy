import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isSuccessResponse, type Book } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  items: Book[];
  borrowedBookIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  borrowAlert: string | null;
}

export const initialState: BooksState = {
  items: [],
  borrowedBookIds: [],
  status: 'idle',
  error: null,
  borrowAlert: null,
};

export const fetchBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string }>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    const response = await fetchBooksApi(shouldFail);
    if (isSuccessResponse(response)) {
      return response.data;
    }
    return rejectWithValue(response.error);
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.items.find((b) => b.id === bookId);

      if (targetBook && targetBook.availableCopies > 0 && !state.borrowedBookIds.includes(bookId)) {
        targetBook.availableCopies -= 1;
        state.borrowedBookIds.push(bookId);
        state.borrowAlert = null;
      }
    },

    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.items.find((b) => b.id === bookId);

      if (state.borrowedBookIds.includes(bookId)) {
        state.borrowedBookIds = state.borrowedBookIds.filter((id) => id !== bookId);
        if (targetBook) {
          targetBook.availableCopies += 1;
        }
        state.borrowAlert = null;
      }
    },

    setBorrowAlert: (state, action: PayloadAction<string | null>) => {
      state.borrowAlert = action.payload;
    },

    clearBorrowAlert: (state) => {
      state.borrowAlert = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải danh sách sách!';
      });
  },
});

export const { borrowBook, returnBook, setBorrowAlert, clearBorrowAlert } = booksSlice.actions;
export default booksSlice.reducer;
