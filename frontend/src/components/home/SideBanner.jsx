import { Link } from 'react-router'

function SideBanner({ banner, side = 'left' }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[92px]">
        <Link
          to={banner?.linkUrl || '/products'}
          className="block overflow-hidden rounded-md bg-white shadow-sm"
        >
          {banner?.imageUrl ? (
            <img
              src={banner.imageUrl}
              alt={banner.title || 'TechStore banner'}
              className="h-[590px] w-[150px] object-cover"
            />
          ) : (
            <div
              className={`flex h-[590px] w-[150px] flex-col justify-between p-4 text-white ${
                side === 'left'
                  ? 'bg-gradient-to-b from-sky-400 to-lime-500'
                  : 'bg-gradient-to-b from-lime-400 to-green-600'
              }`}
            >
              <div>
                <p className="text-xs font-bold">TECHSTORE</p>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  LÊN ĐỈNH
                  <br />
                  CÔNG NGHỆ
                </h3>
              </div>

              <div>
                <p className="text-3xl font-black">BUILD PC</p>
                <p className="mt-2 rounded bg-white px-2 py-1 text-center text-sm font-black text-green-600">
                  Giảm tới 500K
                </p>
              </div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}

export default SideBanner