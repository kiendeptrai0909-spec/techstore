import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'
import { adminEmployeeApi } from '../../api/adminEmployeeApi'

function AdminEmployeeFormPage() {
  const navigate = useNavigate()
  const { employeeId } = useParams()
  const isEdit = Boolean(employeeId)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'ROLE_STAFF',
    status: 'ACTIVE',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return

    const fetchEmployee = async () => {
      setLoading(true)
      setMessage('')

      try {
        const employee = await adminEmployeeApi.getEmployeeById(employeeId)

        setFormData({
          fullName: employee.fullName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          password: '',
          role: employee.role || 'ROLE_STAFF',
          status: employee.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải thông tin nhân viên')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId, isEdit])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Họ tên không được để trống'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email không được để trống'
    }

    if (!isEdit && !formData.password.trim()) {
      nextErrors.password = 'Mật khẩu không được để trống'
    }

    if (formData.password && formData.password.length < 6) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.role) {
      nextErrors.role = 'Vui lòng chọn vai trò'
    }

    if (!formData.status) {
      nextErrors.status = 'Vui lòng chọn trạng thái'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      password: formData.password.trim() || null,
      role: formData.role,
      status: formData.status,
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setMessage('')

    try {
      const payload = buildPayload()

      if (isEdit) {
        await adminEmployeeApi.updateEmployee(employeeId, payload)
      } else {
        await adminEmployeeApi.createEmployee(payload)
      }

      navigate('/admin/employees', {
        state: {
          successMessage: isEdit
            ? 'Cập nhật nhân viên thành công'
            : 'Thêm nhân viên thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu nhân viên')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded bg-white p-6 text-center text-gray-500 shadow-sm">
        Đang tải thông tin nhân viên...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách nhân viên
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Thiết lập thông tin tài khoản nhân viên.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu nhân viên'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Thông tin nhân viên
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField
            label="Họ tên"
            value={formData.fullName}
            onChange={(value) => handleChange('fullName', value)}
            error={errors.fullName}
            placeholder="Nhập họ tên nhân viên"
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            placeholder="email@example.com"
          />

          <FormField
            label={
              isEdit
                ? 'Mật khẩu mới, bỏ trống nếu không đổi'
                : 'Mật khẩu'
            }
            type="password"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            placeholder="Nhập mật khẩu"
          />

          <FormField
            label="Số điện thoại"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            error={errors.phone}
            placeholder="Nhập số điện thoại"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Vai trò
            </label>

            <select
              value={formData.role}
              onChange={(event) => handleChange('role', event.target.value)}
              className={
                errors.role
                  ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
                  : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
              }
            >
              <option value="ROLE_STAFF">Nhân viên</option>
              <option value="ROLE_ADMIN">Quản trị viên</option>
            </select>

            {errors.role && (
              <p className="mt-1 text-sm font-semibold text-red-600">
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Trạng thái
            </label>

            <select
              value={formData.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className={
                errors.status
                  ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
                  : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
              }
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BLOCKED">Đã khóa</option>
            </select>

            {errors.status && (
              <p className="mt-1 text-sm font-semibold text-red-600">
                {errors.status}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && (
        <p className="mt-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default AdminEmployeeFormPage