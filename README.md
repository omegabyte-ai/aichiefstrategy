# AI Chief Strategy — aichiefstrategy.com

Fractional Chief AI Officer landing site. An OMEGABYTE.AI property.

**Live:** [aichiefstrategy.com](https://aichiefstrategy.com)  
**Owner:** Shawn Panchacharam — shawn@shawnp.com  
**Version:** v0.9 (MVP)

---

## Stack

- Static HTML/CSS — no framework, no build step
- Deployed on Vercel
- Custom domain via Cloudflare registrar → Vercel DNS

## Structure

```
/
├── index.html          # Full single-page site
├── assets/
│   └── omegabyte-logo.png
├── vercel.json
├── .gitignore
└── README.md
```

## Deployment

Connected to Vercel via GitHub. Every push to `main` triggers an auto-deploy.

Custom domain: `aichiefstrategy.com` → Vercel nameservers or CNAME.

## Versions

| Version | Notes |
|---------|-------|
| v0.9 | MVP — hero, services table, about, lead magnet, CTA. Static, no form backend yet. |

## Roadmap (post-MVP)

- [ ] Wire lead magnet form to email capture (Resend or ConvertKit)
- [ ] Add Calendly embed for discovery call booking
- [ ] Analytics (Plausible or Fathom — privacy-first)
- [ ] SEO meta + OG tags
- [ ] Register yourcaio.ai and point to same build
