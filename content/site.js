'use strict';
// Default editable content. On first start this is copied into the data store
// (data/content.json); after that, changes are made in the admin dashboard.
// Items marked confirm: true are shown with a "To be confirmed" label in
// preview mode and are listed for Dr. Deshpande to check before launch.

const mapsSearch = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

module.exports = {
  settings: {
    siteLive: false,            // false = preview mode: noindex + review banner
    email: '',                  // placeholder until supplied
    bookingWindowDays: 30,
    minNoticeMinutes: 60,
    maxOpenRequestsPerMobile: 3,
    retentionDays: 365,         // appointment/enquiry records older than this are deleted
    whatsappMessage: {
      en: 'Hello, I would like to book an appointment with Dr. Anagha Deshpande at Just Care Heart & Eye Clinic, Chembur.\nPatient name:\nPreferred date:\nPreferred time:\nReason for consultation:\nPlease let me know the available appointment slots.',
      mr: 'नमस्कार, मला जस्ट केअर हार्ट अँड आय क्लिनिक, चेंबूर येथे डॉ. अनघा देशपांडे यांची भेट घ्यायची आहे.\nरुग्णाचे नाव:\nपसंतीची तारीख:\nपसंतीची वेळ:\nभेटीचे कारण:\nकृपया उपलब्ध वेळा कळवा.'
    }
  },

  doctor: {
    name: { en: 'Dr. Anagha Deshpande', mr: 'डॉ. अनघा देशपांडे' },
    designation: { en: 'Consultant Ophthalmologist', mr: 'कन्सल्टंट नेत्ररोगतज्ज्ञ' },
    qualifications: 'MS (Ophthalmology), DOMS, FCPS (Ophthalmology)',
    qualificationsList: [
      { en: 'MS (Ophthalmology)', mr: 'एमएस (नेत्ररोगशास्त्र)' },
      { en: 'DOMS', mr: 'डीओएमएस' },
      { en: 'FCPS (Ophthalmology)', mr: 'एफसीपीएस (नेत्ररोगशास्त्र)' }
    ],
    experienceYears: 20,
    surgeriesApprox: '10,000',
    experienceStatement: {
      en: 'Experience of approximately 10,000 phacoemulsification cataract surgeries.',
      mr: 'सुमारे १०,००० फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रियांचा अनुभव.'
    },
    bio: {
      en: 'Dr. Anagha Deshpande is a consultant ophthalmologist practising in Chembur, Mumbai. With 20 years of clinical experience and experience of approximately 10,000 phacoemulsification cataract surgeries, her principal clinical interest is cataract evaluation and surgical care.\n\nShe holds postgraduate qualifications in ophthalmology, including MS (Ophthalmology), DOMS and FCPS (Ophthalmology). Her professional background includes experience at established medical institutions in Mumbai.\n\nHer approach emphasises careful assessment, clear communication, patient education and treatment decisions tailored to individual needs.',
      mr: 'डॉ. अनघा देशपांडे या चेंबूर, मुंबई येथे कार्यरत कन्सल्टंट नेत्ररोगतज्ज्ञ आहेत. त्यांना २० वर्षांचा वैद्यकीय अनुभव असून सुमारे १०,००० फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रियांचा अनुभव आहे. मोतीबिंदूची तपासणी आणि शस्त्रक्रियेद्वारे उपचार हा त्यांचा मुख्य वैद्यकीय विषय आहे.\n\nत्यांनी नेत्ररोगशास्त्रातील पदव्युत्तर पात्रता मिळवली आहे: एमएस (नेत्ररोगशास्त्र), डीओएमएस आणि एफसीपीएस (नेत्ररोगशास्त्र). मुंबईतील नामांकित वैद्यकीय संस्थांमध्ये काम केल्याचा अनुभव त्यांच्या व्यावसायिक पार्श्वभूमीत आहे.\n\nकाळजीपूर्वक तपासणी, स्पष्ट संवाद, रुग्णांना माहिती देणे आणि प्रत्येक रुग्णाच्या गरजेनुसार उपचारांचे निर्णय घेणे यावर त्यांचा भर असतो.'
    },
    shortBio: {
      en: 'Dr. Anagha Deshpande is a consultant ophthalmologist in Chembur with 20 years of clinical experience. Her principal clinical interest is cataract evaluation and phacoemulsification cataract surgery, with experience of approximately 10,000 phaco procedures.',
      mr: 'डॉ. अनघा देशपांडे या चेंबूरमधील कन्सल्टंट नेत्ररोगतज्ज्ञ असून त्यांना २० वर्षांचा वैद्यकीय अनुभव आहे. मोतीबिंदूची तपासणी आणि फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रिया हा त्यांचा मुख्य विषय असून त्यांना सुमारे १०,००० फॅको शस्त्रक्रियांचा अनुभव आहे.'
    },
    approach: {
      en: 'Every consultation begins with a careful examination and an unhurried explanation of the findings. Dr. Deshpande discusses the options, their benefits, limitations and costs, so that patients and families can make informed decisions together with her.',
      mr: 'प्रत्येक तपासणीची सुरुवात काळजीपूर्वक तपासणीने आणि निष्कर्षांच्या शांतपणे दिलेल्या स्पष्टीकरणाने होते. उपलब्ध पर्याय, त्यांचे फायदे, मर्यादा आणि खर्च याबद्दल डॉ. देशपांडे सविस्तर चर्चा करतात, जेणेकरून रुग्ण व कुटुंबीय त्यांच्यासोबत माहितीपूर्ण निर्णय घेऊ शकतील.'
    },
    interests: [
      { en: 'Cataract evaluation and surgical counselling', mr: 'मोतीबिंदू तपासणी आणि शस्त्रक्रियेबाबत समुपदेशन' },
      { en: 'Phacoemulsification cataract surgery', mr: 'फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रिया' },
      { en: 'Intraocular lens selection and counselling', mr: 'कृत्रिम भिंग (इंट्राऑक्युलर लेन्स) निवड व समुपदेशन' },
      { en: 'Comprehensive eye examination', mr: 'डोळ्यांची सर्वांगीण तपासणी' }
    ],
    languagesSpoken: { en: 'English and Marathi', mr: 'इंग्रजी आणि मराठी', confirm: true },
    education: [
      { degree: { en: 'MS (Ophthalmology)', mr: 'एमएस (नेत्ररोगशास्त्र)' }, place: { en: 'T.N. Medical College, Mumbai University', mr: 'टी. एन. मेडिकल कॉलेज, मुंबई विद्यापीठ' }, years: '2003–2006' },
      { degree: { en: 'FCPS (Ophthalmology)', mr: 'एफसीपीएस (नेत्ररोगशास्त्र)' }, place: { en: 'College of Physicians and Surgeons, Mumbai', mr: 'कॉलेज ऑफ फिजिशियन्स अँड सर्जन्स, मुंबई' }, years: '2003–2006' },
      { degree: { en: 'DOMS', mr: 'डीओएमएस' }, place: { en: 'College of Physicians and Surgeons, Mumbai', mr: 'कॉलेज ऑफ फिजिशियन्स अँड सर्जन्स, मुंबई' }, years: '2004–2006' },
      { degree: { en: 'MBBS', mr: 'एमबीबीएस' }, place: { en: 'Government Medical College, Nanded', mr: 'शासकीय वैद्यकीय महाविद्यालय, नांदेड' }, years: '1995–2001' }
    ],
    career: [
      { role: { en: 'Consultant Ophthalmologist', mr: 'कन्सल्टंट नेत्ररोगतज्ज्ञ' }, place: { en: 'Lions Charitable Medical Centre, Apollo Clinic, Chembur', mr: 'लायन्स चॅरिटेबल मेडिकल सेंटर, अपोलो क्लिनिक, चेंबूर' }, period: { en: 'From March 2009 (as recorded in CV)', mr: 'मार्च २००९ पासून (सीव्हीनुसार)' }, confirm: true },
      { role: { en: 'Junior Ophthalmic Surgeon', mr: 'कनिष्ठ नेत्रशल्यचिकित्सक' }, place: { en: 'Pramukhswami Eye Hospital, Chunabhatti', mr: 'प्रमुखस्वामी नेत्र रुग्णालय, चुनाभट्टी' }, period: { en: 'June 2007 – March 2009', mr: 'जून २००७ – मार्च २००९' } },
      { role: { en: 'Lecturer, Ophthalmology', mr: 'व्याख्याता, नेत्ररोगशास्त्र' }, place: { en: 'KEM Hospital, Parel', mr: 'केईएम रुग्णालय, परळ' }, period: { en: 'December 2006 – May 2007', mr: 'डिसेंबर २००६ – मे २००७' } },
      { role: { en: 'Senior Resident, Ophthalmology', mr: 'वरिष्ठ निवासी डॉक्टर, नेत्ररोगशास्त्र' }, place: { en: 'T.N.M.C. and Nair Hospital', mr: 'टी.एन.एम.सी. व नायर रुग्णालय' }, period: { en: 'September – December 2006', mr: 'सप्टेंबर – डिसेंबर २००६' } },
      { role: { en: 'Chief Resident, Ophthalmology', mr: 'मुख्य निवासी डॉक्टर, नेत्ररोगशास्त्र' }, place: { en: 'T.N.M.C. and Nair Hospital', mr: 'टी.एन.एम.सी. व नायर रुग्णालय' }, period: { en: 'July 2005 – August 2006', mr: 'जुलै २००५ – ऑगस्ट २००६' } },
      { role: { en: 'Resident, Ophthalmology', mr: 'निवासी डॉक्टर, नेत्ररोगशास्त्र' }, place: { en: 'T.N.M.C. and Nair Hospital', mr: 'टी.एन.एम.सी. व नायर रुग्णालय' }, period: { en: 'July 2003 – July 2005', mr: 'जुलै २००३ – जुलै २००५' } }
    ],
    photos: {
      portrait: '/img/dr-anagha-deshpande-portrait',
      consultation: '/img/dr-anagha-deshpande-consultation',
      examination: '/img/slit-lamp-eye-examination'
    }
  },

  clinics: [
    {
      id: 'srv',
      name: { en: 'SRV Hospital, Chembur', mr: 'एसआरव्ही हॉस्पिटल, चेंबूर' },
      shortName: { en: 'SRV Hospital', mr: 'एसआरव्ही हॉस्पिटल' },
      address: {
        en: 'Opp. Mandakini Parihar Marg, near LT Terminus, Tilak Nagar, Chembur, Mumbai – 400089',
        mr: 'मंदाकिनी परिहार मार्गासमोर, एलटी टर्मिनसजवळ, टिळक नगर, चेंबूर, मुंबई – ४०००८९'
      },
      street: 'Opp. Mandakini Parihar Marg, near LT Terminus, Tilak Nagar',
      locality: 'Chembur, Mumbai', postalCode: '400089',
      phone: '8451800800', phoneType: 'landline',
      whatsapp: '',               // landline: no WhatsApp unless separately verified
      mapUrl: mapsSearch('SRV Hospital, Tilak Nagar, Chembur, Mumbai 400089'),
      mapVerified: false,
      days: [1, 2, 3, 4, 5, 6],
      start: '10:00', end: '13:00',
      slotMinutes: 15, capacityPerSlot: 2,
      daysLabel: { en: 'Monday to Saturday', mr: 'सोमवार ते शनिवार' }
    },
    {
      id: 'justcare',
      name: { en: 'Just Care Heart & Eye Clinic, Chembur', mr: 'जस्ट केअर हार्ट अँड आय क्लिनिक, चेंबूर' },
      shortName: { en: 'Just Care Heart & Eye Clinic', mr: 'जस्ट केअर हार्ट अँड आय क्लिनिक' },
      address: {
        en: 'Room 304, Shubham Flora, opposite Chembur Police Station, Chembur Naka, Mumbai – 400071',
        mr: 'रूम ३०४, शुभम फ्लोरा, चेंबूर पोलीस स्टेशनसमोर, चेंबूर नाका, मुंबई – ४०००७१'
      },
      street: 'Room 304, Shubham Flora, opposite Chembur Police Station, Chembur Naka',
      locality: 'Chembur, Mumbai', postalCode: '400071',
      phone: '8879758831', phoneType: 'mobile',
      whatsapp: '918879758831',
      mapUrl: mapsSearch('Shubham Flora, opposite Chembur Police Station, Chembur Naka, Mumbai 400071'),
      mapVerified: false,
      days: [1, 2, 3, 4, 5],
      start: '18:00', end: '20:00',
      slotMinutes: 15, capacityPerSlot: 2,
      daysLabel: { en: 'Monday to Friday', mr: 'सोमवार ते शुक्रवार' }
    }
  ],

  // published: shown on the live site. Services not yet confirmed by the
  // doctor stay unpublished; in preview mode they appear with a label.
  services: [
    { id: 'cataract-evaluation', icon: 'lens', published: true,
      title: { en: 'Cataract evaluation and surgical counselling', mr: 'मोतीबिंदू तपासणी व शस्त्रक्रियेबाबत समुपदेशन' },
      text: { en: 'A detailed examination to assess whether a cataract is affecting your vision, followed by a clear discussion of whether surgery may help and what it involves.', mr: 'मोतीबिंदूमुळे दृष्टीवर परिणाम होत आहे का हे पाहण्यासाठी सविस्तर तपासणी, आणि शस्त्रक्रियेचा फायदा होऊ शकतो का व त्यात काय असते याची स्पष्ट चर्चा.' },
      where: { en: 'Consultation at both clinics', mr: 'दोन्ही क्लिनिकमध्ये तपासणी' } },
    { id: 'phaco-surgery', icon: 'phaco', published: true,
      title: { en: 'Phacoemulsification cataract surgery', mr: 'फॅकोइमल्सिफिकेशन मोतीबिंदू शस्त्रक्रिया' },
      text: { en: 'Modern small-incision cataract surgery in which the cloudy lens is removed and replaced with an artificial intraocular lens, when examination shows it is appropriate.', mr: 'तपासणीनंतर योग्य असल्यास केली जाणारी आधुनिक लहान छेदाची शस्त्रक्रिया, ज्यात धूसर झालेले भिंग काढून त्याजागी कृत्रिम भिंग बसवले जाते.' },
      where: { en: 'The place of surgery is discussed at your consultation', mr: 'शस्त्रक्रियेचे ठिकाण तपासणीच्या वेळी सांगितले जाते' }, confirm: true },
    { id: 'eye-examination', icon: 'eye', published: true,
      title: { en: 'Comprehensive eye examinations', mr: 'डोळ्यांची सर्वांगीण तपासणी' },
      text: { en: 'Vision testing, slit-lamp examination of the front of the eye and, when needed, examination of the retina and eye pressure.', mr: 'दृष्टी तपासणी, स्लिट-लॅम्पद्वारे डोळ्याच्या पुढील भागाची तपासणी आणि गरजेनुसार पडदा (रेटिना) व डोळ्यांच्या दाबाची तपासणी.' },
      where: { en: 'Both clinics', mr: 'दोन्ही क्लिनिक' } },
    { id: 'refraction', icon: 'glasses', published: false, confirm: true,
      title: { en: 'Refractive error and spectacle assessment', mr: 'चष्म्याचा नंबर व दृष्टिदोष तपासणी' },
      text: { en: 'Assessment of short-sightedness, long-sightedness, astigmatism and reading difficulty, with advice on spectacles.', mr: 'जवळचे/लांबचे न दिसणे, सिलिंड्रिकल नंबर आणि वाचनातील अडचण यांची तपासणी व चष्म्याबाबत सल्ला.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'diabetic', icon: 'drop', published: false, confirm: true,
      title: { en: 'Diabetic eye screening', mr: 'मधुमेहींसाठी डोळ्यांची तपासणी' },
      text: { en: 'Regular retinal examination for people with diabetes to look for early signs of diabetic retinopathy.', mr: 'मधुमेह असलेल्यांसाठी डायबेटिक रेटिनोपॅथीची सुरुवातीची लक्षणे शोधण्यासाठी पडद्याची नियमित तपासणी.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'glaucoma', icon: 'gauge', published: false, confirm: true,
      title: { en: 'Glaucoma assessment', mr: 'काचबिंदू (ग्लॉकोमा) तपासणी' },
      text: { en: 'Measurement of eye pressure and examination of the optic nerve, with further tests or referral when needed.', mr: 'डोळ्यांचा दाब मोजणे आणि दृष्टिनसेची तपासणी, गरज असल्यास पुढील चाचण्या किंवा संदर्भ.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'dry-eye', icon: 'droplets', published: false, confirm: true,
      title: { en: 'Dry eye evaluation', mr: 'कोरड्या डोळ्यांची तपासणी' },
      text: { en: 'Assessment of gritty, burning or watery eyes and advice on suitable treatment.', mr: 'खुपणारे, जळजळणारे किंवा पाणावणारे डोळे यांची तपासणी आणि योग्य उपचारांबाबत सल्ला.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'red-eye', icon: 'alert', published: false, confirm: true,
      title: { en: 'Red eye assessment', mr: 'लाल डोळ्यांची तपासणी' },
      text: { en: 'Examination of red, painful or sticky eyes to identify the cause, including infection, allergy or inflammation.', mr: 'लाल, दुखणारे किंवा चिकट डोळे यांचे कारण (संसर्ग, ॲलर्जी किंवा सूज) शोधण्यासाठी तपासणी.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'age-related', icon: 'sun', published: false, confirm: true,
      title: { en: 'Age-related eye problems', mr: 'वयानुसार होणाऱ्या डोळ्यांच्या समस्या' },
      text: { en: 'Assessment of reading difficulty, cataract and other changes in vision that become more common with age.', mr: 'वाचनातील अडचण, मोतीबिंदू आणि वयानुसार वाढणाऱ्या दृष्टीतील इतर बदलांची तपासणी.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'children', icon: 'child', published: false, confirm: true,
      title: { en: "Children's eye assessments", mr: 'मुलांच्या डोळ्यांची तपासणी' },
      text: { en: 'Vision checks for children, including assessment for spectacles and squint.', mr: 'मुलांची दृष्टी तपासणी, चष्मा व तिरळेपणाची तपासणी.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } },
    { id: 'retina', icon: 'retina', published: false, confirm: true,
      title: { en: 'Retina assessment or referral', mr: 'पडद्याची (रेटिना) तपासणी किंवा संदर्भ' },
      text: { en: 'Examination of the retina and, where specialised retinal treatment is needed, referral to an appropriate retina specialist.', mr: 'पडद्याची तपासणी आणि विशेष उपचार आवश्यक असल्यास योग्य रेटिना तज्ज्ञांकडे संदर्भ.' },
      where: { en: 'To be confirmed', mr: 'निश्चित करायचे' } }
  ],

  // Closed dates. clinic: 'all' | clinic id. Admin-editable.
  closures: []
};
