import type { SiteConfig } from "@/lib/get-config"
import { LogoWithFallback } from "@/components/logo-with-fallback"

interface MenuFooterProps {
  config: SiteConfig
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export function MenuFooter({ config }: MenuFooterProps) {
  const mostrarParteDe   = config.mostrar_pertenencia === "true"
  const tienePertenencia = config.hosteria_nombre || config.empresa_nombre
  const horarios = config.restaurante_footer_horarios
    ? config.restaurante_footer_horarios.split("|").map((h) => h.trim())
    : []
  const acento = config.color_marca || ""

  const txtHorarios         = config.footer_texto_horarios
  const txtContacto         = config.footer_texto_contacto
  const txtHorariosFallback = config.footer_texto_horarios_fallback
  const txtParteDe          = config.footer_texto_parte_de
  const txtTipo             = config.footer_texto_tipo

  const mapsUrl = config.restaurante_footer_maps_url
    || (config.restaurante_footer_direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.restaurante_footer_direccion)}`
      : null)

  const instagramUrl = config.restaurante_instagram
    ? `https://instagram.com/${config.restaurante_instagram.replace(/^@/, "")}`
    : null
  const facebookUrl = config.restaurante_facebook
    ? config.restaurante_facebook.startsWith("http")
      ? config.restaurante_facebook
      : `https://facebook.com/${config.restaurante_facebook}`
    : null
  const whatsappUrl = config.restaurante_whatsapp
    ? `https://wa.me/${config.restaurante_whatsapp.replace(/\D/g, "")}`
    : null

  const redes = [
    instagramUrl && { href: instagramUrl, label: "Instagram", icon: <IconInstagram /> },
    facebookUrl  && { href: facebookUrl,  label: "Facebook",  icon: <IconFacebook /> },
    whatsappUrl  && { href: whatsappUrl,  label: "WhatsApp",  icon: <IconWhatsApp /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  const empresaLogoFallback = (
    <div
      className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
      style={acento
        ? { borderColor: acento, color: acento }
        : { borderColor: "currentColor", color: "currentColor" }
      }
    >
      {config.hosteria_nombre?.charAt(0) ?? "H"}
    </div>
  )

  // Columna de horarios: solo se renderiza si hay etiqueta O datos O fallback
  const tieneBloquHorarios = txtHorarios || horarios.length > 0 || txtHorariosFallback

  // Columna de contacto: solo se renderiza si hay etiqueta O al menos un dato
  const tieneDatosContacto =
    config.restaurante_footer_direccion ||
    config.restaurante_footer_telefono  ||
    config.restaurante_footer_email
  const tieneBloquContacto = txtContacto || tieneDatosContacto

  return (
    <footer className="border-t border-border bg-background">

      {/* Banda de pertenencia */}
      {mostrarParteDe && tienePertenencia && (
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-8 py-6">
            <span className="font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              {config.restaurante_nombre}{txtTipo ? ` ${txtTipo}` : ""}
            </span>
            {config.empresa_logo_url ? (
              <LogoWithFallback
                src={config.empresa_logo_url}
                alt={config.empresa_nombre || config.hosteria_nombre}
                className="h-12 w-auto object-contain"
                fallback={empresaLogoFallback}
              />
            ) : empresaLogoFallback}
            <span className="font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              {txtParteDe ? `${txtParteDe} ` : ""}{config.hosteria_nombre}
            </span>
          </div>
        </div>
      )}

      {/* Grid principal */}
      <div className="mx-auto grid max-w-4xl gap-10 px-8 py-14 sm:grid-cols-3">

        {/* Col 1: identidad + redes */}
        <div>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            {config.restaurante_nombre}
          </h2>
          {config.restaurante_descripcion && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {config.restaurante_descripcion}
            </p>
          )}
          {redes.length > 0 && (
            <div className="mt-5 flex items-center gap-4">
              {redes.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Col 2: horarios — no renderiza si no hay nada que mostrar */}
        {tieneBloquHorarios && (
          <div>
            {txtHorarios && (
              <h3 className="font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
                {txtHorarios}
              </h3>
            )}
            {horarios.length > 0 ? (
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {horarios.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            ) : txtHorariosFallback ? (
              <p className="mt-4 text-sm text-muted-foreground">{txtHorariosFallback}</p>
            ) : null}
          </div>
        )}

        {/* Col 3: contacto — no renderiza si no hay nada que mostrar */}
        {tieneBloquContacto && (
          <div>
            {txtContacto && (
              <h3 className="font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
                {txtContacto}
              </h3>
            )}
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {config.restaurante_footer_direccion && (
                <li>
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 hover:text-primary transition-colors group"
                    >
                      <span className="mt-0.5 shrink-0 text-primary/60 group-hover:text-primary transition-colors">
                        <IconMapPin />
                      </span>
                      <span className="underline underline-offset-2 decoration-dotted">
                        {config.restaurante_footer_direccion}
                      </span>
                    </a>
                  ) : (
                    config.restaurante_footer_direccion
                  )}
                </li>
              )}
              {config.restaurante_footer_telefono && (
                <li>
                  <a
                    href={`tel:${config.restaurante_footer_telefono.replace(/\s/g, "")}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {config.restaurante_footer_telefono}
                  </a>
                </li>
              )}
              {config.restaurante_footer_email && (
                <li>
                  <a
                    href={`mailto:${config.restaurante_footer_email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {config.restaurante_footer_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </footer>
  )
}
