<div align="center">

# COVID PROJECT

## ĐỒ ÁN CUỐI KỲ MÔN PHÁT TRIỂN ỨNG DỤNG WEBSITE

</div>

## Thông tin thành viên

- 18120144 - Nguyễn Đình Thiên Phúc
- 18120606 - Trần Thị Trang
- 18120609 - Hồ Khắc Minh Trí
- 18120634 - Nguyễn Lê Anh Tuấn (Nhóm trưởng)

---

## Live Demo

- Management System: https://cp-management.herokuapp.com
- Payment System: https://cp-payment.herokuapp.com

## Công nghệ sử dụng

- Server: NodeJS, ExpressJS MVC
- View Engine (Template Engine): Pug
- Dependencies:

  - Frontend:

    - [Boostrap v4.6.1](https://getbootstrap.com/docs/4.6/getting-started/introduction/) - Static File
    - [Jquery v3.6](https://api.jquery.com/) - Static File
    - [Bootstrap Icon v1.7.0](https://icons.getbootstrap.com/#usage) - CDN
    - [Popper.js](https://popper.js.org/) - Static File

  - Backend:

    - NodeJs framework - [ExpressJs v4.17.1](https://expressjs.com/en/4x/api.html)
    - Read, write cookie - [Cookie-parser v1.4.6](https://www.npmjs.com/package/cookie-parser)
    - Connect PostgreSQL database
      - [Sequelize v6.12.0](https://www.npmjs.com/package/sequelize)
      - [pg v8.7.1](https://www.npmjs.com/package/pg)
      - [pg-hstore v2.3.4](https://www.npmjs.com/package/pg-hstore)
    - Rest API - [Axios 0.24.0](https://www.npmjs.com/package/axios)
    - Read env file - [dotenv v10.0.0](https://www.npmjs.com/package/dotenv)
    - View engine - [Pug v3.0.2](https://pugjs.org/api/getting-started.html)
    - Encrypt password - [bcryptjs v2.4.3](https://www.npmjs.com/package/bcryptjs)
    - Upload photo - [cloudinary v1.27.1](https://www.npmjs.com/package/cloudinary)
    - Server logging - [Morgan v1.10.0](https://www.npmjs.com/package/morgan)
    - Hot reload - [nodemon](https://www.npmjs.com/package/nodemon) (devDep)

- Database: PostgreSQL
- Môi trường phát triển:
  - IDE - Text Editor: Visual Stuido Code ( Format code với Pritter )
  - Nodejs version 16.x hoặc 14.x [Download](https://nodejs.org/en/)
  - PostgreSQL v14.1 [Download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads), [Tutorial](https://www.postgresqltutorial.com/)
  - Node package manager: Yarn 1.22.x hoặc npm 6+
  - Development Browser: Chrome
- Team work:
  - Slack
  - Github, Github Project
- Cloud, Hosting
  - Hosting: Heroku.
  - PostgreSQL DB Cloud: ElephantSQL.
  - Photo Cloud: Cloudinary.

---

## Coding Conventions

- Dùng IDE là `Visual Studio Code`.
- Format với `Prettier` extension.
- Tên file, folder là các chữ viết thường, cách nhau bằng dấu `-` (nếu có nhiều từ)
- Consistent coding với `Editor Config` extension.
- Tên bảng trong database và model là `PascalCase`
- Tên thuộc tính trong bảng (model), tên biến, hàm là `camelCase`
- Không sử dụng hard code (magic number - là những chuỗi hoặc con số cứng). Hãy đặt nó trong `constants`.
- Đặt tên file đi kèm với tên module của nó (bỏ `s`), trừ views và public. Ví dụ (name.controller.js, name.route.js)
- Pull code trước khi push (báo conflict cho team nếu nó quá phức tạp).
- Kiểm tra các template, mixin, helper trước khi code 1 chức năng (nhằm tái sử dụng lại chức năng).
- Cố gắng tách các module, mixin nếu có thể.
- Dùng async / await (nếu không bắt buộc phải dùng Promise).
- dùng `exports.funcName` để export ra một module (nhầm dễ tìm định nghĩa hàm).
- Đặt kiểu method trước mối hàm của controller. Ví dụ `getController, postController`.
- Lưu đặt `try catch` trong controller để bắt lỗi (hoặc trong những hàm có connect DB). Log lỗi kèm với tên hàm.

## Yêu cầu đồ án

&nbsp;

<h1 align="center">PROJECT Phát triển ứng dụng Web</h1>

> Xây dựng ứng dụng **“Quản lý thông tin Covid-19”** gồm 2 hệ thống với các chức năng sau:

&nbsp;

## 1. Hệ thống Quản lý Covid

### 1.1 Đăng nhập, khởi tạo ban đầu

- Khi chương trình khởi động thì cần yêu cầu đăng nhập. Tùy thuộc vào phân
  quyền của tài khoản mà mở màn hình với các chức năng thích hợp.

- Nếu Hệ thống khởi tạo lần đầu tiên thì cần cho phép tạo tài khoản admin.

- Nếu là tài khoản của Người được quản lý đã có trong hệ thống nhưng chưa
  từng đăng nhập thì yêu cầu tạo password.

### 1.2 Phân hệ Quản lý

#### 1.2.1 Quản lý danh sách người liên quan Covid-19

- Người liên quan Covid-19 bao gồm các thông tin cơ bản sau:
  - Họ tên
  - Số CMND / Căn cước công dân
  - Năm sinh
  - Địa chỉ nơi ở (Tỉnh / Thành phố, Quận / Huyện và Phường / Xã)
  - Trạng thái hiện tại (F0 / F1 / F2 / F3)
  - Nơi đang điều trị / cách ly (cơ sở điều trị / cách ly).
  - Có liên quan với Người liên quan Covid-19 nào.
  - Lịch sử quá trình được quản lý (thay đổi trạng thái, chuyển nơi điều trị,…).
- Hiển thị danh sách
- Xem chi tiết thông tin của người liên quan bao gồm danh sách người liên đới.
- Tìm kiếm
- Sắp xếp theo nhiều tiêu chí.

#### 1.2.2 Thêm người liên quan Covid-19 vào hệ thống

- Form thêm với đầy đủ thông tin cần thiết
- Có validation đầy đủ

#### 1.2.3 Thay đổi trạng thái người liên quan Covid-19

- Chuyển trạng thái cần thiết như: F2 -> F1, F2 -> F0,… với các thông tin phù hợp (người liên quan phải thay đổi trạng thái theo).
- Chuyển nơi điều trị / cách ly (ràng buộc về sức chứa).

#### 1.2.4 Quản lý các sản phẩm nhu yếu phẩm

- Sản phẩm nhu yếu phẩm gồm các thông tin cơ bản

  - Tên sản phẩm
  - Hình ảnh sản phẩm (nhiều hình)
  - Giá tiền
  - Đơn vị định lượng

- Hiển thị danh sách
- Tìm kiếm, Sắp xếp, Lọc
- Thêm, xóa, sửa (luôn kiểm tra ràng buộc)

#### 1.2.5 Quản lý các gói Nhu yếu phẩm

- Gói Nhu yếu phẩm gồm các thông tin cơ bản sau:

  - Tên gói
  - Danh sách các sản phẩm trong gói (tối thiểu 2 sản phẩm)
  - Mức giới hạn số lượng mỗi sản phẩm trong gói
  - Mức giới hạn gói cho mỗi người theo thời gian
  - Thời gian giới hạn (ngày, tuần, tháng)

- Hiển thị danh sách
- Xem chi tiết: có thể xem chi tiết mỗi sản phẩm trong gói
- Tìm kiếm, sắp xếp, lọc
- Thêm, xóa, sửa (luôn kiểm tra ràng buộc)

#### 1.2.6 Thống kê thông tin

- Thống kê số lượng người ở từng trạng thái theo thời gian.
- Thống kê các thông tin có thể như: số chuyển trạng thái, khỏi bệnh,…
- Thống kê tiêu thụ các gói Nhu yếu phẩm
- Thống kê tiêu thụ sản phẩm
- Thống kê dư nợ, thanh toán

#### 1.2.7 Quản lý Thanh toán

- Thay đổi hạn mức thanh toán tối thiểu
- Duyệt danh sách và gửi thông báo nhắc thanh toán

### 1.3 Phân hệ quản trị (Admin)

#### 1.3.1 Tạo tài khoản

- Tạo tài khoản người quản lý với xử lý password lưu trữ hợp lý (không lưu trữ password bản rõ trong database).
- Chỉ cần thông tin username, password và phân quyền.

#### 1.3.2 Quản lý thông tin tài khoản người quản lý

- Khóa tài khoản.
- Xem lịch sử hoạt động của tài khoản.

#### 1.3.3 Quản lý địa điểm điều trị / cách ly

- Thêm mới, điều chỉnh.
- Địa điểm điều trị / cách ly chỉ cần thông tin Tên, Sức chứa và Số lượng tiếp nhận hiện tại.

### 1.4 Phân hệ người dùng (Người được quản lý)

#### 1.4.1 Xem thông tin cá nhân

- Các thông tin cơ bản
- Lịch sử được quản lý
- Lịch sử tiêu thụ gói Nhu yếu phẩm
- Xem dư nợ
- Lịch sử thanh toán
- Thông báo nhắc thanh toán (nếu có)

#### 1.4.2 Thay đổi thông tin cá nhân

- Chỉ cho thay đổi mật khẩu (quy trình hợp lý)
- Liên kết sang Hệ thống thanh toán để nạp tiền

#### 1.4.3 Chọn mua gói Nhu yếu phẩm

- Xem danh sách các gói Nhu yếu phẩm
- Tìm kiếm, sắp xếp, lọc
- Thay đổi số lượng sản phẩm trong gói (trong phạm vi ràng buộc)
- Chọn mua gói Nhu yếu phẩm (có kiểm tra các ràng buộc).

#### 1.4.4 Thanh toán chi phí

- Thanh toán dư nợ theo hạn mức tối thiểu (có kiểm tra số dư từ Hệ thống thanh toán
- Liên kết sang Hệ thống thanh toán để nạp tiền

## 2 Hệ thống Quản lý Thanh toán

### 2.1 Khởi tạo hệ thống

- Hệ thống khởi tạo với 1 tài khoản chính để nhận thanh toán từ Người được
  quản lý.

### 2.2 Tài khoản

- Tài khoản chỉ gồm ID và số dư hiện tại.

### 2.3 Chức năng

- Thiết kế database để hệ thống thực hiện được chức năng thanh toán (chuyển khoản) từ các tài khoản Người được quản lý sang tài khoản chính.
- Cần có chức năng thêm tài khoản cho Người được quản lý mới (tương ứng khi được đưa vào hệ thống quản lý).
- Khi người dùng đã được tạo tài khoản, đăng nhập lần đầu sẽ yêu cầu tạo mật khẩu (có chức năng thay đổi mật khẩu với quy trình hợp lý)
- Chức năng nạp tiền, kiểm soát số dư
- Cần có giải pháp để có thể đối soát giao dịch thanh toán

## 3 Liên kết hệ thống Quản lý và Thanh toán

- Sử dụng WebAPI
- Cần đề xuất quy trình hợp lý.

## 4 Lưu ý:

- Cần có sẵn ít nhất 5 Tỉnh thành, mỗi Tỉnh thành có ít nhất 5 Quận / Huyện, mỗi Quận / Huyện có ít nhất 5 Phường / Xã (tên không cần chính xác thực tế).
- Cần có sẵn ít nhất 5 điểm điều trị / cách ly.
- Chỉ hoàn thành đúng các chức năng được yêu cầu.
- Tuân thủ nghiêm ngặt các yêu cầu nộp bài (sẽ có thông báo cụ thể)
