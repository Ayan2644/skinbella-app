# Squad skinbella-diagnostico

**Camada:** 1 — Fundação
**Agente:** Dra. Lara — Nutricionista Funcional + Dermatologista
**Foco:** Base científica — tudo que é afirmado no produto precisa ser defensável

---

## O que este squad faz

Gera os documentos científicos que fundamentam TODO o conteúdo do SKINBELLA:
- Rotinas AM/PM por perfil de pele
- Recomendações nutricionais funcionais por perfil
- Validação de claims científicos
- Biblioteca de frases defensáveis para uso em copy
- Guia alimentar complementar por perfil

**Output:** Documentos `.md` em `docs/conteudo/diagnostico/`
**Nunca:** Gera código, instruções de implementação ou claims sem fundamento

---

## Agente

### Dra. Lara — cientista
Ativar com: `@skinbella-diagnostico`

**Comandos:**
- `*criar-rotinas` — Protocolo AM/PM por perfil
- `*criar-recomendacoes-nutri` — Mapa de nutrientes por perfil
- `*validar-claims` — Auditoria de claims científicos
- `*criar-biblioteca-frases` — Frases validadas para copywriter
- `*criar-dieta-por-perfil` — Guia alimentar complementar

---

## Dependências

Este squad não tem dependências de outros squads.
É a **Camada 1** — os outros squads dependem dele.

**Squads que dependem deste:**
- skinbella-copy (usa dados de substâncias e perfis)
- skinbella-quiz (usa matriz de perfis)
- skinbella-resultado (usa claims validados)

---

## Outputs Gerados

| Documento | Path | Status |
|-----------|------|--------|
| Rotinas por perfil | `docs/conteudo/diagnostico/rotinas-por-perfil.md` | 🔲 Pendente |
| Nutrientes por perfil | `docs/conteudo/diagnostico/nutrientes-por-perfil.md` | 🔲 Pendente |
| Validação de claims | `docs/conteudo/diagnostico/validacao-claims.md` | 🔲 Pendente |
| Frases diagnóstico | `docs/conteudo/diagnostico/frases-diagnostico.md` | 🔲 Pendente |
| Dieta por perfil | `docs/conteudo/diagnostico/dieta-por-perfil.md` | 🔲 Pendente |

---

## Regras Globais

- Todos os outputs são documentos Markdown (.md) APENAS
- Claims sem evidência são sinalizados e removidos
- Prazos conservadores — melhor surpreender que decepcionar
- Validação humana obrigatória antes de handoff ao copywriter
