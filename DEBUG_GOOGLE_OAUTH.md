# 🔍 Debug Google OAuth - Passo a Passo

## 🚨 **PROBLEMA ATUAL:**
Clica "Sign up with Google" → Vai direto para dashboard (sem passar pelo Google)

## 🔧 **POSSÍVEIS CAUSAS:**

### **1. Google OAuth NÃO configurado no Supabase**
- ❌ Provider Google não ativado
- ❌ Client ID/Secret não configurados
- ❌ URLs de redirecionamento incorretas

### **2. Configuração incorreta no Google Cloud**
- ❌ OAuth Client não criado
- ❌ URLs autorizadas incorretas
- ❌ Credenciais incorretas

## 🧪 **TESTE PASSO A PASSO:**

### **Passo 1: Verificar Console**
1. Acesse: `https://rarityleads.netlify.app/auth.html`
2. Abra **Console do navegador** (F12)
3. Clique **"Continue with Google"**
4. **Veja as mensagens** no console:

**✅ ESPERADO:**
```
🚀 Auth page loaded with Supabase SDK
🔗 Google button clicked
🔍 Checking Google OAuth configuration...
🔗 Starting Google OAuth...
🔄 Redirecting to Google...
```

**❌ SE DER ERRO:**
```
❌ Google OAuth error: [mensagem específica]
```

### **Passo 2: Verificar Supabase**
1. Vá no **Supabase Dashboard**
2. **Authentication > Providers**
3. **Verifique Google:**
   - [ ] **Enabled**: ✅ Ativado
   - [ ] **Client ID**: Preenchido
   - [ ] **Client Secret**: Preenchido

### **Passo 3: Verificar Google Cloud**
1. [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services > Credentials**
3. **Verifique OAuth 2.0 Client:**
   - [ ] **Authorized JavaScript origins**: `https://rarityleads.netlify.app`
   - [ ] **Authorized redirect URIs**: `https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback`

## 🔧 **CONFIGURAÇÃO CORRETA:**

### **Google Cloud Console:**
```
Application type: Web application
Name: Rarity Leads

Authorized JavaScript origins:
- https://rarityleads.netlify.app

Authorized redirect URIs:
- https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback
```

### **Supabase Authentication > Providers > Google:**
```
Enabled: ✅
Client ID: [do Google Cloud]
Client Secret: [do Google Cloud]
```

### **Supabase Authentication > URL Configuration:**
```
Site URL: https://rarityleads.netlify.app

Redirect URLs:
- https://rarityleads.netlify.app/dashboard.html
- https://rarityleads.netlify.app/auth.html
```

## 🚀 **FLUXO CORRETO:**

1. **Usuário clica** "Continue with Google"
2. **Console mostra** logs de debug
3. **Supabase inicia** OAuth flow
4. **Página redireciona** para Google
5. **Usuário faz login** no Google
6. **Google redireciona** de volta para Supabase
7. **Supabase processa** autenticação
8. **Usuário é redirecionado** para dashboard
9. **Email de verificação** é enviado

## 🆘 **ERROS COMUNS:**

### **"Invalid client"**
→ Client ID incorreto ou não configurado

### **"Redirect URI mismatch"**
→ URL de redirecionamento incorreta no Google Cloud

### **"OAuth provider not configured"**
→ Google não ativado no Supabase

### **Vai direto para dashboard**
→ OAuth não está sendo chamado (configuração faltando)

## 📞 **PRÓXIMOS PASSOS:**

1. **Teste** e me envie os logs do console
2. **Verifique** se Google está ativado no Supabase
3. **Confirme** se OAuth Client está criado no Google Cloud
4. **Me diga** qual erro específico aparece

**Teste agora e me mostre o resultado!** 🔍
