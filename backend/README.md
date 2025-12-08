# Backend API - Quản Lý Hợp Đồng Thi Công Trạm BTS

## Cài đặt

1. Cài đặt dependencies:
```bash
pnpm install
```

2. Tạo file `.env` từ `.env.example` và cấu hình:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quanly_bts
DB_PORT=3306

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

3. Tạo database và chạy file SQL:
```bash
mysql -u root -p < quanyhopdong.sql
```

4. Chạy server:
```bash
pnpm start
# hoặc
pnpm dev  # với auto-reload
```

## API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập

### Users
- `GET /users` - Lấy danh sách người dùng
- `POST /users` - Tạo người dùng (Admin only)
- `PUT /users/:id` - Cập nhật người dùng (Admin only)
- `DELETE /users/:id` - Xóa người dùng (Admin only)

### Tỉnh (Provinces)
- `GET /tinh` - Lấy danh sách tỉnh
- `POST /tinh` - Tạo tỉnh
- `PUT /tinh/:id` - Cập nhật tỉnh
- `DELETE /tinh/:id` - Xóa tỉnh

### Trạm (Stations)
- `GET /tram` - Lấy danh sách trạm
- `POST /tram` - Tạo trạm
- `PUT /tram/:id` - Cập nhật trạm
- `DELETE /tram/:id` - Xóa trạm

### Cột (Poles)
- `GET /cot` - Lấy danh sách cột
- `POST /cot` - Tạo cột
- `PUT /cot/:id` - Cập nhật cột
- `DELETE /cot/:id` - Xóa cột

### Volume Khác (Other Volumes)
- `GET /volume-other` - Lấy danh sách volume khác
- `POST /volume-other` - Tạo volume khác
- `PUT /volume-other/:id` - Cập nhật volume khác
- `DELETE /volume-other/:id` - Xóa volume khác

### Hợp đồng (Contracts)
- `GET /hopdong` - Lấy danh sách hợp đồng
- `POST /hopdong` - Tạo hợp đồng
- `PUT /hopdong/:id` - Cập nhật hợp đồng
- `DELETE /hopdong/:id` - Xóa hợp đồng (soft delete)
- `GET /hopdong/:id/lichsu` - Lấy lịch sử hợp đồng

### Hợp đồng - Cột
- `GET /hopdong/:id/cot` - Lấy danh sách cột theo hợp đồng
- `POST /hopdong/:id/cot` - Thêm cột vào hợp đồng
- `PUT /hopdong/:id/cot/:cot_id` - Cập nhật số lượng cột
- `DELETE /hopdong/:id/cot/:cot_id` - Xóa cột khỏi hợp đồng

### Hợp đồng - Volume Khác
- `GET /hopdong/:id/volume-other` - Lấy danh sách volume khác theo hợp đồng
- `POST /hopdong/:id/volume-other` - Thêm volume khác vào hợp đồng
- `PUT /hopdong/:id/volume-other/:volume_id` - Cập nhật số lượng volume khác
- `DELETE /hopdong/:id/volume-other/:volume_id` - Xóa volume khác khỏi hợp đồng

### Thực tế (Actual Data)
#### Cột
- `GET /hopdong/:id/thucte` - Lấy dữ liệu thực tế cột
- `POST /hopdong/:id/thucte` - Nhập dữ liệu thực tế cột
- `PUT /hopdong/:id/thucte/:cot_id` - Cập nhật dữ liệu thực tế cột

#### Volume Khác
- `GET /hopdong/:id/thucte-volume-other` - Lấy dữ liệu thực tế volume khác
- `POST /hopdong/:id/thucte-volume-other` - Nhập dữ liệu thực tế volume khác
- `PUT /hopdong/:id/thucte-volume-other/:volume_id` - Cập nhật dữ liệu thực tế volume khác

### Tiến độ (Progress)
- `GET /hopdong/:id/tiendo` - Lấy tiến độ hợp đồng
- `PUT /hopdong/:id/tiendo` - Cập nhật tiến độ

### Lịch sử (History)
- `GET /lichsu` - Lấy toàn bộ lịch sử hệ thống

### Dashboard
- `GET /dashboard/overview` - Tổng quan hệ thống
- `GET /dashboard/doanhthu` - Thống kê doanh thu
- `GET /dashboard/tiendo` - Tiến độ theo tỉnh

### Phân công khảo sát (Survey Assignment)
- `GET /phancong-khaosat` - Lấy danh sách phân công khảo sát (query: hopdong_id, ktv_id, trangthai)
- `GET /phancong-khaosat/:id` - Lấy chi tiết phân công khảo sát
- `POST /phancong-khaosat` - Phân công KTV khảo sát (Admin only)
- `PUT /phancong-khaosat/:id` - Cập nhật phân công khảo sát
- `PUT /phancong-khaosat/:id/doi-ktv` - Đổi nhân viên khảo sát (Admin only)
- `PUT /phancong-khaosat/:id/huy` - Hủy lịch khảo sát (Admin only)
- `DELETE /phancong-khaosat/:id` - Xóa phân công khảo sát (Admin only, chỉ khi chưa bắt đầu)

**Trạng thái phân công:**
- `chua_ks` - Chưa khảo sát
- `dang_ks` - Đang khảo sát
- `hoan_thanh` - Hoàn thành
- `da_huy` - Đã hủy

### Export/Import
- `GET /export/hopdong` - Xuất Excel hợp đồng
- `GET /export/tiendo` - Xuất Excel tiến độ
- `POST /import/hopdong` - Import Excel hợp đồng (multipart/form-data, field: file)

## Authentication

Hầu hết các endpoint yêu cầu JWT token. Gửi token trong header:
```
Authorization: Bearer <token>
```

Token được lấy từ endpoint `/auth/login`.

## Vai trò (Roles)

Hệ thống sử dụng trường `la_admin` (TINYINT) trong bảng `nguoidung`:
- `la_admin = 1` - Quản trị viên (Admin)
- `la_admin = 0` - Kỹ thuật viên (KTV)

**Lưu ý**: Các vai trò cũ (`qlda`, `chudautu`) đã được thay thế bằng hệ thống đơn giản hơn với trường `la_admin`.

## Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js       # Cấu hình database
├── controllers/          # Controllers xử lý logic
├── middleware/
│   └── auth.js          # Middleware authentication
├── routes/              # Định nghĩa routes
├── utils/
│   └── logger.js        # Utility ghi log
├── index.js             # File chính
└── package.json
```

