"use client"

/**
 * Imagen de cabecera de sección:
 * - Desktop (≥640px): repite horizontalmente, altura = 100% de la banda
 * - Mobile (<640px):  repite en mosaico con tamaño fijo para verse bien a escala chica
 */
export function CartaSectionImage({ url }: { url: string }) {
  return (
    <>
      {/* Desktop: repeat-x, alto proporcional */}
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
      {/* Mobile: mosaico con tile de 120px — se repite en todas direcciones */}
      <div
        className="absolute inset-0 sm:hidden"
        aria-hidden
        style={{
          backgroundImage:    `url(${url})`,
          backgroundRepeat:   "repeat",
          backgroundSize:     "120px auto",
          backgroundPosition: "top left",
          opacity:            0.38,
        }}
      />
    </>
  )
}
