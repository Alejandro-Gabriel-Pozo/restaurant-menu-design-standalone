import { notFound }        from "next/navigation"
import { getTenantBySlug } from "@/lib/tenants"
import { getTenants }      from "@/lib/tenants"
import { getMenu }         from "@/lib/get-menu"
import { getConfig }       from "@/lib/get-config"
import { CartaView }       from "@/components/carta-view"
import { MenuFooter }      from "@/components/menu-footer"
import { buildCssVars }    from "@/lib/utils"

// ISR: regenerar cada hora
export const revalidate = 3600

/**
 * CRÍTICO: permite que slugs no pre-generados en build
 * se resuelvan on-demand en vez de devolver 404.
 * Sin esto, cualquier tenant agregado después del último build
 * da 404 hasta el próximo deploy.
 */
export const dynamicParams = true

/**
 * Pre-genera rutas estáticas para todos los tenants activos.
 * Si MASTER_SHEET_ID no está disponible en build, devuelve []
 * y dynamicParams=true se encarga del resto.
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

  return (
    <main className="min-h-screen bg-background" style={buildCssVars(config.color_marca)}>
      <CartaView menu={menu} config={config} />
      {config.mostrar_footer === "true" && <MenuFooter config={config} />}
    </main>
  )
}
