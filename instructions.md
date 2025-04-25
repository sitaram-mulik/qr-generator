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
