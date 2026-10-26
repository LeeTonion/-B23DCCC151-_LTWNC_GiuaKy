import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { maxBorrowLimitMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(maxBorrowLimitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
