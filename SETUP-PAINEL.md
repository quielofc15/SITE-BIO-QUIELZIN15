# Painel administrativo QUIEZIN15

Abra `/admin/` no site publicado na Vercel.

## 1. Supabase SQL Editor

Execute:

```sql
create table if not exists public.site_theme (
  id integer primary key check (id = 1),
  settings jsonb not null default '{}'::jsonb
);

alter table public.site_theme enable row level security;
revoke all on public.site_theme from anon, authenticated;
```

A API acessa a tabela somente no servidor com a chave de serviço.

## 2. Supabase Authentication

Em Authentication > Users, crie um usuário com e-mail e senha fortes. Confirme o e-mail. Esse será o administrador.

## 3. Vercel > Settings > Environment Variables

- `SUPABASE_URL`: URL do projeto Supabase (já usada pelo contador).
- `SUPABASE_SECRET_KEY`: chave secreta/service_role (já usada pelo contador). **Nunca exponha no frontend.**
- `SUPABASE_ANON_KEY`: chave pública anon/publishable para login.
- `ADMIN_EMAIL`: e-mail exato do usuário administrador criado no Supabase.

Faça um novo deploy depois de configurar as variáveis.

## 4. Uso

Acesse `https://seu-dominio/admin/`, entre com e-mail e senha, escolha as cores arrastando o seletor e clique em Salvar e publicar. A página pública busca as cores da API em cada carregamento.

No Live Server a API `/api/theme` não roda. Para testar o salvamento, use a Vercel ou `vercel dev` com as variáveis configuradas.

O contador `/api/visits` original foi preservado.
