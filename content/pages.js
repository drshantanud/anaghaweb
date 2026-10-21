'use strict';
// Long-form bilingual page content. Clinical wording to be reviewed by
// Dr. Deshpande before launch. Simple markup: paragraphs are strings, lists
// are arrays.

const cataract = {
  title: { en: 'Cataract and Phaco Surgery', mr: 'मोतीबिंदू व फॅको शस्त्रक्रिया' },
  intro: {
    en: 'Clear, balanced information about cataract and modern phacoemulsification surgery, to help you prepare for your consultation.',
    mr: 'मोतीबिंदू आणि आधुनिक फॅकोइमल्सिफिकेशन शस्त्रक्रियेबद्दल स्पष्ट व संतुलित माहिती, जेणेकरून आपण तपासणीसाठी तयारी करू शकाल.'
  },
  sections: [
    { id: 'what-is-cataract', h: { en: 'What is a cataract?', mr: 'मोतीबिंदू म्हणजे काय?' },
      p: [
        { en: 'Inside the eye, behind the coloured iris, is a clear natural lens that focuses light onto the retina, the light-sensitive layer at the back of the eye. A cataract is a clouding of this lens. As it becomes cloudier, less light passes through clearly and vision becomes blurred, dim or glary.', mr: 'डोळ्याच्या आत, रंगीत बुबुळाच्या मागे, एक पारदर्शक नैसर्गिक भिंग असते. ते प्रकाश डोळ्याच्या मागील प्रकाशसंवेदी पडद्यावर (रेटिनावर) केंद्रित करते. या भिंगाचे धूसर होणे म्हणजे मोतीबिंदू. भिंग जसजसे धूसर होते तसतसा प्रकाश स्वच्छपणे आत जात नाही आणि दृष्टी धूसर, अंधुक किंवा चकाकणारी होते.' },
        { en: 'Most cataracts develop slowly with age. Diabetes, long-term steroid use, eye injury and some other conditions can cause cataract earlier. Cataract can make everyday activities harder, such as reading, recognising faces, cooking, climbing stairs, watching television and driving.', mr: 'बहुतेक मोतीबिंदू वयानुसार हळूहळू वाढतात. मधुमेह, दीर्घकाळ स्टेरॉइडचा वापर, डोळ्याला इजा आणि काही इतर कारणांमुळे मोतीबिंदू लवकर होऊ शकतो. मोतीबिंदूमुळे वाचणे, चेहरे ओळखणे, स्वयंपाक, जिने चढणे, टीव्ही पाहणे आणि वाहन चालवणे अशी रोजची कामे अवघड होऊ शकतात.' }
      ] },
    { id: 'symptoms', h: { en: 'Symptoms of cataract', mr: 'मोतीबिंदूची लक्षणे' },
      list: [
        { en: 'Blurred or cloudy vision', mr: 'धूसर किंवा ढगाळ दृष्टी' },
        { en: 'Glare from bright lights, sunlight or headlights', mr: 'तेजस्वी दिवे, ऊन किंवा वाहनांच्या दिव्यांमुळे चकाकी' },
        { en: 'Difficulty driving at night', mr: 'रात्री वाहन चालवण्यात अडचण' },
        { en: 'Dull or faded colours', mr: 'रंग फिके किंवा निस्तेज दिसणे' },
        { en: 'Difficulty reading, or needing more light to read', mr: 'वाचण्यात अडचण किंवा वाचण्यासाठी जास्त प्रकाश लागणे' },
        { en: 'Frequent changes in spectacle prescription', mr: 'चष्म्याचा नंबर वारंवार बदलणे' }
      ],
      note: { en: 'These symptoms can also be caused by other eye conditions, such as dry eye, glaucoma or retinal disease. Only an eye examination can tell the cause.', mr: 'ही लक्षणे कोरडे डोळे, काचबिंदू किंवा पडद्याचे आजार यांसारख्या इतर आजारांमुळेही असू शकतात. नेमके कारण फक्त डोळ्यांच्या तपासणीनेच कळते.' } },
    { id: 'phaco', h: { en: 'What is phacoemulsification?', mr: 'फॅकोइमल्सिफिकेशन म्हणजे काय?' },
      p: [
        { en: 'Phacoemulsification, usually called "phaco", is a modern technique for cataract surgery. Through a very small opening at the edge of the cornea, a fine instrument uses ultrasound energy to break up the cloudy lens into tiny pieces, which are gently removed. When appropriate, a folded artificial intraocular lens (IOL) is then placed inside the thin capsule that held the natural lens, where it unfolds and stays permanently.', mr: 'फॅकोइमल्सिफिकेशन, ज्याला साधारणपणे "फॅको" म्हणतात, ही मोतीबिंदू शस्त्रक्रियेची आधुनिक पद्धत आहे. कॉर्नियाच्या कडेला घेतलेल्या अगदी लहान छेदातून, बारीक उपकरण अल्ट्रासाऊंड ऊर्जेने धूसर भिंगाचे लहान तुकडे करते आणि ते हळुवारपणे काढले जातात. योग्य असल्यास, घडी केलेले कृत्रिम भिंग (आयओएल) नैसर्गिक भिंग धरणाऱ्या पातळ पिशवीत बसवले जाते, जिथे ते उलगडते आणि कायमचे राहते.' },
        { en: 'The procedure is usually performed under local or anaesthetic-drop anaesthesia, typically as day-care surgery. The small incision often seals without stitches.', mr: 'ही शस्त्रक्रिया साधारणपणे स्थानिक भूल किंवा भुलीच्या थेंबांखाली, बहुधा डे-केअर पद्धतीने केली जाते. लहान छेद बहुतेक वेळा टाक्यांशिवाय भरून येतो.' }
      ],
      steps: [
        { en: 'A tiny opening is made at the edge of the clear cornea.', mr: 'पारदर्शक कॉर्नियाच्या कडेला लहान छेद घेतला जातो.' },
        { en: 'A round opening is made in the front of the lens capsule.', mr: 'भिंगाच्या पिशवीच्या पुढील भागात गोल उघडणी केली जाते.' },
        { en: 'Ultrasound breaks the cloudy lens into small fragments, which are suctioned out.', mr: 'अल्ट्रासाऊंडने धूसर भिंगाचे लहान तुकडे करून ते शोषून काढले जातात.' },
        { en: 'A folded artificial lens is placed in the capsule and unfolds into position.', mr: 'घडी केलेले कृत्रिम भिंग पिशवीत बसवले जाते आणि ते जागेवर उलगडते.' }
      ] },
    { id: 'when-surgery', h: { en: 'When is surgery needed?', mr: 'शस्त्रक्रिया केव्हा आवश्यक असते?' },
      p: [
        { en: 'Cataract surgery is considered when the cataract causes visual difficulty that affects your daily activities or quality of life, and when the expected benefits outweigh the risks for you. A cataract does not need to "ripen" before it can be removed.', mr: 'मोतीबिंदूमुळे होणाऱ्या दृष्टीच्या अडचणीचा दैनंदिन कामांवर किंवा जीवनाच्या गुणवत्तेवर परिणाम होत असल्यास, आणि आपल्यासाठी अपेक्षित फायदे धोक्यांपेक्षा जास्त असल्यास मोतीबिंदू शस्त्रक्रियेचा विचार केला जातो. मोतीबिंदू काढण्यापूर्वी तो "पिकणे" आवश्यक नसते.' },
        { en: 'Not every cataract needs immediate surgery, and not every patient is suitable for every type of surgery or lens. Other eye conditions, such as glaucoma, diabetic retinopathy or macular disease, can limit the improvement in vision. The decision, its timing and the choice of lens are made after your individual examination and a discussion of your needs and preferences.', mr: 'प्रत्येक मोतीबिंदूला लगेच शस्त्रक्रिया लागतेच असे नाही, आणि प्रत्येक रुग्णासाठी प्रत्येक प्रकारची शस्त्रक्रिया किंवा भिंग योग्य असेलच असे नाही. काचबिंदू, डायबेटिक रेटिनोपॅथी किंवा पडद्याच्या मध्यभागाचे आजार यांसारख्या इतर आजारांमुळे दृष्टीतील सुधारणा मर्यादित राहू शकते. आपल्या वैयक्तिक तपासणीनंतर आणि आपल्या गरजा व पसंती यांची चर्चा करून निर्णय, त्याची वेळ आणि भिंगाची निवड केली जाते.' }
      ] },
    { id: 'lenses', h: { en: 'Intraocular lens options', mr: 'कृत्रिम भिंगाचे (आयओएल) पर्याय' },
      p: [{ en: 'Several types of intraocular lens are available. Each has advantages and limitations. No single lens is right for every patient.', mr: 'कृत्रिम भिंगाचे अनेक प्रकार उपलब्ध आहेत. प्रत्येकाचे फायदे व मर्यादा असतात. प्रत्येक रुग्णासाठी एकच भिंग योग्य असे नसते.' }],
      table: {
        head: [{ en: 'Lens type', mr: 'भिंगाचा प्रकार' }, { en: 'What it aims to do', mr: 'उद्देश' }, { en: 'Possible limitations', mr: 'संभाव्य मर्यादा' }, { en: 'Cost', mr: 'खर्च' }],
        rows: [
          [{ en: 'Monofocal', mr: 'मोनोफोकल' },
           { en: 'Clear vision at one chosen distance, usually far. The most widely used lens.', mr: 'एका निवडलेल्या अंतरावर, बहुधा लांबचे, स्पष्ट दृष्टी. सर्वाधिक वापरले जाणारे भिंग.' },
           { en: 'Glasses are usually needed for reading and near work, and sometimes for intermediate distance.', mr: 'वाचन व जवळच्या कामासाठी, तसेच कधी मध्यम अंतरासाठी, बहुधा चष्मा लागतो.' },
           { en: 'Usually the lowest', mr: 'साधारणपणे सर्वात कमी' }],
          [{ en: 'Toric', mr: 'टॉरिक' },
           { en: 'Also corrects significant corneal astigmatism, which can reduce the need for distance glasses.', mr: 'कॉर्नियाचा लक्षणीय सिलिंड्रिकल नंबर (ॲस्टिग्मॅटिझम) देखील कमी करते, ज्यामुळे लांबच्या चष्म्याची गरज कमी होऊ शकते.' },
           { en: 'Needs precise measurements and alignment; reading glasses are often still needed unless combined with a multifocal design.', mr: 'अचूक मोजमाप व योग्य दिशेने बसवणे आवश्यक; मल्टिफोकल प्रकारासोबत नसल्यास वाचनाचा चष्मा अनेकदा लागतो.' },
           { en: 'Additional cost', mr: 'जादा खर्च' }],
          [{ en: 'Multifocal / extended depth of focus (EDOF)', mr: 'मल्टिफोकल / एक्स्टेंडेड डेप्थ ऑफ फोकस (EDOF)' },
           { en: 'Aims to provide a range of focus (far, intermediate and, with multifocals, near) to reduce dependence on glasses.', mr: 'चष्म्यावरील अवलंबित्व कमी करण्यासाठी अनेक अंतरांवर (लांब, मध्यम आणि मल्टिफोकलमध्ये जवळचेही) दृष्टी देण्याचा उद्देश.' },
           { en: 'May cause haloes or glare around lights, especially at night, and slightly reduced contrast. Not suitable for everyone, for example some patients with retinal or other eye disease.', mr: 'दिव्यांभोवती, विशेषतः रात्री, वलये किंवा चकाकी आणि थोडी कमी स्पष्टता (कॉन्ट्रास्ट) जाणवू शकते. प्रत्येकासाठी योग्य नाही, उदा. पडद्याचे किंवा डोळ्याचे इतर आजार असलेल्या काही रुग्णांसाठी.' },
           { en: 'Higher additional cost', mr: 'जास्त जादा खर्च' }]
        ]
      },
      note: { en: 'Your ophthalmologist will explain which options are suitable for your eyes after biometry and examination, and the expected visual trade-offs and costs. Spectacles may still be needed for some activities with any lens.', mr: 'बायोमेट्री व तपासणीनंतर आपल्या डोळ्यांसाठी कोणते पर्याय योग्य आहेत, अपेक्षित दृष्टीविषयक तडजोडी आणि खर्च हे आपले नेत्ररोगतज्ज्ञ समजावून सांगतील. कोणतेही भिंग असले तरी काही कामांसाठी चष्मा लागू शकतो.' } },
    { id: 'before', h: { en: 'Before surgery', mr: 'शस्त्रक्रियेपूर्वी' },
      list: [
        { en: 'A detailed eye examination, including vision, eye pressure and the retina', mr: 'दृष्टी, डोळ्यांचा दाब व पडदा यांसह डोळ्यांची सविस्तर तपासणी' },
        { en: 'Biometry: measurements of the eye used to calculate the power of the artificial lens', mr: 'बायोमेट्री: कृत्रिम भिंगाचा नंबर ठरवण्यासाठी डोळ्याची मोजमापे' },
        { en: 'Assessment of other eye conditions that may affect surgery or the result', mr: 'शस्त्रक्रियेवर किंवा परिणामावर परिणाम करू शकणाऱ्या डोळ्याच्या इतर आजारांचे मूल्यमापन' },
        { en: 'Review of your medical history and medicines, including diabetes, blood pressure, blood thinners and prostate medicines', mr: 'मधुमेह, रक्तदाब, रक्त पातळ करणारी औषधे आणि प्रोस्टेटची औषधे यांसह आपला वैद्यकीय इतिहास व औषधांचा आढावा' },
        { en: 'Discussion of lens options, expected results and costs', mr: 'भिंगाचे पर्याय, अपेक्षित परिणाम आणि खर्च यांची चर्चा' },
        { en: 'Informed consent, after you have had the chance to ask questions', mr: 'आपले प्रश्न विचारण्याची संधी मिळाल्यानंतर माहितीपूर्ण संमती' }
      ],
      note: { en: 'Do not stop any regular medicine before surgery unless your doctors advise you to.', mr: 'डॉक्टरांनी सांगितल्याशिवाय शस्त्रक्रियेपूर्वी कोणतेही नियमित औषध बंद करू नका.' } },
    { id: 'after', h: { en: 'After surgery', mr: 'शस्त्रक्रियेनंतर' },
      list: [
        { en: 'Use your prescribed eye drops exactly as instructed, and for as long as advised', mr: 'दिलेले थेंब सांगितल्याप्रमाणे आणि सांगितलेल्या कालावधीपर्यंत वापरा' },
        { en: 'Attend all follow-up appointments, even if you feel well', mr: 'बरे वाटत असले तरी सर्व फॉलो-अप तपासण्यांना या' },
        { en: 'Do not rub or press on the eye; use the protective shield if advised', mr: 'डोळा चोळू किंवा दाबू नका; सांगितल्यास संरक्षक कवच वापरा' },
        { en: 'Follow your surgeon\'s advice about bathing, bending, lifting, cooking, work, driving and exercise', mr: 'आंघोळ, वाकणे, वजन उचलणे, स्वयंपाक, काम, वाहन चालवणे व व्यायाम याबाबत शल्यचिकित्सकांच्या सूचना पाळा' },
        { en: 'Vision often improves within days, but it can take a few weeks to settle; new glasses, if needed, are usually prescribed after healing', mr: 'दृष्टी बहुधा काही दिवसांत सुधारते, पण स्थिर होण्यास काही आठवडे लागू शकतात; आवश्यक असल्यास नवीन चष्मा साधारणपणे जखम भरल्यानंतर दिला जातो' }
      ] },
    { id: 'risks', h: { en: 'Risks and possible complications', mr: 'धोके व संभाव्य गुंतागुंत' },
      p: [{ en: 'Cataract surgery is one of the most commonly performed operations and most people have an uncomplicated recovery. As with any surgery, there are risks. Your surgeon will discuss the risks that apply to you. Possible complications include:', mr: 'मोतीबिंदू शस्त्रक्रिया ही सर्वाधिक वेळा केल्या जाणाऱ्या शस्त्रक्रियांपैकी एक आहे आणि बहुतेकांची बरे होण्याची प्रक्रिया गुंतागुंतीशिवाय होते. कोणत्याही शस्त्रक्रियेप्रमाणे यातही धोके असतात. आपल्याला लागू होणाऱ्या धोक्यांबाबत शल्यचिकित्सक चर्चा करतील. संभाव्य गुंतागुंत:' }],
      list: [
        { en: 'Infection inside the eye (endophthalmitis), which is uncommon but serious', mr: 'डोळ्याच्या आत संसर्ग (एंडॉफ्थॅल्मायटिस) – क्वचित, पण गंभीर' },
        { en: 'Inflammation, which is usually controlled with drops', mr: 'सूज – साधारणपणे थेंबांनी नियंत्रित होते' },
        { en: 'Raised eye pressure', mr: 'डोळ्यांचा दाब वाढणे' },
        { en: 'Retinal complications, such as swelling at the centre of the retina or retinal detachment', mr: 'पडद्याच्या गुंतागुंती, उदा. पडद्याच्या मध्यभागी सूज किंवा पडदा सरकणे' },
        { en: 'Residual refractive error, meaning glasses may still be needed', mr: 'उरलेला नंबर – म्हणजे चष्मा लागू शकतो' },
        { en: 'Posterior capsule opacification (clouding of the lens capsule months or years later), usually treated with a laser', mr: 'पोस्टीरियर कॅप्सूल ओपॅसिफिकेशन (काही महिने/वर्षांनी भिंगाची पिशवी धूसर होणे) – साधारणपणे लेझरने उपचार' }
      ] }
  ],
  warning: {
    h: { en: 'Urgent warning signs', mr: 'तातडीची धोक्याची लक्षणे' },
    p: { en: 'Seek urgent medical assessment, whether or not you have had surgery, if you have:', mr: 'शस्त्रक्रिया झाली असो वा नसो, पुढीलपैकी काही जाणवल्यास तातडीने वैद्यकीय तपासणी करून घ्या:' },
    list: [
      { en: 'Sudden loss of vision', mr: 'अचानक दृष्टी जाणे' },
      { en: 'Severe eye pain', mr: 'डोळ्यात तीव्र वेदना' },
      { en: 'Significant worsening of vision, especially after surgery', mr: 'दृष्टी लक्षणीयरीत्या कमी होणे, विशेषतः शस्त्रक्रियेनंतर' },
      { en: 'New flashes and floaters with a curtain-like shadow over part of your vision', mr: 'नव्याने चमका व तरंगणारे ठिपके आणि दृष्टीच्या काही भागावर पडद्यासारखी सावली' }
    ]
  },
  disclaimer: { en: 'This information is general and educational. It does not replace a clinical examination. Decisions about surgery and lens selection depend on your individual examination findings and preferences.', mr: 'ही माहिती सर्वसाधारण व शैक्षणिक आहे. ती प्रत्यक्ष तपासणीला पर्याय नाही. शस्त्रक्रिया व भिंगाच्या निवडीचे निर्णय आपल्या वैयक्तिक तपासणीतील निष्कर्ष आणि पसंती यांवर अवलंबून असतात.' }
};

const articles = [
  { slug: 'cataract-surgery-guide-for-families',
    title: { en: 'Cataract surgery: a guide for patients and families', mr: 'मोतीबिंदू शस्त्रक्रिया: रुग्ण व कुटुंबीयांसाठी मार्गदर्शक' },
    summary: { en: 'What to expect from the first consultation to the weeks after surgery, and how family members can help.', mr: 'पहिल्या तपासणीपासून शस्त्रक्रियेनंतरच्या आठवड्यांपर्यंत काय अपेक्षित आहे आणि कुटुंबीय कशी मदत करू शकतात.' },
    body: [
      { h: { en: 'The first consultation', mr: 'पहिली तपासणी' } },
      { en: 'Bring your current spectacles, a list of all medicines you take, and any previous eye reports. Your pupils may be dilated with drops, which blurs vision for a few hours, so it helps to have someone accompany you and to avoid driving afterwards.', mr: 'आपला सध्याचा चष्मा, घेत असलेल्या सर्व औषधांची यादी आणि डोळ्यांचे जुने रिपोर्ट सोबत आणा. थेंबांनी बाहुल्या मोठ्या केल्या जाऊ शकतात, ज्यामुळे काही तास दृष्टी धूसर राहते; म्हणून सोबत कोणी असणे उपयुक्त ठरते आणि नंतर वाहन चालवू नये.' },
      { h: { en: 'Questions worth asking', mr: 'विचारण्यासारखे प्रश्न' } },
      [ { en: 'How much is the cataract affecting my vision?', mr: 'मोतीबिंदूचा माझ्या दृष्टीवर किती परिणाम होत आहे?' },
        { en: 'Are there other eye conditions that may limit the result?', mr: 'परिणाम मर्यादित करू शकणारे डोळ्याचे इतर आजार आहेत का?' },
        { en: 'Which lens options suit my eyes and lifestyle, and what do they cost?', mr: 'माझ्या डोळ्यांना व जीवनशैलीला कोणते भिंग योग्य आहेत आणि त्यांचा खर्च किती?' },
        { en: 'Will I still need glasses, and for what?', mr: 'मला नंतरही चष्मा लागेल का, आणि कशासाठी?' } ],
      { h: { en: 'How families can help', mr: 'कुटुंबीय कशी मदत करू शकतात' } },
      { en: 'Older patients often find it reassuring to have a family member at the consultation to help remember the advice. After surgery, family members can help with eye drops, keep follow-up dates, and watch for warning signs such as increasing pain, redness or worsening vision.', mr: 'तपासणीच्या वेळी कुटुंबातील कोणी सोबत असल्यास ज्येष्ठ रुग्णांना दिलेला सल्ला लक्षात ठेवण्यास मदत होते आणि धीर मिळतो. शस्त्रक्रियेनंतर कुटुंबीय थेंब घालण्यास मदत करू शकतात, फॉलो-अपच्या तारखा लक्षात ठेवू शकतात आणि वाढती वेदना, लालसरपणा किंवा कमी होणारी दृष्टी अशा धोक्याच्या लक्षणांवर लक्ष ठेवू शकतात.' }
    ] },
  { slug: 'diabetes-and-your-eyes',
    title: { en: 'Diabetes and your eyes', mr: 'मधुमेह आणि आपले डोळे' },
    summary: { en: 'Why people with diabetes need regular eye checks even when vision seems normal.', mr: 'दृष्टी ठीक वाटत असतानाही मधुमेह असलेल्यांना डोळ्यांची नियमित तपासणी का आवश्यक आहे.' },
    body: [
      { en: 'Diabetes affects small blood vessels throughout the body, including those in the retina. Diabetic retinopathy often causes no symptoms until it is advanced, which is why a yearly retinal examination is commonly recommended for people with diabetes.', mr: 'मधुमेहाचा परिणाम शरीरातील, पडद्यातील रक्तवाहिन्यांसह, सर्व बारीक रक्तवाहिन्यांवर होतो. डायबेटिक रेटिनोपॅथीची लक्षणे आजार वाढेपर्यंत अनेकदा दिसत नाहीत, म्हणूनच मधुमेह असलेल्यांना दरवर्षी पडद्याची तपासणी करण्याचा सल्ला दिला जातो.' },
      { h: { en: 'Protecting your sight', mr: 'दृष्टीचे संरक्षण' } },
      [ { en: 'Keep blood sugar, blood pressure and cholesterol within the targets set by your physician', mr: 'रक्तातील साखर, रक्तदाब व कोलेस्टेरॉल आपल्या डॉक्टरांनी ठरवलेल्या मर्यादेत ठेवा' },
        { en: 'Have a dilated retinal examination at the interval your eye doctor advises', mr: 'नेत्रतज्ज्ञांनी सांगितलेल्या कालावधीने बाहुली मोठी करून पडद्याची तपासणी करा' },
        { en: 'Stop smoking', mr: 'धूम्रपान बंद करा' },
        { en: 'Report sudden blurring, floaters or dark patches promptly', mr: 'अचानक धूसरपणा, तरंगणारे ठिपके किंवा काळे डाग दिसल्यास लगेच कळवा' } ],
      { en: 'People with diabetes are also more likely to develop cataract at a younger age, and diabetes needs to be well controlled before and after cataract surgery.', mr: 'मधुमेह असलेल्यांना कमी वयात मोतीबिंदू होण्याची शक्यताही जास्त असते, आणि मोतीबिंदू शस्त्रक्रियेपूर्वी व नंतर मधुमेह नियंत्रणात असणे आवश्यक असते.' }
    ] },
  { slug: 'glaucoma-why-regular-checks-matter',
    title: { en: 'Glaucoma: why regular eye checks matter', mr: 'काचबिंदू: नियमित नेत्रतपासणी का महत्त्वाची' },
    summary: { en: 'Glaucoma can damage vision without warning. Here is who should be checked and how.', mr: 'काचबिंदू कोणतीही पूर्वसूचना न देता दृष्टीचे नुकसान करू शकतो. कोणी आणि कशी तपासणी करावी ते येथे वाचा.' },
    body: [
      { en: 'The most common form of glaucoma develops slowly and painlessly. Side vision is lost first, so many people do not notice anything until the damage is significant. Vision lost to glaucoma cannot usually be recovered, but early treatment can protect the sight that remains.', mr: 'काचबिंदूचा सर्वात सामान्य प्रकार हळूहळू आणि वेदनारहित वाढतो. आधी बाजूची दृष्टी कमी होते, त्यामुळे नुकसान लक्षणीय होईपर्यंत अनेकांना काही जाणवत नाही. काचबिंदूमुळे गेलेली दृष्टी साधारणपणे परत मिळत नाही, पण लवकर उपचार केल्यास उरलेली दृष्टी वाचवता येते.' },
      { h: { en: 'Who should be checked?', mr: 'कोणी तपासणी करावी?' } },
      [ { en: 'Everyone over 40, as part of a routine eye examination', mr: '४० वर्षांवरील प्रत्येकाने, नियमित नेत्रतपासणीचा भाग म्हणून' },
        { en: 'People with a parent, brother or sister with glaucoma', mr: 'आई-वडील किंवा भावंडांना काचबिंदू असलेल्यांनी' },
        { en: 'People with diabetes, high myopia or long-term steroid use', mr: 'मधुमेह, जास्त मायनस नंबर किंवा दीर्घकाळ स्टेरॉइड वापरणाऱ्यांनी' } ],
      { en: 'A glaucoma check includes measuring eye pressure and examining the optic nerve. Further tests such as a visual field test or optic nerve scan may be advised.', mr: 'काचबिंदू तपासणीत डोळ्यांचा दाब मोजणे आणि दृष्टिनसेची तपासणी यांचा समावेश असतो. गरजेनुसार दृष्टीक्षेत्र चाचणी किंवा दृष्टिनसेचे स्कॅन सुचवले जाऊ शकते.' }
    ] },
  { slug: 'screen-time-and-eye-strain',
    title: { en: 'Screen time and eye strain', mr: 'स्क्रीन टाइम आणि डोळ्यांवरील ताण' },
    summary: { en: 'Simple habits to keep your eyes comfortable when working on phones and computers.', mr: 'मोबाइल व कॉम्प्युटरवर काम करताना डोळे आरामदायी ठेवण्यासाठी सोप्या सवयी.' },
    body: [
      { en: 'Hours spent on phones, tablets and computers can leave eyes tired, dry and uncomfortable. This is usually temporary and improves with breaks, but it is a sign that your eyes need care.', mr: 'मोबाइल, टॅब्लेट आणि कॉम्प्युटरवर तासन् तास घालवल्याने डोळे थकलेले, कोरडे व अस्वस्थ वाटू शकतात. हे साधारणपणे तात्पुरते असते आणि विश्रांतीने कमी होते, पण डोळ्यांना काळजीची गरज आहे हे त्याचे लक्षण आहे.' },
      [ { en: 'Follow the 20-20-20 rule: every 20 minutes, look about 20 feet away for 20 seconds', mr: '२०-२०-२० नियम पाळा: दर २० मिनिटांनी सुमारे २० फूट दूर २० सेकंद पाहा' },
        { en: 'Blink fully and often', mr: 'पूर्ण आणि वारंवार पापण्या मिचकावा' },
        { en: 'Keep the screen at arm\'s length and slightly below eye level', mr: 'स्क्रीन हाताच्या अंतरावर आणि डोळ्यांच्या पातळीपेक्षा थोडी खाली ठेवा' },
        { en: 'Avoid air-conditioning or fans blowing directly at your face', mr: 'एसी किंवा पंख्याचा वारा थेट चेहऱ्यावर येऊ देऊ नका' },
        { en: 'Make sure your spectacle power is up to date', mr: 'चष्म्याचा नंबर अद्ययावत असल्याची खात्री करा' } ],
      { en: 'Children should be encouraged to spend time outdoors each day. If discomfort, headaches or blurred vision persist, have an eye examination.', mr: 'मुलांना दररोज घराबाहेर वेळ घालवण्यास प्रोत्साहन द्या. अस्वस्थता, डोकेदुखी किंवा धूसर दृष्टी कायम राहिल्यास डोळ्यांची तपासणी करून घ्या.' }
    ] }
];

const privacy = {
  title: { en: 'Privacy Policy', mr: 'गोपनीयता धोरण' },
  description: { en: 'How appointment requests and enquiries submitted to Dr. Anagha Deshpande\'s website are collected, used, protected and deleted.', mr: 'डॉ. अनघा देशपांडे यांच्या वेबसाइटवर दिलेली भेटीची विनंती व संदेश यांची माहिती कशी गोळा केली जाते, वापरली जाते, सुरक्षित ठेवली जाते व हटवली जाते.' },
  updated: '2026-10-20',
  body: [
    { en: 'This policy explains how personal information submitted through this website is collected, used and protected. It is written with regard to the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and related rules.', mr: 'या वेबसाइटद्वारे दिलेली वैयक्तिक माहिती कशी गोळा केली जाते, वापरली जाते व सुरक्षित ठेवली जाते हे या धोरणात सांगितले आहे. हे धोरण डिजिटल वैयक्तिक माहिती संरक्षण अधिनियम, २०२३ आणि माहिती तंत्रज्ञान अधिनियम, २००० व संबंधित नियम लक्षात घेऊन लिहिले आहे.' },
    { h: { en: 'Who is responsible for your data', mr: 'आपल्या माहितीसाठी जबाबदार कोण' } },
    { en: 'Dr. Anagha Deshpande, Consultant Ophthalmologist, Chembur, Mumbai, is responsible for personal data collected through this website. For questions or requests about your data, call the clinic you contacted (SRV Hospital: 8451800800; Just Care Heart & Eye Clinic: 8879758831).', mr: 'या वेबसाइटद्वारे गोळा केलेल्या वैयक्तिक माहितीसाठी डॉ. अनघा देशपांडे, कन्सल्टंट नेत्ररोगतज्ज्ञ, चेंबूर, मुंबई या जबाबदार आहेत. आपल्या माहितीविषयी प्रश्न किंवा विनंतीसाठी आपण संपर्क केलेल्या क्लिनिकला कॉल करा (एसआरव्ही हॉस्पिटल: 8451800800; जस्ट केअर हार्ट अँड आय क्लिनिक: 8879758831).' },
    { h: { en: 'What we collect', mr: 'आम्ही कोणती माहिती घेतो' } },
    [ { en: 'Appointment requests: patient name, mobile number, preferred clinic, date and time, reason for consultation (chosen from a short list), preferred language and an optional message.', mr: 'भेटीची विनंती: रुग्णाचे नाव, मोबाइल क्रमांक, पसंतीचे क्लिनिक, तारीख व वेळ, भेटीचे कारण (छोट्या यादीतून निवडलेले), पसंतीची भाषा आणि ऐच्छिक संदेश.' },
      { en: 'Contact enquiries: name, mobile number and your message.', mr: 'संपर्क संदेश: नाव, मोबाइल क्रमांक आणि आपला संदेश.' },
      { en: 'Basic technical information needed to keep the website secure, such as IP address in short-lived security logs. We do not use advertising or tracking cookies.', mr: 'वेबसाइट सुरक्षित ठेवण्यासाठी आवश्यक मूलभूत तांत्रिक माहिती, उदा. अल्पकालीन सुरक्षा नोंदींमध्ये आयपी पत्ता. आम्ही जाहिरात किंवा ट्रॅकिंग कुकीज वापरत नाही.' } ],
    { en: 'We do not ask for detailed medical history or medical reports through the website. Please do not include them in messages.', mr: 'आम्ही वेबसाइटद्वारे सविस्तर वैद्यकीय इतिहास किंवा रिपोर्ट मागत नाही. कृपया ते संदेशात लिहू नका.' },
    { h: { en: 'How we use it', mr: 'माहितीचा वापर कसा होतो' } },
    { en: 'Your information is used only to respond to your request: to contact you by phone or WhatsApp, to confirm, reschedule or cancel an appointment, and to answer your enquiry. It is processed on the basis of your consent, which you give when you submit the form.', mr: 'आपली माहिती फक्त आपल्या विनंतीला उत्तर देण्यासाठी वापरली जाते: फोन किंवा व्हॉट्सॲपवर संपर्क करणे, भेट निश्चित करणे, बदलणे किंवा रद्द करणे आणि आपल्या प्रश्नाचे उत्तर देणे. फॉर्म पाठवताना आपण दिलेल्या संमतीच्या आधारे ही प्रक्रिया होते.' },
    { h: { en: 'Who can see it', mr: 'माहिती कोण पाहू शकते' } },
    { en: 'Only Dr. Deshpande and authorised clinic staff who manage appointments, using individual password-protected accounts. We do not sell your data or share it with advertising platforms. If you contact a clinic on WhatsApp, WhatsApp\'s own privacy policy also applies to that conversation.', mr: 'फक्त डॉ. देशपांडे आणि भेटींचे व्यवस्थापन करणारे अधिकृत कर्मचारी, वैयक्तिक पासवर्ड-संरक्षित खात्यांद्वारे. आम्ही आपली माहिती विकत नाही किंवा जाहिरात प्लॅटफॉर्मना देत नाही. आपण व्हॉट्सॲपवर क्लिनिकशी संपर्क केल्यास त्या संभाषणाला व्हॉट्सॲपचे गोपनीयता धोरणही लागू होते.' },
    { h: { en: 'How we protect it', mr: 'माहितीचे संरक्षण कसे होते' } },
    { en: 'The website uses HTTPS encryption. Appointment records are stored encrypted, access is restricted by role, staff actions are logged, and backups are kept securely.', mr: 'वेबसाइट HTTPS एन्क्रिप्शन वापरते. भेटींच्या नोंदी एन्क्रिप्ट करून ठेवल्या जातात, भूमिकेनुसार प्रवेश मर्यादित आहे, कर्मचाऱ्यांच्या कृतींची नोंद ठेवली जाते आणि बॅकअप सुरक्षितपणे ठेवले जातात.' },
    { h: { en: 'How long we keep it', mr: 'माहिती किती काळ ठेवली जाते' } },
    { en: 'Website appointment requests and enquiries are deleted automatically 12 months after the appointment or enquiry date, unless a longer period is required by law. Your clinical records at the clinic are maintained separately under applicable medical record rules.', mr: 'वेबसाइटवरील भेटीच्या विनंत्या व संदेश, कायद्याने जास्त काळ आवश्यक नसल्यास, भेटीच्या किंवा संदेशाच्या तारखेपासून १२ महिन्यांनी आपोआप हटवले जातात. क्लिनिकमधील आपल्या वैद्यकीय नोंदी लागू नियमांनुसार स्वतंत्रपणे ठेवल्या जातात.' },
    { h: { en: 'Your rights', mr: 'आपले अधिकार' } },
    { en: 'You may ask to see, correct or delete the information you submitted, or withdraw your consent, by calling the clinic. Withdrawing consent does not affect care already arranged, but we may not be able to process an online request without it. You may also raise a grievance with the clinic, and, if unresolved, with the Data Protection Board of India.', mr: 'क्लिनिकला कॉल करून आपण दिलेली माहिती पाहणे, दुरुस्त करणे किंवा हटवणे, अथवा संमती मागे घेणे याची विनंती करू शकता. संमती मागे घेतल्याने आधी ठरलेल्या उपचारांवर परिणाम होत नाही, पण संमतीशिवाय ऑनलाइन विनंतीवर प्रक्रिया करता येणार नाही. आपण क्लिनिककडे तक्रार करू शकता आणि ती न सुटल्यास भारतीय डेटा संरक्षण मंडळाकडे दाद मागू शकता.' },
    { h: { en: 'Children', mr: 'मुले' } },
    { en: 'Appointment requests for children under 18 should be submitted by a parent or guardian.', mr: '१८ वर्षांखालील मुलांसाठी भेटीची विनंती पालक किंवा संरक्षकांनी करावी.' },
    { h: { en: 'Analytics', mr: 'विश्लेषण' } },
    { en: 'If website analytics are enabled, we use a privacy-friendly, cookie-free service that counts page visits without identifying you. Appointment and enquiry details are never sent to analytics services.', mr: 'वेबसाइट विश्लेषण सुरू असल्यास, आम्ही आपली ओळख न पटवता फक्त पृष्ठभेटी मोजणारी, कुकीविरहित, गोपनीयतेचा आदर करणारी सेवा वापरतो. भेटीची किंवा संदेशाची माहिती विश्लेषण सेवांना कधीही पाठवली जात नाही.' }
  ]
};

const disclaimer = {
  title: { en: 'Medical Disclaimer', mr: 'वैद्यकीय अस्वीकरण' },
  description: { en: 'Information on this eye care website is for general education and does not replace an examination. Emergency guidance for sudden vision loss and eye injuries.', mr: 'या नेत्रसेवा वेबसाइटवरील माहिती सर्वसाधारण शिक्षणासाठी असून तपासणीला पर्याय नाही. अचानक दृष्टी जाणे व डोळ्यांच्या इजांसाठी आपत्कालीन मार्गदर्शन.' },
  body: [
    { en: 'The information on this website is provided for general education about eye health. It is not a substitute for a consultation, examination, diagnosis or treatment by a qualified ophthalmologist.', mr: 'या वेबसाइटवरील माहिती डोळ्यांच्या आरोग्याविषयी सर्वसाधारण शिक्षणासाठी दिली आहे. ती पात्र नेत्ररोगतज्ज्ञांकडून होणारी तपासणी, निदान किंवा उपचार यांना पर्याय नाही.' },
    [ { en: 'The website does not provide diagnoses and does not prescribe medicines.', mr: 'ही वेबसाइट निदान करत नाही आणि औषधे सुचवत नाही.' },
      { en: 'Do not start, stop or change any treatment based on information from this website. Speak to your doctor.', mr: 'या वेबसाइटवरील माहितीच्या आधारे कोणतेही उपचार सुरू, बंद किंवा बदलू नका. आपल्या डॉक्टरांशी बोला.' },
      { en: 'Every patient is different. Whether a treatment or surgery is suitable, and its likely results, can only be decided after an individual examination.', mr: 'प्रत्येक रुग्ण वेगळा असतो. एखादा उपचार किंवा शस्त्रक्रिया योग्य आहे का आणि त्याचे संभाव्य परिणाम काय असतील हे केवळ वैयक्तिक तपासणीनंतरच ठरवता येते.' },
      { en: 'The surgical experience figures on this website describe Dr. Deshpande\'s experience. They are not a promise or guarantee of any particular outcome.', mr: 'या वेबसाइटवरील शस्त्रक्रियांच्या अनुभवाचे आकडे डॉ. देशपांडे यांच्या अनुभवाचे वर्णन करतात. ते कोणत्याही विशिष्ट परिणामाचे वचन किंवा हमी नाहीत.' },
      { en: 'An online appointment request is not a confirmed appointment until the clinic confirms it.', mr: 'क्लिनिकने निश्चित करेपर्यंत ऑनलाइन भेटीची विनंती ही निश्चित भेट नसते.' } ],
    { h: { en: 'In an emergency', mr: 'आपत्कालीन स्थितीत' } },
    { en: 'For sudden loss of vision, severe eye pain, a chemical injury, an eye injury, or new flashes and floaters with a shadow over your vision, go to the nearest hospital emergency department immediately. Do not rely on this website or wait for an online appointment.', mr: 'अचानक दृष्टी जाणे, डोळ्यात तीव्र वेदना, रसायनामुळे इजा, डोळ्याला मार, किंवा नव्याने चमका व तरंगणारे ठिपके आणि दृष्टीवर सावली असल्यास त्वरित जवळच्या रुग्णालयाच्या आपत्कालीन विभागात जा. या वेबसाइटवर अवलंबून राहू नका किंवा ऑनलाइन भेटीची वाट पाहू नका.' },
    { en: 'Content on this website has been prepared for patients and is reviewed by Dr. Deshpande. While care is taken to keep it accurate and up to date, medical knowledge changes and no guarantee is given.', mr: 'या वेबसाइटवरील मजकूर रुग्णांसाठी तयार केला असून डॉ. देशपांडे यांनी त्याचे पुनरावलोकन केले आहे. तो अचूक व अद्ययावत ठेवण्याची काळजी घेतली जाते, पण वैद्यकीय ज्ञान बदलत असल्याने कोणतीही हमी दिली जात नाही.' }
  ]
};

module.exports = { cataract, articles, privacy, disclaimer };
