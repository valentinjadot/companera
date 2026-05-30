#!/usr/bin/env bash
# Companera — Raspberry Pi setup script
# Idempotent: safe to re-run. Fail-loud on every step.

set -euo pipefail

# ─── helpers ──────────────────────────────────────────────────────────────────

log()  { printf "\033[1;34m→\033[0m %s\n" "$*"; }
ok()   { printf "\033[1;32m✓\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m!\033[0m %s\n" "$*"; }
die()  { printf "\033[1;31m✗\033[0m %s\n" "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing command: $1"
}

# ─── sanity checks ────────────────────────────────────────────────────────────

log "Sanity checks"

[[ "$EUID" -ne 0 ]] || die "Don't run this script with sudo. It uses sudo internally."

[[ "$(uname -s)" == "Linux" ]] || die "This must run on Linux (the Pi), not $(uname -s)."

if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  [[ "${ID:-}" == "debian" || "${ID:-}" == "raspbian" || "${ID_LIKE:-}" == *"debian"* ]] \
    || warn "Not a Debian/Raspbian system (ID=$ID). Continuing anyway."
else
  warn "/etc/os-release not found, can't verify OS."
fi

require_cmd sudo
require_cmd apt
require_cmd grep

ok "Sanity OK"

# ─── detect boot config path (varies by RPi OS version) ───────────────────────

if   [[ -f /boot/firmware/config.txt ]]; then BOOT_CONFIG=/boot/firmware/config.txt
elif [[ -f /boot/config.txt ]];          then BOOT_CONFIG=/boot/config.txt
else die "Cannot find config.txt in /boot or /boot/firmware. Is this really a Raspberry Pi?"
fi
log "Boot config: $BOOT_CONFIG"

# ─── 4.1 — base packages ──────────────────────────────────────────────────────

log "Installing base packages (this can take a few minutes)"
sudo apt update
sudo apt install -y \
  locales-all i2c-tools libgpiod-dev build-essential python3 \
  ffmpeg alsa-utils curl git
ok "Base packages installed"

# ─── 4.2 — enable I2C ────────────────────────────────────────────────────────

log "Enabling I2C"
if command -v raspi-config >/dev/null 2>&1; then
  sudo raspi-config nonint do_i2c 0 || warn "raspi-config returned non-zero (often harmless)"
else
  warn "raspi-config not found. Adding dtparam=i2c_arm=on manually."
  grep -qxF 'dtparam=i2c_arm=on' "$BOOT_CONFIG" \
    || echo 'dtparam=i2c_arm=on' | sudo tee -a "$BOOT_CONFIG" >/dev/null
fi
ok "I2C enabled"

# ─── 4.2 — enable I2S + hifiberry-dac overlay ─────────────────────────────────

log "Enabling I2S audio (PCM5102A via hifiberry-dac overlay)"
for line in 'dtparam=i2s=on' 'dtoverlay=hifiberry-dac'; do
  if grep -qxF "$line" "$BOOT_CONFIG"; then
    log "  already present: $line"
  else
    echo "$line" | sudo tee -a "$BOOT_CONFIG" >/dev/null
    log "  added: $line"
  fi
done
ok "Audio overlay configured"

# ─── 4.3 — user groups ────────────────────────────────────────────────────────

log "Adding $USER to hardware groups (i2c, gpio, audio)"
sudo usermod -aG i2c,gpio,audio "$USER"
ok "Group memberships updated (effective after logout/reboot)"

# ─── 4.4 — Node.js 20 + pnpm ──────────────────────────────────────────────────

if command -v node >/dev/null 2>&1; then
  NODE_VER="$(node -v)"
  log "Node already installed: $NODE_VER"
  if [[ ! "$NODE_VER" =~ ^v20\. && ! "$NODE_VER" =~ ^v2[1-9]\. ]]; then
    warn "Node version is $NODE_VER, project expects v20+. Continuing anyway."
  fi
else
  log "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
require_cmd node
require_cmd npm
ok "Node: $(node -v)"

if command -v pnpm >/dev/null 2>&1; then
  log "pnpm already installed: $(pnpm -v)"
else
  log "Installing pnpm"
  sudo npm install -g pnpm
fi
require_cmd pnpm
ok "pnpm: $(pnpm -v)"

# ─── ALSA default device ──────────────────────────────────────────────────────
# We use a card *name* (sndrpihifiberry), not a number, because card numbers
# change depending on whether HDMI audio is present. The name is set by the
# hifiberry-dac overlay and is stable.

log "Writing ~/.asoundrc (DAC as default device, with softvol)"
cat > "$HOME/.asoundrc" << 'EOF'
pcm.!default {
  type plug
  slave.pcm "softvol"
}
pcm.softvol {
  type softvol
  slave { pcm "hw:sndrpihifiberry,0" }
  control { name "Master"; card sndrpihifiberry }
}
ctl.!default {
  type hw
  card sndrpihifiberry
}
EOF
ok "~/.asoundrc written"

# ─── done ─────────────────────────────────────────────────────────────────────

echo
ok "Setup complete."
echo
echo "Next steps:"
echo "  1. sudo reboot"
echo "  2. After reboot, reconnect via SSH"
echo "  3. cd ~/companera"
echo "  4. pnpm run hardware:setup"
echo "  5. Verify hardware:"
echo "       i2cdetect -y 1          # expect 3c (or 3d)"
echo "       aplay -l                # expect snd_rpi_hifiberry_dac"
echo "       speaker-test -c 2 -t wav -l 1"
echo