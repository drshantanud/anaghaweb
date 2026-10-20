'use strict';
// Inline SVG icons (stroke-based, inherit currentColor). Decorative: aria-hidden.

const paths = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  whatsapp: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 7.9 19.5L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.2-1.8-1-1 .7a4 4 0 0 1-2.4-2.4l.7-1-1-1.8L9 9.5z"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18M8 14h2M14 14h2M8 17.5h2"/>',
  eye: '<path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.5"/>',
  lens: '<ellipse cx="12" cy="12" rx="5" ry="9"/><path d="M12 3c-2 3-2 15 0 18"/>',
  phaco: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M3.5 20.5l5.7-5.7"/>',
  award: '<circle cx="12" cy="8.5" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  glasses: '<circle cx="6.5" cy="14.5" r="4"/><circle cx="17.5" cy="14.5" r="4"/><path d="M10.5 14.5h3M2.5 14.5L4 7M21.5 14.5L20 7"/>',
  drop: '<path d="M12 2.7S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.7 12 2.7z"/>',
  droplets: '<path d="M7 16.3c2.2 0 4-1.8 4-4 0-1.2-.6-2.3-1.8-3.3S7.2 6.7 7 5.3c-.3 1.4-1.1 2.8-2.2 3.7S3 11.1 3 12.3c0 2.2 1.8 4 4 4z"/><path d="M12.6 6.6A11 11 0 0 0 14 3.5c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 0 1-12.2 4.6"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  child: '<circle cx="12" cy="5" r="2.5"/><path d="M9 21v-6H7l2-6.5h6L17 15h-2v6"/>',
  retina: '<circle cx="12" cy="12" r="9.5"/><circle cx="15.5" cy="11" r="1.8"/><path d="M14 10C11 8 7 8.5 4.5 10M14 12.2c-3 2-7 2-9.5.5"/>',
  hospital: '<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.5 2.6 3.8 6 3.8 9.5S14.5 18.9 12 21.5c-2.5-2.6-3.8-6-3.8-9.5S9.5 5.1 12 2.5z"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.5-4.5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6l9 7 9-7"/>'
};

function icon(name, cls = 'icon') {
  return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (paths[name] || '') + '</svg>';
}

module.exports = { icon };
