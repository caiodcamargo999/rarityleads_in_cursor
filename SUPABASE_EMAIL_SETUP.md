# 📧 Configuração de Email no Supabase - Rarity Leads

## Problema Identificado
Quando você faz registro com Google OAuth ou email, não está aparecendo a mensagem de verificação e não está recebendo emails de verificação.

## ✅ Soluções Necessárias

### 1. Configuração de Email no Supabase Dashboard

#### Passo 1: Acessar Configurações de Email
1. Acesse seu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto "Rarity Leads"
3. Vá para **Authentication** → **Settings**
4. Role até a seção **"Email"**

#### Passo 2: Configurar SMTP (Recomendado para Produção)
```
SMTP Host: smtp.gmail.com (ou seu provedor)
SMTP Port: 587
SMTP User: seu-email@gmail.com
SMTP Pass: sua-senha-de-app
```

**Para Gmail:**
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de App" específica
3. Use essa senha no campo SMTP Pass

#### Passo 3: Configurar Templates de Email
Na seção **"Email Templates"**:

**Confirm Signup Template:**
```html
<h2>Confirme seu email - Rarity Leads</h2>
<p>Olá!</p>
<p>Obrigado por se registrar no Rarity Leads. Para completar seu cadastro, clique no link abaixo:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
<p>Se você não se registrou no Rarity Leads, ignore este email.</p>
<p>Equipe Rarity Leads</p>
```

### 2. Configurações de Autenticação

#### Passo 1: Habilitar Confirmação de Email
1. Vá para **Authentication** → **Settings**
2. Na seção **"User Signups"**:
   - ✅ **Enable email confirmations** = ON
   - ✅ **Enable phone confirmations** = OFF (se não usar)

#### Passo 2: Configurar URLs de Redirecionamento
Na seção **"URL Configuration"**:
```
Site URL: https://rarityleads.netlify.app
Additional Redirect URLs:
- http://localhost:8080
- https://rarityleads.netlify.app/dashboard.html
- http://localhost:8080/dashboard.html
```

### 3. Configuração do Google OAuth

#### Passo 1: Configurar Provider Google
1. Vá para **Authentication** → **Providers**
2. Clique em **Google**
3. Configure:
   - ✅ **Enable sign in with Google** = ON
   - **Client ID**: Seu Google Client ID
   - **Client Secret**: Seu Google Client Secret

#### Passo 2: Configurar Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá para **APIs & Services** → **Credentials**
3. Adicione URLs autorizados:
   ```
   Authorized JavaScript origins:
   - http://localhost:8080
   - https://rarityleads.netlify.app
   
   Authorized redirect URIs:
   - https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback
   ```

### 4. Teste a Configuração

#### Opção 1: Usar a Página de Teste
1. Acesse: `http://localhost:8080/supabase-config-check.html`
2. Execute os checks automáticos
3. Teste o envio de email de verificação

#### Opção 2: Teste Manual
1. Registre-se com um email novo
2. Verifique se recebe o email
3. Clique no link de confirmação

### 5. Configurações Adicionais Recomendadas

#### Rate Limiting
```
Rate Limit: 30 requests per hour (padrão)
```

#### Security
```
JWT expiry: 3600 seconds (1 hora)
Refresh token rotation: Enabled
```

## 🔧 Código Atualizado

O código já foi atualizado para:
- ✅ Detectar automaticamente Google OAuth (não precisa verificação adicional)
- ✅ Mostrar mensagem de verificação para registro por email
- ✅ Permitir reenvio de email de verificação
- ✅ Melhor tratamento de erros

## 🚨 Problemas Comuns e Soluções

### Problema: "Email not confirmed"
**Solução:** Verificar se "Enable email confirmations" está ON

### Problema: "SMTP configuration error"
**Solução:** Configurar SMTP corretamente ou usar Supabase built-in email

### Problema: "Invalid redirect URL"
**Solução:** Adicionar todas as URLs necessárias na configuração

### Problema: Google OAuth não funciona
**Solução:** Verificar Client ID/Secret e URLs autorizadas

## 📝 Checklist Final

- [ ] SMTP configurado no Supabase
- [ ] Email confirmations habilitadas
- [ ] Templates de email configurados
- [ ] URLs de redirecionamento adicionadas
- [ ] Google OAuth configurado
- [ ] Teste de registro por email funcionando
- [ ] Teste de Google OAuth funcionando

## 🆘 Se Ainda Não Funcionar

1. Verifique os logs no Supabase Dashboard → **Logs**
2. Teste com a página `supabase-config-check.html`
3. Verifique se o email não está na pasta de spam
4. Tente com um provedor de email diferente (Gmail, Outlook, etc.)

---

**Próximos Passos:**
1. Configure o SMTP no Supabase Dashboard
2. Teste o registro por email
3. Teste o Google OAuth
4. Deploy para produção com as URLs corretas
