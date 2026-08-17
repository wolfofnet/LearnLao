import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  const swUrl = `${import.meta.env.BASE_URL}sw.js`
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .catch((err) => console.error('SW 注册失败:', err))
  })

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
  })

  window.addEventListener('appinstalled', () => {
    console.log('PWA 已安装')
  })
}
