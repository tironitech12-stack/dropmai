import type { DropmaiPuckProps } from "@/puck/config";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import {
  themeHeroImage,
  themeTileImages,
} from "@/lib/theme-preview-assets";
import { thematicById } from "@/lib/thematic-presets";
import type { ThemeSettings } from "@/lib/themes";
import { isDenseTheme } from "@/lib/themes";

type Block = {
  type: keyof DropmaiPuckProps;
  props: Record<string, unknown>;
};

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

type Ctx = {
  storeName: string;
  themeId: string;
  settings: ThemeSettings;
  heroImg: string;
  tiles: string[];
  dense: boolean;
};

function baseCtx(
  storeName: string,
  themeId: string,
  settings?: ThemeSettings | null,
): Ctx {
  const fallback = buildDefaultSettingsClient(themeId, storeName);
  const merged = settings ?? fallback;
  const thematic = thematicById(themeId);
  return {
    storeName,
    themeId,
    settings: merged,
    heroImg: themeHeroImage(themeId),
    tiles: themeTileImages(themeId, 4),
    dense: isDenseTheme(themeId) || Boolean(thematic?.dense),
  };
}

function ann(text: string): Block {
  return { type: "AnnouncementBar", props: { id: uid("ann"), text } };
}
function mega(brand: string, links: string): Block {
  return {
    type: "MegaHeader",
    props: { id: uid("mega"), brandName: brand, links, showSearch: true },
  };
}
function hdr(brand: string): Block {
  return {
    type: "StoreHeader",
    props: { id: uid("hdr"), brandName: brand, showNav: true },
  };
}
function hero(
  c: Ctx,
  opts: {
    title: string;
    subtitle: string;
    cta: string;
    overlay?: boolean;
    eyebrow?: string;
  },
): Block {
  return {
    type: "HeroSection",
    props: {
      id: uid("hero"),
      eyebrow: opts.eyebrow ?? c.settings.brand.tagline ?? "",
      title: opts.title,
      subtitle: opts.subtitle,
      ctaLabel: opts.cta,
      ctaHref: "#produtos",
      overlay: Boolean(opts.overlay),
      imageUrl: c.heroImg,
    },
  };
}
function benefits(items: string): Block {
  return { type: "BenefitStrip", props: { id: uid("ben"), items } };
}
function promo(text: string, code = ""): Block {
  return { type: "PromoBar", props: { id: uid("promo"), text, code } };
}
function marquee(text: string): Block {
  return { type: "MarqueeStrip", props: { id: uid("mq"), text } };
}
function tiles(c: Ctx, title: string, labels: string): Block {
  return {
    type: "CollectionTiles",
    props: {
      id: uid("tiles"),
      title,
      tiles: labels,
      imageUrls: c.tiles.join("|"),
    },
  };
}
function iwt(
  c: Ctx,
  heading: string,
  body: string,
  side: "left" | "right" = "left",
  imgIndex = 0,
): Block {
  return {
    type: "ImageWithText",
    props: {
      id: uid("iwt"),
      heading,
      body,
      ctaLabel: "Ver produtos",
      ctaHref: "#produtos",
      imageSide: side,
      imageUrl: c.tiles[imgIndex] || c.heroImg,
    },
  };
}
function featured(c: Ctx, title: string, limit: number, dense?: boolean): Block {
  return {
    type: "FeaturedProducts",
    props: {
      id: uid("feat"),
      title,
      limit,
      dense: dense ?? c.dense,
    },
  };
}
function row(title: string, limit = 4): Block {
  return {
    type: "FeaturedRow",
    props: { id: uid("row"), title, limit },
  };
}
function promoTiles(
  c: Ctx,
  leftTitle: string,
  leftBody: string,
  rightTitle: string,
  rightBody: string,
): Block {
  return {
    type: "PromoTiles",
    props: {
      id: uid("pt"),
      leftTitle,
      leftBody,
      rightTitle,
      rightBody,
      leftImage: c.tiles[0],
      rightImage: c.tiles[1],
    },
  };
}
function trust(items: string): Block {
  return { type: "TrustRow", props: { id: uid("trust"), items } };
}
function faq(title: string, items: string): Block {
  return { type: "FaqSection", props: { id: uid("faq"), title, items } };
}
function testimonials(title: string, quotes: string): Block {
  return {
    type: "Testimonials",
    props: { id: uid("tes"), title, quotes },
  };
}
function stl(title: string, caption: string): Block {
  return {
    type: "ShopTheLook",
    props: { id: uid("stl"), title, caption },
  };
}
function rich(heading: string, body: string): Block {
  return {
    type: "RichText",
    props: { id: uid("rich"), heading, body },
  };
}
function footer(text: string): Block {
  return { type: "StoreFooter", props: { id: uid("ftr"), text } };
}

/** 6–10 distinct sections per theme — Shopify-inspired, first-party. */
export function blueprintBlocks(
  storeName: string,
  themeId: string,
  settings?: ThemeSettings | null,
): Block[] {
  const c = baseCtx(storeName, themeId, settings);
  const brand = c.settings.brand.name || storeName;
  const t = thematicById(themeId);

  switch (themeId) {
    case "impeto":
      return [
        ann("Kit beleza · Frete sob demanda · DROPMAI"),
        marquee("PELE VIVA · ESTÉTICA BOLD · XNAMAI"),
        hdr(brand),
        hero(c, {
          title: "PELE VIVA,",
          subtitle: "Curadoria bold para estética e cuidados com aparência.",
          cta: "Explorar",
          overlay: true,
          eyebrow: "Beleza / estética",
        }),
        tiles(c, "Categorias beleza", "Estética | Barbeador | Massageador | Relógios"),
        featured(c, "Em cena", 8),
        promoTiles(c, "Aparadores", "Linha bold", "Massageadores", "Recuperação"),
        testimonials(
          "Quem usa",
          "Acabamento impecável|Ana||Entrega rápida e produto top|Bruno",
        ),
        footer("Ímpeto · Dropmai"),
      ];
    case "trilha":
      return [
        ann("Camping · Esporte · Frete sob demanda"),
        mega(brand, "Camping|Esporte|Bike|Mobilidade"),
        hero(c, {
          title: "Pronto pra trilha",
          subtitle: "Cards amplos para outdoor, bike e mobilidade Xnamai.",
          cta: "Ver coleção",
        }),
        tiles(c, "Terrenos", "Camping | Esporte | Bike | Mobilidade"),
        promoTiles(c, "Bike week", "Acessórios leves", "Camping kit", "Noite sob as estrelas"),
        featured(c, "Em movimento", 8),
        iwt(c, "Performance no dia a dia", "Foto ampla e cantos arredondados — DNA Coco, first-party Dropmai.", "right", 2),
        trust("Frete sob demanda:checkout|Estoque Xnamai:fornecedor|Troca fácil:7 dias|Suporte:chat"),
        footer("Trilha · Dropmai"),
      ];
    case "prateleira":
      return [
        promo("Flash da semana — copie o cupom", "DROPMAI10"),
        benefits(
          "Frete sob demanda | Estoque no fornecedor | Troca facilitada | Aberto todo dia",
        ),
        mega(brand, "Celular|Casa|Informática|Energia|Ofertas"),
        hero(c, {
          title: "Top specs. Preço justo.",
          subtitle: "Varejo de catálogo grande com clusters do fornecedor Xnamai.",
          cta: "Ver catálogo",
        }),
        tiles(c, "Departamentos", "Celular | Casa | Informática | Energia"),
        featured(c, "Mais vendidos", 24, true),
        row("Tendências da semana", 4),
        faq(
          "Ajuda na compra",
          "Como funciona o frete?|Calculado no checkout com o fornecedor.||Posso trocar?|Sim, política da loja + suporte Dropmai.",
        ),
        footer("Prateleira · Dropmai"),
      ];
    case "editorial":
      return [
        ann("Edição da semana · Frete sob demanda"),
        hdr(brand),
        hero(c, {
          title: "Sua coleção em revista",
          subtitle: "Lookbook para beleza e lifestyle com produtos Xnamai.",
          cta: "Abrir lookbook",
          overlay: true,
        }),
        tiles(c, "Coleções", "Estética | Luminárias | Bolsas | Decoração"),
        iwt(c, "História da marca", "Combine foto lifestyle com o markup da sua loja.", "left", 0),
        featured(c, "Em vitrine", 8),
        stl("Monte o look", "Pins nos produtos publicados da vitrine."),
        testimonials(
          "Vozes da edição",
          "Parece revista de moda|Carla||Lookbook vendeu na primeira semana|Diego",
        ),
        footer("Editorial · Dropmai"),
      ];
    case "multiplica":
      return [
        ann("Mix de categorias · Atualizado com Xnamai"),
        hdr(brand),
        hero(c, {
          title: "Multiplique as vitrines",
          subtitle: "Módulos 2×2 para destacar clusters diferentes sem bagunça.",
          cta: "Ver módulos",
        }),
        tiles(c, "Módulos", t?.tiles || "Celular | Casa | Beleza | Energia"),
        promoTiles(c, "Bloco A", "Lançamentos", "Bloco B", "Mais pedidos"),
        featured(c, "Em alta", 8),
        row("Strip de tendências", 4),
        marquee("MULTIPLICA · GRID · XNAMAI"),
        footer("Multiplica · Dropmai"),
      ];
    case "conceito":
      return [
        hdr(brand),
        hero(c, {
          title: "Menos ruído. Mais tech.",
          subtitle: "Whitespace generoso para informática e gadgets limpos.",
          cta: "Ver seleção",
          eyebrow: "Informática",
        }),
        rich(
          "Design quieto",
          "Hero curto, tipografia afiada e grade respirável — Concept first-party.",
        ),
        featured(c, "Seleção", 6),
        iwt(c, "Detalhe que importa", "Foco em teclados, hubs e periféricos Xnamai.", "right", 1),
        trust("Envio sob demanda:checkout|Garantia:fornecedor|Suporte:Dropmai"),
        footer("Conceito · Dropmai"),
      ];
    case "seixo":
      return [
        ann("Casa calma · Organizadores e utilidades"),
        hdr(brand),
        hero(c, {
          title: "Cantos suaves, casa organizada",
          subtitle: "Tom pedra para utilidades domésticas Xnamai.",
          cta: "Ver casa",
        }),
        iwt(c, "Organização sem pressa", "Cards soft para lavanderia, cozinha e closet.", "left", 0),
        tiles(c, "Ambientes", "Organizers | Cozinha | Lavanderia | Decor"),
        featured(c, "Para a casa", 8),
        testimonials(
          "Em casa",
          "Ficou aconchegante|Lia||Utilidades com cara de boutique|Rafa",
        ),
        footer("Seixo · Dropmai"),
      ];
    case "focal":
      return [
        ann("Celular em close · Capas, películas e gadgets"),
        mega(brand, "Capas|Películas|Cabos|Suportes|Energia"),
        hero(c, {
          title: "Produto em foco",
          subtitle: "Hero fotográfico para acessórios de celular Xnamai.",
          cta: "Ver capas",
          overlay: true,
          eyebrow: "Focal",
        }),
        tiles(c, "Acessórios", "Capas | Películas | Cabos | Suportes"),
        featured(c, "Em destaque", 8),
        promoTiles(c, "MagSafe", "Linha magnética", "Película nano", "Proteção total"),
        iwt(c, "Close-up que vende", "Cards com sombra de lente — DNA Focal, first-party.", "right", 2),
        faq(
          "Dúvidas rápidas",
          "Serve no meu modelo?|Confira a ficha do produto Xnamai.||Tem película?|Sim, cluster películas no catálogo.",
        ),
        footer("Focal · Dropmai"),
      ];
    case "faisca":
      return [
        promo("Energia em flash — cupom elétrico", "VOLT10"),
        marquee("CARREGUE · POWER BANK · GaN · WIRELESS"),
        hdr(brand),
        hero(c, {
          title: "Mais voltagem na vitrine",
          subtitle: "Power banks, GaN e wireless do catálogo Xnamai.",
          cta: "Ver energia",
          overlay: true,
        }),
        benefits("Envio rápido | Cabos inclusos | Garantia fornecedor | Cupom VOLT10"),
        tiles(c, "Potência", "Power bank | Wireless | GaN | Veicular"),
        featured(c, "Alta descarga", 8),
        trust("Carga rápida:PD|Segurança:proteção|Estoque:Xnamai"),
        footer("Faísca · Dropmai"),
      ];
    case "impacto":
      return [
        ann("Áudio em bloco — caixas, fones e sound bars"),
        hdr(brand),
        hero(c, {
          title: "VOLUME NO MÁXIMO",
          subtitle: "Contraste alto para áudio e fones Xnamai.",
          cta: "Ouvir catálogo",
          overlay: true,
        }),
        marquee("BASS · TWS · SOUND BAR · IMPACTO"),
        featured(c, "Playlist da loja", 8),
        promoTiles(c, "Caixas", "Bluetooth forte", "Fones", "TWS e head"),
        iwt(c, "Blocos largos", "Tipografia pesada e seções cheias — Impact first-party.", "left", 1),
        footer("Impacto · Dropmai"),
      ];
    case "deposito":
      return [
        benefits("Preço claro | Grade densa | Atacado-friendly | Xnamai sync"),
        mega(brand, "Utilidades|Eletrônicos|Casa|Cabos|Ofertas"),
        hero(c, {
          title: "Depósito aberto",
          subtitle: "Lista densa, preço grande, pouco ornamento.",
          cta: "Abrir lista",
        }),
        featured(c, "Pronta entrega", 24, true),
        promo("Lote da semana", "LOTE5"),
        faq(
          "Atacado",
          "Tem preço de volume?|Use markup da loja sobre o custo Xnamai.||Nota fiscal?|Conforme operação do seller.",
        ),
        footer("Depósito · Dropmai"),
      ];
    case "amplia":
      return [
        ann("Entretenimento wide — TV, monitores e áudio"),
        hdr(brand),
        hero(c, {
          title: "Tela cheia. Vitrine cinema.",
          subtitle: "Hero wide para monitores, TV e sound bars Xnamai.",
          cta: "Ver sala",
          overlay: true,
        }),
        tiles(c, "Sala", "Monitores | Sound bar | HDMI | Streaming"),
        featured(c, "Em cartaz", 9),
        iwt(c, "Experiência wide", "Grade 3 colunas e hero cinema — Maximize first-party.", "right", 0),
        trust("Imagem:4K-ready|Áudio:sound bar|Cabos:HDMI 2.1"),
        footer("Amplia · Dropmai"),
      ];
    case "extra":
      return [
        ann("Presentes e kids · Ocasiões o ano todo"),
        marquee("PRESENTE · KIDS · NATAL · EXTRA"),
        hdr(brand),
        hero(c, {
          title: "Surpresa na vitrine",
          subtitle: "Tiles de ocasião para kids, brinquedos e presentes Xnamai.",
          cta: "Ver presentes",
        }),
        tiles(c, "Ocasiões", "Kids | Natal | Aniversário | Gadgets"),
        promoTiles(c, "Kids", "Cores alegres", "Natal", "Decoração"),
        featured(c, "Para presentear", 8),
        testimonials(
          "Presenteou",
          "Embalagem linda|Mari||Criançada aprovou|Pedro",
        ),
        footer("Extra · Dropmai"),
      ];
    case "ultra":
      return [
        ann("Linha premium · Smartwatch e acabamento"),
        hdr(brand),
        hero(c, {
          title: "Ultra. Sem excesso.",
          subtitle: "Escuro premium com ouro suave para smartwatches Xnamai.",
          cta: "Ver premium",
          overlay: true,
          eyebrow: "Ultra",
        }),
        featured(c, "Seleção ultra", 6),
        iwt(c, "Acabamento", "Cards glass e tipografia contida — Ultra first-party.", "left", 2),
        trust("Premium:acabamento|Garantia:estendida|Suporte:concierge"),
        rich("Quiet luxury tech", "Menos blocos, mais presença."),
        footer("Ultra · Dropmai"),
      ];
    case "agora":
      return [
        ann("Decoração e luminárias · Colunas editoriais"),
        hdr(brand),
        hero(c, {
          title: "Luz, forma, espaço",
          subtitle: "Ágora clássica para decoração e luminárias Xnamai.",
          cta: "Ver ambiente",
        }),
        iwt(c, "Coluna editorial", "Serif leve e storytelling de ambiente.", "left", 0),
        tiles(c, "Espaços", "Luminárias | Decor | Móveis | Ring light"),
        featured(c, "Em exposição", 8),
        rich("Galeria", "Inspirado em Athens — first-party Dropmai."),
        footer("Ágora · Dropmai"),
      ];
    case "monge":
      return [
        hdr(brand),
        hero(c, {
          title: "Cozinha quieta",
          subtitle: "Quase monochrome para utensílios minimal Xnamai.",
          cta: "Ver cozinha",
          eyebrow: "Monge",
        }),
        rich("Menos ornamento", "Monk-inspired: silêncio visual, produto no centro."),
        featured(c, "Essenciais", 6),
        iwt(c, "Mão na massa", "Utensílios e organizadores com markup seu.", "right", 1),
        footer("Monge · Dropmai"),
      ];
    case "impecavel":
      return [
        ann("Beleza polished · Soft glam"),
        hdr(brand),
        hero(c, {
          title: "Impecável na pele",
          subtitle: "Rosa-stone e lookbook curto para estética Xnamai.",
          cta: "Ver beleza",
          overlay: true,
        }),
        tiles(c, "Rituais", "Estética | Escovas | Espelhos | Kits"),
        featured(c, "Rotina", 8),
        stl("Look de cuidado", "Hotspots em produtos da vitrine."),
        testimonials(
          "Glow",
          "Textura perfeita|Bia||Parece boutique|Carol",
        ),
        footer("Impecável · Dropmai"),
      ];
    case "oficina":
      return [
        ann("Ferramentas · B-Tek · DIY"),
        marquee("OFICINA · FERRAMENTAS · PRECISION · XNAMAI"),
        mega(brand, "Chaves|Lanternas|Medição|Maletas"),
        hero(c, {
          title: "Mão na massa",
          subtitle: "Industrial reto para ferramentas e utilidades técnicas.",
          cta: "Abrir oficina",
          overlay: true,
        }),
        benefits("Reto | Amarelo ferramenta | Preço claro | Estoque Xnamai"),
        featured(c, "Bancada", 12, true),
        promoTiles(c, "Kits", "Comece agora", "Lanternas", "Trabalho noturno"),
        faq(
          "Oficina",
          "Tem kit completo?|Sim, cluster ferramentas B-Tek.||Voltagem?|Confira a ficha do produto.",
        ),
        footer("Oficina · Dropmai"),
      ];
    case "minimal":
      return [
        hdr(brand),
        hero(c, {
          title: "Seleção",
          subtitle: "Objetiva. Sem ruído. Só o essencial.",
          cta: "Ver tudo",
        }),
        featured(c, "Catálogo", 8),
        rich("Tipografia limpa", "Minimal Dropmai — whitespace e produto."),
        footer("Minimal · Dropmai"),
      ];
    case "catalogo":
      return [
        benefits("Preço em evidência | Grade densa | B2B-friendly"),
        mega(brand, "Lista|Ofertas|Novidades|Ajuda"),
        hero(c, {
          title: "Pronto para pedir",
          subtitle: "Lista compacta com preço da sua loja sobre o custo Xnamai.",
          cta: "Ver catálogo",
        }),
        featured(c, "Lista de produtos", 24, true),
        faq(
          "Pedidos",
          "Como precificar?|Markup no import do catálogo.||Atualiza estoque?|Sync com fornecedor.",
        ),
        footer("Catálogo · Dropmai"),
      ];
    case "boutique":
      return [
        ann("Edição limitada · Envio cuidadoso"),
        hdr(brand),
        hero(c, {
          title: "Peças com presença",
          subtitle: "Curadoria visual para moda, beleza e lifestyle.",
          cta: "Ver coleção",
          overlay: true,
        }),
        iwt(c, "Editorial boutique", "Serif + foto — boutique first-party.", "left", 0),
        featured(c, "Em destaque", 8),
        stl("Look da semana", "Pins nos produtos da loja."),
        footer("Boutique · Dropmai"),
      ];
    case "urbano":
      return [
        ann("Drop semanal · Street"),
        marquee("DROP · STREET · URBANO · XNAMAI"),
        hdr(brand),
        hero(c, {
          title: "Novo drop",
          subtitle: "Contraste alto para sneaker culture e gadgets urbanos.",
          cta: "Shop now",
          overlay: true,
        }),
        tiles(c, "No radar", "Capas | Fones | Relógios | Energia"),
        featured(c, "No radar", 8),
        promoTiles(c, "Drop A", "Semana", "Drop B", "Restock"),
        footer("Urbano · Dropmai"),
      ];
    case "solar":
      return [
        ann("Ofertas da semana · Entrega sob demanda"),
        hdr(brand),
        hero(c, {
          title: "Achados com sol",
          subtitle: "Vitrine alegre para casa, kids e presentes.",
          cta: "Ver ofertas",
        }),
        tiles(c, "Cantos solares", "Casa | Kids | Presentes | Energia"),
        featured(c, "Mais pedidos", 8),
        promoTiles(c, "Kids", "Cores quentes", "Casa", "Dia a dia"),
        testimonials(
          "Compradores",
          "Vitrine alegre|Sofia||Vendeu bem no fim de semana|Tiago",
        ),
        footer("Solar · Dropmai"),
      ];
    case "vitrine":
    default:
      return [
        ann(
          t?.announcement ||
            c.settings.home.sections.find((s) => s.type === "announcement")
              ?.props.text?.toString() ||
            "Novidades toda semana · Frete no checkout",
        ),
        hdr(brand),
        hero(c, {
          title:
            t?.heroTitle ||
            String(
              c.settings.home.sections.find((s) => s.type === "hero")?.props
                .title || "Novidades da sua vitrine",
            ),
          subtitle:
            t?.heroSubtitle ||
            String(
              c.settings.home.sections.find((s) => s.type === "hero")?.props
                .subtitle || "",
            ),
          cta: t?.ctaLabel || "Explorar vitrine",
          overlay: Boolean(t?.overlayHero),
        }),
        tiles(c, "Categorias", t?.tiles || "Novidades | Destaques | Ofertas | Mais"),
        featured(c, t?.featuredTitle || "Destaques", t?.featuredLimit || 12),
        iwt(
          c,
          "Sua marca no domínio",
          "Publique do catálogo Xnamai e venda com a sua identidade.",
          "left",
          1,
        ),
        trust("Marca própria:domínio|Catálogo:Xnamai|Editor:Puck|Temas:Dropmai"),
        footer(t?.footerText || "Loja powered by Dropmai"),
      ];
  }
}
