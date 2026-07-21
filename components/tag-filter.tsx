"use client"

import { useState } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface TagFilterProps {
  tags: string[]
  categories: MenuCategory[]
}

export function TagFilter({ tags, categories }: TagFilterProps) {
  const [active, setActive] = useState<string | null>(null)

  if (!tags.length) return null

  return (
    <div aria-label="Filtrar por etiqueta" className="mx-auto max-w-4xl px-6 pt-8 pb-2">

      {/* ── Botones ──────────────────────────────────────────────────────── */}
      <div role="group" aria-label="Filtros" className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={[
            "rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors duration-200",
            active === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
          ].join(" ")}
        >
          Todos
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            aria-pressed={active === tag}
            className={[
              "rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors duration-200",
              active === tag
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/30 text-primary hover:border-primary hover:bg-primary/10",
            ].join(" ")}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Resultados filtrados (solo cuando hay tag activo) ─────────────── */}
      {active !== null && (
        <FilterResults categories={categories} active={active} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: panel de resultados con empty state
// ─────────────────────────────────────────────────────────────────────────────
function FilterResults({
  categories,
  active,
}: {
  categories: TagFilterProps["categories"]
  active: string
}) {
  const matchingItems = categories.flatMap((cat) =>
    cat.items
      .filter((item) => (item.tags ?? []).includes(active))
      .map((item) => ({ ...item, categoryLabel: cat.label }))
  )

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {matchingItems.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────── */
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-serif text-xl text-foreground">
            Sin platos con ese filtro
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            No encontramos platos con la etiqueta{" "}
            <strong className="font-medium text-primary uppercase tracking-wider">
              {active}
            </strong>
            . Probá con otro filtro o explorá todo el menú.
          </p>
        </div>
      ) : (
        /* ── Items filtrados ──────────────────────────────────────────── */
        <>
          <p className="mb-6 font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
            {matchingItems.length} plato{matchingItems.length !== 1 ? "s" : ""}{" "}
            con <span className="text-primary">{active}</span>
          </p>

          <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {matchingItems.map((item, idx) => (
              <li
                key={`${item.name}-${idx}`}
                className={`border-b pb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  item.especial
                    ? "border-primary/40 border-dashed"
                    : "border-dashed border-border"
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={`font-serif text-xl font-medium ${
                      item.especial ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                    {item.especial && (
                      <span className="ml-2 font-sans text-xs font-light uppercase tracking-widest text-primary">
                        ★
                      </span>
                    )}
                  </h3>
                  <span
                    className="shrink-0 font-serif text-lg font-medium text-primary"
                    aria-label={`Precio ${item.price}`}
                  >
                    {item.price}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}

                {/* Badges: categoría + tags (tag activo highlighted) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-none border border-border px-2 py-0.5 text-xs font-light uppercase tracking-wider text-muted-foreground">
                    {item.categoryLabel}
                  </span>
                  {item.tags
                    ?.filter((t) => t !== active)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-none border border-primary/30 px-2 py-0.5 text-xs font-light uppercase tracking-wider text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  <span className="rounded-none border border-primary bg-primary/10 px-2 py-0.5 text-xs font-light uppercase tracking-wider text-primary">
                    {active}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
