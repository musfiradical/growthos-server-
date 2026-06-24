# GrowthOS Server

## Deploy to Railway (10 minutes)

### Step 1 — Push to GitHub
1. Create a new GitHub repo called `growthos-server`
2. Upload all files in this folder to that repo

### Step 2 — Deploy on Railway
1. Go to railway.app
2. Click New Project → Deploy from GitHub repo
3. Select your `growthos-server` repo
4. Railway detects Node.js automatically and deploys

### Step 3 — Add your API key
1. In Railway dashboard click your project
2. Click Variables tab
3. Add: ANTHROPIC_API_KEY = your key from console.anthropic.com
4. Railway redeploys automatically

### Step 4 — Get your Railway URL
1. Click Settings tab in Railway
2. Copy your URL — looks like: growthos-server.up.railway.app
3. That is your live server URL

### Step 5 — Update GrowthOS frontend
In GrowthOS_v1_Final.html find this line:
  const SERVER_URL = 'https://YOUR-APP.up.railway.app';
Replace YOUR-APP with your actual Railway app name.
Upload to GitHub Pages as index.html.

Done — everything works.

## Files
- server.js        — Express server, handles all AI calls
- package.json     — Dependencies
- .env.example     — Template (copy to .env for local testing)
- public/index.html — GrowthOS frontend (served by the server)

## Local testing
1. Copy .env.example to .env
2. Add your API key to .env
3. Run: npm install
4. Run: npm start
5. Open: http://localhost:3000
