// Cloudflare Pages Function: mostra o site da comunidade quando alguém acessa
// o subdomínio dela (ex.: matriz.paroquiaponte.com.br).
// Os subdomínios são definidos no painel, no campo "Subdomínio" de cada comunidade.
// Só roda na página inicial ("/"), conforme public/_routes.json; o resto do site é estático.

let cache = null;
let cacheEm = 0;

async function lerMapa(ctx, url) {
  if (cache && Date.now() - cacheEm < 60_000) return cache;
  const res = await ctx.env.ASSETS.fetch(new URL('/subdominios.json', url));
  cache = res.ok ? await res.json() : { dominio: '', subdominios: {} };
  cacheEm = Date.now();
  return cache;
}

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const host = url.hostname.toLowerCase();
  const { dominio, subdominios } = await lerMapa(ctx, url);
  if (!dominio || !host.endsWith('.' + dominio)) return ctx.next();

  const sub = host.slice(0, -(dominio.length + 1));
  const id = subdominios[sub];
  if (!id) return ctx.next();

  return ctx.env.ASSETS.fetch(new URL(`/c/${id}/`, url), ctx.request);
}
