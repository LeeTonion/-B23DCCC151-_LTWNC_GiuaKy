import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearBorrowAlert } from '../features/books/booksSlice';

export const AlertNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const alertMessage = useAppSelector((state) => state.books.borrowAlert);

  useEffect(() => {
    if (!alertMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearBorrowAlert());
    }, 6000);

    return () => clearTimeout(timer);
  }, [alertMessage, dispatch]);

  if (!alertMessage) return null;

  return (
    <div className="alert-toast-container" role="alert" aria-live="assertive">
      <div className="alert-toast">
        <div className="alert-toast-icon">
          <AlertTriangle className="icon-md" />
        </div>
        <div className="alert-toast-content">
          <h4 className="alert-toast-title">Cảnh báo quy chế mượn sách</h4>
          <p className="alert-toast-message">{alertMessage}</p>
        </div>
        <button
          type="button"
          className="alert-toast-close"
          onClick={() => dispatch(clearBorrowAlert())}
          aria-label="Đóng thông báo"
        >
          <X className="icon-sm" />
        </button>
      </div>
    </div>
  );
};
