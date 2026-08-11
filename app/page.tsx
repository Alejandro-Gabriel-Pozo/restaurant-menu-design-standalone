import Link             from "next/link"
import { getTenants }   from "@/lib/tenants"
import { getConfig }    from "@/lib/get-config"
import { getMenu }      from "@/lib/get-menu"
import { MenuClient }   from "@/components/menu-client"
import { buildCssVars } from "@/lib/utils"
import { sanitizeCssColor } from "@/lib/hero-utils"

export const revalidate = 3600

export default async function HomePage() {
  const tenants = await getTenants()

  // ── Modo single ──────────────────────────────────────────────────────────────
  if (tenants.length === 0) {
    const [menu, config] = await Promise.all([getMenu(), getConfig()])
    return (
      <main className="min-h-screen bg-background" style={buildCssVars(config.color_marca)}>
        <MenuClient menu={menu} config={config} />
      </main>
    )
  }

  // ── Modo multi: leer config del portal ─────────────────────────────────────
  const portalSheetId =
    process.env.ROOT_SHEET_ID ||
    process.env.MASTER_SHEET_ID ||
    process.env.MENU_SHEET_ID

  const rootConfig = await getConfig(portalSheetId).catch(
    () => ({} as Awaited<ReturnType<typeof getConfig>>)
  )

  const empresa           = rootConfig.empresa_nombre   || rootConfig.restaurante_nombre   || ""
  const logoUrl           = rootConfig.empresa_logo_url || rootConfig.restaurante_logo_url || ""
  const acento            = rootConfig.color_marca || ""
  const etiqueta          = rootConfig.portal_etiqueta || ""
  const titulo            = rootConfig.portal_titulo   || ""
  const tituloColor       = sanitizeCssColor(rootConfig.portal_titulo_color || "")
  const cardColor         = sanitizeCssColor(rootConfig.portal_card_color || "")
  const cardColorHover    = sanitizeCssColor(rootConfig.portal_card_color_hover || "")
  const cardBorderHover   = sanitizeCssColor(rootConfig.portal_card_border_hover || "")
  const headerBg          = sanitizeCssColor(rootConfig.portal_header_bg || "")
  const headerColor       = sanitizeCssColor(rootConfig.portal_header_color || "")
  const etiquetaColor     = sanitizeCssColor(rootConfig.portal_etiqueta_color || "")
  const cardBg            = sanitizeCssColor(rootConfig.portal_card_bg || "")
  const cardBorder        = sanitizeCssColor(rootConfig.portal_card_border || "")
  const cardNotasColor    = sanitizeCssColor(rootConfig.portal_card_notas_color || "")
  const cardFlechaColor   = sanitizeCssColor(rootConfig.portal_card_flecha_color || "")

  const copyright = rootConfig.footer_texto_derechos
    ? `© ${new Date().getFullYear()} ${rootConfig.footer_texto_derechos}`
    : ""

  const hoverStyles = [
    cardColorHover  && `.portal-card:hover .portal-card-label { color: ${cardColorHover} !important; }`,
    cardBorderHover && `.portal-card:hover { border-color: ${cardBorderHover} !important; }`,
  ].filter(Boolean).join("\n")

  return (
    <main className="min-h-screen bg-background" style={buildCssVars(acento)}>

      {hoverStyles && <style>{hoverStyles}</style>}

      {/* Header */}
      <header
        className="border-b border-border/50 px-8 py-6"
        style={{
          ...(headerBg    ? { backgroundColor: headerBg } : {}),
          ...(headerColor ? { color: headerColor }         : {}),
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={empresa}
              width={40} height={40}
              className="h-10 w-10 object-contain"
              loading="eager"
            />
          )}
          {empresa && (
            <span
              className="font-serif text-xl font-medium"
              style={headerColor ? { color: headerColor } : undefined}
            >
              {empresa}
            </span>
          )}
        </div>
      </header>

      {/* Hero */}
      {(etiqueta || titulo) && (
        <section className="mx-auto max-w-4xl px-8 pb-4 pt-16">
          {etiqueta && (
            <p
              className="mb-2 font-sans text-xs font-light uppercase tracking-[0.4em]"
              style={{ color: etiquetaColor || "var(--color-primary)" }}
            >
              {etiqueta}
            </p>
          )}
          {titulo && (
            <h1
              className="font-serif text-3xl font-medium leading-tight sm:text-4xl"
              style={tituloColor ? { color: tituloColor } : undefined}
            >
              {titulo}
            </h1>
          )}
        </section>
      )}

      {/* Grid de sucursales */}
      <section className="mx-auto max-w-4xl px-8 py-10">
        <ul
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}
          role="list"
        >
          {tenants.map((t) => (
            <li key={t.tenant_id}>
              <Link
                href={`/carta/${t.tenant_id}`}
                className="portal-card group flex items-center justify-between rounded-xl border shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                style={{
                  ...(cardBg     ? { backgroundColor: cardBg }  : {}),
                  ...(cardBorder ? { borderColor: cardBorder }   : {}),
                }}
              >
                <div className="flex flex-1 items-center justify-between px-6 py-5">
                  <div>
                    <p
                      className="portal-card-label font-serif text-lg font-medium transition-colors"
                      style={cardColor ? { color: cardColor } : undefined}
                    >
                      {t.label}
                    </p>
                    {t.notas && (
                      <p
                        className="mt-0.5 text-xs"
                        style={{ color: cardNotasColor || "var(--color-muted-foreground)" }}
                      >
                        {t.notas}
                      </p>
                    )}
                  </div>
                  <svg
                    width="18" height="18"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    style={cardFlechaColor ? { color: cardFlechaColor } : undefined}
                    aria-hidden
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer — solo si hay texto de derechos explicitamente definido */}
      {copyright && (
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          {copyright}
        </footer>
      )}

    </main>
  )
}
