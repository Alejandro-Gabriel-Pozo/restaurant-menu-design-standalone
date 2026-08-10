# Arquitectura — Carta / Menú Online

Este documento registra el estado actual del repo, la arquitectura objetivo acordada y el plan de reestructuración. Se va actualizando a medida que se implementa cada bloque — no es una foto fija.

## 1. Estado actual (auditoría del repo)

- `app/carta` y `app/carta-demo` son hoy **idénticos**: ambos usan `getMenu()` + `getConfig()` + `CartaView`, leyendo una única sheet vía `MENU_SHEET_ID` (env var, single-tenant).
- `app/page.tsx` usa un componente distinto (`MenuClient`) — versión alternativa/vieja, sin decidir si se mantiene o se descarta.
- `lib/get-menu.ts` / `lib/get-config.ts` leen el endpoint público `gviz` de Google Sheets, sin auth, sin locking de escritura.
- Theming ya es 100% data-driven desde la tab `Config` (colores, fuentes, hero, textos) — es, en la práctica, un motor de temas.
- No hay separación de componentes por dispositivo: todo es responsive con clases `md:` mezcladas dentro de los mismos archivos (ej. `carta-view.tsx`, ~355 líneas).
- `revalidate = 3600` (ISR) es el único modelo de renderizado usado hoy.
- Sin conceptos de: tenant, idioma, feature flags, carrito, pedidos.

## 2. Decisiones de producto (qué se va a construir)

Definido con el usuario, en orden de prioridad de implementación:

1. **Multi-tenant** — un mismo deploy sirve N negocios, resuelto por dominio.
2. **Inglés** — con SEO indexable (URL propia) *y* toggle de cambio instantáneo.
3. **Reestructurar el schema de sheets** — separar sheet maestra (control del proveedor) de sheet por negocio (edita el cliente).
4. **Reestructurar el código** en capas (datos / features / layout), incluyendo separar desktop de mobile donde el layout realmente diverge (no solo tamaños).
5. **Feature flags por micro-pago/plan** — habilitar/deshabilitar funciones por cliente desde una sheet que el cliente no controla.
6. Fondo animado + formato de carta (campos de `Config` ya definidos, ver sección 4).
7. Carrito de ítems compartido → WhatsApp (take away) y → Sheets/mesero (salón, sin pasar por cocina directo).
8. Librería privada — empaquetar `get-menu`/`get-config`/theming como paquete versionado para no exponer la lógica en cada repo de cliente.

**Alcance cerrado: solo 1–4.** Los puntos 5–8 (feature flags/micro-pago, fondo animado, carrito, librería privada) quedan fuera del producto por ahora — son capa SaaS/mejoras, no necesarias para el caso de 1 cliente con varias sucursales. Se documentan igual como referencia si en el futuro aparece un cliente externo, pero no forman parte del roadmap activo.

## 3. Arquitectura objetivo

### 3.1 Dos sheets con roles distintos

**Sheet maestra** (`MASTER_SHEET_ID`, controlada por el proveedor, sin acceso del cliente):

| Tab | Columnas |
|---|---|
| `Tenants` | `tenant_id`, `dominio`, `sheet_id`, `sheet_name` |
| `Features` | `tenant_id`, `plan`, `carrito_whatsapp`, `pedido_mesero`, `menu_ingles`, `fondo_animado`, `formato_grid` |

**Sheet por negocio** (una por tenant, la edita el cliente):

| Tab | Columnas |
|---|---|
| `Menu` | `id`, `categoria`, `platillo`, `platillo_en`, `descripcion`, `descripcion_en`, `precio`, `disponible` |
| `Config` | campos existentes (`hero_color_fondo`, `restaurante_whatsapp`, etc.) + pares `_en` para textos fijos + campos nuevos de fondo/formato (ver 3.3) + `carta_schema_version` |

Aislar ambas sheets evita que un error del cliente en su propia sheet rompa el mapeo de tenants o los feature flags de facturación.

**Convención de nombres:** `Menu` y `Config` son nombres de **tab**, fijos en el código (`sheet=Config`, `sheet=Menu` en la URL de gviz) — no varían por sucursal. Lo que sí varía por sucursal es el **archivo** (spreadsheet) que contiene esos dos tabs: un spreadsheet por sucursal, nombrado con el `tenant_id` (ej. archivo `asturias`, con tabs `Menu` y `Config` adentro — no dos archivos `menu-asturias` / `config-asturias` separados). El `tenant_id` en la fila de `Tenants` debería ser ese mismo slug (minúsculas, sin espacios) para que el nombre del archivo en Drive y la fila en la sheet maestra coincidan a simple vista. La sheet maestra en sí conviene nombrarla algo bien distinguible tipo `CARTA — MAESTRA (privado)`, para que nadie la confunda con una sheet de sucursal.

**Orden/agrupación de claves en `Config`:** hoy son ~65 claves en filas `clave | valor`, ya medio agrupadas por comentarios en el código (fuentes banda / items / portada / índice) pero no en la sheet en sí. Conviene extender ese mismo criterio a todo el archivo, en este orden, con una fila de encabezado en negrita entre secciones (el código ignora cualquier fila cuya clave no esté en `defaults`, así que separadores y encabezados no rompen nada):

1. **Identidad** — `restaurante_nombre`, `restaurante_subtitulo`, `restaurante_descripcion`, `restaurante_boton_hero`, `color_marca`, `theme_color`, `favicon_url`, `restaurante_logo_url`
2. **SEO** — `meta_title`, `meta_descripcion`
3. **Hero/portada** — `hero_color_fondo`, `hero_imagen_fondo_url`, `hero_etiqueta_superior`, `hero_etiqueta_scroll`, `hero_ink`, `hero_ink_noche`, `hero_pos_contenido(_mobile)`, `hero_pos_logo(_mobile)`, `color_fondo_dia`, `color_fondo_noche`
4. **Pertenencia** (marca paraguas, si aplica) — `mostrar_pertenencia`, `hosteria_*`, `empresa_*`
5. **Contacto/footer** — `restaurante_footer_*`, `restaurante_instagram`, `restaurante_facebook`, `restaurante_whatsapp`
6. **Layout de carta** — `carta_pos_*`, `carta_banda_*`, `carta_imagen_*`
7. **Tipografías** — `carta_fuente_banda_*`, `carta_fuente_item_*`, `carta_fuente_portada_*`, `carta_fuente_indice_*`
8. **Textos fijos** — `carta_texto_portada_*`, `carta_texto_indice_*`, `footer_texto_*`

Para que sea filtrable por alguien no técnico, sumar una columna `C` de solo lectura humana (`sección`) con estos mismos nombres, no consumida por `getConfig()` — sirve para que el cliente pueda filtrar/ordenar sin tener que entender el prefijo de cada clave.

### 3.2 Capas de código

```
lib/
  tenants.ts      → resolveTenant(host): lee Tenants desde MASTER_SHEET_ID
  features.ts     → getFeatures(tenantId): lee Features, resuelve plan + overrides
  get-menu.ts     → getMenu(sheetId, lang)
  get-config.ts   → getConfig(sheetId, lang)
middleware.ts     → resuelve tenant por host, lo pasa por headers
app/[locale]/carta/page.tsx
app/[locale]/carta-demo/page.tsx
components/
  carta/          → piezas visuales puras (sin fetch)
  carta/desktop/  → solo donde el layout diverge de verdad (no solo clases md:)
  carta/mobile/
```

Regla para separar desktop/mobile: si la diferencia es de tamaño/espaciado, se resuelve con Tailwind responsive dentro del mismo componente. Si es de layout/interacción (ej. índice lateral vs. tabs), recién ahí se justifica un componente propio por variante.

### 3.3 Campos nuevos en `Config` (fondo + formato)

| Campo | Valores | Default |
|---|---|---|
| `hero_fondo_tipo` | `estatico` \| `gradiente` \| `particulas` \| `video` | `estatico` |
| `hero_fondo_velocidad` | `lento` \| `medio` \| `rapido` | `medio` |
| `hero_fondo_gradiente_colores` | lista separada por comas | vacío |
| `hero_fondo_particulas_tipo` | `brasas` \| `hojas` \| `nieve` \| `vapor` | vacío |
| `hero_fondo_video_url` | URL | vacío |
| `carta_formato` | `scroll` \| `paginado` \| `grid` \| `tabs` | `scroll` |
| `carta_formato_grid_columnas_desktop` | 2–4 | 3 |
| `carta_formato_grid_columnas_mobile` | 1–2 | 1 |
| `carta_formato_paginado_efecto` | `hoja` \| `slide` | `hoja` |
| `carta_schema_version` | número | 1 |

Fallbacks: si `hero_fondo_tipo=video` y `hero_fondo_video_url` está vacío, cae a `estatico`. `prefers-reduced-motion` del visitante siempre gana sobre la config (no es configurable por negocio, es accesibilidad).

### 3.4 Rutas

El dominio resuelve el tenant (middleware); `[locale]` resuelve el idioma dentro de ese tenant:

```
negocio-a.dominio.com/carta          (es, default)
negocio-a.dominio.com/en/carta       (en, indexable)
negocio-a.dominio.com/carta-demo
```

### 3.5 Feature flags

Cada feature nueva (carrito, mesero, inglés, fondo animado) se resuelve server-side vía `getFeatures(tenantId)` y se envuelve en el componente correspondiente (`if (!features.carrito_whatsapp) return null`). Nunca se resuelve client-side, para que no sea trivial de bypassear inspeccionando el JS.

### 3.6 Carrito compartido (WhatsApp / mesero)

Un mismo componente de selección de ítems (estado tipo carrito) con dos salidas posibles:

- **Take away** → arma texto y abre `wa.me/<numero>?text=...` usando `restaurante_whatsapp` de `Config`.
- **Salón** → `POST` a un Apps Script Web App separado (tab `Pedidos`, no mezclado con `Menu`/`Config`), con mesa + nombre + ítems. Llega a una vista simple del mesero (polling cada 15–20s), que marca "tomado" — el mesero sigue armando la comanda para cocina como siempre. No requiere tiempo real estricto ni estado de pedido (pendiente/listo).

## 4. Roadmap de implementación

1. Sheet maestra (`Tenants` + `Features`) con el negocio actual cargado.
2. `middleware.ts` + `lib/tenants.ts` — validar con un solo tenant.
3. Migrar `getMenu`/`getConfig` para recibir `sheetId` en vez de leer env var fija.
4. `lib/features.ts` + envolver componentes existentes.
5. `[locale]` + columnas `_en` en `Menu`/`Config`.
6. Reestructuración de `carta-view.tsx` y componentes relacionados en capas datos/layout (aprovechando que ya se están tocando por los puntos 2–5).

**Fuera de alcance por ahora** (documentado en 3.3, 3.5, 3.6 como referencia futura, no roadmap activo): campos de fondo animado + formato, carrito compartido (WhatsApp/mesero), feature flags por plan, librería privada.

## 5. Decisiones abiertas

- `app/page.tsx` / `MenuClient`: ¿se descarta o se define su rol?
- `carta-demo`: ¿sheet propia de demo (`DEMO_SHEET_ID`) o mismo tenant que producción en otra ruta?
- Persistencia del idioma elegido (cookie) entre visitas — a definir.
- Resolución de tenant por dominio vs. por path — si en el futuro se necesita path, revisar orden de segmentos con `[locale]`.
