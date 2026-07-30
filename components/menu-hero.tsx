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

  const heroStyle = config.hero_imagen_fondo_url
    ? {
        backgroundImage: `url(${config.hero_imagen_fondo_url})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { backgroundColor: acento }

  // En mobile el posicionamiento absoluto de los grupos se reemplaza por
  // un layout flex vertical, por eso solo se aplica en sm:
  const posContenido = resolvePosClasses(config.hero_pos_contenido)
  const posLogo      = resolvePosClasses(config.hero_pos_logo)

  const logoFallback = (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold"
      style={{ backgroundColor: "oklch(0.18 0.02 40)", color: acento, fontFamily: "var(--font-playfair)" }}
    >
      {config.restaurante_nombre?.charAt(0) ?? "R"}
    </div>
  )

  return (
    <section
      // mobile: min-h-svh para llenar toda la pantalla sin overflow
      // desktop: 85vh igual que antes
      className="relative isolate overflow-hidden min-h-svh sm:min-h-[85vh]"
      style={heroStyle}
    >
      {/* Overlay */}
      {config.hero_imagen_fondo_url && (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: `${acento}BF` }} aria-hidden="true" />
      )}

      {/* Textura */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
        aria-hidden="true"
      />

      {/* Toggle — siempre top-right, con padding suficiente para no solapar contenido */}
      <div className="absolute right-4 top-4 z-20">
        <DarkToggle />
      </div>

      {/* ─── MOBILE: layout vertical apilado (flex-col) ─────────────────────────
          ─── DESKTOP (sm+): los dos grupos vuelven a ser absolute como antes ─── */}

      {/* GRUPO A: texto principal
          mobile  → posición estática, apilado arriba, padding generoso
          desktop → absolute con posContenido igual que antes */}
      <div
        className={
          // mobile: ocupa el espacio disponible empujando el logo hacia abajo
          // pointer-events-none solo en sm+ porque en mobile el layout es normal
          "relative z-10 flex flex-col justify-center "
          + "px-6 pt-16 pb-4 "
          // en sm+ volvemos al posicionamiento absoluto original
          + `sm:absolute sm:inset-0 sm:flex sm:px-8 sm:py-16 sm:pointer-events-none sm:${posContenido}`
        }
      >
        <div className="flex max-w-sm flex-col gap-5 sm:gap-6 sm:pointer-events-auto">
          {config.hero_etiqueta_superior && (
            <p
              className="font-sans text-xs sm:text-sm font-light tracking-[0.5em] uppercase"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.7)" }}
            >
              {config.hero_etiqueta_superior}
            </p>
          )}

          <div>
            {/* Título: fluid type entre 2.5rem (mobile) y 5rem (desktop) */}
            <h1
              className="font-serif font-medium leading-tight text-balance"
              style={{
                fontSize: "clamp(2.5rem, 5vw + 1rem, 5rem)",
                color: "var(--hero-ink)",
              }}
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

          {/* CTA — visible sin scroll en mobile gracias al layout flex-col */}
          <a
            href={ctaHref}
            className="w-fit rounded-none border px-8 sm:px-10 py-3 text-xs font-light uppercase tracking-[0.35em] transition-opacity hover:opacity-70"
            style={{ borderColor: "oklch(from var(--hero-ink) l c h / 0.6)", color: "var(--hero-ink)" }}
          >
            {config.restaurante_boton_hero}
          </a>
        </div>
      </div>

      {/* GRUPO B: logo + pertenencia
          mobile  → fijo al fondo de la sección, centrado
          desktop → absolute con posLogo igual que antes */}
      <div
        className={
          // mobile: al fondo del flex-col, centrado horizontalmente
          "relative z-10 flex justify-center pb-10 pt-4 "
          // desktop: vuelve al absolute posicionado
          + `sm:absolute sm:inset-0 sm:flex sm:px-8 sm:py-16 sm:pointer-events-none sm:${posLogo}`
        }
      >
        <div className="flex flex-col items-center gap-2 sm:pointer-events-auto">
          {config.restaurante_logo_url
            ? <LogoWithFallback
                src={config.restaurante_logo_url}
                alt={config.restaurante_nombre}
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                fallback={logoFallback}
              />
            : logoFallback
          }

          {/* Pertenencia:
              mobile  → visible (ya no hay riesgo de solapamiento porque está al fondo)
              desktop → igual que antes */}
          {mostrarParteDe && tienePertenencia && (
            <p
              className="font-sans text-xs uppercase tracking-[0.25em] text-center max-w-[200px] sm:max-w-none"
              style={{ color: "oklch(from var(--hero-ink) l c h / 0.55)" }}
            >
              Parte de{" "}
              {config.hosteria_url
                ? <a href={config.hosteria_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.hosteria_nombre}</a>
                : config.hosteria_nombre
              }
              {config.empresa_nombre && (
                <>
                  {" \u00b7 "}
                  {config.empresa_url
                    ? <a href={config.empresa_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{config.empresa_nombre}</a>
                    : config.empresa_nombre
                  }
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Flecha scroll — se oculta en mobile para no solapar el contenido apilado */}
      {config.hero_etiqueta_scroll && (
        <div
          aria-hidden="true"
          className="hidden sm:flex absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex-col items-center gap-1"
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
    </section>
  )
}
