# Compañera

A tiny internet radio running on a Raspberry Pi Zero, with an OLED screen and a rotary encoder, written in TypeScript.

Click the encoder to load a random radio station. The station name shows on the OLED. Audio comes out through an I2S DAC.

## Hardware

- Raspberry Pi Zero W (or Zero 2 W)
- microSD card (8GB+)
- OLED display 128x64, I2C, SSD1306 or SSD1315 (0.96")
- PCM5102A I2S DAC module
- Rotary encoder with push-button (5 pins: GND, +, SW, DT, CLK)
- Jumper wires (female-to-female, ~15)
- A computer (Mac/Linux/Windows) to write code on

## Prerequisites (on your computer)

Install in this order:

- [Homebrew](https://brew.sh) (macOS package manager)
  - `brew install git ffmpeg`
  - `brew install nodenv` → then `nodenv init` (follow instructions), `nodenv install 20`, `nodenv global 20`
    - `npm install -g pnpm`

On Linux/Windows, install Git, Node 20 LTS, and pnpm via their official sites instead.

## 1. Flash the Raspberry Pi

1. Download **Raspberry Pi Imager**: <https://www.raspberrypi.com/software/>
2. Insert the microSD card, open Imager, pick **Raspberry Pi OS Lite (64-bit)**.
3. Click the gear icon (advanced options) and set:
   - Hostname: `companera`
   - Username + password (remember them — you'll need them constantly)
   - WiFi credentials
   - Enable SSH
4. Write, eject, insert into the Pi, power it on. Wait ~5 minutes for first boot.

## 2. Wire everything

The Pi's GPIO pins aren't labeled. Count from the corner closest to the SD card slot — Pin 1 has a square pad. Pins are zig-zag: odds on one side, evens on the other.

You can also SSH into the Pi (next step) and run `pinout` for a colored diagram.

### OLED (I2C)

| OLED pin | Pi pin       |
| -------- | ------------ |
| VCC      | Pin 1 (3.3V) |
| GND      | Pin 9 (GND)  |
| SDA      | Pin 3        |
| SCL      | Pin 5        |

### PCM5102A DAC (I2S)

| DAC pin | Pi pin           |
| ------- | ---------------- |
| VIN     | Pin 2 (5V)       |
| GND     | Pin 6 (GND)      |
| BCK     | Pin 12 (GPIO 18) |
| LRCK    | Pin 35 (GPIO 19) |
| DIN     | Pin 40 (GPIO 21) |

Some PCM5102A boards have jumpers (SCK/FMT/XSMT/DEMP). Defaults are usually fine — check your board's datasheet if no sound. SCK typically needs to be tied to GND.

### Rotary encoder

| Encoder pin | Pi pin           |
| ----------- | ---------------- |
| GND         | Pin 14 (GND)     |
| +           | Pin 17 (3.3V)    |
| SW (click)  | Pin 16 (GPIO 23) |
| DT          | Pin 18 (GPIO 24) |
| CLK         | Pin 22 (GPIO 25) |

## 3. Connect to the Pi

From your computer's terminal:

```bash
ssh <username>@companera.local
```

Type `yes` at the fingerprint prompt, then your password.

(Optional but **highly** recommended — skip the password forever:)

```bash
# Run this once on your computer
ssh-copy-id <username>@companera.local
```

## 4. Set up the Pi

Once connected via SSH, run these commands one block at a time.

### 4.1 — Base packages

```bash
# Fix locale warnings
sudo apt install -y locales-all

# I2C tools, GPIO (libgpiod dev headers for rpi-io), build toolchain, audio player
sudo apt install -y i2c-tools libgpiod-dev build-essential python3 ffmpeg alsa-utils
```

### 4.2 — Enable I2C (for the OLED) and I2S (for the DAC)

```bash
sudo raspi-config nonint do_i2c 0
```

Then edit the boot config to enable I2S and load the DAC driver:

```bash
sudo nano /boot/firmware/config.txt
```

Add these lines at the bottom (or uncomment if present):

```
dtparam=i2s=on
dtoverlay=hifiberry-dac
```

Save with `Ctrl+O`, `Enter`, then `Ctrl+X`.

### 4.3 — Add yourself to hardware groups

```bash
sudo usermod -aG i2c,gpio,audio $USER
```

### 4.4 — Install Node.js 20 and pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm
```

### 4.5 — Reboot

The kernel changes (I2S, audio overlay) and group memberships only apply after a reboot:

```bash
sudo reboot
```

Wait a minute, then reconnect: `ssh <username>@companera.local`.

### 4.6 — Verify hardware

```bash
# OLED detected on I2C?
i2cdetect -y 1
```

You should see `3c` (or `3d`) in the grid.

```bash
# DAC detected as a sound card?
aplay -l
```

You should see a card called `snd_rpi_hifiberry_dac`.

```bash
# Audio output test (you should hear "front left / front right")
speaker-test -c 2 -t wav
```

`Ctrl+C` to stop. If any of these fail, check the wiring before continuing.

## 5. Get the code on the Pi

```bash
git clone https://github.com/valentinjadot/companera.git
cd companera
pnpm run hardware:setup   # needs libgpiod-dev from step 4.1
```

`hardware:*` scripts compile native modules on the Pi (`i2c-bus`, `rpi-io`). `rpi-io` is in `ignoredBuiltDependencies` because pnpm cannot build it on macOS. Takes about 1 minute on a Zero.

## 6. Run it

```bash
pnpm start
```

You should see the welcome message on the OLED. Click the rotary encoder — a random station loads and starts playing through the DAC 🎉

`Ctrl+C` to stop.

## Development workflow

Editing code directly on the Pi Zero is painful (it's too slow for VSCode/Cursor Remote-SSH). Edit on your Mac, sync with Mutagen, run on the Pi.

### One-time setup (Mac)

1. Clone the repo on your computer.
2. Install [mutagen](https://mutagen.io):

   ```bash
   brew install mutagen-io/mutagen/mutagen
   ```

3. Create the sync session (only once):

   ```bash
   cd /path/to/companera

   mutagen sync create --name=companera --ignore-vcs \
     --ignore="node_modules" --ignore=".git" \
     "$(pwd)" <username>@companera.local:/home/<username>/companera
   ```

4. Install deps on your Mac (no `hardware:*` — mocks are used):

   ```bash
   pnpm install
   ```

   `ffmpeg` from Homebrew (Prerequisites) handles stream playback on macOS. GPIO/OLED use mocks — run `pnpm start` locally to test audio through your Mac speakers.

### Day-to-day

**Mac** — edit code in Cursor/VSCode. Files sync automatically.

After the Pi reboots or reconnects, resume the sync:

```bash
pnpm sync:resume
```

Check it's working (both sides should say `Connected: Yes`, status `Watching for changes`):

```bash
mutagen sync list
```

If sync looks stuck:

```bash
mutagen sync flush companera
```

**Pi** — SSH in and run the app:

```bash
ssh <username>@companera.local
cd ~/companera
pnpm start
```

### First install on the Pi (or after adding dependencies)

Native modules must be compiled on the Pi — never sync `node_modules`. They're pre-approved in `pnpm-workspace.yaml`, so no interactive `pnpm approve-builds` step:

```bash
pnpm run hardware:setup
```

Or, if you already ran `pnpm install`:

```bash
pnpm run hardware:rebuild
```

| Script             | What it does                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| `hardware:setup`   | `pnpm install` + native rebuilds (Pi only)                                    |
| `hardware:rebuild` | `pnpm rebuild` + compile `rpi-io`                                             |
| `hardware:rpi-io`  | Compile `rpi-io` only ([upstream docs](https://www.npmjs.com/package/rpi-io)) |

Takes about 1 minute on a Zero.

**Important**: run installs separately on each machine. Mutagen only syncs source files. On macOS, use `pnpm install` — not `hardware:*`.

## Troubleshooting

- **`i2cdetect` shows no device**: bad OLED wiring. Check VCC and GND aren't swapped.
- **`aplay -l` doesn't list the DAC**: you forgot to add the `dtoverlay` lines, or you didn't reboot.
- **`Cannot find module '../build/Release/gpio.node'`** or **`Could not locate the bindings file`**: on the Pi, run `pnpm run hardware:rpi-io` after `libgpiod-dev` and `build-essential` are installed (step 4.1).
- **`EIO: i/o error` on the OLED**: log out and back in after `usermod -aG i2c` (or you skipped the reboot).
- **Audio works but is distorted**: check the PCM5102A jumpers — SCK usually needs to be tied to GND.
- **No sound / `[PLAYER] ffmpeg not found`**: install ffmpeg — `brew install ffmpeg` (Mac) or `sudo apt install ffmpeg` (Pi). Verify with `which ffmpeg`.
- **`gpiod.h: No such file or directory`** (rpi-io build): `sudo apt install libgpiod-dev`, then `pnpm run hardware:rpi-io` on the Pi.
- **`Permission denied` on GPIO**: you're not in the `gpio` group — run `sudo usermod -aG gpio $USER`, then log out/in or reboot.
- **The Pi is unreachable on `.local`**: find its IP via your router admin page and use that instead.
- **`pnpm install` is super slow / hangs**: normal on a Pi Zero, give it 5 minutes.

## License

MIT
