import Link from "next/link"
import type { SiteConfig } from "@/lib/get-config"
import { normFuente } from "@/lib/get-config"

interface CartaTopbarProps {
  onPrint: () => void
  config: Pick<SiteConfig, "topbar_back_label" | "topbar_back_size">
}

export function CartaTopbar({ onPrint, config }: CartaTopbarProps) {
  const label    = config.topbar_back_label || "← Menú"
  const fontSize = normFuente(config.topbar_back_size || "10px")

  return (
    <header
      id="carta-topbar"
      className="absolute left-0 right-0 top-0 z-40 flex h-10 items-center justify-between bg-background/90 px-4 backdrop-blur-sm"
      style={{ borderBottom: "1px solid oklch(from var(--border) l c h / 0.4)" }}
    >
      <Link
        href="/"
        className="flex h-10 min-w-[44px] items-center font-sans font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors"
        style={{ fontSize }}
      >
        {label}
      </Link>
      <div className="flex items-center gap-3">
        <button
          onClick={onPrint}
          aria-label="Imprimir carta completa"
          className="flex h-10 min-w-[44px] items-center justify-center gap-1.5 font-sans text-[10px] font-light uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </div>
    </header>
  )
}
