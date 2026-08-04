import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaControls }     from "@/components/carta-controls"
import { LogoWithFallback }  from "@/components/logo-with-fallback"

interface Props {
  menu:   MenuCategory[]
  config: SiteConfig
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function CartaView({ menu, config }: Props) {
  const acento      = config.hero_color_fondo || "#E8B84B"
  const nombre      = config.restaurante_nombre ?? config.nombre ?? "Restaurante"
  const subtitulo   = config.restaurante_subtitulo ?? config.subtitulo ?? ""
  const descripcion = config.restaurante_descripcion ?? ""
  const logoUrl     = config.restaurante_logo_url ?? ""
  const bgUrl       = config.hero_imagen_fondo_url ?? ""
  const bgSolido: React.CSSProperties = !bgUrl ? { backgroundColor: acento } : {}

  // índice: 8 por página en mobile (texto compacto), 5 en desktop
  // usamos 5 para ambos y ajustamos tamaño vía CSS
  const indiceChunks = chunk(menu, 5)

  const logoFallback = (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento, fontFamily: "var(--font-playfair)" }}>
      {nombre.charAt(0)}
    </div>
  )

  return (
    <CartaControls indexPageId="indice-0">

      {/* ══ PORTADA ══ */}
      <div data-page="portada" className="carta-page relative isolate overflow-hidden" style={bgSolido}>
        {bgUrl && <img src={bgUrl} alt="" aria-hidden loading="eager" className="absolute inset-0 z-0 h-full w-full object-cover" />}
        {bgUrl && <div className="absolute inset-0 z-[1]" style={{ backgroundColor: `${acento}BF` }} aria-hidden />}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" aria-hidden
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          {logoUrl ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} /> : logoFallback}
          {config.hero_etiqueta_superior && (
            <p className="font-sans text-xs font-light uppercase tracking-[0.5em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}>{config.hero_etiqueta_superior}</p>
          )}
          <h1 className="font-serif font-medium leading-tight text-balance" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--hero-ink)" }}>{nombre}</h1>
          {subtitulo && <p className="font-sans text-xs font-light uppercase tracking-[0.3em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>{subtitulo}</p>}
          {descripcion && <p className="max-w-xs text-pretty text-sm leading-relaxed" style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}>{descripcion}</p>}
          <div className="flex items-center gap-4">
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="font-sans text-[9px] uppercase tracking-[0.6em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.4em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>Deslizá para ver la carta</p>
        </div>
      </div>

      {/* ══ ÍNDICE ══ */}
      {indiceChunks.map((cats, chunkIdx) => (
        <div key={`indice-${chunkIdx}`} data-page={`indice-${chunkIdx}`} className="carta-page bg-background">
          <div className="flex h-full flex-col px-6 pb-16 pt-10 sm:px-10 sm:pt-12">
            {chunkIdx === 0 && (
              <div className="mb-4 shrink-0 sm:mb-6">
                <p className="mb-0.5 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">Índice</p>
                <h2 className="font-serif font-medium text-foreground" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>La carta</h2>
              </div>
            )}
            <ol className="flex flex-1 flex-col justify-evenly">
              {cats.map((cat, i) => {
                const globalIdx = chunkIdx * 5 + i
                return (
                  <li key={cat.id} className="flex items-baseline gap-3 border-b border-dotted border-border/50 py-2 last:border-0 sm:py-3">
                    <span className="w-5 shrink-0 font-sans text-[10px] font-light text-primary sm:text-xs">
                      {String(globalIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif font-medium leading-tight text-foreground" style={{ fontSize: "clamp(0.95rem, 3vw, 1.25rem)" }}>
                      {cat.title}
                    </span>
                    {cat.description && (
                      <span className="hidden text-right text-xs font-light leading-snug text-muted-foreground sm:block" style={{ maxWidth: "12rem" }}>
                        {cat.description}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
            {indiceChunks.length > 1 && (
              <p className="mt-3 shrink-0 text-right font-sans text-[9px] font-light uppercase tracking-widest text-muted-foreground">
                {chunkIdx + 1} / {indiceChunks.length}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* ══ PÁGINAS DE CATEGORÍAS ══ */}
      {menu.map((category, catIdx) => (
        <div key={category.id} data-page={category.id} className="carta-page relative bg-background">

          {/* ── LAYOUT COMPARTIDO (mobile y desktop): flex-col, padding-bottom para barra nav ── */}
          <div className="flex h-full flex-col overflow-y-auto pb-14">

            {/* ENCABEZADO: título+descripción a la izquierda, imagen a la derecha — mismo plano horizontal */}
            <div className="flex shrink-0 items-stretch gap-0 border-b border-primary/20">

              {/* Bloque de texto */}
              <div className="flex flex-1 flex-col justify-center px-6 py-5 sm:px-10 sm:py-8">
                <p className="mb-1 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                <h2 className="font-serif font-medium leading-tight tracking-tight text-foreground" style={{ fontSize: "clamp(1.4rem, 4vw, 2.5rem)" }}>
                  {category.title}
                </h2>
                {category.description && (
                  <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Imagen: mismo alto que el bloque de texto, ancho fijo */}
              {category.imagen_url && (
                <div className="relative shrink-0 overflow-hidden" style={{ width: "clamp(100px, 28vw, 220px)" }}>
                  <img
                    src={category.imagen_url}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                  {/* overlay sutil para continuidad */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to right, oklch(from var(--background) l c h / 0.2) 0%, transparent 30%)" }}
                    aria-hidden />
                </div>
              )}
            </div>

            {/* LISTA DE PLATOS */}
            <ul className="flex-1 space-y-0 divide-y divide-dotted divide-border/50 px-6 sm:px-10">
              {category.items.map((item) => (
                <li key={item.name} className={`py-3 ${
                  item.especial ? "border-dashed border-primary/30" : ""
                }`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`font-serif font-medium leading-tight ${
                      item.especial ? "text-primary" : "text-foreground"
                    }`} style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}>
                      {item.name}
                      {item.especial && <span className="ml-1.5 text-[9px]"> ★</span>}
                    </h3>
                    <span className="shrink-0 font-serif font-medium text-primary" style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}>
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-0.5 font-sans text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
                      {item.description}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 font-sans text-[10px] font-light uppercase tracking-wider text-primary/60">
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
