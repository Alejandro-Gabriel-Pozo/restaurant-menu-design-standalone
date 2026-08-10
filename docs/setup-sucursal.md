# Alta de nueva sucursal

Este documento describe el proceso completo para agregar una sucursal al sistema multisucursal.
No requiere cambios de código ni de variables de entorno.

---

## 1. Google Sheets — planilla de la sucursal

### 1a. Crear la planilla

Copiá la planilla raíz o creá una nueva con estas hojas:

| Hoja | Requerida | Descripción |
|---|---|---|
| `Menu` | ✅ | Ítems del menú (misma estructura que la planilla raíz) |
| `Config` | ✅ | Configuración visual y de contacto |

> Los nombres de hoja pueden ser distintos — se configuran en la columna `sheet_name` / `config_sheet`.

### 1b. Compartir la planilla

La planilla debe ser **pública** ("Cualquier persona con el enlace puede ver").

### 1c. Obtener el Sheet ID

Del URL de la planilla:
```
https://docs.google.com/spreadsheets/d/  1abc...xyz  /edit
                                          ^^^^^^^^^^^
                                          Este es el sheet_id
```

---

## 2. Hoja `Sucursales` — planilla raíz

Abrí la planilla raíz (`MENU_SHEET_ID`) y editá la hoja llamada exactamente `Sucursales`.

### Columnas (fila 1 = encabezados, exactamente estos nombres)

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `slug` | texto | ID en la URL — solo minúsculas y guiones | `miches` |
| `label` | texto | Nombre legible en la landing | `Miches` |
| `sheet_id` | texto | ID del spreadsheet de la sucursal | `1abc...xyz` |
| `sheet_name` | texto | Nombre de la hoja del menú | `Menu` |
| `config_sheet` | texto | Nombre de la hoja de configuración | `Config` |
| `activa` | booleano | `TRUE` = publicada \| `FALSE` = WIP/oculta | `TRUE` |
| `deploy_hook` | texto | URL del deploy hook de Vercel (ver paso 4) | `https://api.vercel.com/...` |
| `notas` | texto | Documentación libre: estado, pendientes, fecha | `✅ Alta completa 2026-08-10` |

> **`notas` es documentación viva.** Registrá qué falta, quién configuró y cuándo se validó.

---

## 3. Variables de entorno

**No se requieren variables nuevas por sucursal.**
Todo se lee desde la hoja `Sucursales`.

Las únicas env vars necesarias son las de la **sucursal raíz** (ya configuradas):

```bash
MENU_SHEET_ID=1abc...xyz    # Planilla raíz (debe contener la hoja Sucursales)
MENU_SHEET_NAME=Menu        # Hoja del menú de la sucursal raíz
```

En Vercel: `Settings → Environment Variables`.

---

## 4. Deploy hook (recomendado)

Sin deploy hook los cambios en Sheets se reflejan sola cada **1 hora** (ISR).
Con el hook podés forzar un redeploy instantáneo desde la misma planilla.

### Crear el hook en Vercel

1. `Settings → Git → Deploy Hooks → Add Deploy Hook`
2. Nombrálo con el slug, ej. `sucursal-miches`
3. Copiá la URL y pegála en la columna `deploy_hook` de la hoja `Sucursales`

### Botón en Apps Script (opcional)

En Google Sheets: `Extensiones → Apps Script`

```js
function triggerDeploy() {
  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sucursales");
  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const hookCol = headers.indexOf("deploy_hook");
  const activaCol = headers.indexOf("activa");

  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const activa = data[i][activaCol];
    const hook   = data[i][hookCol]?.toString().trim();
    if (activa === true && hook) {
      UrlFetchApp.fetch(hook, { method: "post" });
      count++;
    }
  }
  SpreadsheetApp.getUi().alert(`Deploy iniciado para ${count} sucursal(es) ✓`);
}
```

Agrégale un botón en la hoja desde `Insertar → Dibujo`.

---

## 5. Checklist de alta

```
[ ] Planilla de la sucursal creada
[ ] Planilla compartida públicamente ("cualquier persona con el enlace")
[ ] Hoja Menu con al menos 1 ítem activo (disponible = TRUE)
[ ] Hoja Config con restaurante_nombre, color_marca y hero_imagen_fondo_url
[ ] Fila agregada en hoja Sucursales de la planilla raíz
[ ] activa = TRUE
[ ] Deploy realizado (manual desde Vercel o vía hook)
[ ] URL /carta/<slug> responde y muestra la carta
[ ] Landing / muestra el card de la sucursal
[ ] meta_title y meta_og_image_url configurados en Config
[ ] Columna notas actualizada: "✅ Alta completa YYYY-MM-DD"
```

---

## 6. Desactivar una sucursal

Poner `activa = FALSE` en la hoja `Sucursales` y hacer deploy.
La URL `/carta/<slug>` devuelve 404 automáticamente.
No requiere ningún cambio de código.

---

## 7. Mapa de archivos del sistema

```
lib/
  sucursales.ts          ← lee hoja Sucursales → getSucursales() / getSucursal(slug)
  get-menu.ts            ← getMenu(sheetId?, sheetName?)
  get-config.ts          ← getConfig(sheetId?)
app/
  page.tsx               ← auto-detecta: modo single (carta) o multi (landing)
  carta/
    page.tsx             ← carta sucursal raíz (MENU_SHEET_ID)
    [sucursal]/
      page.tsx           ← carta dinámica por slug
docs/
  setup-sucursal.md      ← este archivo
```
