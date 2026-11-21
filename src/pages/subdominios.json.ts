import { getComunidades, paroquia } from '../lib/data';

// Gera /subdominios.json, usado pela função do Cloudflare (functions/_middleware.ts)
// para saber qual comunidade mostrar em cada subdomínio.
export async function GET() {
  const comunidades = await getComunidades();
  const subdominios: Record<string, string> = {};
  for (const c of comunidades) {
    const sub = (c.data.subdominio ?? '').trim().toLowerCase();
    if (sub) subdominios[sub] = c.id;
  }
  const dominio = new URL(paroquia.site_principal).hostname.replace(/^www\./, '');
  return new Response(JSON.stringify({ dominio, subdominios }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
