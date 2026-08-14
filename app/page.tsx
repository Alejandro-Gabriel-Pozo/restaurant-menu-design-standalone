import Link           from "next/link"
import { getTenants } from "@/lib/tenants"
import { getConfig }  from "@/lib/get-config"
import { getMenu }    from "@/lib/get-menu"
import { MenuClient } from "@/components/menu-client"
import { buildCssVars } from "@/lib/utils"

export const revalidate = 0   // DEBUG: sin cache

function extractUrl(raw: string): string {
  if (!raw) return ""
  const s = raw.trim()
  const md = s.match(/\[.*?\]\((.+?)\)/)
  if (md) return md[1].trim()
  const paren = s.match(/^\((.+)\)$/)
  if (paren) return paren[1].trim()
  return s
}

export default async function HomePage() {
  const tenants = await getTenants()

  // ── Modo single ────────────────────────────────────────────────────────
  if (tenants.length === 0) {
    const [menu, config] = await Promise.all([getMenu(), getConfig()])
    return (
      <main className="min-h-screen bg-background" style={buildCssVars(config)}>
        <MenuClient menu={menu} config={config} />
      </main>
    )
  }

  // ── Modo multi ──────────────────────────────────────────────────────────
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

  // DEBUG — ver en Vercel logs
  console.log("[portal] bgImage:", JSON.stringify(bgImage))
  console.log("[portal] portal_bg_image_url raw:", JSON.stringify(rootConfig.portal_bg_image_url))
  console.log("[portal] tenants pos sample:", JSON.stringify(
    tenants.map(t => ({ id: t.tenant_id, pos_x: t.pos_x, pos_y: t.pos_y, pos_w: t.pos_w, pos_h: t.pos_h }))
  ))

  const hasCoords = tenants.every(
    (t) =>
      t.pos_x !== undefined &&
      t.pos_y !== undefined &&
      t.pos_w !== undefined &&
      t.pos_h !== undefined
  )

  console.log("[portal] hasCoords:", hasCoords, "bgImage truthy:", !!bgImage)

  return (
    <main
      className="relative min-h-screen"
      style={{ ...buildCssVars(rootConfig), backgroundColor: fondoDia }}
    >
      <style>{`
        .portal-card:hover .portal-card-label {
          color: var(--portal-card-color-hover, var(--portal-card-color, inherit)) !important;
        }
        .portal-card:hover {
          border-color: var(--portal-card-border-hover, var(--portal-card-border, transparent)) !important;
          box-shadow: 0 6px 20px oklch(0 0 0 / 0.22) !important;
        }
      `}</style>

      {/* Header */}
      <header
        className="relative z-20 border-b border-border/50 px-6 py-4"
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

      {/* Título */}
      {(etiqueta || titulo) && (
        <section className="px-6 pb-2 pt-8">
          {etiqueta && (
            <p
              className="mb-1 font-sans text-xs font-light uppercase tracking-[0.4em]"
              style={{ color: "var(--portal-etiqueta-color, var(--color-primary))" }}
            >
              {etiqueta}
            </p>
          )}
          {titulo && (
            <h1
              className="font-serif text-2xl font-medium leading-tight sm:text-3xl"
              style={{ color: "var(--portal-titulo-color, var(--foreground))" }}
            >
              {titulo}
            </h1>
          )}
        </section>
      )}

      {/* Mapa con cards — mismo layout mobile y desktop */}
      {bgImage && hasCoords ? (
        <section className="relative mx-auto w-full px-4 pb-10 pt-4" style={{ maxWidth: "600px" }}>
          <div className="relative w-full" style={{ aspectRatio: "1080/1533" }}>
            {bgOverlay > 0 && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] rounded-xl"
                style={{ backgroundColor: `oklch(0 0 0 / ${bgOverlay})` }}
              />
            )}
            <img
              src={bgImage}
              alt="Mapa de sucursales"
              width={1080}
              height={1533}
              className="absolute inset-0 h-full w-full rounded-xl object-cover"
              loading="eager"
            />
            {tenants.map((t) => (
              <Link
                key={t.tenant_id}
                href={`/carta/${t.tenant_id}`}
                className="portal-card group absolute z-10 flex items-center justify-between overflow-hidden rounded-md border backdrop-blur-sm transition-all active:scale-[0.97]"
                style={{
                  left:      `${t.pos_x}%`,
                  top:       `${t.pos_y}%`,
                  width:     `${t.pos_w}%`,
                  height:    `${t.pos_h}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "var(--portal-card-bg)",
                  borderColor:     "var(--portal-card-border)",
                  padding: "0 2% 0 3%",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="portal-card-label truncate font-serif font-medium leading-tight transition-colors"
                    style={{
                      color:    "var(--portal-card-color)",
                      fontSize: "clamp(0.6rem, 1.8vw, 0.95rem)",
                    }}
                  >
                    {t.label}
                  </p>
                  {t.notas && (
                    <p
                      className="truncate"
                      style={{
                        color:    "var(--portal-card-notas-color, var(--muted-foreground))",
                        fontSize: "clamp(0.5rem, 1.2vw, 0.75rem)",
                      }}
                    >
                      {t.notas}
                    </p>
                  )}
                </div>
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--portal-card-flecha-color)", marginLeft: "2%" }}
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-xl px-6 py-6">
          <ul className="grid gap-3" role="list">
            {tenants.map((t) => (
              <li key={t.tenant_id}>
                <Link
                  href={`/carta/${t.tenant_id}`}
                  className="portal-card group flex items-center justify-between rounded-xl border shadow-sm transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--portal-card-bg)",
                    borderColor:     "var(--portal-card-border)",
                  }}
                >
                  <div className="flex flex-1 items-center justify-between px-5 py-4">
                    <div>
                      <p
                        className="portal-card-label font-serif text-lg font-medium transition-colors"
                        style={{ color: "var(--portal-card-color)" }}
                      >
                        {t.label}
                      </p>
                      {t.notas && (
                        <p
                          className="mt-0.5 text-xs"
                          style={{ color: "var(--portal-card-notas-color, var(--muted-foreground))" }}
                        >
                          {t.notas}
                        </p>
                      )}
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.75"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--portal-card-flecha-color)" }}
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
      )}

      {/* Footer */}
      {copyright && (
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          {copyright}
        </footer>
      )}
    </main>
  )
}
