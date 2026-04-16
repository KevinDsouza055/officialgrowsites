#!/usr/bin/env node

// Quick Supabase Connection Test
// Run with: node quick-test.js

const https = require('https');

// Replace these with your actual values
const SUPABASE_URL = 'https://zqnkbipacomxvrfdhjke.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KNKI1EGL2pE7tUsbWnDMFg_GM3NCFhH';

console.log('🔍 Testing Supabase Connection\n');
console.log('Make sure you have replaced the placeholder values in this file!\n');

if (SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL_HERE') {
    console.log('❌ Please replace YOUR_SUPABASE_PROJECT_URL_HERE with your actual project URL');
    console.log('   Find it in: Supabase Dashboard → Settings → API → Project URL\n');
    process.exit(1);
}

if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.log('❌ Please replace YOUR_SUPABASE_ANON_KEY_HERE with your actual anon key');
    console.log('   Find it in: Supabase Dashboard → Settings → API → Project API keys → anon public\n');
    process.exit(1);
}

console.log('✅ Configuration loaded');
console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

console.log('🌐 Testing connection to Supabase...');

const testConnection = () => {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1/leads?select=count`;
        const options = {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        };

        const req = https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Connection successful!');
                    console.log('✅ Database table exists and is accessible');
                    console.log('✅ Ready to collect form submissions\n');
                    console.log('🎉 Your admin panel is ready to use!');
                    console.log('   Visit admin.html to manage your leads.\n');
                    resolve();
                } else {
                    console.log('❌ Connection failed');
                    console.log(`   Status Code: ${res.statusCode}`);
                    console.log(`   Response: ${data}\n`);

                    if (res.statusCode === 404) {
                        console.log('💡 This usually means the "leads" table doesn\'t exist yet.');
                        console.log('   Run the SQL from ADMIN_SETUP_README.md to create it.\n');
                    } else if (res.statusCode === 401) {
                        console.log('💡 Authentication failed. Check your anon key.\n');
                    }

                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Network error:', error.message);
            console.log('💡 Check your internet connection and Supabase URL.\n');
            reject(error);
        });

        req.setTimeout(10000, () => {
            console.log('❌ Connection timeout');
            console.log('💡 Supabase might be down or your URL might be incorrect.\n');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
};

testConnection().catch(() => {
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Double-check your Project URL (should end with .supabase.co)');
    console.log('2. Verify your anon key is correct');
    console.log('3. Make sure the leads table exists (run the SQL from setup guide)');
    console.log('4. Check that Row Level Security policies are set up');
    console.log('5. Try again in a few minutes (Supabase might be initializing)');
});