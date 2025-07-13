# Complete VPS Deployment Guide for ISKCON Juhu Donation System

## Prerequisites
- KVM2 VPS with Ubuntu 20.04 or 22.04
- Root or sudo access
- Domain name pointed to your VPS IP
- Basic SSH access to your server

## Step 1: Initial Server Setup

### 1.1 Connect to Your VPS
```bash
ssh root@your-server-ip
# OR
ssh username@your-server-ip
```

### 1.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Essential Packages
```bash
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## Step 2: Install Node.js 20

### 2.1 Install Node.js via NodeSource
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Install PostgreSQL

### 3.1 Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 3.2 Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE iskcon_juhu_db;
CREATE USER iskcon_admin WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE iskcon_juhu_db TO iskcon_admin;
ALTER USER iskcon_admin CREATEDB;
\q
```

### 3.3 Configure PostgreSQL for External Connections
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and uncomment/modify this line:
listen_addresses = 'localhost'

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line at the end:
local   all             iskcon_admin                            md5

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

## Step 4: Install and Configure Nginx

### 4.1 Install Nginx
```bash
sudo apt install -y nginx
```

### 4.2 Configure Nginx
```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Create new configuration
sudo nano /etc/nginx/sites-available/iskcon-juhu
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Client max body size for file uploads
    client_max_body_size 50M;

    # Static files
    location /uploads/ {
        alias /var/www/iskcon-juhu/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Proxy to Node.js application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 4.3 Enable Site and Start Nginx
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/iskcon-juhu /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: Install SSL Certificate (Let's Encrypt)

### 5.1 Install Certbot
```bash
sudo apt install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 5.2 Generate SSL Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 6: Install PM2 for Process Management

### 6.1 Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 6.2 Setup PM2 to Start on Boot
```bash
# Generate startup script
pm2 startup

# Follow the instructions provided by the command above
# It will show you a command to run with sudo
```

## Step 7: Deploy Your Application

### 7.1 Create Application Directory
```bash
sudo mkdir -p /var/www/iskcon-juhu
sudo chown -R $USER:$USER /var/www/iskcon-juhu
cd /var/www/iskcon-juhu
```

### 7.2 Clone or Upload Your Code
```bash
# Option 1: If you have a Git repository
git clone https://github.com/yourusername/iskcon-juhu.git .

# Option 2: Upload files via SCP from your local machine
# Run this from your local machine:
# scp -r /path/to/your/project/* username@your-server-ip:/var/www/iskcon-juhu/
```

### 7.3 Install Dependencies
```bash
cd /var/www/iskcon-juhu
npm install
```

### 7.4 Create Environment File
```bash
nano .env
```

Add your environment variables:
```env
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://iskcon_admin:your_secure_password_here@localhost:5432/iskcon_juhu_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=iskcon_juhu_db
PGUSER=iskcon_admin
PGPASSWORD=your_secure_password_here

# JWT Secret
JWT_SECRET=your_very_secure_jwt_secret_here_min_32_chars

# Session Secret
SESSION_SECRET=your_very_secure_session_secret_here_min_32_chars

# PayU Configuration (Production)
PAYU_MERCHANT_KEY=your_payu_merchant_key
PAYU_MERCHANT_SALT=your_payu_merchant_salt
PAYU_BASE_URL=https://secure.payu.in/_payment

# Twilio Configuration (for WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application URLs
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### 7.5 Set Proper Permissions
```bash
# Set ownership
sudo chown -R $USER:$USER /var/www/iskcon-juhu

# Set proper permissions
find /var/www/iskcon-juhu -type d -exec chmod 755 {} \;
find /var/www/iskcon-juhu -type f -exec chmod 644 {} \;

# Make sure uploads directory exists and is writable
mkdir -p /var/www/iskcon-juhu/uploads
chmod 755 /var/www/iskcon-juhu/uploads
```

## Step 8: Database Setup

### 8.1 Run Database Migrations
```bash
cd /var/www/iskcon-juhu
npm run db:push
```

### 8.2 Import Existing Data (if you have a backup)
```bash
# If you have a database backup file
psql -h localhost -U iskcon_admin -d iskcon_juhu_db < your_backup_file.sql
```

## Step 9: Build and Start Application

### 9.1 Build the Application
```bash
cd /var/www/iskcon-juhu
npm run build
```

### 9.2 Start with PM2
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'iskcon-juhu',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/iskcon-juhu',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/iskcon-juhu/err.log',
    out_file: '/var/log/iskcon-juhu/out.log',
    log_file: '/var/log/iskcon-juhu/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
};
```

### 9.3 Create Log Directory and Start Application
```bash
# Create log directory
sudo mkdir -p /var/log/iskcon-juhu
sudo chown -R $USER:$USER /var/log/iskcon-juhu

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

## Step 10: Configure Firewall

### 10.1 Setup UFW Firewall
```bash
# Install UFW if not already installed
sudo apt install -y ufw

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 11: Setup Automatic Backups

### 11.1 Create Backup Script
```bash
sudo nano /usr/local/bin/backup-iskcon.sh
```

Add this script:
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/iskcon-juhu"
DB_NAME="iskcon_juhu_db"
DB_USER="iskcon_admin"
APP_DIR="/var/www/iskcon-juhu"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
PGPASSWORD="your_secure_password_here" pg_dump -h localhost -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$DATE.sql"

# Application files backup
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
```

### 11.2 Make Script Executable and Add to Crontab
```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-iskcon.sh

# Add to crontab for daily backups at 2 AM
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-iskcon.sh >> /var/log/iskcon-backup.log 2>&1
```

## Step 12: Monitoring and Maintenance

### 12.1 Monitor Application
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs iskcon-juhu

# Restart application
pm2 restart iskcon-juhu

# Check Nginx status
sudo systemctl status nginx

# Check PostgreSQL status
sudo systemctl status postgresql
```

### 12.2 Update Application
```bash
# Script for updating application
cd /var/www/iskcon-juhu

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations if needed
npm run db:push

# Build application
npm run build

# Restart with PM2
pm2 restart iskcon-juhu
```

## Step 13: Security Hardening

### 13.1 Install Fail2Ban
```bash
sudo apt install -y fail2ban

# Configure Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

Add this configuration:
```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-badbots]
enabled = true
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
```

### 13.2 Start Fail2Ban
```bash
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## Troubleshooting

### Common Issues and Solutions

1. **Application won't start:**
   ```bash
   # Check logs
   pm2 logs iskcon-juhu
   
   # Check if port is in use
   sudo netstat -tulpn | grep :3000
   ```

2. **Database connection issues:**
   ```bash
   # Test database connection
   psql -h localhost -U iskcon_admin -d iskcon_juhu_db
   
   # Check PostgreSQL logs
   sudo tail -f /var/log/postgresql/postgresql-14-main.log
   ```

3. **Nginx issues:**
   ```bash
   # Test Nginx configuration
   sudo nginx -t
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues:**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew --dry-run
   ```

## Final Steps

1. **Test your website**: Visit https://your-domain.com
2. **Test admin login**: Go to https://your-domain.com/login
3. **Test donation flow**: Make a test donation
4. **Monitor logs**: Check for any errors in the first 24 hours

## Important Security Notes

- Change all default passwords
- Keep your system updated: `sudo apt update && sudo apt upgrade`
- Monitor your logs regularly
- Setup automated backups
- Use strong passwords for all accounts
- Consider setting up monitoring alerts

Your ISKCON Juhu Donation System is now deployed and ready for production use!