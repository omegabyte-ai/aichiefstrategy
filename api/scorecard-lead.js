const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'shawn@aichiefstrategies.com';
const FROM_DISPLAY = process.env.FROM_EMAIL || 'AI Chief Strategies <shawn@aichiefstrategies.com>';

const TIER_DATA = {
  pioneer: {
    label: 'AI Pioneer',
    description: "You're ahead of most. The question isn't whether to invest in AI — it's how to compound what you've already built and stay ahead as the gap widens.",
    insight: "Companies at Pioneer level typically see the biggest returns by moving from ad hoc wins to systematic, org-wide AI infrastructure. That's where the compounding starts."
  },
  operator: {
    label: 'AI Operator',
    description: "Real AI activity is happening — but it's not yet systematic. The gap between where you are and AI Pioneer is narrower than you think, but it requires deliberate architecture.",
    insight: "Operators who close the gap in 60–90 days typically do it by building one core orchestration layer — not by adding more tools."
  },
  experimenter: {
    label: 'AI Experimenter',
    description: "You've started asking the right questions. Now it's time to turn exploration into execution before your competitors move from pilot to production.",
    insight: "The window between experimenter and operator is narrow. Companies that move now capture the compounding advantage. Those that wait are catching up to a moving target."
  },
  skeptic: {
    label: 'AI Skeptic',
    description: "Most companies at this stage have more AI potential than they realize. The gap isn't capability — it's strategy. That's exactly what this call is for.",
    insight: "The best time to build an AI strategy is before your competitors force your hand. The second best time is now."
  }
};

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
    goal = '', past = '', budget = '', fwd = '', tools = '',
    source = 'https://www.aichiefstrategies.com',
    utm_source = '', utm_medium = '', utm_campaign = ''
  } = body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const timestamp = new Date().toISOString();
  const scoreInt = parseInt(score) || 0;
  const tierKey = (tier || 'skeptic').toLowerCase();
  const tierInfo = TIER_DATA[tierKey] || TIER_DATA.skeptic;
  const tierLabel = label || tierInfo.label;

  // ─── NOTIFICATION EMAIL TO SHAWN ───────────────────────────────────────────
  const notifyHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f4;padding:20px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
  <div style="background:#0a0a0a;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:18px;font-weight:600">🎯 New AI Readiness Lead — AI Chief Strategies</h1>
    <p style="color:rgba(255,255,255,0.4);margin:6px 0 0;font-size:13px">aichiefstrategies.com</p>
  </div>
  <div style="padding:32px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666;width:160px">Name</td><td style="padding:10px 12px;font-weight:700;color:#111">${name}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Company</td><td style="padding:10px 12px;color:#111">${company || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Email</td><td style="padding:10px 12px"><a href="mailto:${email}" style="color:#3b82f6;font-weight:600">${email}</a></td></tr>
      <tr><td style="padding:16px 12px 4px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px" colspan="2">Scorecard Results</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Score</td><td style="padding:10px 12px;font-weight:700;font-size:20px;color:#111">${score}<span style="font-size:13px;font-weight:400;color:#666"> / 100 · ${tierLabel}</span></td></tr>
      <tr><td style="padding:10px 12px;color:#666">Primary AI Goal</td><td style="padding:10px 12px;color:#111">${goal || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">AI Tools Used</td><td style="padding:10px 12px;color:#111">${tools || '—'}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Past AI Spend (12 mo)</td><td style="padding:10px 12px;color:#111">${past || '—'}</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666;font-weight:700">AI Budget (next 12 mo)</td><td style="padding:10px 12px;color:#111;font-weight:700">${budget || '—'}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Speed to Move</td><td style="padding:10px 12px;color:#111">${fwd || '—'}</td></tr>
      <tr><td style="padding:16px 12px 4px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px" colspan="2">Attribution</td></tr>
      <tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">Timestamp</td><td style="padding:10px 12px;color:#111;font-size:12px">${timestamp}</td></tr>
      <tr><td style="padding:10px 12px;color:#666">Source</td><td style="padding:10px 12px;font-size:12px"><a href="${source}" style="color:#3b82f6">${source}</a></td></tr>
      ${utm_source ? `<tr style="background:#f8f8f8"><td style="padding:10px 12px;color:#666">UTM</td><td style="padding:10px 12px;color:#111;font-size:12px">${utm_source} / ${utm_medium} / ${utm_campaign}</td></tr>` : ''}
    </table>
    <div style="margin-top:24px;display:flex;gap:12px">
      <a href="https://cal.com/team/omegabyte/ai-strategy-discovery-call" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600">Book Discovery Call</a>
      <a href="mailto:${email}?subject=Re: Your AI Readiness Score (${score}/100 — ${tierLabel})&body=Hi ${name}," style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600">Reply to Lead</a>
    </div>
  </div>
</div>
</body></html>`;

  // ─── THANK-YOU EMAIL TO PROSPECT ────────────────────────────────────────────
  const thankyouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your AI Readiness Report — AI Chief Strategies</title>
</head>
<body style="margin:0;padding:0;background:#ebebeb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <!-- Header -->
  <div style="background:#0a0a0a;padding:28px 40px;border-radius:12px 12px 0 0">
    <p style="color:rgba(255,255,255,0.9);font-size:15px;font-weight:700;letter-spacing:0.5px;margin:0">AI Chief Strategies</p>
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:4px 0 0;letter-spacing:1px;text-transform:uppercase">An OMEGABYTE.AI Company</p>
  </div>

  <!-- Score Hero -->
  <div style="background:#111;padding:48px 40px;text-align:center;border-top:1px solid #1e1e1e">
    <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px">Your AI Readiness Report</p>
    <p style="color:#fff;font-size:72px;font-weight:800;margin:0;line-height:1;letter-spacing:-2px">${score}</p>
    <p style="color:rgba(255,255,255,0.35);font-size:16px;margin:6px 0 24px;font-weight:400">out of 100</p>
    <span style="display:inline-block;background:#3b82f6;color:#fff;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:8px 20px;border-radius:100px">${tierLabel}</span>
    <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.65;margin:24px auto 0;max-width:420px">${tierInfo.description}</p>
  </div>

  <!-- Body -->
  <div style="background:#fff;padding:44px 40px">

    <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 6px">Thank you, ${name}.</p>
    <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 28px">Your results are ready. I've reviewed your score and what it says about where your company is right now with AI — and I want to walk you through it directly.</p>

    <p style="font-size:15px;color:#333;line-height:1.75;margin:0 0 8px">${tierInfo.insight}</p>

    <p style="font-size:15px;color:#555;line-height:1.75;margin:16px 0 32px">The best way to turn your score into an actual plan is a <strong style="color:#111">30-minute AI Strategy Call</strong> — no slide decks, no sales pitch. You'll speak directly with me. We'll cover your biggest gap and what to do first.</p>

    <!-- CTA -->
    <div style="text-align:center;margin:36px 0">
      <a href="https://cal.com/team/omegabyte/ai-strategy-discovery-call"
         style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:18px 36px;border-radius:8px;letter-spacing:0.2px">
        Book Your 30-Minute Call →
      </a>
      <p style="color:#aaa;font-size:12px;margin:14px 0 0">Slots are limited. If you're ready to move, book now.</p>
    </div>

    <!-- Divider -->
    <div style="border-top:1px solid #f0f0f0;margin:36px 0"></div>

    <!-- Prep block -->
    <div style="background:#f8f9fb;border-left:3px solid #3b82f6;padding:24px 28px;border-radius:0 8px 8px 0">
      <p style="font-size:13px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px">Before we talk, think about:</p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 10px">→&nbsp; The AI initiative you're most uncertain about</p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 10px">→&nbsp; The biggest bottleneck slowing your team down right now</p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0">→&nbsp; Any vendor or tool you're evaluating and want a second opinion on</p>
    </div>

    <!-- Divider -->
    <div style="border-top:1px solid #f0f0f0;margin:36px 0"></div>

    <!-- Sign-off -->
    <p style="font-size:14px;color:#666;line-height:1.75;margin:0 0 24px">Questions before we talk? Reply directly to this email — I read every one and will get back to you personally.</p>

    <p style="font-size:15px;color:#333;margin:0;line-height:1.7">Talk soon,<br>
    <strong style="color:#111;font-size:16px">Shawn Panchacharam</strong><br>
    <span style="color:#888;font-size:13px">Founder, OMEGABYTE.AI &nbsp;·&nbsp; Fractional Chief AI Officer</span><br>
    <a href="https://www.aichiefstrategies.com" style="color:#3b82f6;text-decoration:none;font-size:13px">www.aichiefstrategies.com</a>
    </p>

  </div>

  <!-- Footer -->
  <div style="background:#f5f5f5;padding:20px 40px;border-radius:0 0 12px 12px;border-top:1px solid #e8e8e8">
    <p style="font-size:11px;color:#aaa;margin:0;text-align:center;line-height:1.6">
      <strong style="color:#888">AI Chief Strategies</strong> &nbsp;·&nbsp; <a href="https://www.aichiefstrategies.com" style="color:#aaa;text-decoration:none">www.aichiefstrategies.com</a><br>
      An OMEGABYTE.AI Company<br>
      You're receiving this because you completed our AI Readiness Scorecard.
    </p>
  </div>

</div>
</body>
</html>`;

  const thankyouText = `Thank you, ${name}.

Your AI Readiness Score: ${score}/100 — ${tierLabel}

${tierInfo.description}

${tierInfo.insight}

The best next step is a 30-minute AI Strategy Call. No pitch deck. No fluff. Just clarity on your score and what to prioritize first.

Book your call: https://cal.com/team/omegabyte/ai-strategy-discovery-call

Before we talk, think about:
→ The AI initiative you're most uncertain about
→ The biggest bottleneck slowing your team down right now
→ Any vendor or tool you're evaluating and want a second opinion on

Questions before then? Reply to this email — I read every one.

Talk soon,
Shawn Panchacharam
Founder, OMEGABYTE.AI · Fractional Chief AI Officer
www.aichiefstrategies.com

---
AI Chief Strategies · www.aichiefstrategies.com · An OMEGABYTE.AI Company`;

  // ─── SEND EMAILS ────────────────────────────────────────────────────────────
  if (RESEND_API_KEY) {
    const sendEmail = async (payload) => {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) console.error('Resend error:', r.status, await r.text());
      else { const d = await r.json(); console.log('Email sent:', d.id, payload.to); }
    };

    try {
      // 1. Notify Shawn
      await sendEmail({
        from: FROM_DISPLAY,
        to: [NOTIFY_EMAIL],
        subject: `New AI Readiness Lead — AI Chief Strategies | ${score}/100 · ${tierLabel} · ${name}`,
        html: notifyHtml,
        text: `New lead: ${name} | ${email} | ${company || '—'} | Score: ${score}/100 (${tierLabel}) | Goal: ${goal} | Past: ${past} | Budget: ${budget} | Speed: ${fwd}`,
        reply_to: email
      });

      // 2. Thank-you to prospect (only if they provided a real email)
      if (email && email.includes('@')) {
        await sendEmail({
          from: FROM_DISPLAY,
          to: [email],
          reply_to: 'shawn@aichiefstrategies.com',
          subject: `Your AI Readiness Score: ${score}/100 — AI Chief Strategies`,
          html: thankyouHtml,
          text: thankyouText
        });
      }
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  } else {
    console.error('RESEND_API_KEY not set — emails not sent. Lead:', email);
  }

  return res.status(200).json({ ok: true, score, tier });
};
