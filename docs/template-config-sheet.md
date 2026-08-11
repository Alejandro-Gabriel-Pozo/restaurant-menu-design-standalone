# Template — Hoja Config (tenant)

Esta tabla es la referencia para completar la tab **Config** de cada hoja de tenant.
Todas las claves son opcionales salvo las marcadas \*obligatorio\*.

---

## Identidad

| Clave | Ejemplo | Notas |
|---|---|---|
| `restaurante_nombre` \* | `La Parrilla` | Nombre del restaurante |
| `restaurante_subtitulo` | `Desde 1985` | Subtítulo en portada |
| `restaurante_descripcion` | `Cocina de autor...` | Descripción hero |
| `restaurante_boton_hero` | `Ver carta` | Texto del CTA hero |
| `color_marca` \* | `#8B4513` | Color base de toda la carta |
| `theme_color` | `#8B4513` | Meta theme-color (barra del navegador) |
| `favicon_url` | `https://...` | URL del favicon |
| `restaurante_logo_url` | `https://...` | URL del logo |
| `lang` | `es` | Idioma (`es`, `en`, etc.) |

---

## Colores semánticos por zona

Todos son **opcionales** — si están vacíos, heredan `color_marca`.

| Clave | Controla | Ejemplo |
|---|---|---|
| `color_nav` | Label "Menú" + filtros de tags en la barra nav | `#1A3F60` |
| `color_seccion` | Label de sección (ej: "Entrantes") | `#6B3A2A` |
| `color_especial` | Fondo del bloque Especialidad de la casa | `#D4A853` |
| `color_cta` | Botón CTA en portada | `#2C5F8A` |
| `color_tags` | Tags inline en los platos | `#555555` |
| `color_precio` | Precio de cada plato | `#2C2C2C` |

---

## Hero / Portada

| Clave | Ejemplo | Notas |
|---|---|---|
| `hero_color_fondo` | `#1a1a1a` | Color de fondo si no hay imagen |
| `hero_imagen_fondo_url` | `https://...` | URL imagen de fondo |
| `hero_etiqueta_superior` | `Menú 2026` | Etiqueta sobre el título |
| `hero_etiqueta_scroll` | `Deslizá` | Texto del scroll hint |
| `hero_ink` | `light` / `dark` | Color del texto sobre el hero |
| `hero_pos_contenido` | `center-right` | Posición del bloque de texto |
| `hero_pos_contenido_mobile` | `bottom-center` | Posición mobile |
| `hero_pos_logo` | `bottom-right` | Posición del logo |
| `hero_pos_logo_mobile` | `top-center` | Posición logo mobile |
| `color_fondo_dia` | `#f5f0eb` | Fondo de la carta (fuera del hero) |

---

## SEO / Open Graph

| Clave | Ejemplo |
|---|---|
| `meta_title` | `La Parrilla — Carta 2026` |
| `meta_descripcion` | `Cocina de autor en Neuquén` |
| `meta_og_image_url` | `https://...` |
| `meta_og_locale` | `es_AR` |
| `meta_og_url` | `https://midominio.com` |
| `meta_twitter_card` | `summary_large_image` |

---

## Precios

| Clave | Ejemplo | Notas |
|---|---|---|
| `precio_simbolo` | `$` | Símbolo de moneda |
| `precio_locale` | `es-AR` | Locale para formateo numérico |
| `precio_posicion` | `izquierda` / `derecha` | Dónde va el símbolo |

---

## Footer

| Clave | Ejemplo |
|---|---|
| `mostrar_footer` | `true` / `false` |
| `restaurante_footer_direccion` | `Av. Argentina 123, Neuquén` |
| `restaurante_footer_maps_url` | `https://maps.google.com/...` |
| `restaurante_footer_telefono` | `+54 299 123-4567` |
| `restaurante_footer_email` | `info@laparrilla.com` |
| `restaurante_footer_horarios` | `Lun–Vie 12–23 / Sáb–Dom 12–00` |
| `restaurante_instagram` | `@laparrilla` |
| `restaurante_facebook` | `laparrilla` |
| `restaurante_whatsapp` | `5492991234567` |
| `footer_bg` | `#1a1a1a` |
| `footer_color` | `#f5f0eb` |
| `footer_color_acento` | `#D4A853` |

---

## Notas de implementación

- `buildCssVars(config)` en los `page.tsx` inyecta todas las variables al DOM.
- Cascada: `color_nav` → si vacío → `--color-acento` → definido por `color_marca`.
- El portal (hoja maestra) **no usa** las claves semánticas de zona — solo `color_marca` y las claves `portal_*`.
