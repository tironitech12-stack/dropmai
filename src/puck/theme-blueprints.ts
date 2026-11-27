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
function collage(c: Ctx, title: string, captions: string): Block {
  return {
    type: "Collage",
    props: {
      id: uid("col"),
      title,
      captions,
      imageUrls: [c.heroImg, c.tiles[0], c.tiles[1]].filter(Boolean).join("|"),
    },
  };
}
function video(
  c: Ctx,
  heading: string,
  body: string,
  cta = "Ver produtos",
): Block {
  return {
    type: "VideoSection",
    props: {
      id: uid("vid"),
      heading,
      body,
      ctaLabel: cta,
      posterUrl: c.heroImg,
    },
  };
}
function newsletter(
  heading: string,
  body: string,
  buttonLabel = "Inscrever",
): Block {
  return {
    type: "Newsletter",
    props: {
      id: uid("nl"),
      heading,
      body,
      buttonLabel,
      placeholder: "seu@email.com",
    },
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
      // Crush energy — CAPS overlay + dark announce + marquee + promo
      return [
        ann("KIT BELEZA · FRETE SOB DEMANDA · DROPMAI"),
        promo("FLASH BELEZA — cupom da semana", "IMPACTO10"),
        marquee("PELE VIVA · ESTÉTICA BOLD · APARADORES · MASSAGEADORES · XNAMAI"),
        hdr(brand),
        hero(c, {
          title: "PELE VIVA,",
          subtitle: "CURADORIA BOLD PARA ESTÉTICA E CUIDADOS COM APARÊNCIA.",
          cta: "EXPLORAR",
          overlay: true,
          eyebrow: "BELEZA / ESTÉTICA",
        }),
        collage(c, "CENA BOLD", "Estética | Aparador | Massageador"),
        promoTiles(c, "APARADORES", "Linha bold", "MASSAGEADORES", "Recuperação"),
        featured(c, "EM CENA", 8),
        newsletter("DROP ÍMPETO", "Avisos CAPS de beleza e estética Xnamai."),
        footer("Ímpeto · Dropmai · ref Crush"),
      ];
    case "trilha":
      // Ride free-ref — marquee energy + video poster + outdoor
      return [
        ann("Camping · Esporte · Frete sob demanda"),
        marquee("TRAIL · BIKE · CAMPING · MOBILIDADE · RIDE ENERGY"),
        mega(brand, "Camping|Esporte|Bike|Mobilidade"),
        hero(c, {
          title: "Pronto pra trilha",
          subtitle: "Foto ampla e energia outdoor para bike, camping e esporte Xnamai.",
          cta: "Ver coleção",
          overlay: true,
          eyebrow: "Outdoor · Ride",
        }),
        video(
          c,
          "No ritmo da trilha",
          "Poster cinematográfico — vocabulário Ride (Shopify free), first-party Dropmai.",
          "Ver outdoor",
        ),
        tiles(c, "Terrenos", "Camping | Esporte | Bike | Mobilidade"),
        promoTiles(c, "Bike week", "Acessórios leves", "Camping kit", "Noite sob as estrelas"),
        featured(c, "Em movimento", 8),
        newsletter("Drops outdoor", "Avisos de camping, bike e mobilidade."),
        footer("Trilha · Dropmai · ref Ride"),
      ];
    case "prateleira":
      // Refresh/Enterprise — promo + benefits + dense catalog + collage + FAQ
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
        collage(c, "Vitrine Refresh", "Celular | Casa | Energia"),
        featured(c, "Mais vendidos", 24, true),
        faq(
          "Ajuda na compra",
          "Como funciona o frete?|Calculado no checkout com o fornecedor.||Posso trocar?|Sim, política da loja + suporte Dropmai.",
        ),
        newsletter("Ofertas na caixa", "Cupons e lançamentos da prateleira."),
        footer("Prateleira · Dropmai · ref Refresh"),
      ];
    case "editorial":
      // Sense/Gain — lookbook + ImageWithText + ShopTheLook + collage + newsletter
      return [
        ann("Edição da semana · Frete sob demanda"),
        hdr(brand),
        hero(c, {
          title: "Sua coleção em revista",
          subtitle: "Lookbook para beleza e lifestyle com produtos Xnamai.",
          cta: "Abrir lookbook",
          overlay: true,
          eyebrow: "Editorial · Sense",
        }),
        collage(c, "Mood Sense", "Pele | Luz | Textura"),
        iwt(c, "História da marca", "Combine foto lifestyle com o markup da sua loja — Gain/Sense first-party.", "left", 0),
        tiles(c, "Coleções", "Estética | Luminárias | Bolsas | Decoração"),
        stl("Monte o look", "Pins nos produtos publicados da vitrine."),
        featured(c, "Em vitrine", 8),
        newsletter("Edição por e-mail", "Lookbooks e drops de beleza."),
        footer("Editorial · Dropmai · ref Sense"),
      ];
    case "multiplica":
      // Refresh free-ref — modular retail
      return [
        ann("Mix de categorias · Atualizado com Xnamai"),
        hdr(brand),
        hero(c, {
          title: "Multiplique as vitrines",
          subtitle: "Módulos 2×2 para destacar clusters diferentes sem bagunça.",
          cta: "Ver módulos",
        }),
        tiles(c, "Módulos", t?.tiles || "Celular | Casa | Beleza | Energia"),
        collage(c, "Blocos Refresh", "A | B | C"),
        promoTiles(c, "Bloco A", "Lançamentos", "Bloco B", "Mais pedidos"),
        featured(c, "Em alta", 8),
        row("Strip de tendências", 4),
        newsletter("Mix semanal", "Módulos e lançamentos Xnamai."),
        footer("Multiplica · Dropmai · ref Refresh"),
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
      // Craft free-ref — artisan home calm
      return [
        ann("Casa calma · Organizadores e utilidades"),
        hdr(brand),
        hero(c, {
          title: "Cantos suaves, casa organizada",
          subtitle: "Tom pedra para utilidades domésticas Xnamai.",
          cta: "Ver casa",
        }),
        iwt(c, "Organização sem pressa", "Cards soft para lavanderia, cozinha e closet.", "left", 0),
        collage(c, "Feito à mão", "Closet | Cozinha | Lavanderia"),
        tiles(c, "Ambientes", "Organizers | Cozinha | Lavanderia | Decor"),
        featured(c, "Para a casa", 8),
        newsletter("Casa por e-mail", "Ideias Craft para organizar."),
        footer("Seixo · Dropmai · ref Craft"),
      ];
    case "focal":
      // Dawn free-ref — announcement + mega + banner + collection + collage + featured + video + newsletter
      return [
        ann("Celular em close · Capas, películas e gadgets"),
        mega(brand, "Capas|Películas|Cabos|Suportes|Energia"),
        hero(c, {
          title: "Produto em foco",
          subtitle: "Hero fotográfico full-bleed para acessórios de celular Xnamai.",
          cta: "Ver capas",
          overlay: true,
          eyebrow: "Focal · Dawn",
        }),
        tiles(c, "Acessórios", "Capas | Películas | Cabos | Suportes"),
        collage(c, "Colagem Dawn", "Capas | Películas | Cabos"),
        featured(c, "Em destaque", 8),
        iwt(
          c,
          "Close que vende",
          "Image-with-text no vocabulário Dawn — multirow first-party Dropmai.",
          "right",
          2,
        ),
        video(
          c,
          "Detalhe em movimento",
          "Seção de vídeo/poster no estilo Dawn — first-party Dropmai.",
          "Ver capas",
        ),
        newsletter("Novidades Focal", "Capas, películas e drops Xnamai."),
        footer("Focal · Dropmai · ref Dawn"),
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
      // Ride free-ref — high-energy sport/audio
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
        video(
          c,
          "Sessão ao vivo",
          "Poster de alta energia — Ride free-ref, first-party Dropmai.",
          "Ouvir agora",
        ),
        featured(c, "Playlist da loja", 8),
        promoTiles(c, "Caixas", "Bluetooth forte", "Fones", "TWS e head"),
        newsletter("Playlist semanal", "Drops de áudio e fones."),
        footer("Impacto · Dropmai · ref Ride"),
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
      // Dawn free-ref — wide image-banner + collage + newsletter
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
        collage(c, "Sala Dawn", "TV | Áudio | Streaming"),
        featured(c, "Em cartaz", 9),
        video(
          c,
          "Sessão wide",
          "Poster cinema — vocabulário Dawn, first-party Dropmai.",
          "Ver sala",
        ),
        newsletter("Estreias na caixa", "Monitores, sound bars e HDMI."),
        footer("Amplia · Dropmai · ref Dawn"),
      ];
    case "extra":
      // Refresh free-ref — occasion retail
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
        collage(c, "Ocasiões Refresh", "Kids | Natal | Gadgets"),
        promoTiles(c, "Kids", "Cores alegres", "Natal", "Decoração"),
        featured(c, "Para presentear", 8),
        newsletter("Datas especiais", "Lembretes de presentes e kids."),
        footer("Extra · Dropmai · ref Refresh"),
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
      // Taste free-ref — kitchen/home storytelling
      return [
        ann("Decoração e luminárias · Colunas editoriais"),
        hdr(brand),
        hero(c, {
          title: "Luz, forma, espaço",
          subtitle: "Ágora clássica para decoração e luminárias Xnamai.",
          cta: "Ver ambiente",
        }),
        rich("Mesa posta", "Storytelling Taste — comida, luz e espaço, first-party."),
        iwt(c, "Coluna editorial", "Serif leve e storytelling de ambiente.", "left", 0),
        collage(c, "Ambientes Taste", "Luz | Forma | Mesa"),
        tiles(c, "Espaços", "Luminárias | Decor | Móveis | Ring light"),
        featured(c, "Em exposição", 8),
        newsletter("Receitas de espaço", "Decor e luminárias na caixa."),
        footer("Ágora · Dropmai · ref Taste"),
      ];
    case "monge":
      // Taste free-ref — quiet kitchen
      return [
        hdr(brand),
        hero(c, {
          title: "Cozinha quieta",
          subtitle: "Quase monochrome para utensílios minimal Xnamai.",
          cta: "Ver cozinha",
          eyebrow: "Monge · Taste",
        }),
        rich("Menos ornamento", "Taste/Monk: silêncio visual, produto no centro."),
        collage(c, "Bancada Taste", "Utensílio | Pote | Tábua"),
        featured(c, "Essenciais", 6),
        iwt(c, "Mão na massa", "Utensílios e organizadores com markup seu.", "right", 1),
        newsletter("Cozinha quieta", "Essenciais Xnamai sem ruído."),
        footer("Monge · Dropmai · ref Taste"),
      ];
    case "impecavel":
      // Sense free-ref — soft glam
      return [
        ann("Beleza polished · Soft glam"),
        hdr(brand),
        hero(c, {
          title: "Impecável na pele",
          subtitle: "Rosa-stone e lookbook curto para estética Xnamai.",
          cta: "Ver beleza",
          overlay: true,
        }),
        collage(c, "Ritual Sense", "Pele | Escova | Espelho"),
        tiles(c, "Rituais", "Estética | Escovas | Espelhos | Kits"),
        featured(c, "Rotina", 8),
        stl("Look de cuidado", "Hotspots em produtos da vitrine."),
        newsletter("Glow na caixa", "Rotinas e kits de beleza."),
        footer("Impecável · Dropmai · ref Sense"),
      ];
    case "oficina":
      // Craft/Tinker — industrial collage + video + dense tools
      return [
        ann("Ferramentas · B-Tek · DIY"),
        marquee("OFICINA · FERRAMENTAS · PRECISION · B-TEK · XNAMAI"),
        mega(brand, "Chaves|Lanternas|Medição|Maletas"),
        hero(c, {
          title: "Mão na massa",
          subtitle: "Industrial reto para ferramentas e utilidades técnicas Xnamai.",
          cta: "Abrir oficina",
          overlay: true,
          eyebrow: "Oficina · Craft",
        }),
        collage(c, "Bancada Craft", "Chaves | Lanterna | Maleta"),
        video(
          c,
          "Oficina em ação",
          "Poster Craft/Tinker — ferramentas densas com história, first-party Dropmai.",
          "Ver kits",
        ),
        tiles(c, "Ferramentas", "Chaves | Lanternas | Medição | Maletas"),
        featured(c, "Bancada", 16, true),
        newsletter("DIY semanal", "Kits e lanternas B-Tek."),
        footer("Oficina · Dropmai · ref Craft"),
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
      // Sense free-ref
      return [
        ann("Edição limitada · Envio cuidadoso"),
        hdr(brand),
        hero(c, {
          title: "Peças com presença",
          subtitle: "Curadoria visual para moda, beleza e lifestyle.",
          cta: "Ver coleção",
          overlay: true,
        }),
        collage(c, "Edição Sense", "Look | Peça | Detalhe"),
        iwt(c, "Editorial boutique", "Serif + foto — boutique first-party.", "left", 0),
        featured(c, "Em destaque", 8),
        stl("Look da semana", "Pins nos produtos da loja."),
        newsletter("Lista VIP", "Edições limitadas na caixa."),
        footer("Boutique · Dropmai · ref Sense"),
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
      // Dawn baseline stack
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
        collage(c, "Colagem", "Novidades | Destaques | Ofertas"),
        featured(c, t?.featuredTitle || "Destaques", t?.featuredLimit || 12),
        iwt(
          c,
          "Sua marca no domínio",
          "Publique do catálogo Xnamai e venda com a sua identidade.",
          "left",
          1,
        ),
        newsletter("Fique por dentro", "Lançamentos da sua vitrine."),
        trust("Marca própria:domínio|Catálogo:Xnamai|Editor:Puck|Temas:Dropmai"),
        footer(t?.footerText || "Loja powered by Dropmai · ref Dawn"),
      ];
  }
}
