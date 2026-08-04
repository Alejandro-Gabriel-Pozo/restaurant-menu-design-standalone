import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaControls }     from "@/components/carta-controls"
import { LogoWithFallback }  from "@/components/logo-with-fallback"

interface Props {
  menu:   MenuCategory[]
  config: SiteConfig
}

export function CartaView({ menu, config }: Props) {
  const acento      = config.hero_color_fondo || "#E8B84B"
  const nombre      = config.restaurante_nombre ?? config.nombre ?? "Restaurante"
  const subtitulo   = config.restaurante_subtitulo ?? config.subtitulo ?? ""
  const descripcion = config.restaurante_descripcion ?? ""
  const logoUrl     = config.restaurante_logo_url ?? ""
  const bgUrl       = config.hero_imagen_fondo_url ?? ""

  const bgSolido: React.CSSProperties = !bgUrl ? { backgroundColor: acento } : {}

  const logoFallback = (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento, fontFamily: "var(--font-playfair)" }}
    >
      {nombre.charAt(0)}
    </div>
  )

  return (
    <CartaControls>

      {/* ══════════════════════════════════════════════════════════
          PORTADA — réplica exacta del hero original
      ══════════════════════════════════════════════════════════ */}
      <div data-page="portada" className="carta-page relative isolate overflow-hidden" style={bgSolido}>
        {bgUrl && (
          <img src={bgUrl} alt="" aria-hidden loading="eager"
            className="absolute inset-0 z-0 h-full w-full object-cover" />
        )}
        {bgUrl && (
          <div className="absolute inset-0 z-[1]" style={{ backgroundColor: `${acento}BF` }} aria-hidden />
        )}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" aria-hidden
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          {logoUrl
            ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
            : logoFallback
          }
          {config.hero_etiqueta_superior && (
            <p className="font-sans text-xs font-light uppercase tracking-[0.5em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}>
              {config.hero_etiqueta_superior}
            </p>
          )}
          <h1 className="font-serif font-medium leading-tight text-balance"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--hero-ink)" }}>
            {nombre}
          </h1>
          {subtitulo && (
            <p className="font-sans text-xs font-light uppercase tracking-[0.3em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>
              {subtitulo}
            </p>
          )}
          {descripcion && (
            <p className="max-w-xs text-pretty text-sm leading-relaxed" style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}>
              {descripcion}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="font-sans text-[9px] uppercase tracking-[0.6em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.4em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>
            Deslizá para ver la carta
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ÍNDICE
      ══════════════════════════════════════════════════════════ */}
      <div data-page="indice" className="carta-page overflow-y-auto bg-background">
        <div className="mx-auto flex h-full max-w-lg flex-col justify-center px-10 py-16">
          <p className="mb-2 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">Índice</p>
          <h2 className="mb-8 font-serif text-3xl font-medium text-foreground">La carta</h2>
          <ol className="space-y-0">
            {menu.map((cat, i) => (
              <li key={cat.id}
                className="flex items-baseline gap-4 border-b border-dotted border-border/50 py-4 last:border-0">
                <span className="w-6 shrink-0 font-sans text-xs font-light text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-serif text-xl font-medium text-foreground">{cat.title}</span>
                {cat.description && (
                  <span className="hidden text-right text-sm font-light leading-snug text-muted-foreground sm:block" style={{ maxWidth: "14rem" }}>
                    {cat.description}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PÁGINAS DE CATEGORÍAS
      ══════════════════════════════════════════════════════════ */}
      {menu.map((category, catIdx) => (
        <div
          key={category.id}
          data-page={category.id}
          className="carta-page relative isolate overflow-hidden bg-background"
        >
          {/* ── Imagen de fondo en mobile (ultra-transparente, solo textura) */}
          {category.imagen_url && (
            <>
              <img
                src={category.imagen_url}
                alt=""
                aria-hidden
                className="absolute inset-0 z-0 h-full w-full object-cover sm:hidden"
                style={{ objectPosition: "center" }}
              />
              {/* Overlay fuerte para mobile — garantiza lectura */}
              <div
                className="absolute inset-0 z-[1] sm:hidden"
                style={{ backgroundColor: "oklch(from var(--background) l c h / 0.92)" }}
                aria-hidden
              />
            </>
          )}

          {/* ── Layout desktop: dos columnas iguales ── */}
          <div className="relative z-10 flex h-full flex-col sm:flex-row">

            {/* Columna izquierda — encabezado + platos */}
            <div className="flex flex-1 flex-col overflow-y-auto px-8 py-12 sm:px-10 sm:py-14">
              {/* Encabezado sección */}
              <div className="mb-6 border-b border-primary/20 pb-5">
                <p className="mb-1 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">{category.title}</h2>
                {category.description && (
                  <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Lista de platos */}
              <ul className="space-y-4">
                {category.items.map((item) => (
                  <li key={item.name}
                    className={`border-b pb-4 ${
                      item.especial ? "border-dashed border-primary/30" : "border-dotted border-border/50"
                    }`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className={`font-serif text-lg font-medium leading-tight ${
                        item.especial ? "text-primary" : "text-foreground"
                      }`}>
                        {item.name}
                        {item.especial && <span className="ml-2 font-sans text-[9px] uppercase tracking-widest text-primary"> ★</span>}
                      </h3>
                      <span className="shrink-0 font-serif text-lg font-medium text-primary">{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="mt-1 font-sans text-sm font-light leading-relaxed text-muted-foreground">{item.description}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-2">
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

            {/* Columna derecha — imagen (solo desktop) */}
            {category.imagen_url && (
              <div className="relative hidden sm:block sm:w-1/2 shrink-0">
                <img
                  src={category.imagen_url}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center" }}
                />
                {/* Overlay sutil para garantizar contraste si hay texto sobre la imagen */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, oklch(from var(--background) l c h / 0.25) 0%, transparent 30%)" }}
                  aria-hidden
                />
              </div>
            )}

            {/* Sin imagen: columna derecha vacía con fondo suave */}
            {!category.imagen_url && (
              <div
                className="hidden sm:block sm:w-1/2 shrink-0"
                style={{ backgroundColor: "oklch(from var(--primary) l c h / 0.06)" }}
              />
            )}
          </div>
        </div>
      ))}
    </CartaControls>
  )
}
