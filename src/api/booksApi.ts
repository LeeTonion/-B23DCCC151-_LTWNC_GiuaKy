import { isSuccessResponse, type Book, type ApiResponse } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-01',
    title: 'Cấu trúc dữ liệu và Giải thuật nâng cao',
    author: 'PGS. TS. Trần Minh Thái',
    category: 'CNTT',
    publicationYear: 2022,
    availableCopies: 5,
    totalCopies: 5,
    description: 'Giáo trình chuẩn về đồ thị, cây nhị phân, quy hoạch động và tối ưu thuật toán ứng dụng thực tế.',
    isbn: '978-604-0-12345-1',
  },
  {
    id: 'b-02',
    title: 'Thiết kế Hệ thống Phân tán (Designing Data-Intensive Applications)',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publicationYear: 2021,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Cẩm nang kinh điển về kiến trúc dữ liệu lớn, tính nhất quán, phân tán và độ tin cậy hệ thống.',
    isbn: '978-604-0-12345-2',
  },
  {
    id: 'b-03',
    title: 'Clean Architecture: Hướng dẫn của Nghệ nhân Phần mềm',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'CNTT',
    publicationYear: 2020,
    availableCopies: 0,
    totalCopies: 3,
    description: 'Nguyên lý thiết kế cấu trúc phần mềm tách biệt tầng, kiểm thử dễ dàng và bảo trì dài hạn.',
    isbn: '978-604-0-12345-3',
  },
  {
    id: 'b-04',
    title: 'Trí tuệ nhân tạo: Phương pháp tiếp cận hiện đại',
    author: 'Stuart Russell & Peter Norvig',
    category: 'CNTT',
    publicationYear: 2023,
    availableCopies: 3,
    totalCopies: 3,
    description: 'Giáo trình AI toàn diện bao quát Machine Learning, Deep Learning và Logic mờ.',
    isbn: '978-604-0-12345-4',
  },
  {
    id: 'b-05',
    title: 'Kinh tế học Vi mô Hiện đại',
    author: 'N. Gregory Mankiw',
    category: 'Kinh tế',
    publicationYear: 2021,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Nguyên lý cơ bản và nâng cao về cung cầu, độ co giãn, chi phí sản xuất và cân bằng thị trường.',
    isbn: '978-604-0-54321-1',
  },
  {
    id: 'b-06',
    title: 'Quản trị Tài chính Doanh nghiệp',
    author: 'GS. TS. Nguyễn Hải Nam',
    category: 'Kinh tế',
    publicationYear: 2022,
    availableCopies: 3,
    totalCopies: 4,
    description: 'Phân tích báo cáo tài chính, thẩm định dự án đầu tư và quản trị rủi ro vốn lưu động.',
    isbn: '978-604-0-54321-2',
  },
  {
    id: 'b-07',
    title: 'Marketing trong Kỷ nguyên số (Digital Marketing)',
    author: 'Philip Kotler',
    category: 'Kinh tế',
    publicationYear: 2023,
    availableCopies: 6,
    totalCopies: 6,
    description: 'Chiến lược tiếp thị đa kênh, hành vi người tiêu dùng số và tối ưu hóa chuyển đổi trải nghiệm khách hàng.',
    isbn: '978-604-0-54321-3',
  },
  {
    id: 'b-08',
    title: 'English for Computer Science and Information Technology',
    author: 'Eric H. Glendinning',
    category: 'Ngoại ngữ',
    publicationYear: 2021,
    availableCopies: 4,
    totalCopies: 5,
    description: 'Tiếng Anh chuyên ngành Công nghệ thông tin: mạng máy tính, an toàn thông tin và thuật ngữ lập trình.',
    isbn: '978-604-0-98765-1',
  },
  {
    id: 'b-09',
    title: 'IELTS Academic Writing & Vocabulary Masterclass',
    author: 'Rachel Mitchell',
    category: 'Ngoại ngữ',
    publicationYear: 2022,
    availableCopies: 1,
    totalCopies: 3,
    description: 'Kỹ năng nâng band điểm viết học thuật luận văn, phân tích biểu đồ và cấu trúc lập luận logic.',
    isbn: '978-604-0-98765-2',
  },
  {
    id: 'b-10',
    title: 'Tiếng Nhật Thương mại và Giao tiếp Doanh nghiệp (BJT)',
    author: 'Học viện Ngôn ngữ Tokyo',
    category: 'Ngoại ngữ',
    publicationYear: 2020,
    availableCopies: 0,
    totalCopies: 2,
    description: 'Mẫu câu kính ngữ, thư từ thương mại và kỹ năng đàm phán trong văn hóa doanh nghiệp Nhật Bản.',
    isbn: '978-604-0-98765-3',
  },
  {
    id: 'b-11',
    title: 'Lập trình Web với React và TypeScript Chuyên sâu',
    author: 'Dan Abramov & Cộng sự',
    category: 'CNTT',
    publicationYear: 2024,
    availableCopies: 5,
    totalCopies: 5,
    description: 'State management hiện đại, Redux Toolkit, Zustand, custom hooks và tối ưu render hiệu năng cao.',
    isbn: '978-604-0-12345-5',
  },
  {
    id: 'b-12',
    title: 'Kinh tế lượng Ứng dụng với Python và R',
    author: 'TS. Lê Hoàng Mai',
    category: 'Kinh tế',
    publicationYear: 2023,
    availableCopies: 2,
    totalCopies: 3,
    description: 'Mô hình hồi quy tuyến tính, chuỗi thời gian ARIMA và dự báo dữ liệu tài chính vĩ mô.',
    isbn: '978-604-0-54321-4',
  },
];

export const fetchBooksApi = (shouldFail: boolean = false): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện khoa. Vui lòng kiểm tra đường truyền và thử lại!',
          statusCode: 500,
        });
      } else {
        const data = JSON.parse(JSON.stringify(INITIAL_BOOKS)) as Book[];
        resolve({
          ok: true,
          data,
          timestamp: Date.now(),
        });
      }
    }, 500);
  });
};

export { isSuccessResponse };
