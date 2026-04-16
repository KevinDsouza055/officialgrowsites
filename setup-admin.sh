#!/bin/bash

# Grow Sites - Supabase Setup Script
# This script helps you set up the database schema for your admin panel

echo "🚀 Grow Sites Admin Panel Setup"
echo "================================"
echo ""

# Check if user has Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   OR visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "📋 This script will help you set up your Supabase database."
echo ""
echo "What would you like to do?"
echo "1. Initialize Supabase project locally"
echo "2. Create the leads table schema"
echo "3. Show setup instructions"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🔧 Initializing Supabase project..."
        supabase init
        echo "✅ Project initialized. Now run 'supabase start' to start local development."
        ;;
    2)
        echo "🗄️  Creating leads table schema..."
        echo ""
        echo "Copy and paste this SQL into your Supabase SQL Editor:"
        echo ""
        echo "----------------------------------------"
        cat << 'EOF'
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON leads FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read/update/delete
CREATE POLICY "Allow authenticated access" ON leads FOR ALL USING (auth.role() = 'authenticated');
EOF
        echo "----------------------------------------"
        echo ""
        echo "📝 Instructions:"
        echo "1. Go to your Supabase dashboard"
        echo "2. Navigate to SQL Editor"
        echo "3. Paste and run the above SQL"
        echo "4. Copy your Project URL and anon key"
        echo "5. Update the files with your credentials"
        ;;
    3)
        echo "📖 Setup Instructions:"
        echo ""
        echo "1. Create account at supabase.com"
        echo "2. Create new project"
        echo "3. Run option 2 above to create the table"
        echo "4. Get API keys from Settings → API"
        echo "5. Update these files with your keys:"
        echo "   - index.html"
        echo "   - contact.html"
        echo "   - admin.html"
        echo "6. Visit admin.html to manage leads"
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete! Check ADMIN_SETUP_README.md for detailed instructions."