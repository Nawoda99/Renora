# Ubuntu deployment

This app should not be kept alive by a VS Code terminal. Use one of these:

- `systemd` for a direct Node.js deployment
- Docker Compose for a container deployment

## Option 1: systemd + nginx

1. Copy the project to `/var/www/renora`
2. Install dependencies and build:

```bash
cd /var/www/renora
npm install
npm run build
```

3. Update `.env`:

```env
PORT=5174
SITE_URL=https://your-domain.com
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=renora_user
DB_PASS=replace_with_a_strong_mysql_password
DB_NAME=renora
```

4. Install the service:

```bash
sudo cp deploy/ubuntu/renora.service /etc/systemd/system/renora.service
sudo systemctl daemon-reload
sudo systemctl enable --now renora
sudo systemctl status renora
```

5. Install nginx config:

```bash
sudo cp deploy/ubuntu/renora.nginx.conf /etc/nginx/sites-available/renora
sudo ln -s /etc/nginx/sites-available/renora /etc/nginx/sites-enabled/renora
sudo nginx -t
sudo systemctl reload nginx
```

6. If using a domain, add HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Useful checks:

```bash
sudo journalctl -u renora -f
sudo systemctl restart renora
```

## Option 2: Docker Compose

This repository already includes `docker-compose.yml` with `restart: unless-stopped`.

```bash
docker compose up -d --build
docker compose ps
```

If you use nginx in front of Docker, keep nginx proxying to `127.0.0.1:5174`.
