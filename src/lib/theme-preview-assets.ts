/** Niche-coherent preview imagery (SVG in /public/niches). */

export type ThemeNiche =
  | "beauty"
  | "outdoor"
  | "retail"
  | "tech"
  | "energy"
  | "audio"
  | "home"
  | "gift"
  | "premium"
  | "tools"
  | "phone"
  | "cinema"
  | "decor"
  | "kitchen"
  | "kids";

const THEME_NICHE: Record<string, ThemeNiche> = {
  vitrine: "retail",
  minimal: "tech",
  catalogo: "retail",
  boutique: "beauty",
  urbano: "phone",
  solar: "kids",
  impeto: "beauty",
  trilha: "outdoor",
  prateleira: "retail",
  editorial: "beauty",
  multiplica: "retail",
  conceito: "tech",
  seixo: "home",
  focal: "phone",
  faisca: "energy",
  impacto: "audio",
  deposito: "retail",
  amplia: "cinema",
  extra: "gift",
  ultra: "premium",
  agora: "decor",
  monge: "kitchen",
  impecavel: "beauty",
  oficina: "tools",
};

const NICHE_PRODUCT_TITLES: Record<ThemeNiche, string[]> = {
  beauty: [
    "Aparador Premium",
    "Massageador Compacto",
    "Escova Facial LED",
    "Kit Beleza Xnamai",
    "Secador Slim",
    "Espelho Ring",
  ],
  outdoor: [
    "Lanterna Camping",
    "Bomba de Ar Portátil",
    "Garrafa Térmica Trek",
    "Kit Bike Essentials",
    "Mochila Trail",
    "Power Bank Outdoor",
  ],
  retail: [
    "Cabo USB-C 2m",
    "Organizador Casa",
    "Carregador Parede",
    "Fone TWS",
    "Suporte Celular",
    "Kit Utilidades",
  ],
  tech: [
    "Teclado Slim",
    "Mouse Silent",
    "Hub USB-C",
    "Webcam HD",
    "Suporte Notebook",
    "SSD Portátil",
  ],
  energy: [
    "Power Bank 20.000",
    "Carregador Wireless",
    "Cabo Turbo",
    "Fonte GaN 65W",
    "Bateria Portátil",
    "Carregador Veicular",
  ],
  audio: [
    "Caixa Bluetooth",
    "Fone Headphone",
    "Sound Bar Mini",
    "Fone TWS Pro",
    "Microfone Lapela",
    "Adaptador Áudio",
  ],
  home: [
    "Organizador Closet",
    "Luminária Mesa",
    "Kit Cozinha",
    "Cesto Lavanderia",
    "Cabideiro Slim",
    "Dispenser",
  ],
  gift: [
    "Kit Presente Kids",
    "Boneco Colecionável",
    "Luminária Infantil",
    "Fone Colorido",
    "Garrafa Kids",
    "Decoração Natal",
  ],
  premium: [
    "Smartwatch Ultra",
    "Fone Premium",
    "Carregador MagSafe",
    "Case Couro",
    "Hub Premium",
    "Relógio Esportivo",
  ],
  tools: [
    "Kit Chaves B-Tek",
    "Lanterna Técnica",
    "Trena Digital",
    "Multímetro",
    "Maleta Ferramentas",
    "Alicate Precision",
  ],
  phone: [
    "Capa MagSafe",
    "Película Nano",
    "Suporte Carro",
    "Cabo Lightning",
    "Ring Light Selfie",
    "Power Bank Slim",
  ],
  cinema: [
    "Sound Bar",
    "Suporte TV",
    "Streaming Stick",
    "Controle Universal",
    "Cabo HDMI 2.1",
    "Luminária Ambiente",
  ],
  decor: [
    "Luminária Arco",
    "Vaso Decor",
    "Quadro LED",
    "Abajur Soft",
    "Kit Velas",
    "Espelho Decor",
  ],
  kitchen: [
    "Utensílio Silicone",
    "Organizador Gaveta",
    "Garrafa Hermética",
    "Kit Medidores",
    "Escorredor",
    "Pote Vidro",
  ],
  kids: [
    "Brinquedo Sensorial",
    "Fone Kids",
    "Luminária Estrela",
    "Garrafa Colorida",
    "Kit Desenho",
    "Pelúcia Mini",
  ],
};

export function nicheForTheme(themeId: string): ThemeNiche {
  return THEME_NICHE[themeId] || "retail";
}

export function themeHeroImage(themeId: string): string {
  return `/niches/hero-${nicheForTheme(themeId)}.svg`;
}

export function themeTileImages(themeId: string, count = 4): string[] {
  const niche = nicheForTheme(themeId);
  return Array.from(
    { length: count },
    (_, i) => `/niches/prod-${niche}-${(i % 6) + 1}.svg`,
  );
}

export function themeProductImages(themeId: string, count = 6): string[] {
  return themeTileImages(themeId, count);
}

export function nicheProductTitles(themeId: string): string[] {
  return NICHE_PRODUCT_TITLES[nicheForTheme(themeId)];
}
