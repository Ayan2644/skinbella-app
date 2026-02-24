import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import RejuvenationChart from "@/components/quiz/result/RejuvenationChart";
import HeroResult from "@/components/quiz/result/HeroResult";
import MeaningCard from "@/components/quiz/result/MeaningCard";
import ProjectionCard from "@/components/quiz/result/ProjectionCard";
import ProtocolBrandCard from "@/components/quiz/result/ProtocolBrandCard";
import LockedReportCard from "@/components/quiz/result/LockedReportCard";
import OfferCard from "@/components/quiz/result/OfferCard";
import Testimonials from "@/components/quiz/result/Testimonials";
import MiniFAQ from "@/components/quiz/result/MiniFAQ";
import ResultCard from "@/components/quiz/result/ResultCard";
import type { PageBlock } from "@/hooks/usePageBlocks";
import type { SectionStyleVariant } from "./blockTypes";

interface BlockRendererProps {
  block: PageBlock;
  profile?: { skinAge?: number; scores?: Record<string, number> };
  onAction?: (action: string) => void;
}

export function replaceVars(text: string, profile?: BlockRendererProps["profile"]) {
  if (!profile || !text) return text;
  return text
    .replace(/\{\{skinAge\}\}/g, String(profile.skinAge ?? ""))
    .replace(/\{\{hidratacao\}\}/g, String(profile.scores?.hidratacao ?? ""))
    .replace(/\{\{textura\}\}/g, String(profile.scores?.textura ?? ""));
}

export function buildStyle(styles: Record<string, any>): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (styles.fontSize) s.fontSize = styles.fontSize;
  if (styles.fontFamily) s.fontFamily = styles.fontFamily;
  if (styles.color) s.color = styles.color;
  if (styles.bgColor) s.backgroundColor = styles.bgColor;
  if (styles.padding) s.padding = styles.padding;
  if (styles.margin) s.margin = styles.margin;
  if (styles.borderRadius) s.borderRadius = styles.borderRadius;
  if (styles.textAlign) s.textAlign = styles.textAlign as React.CSSProperties["textAlign"];
  if (styles.maxWidth) s.maxWidth = styles.maxWidth;
  return s;
}

/** Renders the wrapper for section_custom based on its style variant */
function SectionWrapper({
  variant,
  children,
  title,
}: {
  variant: SectionStyleVariant;
  children: React.ReactNode;
  title?: string;
}) {
  switch (variant) {
    case "premium":
      return (
        <section className="px-5">
          <ResultCard title={title}>
            {children}
          </ResultCard>
        </section>
      );
    case "simple":
      return (
        <section className="px-5">
          <div className="sb-card p-5">
            {title && <h3 className="sb-h2 mb-4">{title}</h3>}
            {children}
          </div>
        </section>
      );
    case "gradient":
      return (
        <section className="px-5">
          <div className="rounded-[var(--radius-card)] p-5 border border-border/30 sb-gradient-accent">
            {title && <h3 className="sb-h2 mb-4">{title}</h3>}
            {children}
          </div>
        </section>
      );
    case "transparent":
    default:
      return (
        <section className="px-5">
          {title && <h3 className="sb-h2 mb-4">{title}</h3>}
          {children}
        </section>
      );
  }
}

/** Renders a single child block inside a custom section */
function ChildBlockRenderer({
  child,
  profile,
  onAction,
}: {
  child: any;
  profile?: BlockRendererProps["profile"];
  onAction?: (action: string) => void;
}) {
  const st = buildStyle(child.styles || {});
  const content = child.content || {};

  switch (child.block_type) {
    case "heading": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      return (
        <Tag style={st} className="font-display font-semibold text-foreground">
          {replaceVars(content.text, profile)}
        </Tag>
      );
    }
    case "text":
      return (
        <p style={st} className="text-foreground/80 leading-relaxed">
          {replaceVars(content.text, profile)}
        </p>
      );
    case "image":
      return content.src ? (
        <img
          src={content.src}
          alt={content.alt || ""}
          loading="lazy"
          style={{ ...st, objectFit: content.objectFit || "cover" }}
          className="w-full rounded-2xl"
        />
      ) : (
        <div style={st} className="w-full h-32 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
          Sem imagem
        </div>
      );
    case "button":
      return (
        <div style={{ textAlign: (st.textAlign || "center") as React.CSSProperties["textAlign"], padding: st.padding }}>
          <Button
            onClick={() => onAction?.(content.action || "checkout")}
            className="rounded-2xl h-14 px-8 font-semibold shadow-elegant"
          >
            <Sparkles className="w-5 h-5 mr-2 text-accent" />
            {replaceVars(content.text, profile)}
          </Button>
        </div>
      );
    case "spacer":
      return <div style={{ height: content.height || 24 }} />;
    case "chart":
      return (
        <div style={st}>
          <RejuvenationChart skinAge={Number(profile?.skinAge ?? 35)} />
        </div>
      );
    case "code":
      return (
        <div style={st}>
          {content.css && <style>{content.css}</style>}
          <div dangerouslySetInnerHTML={{ __html: content.html || "" }} />
        </div>
      );
    case "divider":
      return (
        <div style={st} className="flex items-center justify-center">
          {content.style === "dots" ? (
            <span className="text-muted-foreground tracking-[0.5em]">• • •</span>
          ) : content.style === "gradient" ? (
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ) : (
            <div className="w-full h-px bg-border/50" />
          )}
        </div>
      );
    default:
      return null;
  }
}

export default function BlockRenderer({ block, profile, onAction }: BlockRendererProps) {
  const { block_type, content, styles } = block;
  const st = buildStyle(styles);
  const onCheckout = () => onAction?.("checkout");

  const scoreSnapshot = {
    hidratacao: Number(profile?.scores?.hidratacao ?? 77),
    textura: Number(profile?.scores?.textura ?? 77),
  };

  switch (block_type) {
    case "section_hero":
      return <HeroResult skinAge={Number(profile?.skinAge ?? 35)} scores={scoreSnapshot} />;
    case "section_meaning":
      return <MeaningCard skinAge={Number(profile?.skinAge ?? 35)} />;
    case "section_projection":
      return <ProjectionCard skinAge={Number(profile?.skinAge ?? 35)} onAccess={onCheckout} />;
    case "section_protocol":
      return <ProtocolBrandCard />;
    case "section_locked_report":
      return <LockedReportCard />;
    case "section_offer":
      return <OfferCard onAccess={onCheckout} />;
    case "section_testimonials":
      return <Testimonials />;
    case "section_faq":
      return <MiniFAQ />;

    case "section_custom": {
      const sectionStyle = (content.sectionStyle || "premium") as SectionStyleVariant;
      const children: any[] = content.children || [];
      const showTitle = sectionStyle !== "premium"; // ResultCard handles its own title

      return (
        <SectionWrapper
          variant={sectionStyle}
          title={sectionStyle === "premium" ? content.title : showTitle ? content.title : undefined}
        >
          <div className="space-y-1">
            {children
              .filter((c: any) => c.is_visible !== false)
              .map((child: any, idx: number) => (
                <ChildBlockRenderer key={child.id || idx} child={child} profile={profile} onAction={onAction} />
              ))}
            {children.length === 0 && (
              <p className="text-sm text-muted-foreground/50 text-center py-4 italic">Seção vazia</p>
            )}
          </div>
        </SectionWrapper>
      );
    }

    // Legacy inline blocks (still supported for backwards compat)
    case "heading": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      return (
        <Tag style={st} className="font-display font-semibold text-foreground">
          {replaceVars(content.text, profile)}
        </Tag>
      );
    }
    case "text":
      return <p style={st} className="text-foreground/80 leading-relaxed">{replaceVars(content.text, profile)}</p>;
    case "image":
      return content.src ? (
        <img src={content.src} alt={content.alt || ""} loading="lazy" style={{ ...st, objectFit: content.objectFit || "cover" }} className="w-full" />
      ) : (
        <div style={st} className="w-full h-32 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">Sem imagem</div>
      );
    case "button":
      return (
        <div style={{ textAlign: (st.textAlign || "center") as React.CSSProperties["textAlign"], padding: st.padding }}>
          <Button onClick={() => onAction?.(content.action || "checkout")} className="rounded-2xl h-14 px-8 font-semibold">
            <Sparkles className="w-5 h-5 mr-2 text-accent" />
            {replaceVars(content.text, profile)}
          </Button>
        </div>
      );
    case "spacer":
      return <div style={{ height: content.height || 32 }} />;
    case "chart":
      return <div style={st}><RejuvenationChart skinAge={Number(profile?.skinAge ?? 35)} /></div>;
    case "code":
      return <div style={st}>{content.css && <style>{content.css}</style>}<div dangerouslySetInnerHTML={{ __html: content.html || "" }} /></div>;
    case "offer":
      return (
        <div style={st} className="sb-card p-6">
          <h3 className="sb-h2 mb-3">{replaceVars(content.title, profile)}</h3>
          <ul className="space-y-2 mb-4">
            {(content.items || []).map((item: string, i: number) => (
              <li key={i} className="text-sm text-foreground/80 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{item}</li>
            ))}
          </ul>
          <div className="flex items-baseline gap-2">
            {content.originalPrice && <span className="text-sm text-muted-foreground line-through">R$ {content.originalPrice}</span>}
            <span className="text-3xl font-bold text-foreground font-display">R$ {content.price}</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
        </div>
      );
    case "testimonials":
      return (
        <div style={st} className="space-y-3">
          {(content.items || []).map((t: any, i: number) => (
            <div key={i} className="sb-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{t.name}</span>
                <div className="flex gap-0.5">{Array.from({ length: t.stars || 5 }).map((_, j) => <Star key={j} className="w-3 h-3 fill-accent text-accent" />)}</div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{replaceVars(t.text, profile)}"</p>
            </div>
          ))}
        </div>
      );
    case "faq":
      return (
        <div style={st} className="space-y-3">
          {(content.items || []).map((f: any, i: number) => (
            <div key={i} className="sb-card p-5">
              <p className="text-base font-semibold text-foreground mb-1">{f.q}</p>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      );
    case "divider":
      return (
        <div style={st} className="flex items-center justify-center">
          {content.style === "dots" ? <span className="text-muted-foreground tracking-[0.5em]">• • •</span>
            : content.style === "gradient" ? <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            : <div className="w-full h-px bg-border/50" />}
        </div>
      );
    default:
      return <div className="text-xs text-muted-foreground p-2">Bloco desconhecido: {block_type}</div>;
  }
}
