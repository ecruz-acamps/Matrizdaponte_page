import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const horario = z.object({
  dia: z.string(),
  hora: z.string(),
  observacao: z.string().optional().nullable(),
});

const comunidades = defineCollection({
  loader: glob({ pattern: '*.{yml,yaml}', base: './src/content/comunidades' }),
  schema: z.object({
    nome: z.string(),
    bairro: z.string(),
    subdominio: z.string().optional().nullable(),
    ordem: z.number().default(99),
    padroeiros: z.array(z.string()).default([]),
    endereco: z.string().optional().nullable(),
    foto: z.string().optional().nullable(),
    descricao: z.string().optional().nullable(),
    missas: z.array(horario).default([]),
    confissoes: z.array(horario).default([]),
    outros_horarios: z.array(horario).default([]),
  }),
});

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: z.object({
    titulo: z.string(),
    data: z.coerce.date(),
    comunidade: z.string().nullish().transform((v) => v || 'paroquia'),
    capa: z.string().optional().nullable(),
    resumo: z.string().optional().nullable(),
    destaque: z.boolean().default(false),
    rascunho: z.boolean().default(false),
  }),
});

const eventos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eventos' }),
  schema: z.object({
    titulo: z.string(),
    inicio: z.coerce.date(),
    fim: z.coerce.date().optional().nullable(),
    horario: z.string().optional().nullable(),
    local: z.string().optional().nullable(),
    comunidade: z.string().nullish().transform((v) => v || 'paroquia'),
    imagem: z.string().optional().nullable(),
  }),
});

const pastorais = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pastorais' }),
  schema: z.object({
    nome: z.string(),
    resumo: z.string().optional().nullable(),
    encontros: z.string().optional().nullable(),
    contato: z.string().optional().nullable(),
    imagem: z.string().optional().nullable(),
  }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string().optional().nullable(),
    grupo: z.enum(['sacramentos', 'paroquia']).default('paroquia'),
    ordem: z.number().default(99),
    imagem: z.string().optional().nullable(),
  }),
});

const galeria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galeria' }),
  schema: z.object({
    titulo: z.string(),
    data: z.coerce.date(),
    comunidade: z.string().nullish().transform((v) => v || 'paroquia'),
    capa: z.string().optional().nullable(),
    fotos: z.array(z.object({ imagem: z.string(), legenda: z.string().optional().nullable() })).default([]),
  }),
});

export const collections = { comunidades, noticias, eventos, pastorais, paginas, galeria };
