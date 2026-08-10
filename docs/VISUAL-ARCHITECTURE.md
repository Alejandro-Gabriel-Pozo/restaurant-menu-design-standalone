# Arquitectura Visual — Desktop / Mobile

Complementa a `ARCHITECTURE.md` (que cubre datos/tenants/idioma). Este documento es solo sobre cómo está armada la parte visual y cómo se separa desktop de mobile — se actualiza a medida que se aplican los cambios, no es una foto fija.

---

## 1. Patrón base: dual-render, no detección por JS

Todo el repo resuelve desktop/mobile de la misma forma: se renderizan **las dos versiones** en el DOM y CSS decide cuál se ve (`hidden sm:block` para desktop, `sm:hidden` para mobile).

**Por qué no usar JS (`useIsMobile()` con `matchMedia`)**: el server no conoce el ancho de pantalla del visitante en el primer render (SSR). Si la decisión fuera por JS, habría un salto visual (flash) al hidratar y corregir. El patrón dual-render + CSS es el correcto para este stack.

---

## 2. Auditoría — dónde vive la lógica desktop/mobile

| Archivo | Qué tiene |
|---|---|
| `components/menu-hero.tsx` | 4 secciones: **cálculos de config** → **fragmentos compartidos** (`overlayYTextura`, `logoFallback`) → **bloques mobile** (`grupoTextoMobile`, `grupoLogoMobile`) → **bloques desktop** (`grupoTextoDesktop`, `grupoLogoDesktop`) → **render**. |
| `components/carta-view.tsx` | **Cálculos de config** (dimensiones, fuentes, textos) → **fragmento compartido** (`overlayYTextura`) → **`portadaDesktop`** (variable JSX) → **`portadaMobile`** (variable JSX) → **render** limpio. Bandas de sección con comentarios `DESKTOP` / `MOBILE` inline. |
| `components/carta-section-image.tsx` | Fondo mobile: `cover`/`no-repeat`/`center`. Fondo desktop: `repeat-x` + `background-size` desde config. Miniatura: `<img>` posicionado por `posX`/`posY`. |
| `components/menu-section.tsx` | Más liviano — solo cambia proporciones con clases responsive dentro del mismo bloque, sin duplicar JSX. |
| `lib/get-config.ts` | Cada campo visual tiene su par `_mobile`/`_desktop` (`hero_pos_contenido_mobile`, `carta_banda_alto_mobile`, `carta_imagen_ancho_mobile`, etc). |

---

## 3. Regla de separación (aplicada)

Dentro de cada archivo, dos capas:

- **Cálculos que dependen de `config`** (parseo de colores, posiciones, alto de banda) → al inicio del componente, se resuelven una sola vez.
- **JSX puro de layout** (desktop / mobile) → recibe esos valores ya resueltos, no vuelve a tocar `config`.

### 3.1 Principio: todo parámetro visual que pueda variar por negocio va en Sheets

Ya es así para todos los campos visuales (`carta_banda_alto_mobile`/`_desktop`, `carta_imagen_ancho_desktop`, `hero_pos_contenido_mobile`/`hero_pos_logo_mobile`, etc — todos leídos desde `Config` en `lib/get-config.ts` con su default como fallback). Cualquier valor nuevo que se agregue debe seguir este principio: resolverse desde `Config`, nunca hardcodeado en el componente.

---

## 4. Cambios aplicados

### `carta-section-image.tsx`
- **Fondo mobile**: `backgroundSize: cover` + `backgroundRepeat: no-repeat` + `backgroundPosition: center`. La imagen siempre se ve completa sin cortes ni tiles.
- **`sizeMobile` eliminada**: variable que calculaba el ancho del tile en px — ya no existe.
- **`anchoMobile`** sigue como prop pero solo se usa en modo `miniatura` (cálculo de altura en px). En modo `fondo`, se ignora para mobile.
- Desktop no se tocó: sigue `repeat-x` + `background-size` desde config (`anchoDesktop`).

### `menu-hero.tsx`
- Estructurado en 4 secciones con comentarios separadores: `CÁLCULOS DE CONFIG` / `FRAGMENTOS COMPARTIDOS` / `BLOQUES JSX MOBILE` / `BLOQUES JSX DESKTOP` / `RENDER`.
- `bgSolido` movido a la sección de cálculos (estaba al final, entre los bloques JSX).

### `carta-view.tsx`
- Portada separada en `portadaDesktop` y `portadaMobile` como variables JSX antes del `return`.
- `overlayYTextura` extraído como fragmento compartido.
- Render de portada reducido a `{overlayYTextura}{portadaDesktop}{portadaMobile}`.
- Bandas de sección con comentarios `BANDA DE SECCIÓN` / `DESKTOP` / `MOBILE` / `ITEMS DE LA SECCIÓN`.
- Comentarios de grupo en cálculos: fuentes banda / fuentes items / fuentes portada / fuentes índice / textos editables.

---

## 5. Pendiente

Ningún pendiente de Fase 0. La Fase 1 en adelante no toca la arquitectura visual.
