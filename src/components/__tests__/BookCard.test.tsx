import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from '../BookCard';
import type { Book } from '../../types/book';

const sampleBookAvailable: Book = {
  id: 'book-101',
  title: 'Học React và Redux Toolkit từ cơ bản đến nâng cao',
  author: 'Nguyễn Văn Minh',
  category: 'CNTT',
  publicationYear: 2023,
  availableCopies: 4,
  totalCopies: 5,
  description: 'Cuốn sách chi tiết về kiến trúc ứng dụng web hiện đại.',
  isbn: '978-604-0-9999-1',
};

const sampleBookOutOfStock: Book = {
  id: 'book-102',
  title: 'Kinh tế Quốc tế và Toàn cầu hóa',
  author: 'Trần Thị Thu Trang',
  category: 'Kinh tế',
  publicationYear: 2021,
  availableCopies: 0,
  totalCopies: 3,
  description: 'Tài liệu nghiên cứu thương mại quốc tế.',
  isbn: '978-604-0-9999-2',
};

describe('BookCard Component tests with React Testing Library and userEvent', () => {
  test('1. should render book information correctly (title, author, category, year, available copies)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBookAvailable}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText('Học React và Redux Toolkit từ cơ bản đến nâng cao')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn Minh')).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText(/2023/)).toBeInTheDocument();
    expect(screen.getByText('4 / 5')).toBeInTheDocument();
    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    expect(borrowButton).toBeInTheDocument();
    expect(borrowButton).not.toBeDisabled();
  });

  test('2. should call onBorrow with the correct book id when "Mượn" button is clicked', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBookAvailable}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    await user.click(borrowButton);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-101');
    expect(handleReturn).not.toHaveBeenCalled();
  });

  test('3. should disable the "Mượn" button when availableCopies is 0', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBookOutOfStock}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText('0 / 3')).toBeInTheDocument();

    const outOfStockButton = screen.getByRole('button', { name: /hết sách|mượn sách/i });
    expect(outOfStockButton).toBeInTheDocument();
    expect(outOfStockButton).toBeDisabled();
  });

  test('4. should render "Trả sách" button when isBorrowed is true and call onReturn when clicked', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBookAvailable}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText(/bạn đang mượn cuốn này/i)).toBeInTheDocument();

    const returnButton = screen.getByRole('button', { name: /trả sách/i });
    expect(returnButton).toBeInTheDocument();

    await user.click(returnButton);
    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('book-101');
  });
});
