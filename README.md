# Jianzhi Leng — Research & Beyond

A modern, responsive academic website built with **plain HTML, CSS and JavaScript**. No Node.js, database, subscription, build tools, or paid hosting required.

## Preview on your computer

- Quick preview: double-click `index.html`.
- Recommended: in this folder, run `python -m http.server 8000`, then open `http://localhost:8000`.

## Publish with GitHub Pages (free)

1. Create a GitHub account (or sign into yours).
2. Create a **public** repository named `YOUR_USERNAME.github.io`.
3. Upload **all the contents of this folder**, including `index.html`, `data.js`, `script.js`, `styles.css`, `assets/`, and `.nojekyll`, to the repository root. Do not upload the parent folder as an extra nested layer.
4. In the repository, go to **Settings → Pages → Build and deployment**.
5. Choose **Deploy from a branch**, then branch **main** and folder **/(root)**, and save.
6. Open `https://YOUR_USERNAME.github.io/`. Publishing may require a short deployment period.

Official docs: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Personalize your site

Most changes only require editing **`data.js`**:

- **Publication list**: change `publications` entries: title, authors, venue, year, keywords, and `links` (label + URL). There are real, researched references in the sample data, but check final journal details before going live.
- **Photos**: replace `assets/images/*.jpg` with your own, then edit the `gallery` section with relative paths, titles, descriptions and categories. These original sample images were **AI-generated for demonstration**, not taken by or depicting Jianzhi Leng.
- **CV**: put your CV in `assets/Jianzhi_Leng_CV.pdf` and link to it from the header, hero, or footer by editing `index.html`. No CV is included, so there is no broken download button.
- **Email**: populate `email: ""` in `data.js`. When present, the contact button automatically switches to a working `mailto:` link and shows a copy-email button.
- **Experience**: update `journey` in `data.js`.
- **Introductory copy, research topics, and site name**: update `index.html` directly.
- **Colors and design**: edit CSS variables at the top of `styles.css` (light and dark theme).
- **Profile links**: edit in `data.js` and change footer links in `index.html` if needed.

**Important:** If changing your GitHub username, the website address changes accordingly. You do not need to buy a domain. If you do use a custom domain, configure DNS and the Pages custom-domain setting.

## Features

- Responsive desktop and mobile layouts
- Light/dark mode with device preference and local persistence
- Scroll reveals, decorative network animation, progress indicator, reduced-motion support
- Publication search, status filters and outbound paper links
- Filterable photo wall with keyboard-controlled lightbox (← / → / Esc)
- Editable education/appointment timeline
- Contact fallback that never invents an email address
- Basic SEO metadata, keyboard accessibility, semantic landmarks
- GitHub Pages friendly, `.nojekyll` included

## File structure

```
index.html                  Website structure and written content
styles.css                  All appearance and animations
script.js                   Theme, filters, image viewer, interactions
data.js                     Publications, timeline, photos, contact address
assets/favicon.svg          Brand favicon
assets/images/*.jpg          Six demo gallery photos
.nojekyll                   Static publishing convenience for GitHub Pages
```

## Source verification (November 2026)

- Jianzhi Leng et al., *European Journal of Operational Research*, DOI: https://doi.org/10.1016/j.ejor.2025.07.065
- Mengling Zhang et al., *Omega*, DOI: https://doi.org/10.1016/j.omega.2025.103372
- Jianzhi Leng et al., *Transportation Research Part E* (recently indexed, journal DOI not added because not independently verified). Public preprint: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6681441
- Jianzhi Leng et al., arXiv:2611.04961: https://arxiv.org/abs/2611.04961

## Notes

The fonts use Google Fonts when available, with system-font fallbacks. All gallery images, CSS, and JavaScript are shipped with the website and do **not** require an image hosting service. This is a static website; contact forms, site analytics and content management systems are not included.
