# TEAP standalone — como subir

Site separado, só pra isso: um `index.html` (a prova) + uma função na Vercel
(`api/index.js`) que grava os resultados no Notion. Sem React, sem build.

## 1. Criar o repositório no GitHub
1. github.com → **New repository** → nome sugerido: `teap-english-with-denise`
2. Marque como **Public** ou **Private** (tanto faz — não tem chave nenhuma no código)
3. Não inicialize com README (vamos subir os arquivos direto)
4. Arraste os 3 itens desta pasta (`index.html`, `package.json`, a pasta `api/`) pra
   área de upload do GitHub → Commit

## 2. Criar o projeto na Vercel
1. vercel.com → **Add New → Project**
2. Importe o repositório `teap-english-with-denise` que você acabou de criar
3. Framework Preset: deixe **Other** (não precisa de build)
4. **Antes de clicar em Deploy**, abra "Environment Variables" e adicione:
   - Nome: `NOTION_TOKEN`
   - Valor: o mesmo token que já está configurado no seu projeto
     `english-with-denise` (Settings → Environment Variables lá, copia o
     valor de `NOTION_TOKEN` ou `REACT_APP_NOTION_TOKEN`)
5. Deploy

Pronto — a Vercel te dá uma URL nova (tipo `teap-english-with-denise.vercel.app`).
É esse link que você compartilha com os alunos a partir de agora.

## 3. Testar
Abre o link, faz login com um nome de teste, responde o Simulado 1, finaliza,
e confere se aparece "✓ Enviado para o Notion" — e se a linha aparece na base
**TEAP Resultados (HTML)**: https://app.notion.com/p/eed121bbbadb4f31a9c4e74c31254476

## Daqui pra frente
Toda vez que eu atualizar o conteúdo (novos simulados, questões de prática),
você só precisa substituir o `index.html` nesse repositório novo — o `api/`
não muda, a menos que eu avise.
