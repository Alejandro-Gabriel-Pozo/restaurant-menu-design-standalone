import type { MenuCategory } from "@/lib/menu-data"

export function MenuSection({ category }: { category: MenuCategory }) {
  return (
    <section id={category.id} className="scroll-mt-20 py-14 md:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {category.label}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-medium text-foreground text-balance md:text-5xl">
          {category.title}
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>

      <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="border-b border-dashed border-border pb-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-xl font-medium text-foreground">
                {item.name}
              </h3>
              <span
                className="font-serif text-lg font-medium text-primary"
                aria-label={`Precio ${item.price}`}
              >
                {item.price}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground"
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
