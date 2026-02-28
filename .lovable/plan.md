

## Plano: Criar predefinição "Lovi Skincare" baseada no quiz analisado

### Contexto
O arquivo `lovi_skincare_quiz_analise_completa.md` documenta 35 etapas do quiz Lovi. Vou adaptar as perguntas mais relevantes ao nosso sistema de tipos (`cards-emoji`, `multi-chips`, `slider`, `selfie`) e criar uma nova predefinição no banco de dados.

### Mapeamento das perguntas Lovi → SkinBella

Vou selecionar ~20 perguntas-chave (removendo telas intermediárias/informativas que não são perguntas), adaptadas ao português:

| # | Pergunta Lovi | Tipo no editor |
|---|--------------|----------------|
| 1 | Gênero | cards-emoji |
| 2 | Faixa etária | cards-emoji |
| 3 | Preocupações com a pele (multi) | multi-chips |
| 4 | Tipo de pele | cards-emoji |
| 5 | Áreas para melhorar (multi) | multi-chips |
| 6 | Rotina diária | cards-emoji |
| 7 | Produtos usados (multi) | multi-chips |
| 8 | Protetor solar | cards-emoji |
| 9 | Antioxidantes | cards-emoji |
| 10 | Ácidos | cards-emoji |
| 11 | Retinol e Vitamina C | cards-emoji |
| 12 | Preocupações adicionais (multi) | multi-chips |
| 13 | Hidratação da pele | cards-emoji |
| 14 | O que incomoda durante o dia (multi) | multi-chips |
| 15 | Sensibilidade | cards-emoji |
| 16 | Sono | cards-emoji |
| 17 | Consumo de água | cards-emoji |
| 18 | Estresse | cards-emoji |
| 19 | Objetivos (multi) | multi-chips |
| 20 | Selfie / Face scan | selfie |

### Etapas de implementação

1. **Inserir registro na tabela `quiz_presets`** — preset_id `lovi_skincare`, name "Lovi Skincare", is_active = false
2. **Inserir ~20 linhas na tabela `quiz_questions`** — cada uma com quiz_id `lovi_skincare`, sort_order sequencial, question_data com id/type/title/subtitle/options, styles vazio
3. **Testar no editor** — navegar ao Quiz Editor, selecionar a predefinição "Lovi Skincare", verificar que as perguntas aparecem corretamente

### Detalhes técnicos
- Usarei o insert tool (não migration) para inserir dados
- Todas as perguntas terão `is_visible = true` e `styles = '{}'`
- O preset começa inativo (`is_active = false`) para não afetar o quiz público
- Após criar, o admin pode ativar pelo editor

