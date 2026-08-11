"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function SucursalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params  = useParams<{ sucursal: string }>()
  const router  = useRouter()
  const slug    = params?.sucursal ?? ""

  useEffect(() => {
    console.error(`[carta/${slug}-error]`, error)
  }, [error, slug])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="font-sans text-xs font-light uppercase tracking-[0.4em] text-muted-foreground/50">
          {slug || "Carta"}
        </p>
        <h1 className="font-serif text-4xl font-medium text-foreground">
          No pudimos cargar esta carta
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          La carta de{slug ? ` "${slug}"` : "l restaurante"} no está disponible en este momento.
          Verificá que la sucursal existe o intentá de nuevo más tarde.
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
