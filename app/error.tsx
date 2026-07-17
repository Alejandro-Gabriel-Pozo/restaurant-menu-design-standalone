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
        <p
          className="font-sans text-xs font-light uppercase tracking-[0.4em]"
          style={{ color: "oklch(0.18 0.02 40 / 0.5)" }}
        >
          Menú
        </p>
        <h1
          className="font-serif text-4xl font-medium"
          style={{ color: "oklch(0.18 0.02 40)" }}
        >
          No pudimos cargar el menú
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Estamos teniendo un problema técnico. Por favor intentá de nuevo en unos instantes.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/50">
            {error.digest}
          </p>
        )}
      </div>

      <button
        onClick={reset}
        className="rounded-none border px-10 py-3 font-sans text-xs font-light uppercase tracking-[0.35em] transition-colors hover:opacity-80"
        style={{
          borderColor: "oklch(0.18 0.02 40 / 0.4)",
          color: "oklch(0.18 0.02 40)",
        }}
      >
        Reintentar
      </button>
    </main>
  )
}
