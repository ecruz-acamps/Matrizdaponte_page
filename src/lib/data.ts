import { getCollection, type CollectionEntry } from 'astro:content';
import paroquia from '../data/paroquia.json';

export { paroquia };

export const DIAS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

/** Converte o texto do dia (ex.: "Segunda a sexta") nos números de dias da semana (0 = domingo). */
export function diasDaSemana(dia: string): number[] {
  const d = dia.toLowerCase();
  if (d.includes('todos')) return [0, 1, 2, 3, 4, 5, 6];
  if (d.includes('segunda a sexta')) return [1, 2, 3, 4, 5];
  if (d.includes('segunda a sábado') || d.includes('segunda a sabado')) return [1, 2, 3, 4, 5, 6];
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const idx = nomes.findIndex((n) => d.startsWith(n));
  return idx >= 0 ? [idx] : [];
}

export async function getComunidades() {
  const all = await getCollection('comunidades');
  return all.sort((a, b) => a.data.ordem - b.data.ordem || a.data.nome.localeCompare(b.data.nome));
}

export async function getComunidade(id: string) {
  return (await getComunidades()).find((c) => c.id === id);
}

export async function getNoticias(comunidade?: string) {
  const all = await getCollection('noticias', (n) => !n.data.rascunho);
  return all
    .filter((n) => !comunidade || n.data.comunidade === comunidade || n.data.comunidade === 'paroquia')
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export async function getEventos(comunidade?: string) {
  const all = await getCollection('eventos');
  return all
    .filter((e) => !comunidade || e.data.comunidade === comunidade || e.data.comunidade === 'paroquia')
    .sort((a, b) => a.data.inicio.getTime() - b.data.inicio.getTime());
}

export async function getGaleria(comunidade?: string) {
  const all = await getCollection('galeria');
  return all
    .filter((g) => !comunidade || g.data.comunidade === comunidade || g.data.comunidade === 'paroquia')
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

export function nomeComunidade(id: string, comunidades: CollectionEntry<'comunidades'>[]) {
  if (id === 'paroquia') return 'Paróquia';
  const c = comunidades.find((c) => c.id === id);
  return c ? `${c.data.bairro}` : id;
}

const fmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtCurto = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });

export const formatarData = (d: Date) => fmt.format(d);
export const diaMes = (d: Date) => ({
  dia: String(d.getUTCDate()).padStart(2, '0'),
  mes: fmtCurto.format(d).split(' ').pop()!.replace('.', ''),
});

/** Ordena horários pela ordem da semana (domingo por último, como costuma aparecer em paróquias). */
export function ordenarHorarios<T extends { dia: string; hora: string }>(lista: T[]) {
  const peso = (dia: string) => {
    const ds = diasDaSemana(dia);
    if (!ds.length) return 99;
    return ds[0] === 0 ? 7 : ds[0];
  };
  return [...lista].sort((a, b) => peso(a.dia) - peso(b.dia) || a.hora.localeCompare(b.hora));
}
