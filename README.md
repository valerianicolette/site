# valeriamera.com

Source for [valeriamera.com](https://valeriamera.com), hosted on GitHub Pages.
Pages are plain HTML; the parts shared by every page (head, nav, footer, colors)
are pulled in by Jekyll, which GitHub Pages runs automatically on every push.
There is nothing to build before committing.

## Where things live

| Want to change... | Edit |
|---|---|
| Page names, order in the menu, page colors, favicons, counter emoji | `_data/pages.yml` |
| Site-wide text (footer, disclaimer, email, social links), background gradient, base colors, fonts, analytics id | `_config.yml` |
| The nav bar or mobile menu | `_includes/nav.html` |
| The footer | `_includes/footer.html` |
| The `<head>`, fonts, Tailwind config, anything wrapped around every page | `_layouts/default.html` |
| Styles used on every page (nav, links, animations, footer) | `assets/css/site.css` |
| Styles for one page only | `assets/css/<page>.css` |
| Shared JavaScript (menu, fade-ins, counter) | `assets/js/site.js` |
| The content of a page | `<page>.html` (below the `---` block) |

### Colors

Each page has an accent color in `_data/pages.yml`. Inside a page you can use it as:

- Tailwind classes: `text-theme`, `bg-theme`, `border-theme` (current page) or
  `text-exp`, `bg-story/90`, `border-contact` (a specific page)
- CSS: `var(--accent)`, `var(--accent-light)`, `var(--accent-dark)` (current page) or
  `var(--c-exp)`, `var(--c-story)` ... (a specific page)

## Adding a page

1. Copy an existing page, e.g. `contact.html`, and change the front matter at the top:

   ```yaml
   ---
   layout: default
   title: My New Page
   page_key: contact      # which color/favicon set to use (a key from _data/pages.yml)
   description: One sentence for search engines and link previews.
   css: contact           # optional: loads assets/css/contact.css
   ---
   ```

2. To give it its own color and a spot in the menu, add an entry to `_data/pages.yml`.

## Previewing locally

Opening the HTML files directly no longer works (the layout has to be applied).
Run the preview server instead:

```bash
npm install     # once
npm run preview # then open http://localhost:4000
```

`npm run build` writes the fully rendered site to `_site/` if you ever want to inspect it.

## Visitor counter

The badge in the footer uses [Abacus](https://abacus.jasoncameron.dev), a free counter
API that needs no account. It counts one visit per browser session, site-wide, and hides
itself if the service is unreachable. The namespace is `counter_namespace` in `_config.yml`.

## Notes

- `paris/` holds the original full-size photos and is ignored by git.
- `about.html` and `mylife.html` are redirects kept so old links still work.
