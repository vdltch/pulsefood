#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -f .env ]]; then echo "Le fichier .env existe déjà. Initialisation annulée."; exit 1; fi
read -r -p "Email administrateur [admin@pulsefood.fr] : " admin_email
admin_email=${admin_email:-admin@pulsefood.fr}
read -r -s -p "Choisis un mot de passe admin (14 caractères minimum) : " admin_password; echo
read -r -s -p "Confirme le mot de passe : " admin_confirmation; echo
[[ "$admin_password" == "$admin_confirmation" ]] || { echo "Les mots de passe ne correspondent pas."; exit 1; }
(( ${#admin_password} >= 14 )) || { echo "Le mot de passe doit contenir au moins 14 caractères."; exit 1; }
[[ "$admin_password" =~ ^[A-Za-z0-9_.!@%-]+$ ]] || { echo "Utilise uniquement lettres, chiffres et les caractères _ . ! @ % -."; exit 1; }
postgres_password=$(openssl rand -hex 32)
auth_secret=$(openssl rand -base64 48 | tr -d '\n')
studio_path="/studio-$(openssl rand -hex 12)"
umask 077
cat > .env <<EOF
POSTGRES_PASSWORD='$postgres_password'
DATABASE_URL='postgresql://pulse:$postgres_password@db:5432/pulsefood?schema=public'
AUTH_SECRET='$auth_secret'
ADMIN_EMAIL='$admin_email'
ADMIN_PASSWORD='$admin_password'
STUDIO_PATH='$studio_path'
UPLOAD_DIR='/app/public/uploads'
EOF
echo
echo "Configuration créée avec permissions privées."
echo "URL privée du studio : https://pulsefood.fr$studio_path"
echo "Conserve cette URL dans ton gestionnaire de mots de passe."
