// ─── Listily Site Configuration ─────────────────────────────────
// Edit this file to customise your site without touching code.
// Footer social links read from SOCIAL_CONFIG.
// To activate a social link, replace # with your full URL.
// ────────────────────────────────────────────────────────────────

const SOCIAL_CONFIG = {
  facebook:  '#',  // e.g. 'https://www.facebook.com/listily.au'
  instagram: '#',  // e.g. 'https://www.instagram.com/listily.au'
  linkedin:  '#',  // e.g. 'https://www.linkedin.com/company/listily'
  twitter:   '',   // leave empty to hide
  youtube:   '',   // leave empty to hide
  tiktok:    '',   // leave empty to hide
};

// Site-wide settings
const SITE_CONFIG = {
  siteName:    'Listily.au',
  tagline:     'Your local community directory',
  contactEmail: 'hello@listily.com.au',
  reportEmail:  'report@listily.com.au',

  // Optional: embed a Facebook page feed on the homepage (later)
  facebookPageEmbed: '',   // e.g. 'https://www.facebook.com/listily.au'
  instagramHandle:   '',   // e.g. 'listily.au' for future Instagram embed
};

// ── Apply social links to all [data-social] elements ────────────
(function applySocialLinks() {
  function apply() {
    document.querySelectorAll('[data-social]').forEach(el => {
      const platform = el.dataset.social;
      const url = SOCIAL_CONFIG[platform];
      if (url && url !== '#' && url !== '') {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.style.display = '';
      } else if (url === '' ) {
        // Empty string = hide
        el.style.display = 'none';
      }
      // '#' = placeholder, keep visible but inactive
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
