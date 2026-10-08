/* =========================================================
   PRODUCTOS DE EJEMPLO  ·  Para añadir uno nuevo, copia un bloque
   y cambia los datos. Pon tu foto en /assets/images/ y su ruta
   en "image". Si la foto no existe se muestra un marcador azul.

   featured: true → sale en la portada (máx. 8). Todos salen en la Tienda.
   type: "physical" (amigurumi) | "digital" (patrón)
   category: "amigurumi" | "patrones" | "personalizados"
   ========================================================= */
const PRODUCTS = [
  { id: 1, added: "2026-06-01", featured: true, name: "Caballito de mar", category: "amigurumi", type: "physical", price: 19.90,
    image: "assets/images/caballito.jpg", available: true,
    description: "Pequeño caballito de mar tejido a mano.",
    long: "Hecho completamente a mano con hilo de algodón. La mascota de la casa.",
    size: "15 cm", material: "Algodón", time: "2-3 días" },
  { id: 2, added: "2026-06-15", featured: true, name: "Conejo de lana", category: "amigurumi", type: "physical", price: 24.50,
    image: "assets/images/conejo.jpg", available: true,
    description: "Conejito suave con orejas largas.",
    long: "Conejo tejido en crochet con relleno hipoalergénico, ideal para regalar.",
    size: "22 cm", material: "Algodón y relleno hipoalergénico", time: "3-4 días" },
  { id: 3, added: "2026-07-01", featured: true, name: "Osito Nube", category: "amigurumi", type: "physical", price: 22.00,
    image: "assets/images/osito.jpg", available: true,
    description: "Osito blandito en tonos azules.",
    long: "Osito de puntos pequeños y tacto muy suave, con ojitos de seguridad.",
    size: "18 cm", material: "Lana acrílica suave", time: "3 días" },
  { id: 4, added: "2026-07-10", name: "Pulpo viajero", category: "amigurumi", type: "physical", price: 16.90,
    image: "assets/images/pulpo.jpg", available: false,
    description: "Pulpito de ocho patas rizadas.",
    long: "Pulpo tejido a mano. Ahora mismo agotado: se elabora bajo pedido.",
    size: "12 cm", material: "Algodón", time: "4-5 días" },
  { id: 10, added: "2026-06-05", featured: true, name: "Patrón Caballito de Mar", category: "patrones", type: "digital", price: 6.90,
    image: "assets/images/patron-caballito.jpg", available: true,
    description: "Aprende a crear tu propio caballito de mar paso a paso.",
    long: "Patrón con fotos de cada paso, esquema de puntos y consejos de montaje.",
    level: "Principiante", language: "Español", format: "PDF", pages: 14 },
  { id: 11, added: "2026-08-01", featured: true, name: "Patrón Conejo de Lana", category: "patrones", type: "digital", price: 7.50,
    image: "assets/images/patron-conejo.jpg", available: true,
    description: "Todas las vueltas para tejer un conejito.",
    long: "Patrón detallado con abreviaturas y tabla de materiales.",
    level: "Intermedio", language: "Español", format: "PDF", pages: 18 },
  { id: 20, added: "2026-07-20", featured: true, name: "Amigurumi de tu mascota", category: "personalizados", type: "physical", price: 39.00,
    image: "assets/images/mascota.jpg", available: true,
    description: "Tu perro o gato convertido en muñeco (desde 39 €).",
    long: "Envíanos fotos y elegimos juntos colores y detalles. El precio final depende del tamaño.",
    size: "Desde 15 cm", material: "Algodón", time: "7-10 días" },
  { id: 21, added: "2026-08-15", featured: true, name: "Muñeco de regalo", category: "personalizados", type: "physical", price: 45.00,
    image: "assets/images/regalo.jpg", available: true,
    description: "Un personaje o muñeco especial a tu gusto (desde 45 €).",
    long: "Cuéntanos la idea y la convertimos en una pieza única.",
    size: "A elegir", material: "Algodón", time: "10-15 días" },
  { id: 5, added: "2026-09-20", featured: true, name: "Pollito Sol", category: "amigurumi", type: "physical", price: 14.90,
    image: "assets/images/pollito.jpg", available: true,
    description: "Pollito amarillo con mejillas rosas, muy blandito.",
    long: "Pollito tejido a mano en puntos pequeños. Perfecto para regalar a los más peques.",
    size: "10 cm", material: "Algodón", time: "2 días" },
  { id: 6, added: "2026-09-28", name: "Erizo de hilo", category: "amigurumi", type: "physical", price: 18.50,
    image: "assets/images/erizo.jpg", available: true,
    description: "Erizo con púas de punto en relieve.",
    long: "Erizo tejido a mano con textura en relieve y carita sonriente.",
    size: "13 cm", material: "Algodón", time: "3 días" },
  { id: 12, added: "2026-10-01", name: "Patrón Osito Nube", category: "patrones", type: "digital", price: 6.50,
    image: "assets/images/patron-osito.jpg", available: true,
    description: "Teje tu propio osito paso a paso.",
    long: "Patrón con fotos de cada vuelta y consejos de acabado.",
    level: "Principiante", language: "Español", format: "PDF", pages: 12 },
  { id: 22, added: "2026-10-05", name: "Llavero personalizado", category: "personalizados", type: "physical", price: 12.00,
    image: "assets/images/llavero.jpg", available: true,
    description: "Mini amigurumi llavero a tu gusto.",
    long: "Cuéntanos qué animal o personaje quieres y lo tejemos en versión mini.",
    size: "6 cm", material: "Algodón", time: "5-7 días" },
];

// Imágenes de Instagram de ejemplo (sustituye por tus fotos)
const INSTAGRAM = ["insta1","insta2","insta3","insta4","insta5","insta6"].map(n => `assets/images/${n}.jpg`);
