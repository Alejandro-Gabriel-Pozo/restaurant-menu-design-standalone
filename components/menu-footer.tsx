import type { SiteConfig } from "@/lib/get-config"

interface MenuFooterProps {
  config: SiteConfig
}

export function MenuFooter({ config }: MenuFooterProps) {
  const horarios = config.restaurante_footer_horarios
    ? config.restaurante_footer_horarios.split("|").map((h) => h.trim())
    : []

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-3">

        {/* Columna 1: marca */}
        <div>
          <h2 className="font-serif text-2xl font-medium text-card-foreground">
            {config.restaurante_nombre}
          </h2>
          {config.restaurante_descripcion && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {config.restaurante_descripcion}
            </p>
          )}
          {config.hosteria_nombre && (
            <p className="mt-3 text-xs text-muted-foreground">
              Parte de{" "}
              {config.hosteria_url ? (
                <a
                  href={config.hosteria_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {config.hosteria_nombre}
                </a>
              ) : (
                config.hosteria_nombre
              )}
            </p>
          )}
        </div>

        {/* Columna 2: horarios */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Horarios
          </h3>
          {horarios.length > 0 ? (
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {horarios.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Consultar horarios</p>
          )}
        </div>

        {/* Columna 3: contacto */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Contacto
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {config.restaurante_footer_direccion && (
              <li>{config.restaurante_footer_direccion}</li>
            )}
            {config.restaurante_footer_telefono && (
              <li>
                <a
                  href={`tel:${config.restaurante_footer_telefono.replace(/\s/g, "")}`}
                  className="hover:text-foreground"
                >
                  {config.restaurante_footer_telefono}
                </a>
              </li>
            )}
            {config.restaurante_footer_email && (
              <li>
                <a
                  href={`mailto:${config.restaurante_footer_email}`}
                  className="hover:text-foreground"
                >
                  {config.restaurante_footer_email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {config.restaurante_nombre}
        {config.empresa_nombre && (
          <span>
            {" · "}
            {config.empresa_url ? (
              <a
                href={config.empresa_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {config.empresa_nombre}
              </a>
            ) : (
              config.empresa_nombre
            )}
          </span>
        )}
        . Todos los derechos reservados.
      </div>
    </footer>
  )
}
