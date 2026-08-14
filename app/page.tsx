import Link           from "next/link"
import { getTenants } from "@/lib/tenants"
import { getConfig }  from "@/lib/get-config"
import { getMenu }    from "@/lib/get-menu"
import { MenuClient } from "@/components/menu-client"
import { buildCssVars } from "@/lib/utils"
import type React from "react"

export const revalidate = 3600

function extractUrl(raw: string): string {
  if (!raw) return ""
  const s = raw.trim()
  const md = s.match(/\[.*?\]\((.+?)\)/)
  if (md) return md[1].trim()
  const paren = s.match(/^\((.+)\)$/)
  if (paren) return paren[1].trim()
  return s
}

/**
 * Coordenadas de cada tenant sobre el mapa (% desde esquina superior-izquierda).
 * Medidas sobre imagen original 1080×1533 px.
 * El card se ancla en ese punto con transform: translate(-50%, -50%).
 */
const MAP_COORDS: Record<string, { x: number; y: number }> = {
  "manzano-amargo": { x: 15.93, y: 18.40 },
  "varvarco":       { x: 59.07, y: 25.31 },
  "las-ovejas":     { x: 17.59, y: 39.01 },
  "huinganco":      { x: 59.07, y: 47.49 },
  "los-miches":     { x: 15.56, y: 63.60 },
}

export default async function HomePage() {
  const tenants = await getTenants()

  // ── Modo single ──────────────────────────────────────────────────────────────
  if (tenants.length === 0) {
    const [menu, config] = await Promise.all([getMenu(), getConfig()])
    return (
      <main className="min-h-screen bg-background" style={buildCssVars(config)}>
        <MenuClient menu={menu} config={config} />
      </main>
    )
  }

  // ── Modo multi ─────────────────────────────────────────────────────────────
  const portalSheetId =
    process.env.ROOT_SHEET_ID ||
    process.env.MASTER_SHEET_ID ||
    process.env.MENU_SHEET_ID

  const rootConfig = await getConfig(portalSheetId).catch(
    () => ({} as Awaited<ReturnType<typeof getConfig>>)
  )

  const empresa   = rootConfig.empresa_nombre   || rootConfig.restaurante_nombre   || ""
  const logoUrl   = rootConfig.empresa_logo_url || rootConfig.restaurante_logo_url || ""
  const etiqueta  = rootConfig.portal_etiqueta  || ""
  const titulo    = rootConfig.portal_titulo    || ""
  const bgImage   = extractUrl(rootConfig.portal_bg_image_url || "")
  const bgOverlay = Math.max(0, Math.min(1, parseFloat(rootConfig.portal_bg_overlay || "0") || 0))
  const fondoDia  = rootConfig.color_fondo_dia  || "#0f0f0f"
  const copyright = rootConfig.footer_texto_derechos
    ? `© ${new Date().getFullYear()} ${rootConfig.footer_texto_derechos}`
    : ""

  // Fondo mobile: imagen si existe, si no color sólido
  const mobileBg: React.CSSProperties = bgImage
    ? {
        backgroundImage: bgOverlay > 0
          ? `linear-gradient(oklch(0 0 0 / ${bgOverlay}), oklch(0 0 0 / ${bgOverlay})), url(${bgImage})`
          : `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }
    : { backgroundColor: fondoDia }

  return (
    <main
      className="relative min-h-screen"
      style={{ ...buildCssVars(rootConfig), backgroundColor: fondoDia }}
    >
      {/* Hover states */}
      <style>{`
        .portal-card:hover .portal-card-label {
          color: var(--portal-card-color-hover, var(--portal-card-color, inherit)) !important;
        }
        .portal-card:hover {
          border-color: var(--portal-card-border-hover, var(--portal-card-border, transparent)) !important;
          box-shadow: 0 8px 24px oklch(0 0 0 / 0.18) !important;
        }
        /* Mobile: fondo imagen */
        @media (max-width: 767px) {
          .portal-mobile-bg {
            background-image: ${bgImage && bgOverlay > 0
              ? `linear-gradient(oklch(0 0 0 / ${bgOverlay}), oklch(0 0 0 / ${bgOverlay})), url(${bgImage})`
              : bgImage ? `url(${bgImage})` : "none"};
            background-size: cover;
            background-position: center top;
            ${bgImage ? "" : `background-color: ${fondoDia};`}
          }
        }
      `}</style>

      {/* Header */}
      <header
        className="relative z-10 border-b border-border/50 px-8 py-6"
        style={{
          backgroundColor: "var(--portal-header-bg, transparent)",
          color: "var(--portal-header-color)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          {logoUrl && (
            <img src={logoUrl} alt={empresa} width={40} height={40}
              className="h-10 w-10 object-contain" loading="eager" />
          )}
          {empresa && (
            <span className="font-serif text-xl font-medium">{empresa}</span>
          )}
        </div>
      </header>

      {/* ── MOBILE: imagen fondo + grid ──────────────────────────────── */}
      <div className="portal-mobile-bg md:hidden">
        {(etiqueta || titulo) && (
          <section className="px-6 pb-4 pt-12">
            {etiqueta && (
              <p className="mb-2 font-sans text-xs font-light uppercase tracking-[0.4em]"
                style={{ color: "var(--portal-etiqueta-color, var(--color-primary))" }}>
                {etiqueta}
              </p>
            )}
            {titulo && (
              <h1 className="font-serif text-3xl font-medium leading-tight"
                style={{ color: "var(--portal-titulo-color, var(--foreground))" }}>
                {titulo}
              </h1>
            )}
          </section>
        )}
        <section className="px-6 py-8">
          <ul className="grid gap-3" role="list">
            {tenants.map((t) => (
              <li key={t.tenant_id}>
                <Link href={`/carta/${t.tenant_id}`}
                  className="portal-card group flex items-center justify-between rounded-xl border shadow-sm transition-all active:scale-[0.98]"
                  style={{ backgroundColor: "var(--portal-card-bg)", borderColor: "var(--portal-card-border)" }}
                >
                  <div className="flex flex-1 items-center justify-between px-5 py-4">
                    <div>
                      <p className="portal-card-label font-serif text-lg font-medium transition-colors"
                        style={{ color: "var(--portal-card-color)" }}>
                        {t.label}
                      </p>
                      {t.notas && (
                        <p className="mt-0.5 text-xs"
                          style={{ color: "var(--portal-card-notas-color, var(--muted-foreground))" }}>
                          {t.notas}
                        </p>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--portal-card-flecha-color)" }} aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── DESKTOP: mapa con cards posicionados ─────────────────────── */}
      <div className="hidden md:block">
        {(etiqueta || titulo) && (
          <section className="px-12 pb-4 pt-10">
            {etiqueta && (
              <p className="mb-1 font-sans text-xs font-light uppercase tracking-[0.4em]"
                style={{ color: "var(--portal-etiqueta-color, var(--color-primary))" }}>
                {etiqueta}
              </p>
            )}
            {titulo && (
              <h1 className="font-serif text-4xl font-medium leading-tight"
                style={{ color: "var(--portal-titulo-color, var(--foreground))" }}>
                {titulo}
              </h1>
            )}
          </section>
        )}

        {bgImage ? (
          /* Mapa con cards superpuestos */
          <section className="relative mx-auto px-8 pb-12" style={{ maxWidth: "680px" }}>
            {/* Imagen del mapa */}
            <div className="relative w-full" style={{ aspectRatio: "1080/1533" }}>
              {bgOverlay > 0 && (
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl z-[1]"
                  style={{ backgroundColor: `oklch(0 0 0 / ${bgOverlay})`, borderRadius: "12px" }} />
              )}
              <img
                src={bgImage}
                alt="Mapa de sucursales"
                className="h-full w-full rounded-xl object-cover"
                style={{ display: "block" }}
                loading="eager"
              />

              {/* Cards posicionados sobre el mapa */}
              {tenants.map((t) => {
                const coords = MAP_COORDS[t.tenant_id]
                if (!coords) return null
                return (
                  <Link
                    key={t.tenant_id}
                    href={`/carta/${t.tenant_id}`}
                    className="portal-card group absolute z-10 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-md backdrop-blur-sm transition-all active:scale-[0.97]"
                    style={{
                      left: `${coords.x}%`,
                      top:  `${coords.y}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "var(--portal-card-bg)",
                      borderColor: "var(--portal-card-border)",
                      minWidth: "120px",
                      maxWidth: "160px",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="portal-card-label font-serif text-sm font-medium leading-tight truncate transition-colors"
                        style={{ color: "var(--portal-card-color)" }}>
                        {t.label}
                      </p>
                      {t.notas && (
                        <p className="mt-0.5 text-[10px] truncate"
                          style={{ color: "var(--portal-card-notas-color, var(--muted-foreground))" }}>
                          {t.notas}
                        </p>
                      )}
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--portal-card-flecha-color)" }} aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : (
          /* Sin imagen: grid normal en desktop */
          <section className="mx-auto max-w-4xl px-8 py-10">
            <ul className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}
              role="list">
              {tenants.map((t) => (
                <li key={t.tenant_id}>
                  <Link href={`/carta/${t.tenant_id}`}
                    className="portal-card group flex items-center justify-between rounded-xl border shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                    style={{ backgroundColor: "var(--portal-card-bg)", borderColor: "var(--portal-card-border)" }}
                  >
                    <div className="flex flex-1 items-center justify-between px-6 py-5">
                      <div>
                        <p className="portal-card-label font-serif text-lg font-medium transition-colors"
                          style={{ color: "var(--portal-card-color)" }}>
                          {t.label}
                        </p>
                        {t.notas && (
                          <p className="mt-0.5 text-xs"
                            style={{ color: "var(--portal-card-notas-color, var(--muted-foreground))" }}>
                            {t.notas}
                          </p>
                        )}
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                        className="shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: "var(--portal-card-flecha-color)" }} aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Footer */}
      {copyright && (
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          {copyright}
        </footer>
      )}
    </main>
  )
}
