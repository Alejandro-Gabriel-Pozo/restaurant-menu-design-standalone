"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CartaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[carta-error]", error)
  }, [error])

  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="font-sans text-xs font-light uppercase tracking-[0.4em] text-muted-foreground/50">
          Carta
        </p>
        <h1 className="font-serif text-4xl font-medium text-foreground">
          No pudimos cargar la carta
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Puede ser un problema temporal con la hoja de datos. Intentá de nuevo o volvé al inicio.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/40">
            {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={reset}
          className="rounded-none border border-border px-10 py-3 font-sans text-xs font-light uppercase tracking-[0.35em] text-foreground transition-opacity hover:opacity-60"
        >
          Reintentar
        </button>
        <button
          onClick={() => router.push("/")}
          className="font-sans text-xs font-light uppercase tracking-[0.35em] text-muted-foreground transition-opacity hover:opacity-60"
        >
          Volver al inicio
        </button>
      </div>
    </main>
  )
}
