import { Reveal } from "@/components/reveal"

interface SignatureDishItem {
  name: string
  description: string
  price: string
  tags?: string[]
}

interface SignatureDishProps {
  item?: SignatureDishItem
}

export function SignatureDish({ item }: SignatureDishProps) {
  if (!item) return null

  return (
    <Reveal>
      <section
        aria-label="Especialidad de la casa"
        className="
          relative isolate overflow-hidden
          -mx-6 sm:-mx-8
          my-12
          bg-primary
        "
      >
        {/* ── Textura de papel ────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Líneas decorativas ─────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-x-0 top-5 border-t border-primary-foreground/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-5 border-b border-primary-foreground/20"
          aria-hidden="true"
        />

        {/* ── Contenido ─────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-2xl px-8 py-14 text-center sm:py-20">

          {/* Eyebrow label */}
          <p className="font-sans text-xs font-light uppercase tracking-[0.5em] text-primary-foreground/70">
            Especialidad de la casa
          </p>

          {/* Ornamento tipográfico */}
          <div
            className="mx-auto mt-5 mb-6 h-px w-16 bg-primary-foreground/30"
            aria-hidden="true"
          />

          {/* Nombre del plato */}
          <h2 className="font-serif text-4xl font-medium leading-tight text-balance text-primary-foreground sm:text-5xl">
            {item.name}
          </h2>

          {/* Descripción */}
          {item.description && (
            <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
              {item.description}
            </p>
          )}

          {/* Precio */}
          <p className="mt-7 font-serif text-3xl font-medium text-primary-foreground">
            {item.price}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-none border border-primary-foreground/40 px-3 py-1 font-sans text-xs font-light uppercase tracking-wider text-primary-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </Reveal>
  )
}
