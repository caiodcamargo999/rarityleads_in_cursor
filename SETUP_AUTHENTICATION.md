# 🔐 Rarity Leads - Authentication Setup Guide

Este guia completo irá te ajudar a configurar o sistema de autenticação completo com Supabase, incluindo login/registro com Google e verificação por email.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Conta no [Google Cloud Console](https://console.cloud.google.com) (para OAuth)
- Conta no [GitHub](https://github.com/settings/developers) (opcional, para OAuth)

## 🚀 Passo 1: Configurar Projeto Supabase

### 1.1 Criar Novo Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Defina:
   - **Name**: `rarity-leads`
   - **Database Password**: (senha forte)
   - **Region**: (mais próxima dos usuários)
5. Clique em "Create new project"

### 1.2 Configurar Database
1. Vá para **SQL Editor** no painel lateral
2. Copie todo o conteúdo do arquivo `schema_new.sql`
3. Cole no editor e execute (clique em "Run")
4. Aguarde a execução completar

### 1.3 Obter Credenciais
1. Vá para **Settings > API**
2. Copie:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🔑 Passo 2: Configurar OAuth (Google)

### 2.1 Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Vá para **APIs & Services > Credentials**
4. Clique em **Create Credentials > OAuth 2.0 Client IDs**
5. Configure:
   - **Application type**: Web application
   - **Name**: Rarity Leads
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs**:
     - `https://seu-projeto.supabase.co/auth/v1/callback`
6. Copie o **Client ID**

### 2.2 Configurar no Supabase
1. No Supabase, vá para **Authentication > Providers**
2. Encontre **Google** e clique em configurar
3. Ative o provider
4. Cole o **Client ID** do Google
5. Cole o **Client Secret** do Google
6. Salve as configurações

## 📧 Passo 3: Configurar Email

### 3.1 Templates de Email
1. Vá para **Authentication > Email Templates**
2. Configure os templates:

**Confirm signup**:
```html
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

**Reset password**:
```html
<h2>Redefinir senha</h2>
<p>Clique no link abaixo para redefinir sua senha:</p>
<p><a href="{{ .ConfirmationURL }}">Redefinir Senha</a></p>
```

### 3.2 URLs de Redirecionamento
1. Vá para **Authentication > URL Configuration**
2. Configure:
   - **Site URL**: `https://seu-dominio.com`
   - **Redirect URLs**: 
     - `https://seu-dominio.com/dashboard.html`
     - `https://seu-dominio.com/auth.html`
     - `http://localhost:3000/dashboard.html` (desenvolvimento)

## 🔧 Passo 4: Configurar Aplicação

### 4.1 Atualizar Credenciais
1. Abra o arquivo `supabase.js`
2. Substitua as credenciais:
```javascript
const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseAnonKey = 'sua-anon-key-aqui';
```

### 4.2 Testar Configuração
1. Abra `auth.html` no navegador
2. Teste:
   - ✅ Registro com email/senha
   - ✅ Login com email/senha
   - ✅ Login com Google
   - ✅ Verificação de email
   - ✅ Redirecionamento para dashboard

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação Completa
- **Registro** com email e senha
- **Login** com email e senha
- **OAuth** com Google e GitHub
- **Verificação de email** obrigatória
- **Reset de senha** por email
- **Logout** seguro

### ✅ Segurança
- **Row Level Security (RLS)** habilitado
- **Políticas de acesso** configuradas
- **Validação** de formulários
- **Sanitização** de dados
- **Tokens JWT** seguros

### ✅ UX/UI
- **Traduções** em 4 idiomas
- **Loading states** durante operações
- **Mensagens de erro** amigáveis
- **Feedback visual** para usuário
- **Responsivo** para mobile

### ✅ Funcionalidades Avançadas
- **Perfis de usuário** automáticos
- **Roles** e permissões
- **Trial de 14 dias** automático
- **Notificações** do sistema
- **Analytics** de usuário

## 🔍 Troubleshooting

### Erro: "Invalid login credentials"
- Verifique se o email está verificado
- Confirme se a senha está correta
- Verifique se o usuário existe

### Erro: "Email not confirmed"
- Usuário precisa verificar email primeiro
- Reenvie o email de verificação
- Verifique spam/lixo eletrônico

### OAuth não funciona
- Verifique URLs de redirecionamento
- Confirme Client ID/Secret
- Verifique domínios autorizados

### Banco de dados
- Execute `schema_new.sql` completamente
- Verifique se RLS está habilitado
- Confirme se triggers foram criados

## 📞 Suporte

Se precisar de ajuda:
1. Verifique logs no Supabase Dashboard
2. Teste em modo incógnito
3. Verifique console do navegador
4. Confirme todas as configurações acima

## 🎉 Próximos Passos

Após configurar a autenticação:
1. Teste todas as funcionalidades
2. Configure domínio personalizado
3. Implemente analytics avançados
4. Configure backup automático
5. Monitore performance

**Parabéns! Seu sistema de autenticação está completo! 🚀**
