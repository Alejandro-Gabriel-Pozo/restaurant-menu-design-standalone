"use client"

import { useRef, useState, useEffect } from "react"
import type { MenuCategory } from "@/lib/get-menu"
import { Reveal } from "@/components/reveal"
import { TagIcon } from "@/lib/tag-icons"

export function MenuSection({ category }: { category: MenuCategory }) {
  const listRef    = useRef<HTMLUListElement>(null)
  const sentinelRef = useRef<HTMLLIElement>(null)
  const [showFade, setShowFade] = useState(false)

  useEffect(() => {
    const list     = listRef.current
    const sentinel = sentinelRef.current
    if (!list || !sentinel) return

    const checkOverflow = () => {
      setShowFade(list.scrollHeight > list.clientHeight + 8)
    }
    checkOverflow()
    window.addEventListener("resize", checkOverflow)

    const observer = new IntersectionObserver(
      ([entry]) => setShowFade(!entry.isIntersecting),
      { root: null, threshold: 0.5 }
    )
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", checkOverflow)
    }
  }, [])

  return (
    <section
      id={category.id}
      className="relative scroll-mt-28 py-14 md:py-20"
    >
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-10 flex items-stretch gap-6 md:gap-10">
          <div className="flex-1 min-w-0 md:min-w-[55%]">
            <p
              className="font-sans text-xs font-light uppercase tracking-[0.4em]"
              style={{ color: "var(--color-seccion)" }}
            >
              {category.label}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium text-foreground text-balance md:text-5xl">{category.title}</h2>
            {category.description && (
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{category.description}</p>
            )}
          </div>
          {category.imagen_url && (
            <div className="shrink-0 w-1/3 md:w-[280px]">
              <img
                src={category.imagen_url}
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Reveal>

      {/* ── Lista de platos ─────────────────────────────────────────────── */}
      <div className="relative">
        <ul ref={listRef} className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {category.items.map((item, idx) => (
            <Reveal key={item.name} delay={idx * 40}>
              <li
                data-tags={item.tags?.join(",") ?? ""}
                className="border-b pb-6 border-dashed"
                style={item.especial ? {
                  borderColor: "color-mix(in srgb, var(--color-especial) 40%, transparent)",
                } : undefined}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className="font-serif text-xl font-medium"
                    style={{ color: item.especial ? "var(--color-especial)" : "var(--foreground)" }}
                  >
                    {item.name}
                    {item.especial && (
                      <span
                        className="ml-2 font-sans text-xs font-light uppercase tracking-widest"
                        style={{ color: "var(--color-especial)" }}
                      >
                        ★
                      </span>
                    )}
                  </h3>
                  <span
                    className="shrink-0 font-serif text-lg font-medium"
                    style={{ color: "var(--color-precio)" }}
                    aria-label={`Precio ${item.price}`}
                  >
                    {item.price}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-xs font-light uppercase tracking-wider"
                        style={{
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "color-mix(in srgb, var(--color-tags) 30%, transparent)",
                          color: "var(--color-tags)",
                        }}
                      >
                        <TagIcon tag={tag} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            </Reveal>
          ))}
          <li ref={sentinelRef} aria-hidden="true" className="h-px" />
        </ul>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 transition-opacity duration-300"
          style={{
            opacity: showFade ? 1 : 0,
            background: "linear-gradient(to bottom, transparent, var(--background))",
          }}
        />
      </div>
    </section>
  )
}
