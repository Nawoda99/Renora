
  # Renora

  This is the code bundle for Renora.

  ## Running the code

  **Node.js requirement:** Node 20+ (see `.nvmrc`).

  If you use `nvm`:

  - `nvm install`
  - `nvm use`

  Run `npm i` to install the dependencies.

  ### Development

  - `npm run dev` starts the CMS backend + frontend together.
  - `npm run dev:web` starts the frontend only.
  - `npm run dev:cms` starts the CMS backend only.
  - `npm run dev:full` is kept as an alias for `npm run dev`.

  Create a `.env` (see `.env.example`) and set at least:

  - `ADMIN_KEY` (required to save in `/admin`)
  - `SITE_URL` (used for sitemap generation)
  - `UPLOADS_DIR` (optional; where uploaded media files are stored)

  Upload storage:

  - local default: `server/uploads`
  - Render with a persistent disk: set `UPLOADS_DIR` to your mounted disk path, for example `/var/data/renora-uploads`
  - if you leave uploads in `server/uploads` on Render, files can disappear on deploy/restart because that filesystem is not persistent

  Database configuration (MySQL required):

  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER` (or `DB_USERNAME`)
  - `DB_PASS` (or `DB_PASSWORD`)
  - `DB_NAME` (defaults to `renora`)

  `DB_HOST` depends on where MySQL runs:

  - Same machine (no Docker): `DB_HOST=127.0.0.1`
  - App in Docker, MySQL on the Docker host:
    - set `DB_HOST=host.docker.internal`
    - `docker-compose.yml` includes `extra_hosts: host.docker.internal:host-gateway` for Linux
  - App in Docker, MySQL in another container on the same Docker network: set `DB_HOST` to the MySQL service name (example: `mysql`)
  - Remote DB server: set `DB_HOST` to your DB server hostname/IP

  ### Production

  - `npm run build`
  - `npm start` (serves the API and the built `dist/`)

  #### Database initialization

  On first run, the server will:

  - create the required tables in the configured MySQL database
  - seed the default CMS content from `server/defaultContent.json` if missing

  If you are upgrading from the legacy SQLite storage, migrate once with:

  - `node scripts/migrate-sqlite-to-mysql.mjs`

  #### Backup

  In `/admin`, the **Backup** section downloads a ZIP containing:

  - `DB/content.json` (CMS content exported from MySQL)
  - `Uploads/` (all files from `server/uploads/`)

  The **Restore** button in the same section accepts that ZIP and will:

  - extract `DB/content.json` and `Uploads/`
  - write the content back to the configured MySQL database
  - replace all files in `server/uploads/` with the ZIP’s `Uploads/`

  #### Quote Email

  The **Request Quote** form on the homepage validates inputs (Yup) and sends a request to `POST /api/quote`.

  To enable emails, configure SMTP in `.env` (see `.env.example`):

  - `SMTP_USER`
  - `SMTP_PASS` (for Gmail, this should be an App Password)
  - `QUOTE_TO` (the inbox that receives quote requests)

  Optional:

  - `SMTP_HOST` (defaults to `smtp.gmail.com`)
  - `SMTP_PORT` (defaults to `465`)
  - `SMTP_SECURE` (defaults to `true`)
  - `SMTP_FROM` (defaults to `SMTP_USER`)
  - `EMAIL_LOGO_URL` (defaults to `${SITE_URL}/renoralogo.svg`)
  - `EMAIL_LOGO_PATH` (embeds an inline logo via CID; recommended PNG)

  **Logo (recommended):** generate a PNG from the existing SVG:

  - `npm run generate:logo-png`

  Then either:

  - place it at `public/renoralogo.png` (the server will auto-embed it), or
  - set `EMAIL_LOGO_PATH=public/renoralogo.png`

  ## Docker (recommended for deployment)

  This project can run as a single container that serves:
  - the CMS API (`/api/*`)
  - uploaded media (`/media/*`)
  - the built frontend (`dist/`)

  **Important:** uploads are stored on disk in `server/uploads/`.

  On Render or similar platforms, attach a persistent disk and set `UPLOADS_DIR`
  to that mount path so uploaded images survive redeploys.

  Edited site content is stored in your MySQL database.

  ### Run with Docker Compose

  1) Create a `.env` file next to `docker-compose.yml`:

  - `ADMIN_KEY=your-strong-passcode`
  - `SITE_URL=https://your-domain.com`

  Also set (example values):

  - `DB_HOST=127.0.0.1`
  - `DB_PORT=3306`
  - `DB_USER=root`
  - `DB_PASS=1234`
  - `DB_NAME=renora`

  Note:
  - If MySQL is running on the Docker host machine, `DB_HOST=127.0.0.1` will point to the container itself.
    Use `DB_HOST=host.docker.internal`.
  - If MySQL is remote, set `DB_HOST` to that server’s hostname/IP and open the firewall for port `3306` (or your custom port).

  2) Build and start:

  - `docker compose up -d --build` (Compose v2)
  - or `docker-compose up -d --build` (Compose v1)

  3) Open:

  - Site: `http://localhost:5174/`
  - Admin: `http://localhost:5174/admin`

  ## DigitalOcean Ubuntu Deployment Without a Domain

  These commands assume Ubuntu 22.04/24.04 on a DigitalOcean droplet and the app
  running directly on the server at `http://YOUR_DROPLET_IP:5174`.

  1) Install Node.js, MySQL Server, and build tools:

  ```bash
  sudo apt update
  sudo apt install -y curl ca-certificates build-essential mysql-server
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  node -v
  npm -v
  ```

  2) Create the MySQL database and user:

  ```bash
  sudo mysql
  ```

  ```sql
  CREATE DATABASE renora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER 'renora_user'@'localhost' IDENTIFIED BY 'replace_with_a_strong_password';
  GRANT ALL PRIVILEGES ON renora.* TO 'renora_user'@'localhost';
  FLUSH PRIVILEGES;
  EXIT;
  ```

  3) Configure `.env`:

  ```env
  ADMIN_KEY=replace_with_a_strong_admin_key
  PORT=5174
  SITE_URL=http://YOUR_DROPLET_IP:5174
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_USER=renora_user
  DB_PASS=replace_with_a_strong_password
  DB_NAME=renora
  ```

  4) Install app packages, build, and start:

  ```bash
  npm install
  npm run build
  npm start
  ```

  5) Keep the app running with systemd:

  ```bash
  sudo tee /etc/systemd/system/renora.service >/dev/null <<'EOF'
  [Unit]
  Description=Renora website and CMS
  After=network.target mysql.service

  [Service]
  Type=simple
  WorkingDirectory=/home/nawoda/Renora
  ExecStart=/usr/bin/npm start
  Restart=always
  RestartSec=5
  Environment=NODE_ENV=production

  [Install]
  WantedBy=multi-user.target
  EOF

  sudo systemctl daemon-reload
  sudo systemctl enable --now renora
  sudo systemctl status renora
  ```

  6) Open the firewall for hosting without a domain:

  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 5174/tcp
  sudo ufw --force enable
  ```

  Then open:

  - Site: `http://YOUR_DROPLET_IP:5174/`
  - Admin: `http://YOUR_DROPLET_IP:5174/admin`

  MySQL Workbench is a desktop GUI. On a headless DigitalOcean server, use the
  MySQL CLI or a VS Code database extension. If your Ubuntu machine has a GUI,
  install Oracle's MySQL APT repository, then install Workbench with:

  ```bash
  sudo apt update
  sudo apt install -y mysql-workbench-community
  ```

  ### Moving your existing content to a server

  Copy this folder to the server (same path), then run `docker compose up -d --build`:

  - `server/uploads/`
  
