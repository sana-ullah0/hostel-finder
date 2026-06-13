#!/bin/bash
# ============================================
# Hostel Finder - Quick Setup Script
# Run from project root: bash setup.sh
# ============================================

echo ""
echo "🏠 Hostel Finder Setup"
echo "======================"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js $(node -v) found"

# Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend && npm install

if [ $? -eq 0 ]; then
  echo "✅ Dependencies installed"
else
  echo "❌ npm install failed"
  exit 1
fi

cd ..

echo ""
echo "======================================="
echo "✅ Frontend setup complete!"
echo ""
echo "📋 Manual steps remaining:"
echo ""
echo "1. Copy entire 'hostel-finder' folder to:"
echo "   C:\\xampp\\htdocs\\hostel-finder\\"
echo ""
echo "2. Import database:"
echo "   → Open phpMyAdmin"
echo "   → Create database: hostel_finder"
echo "   → Import: backend/database/schema.sql"
echo ""
echo "3. Start the app:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open: http://localhost:5173"
echo ""
echo "5. Admin panel: http://localhost:5173/admin/login"
echo "   Username: admin | Password: admin123"
echo "======================================="
