"use client"

interface Props {
  url:            string
  modo?:          "fondo" | "miniatura" | "ambos"
  anchoMobile?:   string
  anchoDesktop?:  string
  posX?:          string
  posY?:          string
  overlay?:       boolean
  opacidad?:      number
  bandaAltoMobile?:  string
  bandaAltoDesktop?: string
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
      {/* ── FONDO desktop — comportamiento original intacto ── */}
      {showFondo && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden
          style={{
            backgroundImage: `url(${url})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: sizeDesktop,
            backgroundPosition: bgPos,
            opacity,
          }} />
      )}
      {showFondo && overlay && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden
          style={{ background: overlayGradient }} />
      )}

      {/* ── FONDO mobile — contain+repeat-x: imagen completa, sin recorte, tila ── */}
      {showFondo && (
        <div className="absolute inset-0 sm:hidden" aria-hidden
          style={{
            backgroundImage: `url(${url})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "contain",
            backgroundPosition: bgPos,
            opacity,
          }} />
      )}
      {showFondo && overlay && (
        <div className="absolute inset-0 sm:hidden" aria-hidden
          style={{ background: overlayGradient }} />
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
