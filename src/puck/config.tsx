"use client";

import type { CSSProperties } from "react";
import type { Config } from "@puckeditor/core";
import {
  AnnouncementBar,
  BenefitStrip,
  Collage,
  CollectionTiles,
  FaqSection,
  FeaturedProducts,
  FeaturedRow,
  HeroSection,
  ImageWithText,
  MarqueeStrip,
  MegaHeader,
  Newsletter,
  PromoBar,
  PromoTiles,
  RichText,
  ShopTheLook,
  StoreFooter,
  StoreHeader,
  Testimonials,
  TrustRow,
  VideoSection,
} from "@/puck/components";

export type DropmaiPuckProps = {
  AnnouncementBar: { text: string };
  PromoBar: { text: string; code: string };
  BenefitStrip: { items: string };
  StoreHeader: { brandName: string; showNav: boolean };
  MegaHeader: { brandName: string; links: string; showSearch: boolean };
  MarqueeStrip: { text: string };
  HeroSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    overlay: boolean;
    imageUrl: string;
  };
  FeaturedProducts: { title: string; limit: number; dense: boolean };
  FeaturedRow: { title: string; limit: number };
  RichText: { heading: string; body: string };
  ImageWithText: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    imageSide: "left" | "right";
    imageUrl: string;
  };
  CollectionTiles: { title: string; tiles: string; imageUrls: string };
  PromoTiles: {
    leftTitle: string;
    leftBody: string;
    rightTitle: string;
    rightBody: string;
    leftImage: string;
    rightImage: string;
  };
  TrustRow: { items: string };
  FaqSection: { title: string; items: string };
  Testimonials: { title: string; quotes: string };
  ShopTheLook: { title: string; caption: string };
  Collage: { title: string; captions: string; imageUrls: string };
  VideoSection: {
    heading: string;
    body: string;
    ctaLabel: string;
    posterUrl: string;
  };
  Newsletter: {
    heading: string;
    body: string;
    buttonLabel: string;
    placeholder: string;
  };
  StoreFooter: { text: string };
};

export type DropmaiRootProps = {
  themeId: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  headingFont: string;
  bodyFont: string;
};

export const dropmaiPuckConfig: Config<DropmaiPuckProps, DropmaiRootProps> = {
  root: {
    fields: {
      themeId: { type: "text", label: "ID do tema" },
      primary: { type: "text", label: "Cor primária" },
      secondary: { type: "text", label: "Cor secundária" },
      background: { type: "text", label: "Fundo" },
      surface: { type: "text", label: "Superfície" },
      text: { type: "text", label: "Texto" },
      muted: { type: "text", label: "Texto suave" },
      headingFont: {
        type: "select",
        label: "Fonte dos títulos",
        options: [
          {
            label: "Serif",
            value: 'Georgia, "Times New Roman", serif',
          },
          {
            label: "Palatino",
            value: '"Palatino Linotype", Palatino, Georgia, serif',
          },
          {
            label: "System sans",
            value: "system-ui, -apple-system, Segoe UI, sans-serif",
          },
          {
            label: "UI sans",
            value: "ui-sans-serif, system-ui, sans-serif",
          },
          {
            label: "Friendly sans",
            value: '"Trebuchet MS", "Segoe UI", sans-serif',
          },
        ],
      },
      bodyFont: {
        type: "select",
        label: "Fonte do corpo",
        options: [
          {
            label: "System sans",
            value: "system-ui, -apple-system, Segoe UI, sans-serif",
          },
          {
            label: "UI sans",
            value: "ui-sans-serif, system-ui, sans-serif",
          },
          {
            label: "Serif",
            value: 'Georgia, "Times New Roman", serif',
          },
        ],
      },
    },
    defaultProps: {
      themeId: "vitrine",
      primary: "#0d9488",
      secondary: "#134e4a",
      background: "#f0f7f6",
      surface: "#ffffff",
      text: "#134e4a",
      muted: "#5b7c78",
      headingFont: 'Georgia, "Times New Roman", serif',
      bodyFont: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    render: ({ children, ...root }) => (
      <div
        className={`dm-store dm-theme-${root.themeId || "vitrine"}`}
        style={
          {
            "--dm-primary": root.primary,
            "--dm-secondary": root.secondary,
            "--dm-bg": root.background,
            "--dm-surface": root.surface,
            "--dm-text": root.text,
            "--dm-muted": root.muted,
            "--dm-font-heading": root.headingFont,
            "--dm-font-body":
              root.bodyFont ||
              "system-ui, -apple-system, Segoe UI, sans-serif",
            minHeight: "100%",
            background: "var(--dm-bg)",
            color: "var(--dm-text)",
            fontFamily: "var(--dm-font-body)",
          } as CSSProperties
        }
      >
        {children}
      </div>
    ),
  },
  categories: {
    layout: {
      title: "Layout",
      components: [
        "AnnouncementBar",
        "PromoBar",
        "BenefitStrip",
        "MarqueeStrip",
        "StoreHeader",
        "MegaHeader",
        "StoreFooter",
      ],
    },
    content: {
      title: "Conteúdo",
      components: [
        "HeroSection",
        "FeaturedProducts",
        "FeaturedRow",
        "RichText",
        "ImageWithText",
        "CollectionTiles",
        "PromoTiles",
        "ShopTheLook",
        "Collage",
        "VideoSection",
        "Newsletter",
        "TrustRow",
        "FaqSection",
        "Testimonials",
      ],
    },
  },
  components: {
    AnnouncementBar: {
      label: "Barra de anúncio",
      fields: {
        text: { type: "text", label: "Texto" },
      },
      defaultProps: {
        text: "Frete calculado no checkout · Estoque com o fornecedor",
      },
      render: (props) => <AnnouncementBar {...props} />,
    },
    PromoBar: {
      label: "Faixa de promoção",
      fields: {
        text: { type: "text", label: "Texto" },
        code: { type: "text", label: "Cupom (opcional)" },
      },
      defaultProps: {
        text: "Oferta relâmpago — use o cupom no checkout",
        code: "DROPMAI10",
      },
      render: (props) => <PromoBar {...props} />,
    },
    BenefitStrip: {
      label: "Benefícios",
      fields: {
        items: {
          type: "textarea",
          label: "Itens (separados por |)",
        },
      },
      defaultProps: {
        items:
          "Frete sob demanda | Estoque no fornecedor | Troca facilitada | Suporte Dropmai",
      },
      render: (props) => <BenefitStrip {...props} />,
    },
    StoreHeader: {
      label: "Cabeçalho",
      fields: {
        brandName: { type: "text", label: "Nome da marca" },
        showNav: {
          type: "radio",
          label: "Menu",
          options: [
            { label: "Sim", value: true },
            { label: "Não", value: false },
          ],
        },
      },
      defaultProps: {
        brandName: "",
        showNav: true,
      },
      render: (props) => <StoreHeader {...props} />,
    },
    HeroSection: {
      label: "Hero",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Título" },
        subtitle: { type: "textarea", label: "Subtítulo" },
        ctaLabel: { type: "text", label: "Botão" },
        ctaHref: { type: "text", label: "Link do botão" },
        overlay: {
          type: "radio",
          label: "Overlay full-bleed",
          options: [
            { label: "Não", value: false },
            { label: "Sim", value: true },
          ],
        },
        imageUrl: { type: "text", label: "Imagem de fundo (URL)" },
      },
      defaultProps: {
        eyebrow: "Loja Dropmai",
        title: "Novidades da sua vitrine",
        subtitle: "Produtos Xnamai publicados com o seu markup.",
        ctaLabel: "Ver produtos",
        ctaHref: "#produtos",
        overlay: false,
        imageUrl: "",
      },
      render: (props) => <HeroSection {...props} />,
    },
    FeaturedProducts: {
      label: "Grade de produtos",
      fields: {
        title: { type: "text", label: "Título" },
        limit: { type: "number", label: "Limite", min: 1, max: 48 },
        dense: {
          type: "radio",
          label: "Grade densa",
          options: [
            { label: "Não", value: false },
            { label: "Sim", value: true },
          ],
        },
      },
      defaultProps: {
        title: "Destaques",
        limit: 12,
        dense: false,
      },
      render: (props) => <FeaturedProducts {...props} />,
    },
    RichText: {
      label: "Texto",
      fields: {
        heading: { type: "text", label: "Título" },
        body: { type: "textarea", label: "Corpo" },
      },
      defaultProps: {
        heading: "Sobre a loja",
        body: "Conte a história da sua marca e como funciona o envio.",
      },
      render: (props) => <RichText {...props} />,
    },
    ImageWithText: {
      label: "Imagem + texto",
      fields: {
        heading: { type: "text", label: "Título" },
        body: { type: "textarea", label: "Corpo" },
        ctaLabel: { type: "text", label: "Botão" },
        ctaHref: { type: "text", label: "Link" },
        imageSide: {
          type: "radio",
          label: "Imagem",
          options: [
            { label: "Esquerda", value: "left" },
            { label: "Direita", value: "right" },
          ],
        },
        imageUrl: { type: "text", label: "URL da imagem" },
      },
      defaultProps: {
        heading: "Destaque da coleção",
        body: "Conte a história do produto Xnamai com a sua marca.",
        ctaLabel: "Ver produtos",
        ctaHref: "#produtos",
        imageSide: "left",
        imageUrl: "",
      },
      render: (props) => <ImageWithText {...props} />,
    },
    CollectionTiles: {
      label: "Tiles de coleção",
      fields: {
        title: { type: "text", label: "Título" },
        tiles: {
          type: "textarea",
          label: "Tiles (separados por |)",
        },
        imageUrls: {
          type: "textarea",
          label: "Imagens (URLs separadas por |)",
        },
      },
      defaultProps: {
        title: "Categorias",
        tiles: "Celular | Casa | Beleza | Energia",
        imageUrls: "",
      },
      render: (props) => <CollectionTiles {...props} />,
    },
    ShopTheLook: {
      label: "Shop the look",
      fields: {
        title: { type: "text", label: "Título" },
        caption: { type: "textarea", label: "Legenda" },
      },
      defaultProps: {
        title: "Monte o look",
        caption: "Pins nos produtos publicados da sua loja.",
      },
      render: (props) => <ShopTheLook {...props} />,
    },
    MegaHeader: {
      label: "Header mega / busca",
      fields: {
        brandName: { type: "text", label: "Marca" },
        links: { type: "textarea", label: "Links (separados por |)" },
        showSearch: {
          type: "radio",
          label: "Busca",
          options: [
            { label: "Sim", value: true },
            { label: "Não", value: false },
          ],
        },
      },
      defaultProps: {
        brandName: "",
        links: "Novidades | Ofertas | Categorias",
        showSearch: true,
      },
      render: (props) => <MegaHeader {...props} />,
    },
    MarqueeStrip: {
      label: "Marquee",
      fields: { text: { type: "text", label: "Texto" } },
      defaultProps: { text: "Dropmai · Xnamai" },
      render: (props) => <MarqueeStrip {...props} />,
    },
    PromoTiles: {
      label: "Tiles promo 2 col",
      fields: {
        leftTitle: { type: "text", label: "Título esquerdo" },
        leftBody: { type: "text", label: "Texto esquerdo" },
        rightTitle: { type: "text", label: "Título direito" },
        rightBody: { type: "text", label: "Texto direito" },
        leftImage: { type: "text", label: "Imagem esquerda" },
        rightImage: { type: "text", label: "Imagem direita" },
      },
      defaultProps: {
        leftTitle: "Oferta A",
        leftBody: "Destaque",
        rightTitle: "Oferta B",
        rightBody: "Destaque",
        leftImage: "",
        rightImage: "",
      },
      render: (props) => <PromoTiles {...props} />,
    },
    TrustRow: {
      label: "Trust / benefícios",
      fields: {
        items: {
          type: "textarea",
          label: "Itens (titulo:desc separados por |)",
        },
      },
      defaultProps: {
        items: "Frete:sob demanda|Estoque:Xnamai|Troca:fácil|Suporte:Dropmai",
      },
      render: (props) => <TrustRow {...props} />,
    },
    FaqSection: {
      label: "FAQ",
      fields: {
        title: { type: "text", label: "Título" },
        items: {
          type: "textarea",
          label: "Perguntas (q|a || q|a)",
        },
      },
      defaultProps: {
        title: "Perguntas frequentes",
        items: "Como funciona o frete?|No checkout.||Posso trocar?|Sim.",
      },
      render: (props) => <FaqSection {...props} />,
    },
    Testimonials: {
      label: "Depoimentos",
      fields: {
        title: { type: "text", label: "Título" },
        quotes: {
          type: "textarea",
          label: "Quotes (texto|autor || …)",
        },
      },
      defaultProps: {
        title: "Quem comprou",
        quotes: "Ótima loja|Cliente||Entrega rápida|Outro",
      },
      render: (props) => <Testimonials {...props} />,
    },
    FeaturedRow: {
      label: "Faixa de produtos",
      fields: {
        title: { type: "text", label: "Título" },
        limit: { type: "number", label: "Limite", min: 2, max: 12 },
      },
      defaultProps: { title: "Tendências", limit: 4 },
      render: (props) => <FeaturedRow {...props} />,
    },
    Collage: {
      label: "Colagem",
      fields: {
        title: { type: "text", label: "Título" },
        captions: {
          type: "textarea",
          label: "Legendas (separadas por |, até 3)",
        },
        imageUrls: {
          type: "textarea",
          label: "URLs das imagens (separadas por |)",
        },
      },
      defaultProps: {
        title: "Colagem",
        captions: "Look 1 | Look 2 | Look 3",
        imageUrls: "",
      },
      render: (props) => <Collage {...props} />,
    },
    VideoSection: {
      label: "Vídeo / poster",
      fields: {
        heading: { type: "text", label: "Título" },
        body: { type: "textarea", label: "Texto" },
        ctaLabel: { type: "text", label: "CTA" },
        posterUrl: { type: "text", label: "URL do poster" },
      },
      defaultProps: {
        heading: "Assista a história",
        body: "Poster fotográfico inspirado na seção de vídeo do Dawn.",
        ctaLabel: "Ver produtos",
        posterUrl: "",
      },
      render: (props) => <VideoSection {...props} />,
    },
    Newsletter: {
      label: "Newsletter",
      fields: {
        heading: { type: "text", label: "Título" },
        body: { type: "textarea", label: "Texto" },
        buttonLabel: { type: "text", label: "Botão" },
        placeholder: { type: "text", label: "Placeholder e-mail" },
      },
      defaultProps: {
        heading: "Novidades na caixa de entrada",
        body: "Lançamentos Xnamai e ofertas da loja.",
        buttonLabel: "Inscrever",
        placeholder: "seu@email.com",
      },
      render: (props) => <Newsletter {...props} />,
    },
    StoreFooter: {
      label: "Rodapé",
      fields: {
        text: { type: "text", label: "Texto" },
      },
      defaultProps: {
        text: "Loja powered by Dropmai",
      },
      render: (props) => <StoreFooter {...props} />,
    },
  },
};
