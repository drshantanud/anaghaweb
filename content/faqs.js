'use strict';
// Default FAQ library (English + Marathi). Copied into the data store on first
// start; edited and approved in the admin dashboard after that.
// reviewed: approved by Dr. Deshpande (October 2026).

const categories = [
  { id: 'cataract', en: 'Cataract and cataract surgery', mr: 'मोतीबिंदू व मोतीबिंदू शस्त्रक्रिया' },
  { id: 'general', en: 'General eye health', mr: 'डोळ्यांचे सर्वसाधारण आरोग्य' },
  { id: 'spectacles', en: 'Spectacles and refractive errors', mr: 'चष्मा व दृष्टिदोष' },
  { id: 'diabetes', en: 'Diabetes and eye health', mr: 'मधुमेह व डोळे' },
  { id: 'glaucoma', en: 'Glaucoma', mr: 'काचबिंदू (ग्लॉकोमा)' },
  { id: 'dryeye', en: 'Dry eye', mr: 'कोरडे डोळे' },
  { id: 'redeye', en: 'Red eye and infections', mr: 'लाल डोळे व संसर्ग' },
  { id: 'children', en: "Children's eye health", mr: 'मुलांच्या डोळ्यांचे आरोग्य' },
  { id: 'age', en: 'Age-related eye problems', mr: 'वयानुसार होणाऱ्या डोळ्यांच्या समस्या' },
  { id: 'emergency', en: 'Eye emergencies', mr: 'डोळ्यांच्या तातडीच्या समस्या' }
];

const f = (id, category, q, short, detail, opts = {}) => ({
  id, category, q, short, detail,
  emergency: !!opts.emergency, related: opts.related || [], popular: !!opts.popular,
  published: true, reviewed: true
});

const faqs = [
  // ---------- Cataract ----------
  f('what-is-a-cataract', 'cataract',
    { en: 'What is a cataract?', mr: 'मोतीबिंदू म्हणजे काय?' },
    { en: 'A cataract is a clouding of the natural lens inside the eye, which makes vision blurred, dim or glary.', mr: 'डोळ्याच्या आतील नैसर्गिक भिंग धूसर होणे म्हणजे मोतीबिंदू. त्यामुळे दृष्टी धूसर, अंधुक किंवा चकाकणारी होते.' },
    { en: 'The lens sits behind the coloured part of the eye (the iris) and focuses light onto the retina. With age, and sometimes because of diabetes, injury, steroid medicines or other causes, the proteins in the lens slowly become cloudy. Light can no longer pass through clearly, so images look hazy. A cataract is not a growth or a film on the surface of the eye. It usually develops gradually over months or years and often affects both eyes, though not always equally.', mr: 'भिंग हे डोळ्याच्या रंगीत भागाच्या (बुबुळाच्या) मागे असते आणि प्रकाश पडद्यावर (रेटिनावर) केंद्रित करते. वयानुसार, तसेच कधी मधुमेह, इजा, स्टेरॉइड औषधे किंवा इतर कारणांमुळे भिंगातील प्रथिने हळूहळू धूसर होतात. त्यामुळे प्रकाश स्वच्छपणे आत जाऊ शकत नाही आणि दिसणारे चित्र धूसर वाटते. मोतीबिंदू म्हणजे डोळ्यावर आलेला पडदा किंवा वाढ नव्हे. तो साधारणपणे काही महिने किंवा वर्षांत हळूहळू वाढतो आणि बहुधा दोन्ही डोळ्यांत होतो, पण दोन्ही डोळ्यांत सारखाच असेल असे नाही.' },
    { related: ['early-symptoms-of-cataract', 'what-is-phacoemulsification', 'when-should-i-have-cataract-surgery'], popular: true }),

  f('early-symptoms-of-cataract', 'cataract',
    { en: 'What are the early symptoms of cataract?', mr: 'मोतीबिंदूची सुरुवातीची लक्षणे कोणती?' },
    { en: 'Common early symptoms are blurred or cloudy vision, glare from lights, difficulty seeing at night, faded colours and frequent changes in spectacle power.', mr: 'धूसर दृष्टी, दिव्यांचा चकाकी त्रास, रात्री दिसण्यात अडचण, रंग फिके दिसणे आणि चष्म्याचा नंबर वारंवार बदलणे ही सुरुवातीची सामान्य लक्षणे आहेत.' },
    { en: 'Some people notice haloes around lights, double vision in one eye, or that they need more light to read. Others find that their distance glasses suddenly seem less useful while reading becomes easier without glasses for a while. These symptoms are not specific to cataract: they can also be caused by dry eye, retinal problems, glaucoma and other conditions. Only an eye examination can tell the cause.', mr: 'काही जणांना दिव्यांभोवती वलये दिसतात, एका डोळ्याने दोन प्रतिमा दिसतात किंवा वाचण्यासाठी जास्त प्रकाश लागतो. काहींना लांबचा चष्मा कमी उपयोगी वाटतो, तर काही काळ चष्म्याशिवाय वाचणे सोपे होते. ही लक्षणे केवळ मोतीबिंदूचीच नसतात; कोरडे डोळे, पडद्याचे आजार, काचबिंदू आणि इतर आजारांमुळेही ती दिसू शकतात. नेमके कारण फक्त डोळ्यांच्या तपासणीनेच कळते.' },
    { related: ['what-is-a-cataract', 'what-causes-blurred-vision', 'when-should-i-have-cataract-surgery'] }),

  f('age-cataracts-develop', 'cataract',
    { en: 'At what age do cataracts develop?', mr: 'मोतीबिंदू कोणत्या वयात होतो?' },
    { en: 'Most cataracts are age-related and become common after the age of 50 to 60, but they can occur earlier.', mr: 'बहुतेक मोतीबिंदू वयानुसार होतात आणि ५० ते ६० वर्षांनंतर सामान्य असतात, पण ते त्याआधीही होऊ शकतात.' },
    { en: 'Cataracts may appear at a younger age in people with diabetes, long-term steroid use, previous eye injury or surgery, high myopia, or certain other eye and general conditions. Rarely, babies are born with a cataract (congenital cataract), which needs early assessment by a paediatric eye specialist.', mr: 'मधुमेह, दीर्घकाळ स्टेरॉइड औषधांचा वापर, डोळ्याला पूर्वी झालेली इजा किंवा शस्त्रक्रिया, जास्त मायनस नंबर किंवा इतर काही आजार असल्यास मोतीबिंदू कमी वयातही होऊ शकतो. क्वचित बाळांमध्ये जन्मतः मोतीबिंदू असतो; त्यासाठी लहान मुलांच्या नेत्रतज्ज्ञांकडून लवकर तपासणी आवश्यक असते.' },
    { related: ['what-is-a-cataract', 'how-does-diabetes-affect-eyes'] }),

  f('what-is-phacoemulsification', 'cataract',
    { en: 'What is phacoemulsification?', mr: 'फॅकोइमल्सिफिकेशन म्हणजे काय?' },
    { en: 'Phacoemulsification ("phaco") is a modern method of cataract surgery in which ultrasound energy breaks up the cloudy lens so it can be removed through a small opening and replaced with an artificial intraocular lens.', mr: 'फॅकोइमल्सिफिकेशन ("फॅको") ही मोतीबिंदू शस्त्रक्रियेची आधुनिक पद्धत आहे. यात अल्ट्रासाऊंड ऊर्जेने धूसर भिंगाचे बारीक तुकडे करून ते लहान छेदातून काढले जातात आणि त्याजागी कृत्रिम भिंग (इंट्राऑक्युलर लेन्स) बसवले जाते.' },
    { en: 'The surgery is usually performed under local or topical (drop) anaesthesia. A very small incision is made at the edge of the cornea. A fine probe uses ultrasound to break the cloudy lens into tiny fragments, which are gently suctioned out. A folded artificial lens is then placed inside the natural lens capsule, where it unfolds. The small incision often does not need stitches. Whether phaco is suitable, and which lens is used, depends on your examination findings.', mr: 'ही शस्त्रक्रिया साधारणपणे स्थानिक भूल किंवा डोळ्यात थेंब टाकून दिलेल्या भुलीखाली केली जाते. बुबुळाच्या पारदर्शक भागाच्या (कॉर्नियाच्या) कडेला अगदी लहान छेद घेतला जातो. बारीक उपकरणाद्वारे अल्ट्रासाऊंडने धूसर भिंगाचे लहान तुकडे करून ते हळुवारपणे शोषून काढले जातात. त्यानंतर घडी केलेले कृत्रिम भिंग नैसर्गिक भिंगाच्या पिशवीत (कॅप्सूलमध्ये) बसवले जाते, जिथे ते उलगडते. लहान छेदाला बहुतेक वेळा टाके लागत नाहीत. फॅको आपल्यासाठी योग्य आहे का आणि कोणते भिंग वापरायचे हे तपासणीतील निष्कर्षांवर अवलंबून असते.' },
    { related: ['is-cataract-surgery-painful', 'how-long-does-cataract-surgery-take', 'which-intraocular-lens-is-best'], popular: true }),

  f('is-cataract-surgery-painful', 'cataract',
    { en: 'Is cataract surgery painful?', mr: 'मोतीबिंदू शस्त्रक्रिया वेदनादायक असते का?' },
    { en: 'Most patients feel little or no pain during phaco surgery because the eye is numbed with anaesthetic drops or an injection. Some pressure or mild discomfort can be felt.', mr: 'भुलीचे थेंब किंवा इंजेक्शनमुळे डोळा बधिर केला जात असल्याने बहुतेक रुग्णांना फॅको शस्त्रक्रियेदरम्यान फारशी किंवा अजिबात वेदना होत नाही. थोडा दाब किंवा सौम्य अस्वस्थता जाणवू शकते.' },
    { en: 'You are usually awake during the operation and may see light or movement. After surgery, the eye may feel gritty, watery or mildly uncomfortable for a few days. Severe or increasing pain after surgery is not expected and should be reported to the surgeon or a hospital urgently.', mr: 'शस्त्रक्रियेदरम्यान आपण साधारणपणे जागे असता आणि प्रकाश किंवा हालचाल दिसू शकते. शस्त्रक्रियेनंतर काही दिवस डोळा खुपल्यासारखा, पाणावलेला किंवा थोडा अस्वस्थ वाटू शकतो. शस्त्रक्रियेनंतर तीव्र किंवा वाढती वेदना अपेक्षित नसते; तसे झाल्यास त्वरित शल्यचिकित्सकांना किंवा रुग्णालयाला कळवा.' },
    { related: ['what-is-phacoemulsification', 'precautions-after-cataract-surgery'], popular: true }),

  f('how-long-does-cataract-surgery-take', 'cataract',
    { en: 'How long does cataract surgery take?', mr: 'मोतीबिंदू शस्त्रक्रियेला किती वेळ लागतो?' },
    { en: 'The operation itself commonly takes around 15 to 30 minutes, although you will spend longer at the hospital for preparation and recovery.', mr: 'प्रत्यक्ष शस्त्रक्रियेला साधारणपणे १५ ते ३० मिनिटे लागतात, पण तयारी आणि विश्रांतीसाठी रुग्णालयात जास्त वेळ थांबावे लागते.' },
    { en: 'The time varies with the type and density of the cataract and any other eye conditions. Cataract surgery is usually done as a day-care procedure, so most patients go home the same day. Your surgical team will tell you how long to plan for and whether someone should accompany you.', mr: 'मोतीबिंदूचा प्रकार, त्याची घनता आणि डोळ्याचे इतर आजार यांनुसार वेळ बदलतो. मोतीबिंदू शस्त्रक्रिया साधारणपणे डे-केअर पद्धतीने होते, त्यामुळे बहुतेक रुग्ण त्याच दिवशी घरी जातात. किती वेळ लागेल आणि सोबत कोणी असावे का, हे आपली शस्त्रक्रिया टीम सांगेल.' },
    { related: ['what-is-phacoemulsification', 'precautions-after-cataract-surgery'] }),

  f('can-eye-drops-treat-cataract', 'cataract',
    { en: 'Can cataracts be treated with eye drops?', mr: 'डोळ्यांच्या थेंबांनी मोतीबिंदू बरा होतो का?' },
    { en: 'No. There are currently no proven eye drops, tablets or exercises that remove a cataract. Surgery is the only effective treatment once a cataract affects vision significantly.', mr: 'नाही. मोतीबिंदू काढून टाकणारे सिद्ध झालेले थेंब, गोळ्या किंवा व्यायाम सध्या उपलब्ध नाहीत. मोतीबिंदूचा दृष्टीवर लक्षणीय परिणाम होऊ लागल्यावर शस्त्रक्रिया हाच परिणामकारक उपचार आहे.' },
    { en: 'In the early stages, updated spectacles, brighter lighting and anti-glare measures may help for a time. Be cautious of products that claim to dissolve cataracts. Using unprescribed drops can delay proper care or harm the eye.', mr: 'सुरुवातीच्या टप्प्यात नवीन नंबरचा चष्मा, जास्त प्रकाश आणि चकाकी कमी करणारे उपाय काही काळ मदत करू शकतात. मोतीबिंदू विरघळवण्याचा दावा करणाऱ्या उत्पादनांपासून सावध राहा. डॉक्टरांनी न सांगितलेले थेंब वापरल्याने योग्य उपचारास उशीर होऊ शकतो किंवा डोळ्याला हानी होऊ शकते.' },
    { related: ['when-should-i-have-cataract-surgery', 'over-the-counter-eye-drops'] }),

  f('when-should-i-have-cataract-surgery', 'cataract',
    { en: 'When should I undergo cataract surgery?', mr: 'मोतीबिंदू शस्त्रक्रिया कधी करावी?' },
    { en: 'Surgery is usually considered when the cataract makes daily activities such as reading, driving, working or moving around safely difficult, and when the expected benefits outweigh the risks.', mr: 'वाचन, वाहन चालवणे, काम करणे किंवा सुरक्षितपणे वावरणे अशा दैनंदिन गोष्टी मोतीबिंदूमुळे अवघड होऊ लागल्यावर, आणि अपेक्षित फायदे धोक्यांपेक्षा जास्त असल्यास शस्त्रक्रियेचा विचार केला जातो.' },
    { en: 'A cataract does not need to be "ripe" before surgery, and in most cases there is no harm in waiting while vision is still adequate for your needs. Sometimes earlier surgery is advised for medical reasons, for example when a cataract affects eye pressure or prevents examination or treatment of the retina. The decision is made together with your ophthalmologist after a full examination.', mr: 'शस्त्रक्रियेपूर्वी मोतीबिंदू "पिकणे" आवश्यक नसते. आपल्या गरजांसाठी दृष्टी पुरेशी असेपर्यंत बहुतेक वेळा थांबल्याने नुकसान होत नाही. काही वेळा वैद्यकीय कारणांमुळे लवकर शस्त्रक्रिया सुचवली जाते, उदा. मोतीबिंदूमुळे डोळ्यांचा दाब वाढत असल्यास किंवा पडद्याची तपासणी व उपचार करता येत नसल्यास. संपूर्ण तपासणीनंतर हा निर्णय आपल्या नेत्ररोगतज्ज्ञांसोबत घेतला जातो.' },
    { related: ['what-is-a-cataract', 'which-intraocular-lens-is-best', 'is-cataract-surgery-painful'], popular: true }),

  f('which-intraocular-lens-is-best', 'cataract',
    { en: 'Which intraocular lens is best for me?', mr: 'माझ्यासाठी कोणते कृत्रिम भिंग सर्वोत्तम आहे?' },
    { en: 'There is no single best lens for everyone. The right choice depends on your eye measurements, other eye conditions, your daily visual needs, your expectations and cost.', mr: 'सर्वांसाठी एकच सर्वोत्तम भिंग नसते. योग्य निवड डोळ्यांची मोजमापे, डोळ्याचे इतर आजार, दैनंदिन गरजा, अपेक्षा आणि खर्च यांवर अवलंबून असते.' },
    { en: 'Monofocal lenses give clear vision at one chosen distance, usually far, and glasses are typically needed for reading. Toric lenses also correct significant astigmatism. Multifocal and extended-depth-of-focus lenses aim to reduce dependence on glasses for more distances, but may cause haloes or glare around lights and are not suitable for every eye. Premium lenses usually cost more. Your ophthalmologist will explain the trade-offs after your biometry and examination.', mr: 'मोनोफोकल भिंग एका ठरावीक अंतरावर (बहुधा लांबचे) स्पष्ट दृष्टी देते; वाचनासाठी साधारणपणे चष्मा लागतो. टॉरिक भिंग सिलिंड्रिकल नंबर (ॲस्टिग्मॅटिझम) देखील कमी करते. मल्टिफोकल आणि एक्स्टेंडेड-डेप्थ-ऑफ-फोकस भिंगांचा उद्देश अधिक अंतरांसाठी चष्म्यावरील अवलंबित्व कमी करणे असतो, पण त्यामुळे दिव्यांभोवती वलये किंवा चकाकी जाणवू शकते आणि ती प्रत्येक डोळ्यासाठी योग्य नसतात. अशी भिंगे साधारणपणे जास्त खर्चिक असतात. बायोमेट्री व तपासणीनंतर आपले नेत्ररोगतज्ज्ञ फायदे-तोटे समजावून सांगतील.' },
    { related: ['what-is-phacoemulsification', 'when-should-i-have-cataract-surgery'] }),

  f('can-cataracts-come-back', 'cataract',
    { en: 'Can cataracts come back after surgery?', mr: 'शस्त्रक्रियेनंतर मोतीबिंदू पुन्हा होतो का?' },
    { en: 'A cataract cannot grow back because the natural lens has been removed. However, the thin capsule that holds the new lens can become cloudy months or years later. This is called posterior capsule opacification.', mr: 'नैसर्गिक भिंग काढून टाकलेले असल्याने मोतीबिंदू पुन्हा वाढू शकत नाही. मात्र नवीन भिंग धरून ठेवणारी पातळ पिशवी (कॅप्सूल) काही महिने किंवा वर्षांनी धूसर होऊ शकते. याला पोस्टीरियर कॅप्सूल ओपॅसिफिकेशन म्हणतात.' },
    { en: 'This can cause symptoms similar to the original cataract, such as blurring or glare. It is usually treated with a quick outpatient laser procedure (YAG laser capsulotomy). If your vision becomes blurred again after cataract surgery, arrange an eye examination.', mr: 'यामुळे पूर्वीच्या मोतीबिंदूसारखीच धूसर दृष्टी किंवा चकाकीची लक्षणे दिसू शकतात. यावर साधारणपणे ओपीडीमध्ये होणारा थोड्या वेळाचा लेझर उपचार (YAG लेझर कॅप्सुलोटॉमी) केला जातो. मोतीबिंदू शस्त्रक्रियेनंतर दृष्टी पुन्हा धूसर झाल्यास डोळ्यांची तपासणी करून घ्या.' },
    { related: ['precautions-after-cataract-surgery', 'what-is-a-cataract'], popular: true }),

  f('precautions-after-cataract-surgery', 'cataract',
    { en: 'What precautions should I take after surgery?', mr: 'शस्त्रक्रियेनंतर कोणती काळजी घ्यावी?' },
    { en: 'Use your prescribed eye drops exactly as advised, avoid rubbing or pressing the eye, keep the eye clean, attend every follow-up visit, and follow your surgeon\'s instructions on activities.', mr: 'दिलेले थेंब सांगितल्याप्रमाणेच वापरा, डोळा चोळू किंवा दाबू नका, डोळा स्वच्छ ठेवा, प्रत्येक फॉलो-अप तपासणीला या आणि कामकाजाबाबत शल्यचिकित्सकांच्या सूचना पाळा.' },
    { en: 'You may be advised to wear a protective shield at night, to avoid water or soap entering the eye, and to avoid dusty places, swimming and eye make-up for a period. Ask your surgeon when you can resume bathing, bending, cooking, work, driving and exercise, as advice differs for each patient. Seek urgent help if you have increasing pain, worsening vision, increasing redness or discharge.', mr: 'रात्री संरक्षक कवच लावणे, डोळ्यात पाणी किंवा साबण जाऊ न देणे, आणि काही काळ धुळीच्या जागा, पोहणे व डोळ्यांचा मेकअप टाळणे असे सांगितले जाऊ शकते. आंघोळ, वाकणे, स्वयंपाक, काम, वाहन चालवणे व व्यायाम केव्हा सुरू करायचे हे शल्यचिकित्सकांना विचारा, कारण प्रत्येक रुग्णासाठी सल्ला वेगळा असतो. वेदना वाढल्यास, दृष्टी कमी होत गेल्यास, लालसरपणा किंवा स्राव वाढल्यास त्वरित मदत घ्या.' },
    { emergency: true, related: ['is-cataract-surgery-painful', 'can-cataracts-come-back', 'sudden-vision-loss-emergency'] }),

  // ---------- General ----------
  f('how-often-eye-examination', 'general',
    { en: 'How often should I get my eyes examined?', mr: 'डोळ्यांची तपासणी किती वेळा करावी?' },
    { en: 'Adults without symptoms are commonly advised to have an eye check every one to two years, and more often after 40, or if you have diabetes, high blood pressure, glaucoma in the family or other risk factors.', mr: 'लक्षणे नसलेल्या प्रौढांनी साधारणपणे दर एक-दोन वर्षांनी डोळे तपासावेत. ४० वर्षांनंतर, किंवा मधुमेह, उच्च रक्तदाब, कुटुंबात काचबिंदू किंवा इतर धोके असल्यास अधिक वेळा तपासणी करावी.' },
    { en: 'Your ophthalmologist may recommend a different interval depending on your eye health. Do not wait for a routine check if you notice new blurring, pain, redness, flashes, floaters or loss of vision.', mr: 'आपल्या डोळ्यांच्या आरोग्यानुसार नेत्ररोगतज्ज्ञ वेगळा कालावधी सुचवू शकतात. नव्याने धूसरपणा, वेदना, लालसरपणा, प्रकाशाच्या चमका, तरंगणारे ठिपके किंवा दृष्टी कमी होणे जाणवल्यास नियमित तपासणीची वाट पाहू नका.' },
    { related: ['who-is-at-risk-of-glaucoma', 'how-often-diabetic-retinal-screening', 'what-causes-blurred-vision'] }),

  f('screen-use-eye-strain', 'general',
    { en: 'Can screen use cause eye strain?', mr: 'मोबाइल/कॉम्प्युटर स्क्रीनमुळे डोळ्यांवर ताण येतो का?' },
    { en: 'Yes. Long periods of screen use can cause tired, dry or uncomfortable eyes, headaches and blurred vision, mainly because we blink less while concentrating.', mr: 'होय. दीर्घकाळ स्क्रीन वापरल्याने डोळे थकणे, कोरडे वाटणे, अस्वस्थता, डोकेदुखी आणि धूसर दृष्टी होऊ शकते, मुख्यतः लक्ष केंद्रित करताना आपण कमी वेळा पापण्या मिचकावतो म्हणून.' },
    { en: 'Helpful habits include the 20-20-20 rule (every 20 minutes, look at something about 20 feet away for 20 seconds), keeping the screen slightly below eye level and at arm\'s length, adjusting brightness, and blinking fully. Uncorrected spectacle power can make strain worse. If symptoms persist, have your eyes examined.', mr: '२०-२०-२० नियम (दर २० मिनिटांनी सुमारे २० फूट दूरच्या वस्तूकडे २० सेकंद पाहणे), स्क्रीन डोळ्यांच्या पातळीपेक्षा थोडी खाली व हाताच्या अंतरावर ठेवणे, ब्राइटनेस योग्य ठेवणे आणि पूर्ण पापण्या मिचकावणे या सवयी उपयोगी ठरतात. चष्म्याचा नंबर न दुरुस्त केल्यास ताण वाढू शकतो. त्रास कायम राहिल्यास डोळे तपासून घ्या.' },
    { related: ['what-causes-dry-eyes', 'can-spectacles-cure-myopia'] }),

  f('why-do-my-eyes-water', 'general',
    { en: 'Why do my eyes water?', mr: 'माझ्या डोळ्यांतून पाणी का येते?' },
    { en: 'Watery eyes can be caused by dry eye (which triggers reflex tearing), allergy, infection, eyelid problems, wind or smoke, or a blocked tear drainage duct.', mr: 'डोळ्यांतून पाणी येण्याची कारणे कोरडे डोळे (ज्यामुळे प्रतिक्रियात्मक पाणी येते), ॲलर्जी, संसर्ग, पापण्यांच्या समस्या, वारा किंवा धूर, अथवा अश्रूनलिका बंद होणे अशी असू शकतात.' },
    { en: 'An examination helps find the cause, since treatment differs. Seek prompt care if watering comes with pain, redness, reduced vision, sensitivity to light, or swelling near the inner corner of the eye.', mr: 'उपचार कारणानुसार वेगळे असल्याने तपासणीने नेमके कारण शोधणे उपयुक्त ठरते. पाणी येण्यासोबत वेदना, लालसरपणा, कमी दृष्टी, प्रकाश सहन न होणे किंवा डोळ्याच्या आतल्या कोपऱ्याजवळ सूज असल्यास लवकर उपचार घ्या.' },
    { related: ['what-causes-dry-eyes', 'what-to-do-if-eye-is-red'] }),

  f('what-causes-blurred-vision', 'general',
    { en: 'What causes blurred vision?', mr: 'दृष्टी धूसर होण्याची कारणे कोणती?' },
    { en: 'Common causes include a change in spectacle power, cataract, dry eye, diabetes-related eye changes, and conditions of the retina or optic nerve. Sudden blurring needs urgent assessment.', mr: 'चष्म्याचा नंबर बदलणे, मोतीबिंदू, कोरडे डोळे, मधुमेहामुळे डोळ्यांत होणारे बदल, आणि पडदा किंवा दृष्टिनसेचे आजार ही सामान्य कारणे आहेत. अचानक धूसरपणा आल्यास त्वरित तपासणी आवश्यक आहे.' },
    { en: 'Gradual blurring over months is often due to refractive error or cataract, but it should still be examined because glaucoma and retinal disease can also cause it. Blurring that comes on suddenly, affects one eye, or comes with pain, redness, flashes, floaters, a shadow or weakness elsewhere in the body may be serious: seek emergency care.', mr: 'काही महिन्यांत हळूहळू येणारा धूसरपणा बहुधा नंबर बदलामुळे किंवा मोतीबिंदूमुळे असतो, पण काचबिंदू आणि पडद्याच्या आजारांमुळेही तो होऊ शकत असल्याने तपासणी आवश्यक आहे. अचानक आलेला, एका डोळ्यात असलेला, किंवा वेदना, लालसरपणा, चमका, तरंगणारे ठिपके, सावली अथवा शरीरात इतरत्र अशक्तपणा यांसोबत आलेला धूसरपणा गंभीर असू शकतो: आपत्कालीन उपचार घ्या.' },
    { emergency: true, related: ['sudden-vision-loss-emergency', 'early-symptoms-of-cataract', 'how-does-diabetes-affect-eyes'], popular: true }),

  f('are-floaters-normal', 'general',
    { en: 'Are floaters normal?', mr: 'डोळ्यांसमोर तरंगणारे ठिपके दिसणे सामान्य आहे का?' },
    { en: 'A few long-standing floaters are common and usually harmless. A sudden increase in floaters, especially with flashes of light or a shadow in your vision, needs urgent examination.', mr: 'जुने, थोडे तरंगणारे ठिपके सामान्य असतात आणि बहुधा निरुपद्रवी असतात. मात्र ठिपके अचानक वाढल्यास, विशेषतः प्रकाशाच्या चमका किंवा दृष्टीत सावली असल्यास, त्वरित तपासणी आवश्यक आहे.' },
    { en: 'Floaters are small specks, threads or cobwebs that drift across your vision. They come from changes in the jelly (vitreous) inside the eye, which become more common with age and in short-sighted people. A new shower of floaters can mean a retinal tear or detachment, which may need prompt treatment to protect vision.', mr: 'तरंगणारे ठिपके म्हणजे दृष्टीसमोर फिरणारे बारीक कण, धागे किंवा जाळ्यासारखे आकार. डोळ्याच्या आतील जेलीतील (व्हिट्रियसमधील) बदलांमुळे ते दिसतात आणि वयानुसार व मायनस नंबर असलेल्यांमध्ये ते जास्त आढळतात. अचानक अनेक ठिपके दिसू लागणे हे पडद्याला छिद्र पडणे किंवा पडदा सरकणे (रेटिनल डिटॅचमेंट) याचे लक्षण असू शकते, ज्यावर दृष्टी वाचवण्यासाठी लवकर उपचार लागू शकतात.' },
    { emergency: true, related: ['flashes-and-floaters-urgent', 'sudden-vision-loss-emergency'] }),

  // ---------- Diabetes ----------
  f('how-does-diabetes-affect-eyes', 'diabetes',
    { en: 'How does diabetes affect the eyes?', mr: 'मधुमेहाचा डोळ्यांवर कसा परिणाम होतो?' },
    { en: 'Diabetes can damage the small blood vessels of the retina (diabetic retinopathy), cause swelling at the centre of the retina (macular oedema), and increase the risk of cataract and glaucoma.', mr: 'मधुमेहामुळे पडद्यातील (रेटिनामधील) बारीक रक्तवाहिन्यांना इजा होऊ शकते (डायबेटिक रेटिनोपॅथी), पडद्याच्या मध्यभागी सूज येऊ शकते (मॅक्युलर इडिमा), आणि मोतीबिंदू व काचबिंदूचा धोका वाढतो.' },
    { en: 'Blood sugar changes can also make vision fluctuate from day to day. Good control of blood sugar, blood pressure and cholesterol, together with regular eye examinations, reduces the risk of vision loss. Many treatments for diabetic eye disease work best when started early.', mr: 'रक्तातील साखरेत बदल झाल्याने दृष्टी दिवसेंदिवस कमी-जास्त होऊ शकते. रक्तातील साखर, रक्तदाब व कोलेस्टेरॉल नियंत्रणात ठेवणे आणि नियमित डोळे तपासणे यामुळे दृष्टी जाण्याचा धोका कमी होतो. मधुमेहामुळे होणाऱ्या डोळ्यांच्या आजारांवरील अनेक उपचार लवकर सुरू केल्यास अधिक परिणामकारक ठरतात.' },
    { related: ['diabetic-retinopathy-without-symptoms', 'how-often-diabetic-retinal-screening'], popular: true }),

  f('diabetic-retinopathy-without-symptoms', 'diabetes',
    { en: 'Can diabetic retinopathy occur without symptoms?', mr: 'डायबेटिक रेटिनोपॅथी लक्षणांशिवाय होऊ शकते का?' },
    { en: 'Yes. Diabetic retinopathy often causes no symptoms in its early stages, even when treatment may be needed. This is why regular retinal checks are important.', mr: 'होय. सुरुवातीच्या टप्प्यात, उपचारांची गरज असतानाही, डायबेटिक रेटिनोपॅथीची अनेकदा कोणतीही लक्षणे नसतात. म्हणूनच पडद्याची नियमित तपासणी महत्त्वाची आहे.' },
    { en: 'By the time vision is affected, the disease may be advanced. A dilated retinal examination can detect changes before you notice them. Sudden blurring, a shower of floaters or a dark area in vision in a person with diabetes should be assessed urgently.', mr: 'दृष्टीवर परिणाम जाणवेपर्यंत आजार वाढलेला असू शकतो. बाहुली मोठी करून केलेल्या पडद्याच्या तपासणीत आपल्याला जाणवण्यापूर्वीच बदल ओळखता येतात. मधुमेह असलेल्या व्यक्तीला अचानक धूसरपणा, अनेक तरंगणारे ठिपके किंवा दृष्टीत काळा भाग दिसल्यास त्वरित तपासणी करून घ्यावी.' },
    { related: ['how-does-diabetes-affect-eyes', 'how-often-diabetic-retinal-screening'] }),

  f('how-often-diabetic-retinal-screening', 'diabetes',
    { en: 'How often should people with diabetes have retinal screening?', mr: 'मधुमेह असलेल्यांनी पडद्याची तपासणी किती वेळा करावी?' },
    { en: 'Most people with diabetes are advised to have a retinal examination at least once a year, or more often if retinopathy is found or during pregnancy.', mr: 'मधुमेह असलेल्या बहुतेकांना वर्षातून किमान एकदा पडद्याची तपासणी करण्याचा सल्ला दिला जातो. रेटिनोपॅथी आढळल्यास किंवा गर्भावस्थेत अधिक वेळा तपासणी आवश्यक असते.' },
    { en: 'People with type 2 diabetes should have an eye examination soon after diagnosis, because changes may already be present. Your ophthalmologist will advise the right interval based on your findings.', mr: 'टाइप २ मधुमेहाचे निदान झाल्यावर लवकरच डोळ्यांची तपासणी करावी, कारण त्यावेळी बदल आधीच झालेले असू शकतात. तपासणीतील निष्कर्षांनुसार योग्य कालावधी आपले नेत्ररोगतज्ज्ञ सांगतील.' },
    { related: ['diabetic-retinopathy-without-symptoms', 'how-often-eye-examination'] }),

  // ---------- Glaucoma ----------
  f('what-is-glaucoma', 'glaucoma',
    { en: 'What is glaucoma?', mr: 'काचबिंदू (ग्लॉकोमा) म्हणजे काय?' },
    { en: 'Glaucoma is a group of conditions that damage the optic nerve, often linked to raised pressure inside the eye. It can cause gradual, permanent loss of side vision, usually without early symptoms.', mr: 'काचबिंदू हा दृष्टिनसेला (ऑप्टिक नर्व्हला) इजा करणाऱ्या आजारांचा समूह आहे, ज्याचा संबंध अनेकदा डोळ्यातील वाढलेल्या दाबाशी असतो. यामुळे बाजूची दृष्टी हळूहळू आणि कायमची कमी होऊ शकते, बहुधा सुरुवातीला कोणतीही लक्षणे न दिसता.' },
    { en: 'The most common type develops slowly and painlessly, which is why it is sometimes called a "silent" disease. A less common type, angle-closure glaucoma, can cause a sudden painful red eye with blurred vision, headache and nausea; this is an emergency. Glaucoma is detected by measuring eye pressure, examining the optic nerve and testing the field of vision.', mr: 'सर्वात सामान्य प्रकार हळूहळू आणि वेदनारहित वाढतो, म्हणून त्याला कधी "मूक" आजार म्हणतात. कमी आढळणाऱ्या अँगल-क्लोजर काचबिंदूमध्ये अचानक डोळा लाल होऊन दुखतो, दृष्टी धूसर होते, डोकेदुखी व मळमळ होते; ही आपत्कालीन स्थिती आहे. डोळ्यांचा दाब मोजणे, दृष्टिनसेची तपासणी आणि दृष्टीक्षेत्राची चाचणी यांतून काचबिंदूचे निदान होते.' },
    { related: ['can-glaucoma-be-cured', 'who-is-at-risk-of-glaucoma'] }),

  f('can-glaucoma-be-cured', 'glaucoma',
    { en: 'Can glaucoma be cured?', mr: 'काचबिंदू पूर्ण बरा होतो का?' },
    { en: 'Vision already lost to glaucoma cannot usually be restored, but treatment can slow or stop further damage in most people when it is started early and continued regularly.', mr: 'काचबिंदूमुळे गेलेली दृष्टी साधारणपणे परत मिळत नाही, पण लवकर सुरू केलेल्या आणि नियमित चालू ठेवलेल्या उपचारांनी बहुतेकांमध्ये पुढील नुकसान कमी करता किंवा थांबवता येते.' },
    { en: 'Treatment lowers eye pressure using eye drops, laser or surgery. Glaucoma is usually a lifelong condition, so drops must be used exactly as prescribed even when you feel well, and regular follow-up is essential. Never stop glaucoma drops without speaking to your doctor.', mr: 'डोळ्यांचे थेंब, लेझर किंवा शस्त्रक्रियेद्वारे डोळ्यांचा दाब कमी केला जातो. काचबिंदू हा सहसा आयुष्यभराचा आजार असल्याने बरे वाटत असले तरी थेंब सांगितल्याप्रमाणेच वापरावेत आणि नियमित फॉलो-अप आवश्यक आहे. डॉक्टरांशी बोलल्याशिवाय काचबिंदूचे थेंब कधीही बंद करू नका.' },
    { related: ['what-is-glaucoma', 'who-is-at-risk-of-glaucoma'] }),

  f('who-is-at-risk-of-glaucoma', 'glaucoma',
    { en: 'Who is at risk of glaucoma?', mr: 'काचबिंदूचा धोका कोणाला जास्त असतो?' },
    { en: 'Risk is higher in people over 40, those with a family history of glaucoma, high eye pressure, diabetes, high myopia or hypermetropia, previous eye injury, or long-term steroid use.', mr: '४० वर्षांवरील व्यक्ती, कुटुंबात काचबिंदू असलेले, डोळ्यांचा दाब जास्त असलेले, मधुमेह, जास्त मायनस किंवा प्लस नंबर, डोळ्याला पूर्वी इजा झालेले, किंवा दीर्घकाळ स्टेरॉइड वापरणारे यांना धोका जास्त असतो.' },
    { en: 'If you are at higher risk, regular eye examinations that include eye pressure and optic nerve checks can detect glaucoma before you notice any change in vision. Close relatives of people with glaucoma are often advised to be checked.', mr: 'आपल्याला धोका जास्त असल्यास, डोळ्यांचा दाब व दृष्टिनसेची तपासणी असलेली नियमित नेत्रतपासणी दृष्टीत बदल जाणवण्यापूर्वीच काचबिंदू ओळखू शकते. काचबिंदू असलेल्यांच्या जवळच्या नातेवाइकांनाही तपासणी करून घेण्याचा सल्ला दिला जातो.' },
    { related: ['what-is-glaucoma', 'how-often-eye-examination'] }),

  // ---------- Dry eye ----------
  f('what-causes-dry-eyes', 'dryeye',
    { en: 'What causes dry eyes?', mr: 'डोळे कोरडे होण्याची कारणे कोणती?' },
    { en: 'Dry eye happens when the eyes do not make enough tears or the tears evaporate too quickly. Common factors include age, screen use, air-conditioning, eyelid gland problems, some medicines and certain general health conditions.', mr: 'डोळ्यांत पुरेसे अश्रू तयार न झाल्यास किंवा अश्रू खूप लवकर वाळल्यास डोळे कोरडे होतात. वय, स्क्रीनचा वापर, एसी, पापण्यांतील ग्रंथींच्या समस्या, काही औषधे आणि काही शारीरिक आजार ही सामान्य कारणे आहेत.' },
    { en: 'Symptoms include grittiness, burning, redness, fluctuating vision and, surprisingly, watering. Contact lens wear, previous eye surgery and hormonal changes can contribute. Treatment depends on the cause and may include lubricating drops, eyelid hygiene and changes to the environment, as advised after an examination.', mr: 'डोळ्यांत खुपणे, जळजळ, लालसरपणा, कमी-जास्त होणारी दृष्टी आणि आश्चर्य म्हणजे डोळ्यांतून पाणी येणे ही लक्षणे असू शकतात. कॉन्टॅक्ट लेन्स, पूर्वीची डोळ्यांची शस्त्रक्रिया आणि संप्रेरकांतील बदल यांचाही हातभार असू शकतो. तपासणीनंतर कारणानुसार उपचार ठरतात, ज्यात वंगण देणारे थेंब, पापण्यांची स्वच्छता आणि वातावरणातील बदल यांचा समावेश असू शकतो.' },
    { related: ['over-the-counter-eye-drops', 'screen-use-eye-strain', 'why-do-my-eyes-water'] }),

  f('over-the-counter-eye-drops', 'dryeye',
    { en: 'Can I use over-the-counter eye drops?', mr: 'डॉक्टरांच्या चिठ्ठीशिवाय मिळणारे डोळ्यांचे थेंब वापरू शकतो का?' },
    { en: 'Simple lubricating drops (artificial tears) are generally safe for occasional dryness. Avoid using steroid, antibiotic or "redness-relief" drops without an eye doctor\'s advice.', mr: 'साधे वंगण देणारे थेंब (आर्टिफिशियल टिअर्स) अधूनमधून होणाऱ्या कोरडेपणासाठी सर्वसाधारणपणे सुरक्षित असतात. स्टेरॉइड, अँटिबायोटिक किंवा "लालसरपणा कमी करणारे" थेंब नेत्रतज्ज्ञांच्या सल्ल्याशिवाय वापरू नका.' },
    { en: 'Steroid drops used without supervision can raise eye pressure, cause cataract and worsen some infections. Drops shared with others or used after their expiry or opening period can carry infection. If your eye is painful, red, sensitive to light or your vision is reduced, have it examined instead of self-treating. This website does not prescribe medicines.', mr: 'देखरेखीशिवाय वापरलेले स्टेरॉइड थेंब डोळ्यांचा दाब वाढवू शकतात, मोतीबिंदू निर्माण करू शकतात आणि काही संसर्ग वाढवू शकतात. इतरांसोबत वाटून घेतलेले किंवा मुदत संपलेले/उघडल्यानंतर जास्त काळ झालेले थेंब संसर्ग पसरवू शकतात. डोळा दुखत असल्यास, लाल असल्यास, प्रकाश सहन होत नसल्यास किंवा दृष्टी कमी झाल्यास स्वतः उपचार न करता तपासणी करून घ्या. ही वेबसाइट औषधे सुचवत नाही.' },
    { related: ['what-causes-dry-eyes', 'what-to-do-if-eye-is-red', 'can-eye-drops-treat-cataract'] }),

  // ---------- Red eye ----------
  f('what-to-do-if-eye-is-red', 'redeye',
    { en: 'What should I do if my eye becomes red?', mr: 'डोळा लाल झाल्यास काय करावे?' },
    { en: 'Mild redness without pain or vision change often settles, but seek prompt examination if redness comes with pain, reduced vision, light sensitivity, injury, contact lens use, or recent eye surgery.', mr: 'वेदना किंवा दृष्टीत बदल नसलेला सौम्य लालसरपणा अनेकदा आपोआप कमी होतो. पण लालसरपणासोबत वेदना, कमी दृष्टी, प्रकाश सहन न होणे, इजा, कॉन्टॅक्ट लेन्सचा वापर किंवा नुकतीच डोळ्याची शस्त्रक्रिया झालेली असल्यास लवकर तपासणी करा.' },
    { en: 'Red eyes have many causes, from conjunctivitis and allergy to more serious problems such as corneal infection, inflammation inside the eye (uveitis) or acute glaucoma. Do not rub the eye, remove contact lenses, and avoid using leftover or steroid drops. A painful red eye with blurred vision, especially with headache or nausea, is an emergency.', mr: 'डोळे येणे (कंजंक्टिव्हायटिस) आणि ॲलर्जीपासून ते कॉर्नियाचा संसर्ग, डोळ्याच्या आत सूज (युव्हायटिस) किंवा तीव्र काचबिंदू अशा गंभीर समस्यांपर्यंत डोळा लाल होण्याची अनेक कारणे असतात. डोळा चोळू नका, कॉन्टॅक्ट लेन्स काढा, आणि उरलेले किंवा स्टेरॉइड थेंब वापरू नका. धूसर दृष्टीसह दुखणारा लाल डोळा, विशेषतः डोकेदुखी किंवा मळमळीसोबत, ही आपत्कालीन स्थिती आहे.' },
    { emergency: true, related: ['is-conjunctivitis-contagious', 'over-the-counter-eye-drops', 'what-is-glaucoma'], popular: true }),

  f('is-conjunctivitis-contagious', 'redeye',
    { en: 'Is conjunctivitis contagious?', mr: 'डोळे येणे (कंजंक्टिव्हायटिस) संसर्गजन्य आहे का?' },
    { en: 'Viral and bacterial conjunctivitis can spread easily through hands, towels and shared items. Allergic conjunctivitis is not contagious.', mr: 'विषाणूजन्य आणि जिवाणूजन्य कंजंक्टिव्हायटिस हात, टॉवेल आणि सामायिक वस्तूंमधून सहज पसरतो. ॲलर्जीमुळे होणारा कंजंक्टिव्हायटिस संसर्गजन्य नसतो.' },
    { en: 'To reduce spread, wash hands often, avoid touching or rubbing the eyes, use a separate towel and pillow cover, and avoid sharing eye drops or make-up. Children may need to stay home from school for a few days as advised by their doctor. See an eye doctor if there is pain, reduced vision, light sensitivity or if a newborn has red or sticky eyes.', mr: 'प्रसार कमी करण्यासाठी वारंवार हात धुवा, डोळ्यांना स्पर्श करणे किंवा चोळणे टाळा, स्वतंत्र टॉवेल व उशीचा अभ्रा वापरा आणि थेंब किंवा मेकअप इतरांसोबत वाटू नका. डॉक्टरांच्या सल्ल्यानुसार मुलांना काही दिवस शाळेत न पाठवणे आवश्यक असू शकते. वेदना, कमी दृष्टी, प्रकाश सहन न होणे असल्यास किंवा नवजात बाळाचे डोळे लाल/चिकट असल्यास नेत्रतज्ज्ञांना दाखवा.' },
    { related: ['what-to-do-if-eye-is-red', 'over-the-counter-eye-drops'] }),

  // ---------- Spectacles ----------
  f('can-spectacles-cure-myopia', 'spectacles',
    { en: 'Can spectacles cure myopia?', mr: 'चष्म्याने मायनस नंबर (मायोपिया) बरा होतो का?' },
    { en: 'No. Spectacles correct the blur caused by myopia (short-sightedness) while you wear them, but they do not cure it. Wearing the correct glasses does not make myopia worse.', mr: 'नाही. चष्मा घातलेला असताना मायोपियामुळे (लांबचे न दिसणे) येणारा धूसरपणा दुरुस्त होतो, पण त्यामुळे मायोपिया बरा होत नाही. योग्य नंबरचा चष्मा वापरल्याने मायोपिया वाढत नाही.' },
    { en: 'Myopia often increases during childhood and the teenage years. Spending time outdoors and taking regular breaks from near work and screens may help reduce the risk in children. Some specialised treatments to slow myopia progression in children are available; their suitability should be discussed with an eye specialist. In adults, contact lenses or laser refractive surgery are alternatives for selected patients.', mr: 'बालपणात व किशोरवयात मायोपिया बहुधा वाढतो. मुलांनी घराबाहेर वेळ घालवणे आणि जवळचे काम व स्क्रीनमधून नियमित विश्रांती घेणे यामुळे धोका कमी होण्यास मदत होऊ शकते. मुलांमध्ये मायोपियाची वाढ कमी करण्यासाठी काही विशेष उपचार उपलब्ध आहेत; ते योग्य आहेत का याबाबत नेत्रतज्ज्ञांशी चर्चा करावी. प्रौढांमध्ये निवडक रुग्णांसाठी कॉन्टॅक्ट लेन्स किंवा लेझर शस्त्रक्रिया हे पर्याय असतात.' },
    { related: ['does-my-child-need-eye-exam', 'screen-use-eye-strain'] }),

  // ---------- Children ----------
  f('does-my-child-need-eye-exam', 'children',
    { en: 'How do I know if my child needs an eye examination?', mr: 'माझ्या मुलाला डोळ्यांच्या तपासणीची गरज आहे हे कसे ओळखावे?' },
    { en: 'Have your child\'s eyes checked if they squint or tilt their head, sit very close to the TV, hold books close, rub their eyes often, complain of headaches, or if an eye turns in or out.', mr: 'मूल डोळे बारीक करत असेल किंवा डोके वाकडे करत असेल, टीव्हीच्या अगदी जवळ बसत असेल, पुस्तक जवळ धरत असेल, वारंवार डोळे चोळत असेल, डोकेदुखीची तक्रार करत असेल किंवा डोळा आत/बाहेर वळत असेल, तर डोळे तपासून घ्या.' },
    { en: 'Children rarely complain about poor vision because they do not know what normal vision looks like. A vision check before starting school is useful even without symptoms. A white reflex in the pupil in photographs, a constant eye turn, or a red, watery or cloudy eye in a baby should be examined promptly.', mr: 'सामान्य दृष्टी कशी असते हे मुलांना माहीत नसल्याने ती कमी दृष्टीची क्वचितच तक्रार करतात. लक्षणे नसतानाही शाळा सुरू होण्यापूर्वी दृष्टी तपासणी उपयुक्त ठरते. फोटोंमध्ये बाहुलीत पांढरी चमक दिसणे, सतत डोळा वळलेला असणे, किंवा बाळाचा डोळा लाल, पाणावलेला किंवा धूसर दिसणे असल्यास लवकर तपासणी करा.' },
    { related: ['can-spectacles-cure-myopia', 'can-adults-develop-squint'] }),

  // ---------- Age-related ----------
  f('can-adults-develop-squint', 'age',
    { en: 'Can adults develop a squint?', mr: 'प्रौढांनाही तिरळेपणा होऊ शकतो का?' },
    { en: 'Yes. A squint (misaligned eyes) can appear in adulthood, sometimes as a childhood squint that has worsened, and sometimes because of nerve, muscle, thyroid or other health problems.', mr: 'होय. प्रौढ वयातही तिरळेपणा (डोळ्यांची दिशा न जुळणे) होऊ शकतो. कधी बालपणीचा तिरळेपणा वाढलेला असतो, तर कधी नसा, स्नायू, थायरॉइड किंवा इतर आरोग्य समस्यांमुळे तो होतो.' },
    { en: 'A new squint in an adult often causes double vision. Sudden double vision, especially with a drooping eyelid, headache, weakness, numbness or difficulty speaking, needs emergency medical assessment. Otherwise, an eye examination can identify the cause and treatment options such as prisms, exercises or surgery.', mr: 'प्रौढांमध्ये नव्याने आलेल्या तिरळेपणामुळे बहुधा दोन-दोन दिसू लागते. अचानक दोन-दोन दिसणे, विशेषतः पापणी खाली येणे, डोकेदुखी, अशक्तपणा, बधिरपणा किंवा बोलण्यात अडचण यांसोबत असल्यास आपत्कालीन वैद्यकीय तपासणी आवश्यक आहे. अन्यथा डोळ्यांच्या तपासणीत कारण आणि प्रिझम चष्मा, व्यायाम किंवा शस्त्रक्रियेसारखे उपचार पर्याय ठरवता येतात.' },
    { emergency: true, related: ['does-my-child-need-eye-exam', 'sudden-vision-loss-emergency'] }),

  f('reading-glasses-after-40', 'age',
    { en: 'Why do I need reading glasses after 40?', mr: '४० वर्षांनंतर वाचनासाठी चष्मा का लागतो?' },
    { en: 'After about 40, the natural lens gradually loses its flexibility, making it harder to focus on near objects. This is called presbyopia and is a normal part of ageing.', mr: 'साधारण ४० वर्षांनंतर नैसर्गिक भिंगाची लवचीकता हळूहळू कमी होते, त्यामुळे जवळच्या वस्तूंवर लक्ष केंद्रित करणे अवघड होते. याला प्रेसबायोपिया (चाळिशी) म्हणतात आणि हा वयानुसार होणारा सामान्य बदल आहे.' },
    { en: 'Reading glasses, bifocals or progressive lenses can help. Ready-made reading glasses may be suitable for some people, but an eye examination is still worthwhile, because it also checks for conditions such as glaucoma and cataract that become more common after 40.', mr: 'वाचनाचा चष्मा, बायफोकल किंवा प्रोग्रेसिव्ह लेन्स उपयोगी ठरतात. काहींना तयार वाचनाचा चष्मा चालू शकतो, पण तरीही डोळ्यांची तपासणी करून घेणे फायदेशीर आहे, कारण त्यात ४० नंतर वाढणाऱ्या काचबिंदू व मोतीबिंदूसारख्या आजारांचीही तपासणी होते.' },
    { related: ['how-often-eye-examination', 'who-is-at-risk-of-glaucoma', 'early-symptoms-of-cataract'] }),

  // ---------- Emergencies ----------
  f('sudden-vision-loss-emergency', 'emergency',
    { en: 'When is sudden vision loss an emergency?', mr: 'अचानक दृष्टी जाणे केव्हा आपत्कालीन असते?' },
    { en: 'Sudden loss or dimming of vision in one or both eyes, even if it improves, should always be treated as an emergency. Go to the nearest hospital emergency department immediately.', mr: 'एका किंवा दोन्ही डोळ्यांची दृष्टी अचानक गेल्यास किंवा अंधुक झाल्यास, ती पुन्हा सुधारली तरी, ती नेहमी आपत्कालीन स्थिती समजावी. त्वरित जवळच्या रुग्णालयाच्या आपत्कालीन विभागात जा.' },
    { en: 'Causes include blockage of blood flow to the eye, retinal detachment, bleeding inside the eye, acute glaucoma, optic nerve inflammation and stroke. Some of these can be treated only within hours. Do not wait for a routine appointment or an online booking. If vision loss comes with weakness, numbness, facial drooping or difficulty speaking, call an ambulance.', mr: 'डोळ्याचा रक्तपुरवठा अडणे, पडदा सरकणे, डोळ्याच्या आत रक्तस्राव, तीव्र काचबिंदू, दृष्टिनसेची सूज आणि पक्षाघात (स्ट्रोक) ही कारणे असू शकतात. यांपैकी काहींवर काही तासांतच उपचार शक्य असतात. नियमित भेटीची किंवा ऑनलाइन बुकिंगची वाट पाहू नका. दृष्टी जाण्यासोबत अशक्तपणा, बधिरपणा, चेहरा वाकडा होणे किंवा बोलण्यात अडचण असल्यास रुग्णवाहिका बोलवा.' },
    { emergency: true, related: ['flashes-and-floaters-urgent', 'chemical-in-eye', 'what-causes-blurred-vision'], popular: true }),

  f('chemical-in-eye', 'emergency',
    { en: 'What should I do if a chemical enters my eye?', mr: 'डोळ्यात रसायन गेल्यास काय करावे?' },
    { en: 'Immediately rinse the eye with plenty of clean running water for at least 15 to 20 minutes, holding the eyelids open, then go to the nearest emergency department.', mr: 'पापण्या उघड्या धरून ताबडतोब स्वच्छ वाहत्या पाण्याने डोळा किमान १५ ते २० मिनिटे भरपूर धुवा, आणि नंतर जवळच्या आपत्कालीन विभागात जा.' },
    { en: 'Start rinsing at once; do not wait to find a special solution. Remove contact lenses if they come out easily. Do not rub the eye or put any other drops, milk or home remedies in it. Alkalis such as lime (chuna), cement and cleaning agents can cause severe damage. Take the chemical container or its name with you if possible.', mr: 'लगेच धुण्यास सुरुवात करा; विशेष द्रावण शोधण्यासाठी थांबू नका. कॉन्टॅक्ट लेन्स सहज निघत असल्यास काढा. डोळा चोळू नका आणि इतर थेंब, दूध किंवा घरगुती उपाय डोळ्यात घालू नका. चुना, सिमेंट आणि स्वच्छता करणारी रसायने यांसारखे अल्कली पदार्थ गंभीर इजा करू शकतात. शक्य असल्यास रसायनाचा डबा किंवा त्याचे नाव सोबत घ्या.' },
    { emergency: true, related: ['sudden-vision-loss-emergency', 'what-to-do-if-eye-is-red'] }),

  f('flashes-and-floaters-urgent', 'emergency',
    { en: 'When should I seek urgent help for flashes and floaters?', mr: 'प्रकाशाच्या चमका व तरंगणाऱ्या ठिपक्यांसाठी तातडीने मदत केव्हा घ्यावी?' },
    { en: 'Seek urgent examination, the same day if possible, if you notice new flashes of light, a sudden increase in floaters, or a curtain-like shadow spreading across your vision.', mr: 'नव्याने प्रकाशाच्या चमका दिसणे, तरंगणारे ठिपके अचानक वाढणे, किंवा दृष्टीवर पडद्यासारखी सावली पसरणे असे जाणवल्यास तातडीने, शक्य असल्यास त्याच दिवशी, तपासणी करून घ्या.' },
    { en: 'These can be signs of a retinal tear or retinal detachment. Early treatment of a retinal tear can often prevent detachment, and prompt surgery for detachment gives the best chance of preserving vision. People who are short-sighted or who have had cataract surgery or eye injury have a higher risk. If you cannot reach your eye doctor quickly, go to a hospital emergency department.', mr: 'ही पडद्याला छिद्र पडण्याची किंवा पडदा सरकण्याची (रेटिनल डिटॅचमेंट) लक्षणे असू शकतात. छिद्रावर लवकर उपचार केल्यास अनेकदा पडदा सरकणे टाळता येते, आणि पडदा सरकल्यास लवकर शस्त्रक्रिया केल्याने दृष्टी वाचण्याची शक्यता सर्वाधिक असते. मायनस नंबर असलेल्यांना, मोतीबिंदू शस्त्रक्रिया झालेल्यांना किंवा डोळ्याला इजा झालेल्यांना धोका जास्त असतो. नेत्रतज्ज्ञांपर्यंत लवकर पोहोचता न आल्यास रुग्णालयाच्या आपत्कालीन विभागात जा.' },
    { emergency: true, related: ['are-floaters-normal', 'sudden-vision-loss-emergency'] })
];

module.exports = { categories, faqs };
