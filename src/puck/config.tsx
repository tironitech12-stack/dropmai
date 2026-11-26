"use client";

import type { CSSProperties } from "react";
import type { Config } from "@puckeditor/core";
import {
  AnnouncementBar,
  FeaturedProducts,
  HeroSection,
  RichText,
  StoreFooter,
  StoreHeader,
} from "@/puck/components";

export type DropmaiPuckProps = {
  AnnouncementBar: { text: string };
  StoreHeader: { brandName: string; showNav: boolean };
  HeroSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  FeaturedProducts: { title: string; limit: number; dense: boolean };
  RichText: { heading: string; body: string };
  StoreFooter: { text: string };
};

export type DropmaiRootProps = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  headingFont: string;
};

export const dropmaiPuckConfig: Config<DropmaiPuckProps, DropmaiRootProps> = {
  root: {
    fields: {
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
            label: "System sans",
            value: "system-ui, -apple-system, Segoe UI, sans-serif",
          },
          {
            label: "UI sans",
            value: "ui-sans-serif, system-ui, sans-serif",
          },
        ],
      },
    },
    defaultProps: {
      primary: "#0f8a6b",
      secondary: "#0a5c49",
      background: "#f4f7f9",
      surface: "#ffffff",
      text: "#15202b",
      muted: "#5b6b7c",
      headingFont: 'Georgia, "Times New Roman", serif',
    },
    render: ({ children, ...root }) => (
      <div
        className="dm-store"
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
      components: ["AnnouncementBar", "StoreHeader", "StoreFooter"],
    },
    content: {
      title: "Conteúdo",
      components: ["HeroSection", "FeaturedProducts", "RichText"],
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
      },
      defaultProps: {
        eyebrow: "Loja Dropmai",
        title: "Novidades da sua vitrine",
        subtitle: "Produtos Xnamai publicados com o seu markup.",
        ctaLabel: "Ver produtos",
        ctaHref: "#produtos",
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
