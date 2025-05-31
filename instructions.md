# Development Instructions

## Important Windows PowerShell Notes

1. **Command Chaining**

   - Do NOT use `&&` to chain commands in Windows PowerShell as it's not supported
   - Instead, use `;` (semicolon) to separate commands
   - Example:

     ```powershell
     # ❌ Don't do this
     npm install && npm start

     # ✅ Do this instead
     npm install; npm start
     ```

## Docker Commands

1. **Building and Starting Containers**

   ```powershell
   docker-compose up --build
   ```

2. **Stopping Containers**

   ```powershell
   docker-compose down
   ```

3. **Viewing Logs**
   ```powershell
   docker-compose logs
   ```

## Development Best Practices

1. **Hot Reloading**

   - Both client and server are configured for hot reloading
   - Changes to code should be reflected without container restarts
   - If changes aren't reflecting, try running `docker-compose restart`

2. **File Storage**

   - QR codes and images are stored in `/Server/storage/codes`
   - Each code has its own directory with pattern:
     ```
     /codes
      └── /<unique-code>
           ├── <unique-code>-image.png
           └── <unique-code>-qr.png
     ```

3. **MongoDB**
   - Database is accessible at `mongodb://localhost:27017/qr-generator`
   - Data persists in Docker volume `mongodb_data`

## Production Deployment with HTTPS

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Set other environment variables

2. **SSL Certificate Management**
   - SSL certificates are managed using certbot
   - Certificates will be stored in `/etc/letsencrypt/live/yourdomain.com/`
   - Certificate renewal is handled by certbot's cron job

3. **Running in Production**
   ```bash
   NODE_ENV=production npm start
   ```

4. **Important Notes**
   - Ensure ports 80 and 443 are accessible
   - Domain DNS must be properly configured
   - Server needs permission to read from `/etc/letsencrypt/`

## Manual Production Deployment

### Prerequisites
1. Install Node.js (v20 or later recommended)
2. Install certbot:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

### Initial Setup
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd cag
   ```

2. **Install Dependencies**
   ```bash
   cd Server
   npm install --production
   ```

3. **Environment Configuration**
   Export required environment variables

### SSL Certificate Setup
1. **Stop any services using port 80**
   ```bash
   sudo lsof -i :80
   sudo kill -9 <PID>
   ```

2. **Get SSL Certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```
   Certificates will be stored in `/etc/letsencrypt/live/yourdomain.com/`

3. **Set Up Auto-Renewal**
   Add to crontab (sudo crontab -e):
   ```
   0 0 1 * * certbot renew
   ```

### Running the Server
1. **Start MongoDB** (if running locally)
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **Start the Server**
   ```bash
   cd Server
   NODE_ENV=production npm start
   ```

### Health Monitoring
- Check HTTPS and certificate status: `https://yourdomain.com/health/status`
- Monitor logs: `tail -f /var/log/syslog`

### Troubleshooting
1. **Certificate Issues**
   - Check certificate status: `certbot certificates`
   - Manual renewal: `sudo certbot renew --force-renewal`

2. **Server Issues**
   - Check logs: `journalctl -u nodejs-app -f`
   - Verify ports: `sudo netstat -tulpn | grep LISTEN`

3. **MongoDB Issues**
   - Check status: `systemctl status mongodb`
   - View logs: `tail -f /var/log/mongodb/mongodb.log`

### Security Notes
- Keep Node.js and npm updated
- Regularly update system packages
- Monitor certificate expiration
- Use strong JWT secrets
- Keep MongoDB secure with authentication
- Regular security audits recommended

### Backup Recommendations
1. **Database Backup**
   ```bash
   mongodump --db your-database --out /backup/path
   ```

2. **Certificate Backup**
   ```bash
   sudo cp -r /etc/letsencrypt/live/yourdomain.com /backup/path
   ```

3. **Application Backup**
   ```bash
   tar -czf backup.tar.gz /path/to/application
   ```
