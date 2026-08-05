import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaControls }     from "@/components/carta-controls"
import { CartaSectionImage } from "@/components/carta-section-image"
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
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento }}>
      {nombre.charAt(0)}
    </div>
  )

  return (
    <CartaControls menu={menu}>

      {/* ══ PORTADA ══ */}
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

        {/* DESKTOP */}
        <div className="relative z-10 hidden h-full flex-col items-center justify-center gap-5 px-8 text-center sm:flex">
          {logoUrl
            ? <LogoWithFallback src={logoUrl} alt={nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
            : logoFallback}
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
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="text-[9px]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.4em]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>
            Deslizá para ver la carta
          </p>
        </div>

        {/*
          MOBILE — neblina radial detrás del bloque, sin bordes ni card visible.
          Dos capas: una elipse grande muy difusa (la "nube") y el contenido encima.
        */}

        {/* Neblina radial — misma posición que el bloque */}
        <div
          aria-hidden
          className="absolute z-[8] sm:hidden"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "110vw",
            height: "55vh",
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.08 0.01 40 / 0.55) 0%, oklch(0.08 0.01 40 / 0.0) 100%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }}
        />

        {/* Bloque principal centrado — sin fondo, sin borde */}
        <div
          className="absolute z-10 flex flex-col items-center sm:hidden"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(80vw, 300px)",
          }}
        >
          {logoUrl && (
            <LogoWithFallback
              src={logoUrl}
              alt={nombre}
              className="mb-3 h-10 w-10 object-contain"
              fallback={
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento }}>
                  {nombre.charAt(0)}
                </div>
              }
            />
          )}

          {config.hero_etiqueta_superior && (
            <p className="text-center font-sans font-light uppercase tracking-[0.45em]"
              style={{ fontSize: "0.58rem", color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>
              {config.hero_etiqueta_superior}
            </p>
          )}

          <h1 className="text-center font-serif font-medium leading-tight"
            style={{ fontSize: "clamp(1.7rem, 7vw, 2.1rem)", color: "var(--hero-ink)" }}>
            {nombre}
          </h1>

          {subtitulo && (
            <p className="mt-0.5 text-center font-sans font-light uppercase tracking-[0.22em]"
              style={{ fontSize: "0.6rem", color: "oklch(from var(--hero-ink) l c h / 0.55)" }}>
              {subtitulo}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.18)" }} />
            <span style={{ fontSize: "7px", color: "oklch(from var(--hero-ink) l c h / 0.25)" }}>•</span>
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.18)" }} />
          </div>
        </div>

        {/* MOBILE — CTA bien por encima de la barra del sistema */}
        <div
          className="absolute z-10 flex flex-col items-center sm:hidden"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "calc(env(safe-area-inset-bottom, 20px) + 80px)",
          }}
        >
          <p className="whitespace-nowrap text-center font-sans font-light uppercase tracking-[0.35em]"
            style={{ fontSize: "0.5rem", color: "oklch(from var(--hero-ink) l c h / 0.45)" }}>
            Deslizá para ver la carta
          </p>
        </div>
      </div>

      {/* ══ ÍNDICE ══ */}
      <div data-page="indice-0" className="carta-page bg-background">
        <div className="flex h-full flex-col px-6 pb-16 pt-12 sm:px-10">
          <div className="mb-4 shrink-0">
            <p className="mb-0.5 font-sans text-[8px] font-light uppercase tracking-[0.5em] text-primary">Índice</p>
            <h1 className="font-serif font-medium text-foreground" style={{ fontSize: "clamp(1.2rem, 4vw, 1.75rem)" }}>La carta</h1>
          </div>
          <ol className="flex-1 overflow-y-auto"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", alignContent: "start", gap: "0" }}>
            {menu.map((cat, i) => (
              <li key={cat.id}>
                <button data-goto={cat.id}
                  className="group flex w-full items-baseline gap-2.5 border-b border-dotted border-border/40 py-2 text-left transition-colors hover:bg-primary/5 active:bg-primary/10">
                  <span className="w-5 shrink-0 font-sans font-light text-primary" style={{ fontSize: "0.6rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    {cat.categoria && cat.categoria !== cat.titulo_seccion && (
                      <span className="block font-sans font-light uppercase tracking-widest text-muted-foreground" style={{ fontSize: "0.58rem" }}>{cat.categoria}</span>
                    )}
                    <span className="block font-serif font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
                      style={{ fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)" }}>
                      {cat.titulo_seccion ?? cat.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ══ PÁGINAS DE CATEGORÍAS ══ */}
      {menu.map((category, catIdx) => (
        <div key={category.id} data-page={category.id} className="carta-page relative bg-background">
          <div className="flex h-full flex-col overflow-y-auto pb-14">
            <div className="section-header-band relative shrink-0" style={{ height: "90px" }}>
              <style>{`
                @media (min-width: 640px) {
                  .section-header-band { height: clamp(80px, 18vh, 140px) !important; }
                }
              `}</style>
              {category.imagen_url && (
                <div className="absolute inset-0 hidden sm:block">
                  <CartaSectionImage url={category.imagen_url} />
                  <div className="absolute inset-0" aria-hidden
                    style={{ background: "linear-gradient(to right, oklch(from var(--background) l c h / 0.90) 0%, oklch(from var(--background) l c h / 0.60) 60%, oklch(from var(--background) l c h / 0.20) 100%)" }} />
                </div>
              )}
              <div className="absolute inset-0 hidden flex-col justify-end overflow-hidden px-10 pb-3 pt-10 sm:flex">
                <p className="mb-0.5 font-sans font-light uppercase tracking-[0.4em] text-primary" style={{ fontSize: "0.58rem" }}>
                  {category.categoria ? `${category.categoria} · ` : ""}
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                <h2 className="font-serif font-medium leading-tight tracking-tight text-foreground" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
                  {category.titulo_seccion ?? category.title}
                </h2>
                {category.description && (
                  <p className="mt-0.5 font-sans font-light leading-snug text-muted-foreground" style={{ fontSize: "0.78rem" }}>
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex h-full pt-10 sm:hidden">
                <div className="flex flex-1 flex-col justify-center gap-px px-4 pb-1">
                  <p className="font-sans font-light uppercase tracking-[0.4em] text-primary" style={{ fontSize: "0.55rem" }}>
                    {category.categoria ? `${category.categoria} · ` : ""}
                    {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                  </p>
                  <h2 className="font-serif font-medium leading-none tracking-tight text-foreground" style={{ fontSize: "0.95rem" }}>
                    {category.titulo_seccion ?? category.title}
                  </h2>
                  {category.description && (
                    <p className="font-sans font-light leading-none text-muted-foreground" style={{ fontSize: "0.6rem" }}>
                      {category.description}
                    </p>
                  )}
                </div>
                {category.imagen_url && (
                  <div className="flex shrink-0 items-center justify-center overflow-hidden pb-1 pr-3" style={{ width: "38%" }}>
                    <img src={category.imagen_url} alt="" aria-hidden loading="lazy"
                      style={{ display: "block", maxHeight: "100%", maxWidth: "100%", width: "auto", height: "100%", objectFit: "contain", opacity: 0.6 }} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
            </div>
            <ul className="divide-y divide-dotted divide-border/40 px-6 sm:px-10">
              {category.items.map((item) => (
                <li key={item.name} className="py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`font-serif font-semibold leading-tight ${item.especial ? "text-primary" : "text-foreground"}`}
                      style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}>
                      {item.name}{item.especial && <span className="ml-1 text-[8px] text-primary"> ★</span>}
                    </h3>
                    <span className="shrink-0 font-serif font-semibold text-primary" style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}>
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-0.5 font-sans font-light leading-snug text-muted-foreground/75" style={{ fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)" }}>
                      {item.description}
                    </p>
                  )}
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
