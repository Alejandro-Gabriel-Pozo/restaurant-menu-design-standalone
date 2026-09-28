import { notFound }        from "next/navigation"
import { getTenantBySlug } from "@/lib/tenants"
import { getTenants }      from "@/lib/tenants"
import { getMenu }         from "@/lib/get-menu"
import { getConfig }       from "@/lib/get-config"
import { CartaView }       from "@/components/carta-view"
import { MenuFooter }      from "@/components/menu-footer"
import { buildCssVars }    from "@/lib/utils"
import { isTruthy }        from "@/lib/hero-utils"

export const revalidate = 3600

export const dynamicParams = true

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

  return (
    <main className="min-h-screen bg-background" style={buildCssVars(config)}>
      <CartaView menu={menu} config={config} />
      {isTruthy(config.mostrar_footer) && <MenuFooter config={config} />}
    </main>
  )
}
