import { useEffect } from 'react';

const SITE_URL = 'https://www.littledream.cm';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

function upsertMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function useDocumentMeta({ title, description, path = '', image = OG_IMAGE }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Little Dream`
      : 'Little Dream | Association pour la jeunesse au Cameroun';

    document.title = fullTitle;

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);

    const url = `${SITE_URL}${path || ''}`;
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertLink('canonical', url);

    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, path, image]);
}
