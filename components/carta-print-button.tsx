"use client"

export function CartaPrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 font-sans text-xs font-light uppercase tracking-[0.3em] border border-primary/40 px-4 py-2 text-primary hover:bg-primary/5 transition-colors"
    >
      Imprimir carta
    </button>
  )
}
