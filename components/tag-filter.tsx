"use client"

import type { MenuCategory } from "@/lib/get-menu"

interface TagFilterProps {
  categories: MenuCategory[]
  activeTags: string[]
}

export function TagFilter({ categories, activeTags }: TagFilterProps) {
  if (activeTags.length === 0) return null

  const matchingItems = categories.flatMap((cat) =>
    cat.items
      .filter((item) => {
        const itemTags = item.tags ?? []
        // AND: el plato debe tener TODOS los tags activos
        return activeTags.every((t) => itemTags.includes(t))
      })
      .map((item) => ({ ...item, categoryLabel: cat.label }))
  )

  return (
    <div className="mx-auto max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {matchingItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-serif text-xl text-foreground">Sin platos con ese filtro</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            No encontramos platos con{" "}
            {activeTags.length === 1 ? "la etiqueta" : "las etiquetas"}{" "}
            {activeTags.map((t, i) => (
              <span key={t}>
                <strong className="font-medium text-primary uppercase tracking-wider">{t}</strong>
                {i < activeTags.length - 1 ? " + " : ""}
              </span>
            ))}. Probá con otro filtro.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 mb-6 font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
            {matchingItems.length} plato{matchingItems.length !== 1 ? "s" : ""}{" · "}
            {activeTags.map((t, i) => (
              <span key={t} className="text-primary">
                {t}{i < activeTags.length - 1 ? " + " : ""}
              </span>
            ))}
          </p>
          <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2 pb-14">
            {matchingItems.map((item, idx) => (
              <li
                key={`${item.name}-${idx}`}
                className={`border-b pb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  item.especial ? "border-primary/40 border-dashed" : "border-dashed border-border"
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={`font-serif text-xl font-medium ${
                    item.especial ? "text-primary" : "text-foreground"
                  }`}>
                    {item.name}
                    {item.especial && (
                      <span className="ml-2 font-sans text-xs font-light uppercase tracking-widest text-primary">★</span>
                    )}
                  </h3>
                  <span className="shrink-0 font-serif text-lg font-medium text-primary">{item.price}</span>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-none border border-border px-2 py-0.5 text-xs font-light uppercase tracking-wider text-muted-foreground">
                    {item.categoryLabel}
                  </span>
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={[
                        "rounded-none border px-2 py-0.5 text-xs font-light uppercase tracking-wider",
                        activeTags.includes(tag)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-primary/30 text-primary",
                      ].join(" ")}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
