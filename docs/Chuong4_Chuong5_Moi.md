# Chương 4. THỬ NGHIỆM

## 4.1. CÁC KỊCH BẢN THỬ NGHIỆM

Hệ thống TechStore được kiểm thử nhằm đánh giá tính đúng đắn của các chức năng đã xây dựng và khả năng đáp ứng các yêu cầu nghiệp vụ của website thương mại điện tử. Quá trình kiểm thử được thực hiện theo phương pháp Black-box Testing kết hợp với Manual Testing, trong đó người kiểm thử thực hiện các thao tác trực tiếp trên giao diện người dùng và đối chiếu kết quả thực tế với kết quả mong đợi.

Ngoài việc kiểm thử giao diện người dùng, các API của hệ thống cũng được kiểm tra bằng công cụ Postman nhằm xác minh tính chính xác của dữ liệu trao đổi giữa frontend và backend.

Các kịch bản thử nghiệm được tổ chức thành 5 nhóm chức năng chính, với tổng cộng 25 kịch bản bao phủ toàn bộ luồng nghiệp vụ của hệ thống.

### 4.1.1 Nhóm 1 – Xác Thực Người Dùng (Authentication)

**Kịch Bản TC-01: Đăng Ký Tài Khoản Mới**

- **Mục tiêu:** Kiểm tra luồng đăng ký tài khoản khách hàng hợp lệ.
- **Điều kiện tiên quyết:** Email chưa tồn tại trong hệ thống.
- **Dữ liệu thử nghiệm:**
  - fullName: Nguyễn Văn A
  - email: nguyenvana@gmail.com
  - phone: 0912345678
  - password: Test@12345
- **Các bước thực hiện:**
  1. Người dùng truy cập trang đăng ký.
  2. Nhập thông tin đầy đủ vào form đăng ký.
  3. Nhấn nút "Đăng ký".
- **Kết quả mong đợi:**
  - Hệ thống kiểm tra tính hợp lệ của dữ liệu đầu vào.
  - Hệ thống tạo mới tài khoản khách hàng.
  - Mật khẩu được mã hóa trước khi lưu vào cơ sở dữ liệu.
  - Hệ thống sinh JWT Access Token sau khi đăng ký thành công.
  - Người dùng được đăng nhập vào hệ thống.
  - Giao diện hiển thị thông báo "Đăng ký thành công" và chuyển về trang chủ.
- **Kết quả thực tế:**
  - Hệ thống tạo tài khoản thành công.
  - Thông tin người dùng được lưu trong cơ sở dữ liệu.
  - JWT Access Token được cấp và lưu trên trình duyệt.
  - Người dùng được chuyển về trang chủ và có thể sử dụng các chức năng của hệ thống.

**Kịch Bản TC-02: Đăng Nhập Bằng Email và Mật Khẩu**

- **Mục tiêu:** Kiểm tra chức năng đăng nhập với tài khoản hợp lệ.
- **Điều kiện tiên quyết:**
  - Tài khoản đã được tạo thành công.
  - Tài khoản có trạng thái ACTIVE.
  - Người dùng chưa đăng nhập vào hệ thống.
- **Dữ liệu thử nghiệm:**
  - email: nguyenvana@gmail.com
  - password: Test@12345
- **Các bước thực hiện:**
  1. Người dùng truy cập trang đăng nhập.
  2. Nhập email và mật khẩu.
  3. Nhấn nút "Đăng nhập".
- **Kết quả mong đợi:**
  - Hệ thống kiểm tra thông tin đăng nhập.
  - Hệ thống xác thực tài khoản thành công.
  - Hệ thống cấp JWT Access Token cho người dùng.
  - Người dùng được đăng nhập vào hệ thống.
  - Giao diện chuyển về trang chủ.
  - Header hiển thị tên người dùng và các chức năng dành cho tài khoản đã đăng nhập.
- **Kết quả thực tế:**
  - Đăng nhập thành công.
  - Hệ thống cấp JWT Access Token và lưu trên trình duyệt.
  - Người dùng được chuyển về trang chủ.
  - Header hiển thị đúng tên người dùng.
  - Người dùng có thể sử dụng các chức năng yêu cầu đăng nhập.

**Kịch Bản TC-03: Đăng Nhập Bằng Google OAuth**

- **Mục tiêu:** Kiểm tra chức năng đăng nhập bằng tài khoản Google.
- **Điều kiện tiên quyết:**
  - Người dùng có tài khoản Google hợp lệ.
  - Thiết bị có kết nối Internet.
  - Chức năng Google OAuth đã được cấu hình trên hệ thống.
- **Các bước thực hiện:**
  1. Người dùng truy cập trang đăng nhập.
  2. Nhấn nút "Đăng nhập với Google".
  3. Chọn tài khoản Google để đăng nhập.
  4. Cho phép truy cập thông tin tài khoản.
- **Kết quả mong đợi:**
  - Hệ thống xác thực thành công tài khoản Google.
  - Nếu người dùng chưa tồn tại trong hệ thống, hệ thống tự động tạo tài khoản mới.
  - Nếu người dùng đã tồn tại, hệ thống sử dụng tài khoản hiện có để đăng nhập.
  - Hệ thống cấp JWT Access Token cho người dùng.
  - Người dùng được chuyển về trang chủ và đăng nhập thành công.
- **Kết quả thực tế:**
  - Google trả về thông tin xác thực hợp lệ.
  - Frontend gửi thông tin xác thực đến backend.
  - Backend xác minh tài khoản Google thành công và tự động tạo tài khoản nếu email chưa tồn tại.
  - Hệ thống cấp JWT Access Token và lưu trên trình duyệt.
  - Người dùng được chuyển về trang chủ và có thể sử dụng các chức năng của hệ thống.

**Kịch Bản TC-04: Quên Mật Khẩu và Đặt Lại Mật Khẩu**

- **Mục tiêu:** Kiểm tra chức năng khôi phục mật khẩu thông qua email và đặt lại mật khẩu mới.
- **Điều kiện tiên quyết:**
  - Người dùng đã có tài khoản trong hệ thống.
  - Địa chỉ email đã được đăng ký và có thể nhận thư điện tử.
- **Dữ liệu thử nghiệm:**
  - email: nguyenvana@gmail.com
- **Các bước thực hiện:**
  1. Người dùng truy cập trang đăng nhập.
  2. Nhấn "Quên mật khẩu".
  3. Nhập email đã đăng ký.
  4. Nhấn nút gửi email khôi phục.
  5. Kiểm tra email và nhấn vào liên kết đặt lại mật khẩu.
  6. Nhập mật khẩu mới và xác nhận mật khẩu.
  7. Nhấn nút "Đặt lại mật khẩu".
- **Kết quả mong đợi:**
  - Hệ thống gửi email chứa liên kết đặt lại mật khẩu.
  - Liên kết đặt lại mật khẩu còn hiệu lực trong khoảng thời gian quy định.
  - Người dùng có thể truy cập trang đặt lại mật khẩu.
  - Hệ thống cập nhật mật khẩu mới sau khi dữ liệu hợp lệ.
  - Người dùng đăng nhập thành công bằng mật khẩu mới.
  - Liên kết đặt lại mật khẩu không thể sử dụng lại sau khi đã đổi mật khẩu thành công.
- **Kết quả thực tế:**
  - Email khôi phục mật khẩu được gửi thành công.
  - Hệ thống tạo token đặt lại mật khẩu và kiểm tra thời gian hiệu lực theo cấu hình.
  - Người dùng truy cập được trang đặt lại mật khẩu.
  - Sau khi nhập mật khẩu mới, hệ thống cập nhật dữ liệu thành công.
  - Người dùng đăng nhập thành công bằng mật khẩu mới.

### 4.1.2 Nhóm 2 – Duyệt và Tìm Kiếm Sản Phẩm

**Kịch Bản TC-05: Tìm Kiếm và Lọc Sản Phẩm**

- **Mục tiêu:** Kiểm tra chức năng tìm kiếm và lọc sản phẩm theo nhiều tiêu chí.
- **Điều kiện tiên quyết:**
  - Hệ thống đã có dữ liệu sản phẩm.
  - Có sản phẩm thuộc danh mục Laptop, thương hiệu Acer với mức giá trong khoảng từ 10.000.000 đồng đến 30.000.000 đồng.
- **Dữ liệu thử nghiệm:**
  - Từ khóa tìm kiếm: (trống)
  - Danh mục: Laptop
  - Thương hiệu: Acer
  - Giá từ: 10.000.000
  - Giá đến: 30.000.000
- **Các bước thực hiện:**
  1. Người dùng truy cập trang danh sách sản phẩm.
  2. Chọn danh mục "Laptop".
  3. Chọn thương hiệu "Acer".
  4. Nhập khoảng giá từ 10.000.000 đến 30.000.000.
  5. Nhấn nút "Lọc".
- **Kết quả mong đợi:**
  - Hệ thống hiển thị danh sách sản phẩm phù hợp với các tiêu chí tìm kiếm.
  - Chỉ các sản phẩm thuộc danh mục Laptop, thương hiệu Acer và nằm trong khoảng giá đã chọn được hiển thị.
  - Kết quả được phân trang theo cấu hình của hệ thống.
  - Hiển thị đúng số lượng sản phẩm tìm thấy.
  - Người dùng có thể chuyển sang các trang tiếp theo nếu có nhiều kết quả.
- **Kết quả thực tế:**
  - Hệ thống trả về đúng các sản phẩm phù hợp với điều kiện tìm kiếm.
  - Danh sách sản phẩm được phân trang, mỗi trang hiển thị 12 sản phẩm.
  - API lấy danh sách sản phẩm hoạt động bình thường và trả về dữ liệu chính xác.
  - Chức năng tìm kiếm và lọc hoạt động đúng yêu cầu.

**Kịch Bản TC-06: Xem Chi Tiết Sản Phẩm**

- **Mục tiêu:** Kiểm tra chức năng hiển thị thông tin chi tiết của một sản phẩm.
- **Điều kiện tiên quyết:**
  - Hệ thống có dữ liệu sản phẩm.
  - Sản phẩm được chọn đang ở trạng thái Đang bán (ACTIVE).
- **Dữ liệu thử nghiệm:**
  - Sản phẩm: Laptop Acer Aspire 5
- **Các bước thực hiện:**
  1. Người dùng truy cập trang danh sách sản phẩm.
  2. Nhấn vào sản phẩm "Laptop Acer Aspire 5".
- **Kết quả mong đợi:**
  - Hệ thống chuyển đến trang chi tiết sản phẩm.
  - Hiển thị đầy đủ thông tin gồm tên sản phẩm, mô tả, danh mục, thương hiệu và giá bán.
  - Hiển thị đầy đủ hình ảnh của sản phẩm, người dùng có thể xem ảnh chi tiết.
  - Khi chọn phiên bản khác, hệ thống cập nhật đúng giá bán, tồn kho và thông tin tương ứng.
  - Hiển thị đầy đủ thông số kỹ thuật của sản phẩm.
  - Hiển thị danh sách đánh giá của khách hàng (nếu có).
- **Kết quả thực tế:**
  - Hệ thống chuyển đúng đến trang chi tiết của sản phẩm.
  - Thông tin sản phẩm được hiển thị đầy đủ và chính xác.
  - Hình ảnh sản phẩm hiển thị bình thường và có thể xem chi tiết.
  - Khi thay đổi phiên bản, giá bán và thông tin sản phẩm được cập nhật chính xác.
  - Thông số kỹ thuật và đánh giá của khách hàng được hiển thị đúng theo dữ liệu trong hệ thống.

### 4.1.3 Nhóm 3 – Giỏ Hàng và Đặt Hàng

**Kịch Bản TC-07: Thêm Sản Phẩm Vào Giỏ Hàng**

- **Mục tiêu:** Kiểm tra chức năng thêm sản phẩm vào giỏ hàng.
- **Điều kiện tiên quyết:**
  - Người dùng đã đăng nhập với vai trò CUSTOMER.
  - Sản phẩm còn hàng và đang được bán.
- **Dữ liệu thử nghiệm:**
  - Sản phẩm: Chuột Logitech G Pro X
  - Phiên bản: Màu đen
  - Số lượng: 2
- **Các bước thực hiện:**
  1. Người dùng truy cập trang chi tiết sản phẩm.
  2. Chọn phiên bản "Màu đen".
  3. Nhập số lượng là 2.
  4. Nhấn nút "Thêm vào giỏ hàng".
- **Kết quả mong đợi:**
  - Hệ thống thông báo thêm sản phẩm vào giỏ hàng thành công.
  - Biểu tượng giỏ hàng trên thanh điều hướng cập nhật đúng số lượng sản phẩm.
  - Sản phẩm xuất hiện trong giỏ hàng.
  - Hiển thị đúng tên sản phẩm, phiên bản, số lượng và đơn giá.
  - Thành tiền được tính chính xác theo số lượng đã chọn.
- **Kết quả thực tế:**
  - Hệ thống thêm sản phẩm vào giỏ hàng thành công.
  - API thêm sản phẩm vào giỏ hàng được xử lý thành công.
  - Số lượng trên biểu tượng giỏ hàng được cập nhật chính xác.
  - Sản phẩm hiển thị đúng trong giỏ hàng với số lượng là 2.
  - Giá bán và thành tiền được tính đúng.

**Kịch Bản TC-08: Thanh Toán COD (Thanh Toán Khi Nhận Hàng)**

- **Mục tiêu:** Kiểm tra chức năng đặt hàng và thanh toán bằng phương thức Thanh toán khi nhận hàng (COD).
- **Điều kiện tiên quyết:**
  - Người dùng đã đăng nhập với vai trò CUSTOMER.
  - Trong giỏ hàng đã có ít nhất một sản phẩm.
  - Mã giảm giá SUMMER20 còn hiệu lực và đáp ứng điều kiện sử dụng.
- **Dữ liệu thử nghiệm:**
  - Receiver name: Nguyễn Văn A
  - Receiver phone: 0912345678
  - Shipping address: 123 Nguyễn Huệ, Q.1, TP.HCM
  - Payment method: COD
  - Coupon code: SUMMER20
  - Note: Giao giờ hành chính
- **Các bước thực hiện:**
  1. Người dùng truy cập trang giỏ hàng.
  2. Nhấn nút "Thanh toán".
  3. Nhập thông tin người nhận.
  4. Nhập mã giảm giá SUMMER20.
  5. Chọn phương thức thanh toán COD.
  6. Nhấn nút "Đặt hàng".
- **Kết quả mong đợi:**
  - Hệ thống áp dụng thành công mã giảm giá hợp lệ.
  - Hiển thị đúng số tiền được giảm và tổng tiền phải thanh toán.
  - Đơn hàng được tạo thành công.
  - Trạng thái đơn hàng là PENDING (Chờ xác nhận).
  - Phương thức thanh toán được lưu là COD.
  - Hệ thống chuyển đến trang thông báo đặt hàng thành công.
  - Giỏ hàng được làm trống sau khi đặt hàng thành công.
- **Kết quả thực tế:**
  - Mã giảm giá được áp dụng thành công.
  - Tổng tiền sau giảm giá được tính chính xác.
  - Hệ thống tạo đơn hàng thành công.
  - API tạo đơn hàng trả về thành công và sinh mã đơn hàng.
  - Đơn hàng có trạng thái PENDING, phương thức thanh toán là COD.
  - Người dùng được chuyển đến trang thông báo đặt hàng thành công.
  - Giỏ hàng được xóa sau khi đơn hàng được tạo.

**Kịch Bản TC-09: Thanh Toán Chuyển Khoản Ngân Hàng (SePay)**

- **Mục tiêu:** Kiểm tra chức năng đặt hàng và cập nhật trạng thái thanh toán tự động thông qua SePay Webhook.
- **Điều kiện tiên quyết:**
  - Người dùng đã đăng nhập với vai trò CUSTOMER.
  - Trong giỏ hàng đã có ít nhất một sản phẩm.
  - Hệ thống đã cấu hình kết nối với dịch vụ SePay Webhook.
- **Dữ liệu thử nghiệm:**
  - Payment method: BANK_TRANSFER
  - Số tiền chuyển: 1.512.000 đồng
- **Các bước thực hiện:**
  1. Người dùng đặt hàng với phương thức chuyển khoản.
  2. Hệ thống hiển thị mã QR và thông tin chuyển khoản.
  3. Người dùng chuyển khoản qua ngân hàng.
  4. SePay gửi webhook về hệ thống.
- **Kết quả mong đợi:**
  - Hệ thống tạo đơn hàng thành công.
  - Trang thanh toán hiển thị đầy đủ mã QR và thông tin chuyển khoản.
  - Sau khi SePay gửi Webhook hợp lệ, hệ thống xác thực thành công dữ liệu nhận được.
  - Trạng thái thanh toán được cập nhật thành PAID.
  - Trạng thái đơn hàng được cập nhật thành CONFIRMED.
  - Khi người dùng truy cập lại trang đơn hàng, trạng thái mới được hiển thị chính xác.
- **Kết quả thực tế:**
  - Đơn hàng được tạo thành công.
  - Mã QR và thông tin chuyển khoản hiển thị đầy đủ.
  - Hệ thống nhận và xử lý thành công Webhook từ SePay.
  - Trạng thái thanh toán được cập nhật sang PAID.
  - Trạng thái đơn hàng được chuyển sang CONFIRMED.
  - Người dùng xem lại đơn hàng và thấy trạng thái đã được cập nhật.

**Kịch Bản TC-10: Áp Dụng Mã Giảm Giá**

- **Mục tiêu:** Kiểm tra chức năng áp dụng mã giảm giá khi thanh toán.
- **Điều kiện tiên quyết:**
  - Người dùng đã đăng nhập với vai trò CUSTOMER.
  - Trong giỏ hàng đã có sản phẩm với tổng giá trị 2.000.000 đồng.
  - Mã giảm giá SUMMER20 còn hiệu lực và đáp ứng điều kiện sử dụng.
- **Dữ liệu thử nghiệm:**
  - Coupon code: SUMMER20 (giảm 20%)
  - Tổng giỏ hàng: 2.000.000 đồng
- **Các bước thực hiện:**
  1. Người dùng truy cập trang thanh toán.
  2. Nhập mã giảm giá SUMMER20.
  3. Nhấn nút "Áp dụng".
- **Kết quả mong đợi:**
  - Hệ thống kiểm tra mã giảm giá thành công.
  - Mã giảm giá được áp dụng đúng.
  - Số tiền giảm là 400.000 đồng.
  - Tổng tiền thanh toán còn 1.600.000 đồng.
  - Hệ thống hiển thị thông báo áp dụng mã giảm giá thành công.
- **Kết quả thực tế:**
  - Mã giảm giá được áp dụng thành công.
  - Hệ thống tính đúng số tiền giảm và tổng tiền thanh toán.
  - Khi đơn hàng được tạo thành công, hệ thống ghi nhận mã giảm giá đã sử dụng.

### 4.1.4 Nhóm 4 – Quản Trị Hệ Thống (Admin)

**Kịch Bản TC-11: Quản Lý Sản Phẩm (Thêm Mới)**

- **Mục tiêu:** Kiểm tra chức năng tạo mới, chỉnh sửa sản phẩm trên giao diện admin.
- **Điều kiện tiên quyết:** Đăng nhập với tài khoản ROLE_ADMIN.
- **Dữ liệu thử nghiệm – Tạo sản phẩm mới:**
  - Tên sản phẩm: Chuột Gaming Logitech G Pro X
  - Danh mục: Phụ kiện
  - Thương hiệu: Logitech
  - Mô tả: Chuột gaming chuyên nghiệp
  - Variant 1: Màu đen, SKU: LGP-BLK, Giá: 1.500.000, Tồn kho: 10
  - Variant 2: Màu trắng, SKU: LGP-WHT, Giá: 1.500.000, Tồn kho: 5
- **Các bước thực hiện:**
  1. Vào /admin/products/create
  2. Điền thông tin sản phẩm
  3. Upload 3 ảnh sản phẩm qua Cloudinary
  4. Thêm variant với giá và tồn kho
  5. Thêm thông số kỹ thuật (DPI, kết nối, trọng lượng)
  6. Nhấn "Lưu sản phẩm"
- **Kết quả mong đợi:**
  - Ảnh được upload lên Cloudinary, trả về URL hợp lệ
  - Sản phẩm được tạo với tất cả thông tin, slug được tự sinh
  - Sản phẩm xuất hiện ngay trong danh sách /admin/products
- **Kết quả thực tế:**
  - Ảnh được upload lên Cloudinary, trả về URL hợp lệ
  - Sản phẩm được tạo với tất cả thông tin, slug được tự sinh
  - Sản phẩm xuất hiện ngay trong danh sách /admin/products

**Kịch Bản TC-12: Quản Lý Đơn Hàng và Cập Nhật Trạng Thái**

- **Mục tiêu:** Kiểm tra quy trình xử lý đơn hàng từ PENDING đến COMPLETED.
- **Luồng trạng thái:**
  - PENDING → CONFIRMED → SHIPPING → COMPLETED
  - PENDING → CANCELLED
- **Các bước thực hiện:**
  1. Vào /admin/orders, tìm đơn hàng vừa đặt (trạng thái PENDING)
  2. Nhấp vào đơn hàng để xem chi tiết
  3. Cập nhật trạng thái → CONFIRMED
  4. Cập nhật trạng thái → SHIPPING
  5. Cập nhật trạng thái → COMPLETED
- **Kết quả mong đợi:**
  - Mỗi lần cập nhật, API PATCH /api/v1/admin/orders/{id}/status trả về HTTP 200
  - Trạng thái đơn hàng thay đổi ngay lập tức trên giao diện admin
  - Khi khách hàng vào trang đơn hàng của mình, trạng thái cũng được cập nhật tương ứng
- **Kết quả thực tế:**
  - API cập nhật trạng thái hoạt động chính xác
  - Trạng thái đơn hàng thay đổi đúng theo quy trình
  - Khách hàng thấy trạng thái được cập nhật trên trang đơn hàng

**Kịch Bản TC-13: Quản Lý Danh Mục**

- **Mục tiêu:** Kiểm tra chức năng quản lý danh mục bao gồm thêm mới, cập nhật và xóa danh mục trong trang quản trị.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đang hoạt động bình thường.
  - Chưa tồn tại danh mục có tên Phụ kiện Gaming.
- **Dữ liệu thử nghiệm:**
  - Tên danh mục: Phụ kiện Gaming
  - Mô tả: Các phụ kiện gaming chuyên nghiệp
- **Các bước thực hiện:**
  - **Thêm danh mục:**
    1. Đăng nhập bằng tài khoản quản trị viên.
    2. Truy cập /admin/categories.
    3. Nhấn Thêm danh mục.
    4. Nhập đầy đủ thông tin danh mục.
    5. Nhấn Lưu.
  - **Cập nhật danh mục:**
    1. Chọn danh mục vừa tạo.
    2. Nhấn Sửa.
    3. Thay đổi tên thành Phụ kiện Gaming Cao Cấp.
    4. Cập nhật mô tả.
    5. Nhấn Lưu.
  - **Xóa danh mục:**
    1. Chọn danh mục vừa cập nhật.
    2. Nhấn Xóa.
    3. Xác nhận thao tác xóa.
- **Kết quả mong đợi:**
  - **Thêm danh mục:**
    - Frontend gửi yêu cầu POST /api/v1/admin/categories.
    - Hệ thống kiểm tra dữ liệu đầu vào.
    - Danh mục được lưu thành công vào cơ sở dữ liệu.
    - API trả về HTTP 201 Created.
    - Hiển thị thông báo "Thêm danh mục thành công".
    - Danh mục xuất hiện trong danh sách quản lý.
  - **Cập nhật danh mục:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/categories/{id}.
    - Hệ thống cập nhật thông tin danh mục.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật danh mục thành công".
    - Danh sách hiển thị thông tin mới.
  - **Xóa danh mục:**
    - Frontend gửi yêu cầu DELETE /api/v1/admin/categories/{id}.
    - Hệ thống kiểm tra ràng buộc dữ liệu.
    - Nếu danh mục chưa được sử dụng, hệ thống xóa thành công và trả về HTTP 200 OK.
    - Hiển thị thông báo "Xóa danh mục thành công".
    - Danh mục không còn xuất hiện trong danh sách quản lý.
- **Kết quả thực tế:**
  - Tất cả thao tác thêm, cập nhật, xóa danh mục hoạt động chính xác.
  - API trả về mã phản hồi đúng.
  - Ràng buộc dữ liệu được kiểm tra đúng.

**Kịch Bản TC-14: Quản Lý Thương Hiệu**

- **Mục tiêu:** Kiểm tra chức năng quản lý thương hiệu bao gồm thêm mới, cập nhật và xóa thương hiệu trong trang quản trị.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đang hoạt động bình thường.
  - Chưa tồn tại thương hiệu có tên SteelSeries.
- **Dữ liệu thử nghiệm:**
  - Tên thương hiệu: SteelSeries
  - Mô tả: Thương hiệu gaming chuyên nghiệp
- **Các bước thực hiện:**
  - **Thêm thương hiệu:**
    1. Đăng nhập bằng tài khoản quản trị viên.
    2. Truy cập /admin/brands.
    3. Nhấn Thêm thương hiệu.
    4. Nhập đầy đủ thông tin thương hiệu.
    5. Nhấn Lưu.
  - **Cập nhật thương hiệu:**
    1. Chọn thương hiệu vừa tạo.
    2. Nhấn Sửa.
    3. Thay đổi tên thành SteelSeries Gaming.
    4. Cập nhật mô tả.
    5. Nhấn Lưu.
  - **Xóa thương hiệu:**
    1. Chọn thương hiệu vừa cập nhật.
    2. Nhấn Xóa.
    3. Xác nhận thao tác xóa.
- **Kết quả mong đợi:**
  - **Thêm thương hiệu:**
    - Frontend gửi yêu cầu POST /api/v1/admin/brands.
    - Hệ thống kiểm tra dữ liệu đầu vào.
    - Hệ thống tự động sinh slug từ tên thương hiệu.
    - Thông tin thương hiệu được lưu thành công vào cơ sở dữ liệu.
    - API trả về HTTP 201 Created.
    - Hiển thị thông báo "Thêm thương hiệu thành công".
    - Thương hiệu xuất hiện trong danh sách quản lý.
  - **Cập nhật thương hiệu:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/brands/{id}.
    - Hệ thống kiểm tra dữ liệu đầu vào.
    - Thông tin thương hiệu được cập nhật thành công.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật thương hiệu thành công".
    - Danh sách hiển thị thông tin mới sau khi cập nhật.
  - **Xóa thương hiệu:**
    - Frontend gửi yêu cầu DELETE /api/v1/admin/brands/{id}.
    - Hệ thống kiểm tra ràng buộc dữ liệu.
    - Nếu thương hiệu chưa được sử dụng bởi sản phẩm nào, hệ thống xóa thành công.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Xóa thương hiệu thành công".
    - Thương hiệu không còn xuất hiện trong danh sách quản lý.
- **Kết quả thực tế:**
  - Tất cả thao tác hoạt động chính xác.
  - Slug được tự động sinh đúng.
  - Ràng buộc dữ liệu được kiểm tra đúng.

**Kịch Bản TC-15: Quản Lý Đơn Hàng**

- **Mục tiêu:** Kiểm tra chức năng quản lý đơn hàng trong trang quản trị, bao gồm xem thông tin đơn hàng và cập nhật trạng thái xử lý đơn hàng.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đã có ít nhất một đơn hàng ở trạng thái PENDING.
- **Dữ liệu thử nghiệm:**
  - Đơn hàng: ORD202606151430221234
- **Các bước thực hiện:**
  - **Xem đơn hàng:**
    1. Đăng nhập bằng tài khoản quản trị viên.
    2. Truy cập /admin/orders.
    3. Kiểm tra danh sách đơn hàng.
    4. Chọn đơn hàng cần xem.
    5. Kiểm tra thông tin chi tiết của đơn hàng.
  - **Cập nhật trạng thái đơn hàng:**
    1. Chọn đơn hàng có trạng thái PENDING.
    2. Chọn trạng thái mới là CONFIRMED.
    3. Nhấn Lưu.
- **Kết quả mong đợi:**
  - **Xem đơn hàng:**
    - Frontend gửi yêu cầu GET /api/v1/admin/orders.
    - Hệ thống trả về danh sách đơn hàng.
    - Hiển thị đầy đủ các thông tin: Mã đơn hàng, Thông tin khách hàng, Danh sách sản phẩm, Tổng tiền, Phương thức thanh toán, Trạng thái đơn hàng, Trạng thái thanh toán, Thời gian tạo đơn.
  - **Cập nhật trạng thái đơn hàng:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/orders/{id}/status.
    - Hệ thống kiểm tra trạng thái hiện tại của đơn hàng.
    - Hệ thống cập nhật trạng thái mới vào cơ sở dữ liệu.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật trạng thái đơn hàng thành công".
    - Danh sách đơn hàng hiển thị trạng thái mới sau khi cập nhật.
- **Kết quả thực tế:**
  - Xem đơn hàng: Hiển thị đầy đủ thông tin.
  - Cập nhật trạng thái: API hoạt động chính xác, trạng thái được cập nhật đúng.

**Kịch Bản TC-16: Quản Lý Khách Hàng**

- **Mục tiêu:** Kiểm tra chức năng quản lý khách hàng trong trang quản trị, bao gồm xem danh sách khách hàng, xem thông tin chi tiết và cập nhật trạng thái tài khoản.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đã có ít nhất một tài khoản khách hàng.
  - Khách hàng có trạng thái ACTIVE.
- **Dữ liệu thử nghiệm:**
  - Khách hàng: nguyenvana@gmail.com
- **Các bước thực hiện:**
  - **Xem thông tin khách hàng:**
    1. Đăng nhập bằng tài khoản quản trị viên.
    2. Truy cập /admin/customers.
    3. Kiểm tra danh sách khách hàng.
    4. Chọn một khách hàng để xem thông tin.
  - **Cập nhật trạng thái khách hàng:**
    1. Chọn khách hàng có trạng thái ACTIVE.
    2. Nhấn Khóa tài khoản.
    3. Xác nhận thao tác cập nhật.
    4. Kiểm tra lại trạng thái của khách hàng trong danh sách.
- **Kết quả mong đợi:**
  - **Xem thông tin khách hàng:**
    - Frontend gửi yêu cầu GET /api/v1/admin/customers.
    - Hệ thống trả về danh sách khách hàng.
    - Hiển thị đầy đủ các thông tin: Họ và tên, Email, Số điện thoại, Ngày đăng ký, Trạng thái tài khoản, Số lượng đơn hàng (nếu có).
  - **Cập nhật trạng thái khách hàng:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/customers/{id}/status.
    - Hệ thống cập nhật trạng thái tài khoản từ ACTIVE sang BLOCKED.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật trạng thái khách hàng thành công".
    - Danh sách khách hàng hiển thị trạng thái mới.
- **Kết quả thực tế:**
  - Xem thông tin khách hàng: Hiển thị đầy đủ thông tin.
  - Cập nhật trạng thái: API hoạt động chính xác, trạng thái được cập nhật đúng.

**Kịch Bản TC-17: Quản Lý Nhân Viên**

- **Mục tiêu:** Kiểm tra chức năng quản lý nhân viên trong trang quản trị, bao gồm thêm mới, cập nhật thông tin và khóa/mở khóa tài khoản nhân viên.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đang hoạt động bình thường.
  - Chưa tồn tại nhân viên có email tranvanb@techstore.com.
- **Dữ liệu thử nghiệm:**
  - Họ tên: Trần Văn B
  - Email: tranvanb@techstore.com
  - SĐT: 0909123456
  - Vai trò: STAFF
- **Các bước thực hiện:**
  - **Thêm nhân viên:**
    1. Đăng nhập bằng tài khoản quản trị viên.
    2. Truy cập /admin/employees.
    3. Nhấn Thêm nhân viên.
    4. Nhập đầy đủ thông tin nhân viên.
    5. Chọn vai trò STAFF.
    6. Nhấn Lưu.
  - **Cập nhật thông tin nhân viên:**
    1. Chọn nhân viên vừa tạo.
    2. Nhấn Sửa.
    3. Thay đổi số điện thoại thành 0909123456.
    4. Nhấn Lưu.
  - **Khóa/Mở khóa tài khoản:**
    1. Chọn nhân viên vừa cập nhật.
    2. Nhấn Khóa tài khoản.
    3. Xác nhận thao tác.
    4. Kiểm tra trạng thái chuyển sang BLOCKED.
    5. Nhấn Mở khóa tài khoản.
    6. Xác nhận thao tác.
- **Kết quả mong đợi:**
  - **Thêm nhân viên:**
    - Frontend gửi yêu cầu POST /api/v1/admin/employees.
    - Hệ thống kiểm tra dữ liệu đầu vào.
    - Mật khẩu được mã hóa bằng BCrypt trước khi lưu.
    - Thông tin nhân viên được lưu thành công vào cơ sở dữ liệu.
    - API trả về HTTP 201 Created.
    - Hiển thị thông báo "Thêm nhân viên thành công".
    - Nhân viên mới xuất hiện trong danh sách quản lý.
  - **Cập nhật thông tin nhân viên:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/employees/{id}.
    - Hệ thống kiểm tra dữ liệu.
    - Thông tin nhân viên được cập nhật thành công.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật nhân viên thành công".
    - Danh sách hiển thị thông tin mới.
  - **Khóa/Mở khóa tài khoản:**
    - Frontend gửi yêu cầu PUT /api/v1/admin/employees/{id}/status.
    - Hệ thống cập nhật trạng thái từ ACTIVE sang BLOCKED và ngược lại.
    - API trả về HTTP 200 OK.
    - Hiển thị thông báo "Cập nhật trạng thái nhân viên thành công".
    - Nhân viên bị khóa không thể đăng nhập vào hệ thống quản trị.
    - Sau khi mở khóa, nhân viên có thể đăng nhập bình thường.
- **Kết quả thực tế:**
  - Tất cả thao tác hoạt động chính xác.
  - Mật khẩu được mã hóa đúng bằng BCrypt.
  - Khóa/mở khóa tài khoản hoạt động đúng.

**Kịch Bản TC-18: Quản Lý Banner**

- **Mục tiêu:** Kiểm tra chức năng quản lý banner trong trang quản trị, bao gồm thêm mới, cập nhật và xóa banner.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống hoạt động bình thường.
- **Dữ liệu thử nghiệm:**
  - Tiêu đề: Khuyến mãi mùa hè
  - Vị trí: HOME_TOP
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên.
  2. Truy cập /admin/banners.
  3. Chọn Thêm banner.
  4. Nhập đầy đủ thông tin banner.
  5. Tải lên hình ảnh banner.
  6. Nhấn Lưu.
  7. Kiểm tra banner vừa tạo trong danh sách.
  8. Chọn Sửa banner và thay đổi tiêu đề hoặc thứ tự hiển thị.
  9. Nhấn Cập nhật.
  10. Chọn Xóa banner.
  11. Xác nhận thao tác xóa.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu tạo, cập nhật và xóa banner đến các API tương ứng.
  - Hệ thống kiểm tra dữ liệu đầu vào.
  - Hình ảnh banner được tải lên Cloudinary và trả về URL hợp lệ.
  - Banner được thêm mới thành công và hiển thị trong danh sách.
  - Sau khi cập nhật, thông tin banner được thay đổi đúng theo dữ liệu mới.
  - Sau khi xóa, banner không còn xuất hiện trong danh sách quản lý.
  - API trả về mã phản hồi phù hợp (HTTP 201, HTTP 200 hoặc HTTP 204 tùy theo thao tác).
  - Hệ thống hiển thị thông báo thao tác thành công.
- **Kết quả thực tế:**
  - Tất cả thao tác hoạt động chính xác.
  - Upload ảnh lên Cloudinary thành công.
  - API trả về mã phản hồi đúng.

**Kịch Bản TC-19: Quản Lý Tin Tức**

- **Mục tiêu:** Kiểm tra chức năng quản lý tin tức trong trang quản trị, bao gồm thêm mới, cập nhật và xóa bài viết.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống hoạt động bình thường.
- **Dữ liệu thử nghiệm:**
  - Tiêu đề: Top 5 laptop gaming 2024
  - Nội dung: Danh sách laptop gaming tốt nhất năm 2024
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên.
  2. Truy cập /admin/news.
  3. Chọn Thêm tin tức.
  4. Nhập tiêu đề và nội dung bài viết.
  5. Tải lên ảnh đại diện cho bài viết.
  6. Chọn trạng thái hiển thị.
  7. Nhấn Lưu.
  8. Kiểm tra bài viết vừa tạo trong danh sách.
  9. Chọn Sửa bài viết và cập nhật nội dung hoặc trạng thái.
  10. Nhấn Cập nhật.
  11. Chọn Xóa bài viết.
  12. Xác nhận thao tác xóa.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu tạo, cập nhật và xóa tin tức đến các API tương ứng.
  - Hệ thống kiểm tra dữ liệu đầu vào.
  - Ảnh đại diện được tải lên Cloudinary và trả về URL hợp lệ.
  - Hệ thống tự động sinh slug từ tiêu đề bài viết.
  - Bài viết được lưu thành công và hiển thị trong danh sách quản lý.
  - Sau khi cập nhật, thông tin bài viết được thay đổi theo dữ liệu mới.
  - Sau khi xóa, bài viết không còn xuất hiện trong danh sách quản lý.
  - API trả về mã phản hồi phù hợp (HTTP 201, HTTP 200 hoặc HTTP 204 tùy theo thao tác).
  - Hệ thống hiển thị thông báo thao tác thành công.
- **Kết quả thực tế:**
  - Tất cả thao tác hoạt động chính xác.
  - Slug được tự động sinh đúng.
  - Upload ảnh thành công.

**Kịch Bản TC-20: Quản Lý FAQ**

- **Mục tiêu:** Kiểm tra chức năng quản lý câu hỏi thường gặp (FAQ) trong trang quản trị, bao gồm thêm mới, cập nhật và xóa FAQ.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống hoạt động bình thường.
- **Dữ liệu thử nghiệm:**
  - Câu hỏi: Làm thế nào để đổi trả sản phẩm?
  - Câu trả lời: Bạn có thể đổi trả sản phẩm trong vòng 7 ngày.
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên.
  2. Truy cập /admin/faqs.
  3. Chọn Thêm FAQ.
  4. Nhập câu hỏi, câu trả lời, thứ tự hiển thị và trạng thái.
  5. Nhấn Lưu.
  6. Kiểm tra FAQ vừa tạo trong danh sách.
  7. Chọn Sửa FAQ và cập nhật nội dung hoặc trạng thái.
  8. Nhấn Cập nhật.
  9. Chọn Xóa FAQ.
  10. Xác nhận thao tác xóa.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu tạo, cập nhật và xóa FAQ đến các API tương ứng.
  - Hệ thống kiểm tra dữ liệu đầu vào.
  - FAQ được lưu thành công và hiển thị trong danh sách quản lý.
  - Sau khi cập nhật, nội dung FAQ được thay đổi theo dữ liệu mới.
  - Sau khi xóa, FAQ không còn xuất hiện trong danh sách quản lý.
  - API trả về mã phản hồi phù hợp (HTTP 201, HTTP 200 hoặc HTTP 204 tùy theo thao tác).
  - Hệ thống hiển thị thông báo thao tác thành công.
- **Kết quả thực tế:**
  - Tất cả thao tác hoạt động chính xác.
  - API trả về mã phản hồi đúng.

**Kịch Bản TC-21: Quản Lý Liên Hệ**

- **Mục tiêu:** Kiểm tra chức năng quản lý các liên hệ do khách hàng gửi trong trang quản trị, bao gồm xem, cập nhật trạng thái và phản hồi liên hệ.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN hoặc ROLE_STAFF.
  - Hệ thống đã có liên hệ do khách hàng gửi.
- **Dữ liệu thử nghiệm:**
  - Liên hệ từ khách hàng về vấn đề đơn hàng.
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên hoặc nhân viên.
  2. Truy cập /admin/contact-messages.
  3. Chọn một liên hệ trong danh sách.
  4. Xem chi tiết nội dung liên hệ.
  5. Cập nhật trạng thái liên hệ sang Đã xử lý.
  6. Nhập nội dung phản hồi (nếu hệ thống hỗ trợ).
  7. Nhấn Lưu.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu lấy danh sách và cập nhật thông tin liên hệ đến các API tương ứng.
  - Hệ thống hiển thị đầy đủ thông tin khách hàng và nội dung liên hệ.
  - Trạng thái liên hệ cũng được cập nhật thành công.
  - Nội dung phản hồi (nếu có) được lưu vào cơ sở dữ liệu.
  - API trả về mã phản hồi HTTP 200 OK.
  - Hệ thống hiển thị thông báo "Cập nhật liên hệ thành công" và danh sách được làm mới.
- **Kết quả thực tế:**
  - Xem liên hệ: Hiển thị đầy đủ thông tin.
  - Cập nhật trạng thái: API hoạt động chính xác.

**Kịch Bản TC-22: Quản Lý Chat Trực Tuyến**

- **Mục tiêu:** Kiểm tra chức năng quản lý chat trực tuyến giữa khách hàng và nhân viên, bao gồm xem danh sách phiên chat, nhận phiên chat, gửi tin nhắn phản hồi và đóng phiên chat.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN hoặc ROLE_STAFF.
  - Đã có ít nhất một phiên chat được khách hàng tạo.
- **Dữ liệu thử nghiệm:**
  - Phiên chat từ khách hàng hỏi về sản phẩm.
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên hoặc nhân viên.
  2. Truy cập /admin/chat.
  3. Chọn một phiên chat của khách hàng.
  4. Xem lịch sử tin nhắn.
  5. Nhận phiên chat để bắt đầu hỗ trợ khách hàng.
  6. Nhập nội dung phản hồi và gửi tin nhắn.
  7. Sau khi hỗ trợ hoàn tất, chọn Đóng phiên chat.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu lấy danh sách phiên chat và lịch sử tin nhắn đến các API tương ứng.
  - Hệ thống hiển thị đầy đủ thông tin khách hàng và nội dung cuộc trò chuyện.
  - Nhân viên nhận phiên chat thành công và có thể gửi tin nhắn phản hồi.
  - Tin nhắn mới được lưu vào cơ sở dữ liệu và hiển thị cho khách hàng theo cơ chế polling.
  - Sau khi đóng phiên chat, trạng thái phiên chat được cập nhật thành Đã đóng.
  - API trả về mã phản hồi HTTP 200 OK.
  - Hệ thống hiển thị thông báo thao tác thành công.
- **Kết quả thực tế:**
  - Xem phiên chat: Hiển thị đầy đủ thông tin.
  - Nhận phiên chat: API hoạt động chính xác.
  - Gửi tin nhắn: Tin nhắn được lưu và hiển thị đúng.
  - Đóng phiên chat: Trạng thái được cập nhật đúng.

**Kịch Bản TC-23: Quản Lý Đánh Giá Sản Phẩm**

- **Mục tiêu:** Kiểm tra chức năng quản lý đánh giá sản phẩm trong trang quản trị, bao gồm xem danh sách đánh giá, duyệt, ẩn và xóa đánh giá.
- **Điều kiện tiên quyết:**
  - Đăng nhập bằng tài khoản có quyền ROLE_ADMIN.
  - Hệ thống đã có đánh giá từ khách hàng.
- **Dữ liệu thử nghiệm:**
  - Đánh giá từ khách hàng về sản phẩm.
- **Các bước thực hiện:**
  1. Đăng nhập bằng tài khoản quản trị viên.
  2. Truy cập /admin/reviews.
  3. Xem danh sách đánh giá với bộ lọc theo trạng thái.
  4. Chọn đánh giá có trạng thái PENDING.
  5. Nhấn nút "Duyệt" để chuyển sang VISIBLE.
  6. Chọn đánh giá và nhấn "Ẩn" để chuyển sang HIDDEN.
  7. Chọn đánh giá và nhấn "Xóa" để soft delete.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu GET /api/v1/admin/reviews với bộ lọc.
  - Hệ thống hiển thị danh sách đánh giá theo trạng thái và từ khóa tìm kiếm.
  - PUT /api/v1/admin/reviews/{reviewId}/approve chuyển trạng thái sang VISIBLE.
  - PUT /api/v1/admin/reviews/{reviewId}/hide chuyển trạng thái sang HIDDEN.
  - DELETE /api/v1/admin/reviews/{reviewId} soft delete đánh giá.
  - API trả về mã phản hồi HTTP 200 OK.
  - Hệ thống hiển thị thông báo thao tác thành công.
- **Kết quả thực tế:**
  - Xem danh sách đánh giá: Hiển thị đầy đủ thông tin.
  - Duyệt đánh giá: Trạng thái được chuyển sang VISIBLE.
  - Ẩn đánh giá: Trạng thái được chuyển sang HIDDEN.
  - Xóa đánh giá: Soft delete thành công.

### 4.1.5 Nhóm 5 – Chức Năng Hỗ Trợ

**Kịch Bản TC-24: Chat Hỗ Trợ Khách Hàng**

- **Mục tiêu:** Kiểm tra chức năng chat trực tuyến giữa khách hàng và nhân viên hỗ trợ.
- **Điều kiện tiên quyết:**
  - Khách hàng đã đăng nhập bằng tài khoản CUSTOMER.
  - Nhân viên hoặc quản trị viên đã đăng nhập vào hệ thống quản trị.
- **Dữ liệu thử nghiệm:**
  - Tin nhắn khách hàng: "Tôi muốn hỏi về sản phẩm laptop"
- **Các bước thực hiện:**
  1. Khách hàng đăng nhập vào hệ thống.
  2. Chọn biểu tượng Chat và bắt đầu cuộc trò chuyện.
  3. Gửi tin nhắn: "Tôi muốn hỏi về sản phẩm laptop".
  4. Nhân viên đăng nhập vào trang /admin/chat.
  5. Kiểm tra danh sách phiên chat mới.
  6. Chọn phiên chat và nhận xử lý.
  7. Gửi tin nhắn phản hồi cho khách hàng.
  8. Khách hàng mở lại cửa sổ chat và kiểm tra phản hồi.
  9. Hai bên tiếp tục trao đổi nếu cần.
- **Kết quả mong đợi:**
  - Hệ thống tạo phiên chat mới với trạng thái OPEN.
  - Nhân viên nhận phiên chat thành công.
  - Tin nhắn của khách hàng và nhân viên được lưu vào cơ sở dữ liệu.
  - Tin nhắn mới được hiển thị trên cả hai phía theo cơ chế polling.
  - Hệ thống hiển thị đúng người gửi và thời gian gửi tin nhắn.
- **Kết quả thực tế:**
  - Phiên chat được tạo thành công.
  - Nhân viên nhận phiên chat thành công.
  - Tin nhắn được lưu và hiển thị đúng.
  - Polling hoạt động chính xác.

**Kịch Bản TC-25: AI Chatbot Tự Động Trả Lời**

- **Mục tiêu:** Kiểm tra chức năng AI Chatbot tự động trả lời khách hàng khi chưa có nhân viên nhận chat.
- **Điều kiện tiên quyết:**
  - Khách hàng đã đăng nhập bằng tài khoản CUSTOMER.
  - Hệ thống đã cấu hình Gemini API Key.
  - Chưa có nhân viên nhận phiên chat.
- **Dữ liệu thử nghiệm:**
  - Tin nhắn khách hàng: "Laptop nào dưới 15 triệu phù hợp học lập trình?"
- **Các bước thực hiện:**
  1. Khách hàng đăng nhập vào hệ thống.
  2. Chọn biểu tượng Chat và bắt đầu cuộc trò chuyện.
  3. Gửi tin nhắn: "Laptop nào dưới 15 triệu phù hợp học lập trình?"
  4. Hệ thống tự động gọi AI Chatbot.
  5. AI trả lời dựa trên dữ liệu sản phẩm trong hệ thống.
- **Kết quả mong đợi:**
  - Hệ thống tạo phiên chat mới với trạng thái OPEN.
  - AI Chatbot tự động trả lời tin nhắn của khách hàng.
  - Câu trả lời dựa trên dữ liệu sản phẩm thực tế trong cơ sở dữ liệu.
  - Tin nhắn AI được lưu vào cơ sở dữ liệu với sender = null (bot).
  - Khách hàng nhận được câu trả lời ngay lập tức.
- **Kết quả thực tế:**
  - Phiên chat được tạo thành công.
  - AI Chatbot trả lời tự động.
  - Câu trả lời dựa trên dữ liệu sản phẩm thực tế.
  - Tin nhắn AI được lưu đúng với sender = null.

**Kịch Bản TC-26: Đánh Giá Sản Phẩm Sau Khi Mua**

- **Mục tiêu:** Kiểm tra chức năng đánh giá sản phẩm sau khi khách hàng đã mua hàng.
- **Điều kiện tiên quyết:**
  - Khách hàng đã đăng nhập.
  - Đơn hàng chứa sản phẩm đã ở trạng thái COMPLETED.
- **Dữ liệu thử nghiệm:**
  - Sản phẩm: Chuột Logitech G Pro X
  - Số sao: 5
  - Bình luận: Sản phẩm rất tốt, cảm giác tay êm ái.
- **Các bước thực hiện:**
  1. Khách hàng đăng nhập vào hệ thống.
  2. Truy cập trang chi tiết sản phẩm đã mua.
  3. Chọn Viết đánh giá.
  4. Nhập tiêu đề, nội dung và số sao.
  5. Nhấn Gửi đánh giá.
- **Kết quả mong đợi:**
  - Frontend gửi yêu cầu POST /api/v1/reviews.
  - API trả về HTTP 201 Created.
  - Đánh giá được lưu vào cơ sở dữ liệu với trạng thái PENDING.
  - Sau khi quản trị viên duyệt, đánh giá được hiển thị trên trang chi tiết sản phẩm.
- **Kết quả thực tế:**
  - Đánh giá được tạo thành công.
  - Trạng thái ban đầu là PENDING.
  - Sau khi admin duyệt, đánh giá hiển thị trên trang sản phẩm.

## 4.2. KẾT QUẢ THỬ NGHIỆM CÁC KỊCH BẢN

### 4.2.1 Bảng Tổng Hợp Kết Quả

| Nhóm chức năng | Số kịch bản | Đạt | Không đạt | Tỷ lệ thành công |
|---------------|-------------|-----|-----------|------------------|
| Nhóm 1 – Xác thực người dùng | 4 | 4 | 0 | 100% |
| Nhóm 2 – Duyệt và tìm kiếm sản phẩm | 2 | 2 | 0 | 100% |
| Nhóm 3 – Giỏ hàng và đặt hàng | 4 | 4 | 0 | 100% |
| Nhóm 4 – Quản trị hệ thống | 13 | 13 | 0 | 100% |
| Nhóm 5 – Chức năng hỗ trợ | 3 | 3 | 0 | 100% |
| **Tổng cộng** | **26** | **26** | **0** | **100%** |

**Tổng kết:** 26/26 kịch bản PASS ✅ — Tỷ lệ thành công: 100%

### 4.2.2 Kết Quả Chi Tiết Từng Kịch Bản

**TC-01: Đăng Ký Tài Khoản**

Request:
```http
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0912345678",
  "password": "Test@12345"
}
```

Response (HTTP 200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ...",
  "userId": 42,
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "role": "ROLE_CUSTOMER"
}
```

Xác minh DB:
```sql
SELECT id, full_name, email, role, status
FROM users
WHERE email = 'nguyenvana@gmail.com';
-- id=42, full_name='Nguyễn Văn A', role='ROLE_CUSTOMER', status='ACTIVE'
```

**TC-08: Thanh Toán COD**

Request:
```http
POST http://localhost:8080/api/v1/orders
Authorization: Bearer eyJhbGci...
Content-Type: application/json
{
  "receiverName": "Nguyễn Văn A",
  "receiverPhone": "0912345678",
  "shippingAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
  "paymentMethod": "COD",
  "couponCode": "SUMMER20",
  "note": "Giao giờ hành chính"
}
```

Response (HTTP 200):
```json
{
  "id": 15,
  "orderCode": "ORD202606151430221234",
  "orderStatus": "PENDING",
  "subtotalAmount": 1890000.00,
  "shippingFee": 0.00,
  "discountAmount": 378000.00,
  "finalAmount": 1512000.00,
  "couponCode": "SUMMER20",
  "receiverName": "Nguyễn Văn A",
  "receiverPhone": "0912345678",
  "shippingAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
  "payment": {
    "method": "COD",
    "status": "PENDING",
    "amount": 1512000.00
  },
  "items": [...]
}
```

Kiểm tra nghiệp vụ:
- Coupon SUMMER20 (giảm 20%): 1.890.000 × 20% = 378.000đ ✅
- Tổng thanh toán: 1.890.000 - 378.000 = 1.512.000đ ✅
- Stock của variant giảm đi đúng số lượng ✅
- Giỏ hàng bị xóa sau đặt hàng ✅

**TC-09: SePay Webhook**

Giả lập webhook từ SePay:
```http
POST http://localhost:8080/api/v1/payments/sepay-webhook
Authorization: Apikey techstore-sepay-2026-abcXYZ789
Content-Type: application/json
{
  "id": 98765,
  "transferType": "in",
  "transferAmount": 1512000,
  "accountNumber": "0916512785",
  "content": "ORD202606151430221234 TK NGUYEN VAN A",
  "code": "FT26166123456789",
  "referenceCode": "FT26166123456789",
  "description": "Chuyen khoan mua hang"
}
```

Kết quả:
- Backend extract mã đơn bằng regex ORD\d{18} → tìm thấy ORD202606151430221234 ✅
- So sánh transferAmount (1.512.000) ≥ payment.amount (1.512.000) → hợp lệ ✅
- Payment status: PENDING → PAID ✅
- Order status: PENDING → CONFIRMED ✅
- paidAt được ghi lại: 2026-06-15T14:30:25 ✅
- transactionCode: FT26166123456789 ✅

**TC-25: AI Chatbot**

Request từ khách hàng:
```http
POST http://localhost:8080/api/v1/chat/sessions/{sessionId}/messages
Authorization: Bearer <customer_token>
Content-Type: application/json
{
  "message": "Laptop nào dưới 15 triệu phù hợp học lập trình?"
}
```

Kết quả:
- Hệ thống gọi Gemini API với context sản phẩm từ database ✅
- AI trả lời dựa trên dữ liệu sản phẩm thực tế ✅
- Tin nhắn AI được lưu với sender = null (bot) ✅
- Khách hàng nhận được câu trả lời ngay lập tức ✅

## 4.3. XỬ LÝ CÁC TRƯỜNG HỢP NGOẠI LỆ

Hệ thống TechStore được thiết kế với cơ chế xử lý ngoại lệ toàn diện thông qua lớp GlobalExceptionHandler, đảm bảo tất cả lỗi đều được trả về dưới định dạng JSON thống nhất và thông báo có ý nghĩa với người dùng.

Định dạng response lỗi chuẩn:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Mô tả lỗi cụ thể bằng tiếng Việt",
  "timestamp": "2026-06-15T14:30:25",
  "errors": {
    "fieldName": "Validation message"
  }
}
```

### 4.3.1 Ngoại Lệ Xác Thực Dữ Liệu (Validation)

**TH-01: Đăng Ký Với Email Đã Tồn Tại**

Input:
```json
{ "email": "nguyenvana@gmail.com", "password": "Test@12345", "fullName": "..." }
```

Xử lý trong AuthService.register():
```java
if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
    throw new BadRequestException("Email đã được sử dụng");
}
```

Response (HTTP 400):
```json
{
  "status": 400,
  "message": "Email đã được sử dụng"
}
```

Giao diện: Frontend hiển thị thông báo lỗi màu đỏ ngay bên dưới trường email.

**TH-02: Đăng Nhập Sai Email Hoặc Mật Khẩu**

Xử lý:
```java
try {
    authenticationManager.authenticate(...);
} catch (AuthenticationException exception) {
    throw new BadRequestException("Email hoặc mật khẩu không đúng");
}
```

Response (HTTP 400):
```json
{ "status": 400, "message": "Email hoặc mật khẩu không đúng" }
```

Lưu ý bảo mật: Thông báo lỗi không phân biệt "sai email" hay "sai mật khẩu" để tránh lộ thông tin về sự tồn tại của tài khoản.

**TH-03: Dữ Liệu Form Không Hợp Lệ (Bean Validation)**

Khi gửi form với dữ liệu thiếu hoặc không đúng định dạng (sử dụng @Valid + @NotBlank, @Email, @Size):

Input không hợp lệ:
```json
{ "email": "khong-phai-email", "password": "123", "fullName": "" }
```

Response (HTTP 400):
```json
{
  "status": 400,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "email": "Email không đúng định dạng",
    "password": "Mật khẩu phải có ít nhất 6 ký tự",
    "fullName": "Họ tên không được để trống"
  }
}
```

### 4.3.2 Ngoại Lệ Phân Quyền (Authorization)

**TH-04: Truy Cập Trang Admin Khi Chưa Đăng Nhập**

Khi người dùng truy cập trực tiếp URL /admin/products mà chưa đăng nhập:

Xử lý Frontend (AdminProtectedRoute.jsx):
```jsx
if (!isAuthenticated) {
  return <Navigate to="/login" replace />
}
if (!isAdminOrStaff) {
  return <Navigate to="/" replace />
}
```

Kết quả: Tự động redirect về /login, sau khi đăng nhập đúng role mới truy cập được.

**TH-05: Gọi API Admin Không Có JWT Token**

Request:
```http
GET /api/v1/admin/products
(không có Authorization header)
```

Xử lý trong JwtAuthenticationFilter: Token không hợp lệ, SecurityContext không được set.

Response (HTTP 403 Forbidden):
```json
{ "status": 403, "message": "Forbidden" }
```

**TH-06: Tài Khoản Bị Khóa (Status = BLOCKED)**

Khi admin lock tài khoản khách hàng, lần đăng nhập tiếp theo:

Xử lý:
```java
if (user.getStatus() != UserStatus.ACTIVE) {
    throw new BadRequestException("Tài khoản đã bị khóa hoặc ngừng hoạt động");
}
```

Response (HTTP 400):
```json
{ "status": 400, "message": "Tài khoản đã bị khóa hoặc ngừng hoạt động" }
```

### 4.3.3 Ngoại Lệ Nghiệp Vụ (Business Logic)

**TH-07: Đặt Hàng Khi Tồn Kho Không Đủ**

Khách hàng muốn mua 10 chuột nhưng kho chỉ còn 3:

Xử lý trong OrderService.validateCartItems():
```java
if (cartItem.getQuantity() > variant.getStock()) {
    throw new BadRequestException(
        "Sản phẩm " + product.getName() + " - " + variant.getName()
        + " chỉ còn " + variant.getStock() + " sản phẩm"
    );
}
```

Response (HTTP 400):
```json
{
  "status": 400,
  "message": "Sản phẩm Chuột Logitech G Pro X - Màu đen chỉ còn 3 sản phẩm"
}
```

Giao diện: Thông báo lỗi hiển thị rõ tên sản phẩm và số lượng tồn kho còn lại.

**TH-08: Sản Phẩm Trong Giỏ Đã Ngừng Bán**

Khi sản phẩm bị admin chuyển sang trạng thái INACTIVE trong khi khách hàng đang checkout:

Xử lý:
```java
if (product.getStatus() != ProductStatus.ACTIVE || product.getDeletedAt() != null) {
    throw new BadRequestException(
        "Sản phẩm " + product.getName() + " đã ngừng bán, vui lòng xóa khỏi giỏ hàng"
    );
}
```

Response (HTTP 400):
```json
{
  "status": 400,
  "message": "Sản phẩm Laptop Acer Aspire 5 đã ngừng bán, vui lòng xóa khỏi giỏ hàng"
}
```

**TH-09: Mã Giảm Giá Không Hợp Lệ**

Các trường hợp mã coupon bị từ chối:

| Trường hợp | Thông báo lỗi |
|-----------|--------------|
| Mã không tồn tại | "Mã giảm giá không tồn tại" |
| Mã đã hết hạn | "Mã giảm giá đã hết hạn" |
| Đơn hàng chưa đạt tối thiểu | "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã" |
| Đã dùng mã này rồi | "Bạn đã sử dụng mã giảm giá này" |
| Mã đã hết lượt dùng | "Mã giảm giá đã hết lượt sử dụng" |

**TH-10: Vượt Giới Hạn Đơn Chuyển Khoản Đang Chờ**

Khách hàng cố tạo đơn bank transfer thứ 4 trong khi còn 3 đơn chưa thanh toán:

Xử lý trong OrderService.validatePendingBankTransferLimit():
```java
long pendingCount = paymentRepository.countPendingBankTransferOrdersByUser(...);
if (pendingCount >= 3) {
    throw new BadRequestException(
        "Bạn đang có quá nhiều đơn chuyển khoản chưa thanh toán..."
    );
}
```

Response (HTTP 400):
```json
{
  "status": 400,
  "message": "Bạn đang có quá nhiều đơn chuyển khoản chưa thanh toán. Vui lòng thanh toán hoặc chờ hệ thống hủy đơn quá hạn trước khi đặt tiếp."
}
```

**TH-11: SePay Webhook Không Hợp Lệ**

**TH-11a: Authorization sai:**
```http
POST /api/v1/payments/sepay-webhook
Authorization: Apikey wrong-key-here
```

Xử lý:
```java
if (!authorization.equals("Apikey " + sepayWebhookApiKey)) {
    throw new BadRequestException("Webhook SePay không hợp lệ");
}
```

**TH-11b: Số tiền chuyển khoản không đủ:**
```json
{ "transferAmount": 100000, ... }  // Đơn hàng cần 1.512.000đ
```

Xử lý: transferAmount < payment.amount → bỏ qua, không cập nhật trạng thái.

**TH-11c: Mã đơn hàng không tìm thấy trong nội dung:**
```json
{ "content": "CK tien hang thang 6", ... }
```

Xử lý: extractOrderCode() trả về null → method return sớm, không xử lý.

**TH-11d: Webhook trùng lặp (idempotency):** Nếu SePay gửi lại webhook cho cùng một giao dịch, hệ thống kiểm tra:
```java
if (paymentRepository.findByTransactionCode(transactionCode).isPresent()) {
    return; // Bỏ qua, tránh xử lý trùng
}
```

### 4.3.4 Ngoại Lệ Không Tìm Thấy Tài Nguyên

**TH-12: Sản Phẩm Không Tồn Tại**

Request:
```http
GET /api/v1/products/slug-khong-ton-tai
```

Xử lý:
```java
Product product = productRepository.findBySlug(slug)
    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
```

Response (HTTP 404):
```json
{ "status": 404, "message": "Không tìm thấy sản phẩm" }
```

Giao diện: Frontend hiển thị trang "Không tìm thấy sản phẩm" với nút quay lại danh sách.

**TH-13: Truy Cập Đơn Hàng Của Người Khác**

Khách hàng A cố tình truy cập đơn hàng của khách hàng B:

Request:
```http
GET /api/v1/orders/999
Authorization: Bearer <token_cua_khach_A>
```

Xử lý:
```java
if (!order.getUser().getId().equals(user.getId())) {
    throw new ResourceNotFoundException("Không tìm thấy đơn hàng");
}
```

Response (HTTP 404):
```json
{ "status": 404, "message": "Không tìm thấy đơn hàng" }
```

Lưu ý bảo mật: Trả về 404 thay vì 403 để không tiết lộ sự tồn tại của đơn hàng.

### 4.3.5 Ngoại Lệ Kỹ Thuật (System Errors)

**TH-14: Upload Ảnh Vượt Giới Hạn Kích Thước**

Khi admin upload file ảnh lớn hơn 5MB (giới hạn trong application.properties):

Cấu hình:
```properties
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

Response (HTTP 400):
```json
{ "status": 400, "message": "File upload quá lớn. Kích thước tối đa là 5MB" }
```

**TH-15: JWT Token Hết Hạn**

Khi người dùng gọi API với token đã hết hạn (sau 24 giờ):

Xử lý trong JwtAuthenticationFilter: Token không valid, SecurityContext không được set.

Response (HTTP 403):
```json
{ "status": 403, "message": "Forbidden" }
```

Xử lý Frontend trong axiosClient.js:
```javascript
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
    return Promise.reject({ status: error.response?.status, message })
  }
)
```

Khi gặp lỗi 403, AuthContext phát hiện và tự động đăng xuất người dùng.

### 4.3.6 Tổng Hợp Các Loại Ngoại Lệ

Tổng cộng: 15 trường hợp ngoại lệ được xử lý rõ ràng, đầy đủ thông báo tiếng Việt, đảm bảo trải nghiệm người dùng tốt và bảo mật hệ thống.

---

# Chương 5. KẾT LUẬN

## 5.1. KẾT QUẢ ĐỐI CHIẾU VỚI MỤC TIÊU

Dựa trên các mục tiêu cụ thể đã đề ra ở mục 1.1.2, bảng dưới đây đánh giá mức độ hoàn thành của từng mục tiêu:

| STT | Mục tiêu cụ thể | Trạng thái | Đánh giá đạt/không đạt | Giải thích nếu không đạt |
|-----|----------------|------------|------------------------|-------------------------|
| 1 | Nghiên cứu quy trình hoạt động của website bán hàng trực tuyến trong lĩnh vực công nghệ, xác định các chức năng cần thiết (hiển thị sản phẩm, tìm kiếm, giỏ hàng, đặt hàng, thanh toán, quản lý đơn hàng, đánh giá sản phẩm) | Đã hoàn thành | **Đạt** | Đã khảo sát các hệ thống tương tự (GearVN, Phong Vũ, An Phát Computer, CellphoneS) và xác định đầy đủ các chức năng cần thiết cho hệ thống. |
| 2 | Xây dựng giao diện người dùng thân thiện, dễ sử dụng, cho phép khách hàng xem danh sách sản phẩm, xem chi tiết sản phẩm, lựa chọn biến thể, thêm sản phẩm vào giỏ hàng, mua ngay, đặt hàng, theo dõi đơn hàng, gửi đánh giá và liên hệ hỗ trợ | Đã hoàn thành | **Đạt** | Frontend được xây dựng bằng ReactJS với giao diện hiện đại, thân thiện. Tất cả các chức năng khách hàng đều hoạt động tốt theo kịch bản thử nghiệm (TC-05, TC-06, TC-07, TC-08, TC-09, TC-10, TC-26). |
| 3 | Xây dựng hệ thống quản trị dành cho quản trị viên và nhân viên, bao gồm các chức năng quản lý sản phẩm, danh mục, thương hiệu, đơn hàng, mã giảm giá, banner, tin tức, FAQ, tin nhắn liên hệ, chat trực tuyến, tài khoản khách hàng và tài khoản nhân viên | Đã hoàn thành | **Đạt** | Hệ thống quản trị đầy đủ với tất cả các chức năng quản lý. Các kịch bản thử nghiệm TC-11 đến TC-22 đều đạt 100%. Có thêm chức năng quản lý đánh giá (TC-23) không có trong mục tiêu ban đầu. |
| 4 | Xây dựng chức năng xác thực và phân quyền người dùng, bao gồm đăng ký, đăng nhập, quên mật khẩu, quản lý thông tin cá nhân và phân quyền giữa khách hàng, nhân viên và quản trị viên | Đã hoàn thành | **Đạt** | Xác thực bằng email/password và Google OAuth hoạt động tốt (TC-01, TC-02, TC-03). Quên mật khẩu với email reset hoạt động (TC-04). Phân quyền bằng Spring Security + JWT hoạt động chính xác. |
| 5 | Tích hợp chức năng chat trực tuyến nhằm hỗ trợ khách hàng trao đổi với nhân viên trong quá trình mua sắm, góp phần nâng cao chất lượng chăm sóc khách hàng | Đã hoàn thành | **Đạt** | Chat trực tuyến hoạt động tốt (TC-24). Có thêm AI Chatbot tự động trả lời khi chưa có nhân viên (TC-25) - vượt mục tiêu ban đầu. |
| 6 | Thiết kế cơ sở dữ liệu phù hợp để lưu trữ và quản lý thông tin sản phẩm, người dùng, thương hiệu, đơn hàng, mã giảm giá, bài viết, tin tức, banner, đánh giá, tin nhắn liên hệ và dữ liệu chat | Đã hoàn thành | **Đạt** | Database được thiết kế với PostgreSQL, có đầy đủ các bảng cần thiết. Có thêm bảng specification_keys và product_specifications để quản lý thông số kỹ thuật. |
| 7 | Kiểm thử các chức năng chính của hệ thống nhằm đảm bảo website hoạt động ổn định, dữ liệu được xử lý chính xác và đáp ứng đúng yêu cầu đặt ra | Đã hoàn thành | **Đạt** | Đã kiểm thử 26 kịch bản với tỷ lệ thành công 100%. Xử lý 15 trường hợp ngoại lệ đầy đủ. Hệ thống hoạt động ổn định. |

**Tổng kết:** 7/7 mục tiêu đạt ✅ - Tỷ lệ hoàn thành: 100%

## 5.2. CÁC VẤN ĐỀ CÒN TỒN ĐỌNG

Mặc dù hệ thống TechStore đã đạt được tất cả các mục tiêu đề ra và hoạt động ổn định, vẫn còn một số vấn đề cần lưu ý và có thể cải thiện trong tương lai:

### 5.2.1 Vấn đề về hiệu năng

- **Caching:** Hệ thống hiện chưa có cơ chế caching cho các dữ liệu tĩnh như danh sách sản phẩm, danh mục, banner. Điều này có thể dẫn đến việc truy vấn database nhiều lần không cần thiết, ảnh hưởng đến hiệu năng khi lượng người dùng tăng.
- **Image Optimization:** Hình ảnh được upload lên Cloudinary nhưng chưa được tối ưu hóa kích thước theo các thiết bị khác nhau (mobile, tablet, desktop). Có thể cải thiện bằng cách sử dụng responsive images.
- **Database Indexing:** Một số truy vấn phức tạp như thống kê doanh thu, top sản phẩm có thể được tối ưu hóa thêm bằng cách thêm các index phù hợp.

### 5.2.2 Vấn đề về trải nghiệm người dùng

- **Real-time Chat:** Chat hiện tại sử dụng cơ chế polling (frontend hỏi server định kỳ), không phải real-time. Có thể cải thiện bằng cách sử dụng WebSocket hoặc Server-Sent Events (SSE) để giảm độ trễ và tải server.
- **Search:** Chức năng tìm kiếm hiện tại chỉ dựa trên tên sản phẩm. Có thể cải thiện bằng cách thêm tìm kiếm theo thông số kỹ thuật, tìm kiếm mờ (fuzzy search), hoặc tích hợp Elasticsearch.
- **Recommendation:** Hệ thống chưa có chức năng gợi ý sản phẩm cho khách hàng dựa trên lịch sử mua hàng hoặc sản phẩm đã xem. Có thể phát triển hệ thống recommendation đơn giản.

### 5.2.3 Vấn đề về bảo mật

- **Rate Limiting:** Hệ thống chưa có cơ chế giới hạn số lượng request từ một IP hoặc một user trong một khoảng thời gian. Điều này có thể dẫn đến bị tấn công DDoS hoặc brute force.
- **2FA:** Chức năng xác thực hai yếu tố (Two-Factor Authentication) chưa được triển khai, có thể bổ sung để tăng tính bảo mật cho tài khoản quản trị viên.
- **Audit Log:** Hệ thống chưa ghi lại lịch sử các thao tác quan trọng của admin (xóa sản phẩm, xóa đơn hàng, v.v.). Có thể thêm audit log để theo dõi và kiểm tra.

### 5.2.4 Vấn đề về nghiệp vụ

- **Inventory Management:** Hệ thống chưa có chức năng quản lý nhập kho, xuất kho, chỉ quản lý tồn kho hiện tại. Có thể phát triển thêm module quản lý kho hàng đầy đủ.
- **Return/Refund:** Chức năng đổi trả hàng và hoàn tiền chưa được triển khai. Đây là chức năng quan trọng trong thương mại điện tử thực tế.
- **Loyalty Program:** Hệ thống chưa có chương trình tích điểm hoặc rank khách hàng. Có thể phát triển để tăng sự trung thành của khách hàng.
- **Multi-warehouse:** Hệ thống hiện giả định chỉ có một kho hàng. Với mô hình mở rộng, có thể cần hỗ trợ nhiều kho hàng ở các địa điểm khác nhau.

### 5.2.5 Vấn đề về kỹ thuật

- **Error Monitoring:** Hệ thống chưa có công cụ giám sát lỗi như Sentry hoặc LogRocket để theo dõi lỗi thực tế trên production.
- **Analytics:** Chưa tích hợp công cụ phân tích như Google Analytics để theo dõi hành vi người dùng.
- **CI/CD:** Quá trình deploy hiện tại có thể thủ công. Có thể thiết lập pipeline CI/CD tự động bằng GitHub Actions hoặc Jenkins.

## 5.3. HƯỚNG PHÁT TRIỂN

Dựa trên các vấn đề tồn đọng và nhu cầu thực tế của một website thương mại điện tử, dưới đây là một số hướng phát triển cho hệ thống TechStore trong tương lai:

### 5.3.1 Phát triển ngắn hạn (3-6 tháng)

**1. Tối ưu hiệu năng**
- Triển khai Redis caching cho các dữ liệu tĩnh (danh mục, banner, sản phẩm nổi bật)
- Thêm CDN cho hình ảnh để giảm tải server
- Tối ưu hóa database queries và thêm các index cần thiết
- Implement lazy loading cho hình ảnh sản phẩm

**2. Cải thiện chat real-time**
- Chuyển từ polling sang WebSocket hoặc SSE
- Thêm thông báo real-time khi có tin nhắn mới
- Thêm typing indicator (đang nhập liệu)
- Thêm file upload trong chat

**3. Cải thiện tìm kiếm**
- Tích hợp Elasticsearch cho tìm kiếm nâng cao
- Thêm tìm kiếm theo thông số kỹ thuật
- Thêm autocomplete/gợi ý từ khóa khi tìm kiếm
- Thêm bộ lọc nâng cấp (theo khoảng giá, thương hiệu, đánh giá)

**4. Bổ sung chức năng quản lý kho**
- Module nhập kho
- Module xuất kho
- Cảnh báo tồn kho thấp
- Báo cáo nhập xuất tồn

### 5.3.2 Phát triển trung hạn (6-12 tháng)

**1. Chức năng đổi trả và hoàn tiền**
- Form yêu cầu đổi trả hàng
- Quy trình duyệt đổi trả
- Tích hợp cổng thanh toán để hoàn tiền tự động
- Lịch sử đổi trả của khách hàng

**2. Chương trình khách hàng thân thiết**
- Hệ thống tích điểm
- Rank khách hàng (Bronze, Silver, Gold, Platinum)
- Quy đổi điểm thành voucher
- Ưu đãi riêng cho từng rank

**3. Recommendation System**
- Gợi ý sản phẩm dựa trên lịch sử mua hàng
- Gợi ý sản phẩm liên quan (sản phẩm thường mua cùng)
- Gợi ý sản phẩm đang xem bởi người khác
- Personalized homepage cho từng khách hàng

**4. Tích hợp mạng xã hội**
- Đăng nhập bằng Facebook, Zalo
- Chia sẻ sản phẩm lên mạng xã hội
- Đăng sản phẩm từ review khách hàng lên Facebook
- Tích hợp Zalo OA để hỗ trợ khách hàng

### 5.3.3 Phát triển dài hạn (12-24 tháng)

**1. Mobile App**
- Phát triển ứng dụng mobile (iOS/Android) bằng React Native hoặc Flutter
- Push notification cho đơn hàng, khuyến mãi
- Quét mã QR để xem sản phẩm
- Offline mode cho một số chức năng

**2. Multi-vendor Marketplace**
- Cho phép nhiều nhà bán hàng đăng ký bán trên hệ thống
- Hệ thống commission cho từng nhà bán hàng
- Dashboard riêng cho từng vendor
- Đánh giá và xếp hạng vendor

**3. AI nâng cao**
- Chatbot AI thông minh hơn với lịch sử hội thoại
- AI phân tích sentiment của đánh giá khách hàng
- AI dự báo nhu cầu sản phẩm dựa trên dữ liệu bán hàng
- AI hỗ trợ pricing động

**4. Omnichannel**
- Tích hợp với các sàn TMĐT (Shopee, Lazada, TikTok Shop)
- Đồng bộ tồn kho giữa các kênh
- Đơn hàng tập trung từ nhiều kênh
- Marketing automation đa kênh

**5. Analytics & BI**
- Dashboard phân tích chi tiết cho admin
- Báo cáo doanh thu, lợi nhuận, chi phí
- Phân tích hành vi khách hàng (customer journey)
- Phân tích hiệu quả marketing campaigns
- Dự báo doanh thu bằng machine learning

### 5.3.4 Kết luận phát triển

Hệ thống TechStore hiện tại đã đáp ứng đầy đủ các yêu cầu cơ bản của một website thương mại điện tử bán đồ công nghệ. Với nền tảng kỹ thuật vững chắc (Spring Boot + React + PostgreSQL), hệ thống có khả năng mở rộng linh hoạt theo các hướng phát triển đã đề xuất.

Việc phát triển theo lộ trình từ ngắn hạn đến dài hạn sẽ giúp hệ thống ngày càng hoàn thiện, đáp ứng tốt hơn nhu cầu của khách hàng và hỗ trợ hiệu quả cho hoạt động kinh doanh của cửa hàng.
