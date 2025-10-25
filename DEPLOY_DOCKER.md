# Docker Compose Deployment Guide

Deploy the entire Career Transition Platform (app + database) using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your server
- At least 2GB RAM available
- Port 8080 available

## Quick Deploy

### 1. Clone the Repository

```bash
git clone https://github.com/rangerchaz/career-transition-program.git
cd career-transition-program
```

### 2. Create Environment File

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and set your values:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=career_transition

# Application Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
JWT_SECRET=your-jwt-secret-here
NODE_ENV=production
PORT=8080
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

This will:
- ✅ Build the application Docker image
- ✅ Pull PostgreSQL 15 image
- ✅ Create a persistent volume for the database
- ✅ Start both services
- ✅ Run database migrations automatically

### 4. Check Status

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check running containers
docker-compose -f docker-compose.prod.yml ps

# Check health
curl http://localhost:8080/health
```

### 5. Access Application

Open your browser to:
```
http://your-server-ip:8080
```

Or set up a reverse proxy (nginx/caddy) for HTTPS.

## Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Just app
docker-compose -f docker-compose.prod.yml logs -f app

# Just database
docker-compose -f docker-compose.prod.yml logs -f db
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart just app
docker-compose -f docker-compose.prod.yml restart app
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Stop and Remove Data
```bash
# WARNING: This deletes all database data!
docker-compose -f docker-compose.prod.yml down -v
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Operations

#### Access Database
```bash
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d career_transition
```

#### Backup Database
```bash
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres career_transition > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Restore Database
```bash
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d career_transition
```

#### Run Migrations Manually
```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

#### Seed Database
```bash
docker-compose -f docker-compose.prod.yml exec app npm run seed
```

## Nginx Reverse Proxy (Optional)

For HTTPS and custom domain:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then get SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check database connection
docker-compose -f docker-compose.prod.yml exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Database Connection Issues
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps db

# Test connection
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "SELECT 1"
```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose -f docker-compose.prod.yml down -v

# Remove built images
docker rmi career-transition-program-app

# Start fresh
docker-compose -f docker-compose.prod.yml up -d
```

## Production Recommendations

1. **Use stronger passwords** - Change default PostgreSQL password
2. **Set up backups** - Automate database backups
3. **Enable monitoring** - Use Prometheus/Grafana or similar
4. **Configure firewall** - Only expose necessary ports
5. **Use HTTPS** - Set up SSL/TLS with nginx/Caddy
6. **Resource limits** - Add resource limits to docker-compose.yml
7. **Log rotation** - Configure Docker log rotation

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_USER` | Yes | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `POSTGRES_DB` | Yes | PostgreSQL database name |
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `JWT_SECRET` | Yes | Secret for JWT tokens (32+ chars) |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Yes | Application port (default: 8080) |

## Security Notes

- **Never commit `.env.production`** to git (it's in `.gitignore`)
- Use strong passwords for PostgreSQL
- Keep your `JWT_SECRET` secure and random
- Regularly update Docker images for security patches
- Consider using Docker secrets for sensitive data in production

## Support

For issues or questions:
- Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
- Review this guide
- Check GitHub issues

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀
