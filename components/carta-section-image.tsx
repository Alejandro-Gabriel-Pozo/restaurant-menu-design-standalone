"use client"

interface Props {
  url:           string
  modo?:         "fondo" | "miniatura" | "ambos"
  anchoMobile?:  string   // fondo → px del tile | miniatura → % del alto de la banda
  anchoDesktop?: string   // fondo → CSS background-size | miniatura → % del alto de la banda
  posX?:         string   // left | center | right
  posY?:         string   // top | center | bottom
  overlay?:      boolean
  opacidad?:     number   // 0-100
}

export function CartaSectionImage({
  url,
  modo         = "fondo",
  anchoMobile  = "80",
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

  const sizeMobile  = `${anchoMobile}px auto`
  const sizeDesktop = anchoDesktop

  const overlayGradient =
    "radial-gradient(ellipse 55% 100% at 0% 50%, oklch(from var(--background) l c h / 0.85) 0%, oklch(from var(--background) l c h / 0.0) 100%)"

  // Miniatura — % del alto de la banda
  const heightMobile  = isNaN(Number(anchoMobile))  ? anchoMobile  : `${anchoMobile}%`
  const heightDesktop = (() => {
    const first = anchoDesktop?.split(" ")[0]
    return isNaN(Number(first)) ? "80%" : `${first}%`
  })()

  // pos_x → left/right/center con transform
  const miniLeft =
    posX === "right"  ? "auto" :
    posX === "center" ? "50%"  : "1rem"
  const miniRight =
    posX === "right"  ? "1rem" : "auto"
  const miniTransformX =
    posX === "center" ? "translateX(-50%)" : "none"

  // pos_y → top/bottom/center con transform
  const miniTop =
    posY === "bottom" ? "auto"  :
    posY === "center" ? "50%"   : "0"
  const miniBottom =
    posY === "bottom" ? "0"     : "auto"
  const miniTransformY =
    posY === "center" ? "translateY(-50%)" : "none"

  const miniTransform = [miniTransformX, miniTransformY]
    .filter(v => v !== "none").join(" ") || "none"

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
      {/* ── FONDO desktop ── */}
      {showFondo && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden
          style={{ backgroundImage: `url(${url})`, backgroundRepeat: "repeat-x", backgroundSize: sizeDesktop, backgroundPosition: bgPos, opacity }} />
      )}
      {showFondo && overlay && (
        <div className="absolute inset-0 hidden sm:block" aria-hidden style={{ background: overlayGradient }} />
      )}

      {/* ── FONDO mobile ── */}
      {showFondo && (
        <div className="absolute inset-0 sm:hidden" aria-hidden
          style={{ backgroundImage: `url(${url})`, backgroundRepeat: "repeat", backgroundSize: sizeMobile, backgroundPosition: bgPos, opacity }} />
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
