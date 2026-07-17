export default function Loading() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero skeleton */}
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center gap-8 px-6 py-24">
        <div className="h-3 w-12 animate-pulse rounded-sm bg-border" />
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-border" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-48 animate-pulse rounded-sm bg-border" />
          <div className="h-3 w-32 animate-pulse rounded-sm bg-border" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-3 w-64 animate-pulse rounded-sm bg-border" />
          <div className="h-3 w-52 animate-pulse rounded-sm bg-border" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-sm bg-border" />
      </div>

      {/* Nav skeleton */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <div className="h-3 w-10 animate-pulse rounded-sm bg-border" />
          {[80, 96, 72, 88, 64].map((w, i) => (
            <div key={i} className="h-3 animate-pulse rounded-sm bg-border" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Secciones skeleton */}
      <div className="mx-auto max-w-4xl px-6">
        {[1, 2].map((s) => (
          <div key={s} className="py-14 md:py-20">
            {/* Encabezado */}
            <div className="mb-10 flex flex-col gap-3">
              <div className="h-2.5 w-20 animate-pulse rounded-sm bg-border" />
              <div className="h-10 w-56 animate-pulse rounded-sm bg-border" />
              <div className="h-3 w-96 max-w-full animate-pulse rounded-sm bg-border" />
            </div>
            {/* Items */}
            <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="border-b border-dashed border-border pb-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="h-5 w-36 animate-pulse rounded-sm bg-border" />
                    <div className="h-5 w-16 animate-pulse rounded-sm bg-border" />
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="h-3 w-full animate-pulse rounded-sm bg-border" />
                    <div className="h-3 w-4/5 animate-pulse rounded-sm bg-border" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
