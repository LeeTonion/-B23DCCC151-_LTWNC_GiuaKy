import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AlertNotification } from './components/AlertNotification';
import { HomePage } from './pages/HomePage';
import { Loader2 } from 'lucide-react';

const StatsPage = lazy(() => import('./pages/StatsPage'));

const PageFallback: React.FC = () => (
  <div className="page-fallback" role="status">
    <Loader2 className="spinner-icon" />
    <span>Đang tải trang Thống kê...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <AlertNotification />

        <main className="main-content">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <div className="footer-container">
            <p className="footer-text">
              © {new Date().getFullYear()} Mini Library — Thư viện Khoa Chuyên ngành. Ứng dụng tra cứu & mượn trả sách.
            </p>
            <p className="footer-subtext">
              TypeScript Nâng Cao • Redux Toolkit • Zustand • Context API • Performance Optimization • Testing
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
