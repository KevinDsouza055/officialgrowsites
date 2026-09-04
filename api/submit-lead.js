// api/submit-lead.js
// Vercel Serverless Function — receives lead from chatbot + contact form
// and sends email via Nodemailer (Gmail)

const nodemailer = require('nodemailer');
// SendGrid is optional — used when SENDGRID_API_KEY is provided
let sgMail;
if (process.env.SENDGRID_API_KEY) {
  try { sgMail = require('@sendgrid/mail'); } catch (e) { console.warn('SendGrid module not installed but SENDGRID_API_KEY present'); }
}

// ── Email template ───────────────────────────────────────
function buildEmailHTML(data) {
  const isChat = data.source === 'chatbot';

  const rows = isChat
    ? [
        ['Website Type', data.website_type],
        ['Project Goal', data.goal],
        ['References', data.references],
        ['Features', data.features],
        ['Timeline', data.timeline],
        ['Location', data.location],
        ['Budget', data.budget],
        ['Name', data.name],
        ['Email', data.email],
        ['Extra Notes', data.extra_notes],
      ]
    : [
        ['Name', data.name],
        ['Email', data.email],
        ['Business', data.business],
        ['WhatsApp', data.whatsapp],
        ['Instagram', data.instagram],
        ['Facebook', data.facebook],
        ['Message', data.message],
      ];

  const tableRows = rows
    .filter(([, v]) => v && v !== 'undefined')
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 16px;background:#F5F3EE;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6B6560;white-space:nowrap;border-bottom:1px solid #EDE9E1;">${k}</td>
        <td style="padding:10px 16px;font-size:14px;color:#2A2724;border-bottom:1px solid #EDE9E1;">${v}</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#FAFAF8;font-family:'DM Sans',system-ui,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;">
        <tr>
          <td style="background:#2A2724;padding:32px 36px;border-radius:16px 16px 0 0;">
            <div style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#FAFAF8;">
              Grow Sites<span style="color:#B8CCE0;">.</span>
            </div>
            <div style="font-size:13px;color:rgba(250,250,248,.45);margin-top:6px;">
              ${isChat ? '🤖 New lead from AI chatbot' : '📬 New contact form submission'}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#FAFAF8;border:1px solid #EDE9E1;border-top:none;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${tableRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px;background:#F5F3EE;border:1px solid #EDE9E1;border-top:none;border-radius:0 0 16px 16px;">
            <div style="font-size:11px;color:#A8A29A;">
              Submitted at ${new Date(data.timestamp || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              &nbsp;·&nbsp; Source: ${data.source || 'contact form'}
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ── Handler ──────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Normalize body (some hosts send string bodies)
  let data = req.body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // try parsing URL-encoded form data
      try {
        data = Object.fromEntries(new URLSearchParams(data));
      } catch (e2) {
        console.error('Failed to parse request body', e, e2);
        return res.status(400).json({ error: 'Invalid request body' });
      }
    }
  }

  // Basic validation: contact form requires both name and email
  if (!data || (data.source === 'contact-form' ? (!data.name || !data.email) : (!data.name && !data.email))) {
    return res.status(400).json({ error: 'Missing required fields (name and email required for contact form)' });
  }

  try {
    const subject = data.source === 'chatbot'
      ? `🤖 New Chatbot Lead — ${data.name || 'Unknown'} (${data.budget || 'budget TBD'})`
      : `📬 New Contact Form — ${data.name || 'Unknown'} (${data.business || ''})`;

    // Prefer SendGrid when API key provided
    if (process.env.SENDGRID_API_KEY && sgMail) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
        from: process.env.FROM_EMAIL || process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
        replyTo: data.email || process.env.GMAIL_USER,
        subject,
        html: buildEmailHTML(data),
      };
      await sgMail.send(msg);
    } else {
      // Fallback to Nodemailer + Gmail
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error('Email credentials not configured');
        return res.status(500).json({ error: 'Email provider not configured', detail: 'No SendGrid key or Gmail credentials set on the server.' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Grow Sites Bot" <${process.env.GMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
        replyTo: data.email || process.env.GMAIL_USER,
        subject,
        html: buildEmailHTML(data),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email', detail: err.message });
  }
};