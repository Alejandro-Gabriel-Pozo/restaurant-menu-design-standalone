import Link from "next/link"
import type { SiteConfig } from "@/lib/get-config"
import { normFuente } from "@/lib/format-utils"

interface CartaTopbarProps {
  onPrint: () => void
  config: Pick<SiteConfig, "topbar_back_label" | "topbar_back_size" | "topbar_back_color">
}

export function CartaTopbar({ onPrint, config }: CartaTopbarProps) {
  const label = config.topbar_back_label || "← Menú"
  const size  = normFuente(config.topbar_back_size || "12px")
  const color = config.topbar_back_color || null

  return (
    <div
      id="carta-topbar"
      className="absolute left-0 right-0 top-0 z-40 flex h-10 items-center justify-between px-3"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "oklch(from var(--background) l c h / 0.88)",
        borderBottom: "1px solid oklch(from var(--border) l c h / 0.3)",
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 font-sans font-light uppercase tracking-[0.3em] text-foreground/50 transition-colors hover:text-foreground/80"
        style={{ fontSize: size, ...(color ? { color } : {}) }}
      >
        {label}
      </Link>

      <button
        onClick={onPrint}
        aria-label="Imprimir carta"
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      </button>
    </div>
  )
}
