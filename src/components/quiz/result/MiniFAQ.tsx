import { Shield } from 'lucide-react';
import ResultCard from './ResultCard';

const faqs = [
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim! Você pode cancelar a qualquer momento, sem burocracia. Sem fidelidade.',
  },
  {
    q: 'Em quanto tempo vejo resultado?',
    a: 'A maioria das usuárias percebe melhora visível na textura e hidratação em 7 a 14 dias.',
  },
  {
    q: 'Preciso comprar produtos caros?',
    a: 'Não. O protocolo funciona com produtos acessíveis de farmácia. Nada de marcas premium obrigatórias.',
  },
];

export default function MiniFAQ() {
  return (
    <section className="px-5">
      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
        Dúvidas frequentes
      </p>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <ResultCard key={faq.q} className="p-4">
            <p className="text-[14px] font-semibold text-foreground mb-1.5">{faq.q}</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
          </ResultCard>
        ))}
      </div>

      {/* Guarantee */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
        <Shield className="w-4 h-4 text-primary" />
        <span>Pagamento 100% seguro • Garantia de 7 dias</span>
      </div>
    </section>
  );
}
