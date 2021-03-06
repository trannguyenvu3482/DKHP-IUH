# Extension hỗ trợ đăng kí học phần IUH
## Version hiện tại: 0.6.9 Beta

## Công nghệ sử dụng: HTML, CSS, JavaScript thuần

## Lưu ý: Nếu trường đổi API thì Extension sẽ bị lỗi!

## Cách cài Extension:

- Vào link Github của Extension này: [https://github.com/trannguyenvu3482/DKHP-IUH](https://github.com/trannguyenvu3482/DKHP-IUH)
- Chọn vào nút Code màu xanh lá ở trên góc và chọn "Download ZIP"
- Sau khi tải xong, kéo file giải nén vào một folder trống
- Chuột phải file nén, chọn Extract Here
- Bật Google Chrome hoặc trình duyệt Chromium và nhập "chrome://extensions/" vào trình duyệt
- Chọn "Load unpacked extension"
- Trỏ đến thư mục chứa tất cả file vừa giải nén và chọn "Load"
- Sau khi laod xong, bạn sẽ thấy Extension đã được nạp vào trình duyệt, nếu chưa, hãy tắt mở lại trình duyệt

**Lưu ý: Sau khi tải xong Extension có thể nó sẽ bị ẩn đi, hãy tìm biểu tượng Extension trên góc là ghim nó lại**

## Các chức năng hỗ trợ và Hướng dẫn sử dụng:

### Lấy danh sách lớp học phần

**Các biến đầu vào:**

- Mã môn học: 6 số cuối của mã học phần (VD: 014693)
- ID đợt: Học kì 1 của năm 2 là 43, các học kì sau cứ tăng dần lên 1
- Mã học phần: Là dãy số của môn học, tra ở chương trình khung của web [https://sv.iuh.edu.vn](https://sv.iuh.edu.vn)

**Kết quả trả về:**

- ID của lớp học: Là một dãy ngẫu nhiên, tượng trưng cho 1 lớp học cụ thể
- Lớp dự kiến: Tên của lớp (VD: DHTH17F)
- Tình trạng hiện tại: Số lượng sinh viên đã đăng kí / Số lượng sinh viên tối đa

**Cách sử dụng:**

- Nhập lần lượt các thông tin vào các ô input
- Bấm nút khởi chạy, nếu báo lỗi, hãy kiểm tra xem có bị thoát đăng nhập hoặc có trường nào nhập sai hay không

**Cách thức hoạt động (Cho mấy bạn dev muốn làm):**

- Vì lí do bảo mật, các bạn có thể inbox về facebook của mình để mình hướng dẫn thêm
- Link facebook: [https://www.facebook.com/DuzFromSOL/](https://www.facebook.com/DuzFromSOL/)

### Xem chi tiết lớp học phần

#### Chưa update

### Đăng kí nhanh bằng ID lớp học phần

#### Chưa update

## Demo:

- Menu chính:
  ![MainMenu](./images/demos/MainMenu.png)

- Menu đăng kí nhanh:
  ![QuickRegister](./images/demos/QuickRegister.png)

- Đăng nhập sai trang:
  ![WrongPage](./images/demos/WrongPage.png)

- Chưa đăng nhập:
  ![NotLoginError](./images/demos/NotLoginError.png)
