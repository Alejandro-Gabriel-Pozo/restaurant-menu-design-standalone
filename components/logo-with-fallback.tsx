"use client"

import { useState } from "react"

interface LogoWithFallbackProps {
  src: string
  alt: string
  /** Clases Tailwind para el <img> */
  className?: string
  /** Nodo a mostrar si la imagen falla */
  fallback: React.ReactNode
}

/**
 * Renderiza un <img> y, si la URL está rota o no carga,
 * muestra el fallback visual sin imagen rota del navegador.
 */
export function LogoWithFallback({ src, alt, className, fallback }: LogoWithFallbackProps) {
  const [broken, setBroken] = useState(false)

  if (broken) return <>{fallback}</>

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
