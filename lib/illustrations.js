'use strict';
// Non-graphic educational illustrations as inline SVG with bilingual labels.

const L = (lang, en, mr) => (lang === 'mr' ? mr : en);

function eyeDiagram(lang, cloudy) {
  const title = cloudy
    ? L(lang, 'Diagram of an eye with a cataract: the natural lens is cloudy, so light is scattered before it reaches the retina.', 'मोतीबिंदू असलेल्या डोळ्याची आकृती: नैसर्गिक भिंग धूसर झाल्याने प्रकाश पडद्यापर्यंत पोहोचण्यापूर्वी विखुरतो.')
    : L(lang, 'Diagram of a healthy eye: light passes through the cornea and the clear lens and is focused on the retina.', 'निरोगी डोळ्याची आकृती: प्रकाश कॉर्निया व पारदर्शक भिंगातून जाऊन पडद्यावर केंद्रित होतो.');
  const id = cloudy ? 'eye-c' : 'eye-h';
  return `<figure class="illus">
<svg viewBox="0 0 520 300" role="img" aria-labelledby="${id}-t">
<title id="${id}-t">${title}</title>
<defs><radialGradient id="${id}-lens" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${cloudy ? '#e9e4d6' : '#eaf7f7'}"/><stop offset="1" stop-color="${cloudy ? '#bfb7a3' : '#bfe6e5'}"/></radialGradient></defs>
<g fill="none" stroke-linecap="round">
  ${cloudy
    ? '<path d="M20 120 L150 140 M20 150 L150 150 M20 180 L150 160" stroke="#e0a83a" stroke-width="2.5"/><path d="M190 140 L250 110 M190 150 L260 165 M190 160 L240 200 M190 150 L265 135" stroke="#e0a83a" stroke-width="2" stroke-dasharray="5 6" opacity=".8"/>'
    : '<path d="M20 120 L150 140 L392 150 M20 150 L392 150 M20 180 L150 160 L392 150" stroke="#e0a83a" stroke-width="2.5"/>'}
  <circle cx="270" cy="150" r="125" fill="#ffffff" stroke="#0b5d63" stroke-width="3"/>
  <path d="M378 90 A125 125 0 0 1 378 210" stroke="#7aa895" stroke-width="9"/>
  <path d="M392 135 L470 128 L470 172 L392 165" fill="#f3efe6" stroke="#0b5d63" stroke-width="3"/>
  <path d="M152 105 Q118 150 152 195" fill="#e6f6f6" stroke="#0b5d63" stroke-width="3"/>
  <path d="M165 92 L165 132 M165 168 L165 208" stroke="#2c7a7b" stroke-width="7"/>
  <ellipse cx="190" cy="150" rx="20" ry="38" fill="url(#${id}-lens)" stroke="#0b5d63" stroke-width="2.5"/>
  ${cloudy ? '<g fill="#a69c86" opacity=".7"><circle cx="186" cy="138" r="4"/><circle cx="195" cy="155" r="5"/><circle cx="184" cy="166" r="3.5"/><circle cx="196" cy="133" r="3"/></g>' : ''}
</g>
<g font-family="inherit" font-size="15" fill="#1f2a2e">
  <path d="M135 120 L95 60" stroke="#6b7a80"/><text x="40" y="52">${L(lang, 'Cornea', 'कॉर्निया')}</text>
  <path d="M165 95 L165 40" stroke="#6b7a80"/><text x="140" y="32">${L(lang, 'Iris', 'बुबुळ')}</text>
  <path d="M195 190 L205 265" stroke="#6b7a80"/><text x="150" y="285">${cloudy ? L(lang, 'Cloudy lens (cataract)', 'धूसर भिंग (मोतीबिंदू)') : L(lang, 'Clear natural lens', 'पारदर्शक नैसर्गिक भिंग')}</text>
  <path d="M388 110 L430 60" stroke="#6b7a80"/><text x="400" y="52">${L(lang, 'Retina', 'पडदा (रेटिना)')}</text>
  <path d="M450 172 L465 230" stroke="#6b7a80"/><text x="400" y="250">${L(lang, 'Optic nerve', 'दृष्टिनस')}</text>
</g>
</svg>
<figcaption>${cloudy ? L(lang, 'With a cataract, the cloudy lens scatters light, so vision becomes blurred and glary.', 'मोतीबिंदूमध्ये धूसर भिंग प्रकाश विखुरते, त्यामुळे दृष्टी धूसर व चकाकणारी होते.') : L(lang, 'In a healthy eye, the clear lens focuses light sharply on the retina.', 'निरोगी डोळ्यात पारदर्शक भिंग प्रकाश पडद्यावर स्पष्टपणे केंद्रित करते.')}</figcaption>
</figure>`;
}

function phacoSteps(lang, steps) {
  const panel = (i, inner) => `<g transform="translate(${i * 190},0)">
<rect x="5" y="5" width="175" height="175" rx="16" fill="#f4fbfb" stroke="#cfe8e7"/>
<circle cx="92" cy="92" r="62" fill="#fff" stroke="#0b5d63" stroke-width="2.5"/>
<circle cx="92" cy="92" r="40" fill="none" stroke="#2c7a7b" stroke-width="6" opacity=".55"/>
${inner}
<circle cx="24" cy="24" r="13" fill="#0b5d63"/><text x="24" y="29" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${lang === 'mr' ? '०१२३४'[i + 1] : i + 1}</text>
</g>`;
  const lens = '<circle cx="92" cy="92" r="30" fill="#d9d3c3" stroke="#a69c86" stroke-width="1.5"/>';
  const svg = `<svg viewBox="0 0 760 185" role="img" aria-labelledby="phaco-t">
<title id="phaco-t">${L(lang, 'Four steps of phacoemulsification cataract surgery, viewed from the front of the eye.', 'फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रियेच्या चार पायऱ्या, डोळ्याच्या पुढील बाजूने पाहिलेल्या.')}</title>
${panel(0, lens + '<path d="M142 58 L156 50" stroke="#e07a3a" stroke-width="4" stroke-linecap="round"/><path d="M146 62 A62 62 0 0 0 152 70" stroke="#e07a3a" stroke-width="3" fill="none"/>')}
${panel(1, lens + '<circle cx="92" cy="92" r="20" fill="none" stroke="#e07a3a" stroke-width="2.5" stroke-dasharray="4 3"/>')}
${panel(2, '<g fill="#d9d3c3" stroke="#a69c86"><path d="M92 92 L92 64 A28 28 0 0 1 116 78 Z"/><path d="M92 92 L120 96 A28 28 0 0 1 100 119 Z"/><path d="M90 94 L84 120 A28 28 0 0 1 64 98 Z"/></g><path d="M160 46 L106 86" stroke="#0b5d63" stroke-width="5" stroke-linecap="round"/><path d="M100 78 q-6 -6 0 -12 M96 90 q-8 0 -8 -8" stroke="#2c7a7b" fill="none"/>')}
${panel(3, '<ellipse cx="92" cy="92" rx="26" ry="26" fill="#e6f6f6" stroke="#0b5d63" stroke-width="2"/><path d="M70 75 C40 60 45 40 60 38 M114 109 C144 124 139 144 124 146" stroke="#0b5d63" stroke-width="2.5" fill="none" stroke-linecap="round"/>')}
</svg>`;
  return `<figure class="illus illus--wide">${svg}<figcaption><ol class="steps-caption">${steps.map(s => '<li>' + (lang === 'mr' ? s.mr : s.en) + '</li>').join('')}</ol></figcaption></figure>`;
}

function iolTypes(lang) {
  const item = (x, label, rings, toric) => `<g transform="translate(${x},0)">
<path d="M60 40 C20 20 25 0 45 2 M60 120 C100 140 95 160 75 158" stroke="#0b5d63" stroke-width="3" fill="none" stroke-linecap="round"/>
<circle cx="60" cy="80" r="38" fill="#e6f6f6" stroke="#0b5d63" stroke-width="2.5"/>
${rings ? [28, 19, 10].map(r => `<circle cx="60" cy="80" r="${r}" fill="none" stroke="#2c7a7b" stroke-width="1.2"/>`).join('') : ''}
${toric ? '<path d="M28 80 h6 M86 80 h6" stroke="#e07a3a" stroke-width="3"/>' : ''}
<text x="60" y="185" text-anchor="middle" font-size="15" fill="#1f2a2e">${label}</text></g>`;
  return `<figure class="illus illus--iol"><svg viewBox="0 0 480 200" role="img" aria-labelledby="iol-t">
<title id="iol-t">${L(lang, 'Illustration of three types of intraocular lens: monofocal, toric and multifocal.', 'कृत्रिम भिंगाच्या तीन प्रकारांची आकृती: मोनोफोकल, टॉरिक आणि मल्टिफोकल.')}</title>
${item(20, L(lang, 'Monofocal', 'मोनोफोकल'))}${item(180, L(lang, 'Toric', 'टॉरिक'), false, true)}${item(340, L(lang, 'Multifocal', 'मल्टिफोकल'), true)}
</svg><figcaption>${L(lang, 'Artificial lenses are small, foldable and stay in the eye permanently. Markings show the astigmatism axis on toric lenses.', 'कृत्रिम भिंगे लहान, घडी करता येणारी असतात आणि डोळ्यात कायमची राहतात. टॉरिक भिंगावरील खुणा सिलिंड्रिकल नंबरची दिशा दाखवतात.')}</figcaption></figure>`;
}

module.exports = { eyeDiagram, phacoSteps, iolTypes };
