'use client'

import { useState, useEffect } from 'react'

export function useIsMobile() {
  // Render the lightweight version first. During SSR there is no viewport
  // information, and assuming desktop here briefly mounts the WebGL effects on
  // iPhones before this effect can correct it.
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
