# Alta de nueva sucursal

Este documento describe el proceso completo para agregar una sucursal al sistema multisucursal.
No requiere cambios de código ni de variables de entorno.

---

## 1. Google Sheets — planilla de la sucursal

### 1a. Crear la planilla

Copiá `docs/templates/template-hoja-carta.csv` como referencia, o creá una nueva con estas tabs:

| Tab | Requerida | Descripción |
|---|---|---|
| `Menu` | ✅ | Ítems del menú |
| `Config` | ✅ | Configuración visual y de contacto |

> Los nombres de tab pueden ser distintos — se configuran en `sheet_name` de la hoja Tenants.

### 1b. Compartir la planilla

La planilla debe ser **pública** ("Cualquier persona con el enlace puede ver").

### 1c. Obtener el Sheet ID

```
https://docs.google.com/spreadsheets/d/  1abc...xyz  /edit
                                          ^^^^^^^^^^^
                                          Este es el sheet_id
```

---

## 2. Hoja `Tenants` — planilla maestra (MASTER_SHEET_ID)

Abrí la planilla maestra y editá la tab llamada exactamente **`Tenants`**.

> ⚠️ Referencia: `docs/templates/template-hoja-raiz.csv`

### Columnas (fila 1 = encabezados, exactamente estos nombres)

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `tenant_id` | texto | ID en la URL — solo minúsculas y guiones | `miches` |
| `label` | texto | Nombre legible en el portal | `Miches` |
| `dominio` | texto | Dominio propio (sin puerto). Vacío = solo por slug | `miches.nqntur.com` |
| `sheet_id` | texto | ID del spreadsheet del tenant | `1abc...xyz` |
| `sheet_name` | texto | Nombre de la tab del menú | `Menu` |
| `activo` | booleano | `TRUE` = publicado \| `FALSE` = WIP/oculto | `TRUE` |
| `notas` | texto | Estado, responsable, fecha de alta | `✅ Alta completa 2026-08-11` |

> **`notas` es documentación viva.** Registrá qué falta, quién configuró y cuándo se validó.

---

## 3. Variables de entorno

**No se requieren variables nuevas por sucursal.**

Las únicas env vars necesarias son las de la planilla maestra (ya configuradas en Vercel):

```bash
MASTER_SHEET_ID=1abc...xyz   # Planilla maestra (contiene la tab Tenants)
MENU_SHEET_ID=1abc...xyz     # Planilla raíz para modo single (puede coincidir)
```

---

## 4. Deploy hook (recomendado)

Sin hook los cambios en Sheets se reflejan cada **1 hora** (ISR).
Con el hook podés forzar un redeploy instantáneo.

### Crear el hook en Vercel

1. `Settings → Git → Deploy Hooks → Add Deploy Hook`
2. Nombrálo con el tenant_id, ej. `tenant-miches`
3. Copiá la URL y usala desde Apps Script

### Apps Script (opcional)

En la planilla maestra: `Extensiones → Apps Script`

```js
function triggerDeploy() {
  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tenants");
  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const hookCol   = headers.indexOf("deploy_hook");
  const activoCol = headers.indexOf("activo");

  if (hookCol === -1) {
    SpreadsheetApp.getUi().alert("Agregá la columna deploy_hook a la hoja Tenants.");
    return;
  }

  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const activo = data[i][activoCol];
    const hook   = data[i][hookCol]?.toString().trim();
    if (activo === true && hook) {
      UrlFetchApp.fetch(hook, { method: "post" });
      count++;
    }
  }
  SpreadsheetApp.getUi().alert(`Deploy iniciado para ${count} tenant(s) ✓`);
}
```

Agregá un botón desde `Insertar → Dibujo`.

---

## 5. Checklist de alta

```
[ ] Planilla del tenant creada (desde template-hoja-carta.csv)
[ ] Planilla compartida públicamente
[ ] Tab Menu con al menos 1 ítem (disponible = TRUE)
[ ] Tab Config: restaurante_nombre, color_marca, hero_imagen_fondo_url
[ ] Fila agregada en tab Tenants de la planilla maestra
[ ] activo = TRUE
[ ] Deploy realizado (Vercel o vía hook)
[ ] URL /carta/<tenant_id> responde y muestra la carta
[ ] Portal / muestra el card del tenant
[ ] meta_title y meta_og_image_url configurados
[ ] Columna notas actualizada: "✅ Alta completa YYYY-MM-DD"
```

---

## 6. Desactivar un tenant

Poné `activo = FALSE` en la tab Tenants y hacé deploy.
La URL `/carta/<tenant_id>` devuelve 404 automáticamente.
No requiere ningún cambio de código.

---

## 7. Mapa de archivos del sistema

```
lib/
  tenants.ts             ← lee tab Tenants → getTenants() / getTenantBySlug()
  get-menu.ts            ← getMenu(sheetId?, sheetName?)
  get-config.ts          ← getConfig(sheetId?)
app/
  page.tsx               ← auto-detecta: modo single (carta) o multi (portal)
  carta/
    [sucursal]/
      page.tsx           ← carta dinámica por tenant_id
  carta-demo/
    page.tsx             ← carta con MENU_SHEET_ID (dev/preview)
docs/
  setup-sucursal.md      ← este archivo
  templates/
    template-hoja-raiz.csv   ← referencia tab Tenants + Config de la planilla maestra
    template-hoja-carta.csv  ← referencia tabs Menu + Config de cada tenant
```
