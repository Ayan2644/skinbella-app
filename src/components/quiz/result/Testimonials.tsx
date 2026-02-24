import { Star, Users } from "lucide-react";
import ResultCard from "./ResultCard";
import testimonial1Img from "@/assets/result/testimonial-1.jpg";
import testimonial2Img from "@/assets/result/testimonial-2.jpg";

interface TestimonialData {
  name: string;
  text: string;
  stars: number;
  image?: string;
}

const testimonials: TestimonialData[] = [
  {
    name: "Ana C.",
    text: "Minha pele mudou completamente em 30 dias seguindo o plano!",
    stars: 5,
    image: testimonial1Img,
  },
  {
    name: "Mariana S.",
    text: "O diagnóstico foi super preciso. Nunca me cuidei tão bem!",
    stars: 5,
    image: testimonial2Img,
  },
  {
    name: "Juliana R.",
    text: "Achei que era mais um quiz, mas o plano diário realmente funciona. Estou no dia 18!",
    stars: 5,
  },
];

function TestimonialCard({ name, text, stars, image }: TestimonialData) {
  return (
    <ResultCard className="p-4">
      <div className="flex gap-3 items-start">
        {image ? (
          <img
            src={image}
            alt={`Resultado de ${name}`}
            loading="lazy"
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-border/50"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground flex-shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-accent text-accent" />
              ))}
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed italic">"{text}"</p>
        </div>
      </div>
    </ResultCard>
  );
}

export default function Testimonials() {
  return (
    <section className="px-5">
      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
        O que dizem nossas usuárias
      </p>
      <div className="space-y-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
        <Users className="w-3.5 h-3.5" />
        <span>+12.400 mulheres já fizeram a análise</span>
      </div>
    </section>
  );
}
