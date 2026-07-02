export type MenuItem = {
  name: string
  description: string
  price: string
  tags?: string[]
}

export type MenuCategory = {
  id: string
  label: string
  title: string
  description: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: "entradas",
    label: "Entradas",
    title: "Para empezar",
    description: "Pequeños bocados pensados para abrir el apetito y compartir.",
    items: [
      {
        name: "Burrata de la casa",
        description:
          "Burrata cremosa sobre tomate confitado, albahaca fresca y aceite de oliva virgen extra.",
        price: "$185",
        tags: ["Vegetariano"],
      },
      {
        name: "Tuétano asado",
        description:
          "Hueso de tuétano al carbón con sal de mar, chimichurri y pan de masa madre tostado.",
        price: "$165",
      },
      {
        name: "Ceviche de la temporada",
        description:
          "Pescado del día curado en leche de tigre, aguacate, cebolla morada y cilantro.",
        price: "$210",
        tags: ["Del chef"],
      },
      {
        name: "Croquetas de jamón",
        description:
          "Croquetas cremosas de jamón serrano con alioli suave de ajo negro.",
        price: "$140",
      },
    ],
  },
  {
    id: "principales",
    label: "Platos fuertes",
    title: "Platos fuertes",
    description: "Nuestras especialidades, preparadas al momento con producto de temporada.",
    items: [
      {
        name: "Rib eye a la brasa",
        description:
          "300g de rib eye madurado, mantequilla de hierbas, papas rústicas y vegetales al carbón.",
        price: "$420",
        tags: ["Especialidad"],
      },
      {
        name: "Risotto de hongos",
        description:
          "Arroz arborio cremoso con hongos silvestres, parmesano añejo y aceite de trufa.",
        price: "$285",
        tags: ["Vegetariano"],
      },
      {
        name: "Salmón a la parrilla",
        description:
          "Filete de salmón con costra de hierbas, puré de coliflor y beurre blanc cítrico.",
        price: "$310",
      },
      {
        name: "Pappardelle al ragú",
        description:
          "Pasta fresca al huevo con ragú de cordero cocido a fuego lento durante ocho horas.",
        price: "$295",
      },
    ],
  },
  {
    id: "postres",
    label: "Postres",
    title: "Dulce final",
    description: "El cierre perfecto para una comida memorable.",
    items: [
      {
        name: "Fondant de chocolate",
        description:
          "Pastel de chocolate con centro fundido, helado de vainilla bourbon y crumble de cacao.",
        price: "$135",
      },
      {
        name: "Tarta de limón",
        description:
          "Base de galleta artesanal, crema de limón y merengue tostado al momento.",
        price: "$120",
        tags: ["Vegetariano"],
      },
      {
        name: "Flan de la abuela",
        description:
          "Flan tradicional de huevo con caramelo casero y un toque de canela.",
        price: "$110",
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    title: "Para acompañar",
    description: "Selección de coctelería de autor, vinos y bebidas sin alcohol.",
    items: [
      {
        name: "Vino tinto de la casa",
        description: "Copa de tinto seleccionado por nuestro sommelier. Consultar añada.",
        price: "$95",
      },
      {
        name: "Mezcal Old Fashioned",
        description:
          "Mezcal artesanal, bitter de naranja, agave y toque ahumado.",
        price: "$150",
        tags: ["Coctel de autor"],
      },
      {
        name: "Limonada de hierbabuena",
        description: "Limón fresco, hierbabuena del huerto y agua mineral.",
        price: "$65",
        tags: ["Sin alcohol"],
      },
      {
        name: "Café de olla",
        description: "Café de altura con piloncillo, canela y naranja.",
        price: "$55",
        tags: ["Sin alcohol"],
      },
    ],
  },
]
