'use strict';
// Interface strings in English and Marathi. Long-form page content lives in
// content/*.js; editable clinic/doctor details live in the content store.

const ui = {
  en: {
    langName: 'English',
    skip: 'Skip to main content',
    nav_home: 'Home', nav_about: 'About', nav_cataract: 'Cataract Surgery', nav_eyecare: 'Eye Care',
    nav_faqs: 'FAQs', nav_articles: 'Articles', nav_clinics: 'Clinics & Timings', nav_contact: 'Contact',
    nav_book: 'Book Appointment', menu: 'Menu', close: 'Close',
    switch_lang: 'मराठी', switch_lang_label: 'वेबसाइट मराठीत पहा (View in Marathi)',
    call: 'Call', whatsapp: 'WhatsApp', book: 'Book',
    bar_call_label: 'Call a clinic for an appointment',
    call_which: 'Which clinic would you like to call?',
    call_srv: 'Call SRV Hospital for Appointment', call_jc: 'Call Just Care for Appointment',
    call_srv_short: 'Call SRV Hospital', call_jc_short: 'Call Just Care Clinic',
    wa_jc: 'Book via WhatsApp', wa_jc_short: 'WhatsApp Just Care',
    directions: 'Get directions (Google Maps)',
    opd: 'OPD timings', appointment_no: 'Appointment number', landline: 'landline', mobile: 'mobile',
    years_exp: 'Years of Clinical Experience', approx_surgeries: 'Phaco Cataract Surgeries (approximately)',
    approx: 'Approx.',
    book_consult: 'Book an Eye Consultation', learn_cataract: 'Learn About Cataract Surgery',
    book_cataract_eval: 'Book a Cataract Evaluation', book_cataract_consult: 'Book a Cataract Consultation',
    read_profile: "Read Dr. Deshpande's Profile", see_all_faqs: 'See all FAQs', read_more: 'Read more',
    view_clinics: 'Clinic locations and timings',
    footer_quick: 'Quick links', footer_clinics: 'Clinics', footer_legal: 'Information',
    privacy: 'Privacy Policy', disclaimer: 'Medical Disclaimer', admin_login: 'Staff login',
    footer_note: 'Information on this website is for general education and does not replace an eye examination.',
    emergency_title: 'Eye emergency?',
    emergency_text: 'For sudden loss of vision, severe eye pain, a chemical splash or a curtain-like shadow over your vision, go to the nearest hospital emergency department immediately. Do not wait for an online appointment.',
    preview_banner: 'Preview for review by Dr. Deshpande. Not yet published. Content marked "to be confirmed" will be checked before launch.',
    to_confirm: 'To be confirmed',
    no_js_note: '',
    // Booking
    book_title: 'Book an Appointment',
    book_intro: 'Choose a clinic, then call, WhatsApp, or send an online appointment request. Online requests are confirmed by the clinic by phone or WhatsApp.',
    step: 'Step', step1: 'Select a clinic', step2: 'Choose how to book', step3: 'Online appointment request', step4: 'Confirmation',
    choose_clinic: 'Choose this clinic', change_clinic: 'Change clinic', selected_clinic: 'Selected clinic',
    online_request: 'Send an online appointment request',
    f_name: "Patient's full name", f_mobile: 'Mobile number', f_mobile_hint: '10-digit Indian mobile number, for example 98XXXXXXXX',
    f_clinic: 'Preferred clinic', f_date: 'Preferred date', f_date_hint: 'Sunday appointments are not available.',
    f_time: 'Preferred time', f_time_choose: 'Choose a time', f_reason: 'Reason for consultation', f_reason_choose: 'Choose a reason',
    f_lang: 'Preferred language for the call', f_msg: 'Message (optional)', f_msg_hint: 'Please do not include detailed medical history or reports.',
    f_consent: 'I agree that the clinic may use these details to contact me about this appointment, as described in the Privacy Policy.',
    f_required: 'required', f_submit: 'Send Appointment Request', f_sending: 'Sending…',
    f_errors_title: 'Please correct the following:',
    slots_loading: 'Checking available times…', slots_none: 'No times are available on this date. Please choose another date.',
    slot_full: 'full',
    reasons: {
      cataract: 'Cataract evaluation or surgery advice', checkup: 'Routine eye check-up', blurred: 'Blurred or changing vision',
      diabetes: 'Diabetic eye check', glaucoma: 'Glaucoma check', dry: 'Dry or irritated eyes', red: 'Red or painful eye',
      followup: 'Follow-up after surgery or treatment', other: 'Other'
    },
    langs: { en: 'English', mr: 'Marathi', hi: 'Hindi' },
    // Validation
    err: {
      name: "Please enter the patient's full name (at least 2 letters).",
      mobile: 'Please enter a valid 10-digit Indian mobile number.',
      clinic: 'Please choose a clinic.',
      date: 'Please choose a valid date.',
      date_past: 'This date has passed. Please choose a future date.',
      date_far: 'Requests can be made up to {days} days ahead. Please choose an earlier date.',
      date_closed: 'This clinic does not hold OPD on this day. Please choose another date.',
      date_holiday: 'The clinic is closed on this date ({note}). Please choose another date.',
      time: 'Please choose a time within the OPD hours.',
      time_past: 'This time has already passed or is too soon. Please choose a later time.',
      slot_full: 'This time is fully requested. Please choose another time.',
      reason: 'Please choose a reason for consultation.',
      lang: 'Please choose a preferred language.',
      message: 'Your message is too long (maximum 500 characters).',
      consent: 'Please tick the box to agree to be contacted about this appointment.',
      duplicate: 'A request for this mobile number already exists at this clinic on this date. Please call the clinic if you need to change it.',
      too_many: 'There are already several open requests for this mobile number. Please call the clinic.',
      rate: 'Too many attempts. Please wait a few minutes or call the clinic.',
      server: 'Something went wrong. Please try again, or call the clinic.',
      not_found: 'We could not find a request with these details.',
      ref: 'Please enter your request reference.'
    },
    // Confirmation & status
    req_received: 'Appointment request received',
    req_received_text: 'Thank you. Your request has been received but is not yet confirmed. The clinic will contact you by phone or WhatsApp to confirm a time.',
    req_ref: 'Request reference', req_keep: 'Please keep this reference. You can use it to check the status of your request.',
    status_title: 'Check Appointment Status', status_intro: 'Enter your request reference and mobile number.',
    status_check: 'Check Status', status_label: 'Status',
    status: {
      requested: 'Request received – awaiting confirmation',
      confirmed: 'Appointment confirmed',
      rescheduled: 'Appointment rescheduled',
      cancelled: 'Appointment cancelled',
      completed: 'Visit completed'
    },
    status_help: {
      requested: 'The clinic has not confirmed this time yet. They will call or WhatsApp you.',
      confirmed: 'The clinic has confirmed your appointment for the date and time below.',
      rescheduled: 'The clinic has moved your appointment to the new date and time shown below.',
      cancelled: 'This appointment is cancelled. Please book again or call the clinic if you still need a consultation.',
      completed: 'This visit has been completed.'
    },
    date: 'Date', time: 'Time', clinic: 'Clinic', requested_for: 'Requested for', confirmed_for: 'Confirmed for',
    urgent_note: 'If your problem is urgent, please call the clinic directly instead of waiting for confirmation.',
    // Contact
    contact_title: 'Contact Us', contact_send: 'Send Message', enquiry_thanks: 'Thank you. Your message has been received. The clinic will reply by phone.',
    email: 'Email', email_placeholder: 'Email address to be added',
    // FAQ
    faq_search: 'Search the FAQs', faq_search_ph: 'Type a word, e.g. cataract, diabetes, red eye', faq_all: 'All topics',
    faq_none: 'No questions match your search.', faq_more: 'Detailed explanation', faq_related: 'Related questions',
    faq_book: 'Book a consultation to discuss this', faq_count: '{n} questions',
    faq_review_note: 'These answers are general information reviewed for patients. They cannot diagnose your condition.',
    // misc
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    not_found_title: 'Page not found', not_found_text: 'Sorry, we could not find that page.', back_home: 'Go to the home page'
  },
  mr: {
    langName: 'मराठी',
    skip: 'मुख्य मजकुराकडे जा',
    nav_home: 'मुख्यपृष्ठ', nav_about: 'डॉक्टरांविषयी', nav_cataract: 'मोतीबिंदू शस्त्रक्रिया', nav_eyecare: 'नेत्रसेवा',
    nav_faqs: 'प्रश्नोत्तरे', nav_articles: 'माहितीपर लेख', nav_clinics: 'क्लिनिक व वेळा', nav_contact: 'संपर्क',
    nav_book: 'भेटीची वेळ ठरवा', menu: 'मेनू', close: 'बंद करा',
    switch_lang: 'English', switch_lang_label: 'View this website in English (इंग्रजीत पहा)',
    call: 'कॉल', whatsapp: 'व्हॉट्सॲप', book: 'भेट ठरवा',
    bar_call_label: 'भेटीसाठी क्लिनिकला कॉल करा',
    call_which: 'कोणत्या क्लिनिकला कॉल करायचा आहे?',
    call_srv: 'भेटीसाठी एसआरव्ही हॉस्पिटलला कॉल करा', call_jc: 'भेटीसाठी जस्ट केअरला कॉल करा',
    call_srv_short: 'एसआरव्ही हॉस्पिटलला कॉल करा', call_jc_short: 'जस्ट केअर क्लिनिकला कॉल करा',
    wa_jc: 'व्हॉट्सॲपवर भेट ठरवा', wa_jc_short: 'जस्ट केअरला व्हॉट्सॲप करा',
    directions: 'मार्ग पहा (गूगल मॅप्स)',
    opd: 'ओपीडी वेळ', appointment_no: 'भेटीसाठी क्रमांक', landline: 'लँडलाइन', mobile: 'मोबाइल',
    years_exp: 'वर्षांचा वैद्यकीय अनुभव', approx_surgeries: 'फॅको मोतीबिंदू शस्त्रक्रिया (सुमारे)',
    approx: 'सुमारे',
    book_consult: 'नेत्रतपासणीसाठी भेट ठरवा', learn_cataract: 'मोतीबिंदू शस्त्रक्रियेविषयी जाणून घ्या',
    book_cataract_eval: 'मोतीबिंदू तपासणीसाठी भेट ठरवा', book_cataract_consult: 'मोतीबिंदू सल्ल्यासाठी भेट ठरवा',
    read_profile: 'डॉ. देशपांडे यांचा परिचय वाचा', see_all_faqs: 'सर्व प्रश्नोत्तरे पहा', read_more: 'अधिक वाचा',
    view_clinics: 'क्लिनिकचे पत्ते व वेळा',
    footer_quick: 'महत्त्वाचे दुवे', footer_clinics: 'क्लिनिक', footer_legal: 'माहिती',
    privacy: 'गोपनीयता धोरण', disclaimer: 'वैद्यकीय अस्वीकरण', admin_login: 'कर्मचारी लॉगिन',
    footer_note: 'या वेबसाइटवरील माहिती सर्वसाधारण शिक्षणासाठी आहे. ती डोळ्यांच्या प्रत्यक्ष तपासणीला पर्याय नाही.',
    emergency_title: 'डोळ्यांची तातडीची समस्या?',
    emergency_text: 'अचानक दृष्टी जाणे, डोळ्यात तीव्र वेदना, डोळ्यात रसायन जाणे किंवा दृष्टीवर पडद्यासारखी सावली येणे असे झाल्यास त्वरित जवळच्या रुग्णालयाच्या आपत्कालीन विभागात जा. ऑनलाइन भेटीची वाट पाहू नका.',
    preview_banner: 'डॉ. देशपांडे यांच्या पुनरावलोकनासाठी पूर्वदर्शन. अद्याप प्रकाशित नाही. "निश्चित करायचे" असे चिन्हांकित मजकूर प्रकाशनापूर्वी तपासला जाईल.',
    to_confirm: 'निश्चित करायचे',
    no_js_note: '',
    book_title: 'भेटीची वेळ ठरवा',
    book_intro: 'क्लिनिक निवडा, नंतर कॉल करा, व्हॉट्सॲप करा किंवा ऑनलाइन विनंती पाठवा. ऑनलाइन विनंतीची निश्चिती क्लिनिक फोन किंवा व्हॉट्सॲपद्वारे करेल.',
    step: 'पायरी', step1: 'क्लिनिक निवडा', step2: 'भेट कशी ठरवायची ते निवडा', step3: 'ऑनलाइन भेटीची विनंती', step4: 'पुष्टी',
    choose_clinic: 'हे क्लिनिक निवडा', change_clinic: 'क्लिनिक बदला', selected_clinic: 'निवडलेले क्लिनिक',
    online_request: 'ऑनलाइन भेटीची विनंती पाठवा',
    f_name: 'रुग्णाचे पूर्ण नाव', f_mobile: 'मोबाइल क्रमांक', f_mobile_hint: '१० अंकी भारतीय मोबाइल क्रमांक, उदा. 98XXXXXXXX',
    f_clinic: 'पसंतीचे क्लिनिक', f_date: 'पसंतीची तारीख', f_date_hint: 'रविवारी भेटी उपलब्ध नाहीत.',
    f_time: 'पसंतीची वेळ', f_time_choose: 'वेळ निवडा', f_reason: 'भेटीचे कारण', f_reason_choose: 'कारण निवडा',
    f_lang: 'फोनवर बोलण्यासाठी पसंतीची भाषा', f_msg: 'संदेश (ऐच्छिक)', f_msg_hint: 'कृपया सविस्तर वैद्यकीय इतिहास किंवा रिपोर्ट येथे लिहू नका.',
    f_consent: 'या भेटीसंदर्भात संपर्क करण्यासाठी क्लिनिक ही माहिती गोपनीयता धोरणानुसार वापरू शकते, याला माझी संमती आहे.',
    f_required: 'आवश्यक', f_submit: 'भेटीची विनंती पाठवा', f_sending: 'पाठवत आहे…',
    f_errors_title: 'कृपया पुढील दुरुस्त्या करा:',
    slots_loading: 'उपलब्ध वेळा तपासत आहे…', slots_none: 'या तारखेला वेळ उपलब्ध नाही. कृपया दुसरी तारीख निवडा.',
    slot_full: 'पूर्ण',
    reasons: {
      cataract: 'मोतीबिंदू तपासणी किंवा शस्त्रक्रियेबाबत सल्ला', checkup: 'नियमित नेत्रतपासणी', blurred: 'धूसर किंवा बदलती दृष्टी',
      diabetes: 'मधुमेहासाठी डोळ्यांची तपासणी', glaucoma: 'काचबिंदू तपासणी', dry: 'कोरडे किंवा जळजळणारे डोळे', red: 'लाल किंवा दुखणारा डोळा',
      followup: 'शस्त्रक्रिया/उपचारानंतर फॉलो-अप', other: 'इतर'
    },
    langs: { en: 'इंग्रजी', mr: 'मराठी', hi: 'हिंदी' },
    err: {
      name: 'कृपया रुग्णाचे पूर्ण नाव लिहा (किमान २ अक्षरे).',
      mobile: 'कृपया योग्य १० अंकी भारतीय मोबाइल क्रमांक लिहा.',
      clinic: 'कृपया क्लिनिक निवडा.',
      date: 'कृपया योग्य तारीख निवडा.',
      date_past: 'ही तारीख उलटून गेली आहे. कृपया पुढची तारीख निवडा.',
      date_far: 'विनंती जास्तीत जास्त {days} दिवस आधी करता येते. कृपया जवळची तारीख निवडा.',
      date_closed: 'या दिवशी या क्लिनिकमध्ये ओपीडी नसते. कृपया दुसरी तारीख निवडा.',
      date_holiday: 'या तारखेला क्लिनिक बंद आहे ({note}). कृपया दुसरी तारीख निवडा.',
      time: 'कृपया ओपीडीच्या वेळेतील वेळ निवडा.',
      time_past: 'ही वेळ उलटून गेली आहे किंवा खूप जवळ आहे. कृपया नंतरची वेळ निवडा.',
      slot_full: 'या वेळेसाठी विनंत्या पूर्ण झाल्या आहेत. कृपया दुसरी वेळ निवडा.',
      reason: 'कृपया भेटीचे कारण निवडा.',
      lang: 'कृपया पसंतीची भाषा निवडा.',
      message: 'संदेश खूप मोठा आहे (जास्तीत जास्त ५०० अक्षरे).',
      consent: 'भेटीसंदर्भात संपर्कासाठी संमती देण्यासाठी कृपया चौकटीत खूण करा.',
      duplicate: 'या मोबाइल क्रमांकासाठी याच दिवशी याच क्लिनिकमध्ये विनंती आधीच आहे. बदल करायचा असल्यास कृपया क्लिनिकला कॉल करा.',
      too_many: 'या मोबाइल क्रमांकासाठी आधीच अनेक विनंत्या प्रलंबित आहेत. कृपया क्लिनिकला कॉल करा.',
      rate: 'खूप वेळा प्रयत्न झाले. कृपया काही मिनिटांनी पुन्हा प्रयत्न करा किंवा क्लिनिकला कॉल करा.',
      server: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा किंवा क्लिनिकला कॉल करा.',
      not_found: 'या माहितीनुसार कोणतीही विनंती सापडली नाही.',
      ref: 'कृपया विनंती संदर्भ क्रमांक लिहा.'
    },
    req_received: 'भेटीची विनंती मिळाली',
    req_received_text: 'धन्यवाद. आपली विनंती मिळाली आहे, पण भेट अद्याप निश्चित झालेली नाही. वेळ निश्चित करण्यासाठी क्लिनिक आपल्याला फोन किंवा व्हॉट्सॲपवर संपर्क करेल.',
    req_ref: 'विनंती संदर्भ क्रमांक', req_keep: 'कृपया हा संदर्भ क्रमांक जपून ठेवा. विनंतीची स्थिती तपासण्यासाठी तो वापरता येईल.',
    status_title: 'भेटीची स्थिती तपासा', status_intro: 'आपला विनंती संदर्भ क्रमांक आणि मोबाइल क्रमांक लिहा.',
    status_check: 'स्थिती तपासा', status_label: 'स्थिती',
    status: {
      requested: 'विनंती मिळाली – निश्चितीची प्रतीक्षा',
      confirmed: 'भेट निश्चित झाली',
      rescheduled: 'भेटीची वेळ बदलली',
      cancelled: 'भेट रद्द झाली',
      completed: 'भेट पूर्ण झाली'
    },
    status_help: {
      requested: 'क्लिनिकने ही वेळ अद्याप निश्चित केलेली नाही. ते आपल्याला कॉल किंवा व्हॉट्सॲप करतील.',
      confirmed: 'खाली दिलेल्या तारखेला व वेळेला आपली भेट क्लिनिकने निश्चित केली आहे.',
      rescheduled: 'क्लिनिकने आपली भेट खाली दिलेल्या नवीन तारखेला व वेळेला हलवली आहे.',
      cancelled: 'ही भेट रद्द झाली आहे. अजूनही तपासणी हवी असल्यास पुन्हा भेट ठरवा किंवा क्लिनिकला कॉल करा.',
      completed: 'ही भेट पूर्ण झाली आहे.'
    },
    date: 'तारीख', time: 'वेळ', clinic: 'क्लिनिक', requested_for: 'विनंती केलेली वेळ', confirmed_for: 'निश्चित वेळ',
    urgent_note: 'समस्या तातडीची असल्यास निश्चितीची वाट न पाहता थेट क्लिनिकला कॉल करा.',
    contact_title: 'संपर्क', contact_send: 'संदेश पाठवा', enquiry_thanks: 'धन्यवाद. आपला संदेश मिळाला आहे. क्लिनिक फोनवर उत्तर देईल.',
    email: 'ईमेल', email_placeholder: 'ईमेल पत्ता लवकरच दिला जाईल',
    faq_search: 'प्रश्नोत्तरे शोधा', faq_search_ph: 'शब्द लिहा, उदा. मोतीबिंदू, मधुमेह, लाल डोळा', faq_all: 'सर्व विषय',
    faq_none: 'आपल्या शोधाशी जुळणारे प्रश्न नाहीत.', faq_more: 'सविस्तर माहिती', faq_related: 'संबंधित प्रश्न',
    faq_book: 'याबाबत चर्चा करण्यासाठी भेट ठरवा', faq_count: '{n} प्रश्न',
    faq_review_note: 'ही उत्तरे रुग्णांसाठी सर्वसाधारण माहिती आहेत. यावरून आपल्या आजाराचे निदान करता येत नाही.',
    months: ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'],
    days: ['रविवार','सोमवार','मंगळवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'],
    not_found_title: 'पृष्ठ सापडले नाही', not_found_text: 'क्षमस्व, हे पृष्ठ सापडले नाही.', back_home: 'मुख्यपृष्ठावर जा'
  }
};

const MR_DIGITS = '०१२३४५६७८९';
function mrNum(s) { return String(s).replace(/[0-9]/g, d => MR_DIGITS[d]); }

function t(lang, key, vars) {
  const parts = key.split('.');
  let v = ui[lang];
  for (const p of parts) v = v && v[p];
  if (v === undefined) { v = ui.en; for (const p of parts) v = v && v[p]; }
  if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? (lang === 'mr' ? mrNum(vars[k]) : vars[k]) : '');
  return v;
}

// Pick the language variant of a bilingual {en, mr} value.
function L(lang, v) {
  if (v == null) return '';
  if (typeof v === 'object' && !Array.isArray(v)) return v[lang] || v.en || '';
  return v;
}

// 24h "18:30" -> "6:30 PM" / "सायं. ६:३०"
function fmtTime(lang, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = ((h + 11) % 12) + 1;
  const mm = String(m).padStart(2, '0');
  if (lang === 'mr') {
    const part = h < 12 ? 'सकाळी' : h < 16 ? 'दुपारी' : h < 19 ? 'सायंकाळी' : 'रात्री';
    return part + ' ' + mrNum(h12 + ':' + mm);
  }
  return h12 + ':' + mm + ' ' + (h < 12 ? 'AM' : 'PM');
}

function fmtDate(lang, iso) {
  const [y, mo, d] = iso.split('-').map(Number);
  const dow = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  const s = t(lang, 'days')[dow] + ', ' + d + ' ' + t(lang, 'months')[mo - 1] + ' ' + y;
  return lang === 'mr' ? mrNum(s) : s;
}

module.exports = { ui, t, L, mrNum, fmtTime, fmtDate };
