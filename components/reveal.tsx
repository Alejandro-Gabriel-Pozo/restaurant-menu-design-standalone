"use client"

import { useEffect, useRef, useState } from "react"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Anima la entrada del contenido cuando entra al viewport.
 * Respeta prefers-reduced-motion: si está activo, muestra el contenido sin animación.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref     = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: React.CSSProperties = reduced
    ? {}
    : {
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        willChange: "opacity, transform",
      }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
