function CheckoutForm({ formData, errors, onChange }) {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Thông tin nhận hàng
      </h2>

      <div className="mt-4 grid gap-4">
        <FormField
          label="Họ tên người nhận"
          name="receiverName"
          value={formData.receiverName}
          onChange={onChange}
          error={errors.receiverName}
          placeholder="Nhập họ tên người nhận"
        />

        <FormField
          label="Số điện thoại"
          name="receiverPhone"
          value={formData.receiverPhone}
          onChange={onChange}
          error={errors.receiverPhone}
          placeholder="Nhập số điện thoại"
        />

        <FormField
          label="Địa chỉ giao hàng"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={onChange}
          error={errors.shippingAddress}
          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Ghi chú đơn hàng
          </label>

          <textarea
            name="note"
            value={formData.note}
            onChange={onChange}
            rows="4"
            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
            className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500"
          />
        </div>
      </div>
    </div>
  )
}

function FormField({ label, name, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={
          error
            ? 'w-full rounded border border-red-500 px-4 py-3 text-sm outline-none'
            : 'w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default CheckoutForm