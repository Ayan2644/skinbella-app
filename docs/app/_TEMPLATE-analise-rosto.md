# ANÁLISE DE ROSTO (Face Analysis)

## Visão Geral
[VOCÊ PREENCHE: Como deve funcionar a análise de rosto?]

---

## Para MVP (v1.0)

### Opção 1: Simulada (Sem IA Real)
[VOCÊ PREENCHE: Se for simulada no MVP, como funciona?]

**Como funciona:**
- Usuária tira foto ou faz upload
- App finge que está analisando (loading 7-10 segundos)
- Resultado é baseado nas respostas do quiz (não na foto real)
- Foto é salva para uso futuro (quando IA entrar)

**Prós:**
- Lança mais rápido (sem custo de ML)
- Valida mercado primeiro
- Foto fica salva para quando IA real entrar

**Contras:**
- Não é análise real (pode gerar expectativa errada)
- Precisa deixar claro que é baseado no quiz

---

### Opção 2: IA Real (Com Machine Learning)
[VOCÊ PREENCHE: Se for IA real desde v1.0, como funciona?]

**Como funciona:**
- Integração com serviço de ML (AWS Rekognition? Google Vision? Custom model?)
- Análise real de:
  - [ ] Rugas/linhas finas
  - [ ] Manchas/hiperpigmentação
  - [ ] Poros
  - [ ] Textura da pele
  - [ ] Olheiras
  - [ ] Flacidez
  - [ ] Outros?

**Custos:**
- API de análise: R$ __ por análise
- Ou modelo custom: R$ __ /mês

**Prós:**
- Análise real e precisa
- Maior credibilidade
- Pode mostrar mapas de calor (regiões problemáticas)

**Contras:**
- Mais caro (custo por análise)
- Mais complexo (demora 2-4 semanas para implementar)
- Precisa de muitos dados de treinamento (se for custom)

---

## Escolha para v1.0
[VOCÊ DECIDE: Qual opção para o MVP?]
- [ ] Opção 1: Simulada (lança rápido, valida mercado)
- [ ] Opção 2: IA Real (mais caro, mais demorado, mas mais preciso)

**Decisão:** ______________

**Justificativa:** ______________

---

## Fluxo da Análise (UX)

### Passo 1: Captura da Foto
[VOCÊ PREENCHE: Como a usuária tira a foto?]
- [ ] Câmera frontal do celular
- [ ] Ou upload de galeria
- [ ] Tem guia visual? (círculo para posicionar rosto)
- [ ] Valida qualidade da foto? (iluminação, foco, etc.)

### Passo 2: Processing
[VOCÊ PREENCHE: O que acontece enquanto processa?]
- Loading screen com mensagens:
  - "Analisando sua pele..."
  - "Identificando linhas finas..."
  - "Calculando idade da pele..."
- Quanto tempo? __ segundos

### Passo 3: Resultado
[VOCÊ PREENCHE: Como mostrar o resultado?]
- [ ] Foto com marcações (regiões problemáticas)
- [ ] Mapa de calor (vermelho = problema, verde = ok)
- [ ] Lista de problemas identificados
- [ ] Scores por região do rosto

---

## Regiões Analisadas

[VOCÊ PREENCHE: Quais regiões do rosto analisar?]
- [ ] Testa
- [ ] Olhos (rugas, olheiras)
- [ ] Bochechas (manchas, poros)
- [ ] Nariz (poros, oleosidade)
- [ ] Queixo (acne, textura)
- [ ] Pescoço (flacidez)

---

## Privacidade e Dados

[VOCÊ PREENCHE: Como tratar a privacidade?]
- [ ] Foto é armazenada onde? (Supabase Storage? AWS S3?)
- [ ] É criptografada?
- [ ] Usuária pode deletar a foto?
- [ ] Foto é usada para treinar modelo? (precisa consentimento)
- [ ] LGPD compliant?

---

## Projeção Antes/Depois

[VOCÊ PREENCHE: Mostrar projeção de resultados?]
- [ ] Mostrar "antes" (foto atual)
- [ ] Mostrar "depois" projetado (como a pele pode ficar em X semanas)
- [ ] Como gerar o "depois"? (IA generativa? Filtro simulado?)
- [ ] É realista ou apenas motivacional?

**Decisão:** ______________
