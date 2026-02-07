import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail } from 'lucide-react';

const faqs = [
  { q: 'O que é o SkinBella App?', a: 'SkinBella é um app de análise e acompanhamento de skincare. Através de um quiz personalizado, geramos um diagnóstico e plano de cuidados exclusivo para você.' },
  { q: 'Como usar o app?', a: 'Faça o quiz, acesse seu painel e siga a rotina, checklist e dieta diariamente. Registre selfies semanais para acompanhar sua evolução.' },
  { q: 'Em quanto tempo vejo resultados?', a: 'Resultados variam de pessoa para pessoa. Com uso consistente da rotina e suplementação, muitas pessoas relatam melhorias visíveis em 30 a 60 dias.' },
  { q: 'Tem efeitos colaterais?', a: 'Os produtos SkinBella são formulados com ingredientes seguros e de alta qualidade. Consulte seu dermatologista em caso de dúvidas específicas.' },
  { q: 'Quem pode usar?', a: 'O app e os produtos são indicados para adultos que desejam melhorar a saúde e aparência da pele. Gestantes e lactantes devem consultar um médico.' },
  { q: 'Posso refazer o quiz?', a: 'Sim! Volte à página inicial e refaça o quiz a qualquer momento para atualizar seu diagnóstico.' },
];

const Faq = () => {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">FAQ & Suporte</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Perguntas frequentes</p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="app-card !p-0 overflow-hidden border-0 shadow-card">
            <AccordionTrigger className="px-5 py-4 text-sm font-medium text-foreground hover:no-underline gap-3">
              <div className="flex items-center gap-3 text-left">
                <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                <span>{faq.q}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed ml-7">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="app-card text-center gradient-sage">
        <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Ainda tem dúvidas?</p>
        <p className="text-sm text-primary font-semibold">suporte@skinbella.app</p>
      </div>
    </section>
  );
};

export default Faq;
