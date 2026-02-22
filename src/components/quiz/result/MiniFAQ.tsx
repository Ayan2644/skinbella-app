import { Shield } from 'lucide-react';

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
          <div
            key={faq.q}
            className="result-card-premium p-[28px]"
            style={{ borderRadius: 20 }}
          >
            <p className="text-[18px] font-semibold text-foreground mb-1.5 font-sans">{faq.q}</p>
            <p className="text-[16px] text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
        <Shield className="w-4 h-4" style={{ color: '#4E6B57' }} />
        <span>Pagamento 100% seguro • Garantia de 7 dias</span>
      </div>
    </section>
  );
}
