# Grow Sites - Admin Panel Setup Guide

## 🚀 Complete Admin Panel with Real-Time Lead Management

Your website now has a **full-featured admin panel** that collects form submissions and provides real-time lead management with status tracking.

## 📋 Features

- ✅ **Real-time lead collection** from contact forms
- ✅ **Admin dashboard** with statistics
- ✅ **Lead status management** (New, Contacted, Qualified, Closed, Rejected)
- ✅ **Real-time updates** - see new leads instantly
- ✅ **Edit/Delete leads**
- ✅ **Filtering and sorting**
- ✅ **Responsive design**

## 🛠️ Setup Instructions

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Set Up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the leads table:

```sql
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
```

### Step 3: Get Your API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

### Step 4: Update Your Website Files
Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` in these files:

**Files to update:**
- `index.html` (lines ~587-590)
- `contact.html` (lines ~232-235)
- `admin.html` (lines ~478-481)

**Replace with your actual values:**
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 5: Set Up Authentication for Admin Panel
1. In Supabase dashboard, go to **Authentication** → **Users**
2. Create an admin user account
3. Or set up authentication in your admin panel

### Step 6: Access Your Admin Panel
- Visit: `https://yourdomain.com/admin.html`
- Log in with your Supabase credentials
- View and manage all leads in real-time!

## 📊 Admin Panel Features

### Dashboard Statistics
- Total leads count
- New leads count
- Contacted leads count
- Qualified leads count

### Lead Management
- **View all submissions** with full details
- **Filter by status** (New, Contacted, Qualified, Closed, Rejected)
- **Sort by date, name, or business**
- **Real-time updates** - new leads appear instantly

### Lead Actions
- **Edit lead details** - update name, business, WhatsApp, message
- **Change status** - quick status updates with buttons
- **Delete leads** - remove unwanted submissions
- **View full messages** - expand long messages

### Status Workflow
1. **New** - Fresh submissions
2. **Contacted** - You've reached out
3. **Qualified** - Good fit for your services
4. **Closed** - Deal completed
5. **Rejected** - Not a good fit

## 🔒 Security Notes

- The forms allow anonymous submissions (required for contact forms)
- Admin panel requires authentication
- All data is stored securely in Supabase
- Real-time updates work across multiple admin sessions

## 🎯 What Happens Now

1. **Visitors fill out forms** → Data goes to Supabase instantly
2. **You get real-time notifications** → New leads appear in admin panel
3. **Manage leads systematically** → Update status, add notes, track progress
4. **Never lose a lead again** → Everything is stored and searchable

## 🆘 Troubleshooting

**Form not submitting?**
- Check browser console for errors
- Verify Supabase URL and key are correct
- Make sure table exists in Supabase

**Admin panel not loading?**
- Check authentication is set up
- Verify API keys
- Check browser console

**Real-time not working?**
- Check internet connection
- Verify Supabase project is active

## 💡 Pro Tips

- Set up email notifications in Supabase for new leads
- Export leads regularly for backup
- Use the filtering to focus on high-priority leads
- Set reminders for follow-ups on contacted leads

---

**Need help?** Check the Supabase documentation or contact your development team!

🎉 **Your lead management system is now live and collecting data 24/7!**