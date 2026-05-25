export const bankTransferConfig = {
  // MB Bank
  bankCode: '970422',

  bankName: 'MB Bank',

  // Điền đúng số tài khoản MB bạn vừa kết nối trên SePay
  accountNumber: '0916512785',

  // Điền đúng tên chủ tài khoản, nên viết không dấu
  accountName: 'LE TRUNG KIEN',

  transferPrefix: 'TECHSTORE',
}

export function buildVietQrUrl({ amount = 0, note = '' } = {}) {
  const safeAmount = Math.max(0, Math.round(Number(amount || 0)))
  const safeNote = normalizeTransferNote(
    note || bankTransferConfig.transferPrefix
  )

  const params = new URLSearchParams({
    amount: String(safeAmount),
    addInfo: safeNote,
    accountName: bankTransferConfig.accountName,
  })

  return `https://img.vietqr.io/image/${bankTransferConfig.bankCode}-${bankTransferConfig.accountNumber}-compact2.png?${params.toString()}`
}

export function buildTransferNote(value) {
  const rawValue = value ? String(value).trim() : ''

  const note = rawValue
    ? `${bankTransferConfig.transferPrefix} ${rawValue}`
    : bankTransferConfig.transferPrefix

  return normalizeTransferNote(note)
}

export function normalizeTransferNote(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatBankAmount(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' đ'
}