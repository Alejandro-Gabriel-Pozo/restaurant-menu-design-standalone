export function MenuFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-card-foreground">
            Casa Almendra
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cocina de autor con producto de temporada en el corazón de la ciudad.
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Horarios
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>Mar – Jue · 13:00 – 23:00</li>
            <li>Vie – Sáb · 13:00 – 01:00</li>
            <li>Domingo · 13:00 – 18:00</li>
            <li>Lunes · Cerrado</li>
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Reservas
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>Av. de las Almendras 42</li>
            <li>Centro Histórico</li>
            <li>+52 55 1234 5678</li>
            <li>hola@casaalmendra.mx</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Casa Almendra. Todos los derechos reservados.
      </div>
    </footer>
  )
}
