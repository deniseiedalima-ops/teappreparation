// ═══════════════════════════════════════════════════════════════════════════
// API mínima só para o site standalone do TEAP.
// Uma única rota: recebe o resultado do simulado (enviado pelo index.html)
// e grava na base "TEAP Resultados (HTML)" no Notion.
// ═══════════════════════════════════════════════════════════════════════════

const NOTION_API = 'https://api.notion.com/v1';
const TEAP_HTML_RESULTADOS_DB = 'eed121bb-badb-4f31-a9c4-e74c31254476'; // TEAP Resultados (HTML)
const TOKEN = () => process.env.NOTION_TOKEN || '';

const nHeaders = () => ({
  'Authorization': `Bearer ${TOKEN()}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
});

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  let body = {};
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  } catch {}

  const route = req.query?.route || new URL(req.url, 'http://x').searchParams.get('route');

  try {
    if (route === 'teap-html-submit') {
      const { aluno, simulado, nota, acertos, total, categoriasErradas } = body;
      if (!aluno || !simulado) return res.status(400).json({ error: 'Missing fields' });

      const createRes = await fetch(`${NOTION_API}/pages`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({
          parent: { database_id: TEAP_HTML_RESULTADOS_DB },
          properties: {
            'Aluno': { title: [{ text: { content: aluno } }] },
            'Simulado': { rich_text: [{ text: { content: simulado } }] },
            'Data': { date: { start: new Date().toISOString().slice(0, 10) } },
            'Nota': { number: Number(nota) || 0 },
            'Acertos': { number: Number(acertos) || 0 },
            'Total': { number: Number(total) || 0 },
            'Categorias Erradas': { rich_text: [{ text: { content: JSON.stringify(categoriasErradas || {}) } }] },
          },
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        return res.status(500).json({ error: err?.message || 'Erro ao salvar no Notion' });
      }
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: `Unknown route: ${route}` });
  } catch (err) {
    console.error('[API Error]', route, err.message);
    return res.status(500).json({ error: err.message });
  }
}
