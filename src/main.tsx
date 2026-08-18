import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SplashScreen } from '@capacitor/splash-screen'
import './index.css'
import App from './App.tsx'

// 检测是否在 Capacitor 原生环境中运行
const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;

// React 首次渲染完成后：隐藏原生 Splash + 移除 HTML 加载动画
const hideLoading = () => {
  // 1. 隐藏原生 Splash（让 HTML 加载画面先显示）
  if (isCapacitor) {
    SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
  }
  
  // 2. 等待一帧后移除 HTML 加载动画（确保 React 内容已绘制）
  requestAnimationFrame(() => {
    const el = document.getElementById('app-loading');
    if (el) {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App onReady={hideLoading} />
  </StrictMode>
)

// 仅在浏览器环境注册 Service Worker（Capacitor 中 SW 可能导致问题）
if ('serviceWorker' in navigator && !isCapacitor) {
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
