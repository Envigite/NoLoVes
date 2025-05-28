export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "tecnologia",
    name: "Tecnología",
    subcategories: [
      { id: "tv", name: "TV" },
      { id: "smartwatch", name: "Smartwatch y accesorios" },
      { id: "pc-gamer", name: "PC gamer" },
      { id: "fotografia", name: "Fotografía" },
      { id: "audio", name: "Audio" },
      { id: "computacion", name: "Computación" },
      { id: "videojuegos", name: "Videojuegos" },
      { id: "smart-home", name: "Smart home" }
    ]
  },
  {
    id: "celulares",
    name: "Celulares",
    subcategories: [
      { id: "celulares-telefonos", name: "Celulares y teléfonos" },
      { id: "accesorios-celulares", name: "Accesorios celulares" }
    ]
  },
  {
    id: "electrohogar-climatizacion",
    name: "Electrohogar y climatización",
    subcategories: [
      { id: "electrodomesticos-cocina", name: "Electrodomésticos cocina" },
      { id: "refrigeracion", name: "Refrigeración" },
      { id: "cuidado-personal", name: "Cuidado personal" },
      { id: "calefaccion", name: "Calefacción" },
      { id: "cocina", name: "Cocina" },
      { id: "lavado-planchado", name: "Lavado y Planchado" },
      { id: "aspirado-limpieza", name: "Aspirado y limpieza" },
      { id: "maquinas-cocer", name: "Máquinas de cocer" },
      { id: "equipamiento-industrial", name: "Equipamiento Industrial" },
      { id: "aire-acondicionado", name: "Aire acondicionado y ventilación" }
    ]
  },
  {
    id: "hogar-decoracion",
    name: "Hogar y decoración",
    subcategories: [
      { id: "muebles-organizacion", name: "Muebles y organización" },
      { id: "dormitorio", name: "Dormitorio" },
      { id: "menaje-cocina", name: "Menaje cocina y mesa" },
      { id: "decoracion-iluminacion", name: "Decoración e iluminación" },
      { id: "espacios-hogar", name: "Espacios del hogar" },
      { id: "bano", name: "Baño" },
      { id: "infantil", name: "Infantil" },
      { id: "electrodomesticos", name: "Electrodomésticos" }
    ]
  },
  {
    id: "belleza",
    name: "Belleza",
    subcategories: [
      { id: "perfumes", name: "Perfumes" },
      { id: "cuidado-capilar", name: "Cuidado capilar y barbería" },
      { id: "belleza-coreana", name: "Belleza Coreana" },
      { id: "cuidado-piel", name: "Cuidado de la piel" },
      { id: "dermocosmetica", name: "Dermocosmética" },
      { id: "maquillaje", name: "Maquillaje" },
      { id: "marcas-exclusivas", name: "Marcas Exclusivas" }
    ]
  },
  {
    id: "mujer",
    name: "Mujer",
    subcategories: [
      { id: "ropa-mujer", name: "Ropa" },
      { id: "ropa-interior-mujer", name: "Ropa interior y pijamas" },
      { id: "ropa-deportiva-mujer", name: "Ropa deportiva" },
      { id: "zapatos-mujer", name: "Zapatos" },
      { id: "accesorios-mujer", name: "Accesorios" }
    ]
  },
  {
    id: "hombre",
    name: "Hombre",
    subcategories: [
      { id: "ropa-hombre", name: "Ropa" },
      { id: "ropa-deportiva-hombre", name: "Ropa deportiva" },
      { id: "ropa-interior-hombre", name: "Ropa interior y pijamas" },
      { id: "zapatos-hombre", name: "Zapatos" },
      { id: "cuidado-personal-hombre", name: "Cuidado personal" },
      { id: "accesorios-hombre", name: "Accesorios" }
    ]
  },
  {
    id: "ninos-jugueteria",
    name: "Niños y juguetería",
    subcategories: [
      { id: "ropa-ninas-0-24", name: "Ropa de niñas 0-24 meses" },
      { id: "ropa-ninas-2-8", name: "Ropa de niñas 2-8 años" },
      { id: "ropa-ninas-8-16", name: "Ropa de niñas 8-16 años" },
      { id: "ropa-ninos-0-24", name: "Ropa de niños 0-24 meses" },
      { id: "ropa-ninos-2-8", name: "Ropa de niños 2-8 años" },
      { id: "ropa-ninos-8-16", name: "Ropa de niños 8-16 años" },
      { id: "zapatos-ninos", name: "Zapatos" },
      { id: "juguetes-0-1", name: "Juguetería 0-1 año" },
      { id: "juguetes-2-3", name: "Juguetería 2-3 años" },
      { id: "juguetes-4-5", name: "Juguetería 4-5 años" },
      { id: "juguetes-6-8", name: "Juguetería 6-8 años" },
      { id: "juguetes-9-11", name: "Juguetería 9-11 años" },
      { id: "juguetes-12", name: "Juguetería +12 años" },
      { id: "juegos-exterior", name: "Juegos de exterior" }
    ]
  },
  {
    id: "zapatos-zapatillas",
    name: "Zapatos y Zapatillas",
    subcategories: [
      { id: "zapatos-hombre", name: "Hombre" },
      { id: "zapatos-mujer", name: "Mujer" },
      { id: "zapatos-nino", name: "Niño" }
    ]
  },
  {
    id: "jardin-terraza",
    name: "Jardín y Terraza",
    subcategories: [
      { id: "terrazas", name: "Terrazas" },
      { id: "piscina", name: "Mundo piscina" },
      { id: "juegos-exterior", name: "Juegos de exterior" },
      { id: "herramientas-jardin", name: "Herramientas y maquinaria de jardín" },
      { id: "parrillas", name: "Parrillas" },
      { id: "jardin", name: "Jardín" },
      { id: "iluminacion-exterior", name: "Iluminación Exterior" }
    ]
  },
  {
    id: "deportes-aire-libre",
    name: "Deportes y aire libre",
    subcategories: [
      { id: "ropa-deportiva-mujer", name: "Ropa deportiva mujer" },
      { id: "ropa-deportiva-hombre", name: "Ropa deportiva hombre" },
      { id: "ciclismo", name: "Ciclismo" },
      { id: "camping", name: "Camping" },
      { id: "disciplinas", name: "Disciplinas" },
      { id: "fitness", name: "Fitness" },
      { id: "electromovilidad", name: "Electromovilidad" },
      { id: "vitaminas-suplementos", name: "Vitaminas y suplementos" }
    ]
  },
  {
    id: "mascotas",
    name: "Mascotas",
    subcategories: [
      { id: "perros", name: "Perros" },
      { id: "gatos", name: "Gatos" },
      { id: "aves", name: "Aves" },
      { id: "conejo-hamsters", name: "Conejo y hamsters" },
      { id: "tortugas-peces-reptiles", name: "Tortugas - peces y reptiles" },
      { id: "pet-lovers", name: "Pet lovers" }
    ]
  },
  {
    id: "construccion",
    name: "Construcción",
    subcategories: [
      { id: "materiales-construccion", name: "Materiales de construcción" },
      { id: "maderas-tableros", name: "Maderas y tableros" },
      { id: "ventanas", name: "Ventanas" },
      { id: "herramientas-maquinas", name: "Herramientas y máquinas" },
      { id: "techos-aislantes", name: "Techos y aislantes" },
      { id: "puertas", name: "Puertas" },
      { id: "electricidad", name: "Electricidad" }
    ]
  },
  {
    id: "ferreteria",
    name: "Ferretería",
    subcategories: [
      { id: "cerraduras-quincalleria", name: "Cerraduras y quincallería" },
      { id: "tornillos-clavos-fijaciones", name: "Tornillos - clavos y fijaciones" },
      { id: "gasfiteria", name: "Gasfitería" },
      { id: "electricidad", name: "Electricidad" },
      { id: "seguridad", name: "Seguridad" },
      { id: "ropa-proteccion", name: "Ropa y Protección" }
    ]
  },
  {
    id: "herramientas-maquinaria",
    name: "Herramientas y maquinaria",
    subcategories: [
      { id: "herramientas-electricas", name: "Herramientas eléctricas" },
      { id: "herramientas-manuales", name: "Herramientas manuales" },
      { id: "medicion-trazado", name: "Medición y trazado" },
      { id: "maquinas-complementos", name: "Máquinas y complementos" },
      { id: "jardin", name: "Jardín" },
      { id: "organizacion", name: "Organización" },
      { id: "herramientas-especialidad", name: "Herramientas por especialidad" },
      { id: "arriendo-herramientas", name: "Arriendo de herramientas" }
    ]
  },
  {
    id: "pisos-pinturas-terminaciones",
    name: "Pisos, pinturas y terminaciones",
    subcategories: [
      { id: "pisos-revestimientos", name: "Pisos y revestimientos" },
      { id: "pinturas", name: "Pinturas" },
      { id: "puertas", name: "Puertas" },
      { id: "adhesivos-fragues", name: "Adhesivos y fragües" },
      { id: "cerraduras-quincalleria", name: "Cerraduras y quincallería" },
      { id: "protecciones", name: "Protecciones" },
      { id: "ventanas", name: "Ventanas" }
    ]
  },
  {
    id: "automotriz",
    name: "Automotriz",
    subcategories: [
      { id: "neumaticos-llantas", name: "Neumáticos y llantas" },
      { id: "detailing", name: "Detailing" },
      { id: "accesorios-exterior", name: "Accesorios de exterior" },
      { id: "accesorios-interior", name: "Accesorios de interior" },
      { id: "audio-video", name: "Audio y video" },
      { id: "motos", name: "Motos" },
      { id: "repuestos-autopartes", name: "Repuestos y autopartes" },
      { id: "herramientas-equipos", name: "Herramientas y equipos mecánicos" },
      { id: "seguridad", name: "Seguridad" },
      { id: "liquidos-lubricantes", name: "Líquidos y lubricantes" }
    ]
  },
  {
    id: "otras-categorias",
    name: "Otras categorías",
    subcategories: [
      { id: "supermercado", name: "Supermercado" },
      { id: "instrumentos-musicales", name: "Instrumentos musicales" },
      { id: "arte-manualidades", name: "Arte y manualidades" },
      { id: "libros", name: "Libros" },
      { id: "maleteria-viajes", name: "Maletería y viajes" },
      { id: "fiestas-celebraciones", name: "Fiestas y celebraciones" },
      { id: "tejido-bordado-costura", name: "Tejido - bordado y costura" },
      { id: "articulos-libreria", name: "Artículos de librería" },
      { id: "salud-insumos-medicos", name: "Salud e insumos médicos" },
      { id: "gift-cards", name: "Gift cards" }
    ]
  },
  {
    id: "experiencia-servicios",
    name: "Experiencia y servicios",
    subcategories: [
      { id: "moda", name: "Moda" },
      { id: "segunda-vida", name: "Segunda vida" },
      { id: "novios", name: "Novios" },
      { id: "belleza", name: "Belleza" },
      { id: "tecnologia", name: "Tecnología" },
      { id: "servicios-hogar", name: "Servicios hogar" },
      { id: "clubes", name: "Clubes" }
    ]
  }
]; 