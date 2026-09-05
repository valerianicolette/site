# valeriamera.com

Source for [valeriamera.com](https://valeriamera.com), hosted on GitHub Pages.

Every page is a plain HTML file: **double-click it to preview, edit, push.**
The parts shared by every page (menu, footer, colors, fonts, analytics) are
loaded from two small JavaScript files, so you change them once.

## Where things live

| Want to change... | Edit |
|---|---|
| Page names, menu order, page colors, favicons, counter emoji | `assets/js/config.js` (the `pages` list) |
| Site-wide text (footer, disclaimer, email, social links), background, base colors, fonts, analytics id | `assets/js/config.js` |
| The nav bar, mobile menu, or footer markup | `assets/js/layout.js` |
| Styles used on every page (nav, links, animations, footer) | `assets/css/site.css` |
| Styles for one page only | `assets/css/<page>.css` |
| Shared behaviour (menu, fade-ins, visitor counter) | `assets/js/site.js` |
| The content of a page | `<page>.html`, inside `<main>` |

### Colors

Each page has an accent color in `assets/js/config.js`. Inside a page you can use it as:

- Tailwind classes: `text-theme`, `bg-theme`, `border-theme` (current page) or
  `text-exp`, `bg-story/90`, `border-contact` (a specific page); `text-ink` / `text-ink-muted` for body text
- CSS: `var(--accent)`, `var(--accent-light)`, `var(--accent-dark)` (current page) or
  `var(--c-exp)`, `var(--c-story)` ... (a specific page)

## Adding a page

1. Copy an existing page, e.g. `contact.html`.
2. In the copy, change `data-page="contact"` on the `<html>` tag to the key of the color set
   you want, and update the `<title>`, description, canonical, and `og:` tags at the top.
3. To give it its own color and a spot in the menu, add an entry to `pages` in `assets/js/config.js`.
4. Add it to `sitemap.xml`.

## Visitor counter

The badge in the footer uses [Abacus](https://abacus.jasoncameron.dev), a free counter API
that needs no account. It counts one visit per browser session, site-wide, and hides itself
if the service is unreachable. The namespace is `counterNamespace` in `assets/js/config.js`.
(When previewing a file from your computer the badge may stay hidden; it works on the live site.)

## Notes

- `paris/` holds the original full-size photos and is ignored by git; the site uses the copies on WordPress.
- `about.html` and `mylife.html` are redirects kept so old links still work.
- `.nojekyll` tells GitHub Pages to publish the files exactly as they are.
