# Padrões de Output — skinbella-diagnostico

> Padrões de qualidade para todos os documentos gerados por este squad.
> "Coding standards" aqui são padrões de escrita e estrutura de documentos.

---

## Estrutura de Documento

### Cabeçalho Obrigatório
```markdown
# {título do documento}

**Squad:** skinbella-diagnostico
**Agente:** cientista (Dra. Lara)
**Versão:** v{N}.{M}
**Data:** {data}
**Status:** [Rascunho | Em revisão | Aprovado]
```

### Seções Obrigatórias
1. Resumo (1-2 parágrafos)
2. Conteúdo principal (por perfil quando aplicável)
3. Notas científicas
4. Limitações e avisos

---

## Padrões de Claim Científico

### Formato de Claim Forte
```
{Ativo} [mecanismo documentado] → [resultado esperado] em [prazo conservador].
```

### Formato de Claim com Hedge
```
Estudos indicam que {ativo} pode [resultado], especialmente em [condição].
```

### Proibido
- Afirmações absolutas sem evidência forte
- Prazos menores que o documentado
- Comparações com produtos específicos da concorrência

---

## Estrutura por Perfil

Todo documento que cobre os 8 perfis deve seguir esta ordem:
1. Manchas / Hiperpigmentação
2. Acne Hormonal
3. Oleosa / Poros Dilatados
4. Envelhecimento Precoce
5. Pele Seca / Desidratada
6. Pele Sensível / Reativa
7. Preventivo / Manutenção
8. Estresse / Cortisol

---

## Tabelas

Usar tabelas para comparações e matrizes:
```markdown
| Ativo | Mecanismo | Prazo | Perfis Principais |
|-------|-----------|-------|------------------|
| ... | ... | ... | ... |
```

---

## Controle de Versão

- `v0.x` — Rascunho não validado
- `v1.0` — Primeira versão para revisão humana
- `v1.x` — Ajustes pós-revisão
- `v2.0` — Revisão maior (estrutura alterada)
