#!/usr/bin/env bash
set -euo pipefail
REPO='sdraiky99/NovaBrowser'
VERSION='2.2.0'
ARCH='x86_64'
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

RPM=""
if [[ ${1:-} == --file ]]; then
  [[ -n ${2:-} ]] || { echo 'Uso: ./install-fedora.sh --file Nova-<version>-x86_64.rpm'; exit 2; }
  RPM="$2"
  [[ -f "$RPM" ]] || { echo "No existe: $RPM"; exit 2; }
elif [[ ${1:-} == --url ]]; then
  [[ -n ${2:-} ]] || { echo 'Uso: ./install-fedora.sh --url URL_DEL_RPM'; exit 2; }
  command -v curl >/dev/null || { echo 'Necesitas curl.'; exit 1; }
  RPM="$TMP_DIR/nova.rpm"
  curl -fL --progress-bar "$2" -o "$RPM"
else
  command -v curl >/dev/null || { echo 'Necesitas curl: sudo dnf install curl'; exit 1; }
  URL="https://github.com/${REPO}/releases/download/v${VERSION}/Nova-${VERSION}-${ARCH}.rpm"
  RPM="$TMP_DIR/Nova-${VERSION}-${ARCH}.rpm"
  echo "Descargando Nova ${VERSION} para Fedora/x86_64…"
  curl -fL --progress-bar "$URL" -o "$RPM" || {
    echo 'No se encontró el RPM de la versión indicada.'
    echo 'También puedes descargarlo desde GitHub y usar: ./install-fedora.sh --file archivo.rpm'
    exit 1
  }
fi

if command -v pkexec >/dev/null && [[ $EUID -ne 0 ]]; then
  pkexec dnf install -y "$RPM"
elif [[ $EUID -ne 0 ]]; then
  sudo dnf install -y "$RPM"
else
  dnf install -y "$RPM"
fi

echo 'Nova se ha instalado/actualizado correctamente.'
