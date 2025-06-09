# 1. Configurar o Git para lidar com line endings automaticamente
git config --global core.autocrlf true

# 2. Desativar os avisos de CRLF
git config advice.addEmptyPathspec false

# 3. Adicionar todos os arquivos ao staging
git add .

# 4. Criar um commit com uma mensagem descritiva
git commit -m "Atualização completa do projeto Rarity Leads"

# 5. Enviar as alterações para o GitHub
git push origin main