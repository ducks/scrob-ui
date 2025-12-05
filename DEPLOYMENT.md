# Deployment Guide - Scrob UI

## Quick Start with Docker (Recommended)

The easiest way to deploy the scrob UI is with Docker.

### Prerequisites

- Docker installed
- Scrob server running (see [scrob server deployment](../scrob/DEPLOYMENT.md))

### Setup

**1. Configure API URL**

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:3000
```

For production, use your actual server URL:
```bash
VITE_API_URL=https://scrob.yourdomain.com
```

**2. Build and run**

```bash
# Build the image
docker build -t scrob-ui .

# Run the container
docker run -d \
  -p 8080:80 \
  --name scrob-ui \
  scrob-ui
```

Or with Docker Compose:

```bash
docker-compose up -d
```

**3. Access the UI**

Visit `http://localhost:8080` and login with your credentials.

---

## Combined Deployment (Full Stack)

To run both the server and UI together, create a combined `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: scrob
      POSTGRES_USER: scrob
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  scrob-server:
    build: ../scrob
    environment:
      DATABASE_URL: postgres://scrob:your_secure_password@postgres:5432/scrob
      HOST: 0.0.0.0
      PORT: 3000
      RUST_LOG: scrob=info
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  scrob-ui:
    build: .
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "8080:80"
    depends_on:
      - scrob-server
    restart: unless-stopped

volumes:
  postgres_data:
```

Then:
```bash
docker-compose up -d
```

Access:
- UI: `http://localhost:8080`
- API: `http://localhost:3000`

---

## Production Deployment

For production, you'll want to:

1. **Use a reverse proxy** (nginx, Caddy, Traefik)
2. **Set up HTTPS** with Let's Encrypt
3. **Use environment-specific API URLs**

### Example with Caddy

`Caddyfile`:
```
scrob.yourdomain.com {
    reverse_proxy scrob-ui:80
}

api.scrob.yourdomain.com {
    reverse_proxy scrob-server:3000
}
```

Update `.env`:
```bash
VITE_API_URL=https://api.scrob.yourdomain.com
```

Rebuild and deploy:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Static File Deployment

If you prefer to deploy as static files (without Docker):

### Build

```bash
# Install dependencies
nix-shell --run "npm install"

# Set API URL
export VITE_API_URL=https://api.scrob.yourdomain.com

# Build
nix-shell --run "npm run build"
```

Built files will be in `dist/`.

### Deploy to Static Hosting

**Netlify/Vercel:**
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL`

**nginx:**
```bash
# Copy files
sudo cp -r dist/* /var/www/scrob-ui/

# nginx config
sudo tee /etc/nginx/sites-available/scrob-ui > /dev/null <<'EOF'
server {
    listen 80;
    server_name scrob.yourdomain.com;
    root /var/www/scrob-ui;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/scrob-ui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Apache:**
```bash
# Copy files
sudo cp -r dist/* /var/www/html/scrob-ui/

# Create .htaccess for SPA routing
cat > /var/www/html/scrob-ui/.htaccess <<'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF
```

---

## Environment Variables

The UI uses Vite's environment variable system:

- `VITE_API_URL` - Scrob server API URL (required)

These are baked into the build, so you must rebuild after changing them.

For development:
```bash
# Create .env.local
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Start dev server
nix-shell --run "npm run dev"
```

---

## Troubleshooting

### Can't connect to API

**Issue**: UI loads but login fails with network error.

**Solution**:
- Check `VITE_API_URL` is correct
- Ensure scrob server is running
- Check CORS settings on server
- Verify firewall/network rules

### Blank page after deployment

**Issue**: UI shows blank white page.

**Solution**:
- Check browser console for errors
- Verify base URL in `vite.config.js`
- Ensure all static assets are accessible
- Check nginx/apache configuration for SPA routing

### API URL not updating

**Issue**: Changed `VITE_API_URL` but still connecting to old URL.

**Solution**:
- Rebuild the app: `npm run build`
- Clear Docker cache: `docker-compose build --no-cache`
- Environment variables are baked into the build

---

## Health Checks

To verify the deployment:

```bash
# Check container is running
docker ps | grep scrob-ui

# Check logs
docker logs scrob-ui

# Check nginx is serving files
curl -I http://localhost:8080

# Check UI loads
curl http://localhost:8080 | grep -i scrob
```

---

## Updating

To update the UI:

```bash
# Pull latest code
git pull

# Rebuild and redeploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Uninstalling

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi scrob-ui

# Remove volumes (if using combined stack)
docker volume rm scrob-ui_postgres_data
```
