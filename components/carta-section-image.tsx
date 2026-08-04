"use client"

/**
 * Imagen de cabecera de sección:
 * - Desktop (≥640px): repeat-x, altura = 100% de la banda — quedó bien, no se toca
 * - Mobile (<640px):  mosaico 160px — tile más grande que antes (120px), se repite en todas direcciones
 */
export function CartaSectionImage({ url }: { url: string }) {
  return (
    <>
      {/* Desktop */}
      <div
        className="absolute inset-0 hidden sm:block"
        aria-hidden
        style={{
          backgroundImage:    `url(${url})`,
          backgroundRepeat:   "repeat-x",
          backgroundSize:     "auto 100%",
          backgroundPosition: "top left",
          opacity:            0.38,
        }}
      />
      {/* Mobile: tile 160px (era 120px) */}
      <div
        className="absolute inset-0 sm:hidden"
        aria-hidden
        style={{
          backgroundImage:    `url(${url})`,
          backgroundRepeat:   "repeat",
          backgroundSize:     "160px auto",
          backgroundPosition: "top left",
          opacity:            0.38,
        }}
      />
    </>
  )
}
