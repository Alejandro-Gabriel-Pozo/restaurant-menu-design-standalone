import Image from "next/image"

export function SignatureDish() {
  return (
    <section className="overflow-hidden rounded-lg bg-card">
      <div className="grid items-center gap-0 md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[24rem]">
          <Image
            src="/images/dish-signature.png"
            alt="Rib eye a la brasa, plato insignia de la casa"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-8 md:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Plato insignia
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-card-foreground text-balance md:text-4xl">
            Rib eye a la brasa
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Nuestra especialidad de la casa: 300 gramos de rib eye madurado durante
            28 días, sellado sobre brasa de encino y terminado con mantequilla de
            hierbas frescas del huerto. Servido con papas rústicas y vegetales al carbón.
          </p>
          <p className="mt-6 font-serif text-2xl font-medium text-primary">$420</p>
        </div>
      </div>
    </section>
  )
}
