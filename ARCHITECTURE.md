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
6. Fondo animado + formato de carta (campos de `Config` ya definidos, ver sección 3.3).
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

| Tab | Descripción |
|---|---|
| `Menu` | Una fila por ítem. Ver schema completo en 3.1.1 |
| `Config` | Filas `clave \| valor \| sección`. Ver listado completo en 3.1.2 |

Aislar ambas sheets evita que un error del cliente en su propia sheet rompa el mapeo de tenants o los feature flags de facturación.

**Convención de nombres:** `Menu` y `Config` son nombres de **tab**, fijos en el código (`sheet=Config`, `sheet=Menu` en la URL de gviz) — no varían por sucursal. Lo que sí varía por sucursal es el **archivo** (spreadsheet) que contiene esos dos tabs: un spreadsheet por sucursal, nombrado con el `tenant_id` (ej. archivo `asturias`, con tabs `Menu` y `Config` adentro). El `tenant_id` en la fila de `Tenants` debería ser ese mismo slug (minúsculas, sin espacios). La sheet maestra conviene nombrarla `CARTA — MAESTRA (privado)` para que no se confunda con una sheet de sucursal.

---

#### 3.1.1 Schema completo — Tab `Menu`

Orden de columnas (izquierda a derecha):

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador único del ítem (ej. `entrada-01`). Estable entre ediciones. |
| `orden` | número | Orden de aparición de la categoría. Ítems de la misma categoría comparten `orden`. |
| `categoria` | texto | Nombre de la categoría en español (ej. `Platos Principales`). |
| `categoria_en` | texto | Traducción al inglés de la categoría (ej. `Main Courses`). |
| `titulo_seccion` | texto | Título visual de la sección en español (ej. `Del fuego`). |
| `titulo_seccion_en` | texto | Traducción al inglés del título de sección. |
| `descripcion_seccion` | texto | Descripción de la sección en español. |
| `descripcion_seccion_en` | texto | Traducción al inglés de la descripción de sección. |
| `imagen_seccion_url` | texto | URL de imagen de cabecera de sección (opcional). |
| `platillo` | texto | Nombre del ítem en español. |
| `platillo_en` | texto | Nombre del ítem en inglés. |
| `descripcion` | texto | Descripción del ítem en español. |
| `descripcion_en` | texto | Descripción del ítem en inglés. |
| `precio` | número | Precio en moneda local (sin símbolo). |
| `disponible` | booleano | `TRUE` muestra el ítem, `FALSE` lo oculta sin borrarlo. |
| `tags` | texto | Etiquetas en español, separadas por coma (ej. `Regional, Vegano`). |
| `tags_en` | texto | Etiquetas en inglés, separadas por coma (ej. `Local, Vegan`). |
| `especial` | booleano | `TRUE` aplica destacado visual al ítem. |

**Regla de i18n en `getMenu(sheetId, lang)`:** si `lang === 'en'` y el campo `_en` no está vacío, se usa el valor `_en`; si está vacío, cae al valor en español como fallback — nunca se muestra vacío.

---

#### 3.1.2 Schema completo — Tab `Config`

Tres columnas: `clave | valor | sección` (la columna `sección` es orientativa para el cliente, no la consume `getConfig()`).

El código ignora cualquier fila cuya `clave` no esté definida en `defaults` — los separadores de sección y filas vacías no rompen nada.

**Criterio de columnas `_en`:** solo los campos que contienen texto visible al visitante del restaurante necesitan par `_en`. Los campos de URL, colores, números, posiciones y switches no se traducen.

##### Sección 1 — Identidad

| Clave | Default | `_en` necesario |
|---|---|---|
| `restaurante_nombre` | `Río Lileo` | ❌ (nombre propio) |
| `restaurante_subtitulo` | `Restaurante · Los Miches, Neuquén` | ✅ `restaurante_subtitulo_en` |
| `restaurante_descripcion` | `Cocina regional neuquina…` | ✅ `restaurante_descripcion_en` |
| `restaurante_boton_hero` | `Ver el menú` | ✅ `restaurante_boton_hero_en` |
| `color_marca` | *(vacío)* | ❌ |
| `theme_color` | *(vacío)* | ❌ |
| `favicon_url` | *(vacío)* | ❌ |
| `restaurante_logo_url` | *(vacío)* | ❌ |

##### Sección 2 — SEO

| Clave | Default | `_en` necesario |
|---|---|---|
| `meta_title` | *(vacío)* | ✅ `meta_title_en` |
| `meta_descripcion` | *(vacío)* | ✅ `meta_descripcion_en` |

##### Sección 3 — Hero / Portada

| Clave | Default | `_en` necesario |
|---|---|---|
| `hero_color_fondo` | *(vacío)* | ❌ |
| `hero_imagen_fondo_url` | *(vacío)* | ❌ |
| `hero_etiqueta_superior` | `Menú` | ✅ `hero_etiqueta_superior_en` |
| `hero_etiqueta_scroll` | `Menú` | ✅ `hero_etiqueta_scroll_en` |
| `hero_ink` | *(vacío)* | ❌ |
| `hero_ink_noche` | *(vacío)* | ❌ |
| `hero_pos_contenido` | `center-right` | ❌ |
| `hero_pos_contenido_mobile` | *(vacío)* | ❌ |
| `hero_pos_logo` | `bottom-right` | ❌ |
| `hero_pos_logo_mobile` | *(vacío)* | ❌ |
| `color_fondo_dia` | *(vacío)* | ❌ |
| `color_fondo_noche` | *(vacío)* | ❌ |

##### Sección 4 — Pertenencia (marca paraguas)

| Clave | Default | `_en` necesario |
|---|---|---|
| `mostrar_pertenencia` | *(vacío)* | ❌ |
| `hosteria_nombre` | *(vacío)* | ❌ (nombre propio) |
| `hosteria_url` | *(vacío)* | ❌ |
| `hosteria_descripcion` | *(vacío)* | ✅ `hosteria_descripcion_en` |
| `empresa_nombre` | *(vacío)* | ❌ (nombre propio) |
| `empresa_url` | *(vacío)* | ❌ |
| `empresa_logo_url` | *(vacío)* | ❌ |

##### Sección 5 — Contacto / Footer

| Clave | Default | `_en` necesario |
|---|---|---|
| `restaurante_footer_direccion` | `Ruta 43, Los Miches, Neuquén` | ❌ (dirección física) |
| `restaurante_footer_maps_url` | *(vacío)* | ❌ |
| `restaurante_footer_telefono` | *(vacío)* | ❌ |
| `restaurante_footer_email` | *(vacío)* | ❌ |
| `restaurante_footer_horarios` | *(vacío)* | ✅ `restaurante_footer_horarios_en` |
| `restaurante_instagram` | *(vacío)* | ❌ |
| `restaurante_facebook` | *(vacío)* | ❌ |
| `restaurante_whatsapp` | *(vacío)* | ❌ |

##### Sección 6 — Layout de carta

Todos los campos de esta sección son valores de posición, tamaño o modo — sin par `_en`.

`carta_pos_bloque` · `carta_pos_cta` · `carta_banda_alto_mobile` · `carta_banda_alto_desktop` · `carta_imagen_modo` · `carta_imagen_ancho_mobile` · `carta_imagen_ancho_desktop` · `carta_imagen_pos_x` · `carta_imagen_pos_y` · `carta_imagen_overlay` · `carta_imagen_opacidad`

##### Sección 7 — Tipografías

Todos valores CSS de tamaño de fuente — sin par `_en`.

`carta_fuente_banda_etiqueta` · `carta_fuente_banda_titulo` · `carta_fuente_banda_descripcion` · `carta_fuente_item_nombre` · `carta_fuente_item_precio` · `carta_fuente_item_descripcion` · `carta_fuente_item_tags` · `carta_fuente_portada_etiqueta` · `carta_fuente_portada_nombre` · `carta_fuente_portada_subtitulo` · `carta_fuente_portada_descripcion` · `carta_fuente_portada_cta` · `carta_fuente_indice_etiqueta` · `carta_fuente_indice_titulo` · `carta_fuente_indice_numero` · `carta_fuente_indice_categoria` · `carta_fuente_indice_item`

##### Sección 8 — Textos fijos

Todos los textos fijos visibles al visitante llevan par `_en`.

| Clave | Default ES | Clave `_en` |
|---|---|---|
| `carta_texto_portada_cta` | `Deslizá para ver la carta` | `carta_texto_portada_cta_en` |
| `carta_texto_portada_separador` | `✦` | ❌ (símbolo universal) |
| `carta_texto_indice_etiqueta` | `Índice` | `carta_texto_indice_etiqueta_en` |
| `carta_texto_indice_titulo` | `La carta` | `carta_texto_indice_titulo_en` |
| `footer_texto_horarios` | `Horarios` | `footer_texto_horarios_en` |
| `footer_texto_contacto` | `Contacto` | `footer_texto_contacto_en` |
| `footer_texto_horarios_fallback` | `Consultar horarios` | `footer_texto_horarios_fallback_en` |
| `footer_texto_parte_de` | `Parte de` | `footer_texto_parte_de_en` |
| `footer_texto_tipo` | `Restaurante` | `footer_texto_tipo_en` |
| `footer_texto_derechos` | `Todos los derechos reservados.` | `footer_texto_derechos_en` |

##### Sección 9 — Fondo animado / Formato *(fuera de alcance activo — campos en sheet desde ahora)*

| Clave | Valores válidos | Default |
|---|---|---|
| `hero_fondo_tipo` | `estatico` \| `gradiente` \| `particulas` \| `video` | `estatico` |
| `hero_fondo_velocidad` | `lento` \| `medio` \| `rapido` | `medio` |
| `hero_fondo_gradiente_colores` | lista separada por comas | *(vacío)* |
| `hero_fondo_particulas_tipo` | `brasas` \| `hojas` \| `nieve` \| `vapor` | *(vacío)* |
| `hero_fondo_video_url` | URL | *(vacío)* |
| `carta_formato` | `scroll` \| `paginado` \| `grid` \| `tabs` | `scroll` |
| `carta_formato_grid_columnas_desktop` | `2`–`4` | `3` |
| `carta_formato_grid_columnas_mobile` | `1`–`2` | `1` |
| `carta_formato_paginado_efecto` | `hoja` \| `slide` | `hoja` |
| `carta_schema_version` | número | `1` |

Fallbacks: si `hero_fondo_tipo=video` y `hero_fondo_video_url` está vacío, cae a `estatico`. `prefers-reduced-motion` del visitante siempre gana sobre la config (no es configurable por negocio, es accesibilidad).

---

**Orden/agrupación de claves en `Config`:** el código ignora cualquier fila cuya clave no esté en `defaults`, así que separadores y encabezados de sección no rompen nada. La columna `sección` (C) sirve para que el cliente filtre la sheet sin entender los prefijos — no la consume `getConfig()`.

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

### 3.3 Rutas

El dominio resuelve el tenant (middleware); `[locale]` resuelve el idioma dentro de ese tenant:

```
negocio-a.dominio.com/carta          (es, default)
negocio-a.dominio.com/en/carta       (en, indexable)
negocio-a.dominio.com/carta-demo
```

### 3.4 Feature flags

Cada feature nueva (carrito, mesero, inglés, fondo animado) se resuelve server-side vía `getFeatures(tenantId)` y se envuelve en el componente correspondiente (`if (!features.carrito_whatsapp) return null`). Nunca se resuelve client-side, para que no sea trivial de bypassear inspeccionando el JS.

### 3.5 Carrito compartido (WhatsApp / mesero)

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

**Fuera de alcance por ahora** (documentado en 3.3–3.5 como referencia futura, no roadmap activo): campos de fondo animado + formato, carrito compartido (WhatsApp/mesero), feature flags por plan, librería privada.

## 5. Decisiones abiertas

- `app/page.tsx` / `MenuClient`: ¿se descarta o se define su rol?
- `carta-demo`: ¿sheet propia de demo (`DEMO_SHEET_ID`) o mismo tenant que producción en otra ruta?
- Persistencia del idioma elegido (cookie) entre visitas — a definir.
- Resolución de tenant por dominio vs. por path — si en el futuro se necesita path, revisar orden de segmentos con `[locale]`.
