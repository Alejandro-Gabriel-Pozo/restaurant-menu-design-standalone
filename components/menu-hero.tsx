import type { SiteConfig } from "@/lib/get-config"
import { LogoWithFallback } from "@/components/logo-with-fallback"
import { DarkToggle } from "@/components/dark-toggle"

interface MenuHeroProps {
  config: SiteConfig
  firstCategoryId?: string
}

export function MenuHero({ config, firstCategoryId }: MenuHeroProps) {
  const mostrarParteDe   = config.mostrar_pertenencia === "true"
  const tienePertenencia = config.hosteria_nombre || config.empresa_nombre
  const acento           = config.hero_color_fondo || "#E8B84B"

  const ctaHref = firstCategoryId ? `#${firstCategoryId}` : "#entrada"

  const heroStyle = config.hero_imagen_fondo_url
    ? {
        backgroundImage: `url(${config.hero_imagen_fondo_url})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { backgroundColor: acento }

  const logoFallback = (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold"
      style={{
        backgroundColor: "oklch(0.18 0.02 40)",
        color: acento,
        fontFamily: "var(--font-playfair)",
      }}
    >
      {config.restaurante_nombre?.charAt(0) ?? "R"}
    </div>
  )

  return (
    <section
      className="relative isolate overflow-hidden"
      style={heroStyle}
    >
      {/* Overlay de color */}
      {config.hero_imagen_fondo_url && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: `${acento}BF` }}
          aria-hidden="true"
        />
      )}

      {/* Textura sutil */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Toggle arriba a la derecha */}
      <div className="absolute right-4 top-4 z-20">
        <DarkToggle />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-sm flex-col items-center justify-center gap-8 px-6 py-24 text-center">

        {/* Etiqueta superior configurable */}
        {config.hero_etiqueta_superior && (
          <p
            className="font-sans text-sm font-light tracking-[0.5em] uppercase"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}
          >
            {config.hero_etiqueta_superior}
          </p>
        )}

        {config.restaurante_logo_url ? (
          <LogoWithFallback
            src={config.restaurante_logo_url}
            alt={config.restaurante_nombre}
            className="h-16 w-16 object-contain"
            fallback={logoFallback}
          />
        ) : (
          logoFallback
        )}

        <div>
          <h1
            className="font-serif text-5xl font-medium leading-tight text-balance sm:text-6xl"
            style={{ color: "var(--hero-ink)" }}
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

        {mostrarParteDe && tienePertenencia && (
          <p
            className="font-sans text-xs uppercase tracking-[0.25em]"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.55)" }}
          >
            Parte de{" "}
            {config.hosteria_url ? (
              <a
                href={config.hosteria_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {config.hosteria_nombre}
              </a>
            ) : (
              config.hosteria_nombre
            )}
            {config.empresa_nombre && ` · ${config.empresa_nombre}`}
          </p>
        )}

        <a
          href={ctaHref}
          className="mt-2 rounded-none border px-10 py-3 text-xs font-light uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
          style={{
            borderColor: "oklch(from var(--hero-ink) l c h / 0.6)",
            color: "var(--hero-ink)",
          }}
        >
          {config.restaurante_boton_hero}
        </a>

        {/* Flecha scroll: se muestra solo si hero_etiqueta_scroll tiene valor */}
        {config.hero_etiqueta_scroll && (
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ color: "oklch(from var(--hero-ink) l c h / 0.4)" }}
          >
            <span className="font-sans text-[10px] font-light uppercase tracking-[0.3em]">
              {config.hero_etiqueta_scroll}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}
