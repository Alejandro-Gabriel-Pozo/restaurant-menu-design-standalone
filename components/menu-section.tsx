import type { MenuCategory } from "@/lib/get-menu"

export function MenuSection({ category }: { category: MenuCategory }) {
  return (
    <section id={category.id} className="scroll-mt-20 py-14 md:py-20">
      {/* Encabezado de sección */}
      <div className="mb-10 max-w-2xl">
        <p className="font-sans text-xs font-light uppercase tracking-[0.4em] text-primary">
          {category.label}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-medium text-foreground text-balance md:text-5xl">
          {category.title}
        </h2>
        {category.description && (
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      {/* Lista de platos */}
      <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {category.items.map((item) => (
          <li
            key={item.name}
            className={`border-b pb-6 ${
              item.especial
                ? "border-primary/40 border-dashed"
                : "border-dashed border-border"
            }`}
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
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-none border border-primary/30 px-2 py-0.5 text-xs font-light uppercase tracking-wider text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
