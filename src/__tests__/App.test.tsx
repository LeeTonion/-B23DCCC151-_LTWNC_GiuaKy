import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { maxBorrowLimitMiddleware } from '../app/middleware';
import { ThemeProvider } from '../context/ThemeContext';
import App from '../App';

const createTestStore = () =>
  configureStore({
    reducer: {
      books: booksReducer,
    },
    middleware: (getDefault) => getDefault().concat(maxBorrowLimitMiddleware),
  });

describe('Mini Library Full Application Integration Tests', () => {
  test('renders navigation, loads initial books with simulated 500ms API, and allows theme toggle', async () => {
    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Mini Library')).toBeInTheDocument();
    expect(screen.getAllByText(/Tra cứu & Mượn sách/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Thống kê/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('Cấu trúc dữ liệu và Giải thuật nâng cao')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const themeBtn = screen.getByRole('button', { name: /chuyển sang giao diện/i });
    expect(themeBtn).toBeInTheDocument();
    await user.click(themeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await user.click(themeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('enforces max 3 borrowed books limit via Redux middleware in UI and shows warning toast', async () => {
    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Cấu trúc dữ liệu và Giải thuật nâng cao')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText('0/3')).toBeInTheDocument();

    const book1Btn = screen.getByRole('button', { name: /mượn sách cấu trúc dữ liệu/i });
    await user.click(book1Btn);
    expect(screen.getByText('1/3')).toBeInTheDocument();

    const book2Btn = screen.getByRole('button', { name: /mượn sách thiết kế hệ thống/i });
    await user.click(book2Btn);
    expect(screen.getByText('2/3')).toBeInTheDocument();

    const book4Btn = screen.getByRole('button', { name: /mượn sách trí tuệ nhân tạo/i });
    await user.click(book4Btn);
    expect(screen.getByText('3/3')).toBeInTheDocument();

    const book5Btn = screen.getByRole('button', { name: /mượn sách kinh tế học vi mô/i });
    await user.click(book5Btn);

    await waitFor(() => {
      const alertElem = screen.getByRole('alert');
      expect(alertElem).toBeInTheDocument();
      expect(alertElem).toHaveTextContent(/Cảnh báo quy chế mượn sách/i);
      expect(alertElem).toHaveTextContent(/tối đa 3 cuốn/i);
    });

    expect(screen.getByText('3/3')).toBeInTheDocument();
  });
});
