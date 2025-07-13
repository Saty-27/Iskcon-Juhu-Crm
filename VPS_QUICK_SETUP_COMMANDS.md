# Quick VPS Setup Commands

## 1. Ubuntu Server Initial Setup
```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y curl wget git nginx postgresql postgresql-contrib ufw

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2
```

## 2. PostgreSQL Database Setup
```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE iskcon_juhu;"
sudo -u postgres psql -c "CREATE USER iskcon_user WITH PASSWORD 'YourSecurePassword123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE iskcon_juhu TO iskcon_user;"
sudo -u postgres psql -c "ALTER USER iskcon_user CREATEDB;"
```

## 3. Deploy Application
```bash
# Create directory
mkdir -p /var/www/iskcon-juhu
cd /var/www/iskcon-juhu

# Upload your project files here (using SCP, FTP, or Git)
# Example: scp -r /path/to/project/* root@server-ip:/var/www/iskcon-juhu/

# Install dependencies
npm install

# Build application
npm run build

# Create uploads directory
mkdir -p uploads/{banners,gallery,videos,qr-codes,receipts}
chmod -R 755 uploads
```

## 4. Environment Configuration
```bash
# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://iskcon_user:YourSecurePassword123@localhost:5432/iskcon_juhu
PAYU_MERCHANT_KEY=2fKjPt
PAYU_MERCHANT_SALT=zBqitHlab9VU52l9ZDv8x5D1rxYBtgat
PAYU_BASE_URL=https://secure.payu.in
UPI_ID=iskconjuhu@sbi
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_very_secure_random_session_secret_here
EOF
```

## 5. Database Migration
```bash
# Import your database backup
psql -h localhost -U iskcon_user -d iskcon_juhu < replit_database_backup.sql

# Or run schema migration
npm run db:push
```

## 6. Nginx Configuration
```bash
# Create nginx config
cat > /etc/nginx/sites-available/iskcon-juhu << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /var/www/iskcon-juhu/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/iskcon-juhu /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 7. Start Application
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'iskcon-juhu',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 8. Configure Firewall
```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

## 9. Test Your Setup
```bash
# Check PM2 status
pm2 status

# Check if app is running
curl -I http://localhost:5000

# Check database connection
psql -h localhost -U iskcon_user -d iskcon_juhu -c "SELECT COUNT(*) FROM users;"

# Check logs
pm2 logs iskcon-juhu
```

## 10. Optional: SSL Certificate
```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Important Notes:

1. **Database Export**: Before starting, run this in your Replit:
   ```bash
   pg_dump $DATABASE_URL > replit_database_backup.sql
   ```

2. **File Upload**: Use SCP to upload your project:
   ```bash
   scp -r /path/to/your/project/* root@your-vps-ip:/var/www/iskcon-juhu/
   ```

3. **Payment Gateway**: Your PayU credentials are already configured for live payments

4. **Admin Access**: Default admin login:
   - Email: admin@iskconjuhu.org
   - Password: admin1234

5. **Security**: Change default passwords and update session secret

Your ISKCON Juhu donation system will be fully operational on your VPS with all data migrated!