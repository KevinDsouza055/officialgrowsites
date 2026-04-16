#!/usr/bin/env node

// Update Supabase Keys in All Files
// Run with: node update-keys.js

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔑 Supabase Keys Updater');
console.log('========================\n');

rl.question('Enter your Supabase Project URL (https://xxxxx.supabase.co): ', (url) => {
    if (!url || !url.includes('supabase.co')) {
        console.log('❌ Invalid URL. Should look like: https://abcdefghijklmnop.supabase.co');
        rl.close();
        return;
    }

    rl.question('Enter your Supabase Anon Key: ', (key) => {
        if (!key || key.length < 50) {
            console.log('❌ Invalid key. Should be a long JWT token.');
            rl.close();
            return;
        }

        console.log('\n🔄 Updating files...');

        const files = ['index.html', 'contact.html', 'admin.html', 'quick-test.js'];

        files.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');

                // Update URL
                content = content.replace(
                    /const SUPABASE_URL = 'YOUR_SUPABASE_URL';/,
                    `const SUPABASE_URL = '${url}';`
                );

                // Update anon key
                content = content.replace(
                    /const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';/,
                    `const SUPABASE_ANON_KEY = '${key}';`
                );

                fs.writeFileSync(file, content);
                console.log(`✅ Updated ${file}`);

            } catch (error) {
                console.log(`❌ Error updating ${file}:`, error.message);
            }
        });

        console.log('\n🎉 All files updated successfully!');
        console.log('\n🧪 Test your setup:');
        console.log('   npm run quick-test');
        console.log('\n🚀 Access your admin panel:');
        console.log('   Visit admin.html in your browser');

        rl.close();
    });
});