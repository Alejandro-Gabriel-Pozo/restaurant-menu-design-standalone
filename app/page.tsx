import Link                     from "next/link"
import { getSucursalesActivas } from "@/lib/sucursales"
import { getConfig }            from "@/lib/get-config"
import { getMenu }              from "@/lib/get-menu"
import { MenuClient }           from "@/components/menu-client"

export const revalidate = 3600

function buildCssVars(color_marca?: string): React.CSSProperties {
  if (!color_marca) return {}
  return {
    ["--primary" as string]: color_marca,
    ["--ring" as string]:    color_marca,
  }
}

/**
 * Página raíz.
 *
 * — Si la hoja "Sucursales" tiene entradas activas → landing multisucursal.
 * — Si no hay sucursales (hoja vacía / no existe / todas inactivas)
 *   → comportamiento original: carta de la sucursal raíz (sin cambios).
 */
export default async function HomePage() {
  const sucursales = await getSucursalesActivas()

  // ── Modo single ────────────────────────────────────────────────────────────────
  if (sucursales.length === 0) {
    const [menu, config] = await Promise.all([getMenu(), getConfig()])
    return (
      <main className="min-h-screen bg-background" style={buildCssVars(config.color_marca)}>
        <MenuClient menu={menu} config={config} />
      </main>
    )
  }

  // ── Modo multi ─────────────────────────────────────────────────────────────────
  const rootConfig = await getConfig()
  const empresa    = rootConfig.empresa_nombre   || rootConfig.restaurante_nombre || ""
  const logoUrl    = rootConfig.empresa_logo_url || rootConfig.restaurante_logo_url || ""
  const acento     = rootConfig.color_marca || ""

  return (
    <main
      className="min-h-screen bg-background"
      style={buildCssVars(acento)}
    >
      {/* Header */}
      <header className="border-b border-border/50 px-8 py-6">
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
            <span className="font-serif text-xl font-medium text-foreground">
              {empresa}
            </span>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-8 pb-4 pt-16">
        <p className="mb-2 font-sans text-xs font-light uppercase tracking-[0.4em] text-primary">
          Nuestros restaurantes
        </p>
        <h1 className="font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          ¿Dónde estás hoy?
        </h1>
      </section>

      {/* Grid de sucursales */}
      <section className="mx-auto max-w-4xl px-8 py-10">
        <ul
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}
          role="list"
        >
          {sucursales.map((suc) => (
            <li key={suc.slug}>
              <Link
                href={`/carta/${suc.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-6 py-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
              >
                <div>
                  <p className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                    {suc.label}
                  </p>
                  {suc.notas && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{suc.notas}</p>
                  )}
                </div>
                <svg
                  width="18" height="18"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer mínimo */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {empresa}
        {rootConfig.footer_texto_derechos
          ? ` · ${rootConfig.footer_texto_derechos}`
          : ""}
      </footer>
    </main>
  )
}
