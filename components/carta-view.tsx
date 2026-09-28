import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { normFuente, formatPrecio } from "@/lib/format-utils"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaControls }     from "@/components/carta-controls"
import { CartaSectionImage } from "@/components/carta-section-image"
import { LogoWithFallback }  from "@/components/logo-with-fallback"

interface Props {
  menu:   MenuCategory[]
  config: SiteConfig
}

export function CartaView({ menu, config }: Props) {
  // ─── CÁLCULOS DE CONFIG ──────────────────────────────────────────────────
  const acento      = config.hero_color_fondo || ""
  const nombre      = config.restaurante_nombre ?? ""
  const subtitulo   = config.restaurante_subtitulo ?? ""
  const descripcion = config.restaurante_descripcion ?? ""
  const logoUrl     = config.restaurante_logo_url ?? ""
  const bgUrl       = config.hero_imagen_fondo_url ?? ""
  const bgSolido: React.CSSProperties = !bgUrl && acento ? { backgroundColor: acento } : {}

  const bloqueTop = `${config.carta_pos_bloque || "50"}%`
  const ctaBottom = `${config.carta_pos_cta   || "18"}%`

  const bandaAltoMobile  = config.carta_banda_alto_mobile
    ? (isNaN(Number(config.carta_banda_alto_mobile))
        ? config.carta_banda_alto_mobile
        : `${config.carta_banda_alto_mobile}px`)
    : "90px"
  const bandaAltoDesktop = config.carta_banda_alto_desktop || "clamp(80px, 18vh, 140px)"

  const bandaAltoMobilePx  = config.carta_banda_alto_mobile  || "90"
  const bandaAltoDesktopPx = config.carta_banda_alto_desktop || "120"

  const imgModo         = (config.carta_imagen_modo || "fondo") as "fondo" | "miniatura" | "ambos"
  const imgAnchoMobile  = config.carta_imagen_ancho_mobile  || "160"
  const imgAnchoDesktop = config.carta_imagen_ancho_desktop || "auto 100%"
  const imgPosX         = config.carta_imagen_pos_x         || "left"
  const imgPosY         = config.carta_imagen_pos_y         || "top"
  const imgOverlay      = (config.carta_imagen_overlay || "si") !== "no"
  const imgOpacidad     = Number(config.carta_imagen_opacidad) || 38

  // Fuentes — banda
  const fBandaEtiqueta   = normFuente(config.carta_fuente_banda_etiqueta)
  const fBandaTitulo     = normFuente(config.carta_fuente_banda_titulo)
  const fBandaDesc       = normFuente(config.carta_fuente_banda_descripcion)

  // Fuentes — items
  const fItemNombre      = normFuente(config.carta_fuente_item_nombre)
  const fItemPrecio      = normFuente(config.carta_fuente_item_precio)
  const fItemDesc        = normFuente(config.carta_fuente_item_descripcion)
  const fItemTags        = normFuente(config.carta_fuente_item_tags)

  // Fuentes — portada
  const fPortadaEtiqueta  = normFuente(config.carta_fuente_portada_etiqueta)
  const fPortadaNombre    = normFuente(config.carta_fuente_portada_nombre)
  const fPortadaSubtitulo = normFuente(config.carta_fuente_portada_subtitulo)
  const fPortadaDesc      = normFuente(config.carta_fuente_portada_descripcion)
  const fPortadaCta       = normFuente(config.carta_fuente_portada_cta)

  // Fuentes — índice
  const fIndiceEtiqueta  = normFuente(config.carta_fuente_indice_etiqueta)
  const fIndiceTitulo    = normFuente(config.carta_fuente_indice_titulo)
  const fIndiceNumero    = normFuente(config.carta_fuente_indice_numero)
  const fIndiceItem      = normFuente(config.carta_fuente_indice_item)

  // Textos editables
  const txtPortadaCta       = config.carta_texto_portada_cta
  const txtPortadaSeparador = config.carta_texto_portada_separador
  const txtIndiceEtiqueta   = config.carta_texto_indice_etiqueta
  const txtIndiceTitulo     = config.carta_texto_indice_titulo

  // Colores — índice
  const indiceNumColor      = config.color_indice_numeros || null
  const indiceTituloColor   = config.color_indice_titulos || null
  const indiceTituloH1Color = config.color_indice_titulo  || null

  // Colores — banda de sección
  const bandaEtiquetaColor = config.color_banda_etiqueta    || null
  const bandaTituloColor   = config.color_banda_titulo      || null
  const bandaDescColor     = config.color_banda_descripcion || null

  // Colores — items regulares
  const itemNombreColor  = config.color_item_nombre      || null
  const itemPrecioColor  = config.color_item_precio      || null
  const itemDescColor    = config.color_item_descripcion || null
  const itemTagsColor    = config.color_item_tags        || null

  // Colores — items especiales (fallback implícito: var(--primary) = color_marca)
  const espNombreColor = config.color_especial_item_nombre      || null
  const espPrecioColor = config.color_especial_item_precio      || null
  const espDescColor   = config.color_especial_item_descripcion || null
  const espTagsColor   = config.color_especial_item_tags        || null

  const logoFallback = nombre ? (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento || "currentColor" }}
    >
      {nombre.charAt(0)}
    </div>
  ) : null

  // ─── OVERLAY + TEXTURA ──────────────────────────────────────────────────
  const overlayYTextura = (
    <>
      {bgUrl && (
        <div className="absolute inset-0 z-[1]" style={acento ? { backgroundColor: `${acento}BF` } : {}} aria-hidden />
      )}
      <div className="absolute inset-0 z-[1] opacity-[0.06]" aria-hidden
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
    </>
  )

  // ─── PORTADA DESKTOP ────────────────────────────────────────────────────
  const portadaDesktop = (
    <div className="absolute z-10 hidden flex-col items-center gap-5 px-8 text-center sm:flex"
      style={{ top: bloqueTop, left: "50%", transform: "translate(-50%, -50%)", width: "min(100%, 32rem)" }}>
      {logoUrl
        ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
        : logoFallback}
      {config.hero_etiqueta_superior && (
        <p className="font-sans font-light uppercase tracking-[0.5em]"
          style={{ fontSize: fPortadaEtiqueta, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.7)" }}>
          {config.hero_etiqueta_superior}
        </p>
      )}
      {nombre && (
        <h1 className="font-serif font-medium leading-tight text-balance"
          style={{ fontSize: fPortadaNombre, color: "var(--portada-textos, var(--hero-ink))" }}>
          {nombre}
        </h1>
      )}
      {subtitulo && (
        <p className="font-sans font-light uppercase tracking-[0.3em]"
          style={{ fontSize: fPortadaSubtitulo, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.6)" }}>
          {subtitulo}
        </p>
      )}
      {descripcion && (
        <p className="max-w-xs text-pretty leading-relaxed"
          style={{ fontSize: fPortadaDesc, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.75)" }}>
          {descripcion}
        </p>
      )}
      {txtPortadaSeparador && (
        <div className="flex items-center gap-4">
          <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.3)" }} />
          <span style={{ fontSize: "9px", color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.4)" }}>{txtPortadaSeparador}</span>
          <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.3)" }} />
        </div>
      )}
      {txtPortadaCta && (
        <p className="font-sans font-light uppercase tracking-[0.4em]"
          style={{ fontSize: fPortadaCta, color: "oklch(from var(--portada-cta, var(--hero-ink)) l c h / 0.5)" }}>
          {txtPortadaCta}
        </p>
      )}
    </div>
  )

  // ─── PORTADA MOBILE ─────────────────────────────────────────────────────
  const portadaMobile = (
    <>
      <div aria-hidden className="absolute z-[8]"
        style={{
          top: bloqueTop, left: "50%",
          transform: "translate(-50%, -50%)",
          width: "110vw", height: "55vh",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.08 0.01 40 / 0.55) 0%, oklch(0.08 0.01 40 / 0.0) 100%)",
          filter: "blur(18px)", pointerEvents: "none",
        }}
      />
      <div className="absolute z-10 flex flex-col items-center sm:hidden"
        style={{ top: bloqueTop, left: "50%", transform: "translate(-50%, -50%)", width: "50vw" }}
      >
        {logoUrl && (
          <LogoWithFallback src={logoUrl} alt={nombre} className="mb-3 h-10 w-10 object-contain"
            fallback={
              nombre ? (
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento || "currentColor" }}>
                  {nombre.charAt(0)}
                </div>
              ) : null
            }
          />
        )}
        {config.hero_etiqueta_superior && (
          <p className="text-center font-sans font-light uppercase tracking-[0.45em]"
            style={{ fontSize: fPortadaEtiqueta, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.6)" }}>
            {config.hero_etiqueta_superior}
          </p>
        )}
        {nombre && (
          <h1 className="text-center font-serif font-medium leading-tight"
            style={{ fontSize: fPortadaNombre, color: "var(--portada-textos, var(--hero-ink))" }}>
            {nombre}
          </h1>
        )}
        {subtitulo && (
          <p className="mt-0.5 text-center font-sans font-light uppercase tracking-[0.22em]"
            style={{ fontSize: fPortadaSubtitulo, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.55)" }}>
            {subtitulo}
          </p>
        )}
        {descripcion && (
          <p className="mt-1 text-center font-sans font-light leading-snug"
            style={{ fontSize: fPortadaDesc, color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.7)" }}>
            {descripcion}
          </p>
        )}
        {txtPortadaSeparador && (
          <div className="mt-3 flex items-center gap-2">
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.18)" }} />
            <span style={{ fontSize: "7px", color: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.25)" }}>{txtPortadaSeparador}</span>
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--portada-textos, var(--hero-ink)) l c h / 0.18)" }} />
          </div>
        )}
      </div>
      {txtPortadaCta && (
        <div className="absolute z-10 flex flex-col items-center sm:hidden"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: ctaBottom }}
        >
          <p className="whitespace-nowrap text-center font-sans font-light uppercase tracking-[0.35em]"
            style={{ fontSize: fPortadaCta, color: "oklch(from var(--portada-cta, var(--hero-ink)) l c h / 0.45)" }}>
            {txtPortadaCta}
          </p>
        </div>
      )}
    </>
  )

  // ─── BANDA DE SECCIÓN (helper) ──────────────────────────────────────────────
  //
  // Layout: flex-col justify-end con overflow-hidden.
  // Prioridad de corte cuando la banda es baja:
  //   1. descripción desaparece primero (line-clamp-1, luego overflow hidden)
  //   2. etiqueta desaparece si no cabe (shrink-0 en título, etiqueta sin shrink-0)
  //   3. título siempre visible (shrink-0, line-clamp-1)
  //
  function BandaContenido({
    titulo, desc, catIdx, totalCats, mobile,
  }: {
    titulo: string; desc?: string
    catIdx: number; totalCats: number; mobile: boolean
  }) {
    const px   = mobile ? "px-4" : "px-10"
    const pb   = mobile ? "pb-2" : "pb-3"
    const pt   = mobile ? "pt-2" : "pt-8"
    return (
      <div
        className={`absolute inset-0 flex flex-col justify-end overflow-hidden ${px} ${pb} ${pt}`}
        style={{ zIndex: 10 }}
      >
        {/* etiqueta: sin shrink-0 → se comprime/oculta si no hay espacio */}
        <p
          className="overflow-hidden font-sans font-light uppercase tracking-[0.4em] text-primary"
          style={{
            fontSize: fBandaEtiqueta,
            lineHeight: 1.3,
            maxHeight: `calc(${fBandaEtiqueta} * 1.3 * 1)`, // máximo 1 línea
            ...(bandaEtiquetaColor ? { color: bandaEtiquetaColor } : {}),
          }}
        >
          {String(catIdx + 1).padStart(2, "0")} / {String(totalCats).padStart(2, "0")}
        </p>

        {/* título: shrink-0, siempre visible */}
        <h2
          className="shrink-0 overflow-hidden font-serif font-medium leading-tight tracking-tight text-foreground"
          style={{
            fontSize: fBandaTitulo,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            ...(bandaTituloColor ? { color: bandaTituloColor } : {}),
          }}
        >
          {titulo}
        </h2>

        {/* descripción: se oculta primero */}
        {desc && (
          <p
            className="overflow-hidden font-sans font-light leading-snug text-muted-foreground"
            style={{
              fontSize: fBandaDesc,
              lineHeight: 1.35,
              maxHeight: `calc(${fBandaDesc} * 1.35 * 1)`,
              ...(bandaDescColor ? { color: bandaDescColor } : {}),
            }}
          >
            {desc}
          </p>
        )}
      </div>
    )
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <CartaControls menu={menu} config={config}>

      {/* PORTADA */}
      <div data-page="portada" className="carta-page relative isolate overflow-hidden" style={bgSolido}>
        {bgUrl && (
          <img src={bgUrl} alt="" aria-hidden loading="eager"
            className="absolute inset-0 z-0 h-full w-full object-cover" />
        )}
        {overlayYTextura}
        {portadaDesktop}
        {portadaMobile}
      </div>

      {/* ÍNDICE */}
      <div data-page="indice-0" className="carta-page bg-background">
        <div className="flex h-full flex-col px-6 sm:px-10"
          style={{ paddingTop: "52px", paddingBottom: "calc(var(--carta-nav-h, 56px) + 16px)" }}
        >
          <div className="mb-4 shrink-0">
            {txtIndiceEtiqueta && (
              <p className="mb-0.5 font-sans font-light uppercase tracking-[0.5em] text-primary"
                style={{ fontSize: fIndiceEtiqueta }}>
                {txtIndiceEtiqueta}
              </p>
            )}
            {txtIndiceTitulo && (
              <h1 className="font-serif font-medium text-foreground"
                style={{
                  fontSize: fIndiceTitulo,
                  ...(indiceTituloH1Color ? { color: indiceTituloH1Color } : {}),
                }}>
                {txtIndiceTitulo}
              </h1>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
          <ol className="grid grid-cols-1 content-start gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((cat, i) => (
              <li key={cat.id}>
                <button data-goto={cat.id}
                  className="group flex w-full items-baseline gap-3 border-b border-dotted border-border/60 px-1 py-3 text-left transition-colors hover:bg-primary/5 active:bg-primary/10">
                  <span
                    className="w-7 shrink-0 font-sans font-light tabular-nums text-primary"
                    style={{
                      fontSize: fIndiceNumero,
                      ...(indiceNumColor ? { color: indiceNumColor } : {}),
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className="block font-serif font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
                      style={{
                        fontSize: fIndiceItem,
                        ...(indiceTituloColor ? { color: indiceTituloColor } : {}),
                      }}
                    >
                      {cat.titulo_seccion}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>

      {/* PÁGINAS DE CATEGORÍAS */}
      {menu.map((category, catIdx) => (
        <div key={category.id} data-page={category.id} className="carta-page relative bg-background">
          <div className="flex h-full flex-col overflow-y-auto"
            style={{ paddingBottom: "calc(var(--carta-nav-h, 56px) + 16px)" }}
          >

            {/* BANDA */}
            <div className="section-header-band relative shrink-0 overflow-hidden" style={{ height: bandaAltoMobile }}>
              <style>{`
                @media (min-width: 640px) {
                  .section-header-band { height: ${bandaAltoDesktop} !important; }
                }
              `}</style>

              {category.imagen_url && (
                <CartaSectionImage
                  url={category.imagen_url}
                  modo={imgModo}
                  anchoMobile={imgAnchoMobile}
                  anchoDesktop={imgAnchoDesktop}
                  posX={imgPosX}
                  posY={imgPosY}
                  overlay={imgOverlay}
                  opacidad={imgOpacidad}
                  bandaAltoMobile={bandaAltoMobilePx}
                  bandaAltoDesktop={bandaAltoDesktopPx}
                />
              )}

              {/* DESKTOP */}
              <div className="hidden sm:block">
                <BandaContenido
                  titulo={category.titulo_seccion}
                  desc={category.description}
                  catIdx={catIdx}
                  totalCats={menu.length}
                  mobile={false}
                />
              </div>

              {/* MOBILE */}
              <div className="sm:hidden">
                <BandaContenido
                  titulo={category.titulo_seccion}
                  desc={category.description}
                  catIdx={catIdx}
                  totalCats={menu.length}
                  mobile={true}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
            </div>

            {/* ITEMS */}
            <ul className="divide-y divide-dotted divide-border/40 px-6 sm:px-10">
              {category.items.map((item) => {
                const esp = item.especial

                const nombreColor = esp
                  ? (espNombreColor ?? "var(--primary)")
                  : (itemNombreColor ?? undefined)

                const precioColor = esp
                  ? (espPrecioColor ?? "var(--primary)")
                  : (itemPrecioColor ?? undefined)

                const descColor = esp
                  ? (espDescColor ?? undefined)
                  : (itemDescColor ?? undefined)

                const tagsColor = esp
                  ? (espTagsColor ?? "var(--primary)")
                  : (itemTagsColor ?? undefined)

                return (
                  <li key={item.name} className="py-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className={`min-w-0 flex-1 font-serif font-semibold leading-tight ${
                          !nombreColor ? "text-foreground" : ""
                        }`}
                        style={{
                          fontSize: fItemNombre,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          ...(nombreColor ? { color: nombreColor } : {}),
                        }}
                      >
                        {item.name}
                        {esp && (
                          <span
                            className="ml-1 text-[8px]"
                            style={{ color: espNombreColor ?? "var(--primary)" }}
                            aria-label="Especial"
                          >
                            {" ★"}
                          </span>
                        )}
                      </h3>
                      <span
                        className={`shrink-0 font-serif font-semibold ${!precioColor ? "text-primary" : ""}`}
                        style={{ fontSize: fItemPrecio, ...(precioColor ? { color: precioColor } : {}) }}
                      >
                        {formatPrecio(item.price, config)}
                      </span>
                    </div>
                    {item.description && (
                      <p
                        className={`mt-0.5 font-sans font-light leading-snug ${!descColor ? "text-muted-foreground/75" : ""}`}
                        style={{ fontSize: fItemDesc, ...(descColor ? { color: descColor } : {}) }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-0.5 font-sans font-light uppercase tracking-wider ${!tagsColor ? "text-primary/50" : ""}`}
                            style={{ fontSize: fItemTags, ...(tagsColor ? { color: tagsColor } : {}) }}
                          >
                            <TagIcon tag={tag} />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ))}
    </CartaControls>
  )
}
