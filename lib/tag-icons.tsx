/**
 * Mapa centralizado de tag → icono SVG.
 * Cada icono es un SVG inline de 12×12 con stroke, sin fill,
 * coherente con el estilo de línea del resto del proyecto.
 *
 * Para agregar un tag nuevo: solo agregar una entrada en TAG_ICONS.
 * Los tags sin entrada muestran solo el texto (sin icono).
 */

type IconProps = { className?: string }

// ── Íconos individuales ──────────────────────────────────────────────────────

function IconLeaf({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function IconStar({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function IconChefHat({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
      <line x1="6" x2="18" y1="17" y2="17"/>
    </svg>
  )
}

function IconFlame({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  )
}

function IconDroplets({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
    </svg>
  )
}

function IconMapPin({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IconGlass({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 22h8"/>
      <path d="M7 10h10"/>
      <path d="M12 10v12"/>
      <path d="M17 2H7l-2 8h14l-2-8z"/>
    </svg>
  )
}

// ── Mapa tag → componente de ícono ───────────────────────────────────────
// Las claves son case-insensitive (se normalizan en TagIcon).
// Para agregar un tag nuevo: añadir entrada aquí.

const TAG_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  "vegetariano":    IconLeaf,
  "vegano":         IconLeaf,
  "sin carne":      IconLeaf,
  "especialidad":   IconStar,
  "del chef":       IconChefHat,
  "recomendado":    IconStar,
  "picante":        IconFlame,
  "muy picante":    IconFlame,
  "regional":       IconMapPin,
  "de la región":   IconMapPin,
  "sin alcohol":    IconDroplets,
  "coctel de autor": IconGlass,
  "cóctel":         IconGlass,
  "sin tacc":       IconLeaf,
  "sin gluten":     IconLeaf,
}

// ── Componente público ───────────────────────────────────────────────────

export function TagIcon({ tag, className }: { tag: string; className?: string }) {
  const key = tag.toLowerCase().trim()
  const Icon = TAG_ICONS[key]
  if (!Icon) return null
  return <Icon className={className} />
}
