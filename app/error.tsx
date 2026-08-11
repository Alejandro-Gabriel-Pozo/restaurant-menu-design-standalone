"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[menu-error]", error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="font-sans text-xs font-light uppercase tracking-[0.4em] text-muted-foreground/50">
          Menú
        </p>
        <h1 className="font-serif text-4xl font-medium text-foreground">
          No pudimos cargar el menú
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Estamos teniendo un problema técnico. Por favor intentá de nuevo en unos instantes.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/40">
            {error.digest}
          </p>
        )}
      </div>

      <button
        onClick={reset}
        className="rounded-none border border-border px-10 py-3 font-sans text-xs font-light uppercase tracking-[0.35em] text-foreground transition-opacity hover:opacity-60"
      >
        Reintentar
      </button>
    </main>
  )
}
