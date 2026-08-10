import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../../data/siteConfig'

export default function GoogleAnalytics() {
  const { pathname } = useLocation()
  const gaId = siteConfig.analytics.gaId

  useEffect(() => {
    if (!gaId) return
    if (!document.getElementById('ga-script')) {
      const s = document.createElement('script')
      s.id = 'ga-script'
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(s)
      window.dataLayer = window.dataLayer || []
      window.gtag = function(){ window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', gaId, { send_page_view: false })
    }
  }, [gaId])

  useEffect(() => {
    if (!gaId || !window.gtag) return
    window.gtag('event', 'page_view', { page_path: pathname })
  }, [pathname, gaId])

  return null
}
