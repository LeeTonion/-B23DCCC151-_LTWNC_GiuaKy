# 📚 Mini Library — Ứng Dụng Tra Cứu & Mượn/Trả Sách Thư Viện Khoa

Ứng dụng web hiện đại hỗ trợ sinh viên trường đại học tra cứu và theo dõi mượn/trả sách chuyên ngành (CNTT, Kinh tế, Ngoại ngữ). Dự án vận dụng toàn diện và chuyên sâu các nội dung học phần từ **Buổi 1 đến Buổi 6**.

---

## 🌟 Tổng Hợp Kỹ Thuật Đã Triển Khai Theo Từng Buổi Học

### 1. Buổi 1 — TypeScript Nâng Cao
- **Generic Types**:
  - API response dạng generic: `ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse`
  - Custom hook generic: `useDebounce<T>(value: T, delay: number): T`
- **Utility Types**:
  - `Pick<Book, 'id' | 'title' | 'category' | 'availableCopies'>`: Dữ liệu tóm tắt rút gọn
  - `Omit<Book, 'id'>`: DTO tạo mới sách
  - `Record<BookCategory, number>`: Thống kê số lượng theo từng danh mục
  - `Readonly<Book>`: Đảm bảo tính bất biến
- **Type Guards**:
  - `isSuccessResponse<T>(res: ApiResponse<T>): res is ApiSuccessResponse<T>`
  - `isErrorResponse<T>(res: ApiResponse<T>): res is ApiErrorResponse`
- **Không sử dụng `any`**, tuân thủ nghiêm ngặt strict mode và `verbatimModuleSyntax`.

---

### 2. Buổi 2 — Design Pattern React (Custom Hooks)
- `useDebounce<T>`: Trì hoãn việc cập nhật từ khóa tìm kiếm theo khoảng thời gian định trước (mặc định 300ms), tối ưu chi phí render khi gõ phím.
- `useTheme`: Custom hook tiêu chuẩn để truy cập và chuyển đổi Dark/Light mode trong `ThemeContext`.

---

### 3. Buổi 3 — Redux Toolkit + TypeScript (Feature-Based Architecture)
- Tổ chức thư mục theo cấu trúc **Feature-based** (`src/features/books/...`).
- Sử dụng `createSlice` và `createAsyncThunk` xử lý đủ **3 trạng thái**: `pending`, `fulfilled`, `rejected`.
- Cung cấp typed hooks chuyên dụng: `useAppDispatch` và `useAppSelector`.

---

### 4. Buổi 4 — Zustand, Context Nâng Cao & Redux Middleware
- **Zustand Store** (`useFilterStore`): Quản lý tách biệt trạng thái bộ lọc giao diện gồm từ khóa tìm kiếm (`searchQuery`) và danh mục thể loại đã chọn (`selectedCategory`).
- **Context Nâng Cao** (`ThemeContext`): Hỗ trợ giao diện Sáng / Tối, bọc `value` của Provider bằng `useMemo`, đồng bộ trực tiếp với `data-theme` trên `<html>` và `localStorage`.
- **Custom Redux Middleware** (`maxBorrowLimitMiddleware`):
  - Kiểm soát quy chế: **Mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc**.
  - Nếu đã mượn 3 cuốn mà cố gắng mượn thêm: Middleware sẽ **chặn action** (không gọi `next(action)`) và dispatch action kích hoạt cảnh báo thông báo trực quan tới người dùng.
  - Chặn khi sách đã hết bản (`availableCopies <= 0`) hoặc đã mượn cuốn đó rồi.

---

### 5. Buổi 5 — Tối Ưu Hiệu Năng (Performance Optimization)
- `React.memo`: Bọc component `BookCard` để tránh re-render thừa thãi khi chỉ có các cuốn sách khác thay đổi trạng thái.
- `useMemo`: Tính toán danh sách sách sau khi lọc (`filteredBooks`) và thống kê tổng hợp (`categoryTitleCounts`, `categoryCopiesStats`).
- `useCallback`: Memoize các hàm xử lý sự kiện truyền xuống component con (`handleBorrow`, `handleReturn`, `handleRetry`).
- **Key khi render list**: Sử dụng ID duy nhất của sách (`book.id`), tuyệt đối không dùng `index`.
- **Code Splitting & Lazy Loading**: Trang Thống kê (`/stats`) được tải lười bằng `React.lazy` kết hợp `Suspense` và fallback loading spinner.

---

### 6. Buổi 6 — Kiểm Thử Toàn Diện với Jest + React Testing Library
Tất cả các bài test đều chạy xanh (**16/16 tests Passed**):
1. **Reducer `booksSlice` (5 tests)**:
   - Initial state khởi tạo.
   - Xử lý đủ 3 trạng thái của `fetchBooks` (`pending`, `fulfilled`, `rejected`).
   - Xử lý action `borrowBook` (giảm `availableCopies`, thêm vào `borrowedBookIds`).
   - Xử lý action `returnBook` (tăng `availableCopies`, xóa khỏi `borrowedBookIds`).
   - Xử lý `setBorrowAlert` và `clearBorrowAlert`.
2. **Component `BookCard` (4 tests với RTL + `userEvent`)**:
   - Hiển thị đầy đủ và chính xác thông tin sách (tên, tác giả, thể loại, năm, số bản còn lại).
   - Click "Mượn sách" kích hoạt đúng hàm `onBorrow` với đúng `bookId`.
   - Nút "Mượn" bị vô hiệu hóa (`disabled`) khi sách đã hết bản (`availableCopies === 0`).
   - Hiển thị nút "Trả sách" và click gọi `onReturn` khi sách đang được mượn.
3. **Custom Hook `useDebounce` (2 tests với Fake Timers)**:
   - Trả về giá trị khởi tạo và chỉ cập nhật sau khoảng delay trôi qua (`jest.advanceTimersByTime`).
   - Debounce chính xác khi giá trị thay đổi liên tục.
4. **Custom Middleware (3 tests)**:
   - Cho phép mượn tối đa 3 cuốn.
   - Chặn cuốn thứ 4 và kích hoạt cảnh báo `borrowAlert`.
   - Chặn mượn khi số bản khả dụng là 0.
5. **Full App Integration Tests (2 tests)**:
   - Khởi động app, gọi API giả lập 500ms, chuyển theme sáng/tối.
   - Thao tác mượn 3 cuốn và kiểm tra middleware chặn cuốn thứ 4 ngay trên UI.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm install
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### 2. Chạy bộ kiểm thử tự động (Unit & Integration Tests)
```bash
npm test
```

### 3. Đóng gói bản Production
```bash
npm run build
```

---

## 📁 Cấu Trúc Thư Mục Chuẩn Feature-Based

```
d:/Baitapgiuakiweb/
├── src/
│   ├── api/
│   │   └── booksApi.ts               # API giả lập trễ 500ms, hỗ trợ mock lỗi
│   ├── app/
│   │   ├── hooks.ts                  # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── middleware.ts             # Redux Middleware giới hạn mượn 3 cuốn
│   │   ├── store.ts                  # Cấu hình Redux Toolkit store
│   │   └── __tests__/
│   │       └── middleware.test.ts    # Unit test cho Middleware
│   ├── context/
│   │   └── ThemeContext.tsx          # Dark/Light Context với useMemo & useTheme
│   ├── features/
│   │   ├── books/
│   │   │   ├── booksSlice.ts         # Redux Slice quản lý sách & trạng thái mượn
│   │   │   └── __tests__/
│   │   │       └── booksSlice.test.ts# Test reducers booksSlice (5 tests)
│   │   └── filter/
│   │       └── filterStore.ts        # Zustand Store quản lý ô tìm kiếm & thể loại
│   ├── hooks/
│   │   ├── useDebounce.ts            # Custom hook generic useDebounce<T>
│   │   └── __tests__/
│   │       └── useDebounce.test.ts   # Test useDebounce với fake timers
│   ├── components/
│   │   ├── Navbar.tsx                # Thanh điều hướng, Dark mode toggle, badge 3/3
│   │   ├── BookCard.tsx              # Component sách bọc React.memo
│   │   ├── FilterBar.tsx             # Ô tìm kiếm debounced 300ms & chips thể loại
│   │   ├── BorrowStatusBanner.tsx    # Hiển thị 3 suất mượn trực quan của sinh viên
│   │   ├── AlertNotification.tsx     # Toast thông báo cảnh báo khi vi phạm quy chế
│   │   └── __tests__/
│   │       └── BookCard.test.tsx     # RTL + userEvent tests cho BookCard
│   ├── pages/
│   │   ├── HomePage.tsx              # Trang chủ: Tra cứu, lọc, mượn trả
│   │   └── StatsPage.tsx             # Trang Thống kê (Lazy loaded bằng React.lazy)
│   ├── types/
│   │   └── book.ts                   # Types, Utility Types, Generic API, Type Guards
│   ├── __tests__/
│   │   └── App.test.tsx              # Integration tests cho toàn bộ App
│   ├── App.tsx                       # Định tuyến React Router & Suspense fallback
│   ├── index.css                     # Design system, CSS variables, Dark/Light tokens
│   ├── main.tsx                      # Entry point, bọc Redux Provider & ThemeProvider
│   └── setupTests.ts                 # Cấu hình Jest & Testing Library DOM matchers
├── jest.config.cjs
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.test.json
└── package.json
```
