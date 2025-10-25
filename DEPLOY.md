# Deployment Guide - DigitalOcean App Platform

Deploy your Career Transition AI Platform to DigitalOcean with a single Docker container.

## Architecture

**Single Container Setup:**
- Backend Express server serves both API and static Next.js frontend
- PostgreSQL managed database
- All running on DigitalOcean App Platform

## Prerequisites

1. **DigitalOcean Account** ([Sign up](https://www.digitalocean.com/))
2. **GitHub Repository** pushed with all code
3. **Anthropic API Key** ([Get one](https://console.anthropic.com/))

## Quick Deploy

### Option 1: One-Click Deploy

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/rangerchaz/career-transition-program/tree/main)

### Option 2: Manual Setup

#### Step 1: Create App on DigitalOcean

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Select **"GitHub"** as source
4. Authorize DigitalOcean to access your repository
5. Select repository: `rangerchaz/career-transition-program`
6. Branch: `main`

#### Step 2: Configure Build Settings

**Dockerfile Path:**
```
Dockerfile
```

**HTTP Port:**
```
8080
```

**Build Command** (leave empty - handled by Dockerfile)

**Run Command** (leave empty - handled by Dockerfile)

#### Step 3: Add Database

1. Click **"Add Resource" → "Database"**
2. Select **PostgreSQL**
3. Version: **15**
4. Size: **Basic** ($7/month) or **Dev** ($15/month)
5. Name: `db`

DigitalOcean will automatically create `DATABASE_URL` environment variable.

#### Step 4: Configure Environment Variables

Add these environment variables:

| Variable | Value | Type |
|----------|-------|------|
| `DATABASE_URL` | (auto-created by DO database) | Secret |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Secret |
| `JWT_SECRET` | Generate a random string | Secret |
| `NODE_ENV` | `production` | Plain |
| `PORT` | `8080` | Plain |

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 5: Configure Resources

**App Tier:**
- Start with: **Basic ($5/month)**
- 512 MB RAM | 1 vCPU

**Scaling:**
- Instances: 1 (can scale up later)

#### Step 6: Deploy!

1. Review settings
2. Click **"Create Resources"**
3. Wait 5-10 minutes for deployment

## Post-Deployment

### 1. Run Database Migrations

After first deployment:

```bash
# Connect to your app console
doctl apps create-deployment <app-id>

# Or use DO Console → App → Console tab
# Run:
npx prisma migrate deploy
npx prisma db seed  # Optional: add sample data
```

### 2. Access Your App

Your app will be available at:
```
https://your-app-name.ondigitalocean.app
```

### 3. Set Up Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your domain
3. Update DNS records (DigitalOcean will show instructions)

## Environment Variables Reference

### Required

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
ANTHROPIC_API_KEY=sk-ant-api03-...
JWT_SECRET=your-random-secret-string
NODE_ENV=production
PORT=8080
```

### Optional

```env
FRONTEND_URL=https://your-domain.com  # If using custom domain
```

## Monitoring

### Health Checks

The app includes health check at:
```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### Logs

View logs in DigitalOcean Console:
1. Go to your app
2. Click **"Runtime Logs"** tab
3. Filter by severity

### Metrics

Monitor in DO Console:
- CPU usage
- Memory usage
- HTTP requests
- Response times

## Scaling

### Horizontal Scaling

Increase instances:
1. Go to **Settings → Resources**
2. Adjust **Instance Count**
3. Save and redeploy

### Vertical Scaling

Upgrade instance size:
1. Go to **Settings → Resources**
2. Select larger instance:
   - Professional ($12/mo): 1 GB RAM
   - Professional ($24/mo): 2 GB RAM
3. Save and redeploy

## Costs Estimate

### Minimal Setup
- **App (Basic)**: $5/month
- **Database (Dev)**: $7/month
- **Total**: ~$12/month

### Production Setup
- **App (Professional 1GB)**: $12/month
- **Database (Basic)**: $15/month
- **Total**: ~$27/month

### Scale-Up Setup
- **App (Professional 2GB x2)**: $48/month
- **Database (Basic)**: $15/month
- **Total**: ~$63/month

## Troubleshooting

### Build Fails

**Check:**
1. Dockerfile syntax
2. Node version (should be 18+)
3. Build logs in DO Console

**Common fixes:**
```bash
# Rebuild
git commit --allow-empty -m "trigger rebuild"
git push
```

### App Won't Start

**Check:**
1. Environment variables set correctly
2. DATABASE_URL connected
3. Port is 8080
4. Runtime logs for errors

### Database Connection Error

**Verify:**
```bash
# In app console
echo $DATABASE_URL
# Should show: postgresql://...
```

**Fix:**
1. Ensure database is created
2. Check DATABASE_URL variable
3. Verify network connectivity

### Migrations Failed

**Run manually:**
```bash
# In app console or using doctl
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## Updates & Redeployment

### Automatic Deployment

Every push to `main` branch triggers automatic deployment.

### Manual Deployment

```bash
# Using doctl CLI
doctl apps create-deployment <app-id>
```

Or in DO Console:
1. Go to your app
2. Click **"Actions" → "Force Rebuild and Deploy"**

### Rollback

1. Go to **"Deployments"** tab
2. Find previous successful deployment
3. Click **"Rollback"**

## Security Checklist

- [ ] All secrets stored as environment variables
- [ ] JWT_SECRET is strong random string
- [ ] DATABASE_URL is encrypted
- [ ] HTTPS enabled (automatic with DO)
- [ ] Regular security updates

## Backup Strategy

### Database Backups

DigitalOcean automatically backs up your database:
- Daily backups retained for 7 days
- Manual backup:
  ```bash
  doctl databases backup <database-id>
  ```

### Code Backup

- Code is in GitHub repository
- Keep `main` branch protected
- Tag releases: `git tag v1.0.0`

## Performance Optimization

### 1. Enable Caching

Add caching headers in Express:
```typescript
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

### 2. Database Connection Pooling

Prisma handles this automatically, but verify:
```typescript
// In prisma.ts
connection_limit = 10
```

### 3. Compress Responses

Already handled by Express + Next.js

## Support

### DigitalOcean Support

- [Community Forums](https://www.digitalocean.com/community)
- [Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Support Tickets](https://cloud.digitalocean.com/support/tickets)

### Application Issues

- Check [GitHub Issues](https://github.com/rangerchaz/career-transition-program/issues)
- Review application logs
- Check DATABASE_URL and API keys

## Next Steps

1. ✅ Deploy to DigitalOcean
2. ✅ Set up custom domain
3. ✅ Configure DNS
4. ✅ Test all features
5. ✅ Monitor performance
6. ✅ Set up alerts

---

**Ready to deploy?** Follow the steps above and your app will be live in ~10 minutes! 🚀
