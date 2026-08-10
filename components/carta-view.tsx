import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { normFuente, formatPrecio } from "@/lib/get-config"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaControls }     from "@/components/carta-controls"
import { CartaSectionImage } from "@/components/carta-section-image"
import { LogoWithFallback }  from "@/components/logo-with-fallback"

interface Props {
  menu:   MenuCategory[]
  config: SiteConfig
}

export function CartaView({ menu, config }: Props) {
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

  const imgModo         = (config.carta_imagen_modo || "fondo") as "fondo" | "miniatura" | "ambos"
  const imgAnchoMobile  = config.carta_imagen_ancho_mobile  || "160"
  const imgAnchoDesktop = config.carta_imagen_ancho_desktop || "auto 100%"
  const imgPosX         = config.carta_imagen_pos_x         || "left"
  const imgPosY         = config.carta_imagen_pos_y         || "top"
  const imgOverlay      = (config.carta_imagen_overlay || "si") !== "no"
  const imgOpacidad     = Number(config.carta_imagen_opacidad) || 38
  const bandaAltoMobilePx  = config.carta_banda_alto_mobile  || "90"
  const bandaAltoDesktopPx = config.carta_banda_alto_desktop || "120"

  // Fuentes banda
  const fBandaEtiqueta   = normFuente(config.carta_fuente_banda_etiqueta)
  const fBandaTitulo     = normFuente(config.carta_fuente_banda_titulo)
  const fBandaDesc       = normFuente(config.carta_fuente_banda_descripcion)

  // Fuentes items
  const fItemNombre      = normFuente(config.carta_fuente_item_nombre)
  const fItemPrecio      = normFuente(config.carta_fuente_item_precio)
  const fItemDesc        = normFuente(config.carta_fuente_item_descripcion)
  const fItemTags        = normFuente(config.carta_fuente_item_tags)

  // Fuentes portada
  const fPortadaEtiqueta  = normFuente(config.carta_fuente_portada_etiqueta)
  const fPortadaNombre    = normFuente(config.carta_fuente_portada_nombre)
  const fPortadaSubtitulo = normFuente(config.carta_fuente_portada_subtitulo)
  const fPortadaDesc      = normFuente(config.carta_fuente_portada_descripcion)
  const fPortadaCta       = normFuente(config.carta_fuente_portada_cta)

  // Fuentes índice
  const fIndiceEtiqueta  = normFuente(config.carta_fuente_indice_etiqueta)
  const fIndiceTitulo    = normFuente(config.carta_fuente_indice_titulo)
  const fIndiceNumero    = normFuente(config.carta_fuente_indice_numero)
  const fIndiceCategoria = normFuente(config.carta_fuente_indice_categoria)
  const fIndiceItem      = normFuente(config.carta_fuente_indice_item)

  // Textos editables
  const txtPortadaCta       = config.carta_texto_portada_cta
  const txtPortadaSeparador = config.carta_texto_portada_separador
  const txtIndiceEtiqueta   = config.carta_texto_indice_etiqueta
  const txtIndiceTitulo     = config.carta_texto_indice_titulo

  const logoFallback = nombre ? (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento || "currentColor" }}
    >
      {nombre.charAt(0)}
    </div>
  ) : null

  return (
    <CartaControls menu={menu} config={config}>

      {/* PORTADA */}
      <div data-page="portada" className="carta-page relative isolate overflow-hidden" style={bgSolido}>
        {bgUrl && (
          <img src={bgUrl} alt="" aria-hidden loading="eager"
            className="absolute inset-0 z-0 h-full w-full object-cover" />
        )}
        {bgUrl && (
          <div className="absolute inset-0 z-[1]" style={acento ? { backgroundColor: `${acento}BF` } : {}} aria-hidden />
        )}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" aria-hidden
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        {/* DESKTOP */}
        <div className="relative z-10 hidden h-full flex-col items-center justify-center gap-5 px-8 text-center sm:flex">
          {logoUrl
            ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
            : logoFallback}
          {config.hero_etiqueta_superior && (
            <p className="font-sans font-light uppercase tracking-[0.5em]"
              style={{ fontSize: fPortadaEtiqueta, color: "oklch(from var(--hero-ink) l c h / 0.7)" }}>
              {config.hero_etiqueta_superior}
            </p>
          )}
          {nombre && (
            <h1 className="font-serif font-medium leading-tight text-balance"
              style={{ fontSize: fPortadaNombre, color: "var(--hero-ink)" }}>
              {nombre}
            </h1>
          )}
          {subtitulo && (
            <p className="font-sans font-light uppercase tracking-[0.3em]"
              style={{ fontSize: fPortadaSubtitulo, color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>
              {subtitulo}
            </p>
          )}
          {descripcion && (
            <p className="max-w-xs text-pretty leading-relaxed"
              style={{ fontSize: fPortadaDesc, color: "oklch(from var(--hero-ink) l c h / 0.75)" }}>
              {descripcion}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span style={{ fontSize: "9px", color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>{txtPortadaSeparador}</span>
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans font-light uppercase tracking-[0.4em]"
            style={{ fontSize: fPortadaCta, color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>
            {txtPortadaCta}
          </p>
        </div>

        {/* MOBILE — neblina radial */}
        <div aria-hidden className="absolute z-[8] sm:hidden"
          style={{
            top: bloqueTop, left: "50%",
            transform: "translate(-50%, -50%)",
            width: "110vw", height: "55vh",
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.08 0.01 40 / 0.55) 0%, oklch(0.08 0.01 40 / 0.0) 100%)",
            filter: "blur(18px)", pointerEvents: "none",
          }}
        />

        {/* MOBILE — bloque principal: 50vw centrado */}
        <div className="absolute z-10 flex flex-col items-center sm:hidden"
          style={{
            top: bloqueTop,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50vw",
          }}
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
              style={{ fontSize: fPortadaEtiqueta, color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>
              {config.hero_etiqueta_superior}
            </p>
          )}
          {nombre && (
            <h1 className="text-center font-serif font-medium leading-tight"
              style={{ fontSize: fPortadaNombre, color: "var(--hero-ink)" }}>
              {nombre}
            </h1>
          )}
          {subtitulo && (
            <p className="mt-0.5 text-center font-sans font-light uppercase tracking-[0.22em]"
              style={{ fontSize: fPortadaSubtitulo, color: "oklch(from var(--hero-ink) l c h / 0.55)" }}>
              {subtitulo}
            </p>
          )}
          {descripcion && (
            <p className="mt-1 text-center font-sans font-light leading-snug"
              style={{ fontSize: fPortadaDesc, color: "oklch(from var(--hero-ink) l c h / 0.7)" }}>
              {descripcion}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.18)" }} />
            <span style={{ fontSize: "7px", color: "oklch(from var(--hero-ink) l c h / 0.25)" }}>{txtPortadaSeparador}</span>
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.18)" }} />
          </div>
        </div>

        {/* MOBILE — CTA */}
        <div className="absolute z-10 flex flex-col items-center sm:hidden"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: ctaBottom }}
        >
          <p className="whitespace-nowrap text-center font-sans font-light uppercase tracking-[0.35em]"
            style={{ fontSize: fPortadaCta, color: "oklch(from var(--hero-ink) l c h / 0.45)" }}>
            {txtPortadaCta}
          </p>
        </div>
      </div>

      {/* ÍNDICE */}
      <div data-page="indice-0" className="carta-page bg-background">
        <div className="flex h-full flex-col px-6 pb-16 pt-12 sm:px-10">
          <div className="mb-4 shrink-0">
            <p className="mb-0.5 font-sans font-light uppercase tracking-[0.5em] text-primary"
              style={{ fontSize: fIndiceEtiqueta }}>
              {txtIndiceEtiqueta}
            </p>
            <h1 className="font-serif font-medium text-foreground"
              style={{ fontSize: fIndiceTitulo }}>
              {txtIndiceTitulo}
            </h1>
          </div>
          <ol className="flex-1 overflow-y-auto"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", alignContent: "start", gap: "0" }}>
            {menu.map((cat, i) => (
              <li key={cat.id}>
                <button data-goto={cat.id}
                  className="group flex w-full items-baseline gap-2.5 border-b border-dotted border-border/40 py-2 text-left transition-colors hover:bg-primary/5 active:bg-primary/10">
                  <span className="w-5 shrink-0 font-sans font-light text-primary"
                    style={{ fontSize: fIndiceNumero }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    {cat.categoria && cat.categoria !== cat.titulo_seccion && (
                      <span className="block font-sans font-light uppercase tracking-widest text-muted-foreground"
                        style={{ fontSize: fIndiceCategoria }}>
                        {cat.categoria}
                      </span>
                    )}
                    <span className="block font-serif font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
                      style={{ fontSize: fIndiceItem }}>
                      {cat.titulo_seccion}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* PÁGINAS DE CATEGORÍAS */}
      {menu.map((category, catIdx) => (
        <div key={category.id} data-page={category.id} className="carta-page relative bg-background">
          <div className="flex h-full flex-col overflow-y-auto pb-14">
            <div
              className="section-header-band relative shrink-0"
              style={{ height: bandaAltoMobile }}
            >
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

              <div className="absolute inset-0 hidden flex-col justify-end overflow-hidden px-10 pb-3 pt-10 sm:flex" style={{ zIndex: 10 }}>
                <p className="mb-0.5 font-sans font-light uppercase tracking-[0.4em] text-primary"
                  style={{ fontSize: fBandaEtiqueta }}>
                  {category.categoria ? `${category.categoria} · ` : ""}
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                <h2 className="font-serif font-medium leading-tight tracking-tight text-foreground"
                  style={{ fontSize: fBandaTitulo }}>
                  {category.titulo_seccion}
                </h2>
                {category.description && (
                  <p className="mt-0.5 font-sans font-light leading-snug text-muted-foreground"
                    style={{ fontSize: fBandaDesc }}>
                    {category.description}
                  </p>
                )}
              </div>

              <div className="flex h-full items-center sm:hidden" style={{ position: "relative", zIndex: 10 }}>
                <div className="flex flex-col justify-center gap-px px-4 py-2">
                  <p className="font-sans font-light uppercase tracking-[0.4em] text-primary"
                    style={{ fontSize: fBandaEtiqueta }}>
                    {category.categoria ? `${category.categoria} · ` : ""}
                    {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                  </p>
                  <h2 className="font-serif font-medium leading-none tracking-tight text-foreground"
                    style={{ fontSize: fBandaTitulo }}>
                    {category.titulo_seccion}
                  </h2>
                  {category.description && (
                    <p className="font-sans font-light leading-none text-muted-foreground"
                      style={{ fontSize: fBandaDesc }}>
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
            </div>

            <ul className="divide-y divide-dotted divide-border/40 px-6 sm:px-10">
              {category.items.map((item) => (
                <li key={item.name} className="py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`font-serif font-semibold leading-tight ${item.especial ? "text-primary" : "text-foreground"}`}
                      style={{ fontSize: fItemNombre }}>
                      {item.name}
                      {item.especial && (
                        <span className="ml-1 text-[8px] text-primary" aria-label="Especial"> ★</span>
                      )}
                    </h3>
                    <span className="shrink-0 font-serif font-semibold text-primary"
                      style={{ fontSize: fItemPrecio }}>
                      {formatPrecio(item.price, config)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-0.5 font-sans font-light leading-snug text-muted-foreground/75"
                      style={{ fontSize: fItemDesc }}>
                      {item.description}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 font-sans font-light uppercase tracking-wider text-primary/50"
                          style={{ fontSize: fItemTags }}>
                          <TagIcon tag={tag} />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </CartaControls>
  )
}
