#!/usr/bin/env node

// Grow Sites - Admin Panel Test Script
// Run with: node test-setup.js

const https = require('https');

console.log('🧪 Testing Grow Sites Admin Panel Setup\n');

// Test Supabase connection (you'll need to add your keys)
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.log('❌ Supabase URL not configured');
    console.log('   Set SUPABASE_URL environment variable or edit this file');
    process.exit(1);
}

console.log('✅ Configuration loaded');
console.log(`   URL: ${SUPABASE_URL.substring(0, 30)}...`);
console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);

// Test basic connectivity
console.log('\n🔍 Testing Supabase connection...');

const testConnection = () => {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1/leads?select=count`;
        const options = {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        console.log('✅ Supabase connection successful');
                        console.log('✅ Database table exists');
                        resolve();
                    } else {
                        console.log('❌ Supabase connection failed');
                        console.log(`   Status: ${res.statusCode}`);
                        console.log(`   Response: ${data}`);
                        reject(new Error('Connection failed'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

testConnection()
    .then(() => {
        console.log('\n🎉 Setup test passed!');
        console.log('   Your admin panel should be working.');
        console.log('   Visit admin.html to manage your leads.');
    })
    .catch((error) => {
        console.log('\n❌ Setup test failed:');
        console.log(`   ${error.message}`);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your Supabase URL and keys');
        console.log('   2. Make sure the leads table exists');
        console.log('   3. Verify Row Level Security policies');
        console.log('   4. Check the ADMIN_SETUP_README.md file');
    });