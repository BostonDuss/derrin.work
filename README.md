# derrin.work

Static portfolio site. No build step, no dependencies, no framework — plain HTML, one stylesheet, one small script. Every page is prerendered; the diagrams are real SVG and the cell grids are real markup, generated at build time rather than drawn by JavaScript in the browser.

## Deploying to GitHub Pages

1. Create a repository and push the contents of this folder to the branch root (not inside a subfolder).
2. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. For the custom domain, Settings → Pages → Custom domain → `derrin.work`, then at your registrar add:
   - Four `A` records for the apex pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` for `www` pointing at `<username>.github.io`
4. Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

Links are relative, so the site also works unchanged at `username.github.io/repo-name/` if you skip the custom domain.

`.nojekyll` is present so GitHub serves the files as-is.

## Keeping it off search engines

Two layers, both already in place:

- `robots.txt` disallows all crawlers.
- Every page carries `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">`.

**This hides the site; it does not protect it.** GitHub Pages is publicly readable, and anyone with the URL can open it. If you need real access control, put Cloudflare free in front of the domain and add a Cloudflare Access policy (Zero Trust → Access → Applications) restricting it to named email addresses. Visitors then get a one-time code by email before the site loads. That is the only way to actually gate a Pages site.

## Structure

```
index.html                            cover: hero, about, work tiles, what's next, credentials, contact
releases-and-launches/                ServiceNow release train
design-system-migration/              250+ pages, 13 locales
good-ideas-shop/                      Meta storefront activation
helmets-for-habitat/                  Fallout 76 charity activation, 14-photo lookbook
content-development-framework/        NAR swimlane framework
whats-next/                           essay
404.html                              served by Pages on unknown URLs
assets/site.css                       all styling
assets/site.js                        parallax, mobile menu, video, lookbook
images/                               photography and screenshots
Derrin-Andrade-Resume.pdf             linked from every "Download resume" button
share-card.png                        Open Graph preview image
```

## Editing

Copy lives directly in the HTML. Styling is inline on elements, matching the design source; shared chrome (header, nav, buttons) and all hover states are in `assets/site.css`.

`_build.js` regenerates every page from the design file `derrin.work hero-tiles.dc.html`. You do not need it to edit the site — it exists so the design source and the published site can be kept in sync. If you hand this to a developer, they can ignore it and treat the HTML as the source of truth.

## Known items

- **Press photos — permission outstanding.** The three press images on the Good Ideas Shop page (`images/press-geekwire-*.jpeg`) are GeekWire's copyrighted photographs, credited to GeekWire Photo / Kurt Schlosser. They are now self-hosted and committed to this repository, meaning they are redistributed from our own domain rather than embedded from theirs. Written permission from GeekWire's reprints desk (linked in the article footer) should be confirmed. If it is declined, either revert to hot-linking their URLs or remove the cards.
- **Page weight.** The design system migration page is large (~440KB of HTML) because the scale diagram is thousands of real elements. It gzips to a fraction of that; most hosts including Pages compress automatically.
- **Images are uncompressed.** Running them through Squoosh or `cwebp` would cut total page weight substantially with no visible loss.
- **Scroll animations** use CSS `animation-timeline: view()`. Browsers without support (Safari before 26) show all content, just without the entrance motion. Nothing is hidden.
