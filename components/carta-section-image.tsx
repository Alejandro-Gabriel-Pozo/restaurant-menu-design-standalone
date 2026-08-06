"use client"

interface Props {
  url:          string
  anchoMobile?: string   // px, ej: "160"
  anchoDesktop?: string  // valor CSS completo, ej: "auto 100%"
  posX?:        string   // left | center | right
  posY?:        string   // top | center | bottom
  overlay?:     boolean
  opacidad?:    number   // 0-100
}

export function CartaSectionImage({
  url,
  anchoMobile  = "160",
  anchoDesktop = "auto 100%",
  posX         = "left",
  posY         = "top",
  overlay      = true,
  opacidad     = 38,
}: Props) {
  const bgPos     = `${posX} ${posY}`
  const opacity   = opacidad / 100

  // Mobile: tile cuadrado configurable
  const sizeMobile  = `${anchoMobile}px auto`

  // Desktop: repeat-x + tamaño configurable
  const sizeDesktop = anchoDesktop

  // Overlay: difuminado radial igual al de la portada (neblina desde el lado del texto)
  const overlayStyle = overlay
    ? "radial-gradient(ellipse 55% 100% at 0% 50%, oklch(from var(--background) l c h / 0.85) 0%, oklch(from var(--background) l c h / 0.0) 100%)"
    : undefined

  return (
    <>
      {/* Desktop */}
      <div
        className="absolute inset-0 hidden sm:block"
        aria-hidden
        style={{
          backgroundImage:    `url(${url})`,
          backgroundRepeat:   "repeat-x",
          backgroundSize:     sizeDesktop,
          backgroundPosition: bgPos,
          opacity,
        }}
      />
      {overlay && (
        <div
          className="absolute inset-0 hidden sm:block"
          aria-hidden
          style={{ background: overlayStyle }}
        />
      )}

      {/* Mobile */}
      <div
        className="absolute inset-0 sm:hidden"
        aria-hidden
        style={{
          backgroundImage:    `url(${url})`,
          backgroundRepeat:   "repeat",
          backgroundSize:     sizeMobile,
          backgroundPosition: bgPos,
          opacity,
        }}
      />
      {overlay && (
        <div
          className="absolute inset-0 sm:hidden"
          aria-hidden
          style={{ background: overlayStyle }}
        />
      )}
    </>
  )
}
