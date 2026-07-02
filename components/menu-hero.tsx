import type { SiteConfig } from "@/lib/get-config"

interface MenuHeroProps {
  config: SiteConfig
}

export function MenuHero({ config }: MenuHeroProps) {
  const mostrarPertenencia = config.mostrar_pertenencia !== "false" && config.hosteria_nombre

  return (
    <section className="relative isolate overflow-hidden bg-foreground">
      {config.hero_imagen_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={config.hero_imagen_url}
          alt={config.restaurante_nombre}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        {config.restaurante_subtitulo && (
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-background/70">
            {config.restaurante_subtitulo}
          </p>
        )}
        <h1 className="font-serif text-5xl font-medium leading-tight text-background text-balance sm:text-6xl md:text-7xl">
          {config.restaurante_nombre}
        </h1>
        {config.restaurante_descripcion && (
          <p className="max-w-xl text-pretty leading-relaxed text-background/80">
            {config.restaurante_descripcion}
          </p>
        )}
        {mostrarPertenencia && (
          <p className="text-xs text-background/50">
            Parte de{" "}
            {config.hosteria_url ? (
              <a
                href={config.hosteria_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-background/80"
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
          href="#entrada"
          className="mt-2 rounded-full bg-background px-8 py-3 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-background/90"
        >
          {config.restaurante_boton_hero}
        </a>
      </div>
    </section>
  )
}
