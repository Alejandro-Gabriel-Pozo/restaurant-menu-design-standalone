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

  // 8 items por chunk — con tipografía compacta entran en una pantalla
  const indiceChunks = chunk(menu, 8)

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
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
          {logoUrl ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} /> : logoFallback}
          {config.hero_etiqueta_superior && (
            <p className="font-sans text-xs font-light uppercase tracking-[0.5em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}>{config.hero_etiqueta_superior}</p>
          )}
          <h1 className="font-serif font-medium leading-tight text-balance" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--hero-ink)" }}>{nombre}</h1>
          {subtitulo && <p className="font-sans text-xs font-light uppercase tracking-[0.3em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>{subtitulo}</p>}
          {descripcion && <p className="max-w-xs text-pretty text-sm leading-relaxed" style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}>{descripcion}</p>}
          <div className="flex items-center gap-4">
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="text-[9px]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.4em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>Deslizá para ver la carta</p>
        </div>
      </div>

      {/* ══ ÍNDICE — tipografía compacta, sin espacio muerto ══ */}
      {indiceChunks.map((cats, chunkIdx) => (
        <div key={`indice-${chunkIdx}`} data-page={`indice-${chunkIdx}`} className="carta-page bg-background">
          <div className="flex h-full flex-col px-7 pb-16 pt-10 sm:px-10 sm:pt-12">

            {chunkIdx === 0 && (
              <div className="mb-3 shrink-0">
                <p className="mb-0.5 font-sans text-[8px] font-light uppercase tracking-[0.5em] text-primary">Índice</p>
                <h2 className="font-serif font-medium text-foreground" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>La carta</h2>
              </div>
            )}

            {/* justify-evenly distribuye los ítems uniformemente sin scroll */}
            <ol className="flex flex-1 flex-col justify-evenly divide-y divide-dotted divide-border/40">
              {cats.map((cat, i) => {
                const g = chunkIdx * 8 + i
                return (
                  <li key={cat.id} className="flex items-baseline gap-2.5 py-1.5">
                    <span className="w-4 shrink-0 font-sans font-light text-primary" style={{ fontSize: "0.65rem" }}>
                      {String(g + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif font-medium leading-snug text-foreground" style={{ fontSize: "clamp(0.82rem, 2.5vw, 1rem)" }}>
                      {cat.title}
                    </span>
                    {cat.description && (
                      <span className="hidden text-right font-light leading-snug text-muted-foreground sm:block" style={{ fontSize: "0.72rem", maxWidth: "11rem" }}>
                        {cat.description}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>

            {indiceChunks.length > 1 && (
              <p className="mt-2 shrink-0 text-right font-sans text-[8px] font-light uppercase tracking-widest text-muted-foreground">
                {chunkIdx + 1} / {indiceChunks.length}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* ══ PÁGINAS DE CATEGORÍAS ══ */}
      {menu.map((category, catIdx) => (
        <div key={category.id} data-page={category.id} className="carta-page relative bg-background">
          <div className="flex h-full flex-col overflow-y-auto pb-14">

            {/* ── ENCABEZADO: imagen como banda de fondo 15vh, título encima ── */}
            <div className="relative shrink-0 overflow-hidden" style={{ height: "15vh", minHeight: "80px", maxHeight: "130px" }}>

              {/* Imagen de fondo de la sección — opacidad baja, solo textura */}
              {category.imagen_url && (
                <img
                  src={category.imagen_url}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center", opacity: 0.35 }}
                />
              )}

              {/* Overlay para garantizar lectura del texto */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, oklch(from var(--background) l c h / 0.82) 0%, oklch(from var(--background) l c h / 0.55) 60%, oklch(from var(--background) l c h / 0.20) 100%)" }}
                aria-hidden
              />

              {/* Texto sobre la imagen */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
                <p className="mb-0.5 font-sans font-light uppercase tracking-[0.45em] text-primary" style={{ fontSize: "0.6rem" }}>
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                <h2
                  className="font-serif font-medium leading-tight tracking-tight text-foreground"
                  style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)" }}
                >
                  {category.title}
                </h2>
                {category.description && (
                  <p className="mt-0.5 font-sans font-light leading-snug text-muted-foreground" style={{ fontSize: "clamp(0.7rem, 2vw, 0.82rem)" }}>
                    {category.description}
                  </p>
                )}
              </div>

              {/* Separador inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
            </div>

            {/* ── LISTA DE PLATOS ── */}
            <ul className="divide-y divide-dotted divide-border/40 px-6 sm:px-10">
              {category.items.map((item) => (
                <li key={item.name} className="py-2.5">
                  {/* Nombre + precio en la misma línea */}
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      className={`font-serif font-semibold leading-tight ${
                        item.especial ? "text-primary" : "text-foreground"
                      }`}
                      style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}
                    >
                      {item.name}
                      {item.especial && <span className="ml-1 text-[8px] text-primary"> ★</span>}
                    </h3>
                    <span
                      className="shrink-0 font-serif font-semibold text-primary"
                      style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}
                    >
                      {item.price}
                    </span>
                  </div>

                  {/* Descripción — gris claro, tamaño menor */}
                  {item.description && (
                    <p
                      className="mt-0.5 font-sans font-light leading-snug text-muted-foreground/75"
                      style={{ fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)" }}
                    >
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 font-sans font-light uppercase tracking-wider text-primary/50" style={{ fontSize: "0.6rem" }}>
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
