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
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento }}>
      {nombre.charAt(0)}
    </div>
  )

  return (
    <CartaControls menu={menu}>

      {/* ══ PORTADA ══ */}
      <div data-page="portada" className="carta-page relative isolate overflow-hidden" style={bgSolido}>
        {bgUrl && <img src={bgUrl} alt="" aria-hidden loading="eager" className="absolute inset-0 z-0 h-full w-full object-cover" />}
        {bgUrl && <div className="absolute inset-0 z-[1]" style={{ backgroundColor: `${acento}BF` }} aria-hidden />}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" aria-hidden
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
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
            <p className="font-sans text-xs font-light uppercase tracking-[0.3em]"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}>
              {subtitulo}
            </p>
          )}
          {descripcion && (
            <p className="max-w-xs text-pretty text-sm leading-relaxed"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}>
              {descripcion}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
            <span className="text-[9px]" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>✦</span>
            <span className="block h-px w-10" style={{ backgroundColor: "oklch(from var(--hero-ink) l c h / 0.3)" }} />
          </div>
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.4em]"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.5)" }}>
            Deslizá para ver la carta
          </p>
        </div>
      </div>

      {/* ══ ÍNDICE — una sola página, 2 columnas en sm+, 1 columna en mobile ══ */}
      <div data-page="indice-0" className="carta-page bg-background">
        <div className="flex h-full flex-col px-6 pb-16 pt-16 sm:px-10">

          <div className="mb-4 shrink-0">
            <p className="mb-0.5 font-sans text-[8px] font-light uppercase tracking-[0.5em] text-primary">Índice</p>
            {/* h1 semántico del menú completo */}
            <h1 className="font-serif font-medium text-foreground" style={{ fontSize: "clamp(1.2rem, 4vw, 1.75rem)" }}>
              La carta
            </h1>
          </div>

          {/* Grid 2 columnas en sm+, 1 columna en mobile */}
          <ol
            className="flex-1 overflow-y-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              alignContent: "start",
              gap: "0",
            }}
          >
            {menu.map((cat, i) => (
              <li key={cat.id}>
                {/* Cada ítem es un botón que navega a esa sección */}
                <button
                  data-goto={cat.id}
                  className="group flex w-full items-baseline gap-2.5 border-b border-dotted border-border/40 py-2 text-left transition-colors hover:bg-primary/5 active:bg-primary/10"
                >
                  <span className="w-5 shrink-0 font-sans font-light text-primary" style={{ fontSize: "0.6rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    {/* categoria (ej: "Platos Principales") como etiqueta chica */}
                    {cat.categoria && cat.categoria !== cat.titulo_seccion && (
                      <span className="block font-sans font-light uppercase tracking-widest text-muted-foreground" style={{ fontSize: "0.58rem" }}>
                        {cat.categoria}
                      </span>
                    )}
                    {/* titulo_seccion (ej: "Del fuego") como título principal */}
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

            {/* ── ENCABEZADO: banda imagen 15vh, texto empieza debajo de la topbar (pt-12) ── */}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ height: "clamp(80px, 18vh, 140px)" }}
            >
              {/* Imagen — object-cover, sin distorsión en desktop ni mobile */}
              {category.imagen_url && (
                <img
                  src={category.imagen_url}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full"
                  style={{ objectFit: "cover", objectPosition: "center", opacity: 0.38 }}
                />
              )}
              {/* Overlay gradiente izquierda → legibilidad del texto */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, oklch(from var(--background) l c h / 0.88) 0%, oklch(from var(--background) l c h / 0.55) 65%, oklch(from var(--background) l c h / 0.15) 100%)",
                }}
                aria-hidden
              />
              {/* Texto — pt-10 para quedar debajo de la topbar de 40px */}
              <div className="absolute inset-0 flex flex-col justify-end px-6 pb-3 pt-10 sm:px-10">
                <p className="mb-0.5 font-sans font-light uppercase tracking-[0.4em] text-primary" style={{ fontSize: "0.58rem" }}>
                  {/* categoria como supertítulo */}
                  {category.categoria ?? ""}
                  {category.categoria ? " · " : ""}
                  {String(catIdx + 1).padStart(2, "0")} / {String(menu.length).padStart(2, "0")}
                </p>
                {/* h2 semántico — titulo_seccion */}
                <h2
                  className="font-serif font-medium leading-tight tracking-tight text-foreground"
                  style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)" }}
                >
                  {category.titulo_seccion ?? category.title}
                </h2>
                {category.description && (
                  <p
                    className="mt-0.5 font-sans font-light leading-snug text-muted-foreground"
                    style={{ fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)" }}
                  >
                    {category.description}
                  </p>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
            </div>

            {/* ── LISTA DE PLATOS ── */}
            <ul className="divide-y divide-dotted divide-border/40 px-6 sm:px-10">
              {category.items.map((item) => (
                <li key={item.name} className="py-2.5">
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
                  {item.description && (
                    <p
                      className="mt-0.5 font-sans font-light leading-snug text-muted-foreground/75"
                      style={{ fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)" }}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag}
                          className="inline-flex items-center gap-0.5 font-sans font-light uppercase tracking-wider text-primary/50"
                          style={{ fontSize: "0.6rem" }}
                        >
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
