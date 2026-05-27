# Compañera

A tiny radio interface running on a Raspberry Pi Zero with an OLED screen, written in TypeScript.

## Hardware

- Raspberry Pi Zero (any model, W recommended for WiFi)
- OLED display 128x64, I2C, SSD1306 or SSD1315 (0.96")
- 4 jumper wires
- microSD card (8GB+)
- A computer (Mac/Linux/Windows) to edit code

## 1. Flash the Raspberry Pi

1. Download **Raspberry Pi Imager**: <https://www.raspberrypi.com/software/>
2. Insert the microSD card, open Imager, pick **Raspberry Pi OS Lite (64-bit)**.
3. Click the gear icon (advanced options) and set:
   - Hostname: `companera`
   - Username + password (remember them)
   - WiFi credentials
   - Enable SSH
4. Write, eject, insert into the Pi, power it on. Wait ~5 minutes for first boot.

## 2. Wire the OLED

The Pi's GPIO pins aren't labeled — count from the corner closest to the SD card slot. Pin 1 has a square pad.

You can run the following command to get the GPIO pins:

```bash
pinout
```

| OLED pin | Pi pin       |
| -------- | ------------ |
| VCC      | Pin 1 (3.3V) |
| GND      | Pin 9 (GND)  |
| SDA      | Pin 3        |
| SCL      | Pin 5        |

## 3. Connect to the Pi

From your computer's terminal:

```bash
ssh <username>@companera.local
```

Type `yes` at the fingerprint prompt, then your password.

(Optional but recommended — skip the password forever:)

```bash
# Run this once on your computer
ssh-copy-id <username>@companera.local
```

## 4. Set up the Pi

Once connected via SSH, run:

```bash
# Locales (fixes warnings)
sudo apt install -y locales-all

# I2C tools + enable I2C
sudo apt install -y i2c-tools build-essential python3
sudo raspi-config nonint do_i2c 0

# Add yourself to the i2c group (for write permissions)
sudo usermod -aG i2c $USER

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm
```

Verify the OLED is detected:

```bash
i2cdetect -y 1
```

You should see `3c` (or `3d`) in the grid. If not, recheck the wiring.

**Disconnect and reconnect SSH now** so the i2c group permissions apply:

```bash
exit
ssh <username>@companera.local
```

## 5. Get the code on the Pi

```bash
git clone https://github.com/valentinjadot/companera.git
cd companera
pnpm install
pnpm approve-builds   # select i2c-bus, confirm with y
```

The `approve-builds` step compiles the native I2C binding for the Pi (takes ~1 min on a Zero).

## 6. Run it

```bash
pnpm tsx src/index.ts
```

You should see `Hola companera` on the OLED 🎉

## Development workflow

Editing code directly on the Pi Zero is painful (it's too slow for VSCode Remote-SSH). The easiest setup:

1. Clone the repo on your computer too, edit there with your favorite editor.
2. Install [mutagen](https://mutagen.io) on your computer to sync files automatically:

   ```bash
   brew install mutagen-io/mutagen/mutagen

   mutagen sync create --name=companera --ignore-vcs \
     --ignore="node_modules" --ignore=".git" \
     "$(pwd)" <username>@companera.local:/home/<username>/companera
   ```

3. Keep an SSH terminal open on the Pi to run `pnpm tsx src/index.ts`.

**Important**: never sync `node_modules`. Run `pnpm install` separately on each machine — native modules (like `i2c-bus`) must be compiled on the target hardware.

## Troubleshooting

- **`i2cdetect` shows no device**: bad wiring. Check VCC and GND aren't swapped.
- **`Could not locate the bindings file`**: run `pnpm approve-builds` then `pnpm rebuild i2c-bus`.
- **`EIO: i/o error`**: you forgot to log out and back in after `usermod -aG i2c`. Or the SDA/SCL cables are loose.
- **The Pi is unreachable on `.local`**: find its IP via your router admin page and use that instead.

## License

MIT
