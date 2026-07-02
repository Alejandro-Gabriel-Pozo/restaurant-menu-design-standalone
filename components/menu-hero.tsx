import Image from "next/image"

export function MenuHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero-restaurant.png"
        alt="Interior del restaurante Casa Almendra con iluminación cálida"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-foreground/60" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-background/80">
          Cocina de autor · Est. 2014
        </p>
        <h1 className="font-serif text-5xl font-medium leading-tight text-background text-balance sm:text-6xl md:text-7xl">
          Casa Almendra
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-background/85">
          Ingredientes de temporada, técnica clásica y el fuego como protagonista.
          Descubre un menú pensado para compartir.
        </p>
        <a
          href="#entradas"
          className="mt-2 rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Ver el menú
        </a>
      </div>
    </section>
  )
}
