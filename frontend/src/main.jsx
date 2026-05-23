import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import ScrollToTop from './components/common/ScrollToTop'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import ChatWidget from './components/chat/ChatWidget'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <App />
          <ChatWidget />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)