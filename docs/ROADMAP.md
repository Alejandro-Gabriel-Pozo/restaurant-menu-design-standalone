# Hoja de Ruta — Carta / Menú Online

Checklist de ejecución. Consolida `ARCHITECTURE.md` (datos/tenants/idioma) y `VISUAL-ARCHITECTURE.md` (desktop/mobile) en un único orden práctico. Se va tildando a medida que se aplica cada paso — es el documento que se sigue día a día, los otros dos son la referencia de *por qué* cada paso es así.

Alcance: solo 1–4 (multi-tenant + inglés + sheets + reestructura de código), para 1 cliente con varias sucursales. Nada de carrito, feature flags, librería privada por ahora.

---

## Modelo de resolución de tenant

Tenant resuelto por **slug en URL** (no por host/dominio). Patrón definitivo:

```
/carta              → sucursal por defecto (MENU_SHEET_ID de env)
/carta/[sucursal]   → sucursal dinámica (slug → sheetId desde sheet maestra)
```

---

## Fase 0 — Arreglos visuales ✅ COMPLETA

- [x] Fondo mobile de `carta-section-image.tsx` pasado a `cover`/`no-repeat`/`center` — imagen siempre completa sin tiles ni cortes
- [x] `sizeMobile` eliminada — ya no se usa para el fondo mobile
- [x] `anchoMobile` acotado solo a modo `miniatura`
- [x] Separar `menu-hero.tsx` en: cálculos de config + fragmentos compartidos + bloques desktop + bloques mobile (mismo archivo)
- [x] Separar `carta-view.tsx` de la misma forma: `portadaDesktop` y `portadaMobile` como variables separadas, render limpio

---

## Fase 1 — Sheet maestra

- [ ] Crear spreadsheet nuevo, nombre distinguible (ej. `CARTA — MAESTRA (privado)`), no compartido con clientes
- [ ] Tab `Tenants`: columnas `tenant_id | dominio | sheet_id | sheet_name | activo`
- [ ] Cargar la fila del negocio/sucursal actual como primer tenant
- [ ] Si hay más sucursales ya definidas, cargarlas también (aunque su spreadsheet individual todavía no exista)

---

## Fase 2 — Resolución de tenant en código

- [ ] `lib/tenants.ts` → `resolveTenant(slug)`: lee tab `Tenants` desde `MASTER_SHEET_ID`, devuelve `{ sheetId, sheetName, activo }`
- [ ] `app/carta/[sucursal]/page.tsx`: llama a `resolveTenant(params.sucursal)`, pasa resultado a `getMenu()` y `getConfig()`
- [ ] Si `activo=false` o slug no existe: `notFound()` (página 404 de Next.js)
- [ ] Probar con un solo tenant (el actual) antes de sumar el segundo — validar que nada se rompió

---

## Fase 3 — Migrar lectura de datos a multi-tenant

- [ ] `getMenu()` → `getMenu(sheetId, sheetName)`, deja de leer `MENU_SHEET_ID`/`MENU_SHEET_NAME` fijo de env var
- [ ] `getConfig()` → `getConfig(sheetId)`, mismo cambio
- [ ] Genericizar los `defaults` de `get-config.ts` (hoy pueden tener datos reales de una sucursal hardcodeados — riesgo de que se filtren si otra sucursal falla el fetch)
- [ ] Reordenar/agrupar la sheet `Config` real por secciones (identidad, SEO, hero, contacto, layout, tipografías, textos)
- [ ] Nombrar cada spreadsheet de sucursal con su `tenant_id` (ej. archivo `asturias`, tabs `Menu` y `Config` adentro)

---

## Fase 4 — Inglés

- [ ] Agregar columnas `_en` a `Menu` (`platillo_en`, `descripcion_en`) y a `Config` (textos fijos)
- [ ] `getMenu(sheetId, sheetName, lang)` / `getConfig(sheetId, lang)`: fallback a español si la columna `_en` viene vacía
- [ ] Rutas `app/[locale]/carta/page.tsx` y `app/[locale]/carta/[sucursal]/page.tsx`
- [ ] `hreflang` en `layout.tsx` para SEO
- [ ] Toggle de idioma (mismo lugar/estilo que `dark-toggle.tsx`), como link a la otra ruta de locale

---

## Fase 5 — Cierre

- [ ] Decidir destino de `app/page.tsx`/`MenuClient` (¿se descarta o se define su rol?)
- [ ] Decidir si `carta-demo` usa sheet propia de demo o el mismo tenant en otra ruta
- [ ] Probar el flujo completo con 2 sucursales reales antes de dar por cerrado
