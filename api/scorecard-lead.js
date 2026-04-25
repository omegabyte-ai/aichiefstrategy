const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'shawn@shawnp.ai';
const FROM_EMAIL = 'AI Chief Strategy <onboarding@resend.dev>';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const {
    name = '', company = '', email = '',
    score = '', tier = '', label = '',
    goal = '', past = '', fwd = '', tools = '',
    source = 'https://www.aichiefstrategy.com',
    utm_source = '', utm_medium = '', utm_campaign = ''
  } = body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const timestamp = new Date().toISOString();
  const scoreInt = parseInt(score) || 0;
  const tierLabel = label || tier || 'Unknown';

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f4;padding:20px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
  <div style="background:#0a0a0a;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:18px;font-weight:600">🎯 New AI Readiness Scorecard Lead</h1>
    <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">AI Chief Strategy · aichiefstrategy.com</p>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666;width:160px">Name</td><td style="padding:10px 12px;font-weight:700;color:#111">${name}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Company</td><td style="padding:10px 12px;color:#111">${company || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Email</td><td style="padding:10px 12px"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;font-weight:600">${email}</a></td></tr>
      <tr><td style="padding:16px 12px 4px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px" colspan="2">Scorecard Results</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">AI Readiness Score</td><td style="padding:10px 12px;font-weight:700;font-size:20px;color:#111">${score}<span style="font-size:13px;font-weight:400;color:#666"> / 100 · ${tierLabel}</span></td></tr>
      <tr><td style="padding:10px 12px;color:#666">Primary AI Goal</td><td style="padding:10px 12px;color:#111">${goal || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">AI Tools Used</td><td style="padding:10px 12px;color:#111">${tools || '—'}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Past AI Investment</td><td style="padding:10px 12px;color:#111">${past || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Willingness to Move</td><td style="padding:10px 12px;color:#111">${fwd || '—'}</td></tr>
      <tr><td style="padding:16px 12px 4px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px" colspan="2">Source</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Timestamp</td><td style="padding:10px 12px;color:#111;font-size:12px">${timestamp}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Source URL</td><td style="padding:10px 12px;font-size:12px"><a href="${source}" style="color:#3b82f6">${source}</a></td></tr>
      ${utm_source ? `<tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">UTM</td><td style="padding:10px 12px;color:#111;font-size:12px">${utm_source} / ${utm_medium} / ${utm_campaign}</td></tr>` : ''}
    </table>
    <div style="margin-top:24px;display:flex;gap:12px">
      <a href="https://cal.com/team/omegabyte/ai-strategy-discovery-call" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600">Book Discovery Call</a>
      <a href="mailto:${email}?subject=Re: Your AI Readiness Score (${score}/100 — ${tierLabel})&body=Hi ${encodeURIComponent(name)}," style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600">Reply to Lead</a>
    </div>
  </div>
</div>
</body></html>`;

  const text = `New AI Readiness Scorecard Lead — AI Chief Strategy

Name: ${name}
Company: ${company || '—'}
Email: ${email}

Score: ${score}/100 (${tierLabel})
Primary AI Goal: ${goal || '—'}
AI Tools Used: ${tools || '—'}
Past AI Investment: ${past || '—'}
Willingness to Move: ${fwd || '—'}

Timestamp: ${timestamp}
Source: ${source}
${utm_source ? `UTM: ${utm_source} / ${utm_medium} / ${utm_campaign}` : ''}`;

  if (RESEND_API_KEY) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [NOTIFY_EMAIL],
          subject: `New AI Readiness Scorecard Lead — AI Chief Strategy`,
          html,
          text,
          reply_to: email
        })
      });
      if (!emailRes.ok) {
        console.error('Resend error:', emailRes.status, await emailRes.text());
      } else {
        const d = await emailRes.json();
        console.log('Email sent:', d.id, '| Lead:', email, '| Score:', score);
      }
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  } else {
    console.error('RESEND_API_KEY not set — email not sent. Lead:', email);
  }

  return res.status(200).json({ ok: true, score, tier });
};
