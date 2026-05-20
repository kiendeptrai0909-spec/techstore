import { Outlet } from 'react-router'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout