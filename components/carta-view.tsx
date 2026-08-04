import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { TagIcon }           from "@/lib/tag-icons"
import { CartaPrintButton }  from "@/components/carta-print-button"
import Link                  from "next/link"

interface Props {
  menu:   MenuCategory[]
  config: SiteConfig
}

export function CartaView({ menu, config }: Props) {
  const restaurantName = config.nombre ?? "Restaurante"
  const subtitle       = config.subtitulo ?? ""

  return (
    <div className="carta-root mx-auto max-w-[720px] px-8 py-12 font-serif text-foreground">

      {/* Botón volver + imprimir */}
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-light uppercase tracking-[0.3em] text-primary hover:opacity-70 transition-opacity"
        >
          ← Volver al menú
        </Link>
        <CartaPrintButton />
      </div>

      {/* Portada */}
      <header className="mb-16 text-center">
        <p className="mb-3 font-sans text-[10px] font-light uppercase tracking-[0.5em] text-primary">Carta</p>
        <h1 className="text-5xl font-medium tracking-tight text-foreground">{restaurantName}</h1>
        {subtitle && (
          <p className="mt-3 font-sans text-sm font-light text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="block h-px w-16 bg-primary/30" />
          <span className="font-sans text-[9px] uppercase tracking-[0.6em] text-primary/50">✦</span>
          <span className="block h-px w-16 bg-primary/30" />
        </div>
      </header>

      {/* Índice */}
      <nav className="mb-16 print:mb-8">
        <p className="mb-4 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">Contenido</p>
        <ol className="space-y-1">
          {menu.map((cat, i) => (
            <li key={cat.id} className="flex items-baseline justify-between gap-2">
              <a
                href={`#carta-${cat.id}`}
                className="font-serif text-sm text-foreground hover:text-primary transition-colors"
              >
                {cat.title}
              </a>
              <span className="flex-1 border-b border-dotted border-primary/20 mx-2" />
              <span className="font-sans text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Secciones */}
      {menu.map((category, catIdx) => (
        <section
          key={category.id}
          id={`carta-${category.id}`}
          className="mb-16 scroll-mt-10 break-inside-avoid-page"
        >
          <div className="mb-8 border-b border-primary/20 pb-4">
            <p className="mb-1 font-sans text-[9px] font-light uppercase tracking-[0.5em] text-primary">
              {String(catIdx + 1).padStart(2, "0")}
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground">{category.title}</h2>
            {category.description && (
              <p className="mt-2 font-sans text-sm font-light text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          <ul className="space-y-6">
            {category.items.map((item) => (
              <li
                key={item.name}
                className={`grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b pb-6 ${
                  item.especial
                    ? "border-dashed border-primary/30"
                    : "border-dotted border-border/50"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <h3
                    className={`text-lg font-medium leading-tight ${
                      item.especial ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                    {item.especial && (
                      <span className="ml-2 font-sans text-[9px] font-light uppercase tracking-widest text-primary"> ★</span>
                    )}
                  </h3>
                </div>

                <span
                  className="self-start font-serif text-lg font-medium text-primary"
                  aria-label={`Precio ${item.price}`}
                >
                  {item.price}
                </span>

                {item.description && (
                  <p className="col-span-2 font-sans text-sm font-light leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="col-span-2 mt-1 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 font-sans text-[10px] font-light uppercase tracking-wider text-primary/60"
                      >
                        <TagIcon tag={tag} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Cierre */}
      <footer className="mt-16 text-center">
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="block h-px w-16 bg-primary/30" />
          <span className="font-sans text-[9px] uppercase tracking-[0.6em] text-primary/50">✦</span>
          <span className="block h-px w-16 bg-primary/30" />
        </div>
        {config.direccion && (
          <p className="font-sans text-xs font-light text-muted-foreground">{config.direccion}</p>
        )}
        {config.telefono && (
          <p className="font-sans text-xs font-light text-muted-foreground">{config.telefono}</p>
        )}
      </footer>
    </div>
  )
}
