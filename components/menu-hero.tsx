import type { SiteConfig } from "@/lib/get-config"

interface MenuHeroProps {
  config: SiteConfig
}

export function MenuHero({ config }: MenuHeroProps) {
  const mostrarParteDe = config.mostrar_pertenencia !== "false"
  const tienePertenencia = config.hosteria_nombre || config.empresa_nombre
  const acento = config.hero_color_fondo || "#E8B84B"

  const heroStyle = config.hero_imagen_fondo_url
    ? {
        backgroundImage: `url(${config.hero_imagen_fondo_url})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { backgroundColor: acento }

  return (
    <section
      className="relative isolate overflow-hidden"
      style={heroStyle}
    >
      {/* Overlay de color — solo cuando hay imagen de fondo */}
      {config.hero_imagen_fondo_url && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: `${acento}BF` }}
          aria-hidden="true"
        />
      )}

      {/* Textura de papel sutil */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Arco decorativo — esquina superior derecha */}
      <div className="absolute right-0 top-0 z-0 h-56 w-56 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -right-10 -top-10 h-52 w-52 rounded-full border-[28px]"
          style={{ borderColor: "oklch(0.97 0.015 88 / 0.55)" }}
        />
      </div>

      {/* Contenido — z-10 para quedar sobre overlay y textura */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-sm flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <p
          className="font-sans text-sm font-light tracking-[0.5em] uppercase"
          style={{ color: "oklch(0.18 0.02 40 / 0.7)" }}
        >
          Menú
        </p>

        {config.restaurante_logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.restaurante_logo_url}
            alt={config.restaurante_nombre}
            className="h-16 w-16 object-contain"
          />
        ) : (
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
        )}

        <div>
          <h1
            className="font-serif text-5xl font-medium leading-tight text-balance sm:text-6xl"
            style={{ color: "oklch(0.18 0.02 40)" }}
          >
            {config.restaurante_nombre}
          </h1>
          {config.restaurante_subtitulo && (
            <p
              className="mt-2 font-sans text-xs font-light uppercase tracking-[0.3em]"
              style={{ color: "oklch(0.18 0.02 40 / 0.6)" }}
            >
              {config.restaurante_subtitulo}
            </p>
          )}
        </div>

        {config.restaurante_descripcion && (
          <p
            className="max-w-xs text-pretty text-sm leading-relaxed"
            style={{ color: "oklch(0.18 0.02 40 / 0.75)" }}
          >
            {config.restaurante_descripcion}
          </p>
        )}

        {tienePertenencia && (
          <p
            className="font-sans text-xs uppercase tracking-[0.25em]"
            style={{ color: "oklch(0.18 0.02 40 / 0.55)" }}
          >
            {mostrarParteDe && "Parte de "}{
              config.hosteria_url ? (
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
              )
            }
            {config.empresa_nombre && ` · ${config.empresa_nombre}`}
          </p>
        )}

        <a
          href="#entrada"
          className="mt-2 rounded-none border px-10 py-3 text-xs font-light uppercase tracking-[0.35em] transition-colors hover:opacity-80"
          style={{
            borderColor: "oklch(0.18 0.02 40 / 0.6)",
            color: "oklch(0.18 0.02 40)",
          }}
        >
          {config.restaurante_boton_hero}
        </a>
      </div>
    </section>
  )
}
