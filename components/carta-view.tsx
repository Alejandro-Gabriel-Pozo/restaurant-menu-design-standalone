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
      {/* ═══════════════════════════════════════════════════════════
          PÁGINA 0 — Portada (replica el hero original)
      ════════════════════════════════════════════════════════════ */}
      <div
        data-page="portada"
        className="carta-page relative isolate overflow-hidden"
        style={bgSolido}
      >
        {/* Imagen de fondo */}
        {bgUrl && (
          <img
            src={bgUrl}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
        )}

        {/* Overlay color de marca */}
        {bgUrl && (
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundColor: `${acento}BF` }}
            aria-hidden="true"
          />
        )}

        {/* Textura de grano */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.06]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
          aria-hidden="true"
        />

        {/* Contenido centrado */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          {/* Logo */}
          {logoUrl
            ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
            : logoFallback
          }

          {/* Etiqueta superior */}
          {config.hero_etiqueta_superior && (
            <p
              className="font-sans text-xs font-light uppercase tracking-[0.5em]"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}
            >
              {config.hero_etiqueta_superior}
            </p>
          )}

          {/* Nombre */}
          <h1
            className="font-serif font-medium leading-tight text-balance"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--hero-ink)" }}
          >
            {nombre}
          </h1>

          {/* Subtitulo */}
          {subtitulo && (
            <p
              className="font-sans text-xs font-light uppercase tracking-[0.3em]"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}
            >
              {subtitulo}
            </p>
          )}

          {/* Descripcion */}
          {descripcion && (
            <p
              className="max-w-xs text-pretty text-sm leading-relaxed"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}
            >
              {descripcion}
            </p>
          )}

          {/* Separador */}
          <div className="flex items-center gap-4">
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="font-sans text-[9px] uppercase tracking-[0.6em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-12" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>

          {/* Etiqueta scroll */}
          <p
            className="font-sans text-[10px] font-light uppercase tracking-[0.4em]"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}
          >
            Deslizá para ver la carta
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PÁGINAS de categorías
      ════════════════════════════════════════════════════════════ */}
      {menu.map((category, catIdx) => (
        <div
          key={category.id}
          data-page={category.id}
          className="carta-page overflow-y-auto bg-background"
        >
          <div className="mx-auto max-w-lg px-8 py-12">

            {/* Encabezado de sección */}
            <div className="mb-8 border-b border-primary/20 pb-5">
              <p className="mb-1 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">
                {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">{category.title}</h2>
              {category.description && (
                <p className="mt-2 font-sans text-sm font-light text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Lista de platos */}
            <ul className="space-y-5">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b pb-5 ${
                    item.especial ? "border-dashed border-primary/30" : "border-dotted border-border/50"
                  }`}
                >
                  <h3
                    className={`font-serif text-lg font-medium leading-tight ${
                      item.especial ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                    {item.especial && (
                      <span className="ml-2 font-sans text-[9px] uppercase tracking-widest text-primary"> ★</span>
                    )}
                  </h3>
                  <span className="self-start font-serif text-lg font-medium text-primary">
                    {item.price}
                  </span>
                  {item.description && (
                    <p className="col-span-2 font-sans text-sm font-light leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="col-span-2 mt-1 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 font-sans text-[10px] font-light uppercase tracking-wider text-primary/60"
                        >
                          <TagIcon tag={tag} />
                          {tag}
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
