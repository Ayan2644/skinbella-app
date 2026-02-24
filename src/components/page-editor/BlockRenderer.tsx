import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Shield, Users } from "lucide-react";
import RejuvenationChart from "@/components/quiz/result/RejuvenationChart";
import type { PageBlock } from "@/hooks/usePageBlocks";

interface BlockRendererProps {
  block: PageBlock;
  profile?: { skinAge?: number; scores?: Record<string, number> };
  onAction?: (action: string) => void;
}

function replaceVars(text: string, profile?: BlockRendererProps["profile"]) {
  if (!profile || !text) return text;
  return text
    .replace(/\{\{skinAge\}\}/g, String(profile.skinAge ?? ""))
    .replace(/\{\{hidratacao\}\}/g, String(profile.scores?.hidratacao ?? ""))
    .replace(/\{\{textura\}\}/g, String(profile.scores?.textura ?? ""));
}

function buildStyle(styles: Record<string, any>): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (styles.fontSize) s.fontSize = styles.fontSize;
  if (styles.fontFamily) s.fontFamily = styles.fontFamily;
  if (styles.color) s.color = styles.color;
  if (styles.bgColor) s.backgroundColor = styles.bgColor;
  if (styles.padding) s.padding = styles.padding;
  if (styles.margin) s.margin = styles.margin;
  if (styles.borderRadius) s.borderRadius = styles.borderRadius;
  if (styles.textAlign) s.textAlign = styles.textAlign as any;
  if (styles.maxWidth) s.maxWidth = styles.maxWidth;
  return s;
}

export default function BlockRenderer({ block, profile, onAction }: BlockRendererProps) {
  const { block_type, content, styles } = block;
  const st = buildStyle(styles);

  switch (block_type) {
    case "heading": {
      const Tag = (content.level || "h2") as keyof JSX.IntrinsicElements;
      return <Tag style={st} className="font-display font-semibold text-foreground">{replaceVars(content.text, profile)}</Tag>;
    }
    case "text":
      return <p style={st} className="text-foreground/80 leading-relaxed">{replaceVars(content.text, profile)}</p>;
    case "image":
      return content.src ? (
        <img src={content.src} alt={content.alt || ""} style={{ ...st, objectFit: content.objectFit || "cover" }} className="w-full" />
      ) : (
        <div style={st} className="w-full h-32 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">Sem imagem</div>
      );
    case "button":
      return (
        <div style={{ textAlign: st.textAlign || "center" as any, padding: st.padding }}>
          <Button onClick={() => onAction?.(content.action || "checkout")} className="rounded-2xl h-14 px-8 text-base font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            {replaceVars(content.text, profile)}
          </Button>
        </div>
      );
    case "spacer":
      return <div style={{ height: content.height || 32 }} />;
    case "chart":
      return (
        <div style={st}>
          <RejuvenationChart skinAge={profile?.skinAge || 35} />
        </div>
      );
    case "code":
      return (
        <div style={st}>
          {content.css && <style>{content.css}</style>}
          <div dangerouslySetInnerHTML={{ __html: content.html || "" }} />
        </div>
      );
    case "offer":
      return (
        <div style={st} className="rounded-3xl p-6 border border-border/30 bg-card">
          <h3 className="text-xl font-semibold text-foreground mb-3">{replaceVars(content.title, profile)}</h3>
          <ul className="space-y-2 mb-4">
            {(content.items || []).map((item: string, i: number) => (
              <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-2">
            {content.originalPrice && <span className="text-sm text-muted-foreground line-through">R$ {content.originalPrice}</span>}
            <span className="text-3xl font-bold text-foreground">R$ {content.price}</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
        </div>
      );
    case "testimonials":
      return (
        <div style={st} className="space-y-3">
          {(content.items || []).map((t: any, i: number) => (
            <div key={i} className="rounded-2xl p-4 border border-border/30 bg-card">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{t.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars || 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
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
            <div key={i} className="rounded-2xl p-5 border border-border/30 bg-card">
              <p className="text-base font-semibold text-foreground mb-1">{f.q}</p>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
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
      return <div className="text-xs text-muted-foreground p-2">Bloco desconhecido: {block_type}</div>;
  }
}
