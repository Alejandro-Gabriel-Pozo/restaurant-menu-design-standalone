export function MenuHero() {
  return (
    <section className="relative isolate overflow-hidden bg-foreground">
      <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-background/70">
          Restaurante · Los Miches, Neuquén
        </p>
        <h1 className="font-serif text-5xl font-medium leading-tight text-background text-balance sm:text-6xl md:text-7xl">
          Los Miches
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-background/80">
          Cocina regional neuquina, pastas caseras y vinos de las mejores bodegas del norte.
          Una experiencia auténtica en cada plato.
        </p>
        <a
          href="#entrada"
          className="mt-2 rounded-full bg-background px-8 py-3 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-background/90"
        >
          Ver el menú
        </a>
      </div>
    </section>
  )
}
