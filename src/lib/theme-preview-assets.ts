/** Niche-coherent preview imagery via Unsplash CDN (stable photo IDs). */

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

/** Cropped Unsplash CDN URL — works in CSS background + <img>, no Next image config. */
function u(photoId: string, w = 900): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Hero + 6 product/tile photos per niche (Unsplash License). */
const NICHE_PHOTOS: Record<ThemeNiche, { hero: string; products: string[] }> = {
  beauty: {
    hero: u("photo-1522335789203-aabd1fc54bc9", 1400),
    products: [
      u("photo-1596462502278-27bfdc403348"),
      u("photo-1512496015851-a90fb38ba796"),
      u("photo-1571781926291-c477ebfd024b"),
      u("photo-1631214524020-7e18db9a8f92"),
      u("photo-1487412947147-5cebf100ffc2"),
      u("photo-1526045478516-99145907023c"),
    ],
  },
  outdoor: {
    hero: u("photo-1551632811-561732d1e306", 1400),
    products: [
      u("photo-1504280390367-361c6d9f38f4"),
      u("photo-1478131143081-80f7f84ca84d"),
      u("photo-1523987355523-c7b5b0dd90a7"),
      u("photo-1464822759023-fed622ff2c3b"),
      u("photo-1483728642387-6c3bdd6c93e5"),
      u("photo-1500530855697-b586d89ba3ee"),
    ],
  },
  retail: {
    hero: u("photo-1441986300917-64674bd600d8", 1400),
    products: [
      u("photo-1526170375885-4d8ecf77b99f"),
      u("photo-1505740420928-5e560c06d30e"),
      u("photo-1572635196237-14b3f281503f"),
      u("photo-1560343090-f0409e92791a"),
      u("photo-1542291026-7eec264c27ff"),
      u("photo-1523275335684-37898b6baf30"),
    ],
  },
  tech: {
    hero: u("photo-1498049794561-7780e7231661", 1400),
    products: [
      u("photo-1587829741301-dc798b83add3"),
      u("photo-1527864550417-7fd91fc51a46"),
      u("photo-1625948515291-69613efd103f"),
      u("photo-1588508065123-287b28e013da"),
      u("photo-1611532736597-de2d4265fba3"),
      u("photo-1593640408182-31c70c8268f5"),
    ],
  },
  energy: {
    hero: u("photo-1609091839311-d5365f9ff1c5", 1400),
    products: [
      u("photo-1609091839311-d5365f9ff1c5"),
      u("photo-1625948515291-69613efd103f"),
      u("photo-1588508065123-287b28e013da"),
      u("photo-1558618666-fcd25c85cd64"),
      u("photo-1519389950473-47ba0277781c"),
      u("photo-1498049794561-7780e7231661"),
    ],
  },
  audio: {
    hero: u("photo-1546435770-a3e426bf472b", 1400),
    products: [
      u("photo-1505740420928-5e560c06d30e"),
      u("photo-1484704849700-f032a568e944"),
      u("photo-1545127398-14699f92334b"),
      u("photo-1572569511254-d8f925fe2cbb"),
      u("photo-1558537348-c0f8e733989d"),
      u("photo-1618366712010-f4ae9c647dcb"),
    ],
  },
  home: {
    hero: u("photo-1616486338812-3dadae4b4ace", 1400),
    products: [
      u("photo-1586023492125-27b2c045efd7"),
      u("photo-1555041469-a586c61ea9bc"),
      u("photo-1493666438817-866a91353ca9"),
      u("photo-1484101403633-562f891dc89a"),
      u("photo-1618220179428-22790b461013"),
      u("photo-1615874959474-d609969a20ed"),
    ],
  },
  gift: {
    hero: u("photo-1513201099705-a9746e1e201f", 1400),
    products: [
      u("photo-1549465220-1a8b9238cd48"),
      u("photo-1513885535751-8b9238bd345a"),
      u("photo-1544441893-675973e31985"),
      u("photo-1607083206869-4c7672e72a8a"),
      u("photo-1512909006721-3d6018887383"),
      u("photo-1607344645866-009c320b63e0"),
    ],
  },
  premium: {
    hero: u("photo-1523275335684-37898b6baf30", 1400),
    products: [
      u("photo-1523275335684-37898b6baf30"),
      u("photo-1546868871-7041f2a55e12"),
      u("photo-1434493789847-2f02dc6ca35d"),
      u("photo-1505740420928-5e560c06d30e"),
      u("photo-1572635196237-14b3f281503f"),
      u("photo-1609081219090-a6d81d3085bf"),
    ],
  },
  tools: {
    hero: u("photo-1504148455328-c376907d081c", 1400),
    products: [
      u("photo-1530124566582-a618bc2615dc"),
      u("photo-1504148455328-c376907d081c"),
      u("photo-1581092918056-0c4c3acd3789"),
      u("photo-1423666639041-f56000c27a9a"),
      u("photo-1572981779307-38b8cabb2407"),
      u("photo-1589939705384-5185137a7f0f"),
    ],
  },
  phone: {
    hero: u("photo-1511707171634-5f897ff02aa9", 1400),
    products: [
      u("photo-1592899677977-9c10ca588bbd"),
      u("photo-1580910051074-3eb694886505"),
      u("photo-1556656793-08538906a9f8"),
      u("photo-1511707171634-5f897ff02aa9"),
      u("photo-1609091839311-d5365f9ff1c5"),
      u("photo-1565849904461-04a58ad377e0"),
    ],
  },
  cinema: {
    hero: u("photo-1593784991095-a205069470b6", 1400),
    products: [
      u("photo-1593784991095-a205069470b6"),
      u("photo-1593359677879-a4bb92f829d1"),
      u("photo-1461151304267-38535e780c79"),
      u("photo-1546435770-a3e426bf472b"),
      u("photo-1558618666-fcd25c85cd64"),
      u("photo-1574375927938-d5a98e8ffe85"),
    ],
  },
  decor: {
    hero: u("photo-1513519245088-0e12902e5a38", 1400),
    products: [
      u("photo-1513519245088-0e12902e5a38"),
      u("photo-1586023492125-27b2c045efd7"),
      u("photo-1493666438817-866a91353ca9"),
      u("photo-1616046229478-9901c5536a45"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1615529328331-f8917597711f"),
    ],
  },
  kitchen: {
    hero: u("photo-1556910103-1c02745aae4d", 1400),
    products: [
      u("photo-1556910103-1c02745aae4d"),
      u("photo-1556909114-f6e7ad7d3136"),
      u("photo-1574269909862-7e1d70bb8078"),
      u("photo-1585515320310-259814833e62"),
      u("photo-1600585152220-90363fe7e115"),
      u("photo-1600585154340-be6161a56a0c"),
    ],
  },
  kids: {
    hero: u("photo-1515488042361-ee00e0ddd4e4", 1400),
    products: [
      u("photo-1515488042361-ee00e0ddd4e4"),
      u("photo-1566576912321-d58ddd7a6088"),
      u("photo-1558060370-d644479cb6f7"),
      u("photo-1596461404969-9ae70f2830c1"),
      u("photo-1587654780291-39c9404d746b"),
      u("photo-1516627145497-ae6968895b74"),
    ],
  },
};

export function nicheForTheme(themeId: string): ThemeNiche {
  return THEME_NICHE[themeId] || "retail";
}

export function themeHeroImage(themeId: string): string {
  return NICHE_PHOTOS[nicheForTheme(themeId)].hero;
}

export function themeTileImages(themeId: string, count = 4): string[] {
  const photos = NICHE_PHOTOS[nicheForTheme(themeId)].products;
  return Array.from({ length: count }, (_, i) => photos[i % photos.length]);
}

export function themeProductImages(themeId: string, count = 6): string[] {
  return themeTileImages(themeId, count);
}

export function nicheProductTitles(themeId: string): string[] {
  return NICHE_PRODUCT_TITLES[nicheForTheme(themeId)];
}
