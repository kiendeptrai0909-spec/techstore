function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={
          error
            ? 'w-full rounded border border-red-500 px-4 py-3 text-sm outline-none focus:border-red-600'
            : 'w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default FormInput