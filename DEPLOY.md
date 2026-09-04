# Deploy & Email Setup

This project includes a serverless function at `api/submit-lead.js` that receives leads (from the contact form and chatbot) and sends them by email.

Recommended provider: **SendGrid** (reliable, simple API). Nodemailer+Gmail is supported as a fallback but requires an App Password.

Steps to enable email sending (Vercel recommended):

1. Install dependencies locally (for testing):

```bash
npm install
```

2. Set environment variables in your host (Vercel → Project Settings → Environment Variables) or create a local `.env` from `.env.example` for `vercel dev`.

Required (SendGrid recommended):
- `SENDGRID_API_KEY` — your SendGrid API key
- `NOTIFY_EMAIL` — where submissions should be sent (your email)
- `FROM_EMAIL` — optional, the sender address for SendGrid

Fallback (Gmail):
- `GMAIL_USER` — your Gmail address
- `GMAIL_PASS` — Gmail App Password (16 characters)

3. Local testing with Vercel CLI:

```bash
npm i -g vercel
# create a .env file or set env vars in Vercel dashboard
vercel dev
```

4. Verify form submissions
- Visit `http://localhost:3000/contact.html` (or your deployed URL)
- Submit the contact form or complete the chatbot flow
- If configured correctly you'll receive an email containing all submitted fields

5. Troubleshooting
- If the API returns 500 with `Email provider not configured`, set the environment variables described above.
- Check server logs in Vercel (or terminal output for `vercel dev`) for errors from SendGrid/Nodemailer.
