# 🚀 Deploying to Vercel

## Quick Deploy

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `GROQ_API_KEY`
     - Value: Your Groq API key from `.env`
   - Click "Deploy"

## Alternative: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Add environment variable
vercel env add GROQ_API_KEY

# Deploy to production
vercel --prod
```

## Environment Variable

⚠️ **Important**: You MUST add your `GROQ_API_KEY` as an environment variable in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your Groq API key (from `.env` file)
   - **Environment**: Production, Preview, Development (select all)

## What Gets Deployed

- ✅ Frontend (Vite + React) → Static files
- ✅ Backend API → Vercel Serverless Functions (`/api` routes)
- ✅ StudyBuddy chatbot will work on production

## After Deployment

Your app will be available at:
```
https://your-project-name.vercel.app
```

The API endpoint will be:
```
https://your-project-name.vercel.app/api/chat
```

## Local Testing vs Production

- **Local**: Frontend (port 3000) + Backend (port 3001)
- **Production**: Everything on same domain via Vercel routing

No code changes needed! The `/api` routes work automatically.

## Troubleshooting

**If chatbot doesn't work on Vercel:**
1. Check that `GROQ_API_KEY` is set in environment variables
2. Check function logs in Vercel dashboard
3. Verify the API key is valid and not expired

**Build fails:**
- Make sure all dependencies are in `package.json`
- Check build logs in Vercel dashboard
