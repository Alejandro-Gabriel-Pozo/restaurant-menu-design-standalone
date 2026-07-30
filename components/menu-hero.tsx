import type { SiteConfig } from "@/lib/get-config"
import { resolvePosClasses, isTruthy } from "@/lib/hero-utils"
import { LogoWithFallback } from "@/components/logo-with-fallback"
import { DarkToggle } from "@/components/dark-toggle"

interface MenuHeroProps {
  config: SiteConfig
  firstCategoryId?: string
}

export function MenuHero({ config, firstCategoryId }: MenuHeroProps) {
  const mostrarParteDe   = isTruthy(config.mostrar_pertenencia)
  const tienePertenencia = config.hosteria_nombre || config.empresa_nombre
  const acento           = config.hero_color_fondo || "#E8B84B"
  const ctaHref          = firstCategoryId ? `#${firstCategoryId}` : "#entrada"

  const posContenido = resolvePosClasses(config.hero_pos_contenido)
  const posLogo      = resolvePosClasses(config.hero_pos_logo)

  // Inline styles para el <img> de fondo — evita que Tailwind base (img { height: auto })
  // pise h-full y que object-position no tenga efecto por dimensiones incorrectas.
  const imgStyleMobile: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 70%",
    zIndex: 0,
  }

  const imgStyleDesktop: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    zIndex: 0,
  }

  const logoFallback = (
    <div
      className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento, fontFamily: "var(--font-playfair)" }}
    >
      {config.restaurante_nombre?.charAt(0) ?? "R"}
    </div>
  )

  const grupoTexto = (
    <div className="flex max-w-[85vw] sm:max-w-sm flex-col gap-4 sm:gap-6">
      {config.hero_etiqueta_superior && (
        <p
          className="font-sans text-xs sm:text-sm font-light tracking-[0.5em] uppercase"
          style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}
        >
          {config.hero_etiqueta_superior}
        </p>
      )}
      <div>
        <h1
          className="font-serif font-medium leading-tight text-balance"
          style={{ fontSize: "clamp(2.25rem, 4vw + 1.5rem, 3.75rem)", color: "var(--hero-ink)" }}
        >
          {config.restaurante_nombre}
        </h1>
        {config.restaurante_subtitulo && (
          <p
            className="mt-2 font-sans text-xs font-light uppercase tracking-[0.3em]"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.6)" }}
          >
            {config.restaurante_subtitulo}
          </p>
        )}
      </div>
      {config.restaurante_descripcion && (
        <p
          className="max-w-xs text-pretty text-sm leading-relaxed"
          style={{ color: "oklch(from var(--hero-ink) l c h / 0.75)" }}
        >
          {config.restaurante_descripcion}
        </p>
      )}
      <a
        href={ctaHref}
        className="w-fit rounded-none border px-8 sm:px-10 py-3 text-xs font-light uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
        style={{ borderColor: "oklch(from var(--hero-ink) l c h / 0.6)", color: "var(--hero-ink)" }}
      >
        {config.restaurante_boton_hero}
      </a>
    </div>
  )

  const grupoLogoDesktop = (
    <div className="flex flex-col items-center gap-2">
      {config.restaurante_logo_url
        ? <LogoWithFallback src={config.restaurante_logo_url} alt={config.restaurante_nombre} className="h-16 w-16 object-contain" fallback={logoFallback} />
        : logoFallback
      }
      {mostrarParteDe && tienePertenencia && (
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-center" style={{ color: "oklch(from var(--hero-ink) l c h / 0.55)" }}>
          Parte de{" "}
          {config.hosteria_url ? <a href={config.hosteria_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.hosteria_nombre}</a> : config.hosteria_nombre}
          {config.empresa_nombre && (
            <>{" · "}{config.empresa_url ? <a href={config.empresa_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.empresa_nombre}</a> : config.empresa_nombre}</>
          )}
        </p>
      )}
    </div>
  )

  const grupoLogoMobile = (
    <div className="flex flex-col items-center gap-1.5">
      {config.restaurante_logo_url
        ? <LogoWithFallback src={config.restaurante_logo_url} alt={config.restaurante_nombre} className="h-14 w-14 object-contain" fallback={logoFallback} />
        : logoFallback
      }
      {mostrarParteDe && tienePertenencia && (
        <p
          className="uppercase tracking-[0.2em] text-right leading-snug"
          style={{ fontSize: "10px", color: "oklch(from var(--hero-ink) l c h / 0.55)" }}
        >
          Parte de{" "}
          {config.hosteria_url ? <a href={config.hosteria_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.hosteria_nombre}</a> : config.hosteria_nombre}
          {config.empresa_nombre && (
            <>{" · "}{config.empresa_url ? <a href={config.empresa_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.empresa_nombre}</a> : config.empresa_nombre}</>
          )}
        </p>
      )}
    </div>
  )

  const overlayYTextura = (
    <>
      {config.hero_imagen_fondo_url && (
        <div className="absolute inset-0 z-[1]" style={{ backgroundColor: `${acento}BF` }} aria-hidden="true" />
      )}
      <div
        className="absolute inset-0 z-[1] opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
        aria-hidden="true"
      />
    </>
  )

  const bgSolido = !config.hero_imagen_fondo_url
    ? { backgroundColor: acento } as React.CSSProperties
    : undefined

  return (
    <>
      {/* ─── MOBILE (< sm) ──────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden min-h-svh sm:hidden" style={bgSolido}>
        {config.hero_imagen_fondo_url && (
          <img
            src={config.hero_imagen_fondo_url}
            alt=""
            aria-hidden="true"
            loading="eager"
            style={imgStyleMobile}
          />
        )}
        {overlayYTextura}
        <div className="absolute right-4 top-4 z-20"><DarkToggle /></div>
        <div className="relative z-10 flex flex-col justify-between min-h-svh px-6 pt-16 pb-8">
          <div>{grupoTexto}</div>
          <div className="flex flex-col items-end gap-3 mt-6">
            {config.hero_etiqueta_scroll && (
              <div className="flex flex-col items-center gap-1 w-full" style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}>
                <span className="font-sans font-light uppercase tracking-[0.3em]" style={{ fontSize: "9px" }}>
                  {config.hero_etiqueta_scroll}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            )}
            <div className="flex justify-end">{grupoLogoMobile}</div>
          </div>
        </div>
      </section>

      {/* ─── DESKTOP (≥ sm) ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden min-h-[85vh] hidden sm:block" style={bgSolido}>
        {config.hero_imagen_fondo_url && (
          <img
            src={config.hero_imagen_fondo_url}
            alt=""
            aria-hidden="true"
            loading="eager"
            style={imgStyleDesktop}
          />
        )}
        {overlayYTextura}
        <div className="absolute right-4 top-4 z-20"><DarkToggle /></div>

        <div className={`absolute inset-0 z-10 flex px-8 py-16 pointer-events-none ${posContenido}`}>
          <div className="flex max-w-sm flex-col gap-6 pointer-events-auto">{grupoTexto}</div>
        </div>

        <div className={`absolute inset-0 z-10 flex px-8 py-16 pointer-events-none ${posLogo}`}>
          <div className="pointer-events-auto">{grupoLogoDesktop}</div>
        </div>

        {config.hero_etiqueta_scroll && (
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}
          >
            <span className="font-sans text-[10px] font-light uppercase tracking-[0.3em]">{config.hero_etiqueta_scroll}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}
      </section>
    </>
  )
}
