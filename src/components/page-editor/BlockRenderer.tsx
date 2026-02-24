import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Check, ArrowRight } from "lucide-react";
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
import { getLucideIcon } from "./LucideIconPicker";
import type { PageBlock } from "@/hooks/usePageBlocks";
import type { SectionStyleVariant, InnerSectionBgVariant } from "./blockTypes";

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
  if (styles.fontWeight) s.fontWeight = styles.fontWeight;
  if (styles.fontStyle) s.fontStyle = styles.fontStyle;
  if (styles.color) s.color = styles.color;
  if (styles.bgColor) s.backgroundColor = styles.bgColor;
  if (styles.bgGradient) s.background = styles.bgGradient;
  if (styles.padding) s.padding = styles.padding;
  if (styles.margin) s.margin = styles.margin;
  if (styles.borderRadius) s.borderRadius = styles.borderRadius;
  if (styles.textAlign) s.textAlign = styles.textAlign as React.CSSProperties["textAlign"];
  if (styles.maxWidth) s.maxWidth = styles.maxWidth;
  if (styles.letterSpacing) s.letterSpacing = styles.letterSpacing;
  if (styles.lineHeight) s.lineHeight = styles.lineHeight;
  if (styles.textTransform) s.textTransform = styles.textTransform as React.CSSProperties["textTransform"];
  if (styles.opacity) s.opacity = Number(styles.opacity);
  if (styles.boxShadow) s.boxShadow = styles.boxShadow;
  if (styles.borderWidth) s.borderWidth = styles.borderWidth;
  if (styles.borderStyle) s.borderStyle = styles.borderStyle as React.CSSProperties["borderStyle"];
  if (styles.borderColor) s.borderColor = styles.borderColor;
  if (styles.textShadow) s.textShadow = styles.textShadow;
  if (styles.backdropFilter) s.backdropFilter = styles.backdropFilter;
  if (styles.WebkitBackgroundClip === "text") {
    s.WebkitBackgroundClip = "text";
    s.WebkitTextFillColor = "transparent";
  }
  return s;
}

function SectionWrapper({ variant, children, title }: { variant: SectionStyleVariant; children: React.ReactNode; title?: string }) {
  switch (variant) {
    case "premium":
      return <section className="px-5"><ResultCard title={title}>{children}</ResultCard></section>;
    case "simple":
      return <section className="px-5"><div className="sb-card p-5">{title && <h3 className="sb-h2 mb-4">{title}</h3>}{children}</div></section>;
    case "gradient":
      return <section className="px-5"><div className="rounded-[var(--radius-card)] p-5 border border-border/30 sb-gradient-accent">{title && <h3 className="sb-h2 mb-4">{title}</h3>}{children}</div></section>;
    case "transparent":
    default:
      return <section className="px-5">{title && <h3 className="sb-h2 mb-4">{title}</h3>}{children}</section>;
  }
}

/** Renders a single child block inside a custom section */
function ChildBlockRenderer({ child, profile, onAction }: { child: any; profile?: BlockRendererProps["profile"]; onAction?: (action: string) => void }) {
  const st = buildStyle(child.styles || {});
  const content = child.content || {};

  switch (child.block_type) {
    case "heading": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      return <Tag style={st} className="font-display font-semibold text-foreground">{replaceVars(content.text, profile)}</Tag>;
    }

    case "headline_icon": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      const Icon = getLucideIcon(content.icon || "Sparkles");
      return (
        <div style={st} className="flex flex-col items-center gap-3">
          {Icon && (
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-primary" />
            </div>
          )}
          <Tag className="font-display font-semibold text-foreground text-center">{replaceVars(content.text, profile)}</Tag>
          {content.subtitle && <p className="text-sm text-muted-foreground text-center">{replaceVars(content.subtitle, profile)}</p>}
        </div>
      );
    }

    case "headline_trigger": {
      const Icon = getLucideIcon(content.icon || "Zap");
      const badgeColorMap: Record<string, string> = {
        accent: "bg-accent text-accent-foreground",
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        muted: "bg-muted text-muted-foreground",
      };
      const badgeCls = badgeColorMap[content.badgeColor] || badgeColorMap.accent;
      return (
        <div style={st} className="relative text-center">
          {content.badgeText && (
            <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3", badgeCls)}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {content.badgeText}
            </span>
          )}
          <h2 className="font-display text-xl font-bold text-foreground">{replaceVars(content.text, profile)}</h2>
        </div>
      );
    }

    case "text":
      return <p style={st} className="text-foreground/80 leading-relaxed">{replaceVars(content.text, profile)}</p>;

    case "image":
      return content.src ? (
        <img src={content.src} alt={content.alt || ""} loading="lazy" style={{ ...st, objectFit: content.objectFit || "cover" }} className="w-full rounded-2xl" />
      ) : (
        <div style={st} className="w-full h-32 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">Sem imagem</div>
      );

    case "icon_block": {
      const Icon = getLucideIcon(content.icon || "Sparkles");
      const sizeMap: Record<string, string> = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20" };
      const iconSizeMap: Record<string, string> = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-10 h-10" };
      const sz = sizeMap[content.size] || sizeMap.md;
      const isz = iconSizeMap[content.size] || iconSizeMap.md;
      return (
        <div style={st} className="flex justify-center">
          <div className={cn(sz, "rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center")}>
            {Icon && <Icon className={cn(isz, "text-primary")} />}
          </div>
        </div>
      );
    }

    case "checklist": {
      const bulletStyle = content.bulletStyle || "check";
      const checkColor = content.checkColor || "";
      return (
        <div style={st} className="space-y-2.5">
          {(content.items || []).map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              {bulletStyle === "dot" ? (
                <span
                  className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-[7px]"
                  style={{ backgroundColor: checkColor || '#C8A96B' }}
                />
              ) : bulletStyle === "number" ? (
                <span className="text-sm font-bold flex-shrink-0 mt-0.5" style={{ color: checkColor || undefined }}>{i + 1}.</span>
              ) : bulletStyle === "dash" ? (
                <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: checkColor || undefined }}>—</span>
              ) : (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: checkColor ? `${checkColor}20` : 'rgba(16,185,129,0.2)' }}>
                  <Check className="w-3 h-3" style={{ color: checkColor || '#34d399' }} />
                </div>
              )}
              <span className="text-sm text-foreground/80">{replaceVars(item, profile)}</span>
            </div>
          ))}
        </div>
      );
    }

    case "checklist_emoji":
      return (
        <div style={st} className="space-y-2.5">
          {(content.items || []).map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{item.emoji || "✨"}</span>
              <span className="text-sm text-foreground/80">{replaceVars(item.text, profile)}</span>
            </div>
          ))}
        </div>
      );

    case "faq_item":
      return (
        <div style={st} className="space-y-3">
          {content.headerText && <h3 className="font-display font-semibold text-foreground text-center mb-2">{content.headerText}</h3>}
          {(content.items || []).map((item: any, i: number) => (
            <div key={i} className="sb-card p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{item.question}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      );

    case "button": {
      const BtnIcon = content.icon ? getLucideIcon(content.icon) : null;
      return (
        <div style={{ textAlign: (st.textAlign || "center") as React.CSSProperties["textAlign"], padding: st.padding }}>
          <Button onClick={() => onAction?.(content.action || "checkout")} className="rounded-2xl h-14 px-8 font-semibold shadow-elegant">
            {BtnIcon && <BtnIcon className="w-5 h-5 mr-2 text-accent" />}
            {replaceVars(content.text, profile)}
          </Button>
        </div>
      );
    }

    case "pricing":
      return (
        <div style={st} className="flex flex-col items-center gap-1">
          {content.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">R$ {content.originalPrice}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground font-display">R$ {content.price}</span>
            {content.suffix && <span className="text-sm text-muted-foreground">{content.suffix}</span>}
          </div>
          {content.caption && <p className="text-xs text-muted-foreground mt-1">{content.caption}</p>}
        </div>
      );

    case "badge_label": {
      const variantMap: Record<string, string> = {
        accent: "bg-accent/20 text-accent border-accent/30",
        success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        muted: "bg-muted text-muted-foreground border-border",
      };
      const cls = variantMap[content.variant] || variantMap.accent;
      return (
        <div style={st} className="flex justify-center">
          <span className={cn("inline-block px-4 py-1.5 rounded-full text-xs font-bold border", cls)}>
            {content.text}
          </span>
        </div>
      );
    }

    case "testimonial":
      return (
        <div style={st} className="space-y-3">
          {content.headerText && <h3 className="font-display font-semibold text-foreground text-center mb-2">{content.headerText}</h3>}
          {(content.items || []).map((t: any, i: number) => (
            <div key={i} className="sb-card p-4">
              <div className="flex items-center gap-3 mb-2">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {(t.name || "?")[0]}
                  </div>
                )}
                <div>
                  <span className="text-sm font-semibold text-foreground block">{t.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars || 5 }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{replaceVars(t.text, profile)}"</p>
            </div>
          ))}
        </div>
      );

    case "trust_badges": {
      return (
        <div style={st} className="flex flex-wrap items-center justify-center gap-4">
          {(content.items || []).map((badge: any, i: number) => {
            const BadgeIcon = getLucideIcon(badge.icon || "ShieldCheck");
            return (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {BadgeIcon && <BadgeIcon className="w-4 h-4 text-primary/70" />}
                <span>{badge.text}</span>
              </div>
            );
          })}
        </div>
      );
    }

    case "social_proof": {
      const ProofIcon = getLucideIcon(content.icon || "Users");
      return (
        <div style={st} className="flex items-center justify-center gap-2">
          {ProofIcon && <ProofIcon className="w-5 h-5 text-primary" />}
          <span className="text-sm text-foreground/80">
            <strong className="text-foreground">+{content.count}</strong> {content.text}
          </span>
        </div>
      );
    }

    case "inner_section": {
      const bgVariant = (content.bgVariant || "warm") as InnerSectionBgVariant;
      const bgMap: Record<string, string> = {
        warm: "bg-[#FDF8F3] border-[#f0e6d6]",
        accent: "bg-accent/10 border-accent/20",
        dark: "bg-[#1a1a2e] border-[#2a2a3e] text-white",
        muted: "bg-muted/50 border-border/30",
        custom: "",
      };
      const bgCls = bgMap[bgVariant] || bgMap.warm;
      const customBg = bgVariant === "custom" && content.customBgColor ? { backgroundColor: content.customBgColor } : {};
      const innerChildren: any[] = content.children || [];
      return (
        <div
          style={{ ...st, ...customBg }}
          className={cn("rounded-2xl border p-5 space-y-1", bgCls)}
        >
          {innerChildren
            .filter((c: any) => c.is_visible !== false)
            .map((child: any, idx: number) => (
              <ChildBlockRenderer key={child.id || idx} child={child} profile={profile} onAction={onAction} />
            ))}
          {innerChildren.length === 0 && (
            <p className="text-sm text-muted-foreground/50 text-center py-4 italic">Seção interna vazia</p>
          )}
        </div>
      );
    }

    case "spacer":
      return <div style={{ height: content.height || 24 }} />;
    case "chart":
      return <div style={st}><RejuvenationChart skinAge={Number(profile?.skinAge ?? 35)} /></div>;
    case "code":
      return <div style={st}>{content.css && <style>{content.css}</style>}<div dangerouslySetInnerHTML={{ __html: content.html || "" }} /></div>;
    case "divider":
      return (
        <div style={st} className="flex items-center justify-center">
          {content.style === "dots" ? <span className="text-muted-foreground tracking-[0.5em]">• • •</span>
            : content.style === "gradient" ? <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            : <div className="w-full h-px bg-border/50" />}
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
    case "section_projection":
    case "section_protocol":
    case "section_locked_report":
    case "section_offer":
    case "section_testimonials":
    case "section_faq": {
      const hasChildren = content.children && content.children.length > 0;
      if (hasChildren) {
        const sectionStyle = (content.sectionStyle || "premium") as SectionStyleVariant;
        return (
          <SectionWrapper variant={sectionStyle} title={content.title}>
            <div className="space-y-1">
              {content.children
                .filter((c: any) => c.is_visible !== false)
                .map((child: any, idx: number) => (
                  <ChildBlockRenderer key={child.id || idx} child={child} profile={profile} onAction={onAction} />
                ))}
            </div>
          </SectionWrapper>
        );
      }
      // Fallback to static components for backward compatibility
      switch (block_type) {
        case "section_meaning": return <MeaningCard skinAge={Number(profile?.skinAge ?? 35)} />;
        case "section_projection": return <ProjectionCard skinAge={Number(profile?.skinAge ?? 35)} onAccess={onCheckout} />;
        case "section_protocol": return <ProtocolBrandCard />;
        case "section_locked_report": return <LockedReportCard />;
        case "section_offer": return <OfferCard onAccess={onCheckout} />;
        case "section_testimonials": return <Testimonials />;
        case "section_faq": return <MiniFAQ />;
        default: return null;
      }
    }

    case "sticky_cta": {
      const badges: string[] = content.badges || ["Checkout seguro", "Acesso imediato", "Suporte"];
      return (
        <div className="px-4 pb-4">
          <div className="bg-background/92 backdrop-blur-md border border-border/40 rounded-[var(--radius-card)] shadow-elegant px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">
                  {replaceVars(content.offerText || "Plano hoje com", profile)}{" "}
                  <span className="text-destructive font-bold">{content.discountText || "-52%"}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {content.priceText || "R$ 29/mês"} • {content.subtitleText || "Cancele quando quiser"}
                </p>
              </div>
              <Button onClick={onCheckout} className="rounded-2xl h-11 px-5 text-sm font-semibold shadow-elegant flex-shrink-0">
                {content.buttonText || "Desbloquear"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {badges.length > 0 && (
              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                {badges.map((badge: string, i: number) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="opacity-50">•</span>}
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {badge}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    case "section_custom": {
      const sectionStyle = (content.sectionStyle || "premium") as SectionStyleVariant;
      const children: any[] = content.children || [];
      return (
        <SectionWrapper
          variant={sectionStyle}
          title={sectionStyle === "premium" ? content.title : content.title}
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

    // Legacy inline blocks
    case "heading": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      return <Tag style={st} className="font-display font-semibold text-foreground">{replaceVars(content.text, profile)}</Tag>;
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
