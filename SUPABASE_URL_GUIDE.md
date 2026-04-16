# 🔍 Finding Your Supabase Project URL

## Step-by-Step Visual Guide

### 1. Go to Supabase Dashboard
```
https://supabase.com/dashboard
```

### 2. Select Your Project
- Click on your project name from the project list
- Make sure you're in the correct project

### 3. Click "Settings" in Left Sidebar
```
📁 Your Project Name
├── 📊 Dashboard
├── 🗄️ Table Editor
├── 🔧 Settings    ← Click this!
├── 🎯 API Docs
└── 📝 SQL Editor
```

### 4. Click "API" in Settings Menu
```
⚙️ Settings
├── General
├── Database
├── API          ← Click this!
├── Auth
├── Storage
└── Edge Functions
```

### 5. Copy the "Project URL"
Look for this section:
```
🔗 Project URL
https://abcdefghijklmnop.supabase.co
```
**Copy this entire URL!**

### 6. Also Copy the "anon public" Key
In the same API settings page:
```
🔑 Project API keys
├── service_role (secret) → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└── anon public        → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← Copy this!
```

## Common Mistakes ❌

- **Don't copy the dashboard URL** - that's different!
- **Don't use the service_role key** - use the "anon public" key
- **Make sure the URL ends with `.supabase.co`**

## Quick Test 🧪

Once you have both values, run:
```bash
npm run quick-test
```

And edit `quick-test.js` to add your actual values:
```javascript
const SUPABASE_URL = 'https://your-actual-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-anon-key';
```

## Still Having Issues? 🤔

1. **Check if you're in the right project**
2. **Try refreshing the Supabase dashboard**
3. **Make sure your project isn't paused** (check billing)
4. **Verify you're looking at "Project API keys" not "JWT Secret"**

## Need Help?
- Check the [Supabase Docs](https://supabase.com/docs/guides/api#api-url-and-keys)
- Or ask your development team!

---

**Once you have both values, your admin panel will be fully functional!** 🚀