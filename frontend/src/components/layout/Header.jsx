import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { productApi } from '../../api/productApi'
import {
  Menu,
  Search,
  Phone,
  MapPin,
  ClipboardList,
  ShoppingCart,
  User,
  LogOut,
  Newspaper,
  CircleHelp,
  MessageSquare,
  UserCircle,
  PackageSearch,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount = 0, clearCartState } = useCart()

  const [keyword, setKeyword] = useState('')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchBoxRef = useRef(null)
  const handleSearch = (event) => {
    event.preventDefault()

    const trimmedKeyword = keyword.trim()
    setSearchOpen(false)

    if (!trimmedKeyword) {
      navigate('/products')
      return
    }

    navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`)
  }
  const handleSelectProduct = (product) => {
    setKeyword('')
    setSearchOpen(false)

    if (product.slug) {
      navigate(`/products/${product.slug}`)
      return
    }

    navigate(`/products/${product.id}`)
  }
  const handleLogout = () => {
    setAccountMenuOpen(false)
    clearCartState?.()
    logout()
    navigate('/login')
  }

  const isAdminOrStaff =
    user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF'
  useEffect(() => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchLoading(true)

        const data = await productApi.getProducts({
          keyword: trimmedKeyword,
          page: 0,
          size: 6,
          status: 'ACTIVE',
        })

        setSearchResults(normalizeList(data))
        setSearchOpen(true)
      } catch (error) {
        console.error('Search products failed:', error)
        setSearchResults([])
        setSearchOpen(true)
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-blue-600 py-2 text-center text-sm font-black text-white md:text-xl">
        MUA PC | TECHSTORE | TẶNG MÀN OLED 240Hz
      </div>

      <div className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-xl font-black text-red-600">
              T
            </div>

            <div className="hidden leading-tight sm:block">
              <div className="text-2xl font-black tracking-tight">
                TECHSTORE
              </div>
              <div className="text-[11px] font-semibold tracking-[0.25em] text-red-100">
                COMPUTER
              </div>
            </div>
          </Link>

          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800 md:flex"
          >
            <Menu size={19} />
            Danh mục
          </Link>

          <div ref={searchBoxRef} className="relative flex-1">
            <form
              onSubmit={handleSearch}
              className="flex h-11 items-center overflow-hidden rounded bg-white"
            >
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => {
                  if (keyword.trim()) {
                    setSearchOpen(true)
                  }
                }}
                type="text"
                placeholder="Bạn cần tìm gì?"
                className="h-full flex-1 px-4 text-sm text-gray-800 outline-none"
              />

              <button
                type="submit"
                className="flex h-full w-12 shrink-0 items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                <Search size={21} />
              </button>
            </form>

            {searchOpen && keyword.trim() && (
              <div className="absolute left-0 top-[calc(100%+4px)] z-[100] w-full overflow-hidden rounded-b bg-white text-gray-900 shadow-xl ring-1 ring-black/10">
                {searchLoading ? (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    Không tìm thấy sản phẩm phù hợp.
                  </div>
                ) : (
                  <div className="max-h-[420px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault()
                          handleSelectProduct(product)
                        }}
                        className="flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-semibold text-gray-900">
                            {product.name}
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-black text-red-600">
                              {formatCurrency(getSalePrice(product))}
                            </span>

                            {getOriginalPrice(product) > getSalePrice(product) && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(getOriginalPrice(product))}
                              </span>
                            )}
                          </div>
                        </div>

                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded border object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex">
            <Phone size={22} />
            <span className="leading-tight">
              Hotline
              <br />
              0909.123.456
            </span>
          </div>

          <div className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex">
            <MapPin size={22} />
            <span className="leading-tight">
              Hệ thống
              <br />
              Showroom
            </span>
          </div>

          <Link
            to="/account/orders"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex"
          >
            <ClipboardList size={22} />
            <span className="leading-tight">
              Tra cứu
              <br />
              đơn hàng
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative flex shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
          >
            <ShoppingCart size={22} />
            <span className="hidden sm:inline">
              Giỏ
              <br />
              hàng
            </span>

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-300 px-1 text-xs font-black text-red-600">
              {cartCount}
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="relative flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex max-w-[170px] items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
                title={user?.fullName || user?.email || 'Tài khoản'}
              >
                <UserCircle size={22} />

                <span className="hidden max-w-[100px] truncate md:inline">
                  {user?.fullName || 'Tài khoản'}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    accountMenuOpen
                      ? 'rotate-180 transition'
                      : 'transition'
                  }
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-md bg-white text-gray-800 shadow-lg ring-1 ring-black/5">
                  <div className="border-b px-4 py-3">
                    <div className="line-clamp-1 font-black text-gray-900">
                      {user?.fullName || 'Tài khoản'}
                    </div>

                    <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>

                  <Link
                    to="/account/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-red-50 hover:text-red-600"
                  >
                    <UserCircle size={18} />
                    Tài khoản của tôi
                  </Link>

                  <Link
                    to="/account/orders"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-red-50 hover:text-red-600"
                  >
                    <PackageSearch size={18} />
                    Đơn hàng của tôi
                  </Link>

                  {isAdminOrStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-red-50 hover:text-red-600"
                    >
                      <LayoutDashboard size={18} />
                      Trang quản trị
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
            >
              <User size={22} />
              <span>
                Đăng
                <br />
                nhập
              </span>
            </Link>
          )}
        </div>
      </div>

     <div className="border-b bg-white">
  <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-sm font-semibold text-gray-800">
    <Link to="/news" className="flex items-center gap-2 hover:text-red-600">
      <Newspaper size={17} />
      Tin tức
    </Link>

    <span className="mx-60 text-gray-300">|</span>

    <Link to="/faqs" className="flex items-center gap-2 hover:text-red-600">
      <CircleHelp size={17} />
      FAQ
    </Link>

    <span className="mx-60 text-gray-300">|</span>

    <Link to="/contact" className="flex items-center gap-2 hover:text-red-600">
      <MessageSquare size={17} />
      Liên hệ
    </Link>
  </div>
</div>
    </header>
  )
}
function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  return []
}

function getFirstVariant(product) {
  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants[0]
  }

  return null
}

function getProductImage(product) {
  const firstVariant = getFirstVariant(product)

  return (
    product?.thumbnailUrl ||
    product?.imageUrl ||
    firstVariant?.thumbnailUrl ||
    product?.images?.[0]?.imageUrl ||
    'https://placehold.co/80x80?text=TechStore'
  )
}

function getOriginalPrice(product) {
  const firstVariant = getFirstVariant(product)

  return Number(
    firstVariant?.price ||
    product?.price ||
    product?.minPrice ||
    0
  )
}

function getSalePrice(product) {
  const firstVariant = getFirstVariant(product)

  return Number(
    firstVariant?.salePrice ||
    product?.salePrice ||
    product?.minSalePrice ||
    firstVariant?.price ||
    product?.price ||
    product?.minPrice ||
    0
  )
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + 'đ'
}
export default Header