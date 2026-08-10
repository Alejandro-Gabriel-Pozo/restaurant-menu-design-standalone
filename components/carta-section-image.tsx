"use client"

interface Props {
  url:            string
  modo?:          "fondo" | "miniatura" | "ambos"
  // anchoMobile: ya no se usa para el fondo (cover/no-repeat). Se mantiene como prop
  // para miniatura (% del alto de la banda). Ignorado si modo="fondo".
  anchoMobile?:   string   // miniatura → % del alto de la banda
  anchoDesktop?:  string   // fondo → CSS background-size | miniatura → % del alto de la banda
  posX?:          string   // left | center | right
  posY?:          string   // top | center | bottom
  overlay?:       boolean
  opacidad?:      number   // 0-100
  bandaAltoMobile?:  string  // px de alto de la banda mobile (para miniatura)
  bandaAltoDesktop?: string  // px de alto de la banda desktop (para miniatura)
}

export function CartaSectionImage({
  url,
  modo            = "fondo",
  anchoMobile     = "80",
  anchoDesktop    = "auto 100%",
  posX            = "left",
  posY            = "top",
  overlay         = true,
  opacidad        = 38,
  bandaAltoMobile  = "90",
  bandaAltoDesktop = "120",
}: Props) {
  const opacity   = opacidad / 100
  const bgPos     = `${posX} ${posY}`
  const showFondo = modo === "fondo" || modo === "ambos"
  const showMini  = modo === "miniatura" || modo === "ambos"

  const sizeDesktop = anchoDesktop

  const overlayGradient =
    "radial-gradient(ellipse 55% 100% at 0% 50%, oklch(from var(--background) l c h / 0.85) 0%, oklch(from var(--background) l c h / 0.0) 100%)"

  // Miniatura — calcular px reales a partir del % y la altura de la banda
  const calcHeightPx = (pctStr: string, bandaStr: string): string => {
    const pct   = Number(pctStr)
    const banda = Number(bandaStr.replace("px", ""))
    if (!isNaN(pct) && !isNaN(banda) && banda > 0) {
      return `${Math.round(banda * pct / 100)}px`
    }
    return `${pctStr}`
  }

  const heightMobile  = calcHeightPx(anchoMobile, bandaAltoMobile)
  const heightDesktop = calcHeightPx(
    anchoDesktop?.split(" ")[0] ?? "80",
    bandaAltoDesktop
  )

  const miniLeft  = posX === "right" ? "auto" : posX === "center" ? "50%"  : "1rem"
  const miniRight = posX === "right" ? "1rem" : "auto"
  const miniTX    = posX === "center" ? "translateX(-50%)" : ""

  const miniTop    = posY === "bottom" ? "auto" : posY === "center" ? "50%"  : "0"
  const miniBottom = posY === "bottom" ? "0"    : "auto"
  const miniTY     = posY === "center" ? "translateY(-50%)" : ""

  const miniTransform = [miniTX, miniTY].filter(Boolean).join(" ") || "none"

  const miniStyle = (height: string): React.CSSProperties => ({
    position:  "absolute",
    top:       miniTop,
    bottom:    miniBottom,
    left:      miniLeft,
    right:     miniRight,
    transform: miniTransform,
    height,
    width:     "auto",
    maxWidth:  "none",
    display:   "block",
    opacity,
  })

  return (
    <>
      {/* ── FONDO desktop — repeat-x, background-size desde config ── */}
      {showFondo && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden
          style={{ backgroundImage: `url(${url})`, backgroundRepeat: "repeat-x", backgroundSize: sizeDesktop, backgroundPosition: bgPos, opacity }} />
      )}
      {showFondo && overlay && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden style={{ background: overlayGradient }} />
      )}

      {/* ── FONDO mobile — cover / no-repeat: imagen siempre completa, sin tiles ── */}
      {showFondo && (
        <div className="absolute inset-0 sm:hidden" aria-hidden
          style={{ backgroundImage: `url(${url})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", opacity }} />
      )}
      {showFondo && overlay && (
        <div className="absolute inset-0 sm:hidden" aria-hidden style={{ background: overlayGradient }} />
      )}

      {/* ── MINIATURA desktop ── */}
      {showMini && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden style={{ overflow: "hidden" }}>
          <img src={url} alt="" style={miniStyle(heightDesktop)} />
        </div>
      )}

      {/* ── MINIATURA mobile ── */}
      {showMini && (
        <div className="absolute inset-0 block sm:hidden" aria-hidden style={{ overflow: "hidden" }}>
          <img src={url} alt="" style={miniStyle(heightMobile)} />
        </div>
      )}
    </>
  )
}
