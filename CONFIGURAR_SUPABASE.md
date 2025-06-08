# 🚀 Configuração Rápida - Google OAuth

## ⚡ APENAS 4 PASSOS:

### 1️⃣ **Criar Projeto Supabase** (5 minutos)
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Nome: `rarity-leads`
4. Senha do banco: (escolha uma forte)
5. Região: (mais próxima de você)
6. Clique em "Create new project"

### 2️⃣ **Obter Credenciais** (2 minutos)
1. No projeto criado, vá em **Settings > API**
2. Copie:
   - **Project URL**: `https://abcdefg.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 3️⃣ **Configurar Database** (3 minutos)
1. Vá em **SQL Editor**
2. Copie TODO o conteúdo do arquivo `schema_new.sql`
3. Cole no editor
4. Clique em "Run"
5. Aguarde executar (pode demorar 1-2 minutos)

### 4️⃣ **Configurar Google OAuth** (10 minutos)

#### Google Cloud Console:
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie projeto ou selecione existente
3. **APIs & Services > Credentials**
4. **Create Credentials > OAuth 2.0 Client IDs**
5. **Application type**: Web application
6. **Authorized redirect URIs**: `https://SEU-PROJETO-ID.supabase.co/auth/v1/callback`
7. Copie **Client ID** e **Client Secret**

#### No Supabase:
1. **Authentication > Providers**
2. Ative **Google**
3. Cole **Client ID** e **Client Secret**
4. Salve

### 5️⃣ **Atualizar Código** (2 minutos)
1. Abra o arquivo `supabase.js`
2. Substitua:
```javascript
const supabaseUrl = 'https://SEU-PROJETO-ID.supabase.co';
const supabaseAnonKey = 'SUA-ANON-KEY-AQUI';
```

### 6️⃣ **Configurar URLs** (2 minutos)
No Supabase, vá em **Authentication > URL Configuration**:
- **Site URL**: `http://localhost:3000` (ou seu domínio)
- **Redirect URLs**: 
  - `http://localhost:3000/dashboard.html`
  - `http://localhost:3000/auth.html`

## ✅ **Testar**
1. Abra `auth.html`
2. Clique em "Continue with Google"
3. Faça login com Google
4. Deve redirecionar para dashboard
5. Verifique email de confirmação

## 🆘 **Problemas Comuns**

**"Invalid login credentials"**
→ Execute o schema SQL primeiro

**"OAuth error"**
→ Verifique URLs de redirecionamento

**"Email not confirmed"**
→ Verifique caixa de entrada/spam

## 📞 **Precisa de Ajuda?**
1. Verifique console do navegador (F12)
2. Verifique logs no Supabase Dashboard
3. Confirme se executou TODOS os passos acima

**Tempo total: ~25 minutos** ⏱️
