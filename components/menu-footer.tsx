import type { SiteConfig } from "@/lib/get-config"
import { LogoWithFallback } from "@/components/logo-with-fallback"

interface MenuFooterProps {
  config: SiteConfig
}

export function MenuFooter({ config }: MenuFooterProps) {
  // Pertenencia: solo se muestra si la celda vale explícitamente "true"
  const mostrarParteDe   = config.mostrar_pertenencia === "true"
  const tienePertenencia = config.hosteria_nombre || config.empresa_nombre
  const horarios = config.restaurante_footer_horarios
    ? config.restaurante_footer_horarios.split("|").map((h) => h.trim())
    : []
  const acento = config.color_marca || "#E8B84B"

  const empresaLogoFallback = (
    <div
      className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
      style={{ borderColor: acento, color: acento }}
    >
      {config.hosteria_nombre?.charAt(0) ?? "H"}
    </div>
  )

  return (
    <footer className="border-t border-border bg-background">

      {/* Banda superior: visible si hay hostería o empresa Y mostrar_pertenencia=true */}
      {mostrarParteDe && tienePertenencia && (
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-8 py-6">
            <span className="font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              {config.restaurante_nombre} Restaurante
            </span>

            {config.empresa_logo_url ? (
              <LogoWithFallback
                src={config.empresa_logo_url}
                alt={config.empresa_nombre || config.hosteria_nombre}
                className="h-12 w-auto object-contain"
                fallback={empresaLogoFallback}
              />
            ) : (
              empresaLogoFallback
            )}

            <span className="font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              Parte de {config.hosteria_nombre}
            </span>
          </div>
        </div>
      )}

      {/* Grid de info */}
      <div className="mx-auto grid max-w-4xl gap-10 px-8 py-14 sm:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            {config.restaurante_nombre}
          </h2>
          {config.restaurante_descripcion && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {config.restaurante_descripcion}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
            Horarios
          </h3>
          {horarios.length > 0 ? (
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {horarios.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Consultar horarios</p>
          )}
        </div>

        <div>
          <h3 className="font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
            Contacto
          </h3>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {config.restaurante_footer_direccion && (
              <li>{config.restaurante_footer_direccion}</li>
            )}
            {config.restaurante_footer_telefono && (
              <li>
                <a href={`tel:${config.restaurante_footer_telefono.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {config.restaurante_footer_telefono}
                </a>
              </li>
            )}
            {config.restaurante_footer_email && (
              <li>
                <a href={`mailto:${config.restaurante_footer_email}`} className="hover:text-foreground">
                  {config.restaurante_footer_email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {config.restaurante_nombre}
        {config.empresa_nombre && (
          <span>
            {" · "}
            {config.empresa_url ? (
              <a href={config.empresa_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                {config.empresa_nombre}
              </a>
            ) : config.empresa_nombre}
          </span>
        )}
        . Todos los derechos reservados.
      </div>
    </footer>
  )
}
