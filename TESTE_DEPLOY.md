# 🚀 Teste do Deploy - Rarity Leads

## 📋 **CHECKLIST DE CONFIGURAÇÃO:**

### ✅ **1. Google Cloud Console**
- [ ] Projeto criado/selecionado
- [ ] OAuth 2.0 Client ID criado
- [ ] **Authorized JavaScript origins**: `https://rarityleads.netlify.app`
- [ ] **Authorized redirect URIs**: `https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback`
- [ ] Client ID e Client Secret copiados

### ✅ **2. Supabase Configuration**
- [ ] **Authentication > Providers > Google**: Ativado
- [ ] Client ID e Client Secret colados
- [ ] **Authentication > URL Configuration**:
  - [ ] **Site URL**: `https://rarityleads.netlify.app`
  - [ ] **Redirect URLs**: 
    - [ ] `https://rarityleads.netlify.app/dashboard.html`
    - [ ] `https://rarityleads.netlify.app/auth.html`
- [ ] Schema SQL executado (`schema_new.sql`)

### ✅ **3. Netlify Deploy**
- [ ] Site publicado: `https://rarityleads.netlify.app`
- [ ] Arquivos atualizados com URLs corretas

## 🧪 **FLUXO DE TESTE:**

### **Passo 1: Homepage**
1. Acesse: `https://rarityleads.netlify.app`
2. Clique em qualquer botão **"Get Started"**
3. Deve redirecionar para: `https://rarityleads.netlify.app/auth.html`

### **Passo 2: Autenticação**
1. Na página auth, clique **"Continue with Google"**
2. **Console do navegador** deve mostrar: "🔗 Starting Google OAuth..."
3. Deve abrir **popup do Google** para login
4. Faça login com sua conta Google
5. Após login, deve redirecionar para: `https://rarityleads.netlify.app/dashboard.html`

### **Passo 3: Verificação**
1. Verifique seu **email** (pode demorar alguns minutos)
2. Deve receber email de **confirmação do Supabase**
3. Clique no link de confirmação
4. Conta estará verificada

## 🆘 **PROBLEMAS COMUNS:**

### **"OAuth error" ou "Invalid client"**
→ Verifique URLs no Google Cloud Console

### **"Redirect URI mismatch"**
→ Confirme redirect URI: `https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback`

### **Popup não abre**
→ Verifique se popup não foi bloqueado pelo navegador

### **"Invalid redirect URL"**
→ Verifique URLs no Supabase Authentication > URL Configuration

### **Não recebe email**
→ Verifique spam/lixo eletrônico

## 📞 **DEBUG:**

### **Console do Navegador (F12):**
- Deve mostrar: "🚀 Auth page loaded with Supabase SDK"
- Ao clicar Google: "🔗 Google button clicked"
- Se sucesso: "✅ Google OAuth initiated successfully"
- Se erro: Mensagem específica do erro

### **Supabase Dashboard:**
- Vá em **Authentication > Users**
- Após login, deve aparecer novo usuário
- Status deve ser "Confirmed" após verificar email

## ✅ **RESULTADO ESPERADO:**

1. ✅ **Homepage** → Botão "Get Started" funciona
2. ✅ **Auth page** → Botão Google abre popup
3. ✅ **Google login** → Usuário faz login
4. ✅ **Redirecionamento** → Vai para dashboard
5. ✅ **Email enviado** → Confirmação automática
6. ✅ **Usuário criado** → Aparece no Supabase

**Tempo total do fluxo: ~30 segundos** ⏱️

## 🔧 **SE NÃO FUNCIONAR:**

1. **Abra console do navegador** (F12)
2. **Teste o fluxo** e veja erros
3. **Me envie** a mensagem de erro específica
4. **Verifique** se todas as configurações acima estão corretas

**Teste agora e me diga o resultado!** 🚀
