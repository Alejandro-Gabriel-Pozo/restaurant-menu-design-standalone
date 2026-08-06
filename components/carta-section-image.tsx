"use client"

interface Props {
  url:           string
  modo?:         "fondo" | "miniatura" | "ambos"  // default: fondo
  anchoMobile?:  string   // fondo → px del tile | miniatura → % ancho banda (ej: "38")
  anchoDesktop?: string   // fondo → CSS background-size | miniatura → % ancho banda
  posX?:         string   // left | center | right
  posY?:         string   // top | center | bottom
  overlay?:      boolean  // solo aplica en modo fondo / ambos
  opacidad?:     number   // 0-100
}

export function CartaSectionImage({
  url,
  modo         = "fondo",
  anchoMobile  = "160",
  anchoDesktop = "auto 100%",
  posX         = "left",
  posY         = "top",
  overlay      = true,
  opacidad     = 38,
}: Props) {
  const opacity   = opacidad / 100
  const bgPos     = `${posX} ${posY}`
  const showFondo = modo === "fondo" || modo === "ambos"
  const showMini  = modo === "miniatura" || modo === "ambos"

  // Fondo — tile size
  const sizeMobile  = `${anchoMobile}px auto`
  const sizeDesktop = anchoDesktop

  // Overlay difuminado desde el lado izquierdo
  const overlayGradient =
    "radial-gradient(ellipse 55% 100% at 0% 50%, oklch(from var(--background) l c h / 0.85) 0%, oklch(from var(--background) l c h / 0.0) 100%)"

  // Miniatura — interpreta anchoMobile/anchoDesktop como %
  const pctMobile  = isNaN(Number(anchoMobile)) ? anchoMobile : `${anchoMobile}%`
  const pctDesktop = (() => {
    const first = anchoDesktop?.split(" ")[0]
    return isNaN(Number(first)) ? "38%" : `${first}%`
  })()

  // Alineación horizontal de la miniatura
  const miniJustify =
    posX === "right" ? "flex-end" : posX === "center" ? "center" : "flex-start"

  return (
    <>
      {/* ── FONDO desktop ── */}
      {showFondo && (
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
      )}
      {showFondo && overlay && (
        <div
          className="absolute inset-0 hidden sm:block"
          aria-hidden
          style={{ background: overlayGradient }}
        />
      )}

      {/* ── FONDO mobile ── */}
      {showFondo && (
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
      )}
      {showFondo && overlay && (
        <div
          className="absolute inset-0 sm:hidden"
          aria-hidden
          style={{ background: overlayGradient }}
        />
      )}

      {/* ── MINIATURA desktop ── */}
      {showMini && (
        <div
          className="absolute inset-0 hidden sm:flex items-center"
          aria-hidden
          style={{ justifyContent: miniJustify, padding: "0 1rem" }}
        >
          <img
            src={url}
            alt=""
            style={{
              width:     pctDesktop,
              maxHeight: "100%",
              objectFit: "contain",
              opacity,
            }}
          />
        </div>
      )}

      {/* ── MINIATURA mobile ── */}
      {showMini && (
        <div
          className="absolute inset-0 flex items-center sm:hidden"
          aria-hidden
          style={{ justifyContent: miniJustify, padding: "0 0.75rem" }}
        >
          <img
            src={url}
            alt=""
            style={{
              width:     pctMobile,
              maxHeight: "100%",
              objectFit: "contain",
              opacity,
            }}
          />
        </div>
      )}
    </>
  )
}
