# Publicar o site, apontar o domínio e criar subdomínios

Este guia é feito uma vez só. Tudo usa planos gratuitos. Leva cerca de 40 minutos, mais o tempo
de propagação do DNS (de minutos a algumas horas).

Você vai precisar de:

- a conta GitHub onde está este repositório;
- uma conta no Cloudflare (grátis): https://dash.cloudflare.com/sign-up;
- acesso ao Registro.br (onde o domínio `paroquiaponte.com.br` está registrado).

> **Mantenha o site antigo no ar até o passo 4 terminar.** Ele só sai do ar quando o DNS passar a
> apontar para o Cloudflare Pages.

---

## 1. Colocar o domínio no Cloudflare (DNS)

1. No Cloudflare, clique em **Add a domain** (Adicionar domínio), digite `paroquiaponte.com.br` e
   escolha o plano **Free**.
2. O Cloudflare copia os registros DNS atuais. **Confira a lista** antes de continuar:
   - mantenha os registros **MX** e **TXT** (e-mail, verificações do Google etc.);
   - mantenha o registro da intranet (`paroquiaponte.web2165.uni5.net` é outro endereço e não muda);
   - os registros `A`/`CNAME` de `paroquiaponte.com.br` e `www` podem ficar por enquanto: eles
     continuam mostrando o site antigo até o passo 4.
3. O Cloudflare mostra **dois servidores de nomes (nameservers)**, algo como
   `ana.ns.cloudflare.com` e `bob.ns.cloudflare.com`. Anote os dois.
4. Entre no **Registro.br** → **Painel** → clique em `paroquiaponte.com.br` →
   **DNS** → **Alterar servidores DNS**.
5. Apague os servidores atuais, cole os dois servidores do Cloudflare e salve.
6. Volte ao Cloudflare e clique em **Check nameservers**. Quando o domínio ficar **Active**
   (você recebe um e-mail), o Cloudflare passou a ser o gerenciador de DNS.

> O Registro.br pode levar algumas horas para aplicar a mudança. O site antigo continua no ar
> durante esse tempo.

## 2. Publicar o site no Cloudflare Pages

1. No Cloudflare: **Workers & Pages** → **Create** → aba **Pages** →
   **Connect to Git** (Importar repositório existente).
2. Conecte sua conta GitHub e escolha este repositório.
3. Configuração do build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - Em **Environment variables**, adicione `NODE_VERSION` = `22`.
4. Clique em **Save and Deploy**. Em 1 ou 2 minutos o site fica no ar num endereço provisório como
   `site-paroquia-ponte.pages.dev`. Abra e confira.

A partir de agora, toda alteração salva no repositório (inclusive pelo painel) publica o site
sozinha.

## 3. Ativar o login do painel

O painel usa o login do GitHub. Para isso é preciso um pequeno "autenticador" gratuito no
Cloudflare e um "OAuth App" no GitHub.

### 3.1 Criar o autenticador no Cloudflare

1. Abra https://github.com/sveltia/sveltia-cms-auth e clique no botão
   **Deploy to Cloudflare Workers**.
2. Siga as telas (ele usa sua conta Cloudflare). No fim você recebe um endereço como
   `https://sveltia-cms-auth.SEU-USUARIO.workers.dev`. **Anote esse endereço.**

### 3.2 Criar o OAuth App no GitHub

1. No GitHub: foto do perfil → **Settings** → **Developer settings** → **OAuth Apps** →
   **New OAuth App**.
2. Preencha:
   - **Application name:** Painel Paróquia da Ponte
   - **Homepage URL:** `https://www.paroquiaponte.com.br`
   - **Authorization callback URL:** `https://sveltia-cms-auth.SEU-USUARIO.workers.dev/callback`
     (o endereço do passo 3.1, terminando em `/callback`)
3. Clique em **Register application**. Copie o **Client ID**, clique em
   **Generate a new client secret** e copie o **Client secret**.

### 3.3 Ligar os dois

1. No Cloudflare: **Workers & Pages** → `sveltia-cms-auth` → **Settings** →
   **Variables and Secrets** → adicione:
   - `GITHUB_CLIENT_ID` = o Client ID
   - `GITHUB_CLIENT_SECRET` = o Client secret (marque como **Secret**)
   - `ALLOWED_DOMAINS` = `paroquiaponte.com.br, *.paroquiaponte.com.br, *.pages.dev`
2. Salve e clique em **Deploy** se pedir.

### 3.4 Apontar o painel para o repositório e o autenticador

No arquivo `public/admin/config.yml`, troque as duas linhas marcadas com `TROCAR`:

```yaml
backend:
  name: github
  repo: SEU-USUARIO/site-paroquia-ponte
  branch: main
  base_url: https://sveltia-cms-auth.SEU-USUARIO.workers.dev
```

Salve (pode ser direto pelo site do GitHub, no lápis de editar). O site republica sozinho.

### 3.5 Dar acesso ao administrador da paróquia

1. O administrador cria uma conta grátis em https://github.com/signup.
2. No repositório: **Settings** → **Collaborators** → **Add people** → digite o usuário dele →
   permissão **Write**.
3. Ele aceita o convite que chega por e-mail e já pode entrar em
   `https://www.paroquiaponte.com.br/admin`.

Para tirar o acesso de alguém, é só remover a pessoa da lista de Collaborators.

## 4. Apontar o domínio para o site novo

Quando o domínio estiver **Active** no Cloudflare (passo 1):

1. No Cloudflare: **Workers & Pages** → seu projeto Pages → **Custom domains** →
   **Set up a custom domain**.
2. Digite `www.paroquiaponte.com.br` e confirme. Como o DNS já está no Cloudflare, ele troca o
   registro `www` sozinho e emite o certificado HTTPS.
3. Repita com `paroquiaponte.com.br` (sem www).
4. Para que o endereço sem www sempre vá para o www: **Rules** → **Redirect Rules** →
   **Create rule** → modelo **Redirect from Root to WWW** → **Deploy**.
5. Em alguns minutos `https://www.paroquiaponte.com.br` mostra o site novo. Os endereços antigos
   (como `/a-paroquia/horarios-de-missas/`) já redirecionam para as páginas novas.

Se aparecer erro de certificado nos primeiros minutos, aguarde: o Cloudflare ainda está emitindo.

## 5. Subdomínios das comunidades

Você escolhe o nome de cada subdomínio. Para cada comunidade:

1. **No painel** (`/admin`) → **Comunidades** → abra a comunidade → preencha **Subdomínio** só com
   a primeira parte (ex.: `matriz` para `matriz.paroquiaponte.com.br`) → **Salvar**.
2. **No Cloudflare** → **Workers & Pages** → projeto Pages → **Custom domains** →
   **Set up a custom domain** → digite o subdomínio completo (ex.: `matriz.paroquiaponte.com.br`)
   → confirme. O Cloudflare cria o DNS e o HTTPS sozinho.

Pronto: depois de 1 ou 2 minutos o subdomínio mostra a página daquela comunidade, com os horários,
notícias e eventos dela. Para criar uma comunidade nova, use **Comunidades → Novo** no painel e
repita os dois passos.

> O Cloudflare Pages não aceita subdomínio "coringa" (`*.paroquiaponte.com.br`), por isso cada
> subdomínio é adicionado uma vez no passo 2. O plano grátis permite até 100 domínios por projeto.

Se um subdomínio for adicionado no Cloudflare mas não estiver preenchido em nenhuma comunidade, ele
mostra o site principal da paróquia.

## 6. Depois que tudo estiver no ar

- Confira se e-mails do domínio (se houver) continuam chegando.
- Quando estiver tudo certo por alguns dias, você pode cancelar a hospedagem do WordPress antigo.
  **Antes disso, baixe as fotos antigas** que quiser guardar (a pasta `wp-content/uploads`).
