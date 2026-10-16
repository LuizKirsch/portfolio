# Fluxo de implementação de issues

As tarefas ficam nas issues deste repositório e no board:
https://github.com/users/LuizKirsch/projects/2 (owner `LuizKirsch`, projeto `2`)

Colunas (campo `Status`): To do · Revisão humana · Pronto para IA · Fazendo · Pronto para teste · Com problema · Finalizado

Branch e PR fazem parte deste fluxo porque o GitHub não dispara nada quando um card muda de coluna em projeto de usuário. Quem move o card cria a branch e o PR.

## O que pode pegar
- Só pegue issues com Status **Pronto para IA**. Nunca pegue de outra coluna, mesmo que eu peça "o próximo card" sem especificar.
- Uma issue por vez. Termine (ou devolva) antes de pegar outra.
- Se não houver nada em "Pronto para IA", diga isso e pare.

## Passo a passo
1. **Escolher:** liste os itens do board e pegue o primeiro com Status "Pronto para IA".
2. **Ler tudo:** `gh issue view N --comments`. Minhas respostas ficam nos comentários. Se dois comentários se contradizem, vale o mais recente. O "Critério de aceite" na descrição define quando está pronto.
3. **Fazendo:**
   - Garanta que a `main` local está atualizada (`git checkout main && git pull`).
   - Crie a branch vinculada à issue: `gh issue develop N --base main --checkout`. Ela sai como `N-<slug>` e já aparece em "Development" na issue.
   - Mova o card para **Fazendo** antes de escrever qualquer código.
4. **Implementar:**
   - Faça só o que a issue pede. O que estiver em "Fora do escopo" não entra.
   - Commits na branch da issue, citando o número: `#N descrição`.
   - Rode o build antes de terminar e corrija o que quebrar.
5. **Pronto para teste:**
   - `git push -u origin HEAD`
   - `gh pr create --base main --title "<título da issue>" --body "Closes #N ..."`, explicando o que mudou e como testar.
   - Comente na issue com o link do PR e um resumo curto.
   - Só depois do PR aberto, mova o card para **Pronto para teste**.

## Quando travar
- Se faltar informação ou a resposta estiver ambígua, **não invente**. Isso vale principalmente para textos sobre mim (problema, papel, resultado, trajetória): use só o que está escrito na issue e nos comentários.
- Nesse caso, comente na issue o que está faltando, mova para **Com problema** e pare. Se já houver commits, faça push da branch, mas não abra PR.

## Nunca
- Mover para "Finalizado", fazer merge do PR ou fechar a issue. Isso é comigo depois de testar.
- Commitar direto na `main`.
- Mexer em issues de "Revisão humana" ou "To do".
- Pegar mais de uma issue na mesma execução sem eu pedir.

## Comandos úteis
```bash
# IDs do projeto e do campo Status (com as opções de cada coluna)
gh project view 2 --owner LuizKirsch --format json --jq .id
gh project field-list 2 --owner LuizKirsch --format json

# Itens do board com status
gh project item-list 2 --owner LuizKirsch --format json --limit 100

# Mover um card
gh project item-edit --id <ITEM_ID> --project-id <PROJECT_ID> \
  --field-id <STATUS_FIELD_ID> --single-select-option-id <OPTION_ID>

# Ler a issue com comentários
gh issue view N --comments

# Branch vinculada à issue (Fazendo)
gh issue develop N --base main --checkout

# PR para a main (Pronto para teste)
git push -u origin HEAD
gh pr create --base main --title "<título>" --body "Closes #N"
```
