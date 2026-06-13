```markdown
# Run and Deploy Your App

## Prerequisites
- Node.js installed on your machine

## Setup & Run Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Run the app:
   ```
   npm run dev
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Deploy to a Local Server (LAN)

To make the app accessible to other devices on the same network:

1. Find your machine's local IP address:
   - **Windows:** Open Command Prompt and run `ipconfig`, look for **IPv4 Address**
   - **Mac/Linux:** Run `ifconfig` or `ip addr`, look for **inet** under your network adapter

2. Update your dev script to expose the host. In `package.json`, change:
   ```json
   "dev": "next dev"
   ```
   to:
   ```json
   "dev": "next dev -H 0.0.0.0"
   ```

3. Run the app:
   ```
   npm run dev
   ```

4. Other devices on the same network can now access the app via:
   ```
   http://<your-local-ip>:3000
   ```
   Example: `http://192.168.1.105:3000`

## Deploy for Production (Local Server)

1. Build the app for production:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

3. (Optional) Keep the app running in the background using PM2:
   ```
   npm install -g pm2
   pm2 start npm --name "my-app" -- start
   pm2 save
   pm2 startup
   ```

4. Access the app at:
   ```
   http://localhost:3000
   ```
   or on your network:
   ```
   http://<your-local-ip>:3000
   ```
```