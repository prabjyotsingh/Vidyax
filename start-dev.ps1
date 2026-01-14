# Quick start script for development

Write-Host "🚀 Starting StudyTracker Development Server..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Starting Vite dev server..." -ForegroundColor Green
npm run dev
