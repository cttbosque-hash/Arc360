# 🚀 Guia Completo de Configuração do Supabase para ARC 360

## 📋 Passo 1: Criar Conta no Supabase

1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou Email
4. Você será redirecionado para o Dashboard

## 🏗️ Passo 2: Criar Novo Projeto

1. No Dashboard do Supabase, clique em "New Project"
2. Preencha os dados:
   - **Name**: ARC360
   - **Database Password**: Crie uma senha forte (ANOTE ESTA SENHA!)
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (para começar)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos enquanto o projeto é criado

## 🔑 Passo 3: Obter as Chaves de API

1. No menu lateral, clique em "Settings" (ícone de engrenagem)
2. Clique em "API"
3. Você verá duas chaves importantes:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** (chave pública - começa com "eyJ...")

**⚠️ IMPORTANTE: Copie estas duas informações!**

## 📊 Passo 4: Criar as Tabelas no Banco de Dados

1. No menu lateral do Supabase, clique em "SQL Editor"
2. Clique em "New query"
3. Copie TODO o conteúdo do arquivo `scripts/supabase-schema.sql` deste projeto
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl/Cmd + Enter)
6. Aguarde a execução - você verá "Success. No rows returned"

✅ Pronto! Todas as tabelas foram criadas com:
- Row Level Security (RLS) ativado
- Políticas de segurança configuradas
- Índices para performance
- Triggers para atualização automática de timestamps

## 🔧 Passo 5: Configurar as Variáveis de Ambiente no Projeto

### Opção A: No v0 (Desenvolvimento)
1. No v0, clique no ícone "Vars" na barra lateral esquerda
2. Adicione as seguintes variáveis:
   - **Nome**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Valor**: Cole a Project URL do Supabase
   
   - **Nome**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Valor**: Cole a anon public key do Supabase

### Opção B: No Vercel (Produção)
1. Acesse seu projeto no Vercel Dashboard
2. Vá em Settings > Environment Variables
3. Adicione as mesmas variáveis acima
4. Clique em "Save"
5. Faça um novo deploy para aplicar as variáveis

### Opção C: Localmente (se estiver rodando local)
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 🧪 Passo 6: Testar a Conexão

1. Faça o deploy ou execute o projeto
2. Crie uma nova conta ou faça login
3. Tente adicionar uma tarefa, hábito ou projeto
4. Verifique no Supabase:
   - Vá em "Table Editor"
   - Clique na tabela correspondente (ex: tasks)
   - Você deve ver os dados salvos!

## 🔒 Passo 7: Configurar Autenticação (Opcional)

1. No Supabase, vá em "Authentication" > "Providers"
2. Configure os provedores que desejar:
   - Email/Password (já está ativo por padrão)
   - Google OAuth
   - GitHub OAuth
   - Etc.

## 📈 Passo 8: Monitoramento

Para ver as operações em tempo real:
1. No Supabase, vá em "Database" > "Logs"
2. Ou acesse "API" > "Logs" para ver as requisições

## 🆘 Solução de Problemas

### Erro: "relation does not exist"
- Execute novamente o script SQL completo
- Verifique se todas as tabelas foram criadas em "Table Editor"

### Erro: "Invalid API key"
- Verifique se copiou a chave correta (anon public, não service_role)
- Confirme se as variáveis de ambiente foram salvas corretamente

### Erro: "Row Level Security policy violation"
- Certifique-se de que o usuário está autenticado
- Verifique se as políticas RLS foram criadas corretamente

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Chaves de API copiadas
- [ ] Script SQL executado com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Teste de criação de dados realizado
- [ ] Dados aparecendo no Supabase

## 🎉 Pronto!

Agora o ARC 360 está completamente integrado com Supabase e todos os dados dos usuários são salvos na nuvem de forma segura e escalável!
