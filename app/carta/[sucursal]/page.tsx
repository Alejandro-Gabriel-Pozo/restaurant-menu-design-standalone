import { notFound }          from "next/navigation"
import { getTenantBySlug }   from "@/lib/tenants"
import { getMenu }            from "@/lib/get-menu"
import { getConfig }          from "@/lib/get-config"
import { CartaView }          from "@/components/carta-view"
import { MenuFooter }         from "@/components/menu-footer"
import { getTenants }         from "@/lib/tenants"

// ISR: regenerar cada hora
export const revalidate = 3600

/**
 * Pre-genera rutas estáticas para todos los tenants activos.
 * Si MASTER_SHEET_ID no está en build, se omite y se usa SSR on-demand.
 */
export async function generateStaticParams() {
  try {
    const tenants = await getTenants()
    return tenants.map((t) => ({ sucursal: t.tenant_id }))
  } catch {
    return []
  }
}

interface Props {
  params: Promise<{ sucursal: string }>
}

export default async function CartaSucursalPage({ params }: Props) {
  const { sucursal } = await params
  const tenant = await getTenantBySlug(sucursal)
  if (!tenant) notFound()

  const [menu, config] = await Promise.all([
    getMenu(tenant.sheet_id, tenant.sheet_name),
    getConfig(tenant.sheet_id),
  ])

  // CSS vars dinámicas de acento para este tenant
  const cssVars = config.color_marca
    ? ({
        "--primary": config.color_marca,
        "--ring":    config.color_marca,
      } as React.CSSProperties)
    : {}

  return (
    <main className="min-h-screen bg-background" style={cssVars}>
      <CartaView menu={menu} config={config} />
      <MenuFooter config={config} />
    </main>
  )
}
