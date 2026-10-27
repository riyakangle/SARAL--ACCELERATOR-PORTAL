(function(){'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TODAY=new Date();TODAY.setHours(0,0,0,0);
const TIMES=['09:00','10:00','14:00','16:00'],LABS=['Quantum Clinical Lab','Bhartiya Herbal Testing'];
const SCHEMES=[{n:'Startup India Seed Fund',s:'Idea, Prototype',a:'Up to ₹50 lakh'},{n:'AYUSH Innovation Grant',s:'Prototype, Pilot',a:'Up to ₹25 lakh'},{n:'Clinical Validation Support',s:'Pilot, Revenue',a:'Lab fee subsidy'}];
const MENTORS=[{n:'Dr. Meera Rao',d:'Ayurveda',f:'Regulatory approvals'},{n:'Prof. Arjun Iyer',d:'Unani',f:'Clinical validation'},{n:'Dr. Kavya Nair',d:'Siddha',f:'Product and IP'},{n:'Vikram Shah',d:'Homoeopathy',f:'Fundraising'}];
const GUIDE=[{w:['licence','license'],a:'A manufacturing licence needs an incorporation certificate, a factory plan and GMP status. Add them under Documents.'},{w:['lab','cancel'],a:'If a lab cancels, book a free slot again from the Labs page.'},{w:['reject'],a:'Open Documents, choose Replace, and upload a clear copy. Review checks it next.'},{w:['fund','grant','seed'],a:'Funding lists schemes for your stage. Choose Apply on any scheme.'}];
// Static page links are defined in the HTML.
document.querySelectorAll("[data-nav]").forEach(a=>{if(a.dataset.nav===document.body.dataset.page)a.setAttribute("aria-current","page")});
const page=document.body.dataset.page||location.pathname.split('/').pop()||'index.html';

/* Supabase persistence */
const SUPABASE_URL='https://vmsyjcxvrplbmjvrfeio.supabase.co';
const SUPABASE_KEY='sb_publishable_7s9IsCxplQSAnifyAenVMQ_khvvei2t';
let db=null,uid=null,seq=1,localMode=false;
const localAuthListeners=[];
const memoryStore=Object.create(null);
const storeGet=key=>{try{return window.localStorage?.getItem(key)??memoryStore[key]??null}catch(e){return memoryStore[key]??null}};
const storeSet=(key,value)=>{try{if(window.localStorage){window.localStorage.setItem(key,value);return}}catch(e){}memoryStore[key]=value};
const storeRemove=key=>{try{window.localStorage?.removeItem(key)}catch(e){}delete memoryStore[key]};
const localRead=(key,fallback)=>{try{return JSON.parse(storeGet(key)||JSON.stringify(fallback))}catch(e){return fallback}};
const localWrite=(key,value)=>storeSet(key,JSON.stringify(value));
const localUid=email=>'local-'+encodeURIComponent(email).replace(/%/g,'_');
const localRecords=n=>`saral-local-records:${uid}:${n}`;
const HI={
  'SARAL · AYUSH Startup Portal':'सरल · आयुष स्टार्टअप पोर्टल','Licences · Labs · Funding · Mentors':'लाइसेंस · प्रयोगशालाएँ · वित्तपोषण · मार्गदर्शक','Launch your AYUSH startup with confidence':'आत्मविश्वास के साथ अपना आयुष स्टार्टअप शुरू करें','SARAL · AYUSH Startup Portal':'सरल · आयुष स्टार्टअप पोर्टल','SARAL · Profile':'सरल · प्रोफ़ाइल','SARAL · Dashboard':'सरल · डैशबोर्ड','SARAL · Documents':'सरल · दस्तावेज़','SARAL · Labs':'सरल · प्रयोगशालाएँ','SARAL · Funding':'सरल · वित्तपोषण','SARAL · Mentors':'सरल · मार्गदर्शक','SARAL · Review':'सरल · समीक्षा','SARAL · AI Guide':'सरल · एआई मार्गदर्शिका','SARAL · Applications':'सरल · आवेदन','SARAL · Notifications':'सरल · सूचनाएँ','SARAL · Settings':'सरल · सेटिंग्स',
  'SARAL account':'सरल खाता','Log in':'लॉग इन करें','Create account':'खाता बनाएँ','Email':'ईमेल','Password':'पासवर्ड','Confirm password':'पासवर्ड की पुष्टि करें','Home':'होम','Profile':'प्रोफ़ाइल','Dashboard':'डैशबोर्ड','Documents':'दस्तावेज़','Labs':'प्रयोगशालाएँ','Funding':'वित्तपोषण','Mentors':'मार्गदर्शक','Review':'समीक्षा','AI guide':'एआई मार्गदर्शिका','Applications':'आवेदन','Notifications':'सूचनाएँ','Settings':'सेटिंग्स','Sign out':'लॉग आउट','Theme':'थीम','AYUSH Startup Registration & Accelerator Portal':'आयुष स्टार्टअप पंजीकरण एवं एक्सेलरेटर पोर्टल',
  'Launch your AYUSH startup with confidence.':'आत्मविश्वास के साथ अपना आयुष स्टार्टअप शुरू करें।','Track licences, book testing labs, apply for funding and learn from mentors, all in one place.':'लाइसेंस की स्थिति देखें, परीक्षण प्रयोगशालाएँ बुक करें, वित्तपोषण के लिए आवेदन करें और मार्गदर्शकों से सीखें—सब कुछ एक ही जगह।','Create profile':'प्रोफ़ाइल बनाएँ','Open dashboard':'डैशबोर्ड खोलें','Upload, renew and track verification.':'दस्तावेज़ अपलोड करें, नवीनीकरण करें और सत्यापन देखें।','Book clinical and herbal testing slots.':'क्लिनिकल और हर्बल परीक्षण का समय बुक करें।','Schemes matched to your stage.':'आपके चरण के अनुरूप योजनाएँ।',
  'Startup profile':'स्टार्टअप प्रोफ़ाइल','Saved to your account.':'आपके खाते में सहेजा गया।','Startup name':'स्टार्टअप का नाम','Domain':'क्षेत्र','Choose':'चुनें','Ayurveda':'आयुर्वेद','Yoga & Naturopathy':'योग एवं प्राकृतिक चिकित्सा','Unani':'यूनानी','Siddha':'सिद्ध','Homoeopathy':'होम्योपैथी','Founder name':'संस्थापक का नाम','Save profile':'प्रोफ़ाइल सहेजें',
  'Compliance readiness':'अनुपालन की तैयारी','Share of documents verified.':'सत्यापित दस्तावेज़ों का अनुपात।','Next lab slot':'अगली प्रयोगशाला बुकिंग','Renewals':'नवीनीकरण','Expiry':'समाप्ति तिथि','Status':'स्थिति','Actions':'कार्रवाई','Upload document':'दस्तावेज़ अपलोड करें','Type':'प्रकार','Drug manufacturing licence':'औषधि निर्माण लाइसेंस','GMP certificate':'जीएमपी प्रमाणपत्र','Patent certificate':'पेटेंट प्रमाणपत्र','Lab test report':'प्रयोगशाला परीक्षण रिपोर्ट','Incorporation certificate':'निगमन प्रमाणपत्र','File (PDF, JPG or PNG)':'फ़ाइल (PDF, JPG या PNG)','Upload':'अपलोड करें','Cancel':'रद्द करें','Lab slots on 24 October 2026':'24 अक्टूबर 2026 की प्रयोगशाला बुकिंग','Lab':'प्रयोगशाला','Morning':'सुबह','Afternoon':'दोपहर','Schemes for your stage':'आपके चरण के लिए योजनाएँ',
  'Search mentors':'मार्गदर्शक खोजें','All domains':'सभी क्षेत्र','Document':'दस्तावेज़','Decision':'निर्णय','Ask about licences, labs, documents or funding.':'लाइसेंस, प्रयोगशालाओं, दस्तावेज़ों या वित्तपोषण के बारे में पूछें।','Type a question':'अपना प्रश्न लिखें','Your question':'आपका प्रश्न','Send':'भेजें','Licence documents':'लाइसेंस के दस्तावेज़','Lab cancelled':'प्रयोगशाला बुकिंग रद्द हुई','Rejected document':'अस्वीकृत दस्तावेज़',
  'Application tracking':'आवेदन की स्थिति','Follow your startup journey from profile creation to review.':'प्रोफ़ाइल बनाने से समीक्षा तक अपने स्टार्टअप की प्रगति देखें।','Not started':'शुरू नहीं हुआ','Startup information':'स्टार्टअप की जानकारी','Records submitted':'जमा किए गए रिकॉर्ड','Laboratory':'प्रयोगशाला','Next booked slot':'अगली बुकिंग','Application journey':'आवेदन की प्रक्रिया','1. Create profile':'1. प्रोफ़ाइल बनाएँ','Add your startup and founder details.':'अपने स्टार्टअप और संस्थापक का विवरण जोड़ें।','Complete':'पूरा','2. Submit documents':'2. दस्तावेज़ जमा करें','Upload licences and supporting records.':'लाइसेंस और सहायक दस्तावेज़ अपलोड करें।','In progress':'जारी है','3. Complete review':'3. समीक्षा पूरी करें','A reviewer verifies pending documents.':'समीक्षक लंबित दस्तावेज़ों का सत्यापन करता है।','Pending':'लंबित','4. Official decision':'4. आधिकारिक निर्णय','Final approvals remain with the relevant authority.':'अंतिम स्वीकृति संबंधित प्राधिकरण द्वारा दी जाएगी।','Authority':'प्राधिकरण',
  'Important updates for your startup workspace.':'आपके स्टार्टअप कार्यक्षेत्र के महत्वपूर्ण अपडेट।','Settings and account':'सेटिंग्स और खाता','Manage your display preferences and account session.':'दिखावट की प्राथमिकताएँ और खाता सत्र प्रबंधित करें।','Appearance':'दिखावट','Switch between light and dark mode for the portal.':'पोर्टल के लाइट और डार्क मोड में बदलें।','Change theme':'थीम बदलें','Language':'भाषा','Choose the language used throughout the portal.':'पूरे पोर्टल के लिए भाषा चुनें।','Portal language':'पोर्टल की भाषा','English':'अंग्रेज़ी','हिन्दी':'हिन्दी','Your signed-in account is used for profiles, documents, bookings and applications.':'आपका साइन-इन खाता प्रोफ़ाइल, दस्तावेज़, बुकिंग और आवेदनों के लिए उपयोग होता है।','Account details load after sign in.':'साइन इन करने के बाद खाते का विवरण दिखेगा।','Data and privacy':'डेटा और गोपनीयता','Portal records are stored in your connected Supabase account. Uploaded files use the portal document storage bucket.':'पोर्टल के रिकॉर्ड आपके जुड़े हुए Supabase खाते में सहेजे जाते हैं। अपलोड की गई फ़ाइलें पोर्टल के दस्तावेज़ भंडारण में रखी जाती हैं।',
  'Connected · saved to Supabase':'जुड़ा हुआ · Supabase में सहेजा गया','Local demo · saved in browser':'स्थानीय डेमो · ब्राउज़र में सहेजा गया','Sign in to save data':'डेटा सहेजने के लिए साइन इन करें','Connecting…':'कनेक्ट हो रहा है…','Supabase is unavailable here. Local browser mode is ready.':'यहाँ Supabase उपलब्ध नहीं है। स्थानीय ब्राउज़र मोड तैयार है।','Signed in successfully.':'सफलतापूर्वक साइन इन हुआ।','Passwords do not match.':'पासवर्ड मेल नहीं खाते।','Account created. Check your email to confirm, then log in.':'खाता बन गया। पुष्टि के लिए ईमेल देखें, फिर लॉग इन करें।','Authentication failed.':'प्रमाणीकरण विफल हुआ।','Something went wrong':'कुछ गड़बड़ हुई।','Light mode':'लाइट मोड','Dark mode':'डार्क मोड','An account with this email already exists.':'इस ईमेल से खाता पहले से मौजूद है।','Invalid local email or password. Create an account first.':'स्थानीय ईमेल या पासवर्ड गलत है। पहले खाता बनाएँ।','No mentors match':'कोई मार्गदर्शक मेल नहीं खाता','Startup India Seed Fund':'स्टार्टअप इंडिया सीड फंड','AYUSH Innovation Grant':'आयुष नवाचार अनुदान','Clinical Validation Support':'क्लिनिकल सत्यापन सहायता','Idea, Prototype':'विचार, प्रोटोटाइप','Prototype, Pilot':'प्रोटोटाइप, पायलट','Pilot, Revenue':'पायलट, राजस्व','Up to ₹50 lakh':'₹50 लाख तक','Up to ₹25 lakh':'₹25 लाख तक','Lab fee subsidy':'प्रयोगशाला शुल्क में सहायता','Regulatory approvals':'नियामकीय स्वीकृतियाँ','Clinical validation':'क्लिनिकल सत्यापन','Product and IP':'उत्पाद और बौद्धिक संपदा','Fundraising':'निधि जुटाना','Document review reminder':'दस्तावेज़ समीक्षा अनुस्मारक','Document replacement needed':'दस्तावेज़ बदलना आवश्यक','Book a laboratory slot':'प्रयोगशाला का समय बुक करें','Laboratory booking saved':'प्रयोगशाला बुकिंग सहेजी गई','Funding discovery':'वित्तपोषण योजनाएँ देखें','Action needed':'कार्रवाई आवश्यक','Confirmed':'पुष्टि हुई','New':'नई','Info':'जानकारी','None':'कोई नहीं','Dashboard':'डैशबोर्ड',
  'verified':'सत्यापित','rejected':'अस्वीकृत','No slot booked':'कोई बुकिंग नहीं','No expiry dates yet':'अभी कोई समाप्ति तिथि नहीं','No documents yet.':'अभी कोई दस्तावेज़ नहीं।','No mentors match':'कोई मार्गदर्शक मेल नहीं खाता','Replace':'बदलें','Delete':'हटाएँ','Save':'सहेजें','Saved. Pending review':'सहेजा गया। समीक्षा लंबित है','Uploaded. Pending review':'अपलोड हुआ। समीक्षा लंबित है','Deleted':'हटा दिया गया','Choose a file':'फ़ाइल चुनें','Use a PDF, JPG or PNG file':'PDF, JPG या PNG फ़ाइल चुनें','Expiry must be today or later':'समाप्ति तिथि आज या उसके बाद की होनी चाहिए','Sample data loaded':'नमूना डेटा लोड हुआ','Slot booked':'समय बुक हुआ','Booking cancelled':'बुकिंग रद्द हुई','Applied':'आवेदन किया गया','Apply':'आवेदन करें','Application sent':'आवेदन भेजा गया','Requested':'अनुरोध भेजा गया','Request':'अनुरोध करें','Request sent':'अनुरोध भेजा गया','Approve':'स्वीकृत करें','Reject':'अस्वीकृत करें','Approved':'स्वीकृत','Rejected':'अस्वीकृत','Nothing to review':'समीक्षा के लिए कुछ नहीं है','Profile saved':'प्रोफ़ाइल सहेजी गई','Complete':'पूरा','No profile email saved.':'प्रोफ़ाइल ईमेल सहेजा नहीं गया है।','Signed-in profile:':'साइन-इन प्रोफ़ाइल:','Open AI guide':'एआई मार्गदर्शिका खोलें','Hi. What do you need help with?':'नमस्ते। आपको किस बारे में सहायता चाहिए?','Try asking about licences, labs, documents or funding.':'लाइसेंस, प्रयोगशालाओं, दस्तावेज़ों या वित्तपोषण के बारे में पूछें।',
  'A manufacturing licence needs an incorporation certificate, a factory plan and GMP status. Add them under Documents.':'निर्माण लाइसेंस के लिए निगमन प्रमाणपत्र, फैक्टरी योजना और जीएमपी स्थिति चाहिए। इन्हें दस्तावेज़ अनुभाग में जोड़ें।','If a lab cancels, book a free slot again from the Labs page.':'यदि प्रयोगशाला बुकिंग रद्द हो जाए, तो प्रयोगशाला पृष्ठ से दूसरा उपलब्ध समय बुक करें।','Open Documents, choose Replace, and upload a clear copy. Review checks it next.':'दस्तावेज़ खोलें, बदलें चुनें और स्पष्ट प्रति अपलोड करें। फिर उसकी समीक्षा होगी।','Funding lists schemes for your stage. Choose Apply on any scheme.':'वित्तपोषण पृष्ठ पर आपके चरण के अनुरूप योजनाएँ हैं। किसी योजना पर आवेदन करें।'
};
let currentLanguage='en';
let originalTitle='';
const originalTextNodes=new WeakMap(),originalAttributes=new WeakMap();
function translatePhrase(value){
  if(currentLanguage!=='hi')return value;
  if(HI[value])return HI[value];
  let m=value.match(/^(\d+) documents$/);if(m)return `${m[1]} दस्तावेज़`;
  m=value.match(/^(\d+) verified$/);if(m)return `${m[1]} सत्यापित`;
  m=value.match(/^(\d+) pending$/);if(m)return `${m[1]} लंबित`;
  m=value.match(/^(\d+) rejected$/);if(m)return `${m[1]} अस्वीकृत`;
  m=value.match(/^(\d+) booked$/);if(m)return `${m[1]} बुकिंग`;
  m=value.match(/^24 Oct 2026 · (\d+) booked$/);if(m)return `24 अक्टूबर 2026 · ${m[1]} बुकिंग`;
  m=value.match(/^(\d+) document\(s\) are waiting for review\.$/);if(m)return `${m[1]} दस्तावेज़ समीक्षा की प्रतीक्षा में हैं।`;
  m=value.match(/^(\d+) document\(s\) were rejected\. Replace the affected files\.$/);if(m)return `${m[1]} दस्तावेज़ अस्वीकृत हुए। संबंधित फ़ाइलें बदलें।`;
  m=value.match(/^(\d+) document\(s\) still need review\.$/);if(m)return `${m[1]} दस्तावेज़ों की समीक्षा अभी बाकी है।`;
  m=value.match(/^Signed in as (.+)$/);if(m)return `साइन इन किया है: ${m[1]}`;
  return value;
}
function translatePage(root=document.body){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('script,style')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let node;
  while((node=walker.nextNode())){
    if(!originalTextNodes.has(node))originalTextNodes.set(node,node.data);
    const source=originalTextNodes.get(node),trimmed=source.trim();if(!trimmed)continue;
    const translated=translatePhrase(trimmed);if(translated!==trimmed)node.data=source.replace(trimmed,translated);else if(currentLanguage==='en'&&node.data!==source)node.data=source;
  }
  const elements=root.nodeType===Node.ELEMENT_NODE?[root,...root.querySelectorAll('*')]:[...root.parentElement?.querySelectorAll('*')||[]];
  for(const el of elements){
    for(const attr of ['placeholder','aria-label','title']){
      if(!el.hasAttribute?.(attr))continue;
      let saved=originalAttributes.get(el);if(!saved){saved={};originalAttributes.set(el,saved)}
      if(!(attr in saved))saved[attr]=el.getAttribute(attr);
      const original=saved[attr],translated=translatePhrase(original);if(el.getAttribute(attr)!==translated)el.setAttribute(attr,translated);
    }
  }
}
function setLanguage(language){
  currentLanguage=language==='hi'?'hi':'en';storeSet('saral-language',currentLanguage);
  document.documentElement.lang=currentLanguage==='hi'?'hi':'en';document.title=translatePhrase(originalTitle);translatePage();
  const picker=$('#languageSelect');if(picker&&picker.value!==currentLanguage)picker.value=currentLanguage;
  themeLabel();
}
function initLanguage(){
  currentLanguage=storeGet('saral-language')==='hi'?'hi':'en';
  originalTitle=document.title;document.documentElement.lang=currentLanguage==='hi'?'hi':'en';document.title=translatePhrase(originalTitle);
  const picker=$('#languageSelect');if(picker){picker.value=currentLanguage;picker.addEventListener('change',()=>setLanguage(picker.value))}
  translatePage();
  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE)translatePage(n);else if(n.nodeType===Node.TEXT_NODE)translatePage(n.parentElement||document.body)}))).observe(document.body,{childList:true,subtree:true});
}
async function localHash(value){
  if(window.crypto?.subtle){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  return btoa(unescape(encodeURIComponent(value)));
}
function localSession(){const email=storeGet('saral-local-session');return email?{user:{id:localUid(email),email}}:null}
function notifyLocalAuth(event,session){localAuthListeners.slice().forEach(fn=>fn(event,session))}
function localDb(){return {auth:{
  async getSession(){return {data:{session:localSession()},error:null}},
  onAuthStateChange(fn){localAuthListeners.push(fn);return {data:{subscription:{unsubscribe(){const i=localAuthListeners.indexOf(fn);if(i>=0)localAuthListeners.splice(i,1)}}}}},
  async signUp({email,password}){const users=localRead('saral-local-users',{});if(users[email])return {data:{session:null},error:{message:'An account with this email already exists.'}};users[email]={password:await localHash(password)};localWrite('saral-local-users',users);storeSet('saral-local-session',email);const session=localSession();notifyLocalAuth('SIGNED_IN',session);return {data:{session},error:null}},
  async signInWithPassword({email,password}){const users=localRead('saral-local-users',{}),user=users[email];if(!user||user.password!==await localHash(password))return {data:{session:null},error:{message:'Invalid local email or password. Create an account first.'}};storeSet('saral-local-session',email);const session=localSession();notifyLocalAuth('SIGNED_IN',session);return {data:{session},error:null}},
  async signOut(){storeRemove('saral-local-session');notifyLocalAuth('SIGNED_OUT',null);return {error:null}}
},storage:{from(){return {async upload(){return {data:{},error:null}}}}}}}
function authMessage(s,bad){const e=$('#authMessage');e.textContent=s;e.classList.toggle('err',!!bad)}
function setSession(s){uid=s?.user?.id||null;$('#authGate').hidden=!!uid;$('.app').hidden=!uid;const b=$('#dbb');b.classList.toggle('on',!!uid);b.querySelector('span').textContent=uid?(localMode?'Local demo · saved in browser':'Connected · saved to Supabase'):'Sign in to save data';if(uid){authMessage('Signed in as '+s.user.email);initPage()}}
async function initDb(){
  authMessage('Connecting…');
  try{
    if(!window.supabase?.createClient||!window.localStorage)throw Error('Supabase browser storage is unavailable');
    db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const {data:{session}}=await db.auth.getSession();setSession(session);db.auth.onAuthStateChange((_e,s)=>setSession(s));
  }catch(e){
    localMode=true;db=localDb();const {data:{session}}=await db.auth.getSession();setSession(session);
    if(!session)authMessage('Supabase is unavailable here. Local browser mode is ready.');
  }
}
let authMode='signin';
function chooseAuthMode(mode){
  authMode=mode;const f=$('#authForm');f.elements.mode.value=mode;
  $('#pwConfirmWrap').hidden=mode!=='signup';
  f.elements.confirmPassword.required=mode==='signup';
  f.elements.password.autocomplete=mode==='signup'?'new-password':'current-password';
  $('#authSubmit').textContent=mode==='signup'?'Create account':'Log in';
  $$('[data-auth-mode]').forEach(b=>{const active=b.dataset.authMode===mode;b.setAttribute('aria-pressed',String(active));b.classList.toggle('primary',active)});
  authMessage('');
}
$$('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>chooseAuthMode(b.dataset.authMode)));
$('#authForm').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget,btn=$('#authSubmit');
  const email=f.elements.email.value.trim().toLowerCase(),password=f.elements.password.value;
  if(authMode==='signup'&&password!==f.elements.confirmPassword.value){authMessage('Passwords do not match.',true);f.elements.confirmPassword.focus();return}
  btn.disabled=true;
  try{
    const r=authMode==='signup'?await db.auth.signUp({email,password}):await db.auth.signInWithPassword({email,password});
    if(r.error)throw r.error;
    if(authMode==='signup'&&!r.data.session)authMessage('Account created. Check your email to confirm, then log in.');
    else authMessage('Signed in successfully.');
  }catch(x){authMessage(x.message||'Authentication failed.',true)}
  finally{btn.disabled=false}
});
$('#signOutBtn').addEventListener('click',async()=>{const {error}=await db.auth.signOut();if(error)authMessage(error.message,true)});
async function list(n){if(localMode){const rows=localRead(localRecords(n),{});return Object.values(rows).sort((a,b)=>a.updated_at.localeCompare(b.updated_at)).map(r=>({id:r.item_id,...r.payload}))}const {data,error}=await db.from('portal_records').select('item_id,payload').eq('collection',n).order('updated_at');if(error)throw error;return(data||[]).map(r=>({id:r.item_id,...r.payload}))}
async function put(n,id,payload){if(localMode){const rows=localRead(localRecords(n),{});rows[id]={item_id:id,payload,updated_at:new Date().toISOString()};localWrite(localRecords(n),rows);return}const {error}=await db.from('portal_records').upsert({user_id:uid,collection:n,item_id:id,payload,updated_at:new Date().toISOString()},{onConflict:'user_id,collection,item_id'});if(error)throw error}
async function add(n,payload){const id='i'+Date.now().toString(36)+(seq++);await put(n,id,payload);return id}
async function upd(n,id,p){const r=(await list(n)).find(x=>x.id===id);if(!r)throw Error('Record not found');delete r.id;await put(n,id,{...r,...p})}
async function del(n,id){if(localMode){const rows=localRead(localRecords(n),{});delete rows[id];localWrite(localRecords(n),rows);return}const {error}=await db.from('portal_records').delete().eq('collection',n).eq('item_id',id);if(error)throw error}
/* ---------- Helpers ---------- */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
const err=e=>toast(e&&e.message?e.message:'Something went wrong');
const pill=(t,c)=>`<span class="pill ${c||''}">${esc(t)}</span>`;
const days=d=>d?Math.round((new Date(d+'T00:00:00')-TODAY)/864e5):null;
function expPill(d){const n=days(d.expiry);return n===null?'':n<0?pill('Expired','bad'):n<=30?pill(n+' days','warn'):pill(n+' days','ok')}
const stPill=d=>pill(d.status,{Verified:'ok',Pending:'warn',Rejected:'bad'}[d.status]);
function empty(msg,btn){return `<div class="empty">${msg}${btn?`<div style="margin-top:12px"><button class="btn sm primary" type="button" data-sample>Load sample data</button></div>`:''}</div>`}
async function loadSample(){
  const docs=[['Drug manufacturing licence','2027-03-31','Verified',''],['GMP certificate','2026-10-28','Verified',''],['Lab test report','2026-12-30','Pending',''],['Incorporation certificate','','Rejected','Unreadable scan'],['Patent certificate','','Pending','']];
  for(const d of docs)await add('documents',{name:d[0],expiry:d[1],status:d[2],reason:d[3]});
  await put('bookings','b01',{lab:LABS[0],time:'10:00'});toast('Sample data loaded');initPage()}

/* ---------- Theme ---------- */
function eff(){const t=document.documentElement.dataset.theme;return t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}
function themeLabel(){$('#themeBtn').textContent=currentLanguage==='hi'?(eff()==='dark'?'☀ लाइट मोड':'☾ डार्क मोड'):(eff()==='dark'?'☀ Light mode':'☾ Dark mode')}
$('#themeBtn').onclick=()=>{const n=eff()==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('saral-theme',n)}catch(e){}themeLabel()};
themeLabel();

/* ---------- Navigation ---------- */
let cur=page.replace('.html','');
function go(n){const routes={home:'index.html',profile:'profile.html'};location.href=routes[n]||n+'.html'}
$('#chatFab').addEventListener('click',()=>{location.href='guide.html'});
document.addEventListener('click',e=>{if(e.target.closest('[data-sample]'))loadSample().catch(err)});

/* ---------- Profile ---------- */
async function getProfile(){return (await list('profile'))[0]||null}
async function rProfile(){const p=await getProfile();if(p){const f=$('#profForm').elements;['name','domain','founder','email'].forEach(k=>f[k].value=p[k]||'')}}
if($('#profForm'))$('#profForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target;if(!f.checkValidity()){f.reportValidity();return}
  try{await put('profile','main',{name:f.elements.name.value.trim(),domain:f.elements.domain.value,founder:f.elements.founder.value.trim(),email:f.elements.email.value});toast('Profile saved');location.href='dashboard.html'}catch(x){err(x)}});

/* ---------- Dashboard ---------- */
function count(el,to,suf){let n=0;const step=()=>{n+=Math.max(1,Math.ceil((to-n)/6));if(n>=to)n=to;el.textContent=n+suf;if(n<to)requestAnimationFrame(step)};step()}
async function rDash(){
  const [docs,bks,p]=await Promise.all([list('documents'),list('bookings'),getProfile()]);
  $('#dashTitle').textContent=p?p.name:'Dashboard';$('#dashSub').textContent=p?p.founder+' · '+p.domain:'Create a profile to personalise this page.';
  const v=docs.filter(d=>d.status==='Verified').length,pe=docs.filter(d=>d.status==='Pending').length,r=docs.filter(d=>d.status==='Rejected').length;
  const pc=docs.length?Math.round(v/docs.length*100):0;$('#ring').style.setProperty('--p',pc);count($('#ringTxt'),pc,'%');
  $('#stV').textContent=v+' verified';$('#stP').textContent=pe+' pending';$('#stR').textContent=r+' rejected';
  $('#stNext').textContent=bks.length?bks[0].time:'None';$('#stBk').textContent=bks.length?bks[0].lab:'No slot booked';
  const rn=docs.filter(d=>d.expiry).sort((a,b)=>a.expiry<b.expiry?-1:1);
  $('#renewals').innerHTML=rn.length?rn.map(d=>`<li><span class="meta">${esc(d.name)}<br><span class="small muted">${esc(d.expiry)}</span></span>${expPill(d)}</li>`).join(''):`<li>${docs.length?'<span class="muted">No expiry dates yet</span>':empty('No documents yet.',1)}</li>`}

/* ---------- Documents (CRUD) ---------- */
let editing=null;
async function rDocs(){const docs=await list('documents');$('#docCount').textContent=docs.length+' documents';
  $('#docRows').innerHTML=docs.length?docs.map(d=>`<tr><td>${esc(d.name)}${d.reason?`<div class="small err">${esc(d.reason)}</div>`:''}</td><td>${esc(d.expiry||'—')}</td><td>${stPill(d)}</td><td class="act"><button class="btn sm ghost" type="button" data-edit="${esc(d.id)}">Replace</button> <button class="btn sm ghost danger" type="button" data-del="${esc(d.id)}">Delete</button></td></tr>`).join(''):`<tr><td colspan="4">${empty('No documents yet.',1)}</td></tr>`}
function resetDoc(){editing=null;$('#docForm').reset();$('#docFormTitle').textContent='Upload document';$('#docSubmit').textContent='Upload';$('#docCancel').hidden=true}
if($('#docCancel'))$('#docCancel').onclick=resetDoc;
if($('#docRows'))$('#docRows').addEventListener('click',async e=>{const ed=e.target.closest('[data-edit]'),dl=e.target.closest('[data-del]');
  try{if(ed){const d=(await list('documents')).find(x=>x.id===ed.dataset.edit);if(!d)return;editing=d.id;const f=$('#docForm').elements;f.name.value=d.name;f.expiry.value=d.expiry||'';
      $('#docFormTitle').textContent='Replace: '+d.name;$('#docSubmit').textContent='Save';$('#docCancel').hidden=false;f.name.scrollIntoView({block:'center'})}
    if(dl){await del('documents',dl.dataset.del);if(editing===dl.dataset.del)resetDoc();toast('Deleted');rDocs()}}catch(x){err(x)}});
if($('#docForm'))$('#docForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,x=f.elements.expiry.value,file=f.elements.file.files[0];
  x&&new Date(x+'T00:00:00')<TODAY?f.elements.expiry.setCustomValidity('Expiry must be today or later'):f.elements.expiry.setCustomValidity('');
  f.elements.file.setCustomValidity(!file&&editing===null?'Choose a file':file&&!/\.(pdf|jpe?g|png)$/i.test(file.name)?'Use a PDF, JPG or PNG file':'');
  if(!f.checkValidity()){f.reportValidity();return}
  try{const patch={expiry:x,status:'Pending',reason:''};if(file){const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_'),path=uid+'/'+Date.now()+'-'+safe;const {error:uploadError}=await db.storage.from('portal-documents').upload(path,file,{upsert:false,contentType:file.type});if(uploadError)throw uploadError;patch.file_path=path}
    if(editing!==null){await upd('documents',editing,patch);toast('Saved. Pending review')}
    else{const name=f.elements.name.value,ex=(await list('documents')).find(d=>d.name===name);
      if(ex)await upd('documents',ex.id,patch);else await add('documents',{name,...patch});toast('Uploaded. Pending review')}
    resetDoc();rDocs()}catch(z){err(z)}});

/* ---------- Labs ---------- */
async function rLabs(){const b=await list('bookings');$('#bookCount').textContent='24 Oct 2026 · '+b.length+' booked';
  $('#slotBody').innerHTML=LABS.map((lab,li)=>`<tr><th scope="row">${esc(lab)}</th>`+TIMES.map((t,ti)=>{const id='b'+li+ti,hit=b.find(x=>x.id===id);
    return `<td>${hit?`<button class="btn sm ghost danger" type="button" data-cancel="${id}">Cancel</button>`:`<button class="btn sm" type="button" data-book="${li}|${ti}">Book</button>`}</td>`}).join('')+'</tr>').join('')}
if($('#slotBody'))$('#slotBody').addEventListener('click',async e=>{const bk=e.target.closest('[data-book]'),cn=e.target.closest('[data-cancel]');
  try{if(bk){const[l,t]=bk.dataset.book.split('|');await put('bookings','b'+l+t,{lab:LABS[l],time:TIMES[t]});toast('Slot booked')}
    if(cn){await del('bookings',cn.dataset.cancel);toast('Booking cancelled')}rLabs()}catch(x){err(x)}});

/* ---------- Funding ---------- */
async function rFund(){const a=(await list('applications')).map(x=>x.id);
  $('#schemes').innerHTML=SCHEMES.map((s,i)=>{const done=a.includes('s'+i);return `<article class="card"><h3>${esc(s.n)}</h3><p class="small muted">${esc(s.s)}</p><strong>${esc(s.a)}</strong><div class="row"><button class="btn sm ${done?'':'primary'}" type="button" data-apply="${i}" ${done?'disabled':''}>${done?'Applied':'Apply'}</button></div></article>`}).join('')}
if($('#schemes'))$('#schemes').addEventListener('click',async e=>{const b=e.target.closest('[data-apply]');if(!b)return;
  try{await put('applications','s'+b.dataset.apply,{scheme:SCHEMES[b.dataset.apply].n});toast('Application sent');rFund()}catch(x){err(x)}});

/* ---------- Mentors ---------- */
async function rMentors(){const q=$('#mQ').value.trim().toLowerCase(),dm=$('#mD').value,req=(await list('requests')).map(x=>x.id);
  const rows=MENTORS.map((m,i)=>({m,i})).filter(({m})=>(!dm||m.d===dm)&&(!q||(m.n+' '+m.d+' '+m.f).toLowerCase().includes(q)));
  $('#mentorList').innerHTML=rows.length?rows.map(({m,i})=>{const d=req.includes('m'+i);return `<article class="card mcard"><div class="av">${esc(m.n.replace(/^(Dr\.|Prof\.)\s*/,'').split(' ').map(w=>w[0]).join('').slice(0,2))}</div><div><h3>${esc(m.n)}</h3><p class="small muted">${esc(m.d)} · ${esc(m.f)}</p></div><div class="row"><button class="btn sm" type="button" data-req="${i}" ${d?'disabled':''}>${d?'Requested':'Request'}</button></div></article>`}).join(''):'<p class="muted">No mentors match</p>'}
if($('#mQ'))$('#mQ').oninput=()=>rMentors().catch(err);if($('#mD'))$('#mD').onchange=()=>rMentors().catch(err);
if($('#mentorList'))$('#mentorList').addEventListener('click',async e=>{const b=e.target.closest('[data-req]');if(!b)return;
  try{await put('requests','m'+b.dataset.req,{mentor:MENTORS[b.dataset.req].n});toast('Request sent');rMentors()}catch(x){err(x)}});

/* ---------- Review ---------- */
async function rReview(){const p=(await list('documents')).filter(d=>d.status==='Pending');$('#revCount').textContent=p.length+' pending';
  $('#revRows').innerHTML=p.length?p.map(d=>`<tr><td>${esc(d.name)}</td><td>${esc(d.expiry||'—')}</td><td class="act"><button class="btn sm primary" type="button" data-ok="${esc(d.id)}">Approve</button> <button class="btn sm ghost danger" type="button" data-no="${esc(d.id)}">Reject</button></td></tr>`).join(''):'<tr><td colspan="3" class="muted">Nothing to review</td></tr>'}
if($('#revRows'))$('#revRows').addEventListener('click',async e=>{const ok=e.target.closest('[data-ok]'),no=e.target.closest('[data-no]');
  try{if(ok){await upd('documents',ok.dataset.ok,{status:'Verified',reason:''});toast('Approved')}
    if(no){await upd('documents',no.dataset.no,{status:'Rejected',reason:'Unreadable scan. Upload a clear copy.'});toast('Rejected')}rReview()}catch(x){err(x)}});

/* ---------- Application, notifications and settings ---------- */
async function rApplication(){
  const [docs,bks,p]=await Promise.all([list('documents'),list('bookings'),getProfile()]);
  $('#appProfile').textContent=p?'Complete':'Not started';
  $('#appDocs').textContent=docs.length;
  $('#appLab').textContent=bks.length?bks[0].time:'None';
  $('#appStatus').textContent=docs.length?docs.filter(d=>d.status==='Pending').length+' document(s) still need review.':'Add your first documents to begin tracking.';
}
async function rNotifications(){
  const [docs,bks]=await Promise.all([list('documents'),list('bookings')]);
  const messages=[];
  const pending=docs.filter(d=>d.status==='Pending').length;
  const rejected=docs.filter(d=>d.status==='Rejected').length;
  if(pending)messages.push({title:'Document review reminder',detail:pending+' document(s) are waiting for review.',label:'Action needed',cls:'warn'});
  if(rejected)messages.push({title:'Document replacement needed',detail:rejected+' document(s) were rejected. Replace the affected files.',label:'Action needed',cls:'bad'});
  if(!bks.length)messages.push({title:'Book a laboratory slot',detail:'Choose a testing window from the Labs section.',label:'New',cls:'ok'});
  else messages.push({title:'Laboratory booking saved',detail:bks.length+' booking(s) are currently recorded.',label:'Confirmed',cls:'ok'});
  messages.push({title:'Funding discovery',detail:'Review schemes that match your startup stage.',label:'Info',cls:''});
  $('#notificationList').innerHTML=messages.map(n=>'<li><span class="meta"><strong>'+esc(n.title)+'</strong><br><span class="small muted">'+esc(n.detail)+'</span></span>'+pill(n.label,n.cls)+'</li>').join('');
}
function rSettings(){
  $('#settingsTheme').onclick=()=>$('#themeBtn').click();
  $('#settingsSignOut').onclick=()=>$('#signOutBtn').click();
  list('profile').then(rows=>{const a=rows[0];$('#settingsEmail').textContent=a&&a.email?'Signed-in profile: '+a.email:'No profile email saved.'}).catch(err);
}

/* ---------- AI guide (Claude when available, keywords otherwise) ---------- */
function say(who,t){const p=document.createElement('p');p.className='msg'+(who==='me'?' me':'');p.textContent=t;$('#chat').appendChild(p);$('#chat').scrollTop=1e9;return p}
const kw=q=>{const t=q.toLowerCase(),h=GUIDE.find(g=>g.w.some(w=>t.includes(w)));return h?h.a:'Try asking about licences, labs, documents or funding.'};
async function ask(q){if(!q)return;say('me',q);const out=say('bot','…');$('#gSend').disabled=true;
  try{const s=window.claude&&claude.use?await claude.use('sample'):null;
    if(!s)throw 0;const answerLanguage=currentLanguage==='hi'?'Hindi':'English';const r=await s('You are the help assistant for SARAL, an Indian AYUSH startup portal with pages Documents, Labs, Funding, Mentors and Review. Answer in '+answerLanguage+' in under 70 words, plainly. Question: '+q,{cache:false});out.textContent=r.text}
  catch(e){out.textContent=kw(q)}$('#gSend').disabled=false}
async function rGuide(){if(!$('#chat').children.length)say('bot','Hi. What do you need help with?')}
if($('#gForm'))$('#gForm').addEventListener('submit',e=>{e.preventDefault();const i=$('#gIn');const q=i.value.trim();i.value='';ask(q)});
if($('#chips'))$('#chips').addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b)ask(b.dataset.q)});

async function initPage(){try{if(page==='profile.html')await rProfile();else if(page==='dashboard.html')await rDash();else if(page==='documents.html')await rDocs();else if(page==='labs.html')await rLabs();else if(page==='funding.html')await rFund();else if(page==='mentors.html')await rMentors();else if(page==='review.html')await rReview();else if(page==='guide.html')await rGuide();else if(page==='application.html')await rApplication();else if(page==='notifications.html')await rNotifications();else if(page==='settings.html')rSettings()}catch(e){err(e)}}

initLanguage();
initDb();
})();
