interface SignatureDishItem {
  name: string
  description: string
  price: string
  tags?: string[]
}

interface SignatureDishProps {
  item?: SignatureDishItem
}

export function SignatureDish({ item }: SignatureDishProps) {
  if (!item) return null

  return (
    <div className="my-8 rounded-2xl border border-primary/20 bg-primary/5 px-8 py-10 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        Especialidad de la casa
      </p>
      <h2 className="mt-3 font-serif text-3xl font-medium text-foreground">
        {item.name}
      </h2>
      {item.description && (
        <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      )}
      <p className="mt-4 font-serif text-2xl font-medium text-primary">
        {item.price}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
