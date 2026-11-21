# Site da Paróquia São Judas Tadeu e São João Batista

Site da paróquia (Ponte do Imaruim, Palhoça – SC) com páginas para cada comunidade e um painel
para a equipe da paróquia atualizar o conteúdo sem mexer em código.

| Parte | Ferramenta | Custo |
| --- | --- | --- |
| Site | [Astro](https://astro.build) (páginas estáticas) | grátis |
| Painel do administrador | [Sveltia CMS](https://sveltiacms.app) em `/admin` | grátis |
| Login do painel | [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) no Cloudflare Workers | grátis |
| Hospedagem | Cloudflare Pages | grátis |
| DNS e HTTPS | Cloudflare | grátis |

## Guias

- **[Publicar o site, apontar o domínio e criar subdomínios](docs/publicacao.md)** (para quem configura, uma vez só)
- **[Como usar o painel](docs/painel.md)** (para o administrador da paróquia)

## Como funciona

1. O administrador entra em `https://www.paroquiaponte.com.br/admin` com a conta GitHub dele.
2. Ao salvar uma notícia, horário ou foto, o painel grava o arquivo neste repositório.
3. O Cloudflare Pages percebe a mudança, gera o site de novo e publica em cerca de 1 minuto.

## Onde fica cada coisa

```
src/content/comunidades/   uma ficha por comunidade (horários de missa, confissão, padroeiros, subdomínio)
src/content/noticias/      notícias e avisos
src/content/eventos/       agenda
src/content/pastorais/     pastorais e movimentos
src/content/paginas/       batismo, catequese, matrimônio, dízimo e outras páginas
src/content/galeria/       álbuns de fotos
src/data/paroquia.json     dados gerais (endereço, telefone, redes sociais, faixa de aviso)
public/uploads/            imagens enviadas pelo painel
public/admin/              painel (config.yml define os formulários)
functions/_middleware.js   mostra a página da comunidade quando se acessa o subdomínio dela
public/_redirects          leva os endereços do site antigo para as páginas novas
```

## Subdomínios das comunidades

Cada comunidade tem sua página em `/c/<nome>/`. Quando o campo **Subdomínio** da comunidade é
preenchido no painel (ex.: `matriz`) e o subdomínio é adicionado no Cloudflare Pages, o endereço
`matriz.paroquiaponte.com.br` passa a mostrar a página daquela comunidade. Notícias e eventos com a
comunidade marcada aparecem no site dela e também no site principal. Detalhes no
[guia de publicação](docs/publicacao.md#5-subdomínios-das-comunidades).

## Rodar no computador

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a pasta dist/
```
