
const S={cat:null,flow:[],step:0,day:null,month:null,year:null,name:'',gender:null,phone:''};
const X={};
let fwd=true;
const FLOWS={
  love:['q_cat','q_love_2','q_love_3','q_love_4','q_day','q_month','q_year','q_name','q_gender','q_phone'],
  money:['q_cat','q_money_2','q_money_3','q_money_4','q_day','q_month','q_year','q_name','q_gender','q_phone'],
  health:['q_cat','q_health_2','q_health_3','q_health_4','q_day','q_month','q_year','q_name','q_gender','q_phone'],
  mental:['q_cat','q_mental_2','q_mental_3','q_mental_4','q_day','q_month','q_year','q_name','q_gender','q_phone'],
  purpose:['q_cat','q_purpose_2','q_purpose_3','q_purpose_4','q_day','q_month','q_year','q_name','q_gender','q_phone']
};
const MONTHS=['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];

document.addEventListener('DOMContentLoaded',()=>{buildParticles();buildDayGrid();buildMonthGrid();buildYearSel();startTimer();});

function buildParticles(){const c=document.getElementById('particles');for(let i=0;i<14;i++){const d=document.createElement('div'),sz=2+Math.random()*3;d.className='particle';d.style.cssText='width:'+sz+'px;height:'+sz+'px;background:rgba(212,175,100,.4);left:'+(Math.random()*100)+'%;top:'+(20+Math.random()*80)+'%;animation-duration:'+(10+Math.random()*10)+'s;animation-delay:'+(Math.random()*6)+'s;';c.appendChild(d);}}
function buildDayGrid(){const g=document.getElementById('day-grid');for(let i=1;i<=31;i++){const b=document.createElement('button');b.className='day-btn';b.textContent=i;b.onclick=()=>{document.querySelectorAll('#day-grid .day-btn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');S.day=i;setTimeout(nextQ,260);};g.appendChild(b);}}
function buildMonthGrid(){const g=document.getElementById('month-grid');MONTHS.forEach((m,i)=>{const b=document.createElement('button');b.className='month-btn';b.textContent=m;b.onclick=()=>{document.querySelectorAll('#month-grid .month-btn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');S.month=i+1;setTimeout(nextQ,260);};g.appendChild(b);});}
function buildYearSel(){const s=document.getElementById('year-select');for(let y=2006;y>=1940;y--){const o=document.createElement('option');o.value=y;o.textContent=y;s.appendChild(o);}}
function startTimer(){let sec=587;const el=document.getElementById('timer');if(!el)return;const t=setInterval(()=>{if(sec<=0){clearInterval(t);if(el)el.textContent='00:00';return;}sec--;const m=Math.floor(sec/60),s=sec%60;if(el)el.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;},1000);}
function toggleFaq(id){const item=document.getElementById(id),ans=document.getElementById(id+'-a'),isOpen=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));document.querySelectorAll('.faq-a').forEach(a=>a.classList.remove('open'));if(!isOpen){item.classList.add('open');ans.classList.add('open');}}

function startQuiz(){document.getElementById('quiz-overlay').classList.add('show');document.body.style.overflow='hidden';updateUI();}
function updateUI(){const tot=S.flow.length||10;const pct=S.flow.length?(S.step/tot*100):0;document.getElementById('q-progress').style.width=pct+'%';document.getElementById('q-count').textContent=(S.step+1)+'/'+tot;document.getElementById('back-btn').style.visibility=S.step>0?'visible':'hidden';}
function goTo(newStep){const curId=S.flow[S.step]||'q_cat';fwd=newStep>S.step;const curEl=document.getElementById(curId);if(curEl)curEl.className='q-card '+(fwd?'exit-left':'exit-right');S.step=newStep;updateUI();setTimeout(()=>{if(curEl)curEl.className='q-card';const nId=S.flow[S.step];if(!nId)return;const nEl=document.getElementById(nId);if(!nEl)return;nEl.className='q-card '+(fwd?'enter-right':'enter-left');nEl.addEventListener('animationend',function h(){nEl.className='q-card active';nEl.removeEventListener('animationend',h);});},310);}
function nextQ(){if(S.step<S.flow.length-1)goTo(S.step+1);}
function goBack(){if(S.step>0)goTo(S.step-1);}
function selectCategory(btn){document.querySelectorAll('#q_cat .opt-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');S.cat=btn.dataset.val;S.flow=FLOWS[S.cat]||FLOWS['love'];updateUI();document.getElementById('q_cat').className='q-card active';setTimeout(()=>goTo(1),340);}
function selectOpt(btn,key){btn.closest('.opts').querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');X[key]=btn.dataset.val;setTimeout(nextQ,320);}
function selectYear(){S.year=parseInt(document.getElementById('year-select').value)||null;document.getElementById('y-cont').disabled=!S.year;}
function checkName(){S.name=document.getElementById('inp-name').value.trim();document.getElementById('name-cont').disabled=S.name.length<2;}
function selGender(btn){document.querySelectorAll('.gender-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');S.gender=btn.dataset.val;setTimeout(nextQ,320);}
function checkPhone(){S.phone=document.getElementById('inp-phone').value.replace(/\D/g,'');document.getElementById('phone-cont').disabled=S.phone.length!==10;}
function submitForm(){if(S.phone.length===10)showAnalysis();}

function showAnalysis(){
  document.getElementById('quiz-overlay').classList.remove('show');
  document.getElementById('analysis').classList.add('show');
  const ids=['as1','as2','as3','as4','as5'],bar=document.getElementById('anl-bar');
  let i=0;
  function tick(){if(i>=ids.length){setTimeout(showCheckout,600);return;}const el=document.getElementById(ids[i]);el.classList.add('vis');bar.style.width=Math.round((i+1)/ids.length*100)+'%';setTimeout(()=>{el.classList.add('done');el.querySelector('.anl-step-dot').textContent='✓';i++;setTimeout(tick,380+Math.random()*380);},650);}
  setTimeout(tick,350);
}

/* NUMEROLOGY ENGINE */
const PYT={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
const VOWELS=new Set(['a','e','i','o','u']);
function red(n,master=true){const M=[11,22,33];while(n>9&&(!master||!M.includes(n)))n=String(n).split('').reduce((s,d)=>s+Number(d),0);return n;}
function red1(n){while(n>9)n=String(n).split('').reduce((s,d)=>s+Number(d),0);return n;}
function calcLP(){return red([...String(S.day),...String(S.month),...String(S.year)].map(Number).reduce((a,b)=>a+b,0));}
function calcDest(){return red(S.name.toLowerCase().split('').reduce((s,c)=>s+(PYT[c]||0),0));}
function calcSoul(){return red(S.name.toLowerCase().split('').reduce((s,c)=>s+(VOWELS.has(c)?(PYT[c]||0):0),0));}
function calcPers(){return red(S.name.toLowerCase().split('').reduce((s,c)=>s+(!VOWELS.has(c)&&c!=' '?(PYT[c]||0):0),0));}
function calcPY(lp){return red(lp+red1(2+0+2+6));}
function calcLoShu(){const cnt={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};[...String(S.day),...String(S.month),...String(S.year)].forEach(d=>{if(d!='0'&&cnt[d]!==undefined)cnt[d]++;});const missing=[];for(let i=1;i<=9;i++)if(cnt[i]===0)missing.push(i);return{cnt,missing};}
function calcPins(){const m=red1(S.month),d=red1(S.day),y=red1(S.year),lp=calcLP(),lb=lp===11?2:lp===22?4:lp===33?6:lp;const p1=red1(m+d),p2=red1(d+y),p3=red1(p1+p2),p4=red1(m+y),a1=36-lb,age=new Date().getFullYear()-S.year;return[{num:p1,age:'जन्म — '+a1+' वर्ष',cur:age<=a1},{num:p2,age:(a1+1)+' — '+(a1+9)+' वर्ष',cur:age>a1&&age<=(a1+9)},{num:p3,age:(a1+10)+' — '+(a1+18)+' वर्ष',cur:age>(a1+9)&&age<=(a1+18)},{num:p4,age:(a1+19)+' वर्ष के बाद',cur:age>(a1+18)}];}
function calcKarmic(){return[13,14,16,19].includes(S.day)?S.day:null;}

/* LOOKUP TABLES */
const LP={
  1:{arch:'नेता',en:'The Leader',short:'स्वतंत्रता और नेतृत्व',desc:'आप जन्मजात नेता हैं। आपकी आत्मा में एक अदम्य अग्नि है जो आपको भीड़ से अलग करती है। जब आप किसी के पीछे चलते हैं, तो आपकी भीतरी ऊर्जा कुंठित होकर निराशा बन जाती है। आपको अपनी शर्तों पर जीना होगा।',shadow:'अहंकार और एकांत — आप इतने स्वतंत्र हो जाते हैं कि दूसरों को महत्व नहीं देते।',gift:'असाधारण नेतृत्व क्षमता और नई शुरुआत करने का साहस।',mission:'दूसरों को नेतृत्व दिखाना, नए मार्ग बनाना।'},
  2:{arch:'मध्यस्थ',en:'The Mediator',short:'सहयोग और संवेदनशीलता',desc:'आप असाधारण रूप से संवेदनशील और सहयोगी हैं। आपकी आत्मा में प्रेम और करुणा की एक गहरी नदी बहती है। जब आप "ना" नहीं कह पाते, तो दूसरे आपका लाभ उठाते हैं। सीमाएं तय करना आपका सबसे महत्वपूर्ण पाठ है।',shadow:'अत्यधिक भावुकता और निर्णय न ले पाना।',gift:'गहरी सहानुभूति और कूटनीतिक कौशल।',mission:'शांति स्थापित करना, संबंधों में पुल बनाना।'},
  3:{arch:'रचनाकार',en:'The Creative',short:'रचनात्मकता और अभिव्यक्ति',desc:'आप जीवन के सबसे जीवंत और रचनात्मक लोगों में हैं। आपकी आत्मा अभिव्यक्ति के बिना मुरझा जाती है। जब आप खुद को व्यक्त नहीं करते, तो अवसाद और निराशा आपके द्वार खटखटाती है। आपकी कला ही आपकी मुक्ति है।',shadow:'बिखरी ऊर्जा और अधूरे काम।',gift:'असाधारण रचनात्मकता और संचार कौशल।',mission:'दुनिया को सुंदर, खुशहाल और रचनात्मक बनाना।'},
  4:{arch:'निर्माता',en:'The Builder',short:'अनुशासन और स्थिरता',desc:'आप सबसे विश्वसनीय और परिश्रमी लोगों में हैं। आप नींव बनाने के लिए आए हैं — परिवार की, समाज की, व्यापार की। परंतु अत्यधिक कठोरता और बदलाव से डर आपको नए अवसरों से दूर रखता है। लचीलापन सीखना होगा।',shadow:'अत्यधिक कठोरता और परिवर्तन का भय।',gift:'असाधारण परिश्रम, विश्वसनीयता और व्यावहारिकता।',mission:'ठोस और टिकाऊ नींव बनाना।'},
  5:{arch:'साहसी',en:'The Freedom Seeker',short:'स्वतंत्रता और परिवर्तन',desc:'स्वतंत्रता, परिवर्तन और साहसिकता आपके जीवन की धुरी है। एकरसता आपको अंदर से मारती है। परंतु अत्यधिक परिवर्तनशीलता आपको जड़ रहित बना देती है। आपको यात्रा और स्थिरता का संतुलन खोजना है।',shadow:'अस्थिरता और प्रतिबद्धता से भय।',gift:'अनुकूलनशीलता, साहस और बहुमुखी प्रतिभा।',mission:'दूसरों को परिवर्तन स्वीकार करने की प्रेरणा देना।'},
  6:{arch:'पालनकर्ता',en:'The Nurturer',short:'प्रेम और दायित्व',desc:'परिवार और प्रेम आपके जीवन की धुरी है। आप दूसरों की देखभाल में इतने लीन हो जाते हैं कि खुद को भूल जाते हैं। यही आपका सबसे बड़ा कर्म-पाठ है — पहले खुद से प्यार करना सीखें। आप तभी दूसरों को भर सकते हैं जब आप स्वयं भरे हों।',shadow:'अत्यधिक त्याग और सीमाओं का अभाव।',gift:'गहरा प्रेम, देखभाल और जिम्मेदारी।',mission:'परिवार और समाज को प्रेम और सद्भाव देना।'},
  7:{arch:'ज्ञानी',en:'The Seeker',short:'ज्ञान और आत्म-खोज',desc:'ज्ञान की खोज के लिए आए हैं। आपका मन गहरा, विश्लेषणात्मक और रहस्यमय है। अकेलापन आपका मित्र है। परंतु अत्यधिक अलगाव और अविश्वास आपको कड़वा बना सकता है। आस्था — चाहे धर्म में हो या विज्ञान में — आपकी सबसे बड़ी ज़रूरत है।',shadow:'अत्यधिक संशयवाद और सामाजिक अलगाव।',gift:'असाधारण बौद्धिक क्षमता और अंतर्ज्ञान।',mission:'छिपे हुए सत्य को खोजना और उसे साझा करना।'},
  8:{arch:'शक्तिशाली',en:'The Powerhouse',short:'शक्ति और समृद्धि',desc:'धन, शक्ति और सफलता की ऊर्जा लेकर आए हैं। आप बड़े सपने देखते हैं और उन्हें साकार करने की क्षमता रखते हैं। नियम है — जैसी ऊर्जा दो, वैसी वापस मिलती है। नैतिकता और सत्यनिष्ठा आपके सबसे बड़े रक्षक हैं।',shadow:'सत्ता का दुरुपयोग और भौतिकवाद।',gift:'असाधारण कार्यकुशलता, दृढ़ संकल्प और व्यापारिक बुद्धि।',mission:'भौतिक और आत्मिक समृद्धि का संतुलन स्थापित करना।'},
  9:{arch:'मानवतावादी',en:'The Humanitarian',short:'करुणा और सेवा',desc:'पूरी मानवता की सेवा के लिए आए हैं। करुणा और क्षमा आपके प्रतीक हैं। आप अक्सर दूसरों के दर्द को अपना दर्द मान लेते हैं। बिना अपेक्षा के देना आपका स्वभाव है। जब आप यह स्वीकार कर लें कि आप सभी को नहीं बचा सकते, तभी आपकी असली शक्ति जागेगी।',shadow:'अत्यधिक भावुकता और खुद की अनदेखी।',gift:'असाधारण करुणा, कलात्मक क्षमता और नेतृत्व।',mission:'दुनिया को अधिक सुंदर और दयालु बनाना।'},
  11:{arch:'मास्टर 11',en:'The Illuminator',short:'आध्यात्मिक प्रकाश',desc:'मास्टर नंबर 11 — "Spiritual Messenger।" आपका अंतर्ज्ञान असाधारण है। आप ऐसी चीज़ें देख सकते हैं जो दूसरे नहीं देख सकते। यह एक महान उपहार है, परंतु इसके साथ आती है एक भारी ज़िम्मेदारी। आपकी संवेदनशीलता ही आपकी सबसे बड़ी शक्ति और सबसे बड़ी कमज़ोरी दोनों है।',shadow:'चिंता, भय और आत्म-संशय।',gift:'दूरदर्शिता, अंतर्ज्ञान और आध्यात्मिक मार्गदर्शन।',mission:'दूसरों को प्रकाश दिखाना और जागरूकता फैलाना।'},
  22:{arch:'मास्टर 22',en:'The Master Builder',short:'महान निर्माण',desc:'सबसे शक्तिशाली मास्टर नंबर। आप सपनों को वास्तविकता में बदलने की असाधारण क्षमता रखते हैं। समाज के लिए बड़ी और टिकाऊ संरचनाएं बनाने के लिए आए हैं।',shadow:'अत्यधिक बोझ और आत्म-संशय।',gift:'असाधारण संगठन क्षमता और दूरदर्शिता।',mission:'मानवता के लिए स्थायी और महत्वपूर्ण संरचनाएं बनाना।'},
  33:{arch:'मास्टर 33',en:'The Master Teacher',short:'उच्च करुणा',desc:'दूसरों को उनकी संपूर्ण क्षमता तक पहुँचाने के लिए आए हैं। करुणा और ज्ञान दोनों असाधारण हैं।',shadow:'दूसरों के लिए अत्यधिक बलिदान।',gift:'असाधारण प्रेम और शिक्षण क्षमता।',mission:'मानवता को उच्च चेतना की ओर ले जाना।'}
};
const MISSING={
  1:{title:'आत्मविश्वास की कमी',effect:'1 अंक अहंकार, नेतृत्व और आत्मनिर्भरता का प्रतिनिधित्व करता है। इसकी अनुपस्थिति में व्यक्ति खुद पर भरोसा नहीं कर पाता, दूसरों पर निर्भर रहता है और अपनी राय व्यक्त करने में डरता है।',upay:'हर सुबह दर्पण के सामने कहें: "मैं सक्षम हूँ, मैं योग्य हूँ।" लाल रंग की कोई वस्तु अपने पास रखें।'},
  2:{title:'भावनात्मक जुड़ाव की कमी',effect:'2 अंक प्रेम, सहयोग और भावनात्मक संवेदनशीलता का प्रतीक है। इसकी अनुपस्थिति में गहरे रिश्ते बनाना कठिन होता है। व्यक्ति या तो अत्यधिक भावुक या बिल्कुल ठंडा हो सकता है।',upay:'प्रत्येक सोमवार को गाय को हरा चारा खिलाएं। घर में सफेद फूल रखें।'},
  3:{title:'रचनात्मकता और खुशी की कमी',effect:'3 अंक खुशी, रचनात्मकता और आत्म-अभिव्यक्ति का प्रतीक है। इसकी कमी से व्यक्ति नीरस, उदास और अभिव्यक्ति में अक्षम महसूस करता है।',upay:'हर गुरुवार को कुछ नया बनाएं — कविता, चित्र, या भोजन। पीले कपड़े पहनें।'},
  4:{title:'अनुशासन और स्थिरता की कमी',effect:'4 अंक नींव, अनुशासन और व्यावहारिकता का प्रतीक है। इसकी अनुपस्थिति से काम अधूरे रह जाते हैं, योजनाएं विफल होती हैं और जीवन अव्यवस्थित लगता है।',upay:'प्रतिदिन एक ही समय पर उठें। अपने कमरे को व्यवस्थित रखें। हरे रंग का प्रयोग बढ़ाएं।'},
  5:{title:'लचीलेपन की कमी',effect:'5 अंक परिवर्तन, अनुकूलनशीलता और साहस का प्रतीक है। इसकी कमी से व्यक्ति एक ही स्थान पर अटका रहता है और नए अवसरों का लाभ नहीं उठा पाता।',upay:'प्रत्येक बुधवार को एक नया काम करें। नीले या हरे रंग के कपड़े पहनें।'},
  6:{title:'प्रेम और पारिवारिक बाधाएं',effect:'6 अंक प्रेम, परिवार, और सौंदर्य का प्रतीक है। इसकी कमी से वैवाहिक जीवन में बाधाएं, परिवार से मतभेद और भावनात्मक ठंडापन आता है।',upay:'शुक्रवार को गुलाबी कपड़े पहनें। घर में गुलाब का पौधा लगाएं। स्त्री शक्ति को सम्मान दें।'},
  7:{title:'आंतरिक शांति और अध्यात्म की कमी',effect:'7 अंक ज्ञान, अध्यात्म और आंतरिक शांति का प्रतीक है। इसकी अनुपस्थिति में मन बेचैन रहता है, सच्चाई की खोज नहीं हो पाती और विश्वास की कमी रहती है।',upay:'प्रतिदिन कम से कम 10 मिनट ध्यान करें। बैंगनी या नीले रंग का प्रयोग करें। पुस्तकें पढ़ें।'},
  8:{title:'धन और महत्वाकांक्षा की कमी',effect:'8 अंक धन, शक्ति और सफलता का प्रतीक है। इसकी अनुपस्थिति से पैसा आता है पर टिकता नहीं, व्यापार में बार-बार नुकसान और कर्ज़ की समस्या रहती है।',upay:'शनिवार को तिल का दान करें। काले या गहरे नीले रंग से परहेज़ करें। धातु से बनी कोई वस्तु उत्तर दिशा में रखें।'},
  9:{title:'करुणा और क्षमा में कठिनाई',effect:'9 अंक करुणा, क्षमा और पूर्णता का प्रतीक है। इसकी कमी से व्यक्ति क्रोधी, असहिष्णु और कड़वाहट से भरा हो सकता है। पुराने घाव भरते नहीं।',upay:'मंगलवार को किसी जरूरतमंद को भोजन दें। लाल रंग का प्रयोग करें। हनुमान चालीसा का पाठ करें।'}
};
const PIN_D={1:'यह समय नई शुरुआत, आत्मनिर्भरता और अपनी पहचान बनाने का है। जो बीज आप इस समय बोएंगे, उनके फल जीवनभर मिलेंगे। साहस के साथ अपना रास्ता चुनें।',2:'यह सहयोग, धैर्य और सम्बन्धों का समय है। अकेले बड़े काम नहीं होंगे — टीम बनाएं, भरोसा करना सीखें। संवेदनशीलता ही आपकी सबसे बड़ी ताकत है।',3:'रचनात्मकता और आत्म-अभिव्यक्ति का काल। जो कहना था, कहने का समय आ गया है। कला, संगीत, लेखन — जो भी आपकी आत्मा को खुश करे, वह करें।',4:'कड़ी मेहनत और नींव बनाने का समय। यह काल धीमा लग सकता है, परंतु जो नींव आप अभी बनाएंगे वह जीवनभर काम आएगी।',5:'परिवर्तन और साहसिक निर्णयों का समय। पुरानी आदतें छोड़ें, नए अवसरों को गले लगाएं। यात्रा करें, नया सीखें।',6:'परिवार, जिम्मेदारी और प्रेम का काल। घर और परिवार के प्रति दायित्व प्राथमिकता है। यह विवाह और परिवार वृद्धि का शुभ काल है।',7:'आत्म-खोज और अध्यात्म का समय। भीतर झाँकें — बाहरी दुनिया से थोड़ा अलग होकर अपने आप को जानें। महान ज्ञान और अंतर्दृष्टि इसी काल में मिलती है।',8:'भौतिक सफलता और शक्ति का समय। जो चाहा था, उसे पाने का यह सबसे उपयुक्त काल है। व्यापारिक निर्णय लें, निवेश करें, लक्ष्य पाएं।',9:'समापन, त्याग और नए चक्र की तैयारी। पुराने रिश्ते, पुरानी आदतें — जो काम नहीं आता उसे जाने दें। यह मुक्ति का काल है।'};
const PY_D={1:'यह वर्ष नई शुरुआत का है — बीज बोने का समय। जो नया काम शुरू करना है, उसे आज ही शुरू करें। यह 9 साल के चक्र का पहला वर्ष है।',2:'यह सहयोग का वर्ष है। अकेले नहीं, मिलकर काम करें। धैर्य रखें — फल आने में समय लगेगा।',3:'रचनात्मकता और आत्म-अभिव्यक्ति का वर्ष। जो मन में था, उसे व्यक्त करने का समय आ गया है।',4:'मेहनत का वर्ष। नींव गहरी होगी। धैर्य और अनुशासन से काम करें।',5:'परिवर्तन का वर्ष। नए अवसर आएंगे — उन्हें साहस से स्वीकार करें।',6:'परिवार और जिम्मेदारी का वर्ष। घर, परिवार और स्वास्थ्य पर ध्यान दें।',7:'आत्म-खोज का वर्ष। भीतर झाँकें, ध्यान करें, पढ़ें। यह आध्यात्मिक विकास का वर्ष है।',8:'शक्ति और सफलता का वर्ष। जो चाहते थे, वह इस वर्ष मिल सकता है।',9:'समापन का वर्ष। पुराना जाने दें, नए की तैयारी करें। करुणा और दान का समय।'};
const FOCUS={
  love:{bars:[{l:'वैवाहिक सौभाग्य',p:22,c:'low'},{l:'भावनात्मक संतुलन',p:38,c:'low'},{l:'आकर्षण ऊर्जा',p:55,c:'mid'}],
    analysis:'प्राचीन अंकशास्त्र में प्रेम और विवाह का प्रत्यक्ष संबंध 2 अंक (साझेदारी) और 6 अंक (प्रेम) से है। जब इनमें से कोई भी लोशु ग्रिड में गायब होता है, या जब जीवन पथ अंक प्रेम अंकों के साथ असंतुलित होता है, तो सही साथी मिलने में बाधाएं आती हैं। यह कोई अभिशाप नहीं — यह एक ऊर्जा असंतुलन है जिसे ठीक किया जा सकता है।',
    remedy:'शुक्रवार को सुबह उठकर पूर्व दिशा में बैठें। एक गुलाब की पंखुड़ी को जल में रखकर उससे स्नान करें। "ॐ क्लीं नमः" का 108 बार जाप करें। घर के दक्षिण-पश्चिम कोने में दो प्रेमी पक्षियों (जोड़े) की तस्वीर रखें।'},
  money:{bars:[{l:'धन संचय ऊर्जा',p:18,c:'low'},{l:'व्यापारिक बुद्धि',p:45,c:'mid'},{l:'अवसर पहचान क्षमता',p:58,c:'mid'}],
    analysis:'8 अंक धन का सबसे प्रत्यक्ष प्रतीक है। लोशु ग्रिड में यदि 8 अनुपस्थित है, तो धन आता तो है पर रुकता नहीं — जैसे छलनी में पानी। इसके अलावा, जीवन पथ और भाग्य अंक का असंतुलन कर्मचारियों और व्यापार में बार-बार नुकसान का कारण बनता है। सही संख्यात्मक ऊर्जा को जागृत करके यह स्थिति बदली जा सकती है।',
    remedy:'गुरुवार को पीले कपड़े पहनें। तिजोरी में हल्दी के 11 दाने रखें। "ॐ श्रीं महालक्ष्म्यै नमः" का प्रतिदिन 108 बार जाप। मुख्य दरवाज़े के दाईं ओर एक पीला बल्ब लगाएं।'},
  health:{bars:[{l:'शारीरिक ऊर्जा स्तर',p:28,c:'low'},{l:'आत्मिक संतुलन',p:32,c:'low'},{l:'मानसिक शक्ति',p:48,c:'mid'}],
    analysis:'अंकशास्त्र में 6 अंक (स्वास्थ्य और शरीर) का संतुलन सीधे आपकी शारीरिक ऊर्जा से जुड़ा है। जब 6 या 2 (भावनाएं) लोशु ग्रिड में गायब होते हैं, तो शरीर की प्रतिरोधक क्षमता कमज़ोर पड़ती है। वैदिक परंपरा में "आयुर्विज्ञान" और "अंकशास्त्र" को एक साथ जोड़ा गया है।',
    remedy:'सोमवार को सफेद भोजन करें। सूर्योदय के समय 10 मिनट नंगे पाँव हरी घास पर चलें। "ॐ सूर्याय नमः" का जाप करें। हरे पौधे अपने कमरे में रखें।'},
  mental:{bars:[{l:'मानसिक शांति',p:14,c:'low'},{l:'भावनात्मक स्थिरता',p:28,c:'low'},{l:'विश्लेषण क्षमता',p:88,c:'high'}],
    analysis:'अत्यधिक सोच (Overthinking) और मानसिक बेचैनी का सीधा संबंध 7 अंक के असंतुलन से है। जब 7 अत्यधिक हो (लोशु ग्रिड में बार-बार आए) या 5 (केंद्र-संतुलन) गायब हो, तो मन भटकता है। ध्यान और मंत्र इस असंतुलन को ठीक करते हैं।',
    remedy:'प्रतिदिन रात को सोने से पहले नमक के पानी से पाँव धोएं। नीले या बैंगनी तकिए का प्रयोग करें। सुबह 5 मिनट पूर्ण मौन में बैठें। "ॐ शांति शांति शांति" का उच्चारण करें।'},
  purpose:{bars:[{l:'जीवन की स्पष्टता',p:20,c:'low'},{l:'आत्मविश्वास',p:38,c:'low'},{l:'आंतरिक प्रेरणा',p:52,c:'mid'}],
    analysis:'दिशाहीनता का गहरा संबंध जीवन पथ अंक और व्यक्तित्व अंक के बीच के संघर्ष से है। जब हम वह नहीं करते जो हमारी आत्मा चाहती है, तो ऊर्जा बिखर जाती है। आपकी जन्मतिथि में आपके जीवन का उद्देश्य स्पष्ट रूप से लिखा है — बस उसे पढ़ना होगा।',
    remedy:'प्रतिदिन रात को एक डायरी में लिखें — "आज मैं क्या करना चाहता था?" उत्तर दिशा में बैठकर ध्यान करें। सफेद रंग के वस्त्र पहनें। "ॐ गं गणपतये नमः" का जाप करें।'}
};
const REMEDY_GEMS={1:'माणिक (Ruby)',2:'मोती (Pearl)',3:'पुखराज (Yellow Sapphire)',4:'हरा पुखराज (Green Tourmaline)',5:'पन्ना (Emerald)',6:'हीरा (Diamond)',7:'नीलम (Blue Sapphire)',8:'नीली स्फटिक (Blue Crystal)',9:'मूंगा (Red Coral)',11:'हीरा और मोती',22:'नीलम और पुखराज'};

function showCheckout(){
  document.getElementById('analysis').classList.remove('show');
  document.getElementById('checkout').classList.add('show');
  document.body.style.overflow='';
  document.getElementById('chk-name-disp').textContent=S.name;
  document.getElementById('chk-lp').textContent=calcLP();
  // Sticky bar observer
  const btn=document.getElementById('btn-pay'),bar=document.getElementById('sticky-pay-bar');
  if('IntersectionObserver' in window){const ob=new IntersectionObserver(e=>{if(!e[0].isIntersecting)bar.classList.add('show');else bar.classList.remove('show');},{threshold:0});ob.observe(btn);}
}

function processPayment(){
  const b=document.getElementById('btn-pay'),sb=document.querySelector('.spb-btn');
  b.textContent='भुगतान प्रक्रिया में…';b.style.pointerEvents='none';b.style.opacity='.7';
  if(sb){sb.textContent='प्रोसेसिंग…';sb.style.pointerEvents='none';}
  setTimeout(()=>{
    document.getElementById('checkout').classList.remove('show');
    document.getElementById('sticky-pay-bar').classList.remove('show');
    document.getElementById('post-pay').classList.add('show');
    setTimeout(()=>{document.getElementById('post-pay').classList.remove('show');buildReport();},2200);
  },900);
}

function buildReport(){
  document.getElementById('landing').style.display='none';
  ['quiz-overlay','analysis','checkout','post-pay'].forEach(id=>document.getElementById(id).classList.remove('show'));
  document.getElementById('report').classList.add('show');
  document.body.style.overflow='hidden';
  document.getElementById('report').scrollTop=0;
  setTimeout(()=>{document.getElementById('upsell-bar').classList.add('show');},15000);

  const lp=calcLP(),dest=calcDest(),soul=calcSoul(),pers=calcPers(),py=calcPY(lp);
  const loshu=calcLoShu(),pins=calcPins(),karmic=calcKarmic();
  const lpD=LP[lp]||LP[9],focD=FOCUS[S.cat]||FOCUS['purpose'];

  document.getElementById('r-name-top').textContent=S.name.toUpperCase();
  document.getElementById('r-dob-top').textContent='जन्म: '+S.day+' '+MONTHS[S.month-1]+' '+S.year;
  document.getElementById('r-footer-name').textContent=S.name.toUpperCase();

  // Sec 1: Core
  const coreData=[{l:'जीवन पथ',n:lp,s:lpD.arch,e:'Life Path'},{l:'भाग्य',n:dest,s:(LP[dest]||LP[9]).arch,e:'Destiny'},{l:'आत्मा',n:soul,s:'आंतरिक इच्छा',e:"Soul Urge"},{l:'व्यक्तित्व',n:pers,s:'बाहरी आवरण',e:'Personality'}];
  document.getElementById('r-core').innerHTML='<div class="core-grid">'+coreData.map(c=>'<div class="core-box"><h4>'+c.l+'</h4><div class="core-num">'+c.n+'</div><div class="core-label">'+c.s+'</div><div class="core-en">'+c.e+'</div></div>').join('')+'</div>';
  document.getElementById('r-lp-analysis').innerHTML='<div class="r-highlight"><strong>'+S.name+' जी — आपका जीवन पथ '+lp+': '+lpD.arch+' ('+lpD.en+')</strong></div><p class="r-para">'+lpD.desc+'</p><p class="r-para"><strong>आपकी छाया:</strong> '+lpD.shadow+'</p><p class="r-para"><strong>आपका उपहार:</strong> '+lpD.gift+'</p><p class="r-para"><strong>आपका मिशन:</strong> '+lpD.mission+'</p><p class="r-para">आपका <strong>भाग्य अंक '+dest+'</strong> बताता है कि आप अपने जीवन में क्या हासिल करने आए हैं — यह आपका कर्म-पथ है। आपका <strong>आत्मा अंक '+soul+'</strong> वह है जो आपकी आत्मा सच में चाहती है, चाहे आप उसे स्वीकार करें या नहीं। आपका <strong>व्यक्तित्व अंक '+pers+'</strong> यह दर्शाता है कि दुनिया आपको कैसे देखती है।</p>';

  // Sec 2: Lo Shu
  const loPos=[4,9,2,3,5,7,8,1,6];
  const loshuGrid='<div class="loshu-grid">'+loPos.map(n=>{const c=loshu.cnt[n];if(c===0)return'<div class="loshu-cell empty">·</div>';return'<div class="loshu-cell '+(c>1?'has-rep':'')+'">'+String(n).repeat(c)+'</div>';}).join('')+'</div>';
  const missingText=loshu.missing.length?'आपके ग्रिड में <strong>'+loshu.missing.join(', ')+'</strong> गायब हैं।':'सभी अंक मौजूद हैं — अत्यंत दुर्लभ!';
  document.getElementById('r-loshu-content').innerHTML='<p class="r-para">प्राचीन चीनी लोशु प्रणाली के अनुसार, आपकी जन्मतिथि के अंकों को एक 3×3 ग्रिड में रखा जाता है। <strong>जो अंक गायब हैं, वहाँ जीवन में सबसे अधिक संघर्ष होता है।</strong></p><div class="loshu-wrap"><div class="loshu-grid-cont">'+loshuGrid+'<div style="font-size:.72rem;color:var(--rtl);margin-top:4px">Lo Shu Grid</div></div><div class="loshu-info"><h4 style="font-size:.85rem;font-weight:700;color:var(--rp);margin-bottom:7px">आपके गायब अंक (Karmic Voids):</h4><div class="missing-pills">'+( loshu.missing.length?loshu.missing.map(m=>'<span class="miss-pill">'+m+'</span>').join(''):'<span class="miss-pill">कोई नहीं ✓</span>')+'</div><p class="r-para" style="margin-top:10px;font-size:.83rem">'+missingText+'</p></div></div>';

  // Sec 3: Missing Detail
  let missDet='';
  if(loshu.missing.length){
    loshu.missing.forEach(n=>{const md=MISSING[n];if(md)missDet+='<div class="miss-card"><div class="mc-num">'+n+'</div><div class="mc-title">'+md.title+'</div><div class="mc-desc">'+md.effect+'<br><strong>उपाय:</strong> '+md.upay+'</div></div>';});
  } else {missDet='<div class="karmic-good"><div style="font-weight:700;color:#2f855a;margin-bottom:6px">✅ आपका ग्रिड संपूर्ण है</div><p style="font-size:.88rem;color:#276749;line-height:1.55">आपकी जन्मतिथि में सभी अंक मौजूद हैं — यह एक बहुत दुर्लभ और शुभ स्थिति है। आपकी ऊर्जा संतुलित है।</p></div>';}
  document.getElementById('r-missing-detail').innerHTML='<p class="r-para">प्रत्येक गायब अंक जीवन के एक विशेष क्षेत्र में चुनौती का संकेत देता है। <strong>यह समझना आपको उपाय करने का मार्ग दिखाता है।</strong></p><div class="missing-detail">'+missDet+'</div>';

  // Sec 4: Karmic
  if(karmic){const kdt={13:'पिछले जन्म में अपने कर्तव्यों की उपेक्षा और आलस्य। शॉर्टकट और चालाकी से काम करने की प्रवृत्ति थी। इस जन्म में — हर सफलता के लिए कठिन परिश्रम अनिवार्य है। जो आसानी से मिलता है, वह टिकता नहीं।',14:'स्वतंत्रता के अत्यधिक दुरुपयोग का कर्म। इंद्रियों के अधीन रहे। इस जन्म में — जीवन में बार-बार अचानक और अप्रत्याशित बदलाव आएंगे। आत्म-नियंत्रण ही मुक्ति का मार्ग है।',16:'"Tower Moment" — अहंकार और गुप्त जीवन का कर्म। इस जन्म में — एक बार सब ढह जाएगा ताकि आप शुद्ध होकर पुनर्जन्म ले सकें। यह दंड नहीं, आत्मा की सफाई है।',19:'शक्ति और प्रभुत्व के दुरुपयोग का ऋण। इस जन्म में — अनेक संघर्ष अकेले करने होंगे। कोई सहायक नहीं मिलेगा ताकि आप पूर्णतः स्वावलंबी बनें।'};
  document.getElementById('r-karmic').innerHTML='<div class="karmic-box"><div class="karmic-title">⚠️ कार्मिक ऋण '+karmic+' सक्रिय है</div><p style="font-size:.88rem;color:#742a2a;line-height:1.65">'+kdt[karmic]+'</p></div><p class="r-para">यह जानकारी आपको डराने के लिए नहीं — जगाने के लिए है। <strong>जिन लोगों पर कार्मिक ऋण होता है, वे जीवन की सबसे गहरी शिक्षाएं पाते हैं और अंततः सबसे महान बनते हैं।</strong></p><p class="r-para">कार्मिक ऋण '+karmic+' का उपाय: पूर्ण ईमानदारी से जीएं। जो कठिन लगे, उसे टालें नहीं — उसका सामना करें। हर सप्ताह किसी जरूरतमंद की मदद करें।</p>';
  } else {document.getElementById('r-sec4').className='r-card green';document.getElementById('r-karmic').innerHTML='<div class="karmic-good"><div style="font-weight:700;color:#2f855a;margin-bottom:6px">✅ कोई भारी कार्मिक ऋण नहीं</div><p style="font-size:.88rem;color:#276749;line-height:1.55">आपकी जन्मतिथि में कोई प्रमुख कार्मिक ऋण नहीं है। आपकी चुनौतियाँ मुख्यतः लोशु ग्रिड के असंतुलन और जीवन पथ की ऊर्जा के अनुसार जीने में कमी से हैं।</p></div><p class="r-para">यह एक शुभ संकेत है। आपका आत्मिक बोझ अपेक्षाकृत हल्का है। इसका अर्थ है कि आप सही दिशा में प्रयास करके बहुत जल्दी परिणाम पा सकते हैं।</p>';}

  // Sec 5: Pinnacles
  document.getElementById('r-pins').innerHTML=pins.map((p,i)=>'<div class="pin-item'+(p.cur?' current':'')+'"><div class="pin-age">शिखर '+(i+1)+' — '+p.age+(p.cur?'<span class="pin-now">← आप अभी यहाँ हैं</span>':'')+'</div><div class="pin-num">अंक '+p.num+(p.cur?' (सक्रिय)':'')+'</div><div class="pin-desc">'+(PIN_D[p.num]||'विशेष ऊर्जा का समय।')+'</div>'+(p.cur?'<div class="pin-focus">अभी आपका ध्यान: '+(['love','money','health','mental','purpose'].map(k=>({love:'प्रेम और रिश्ते',money:'आर्थिक सफलता',health:'स्वास्थ्य',mental:'मानसिक शांति',purpose:'जीवन उद्देश्य'}[k]))[['love','money','health','mental','purpose'].indexOf(S.cat)||0])+' पर केंद्रित करें।</div>':'')+'</div>').join('');

  // Sec 6: Focus
  document.getElementById('r-focus-content').innerHTML='<p class="r-sec-sub">आपने जो समस्या बताई है, उसका अंकशास्त्रीय कारण यहाँ दिया गया है।</p>'+focD.bars.map(b=>'<div class="ebar-wrap"><div class="ebar-head"><span>'+b.l+'</span><span class="ebar-pct">'+b.p+'%</span></div><div class="ebar-track"><div class="ebar-fill '+b.c+'" style="width:'+b.p+'%"></div></div></div>').join('')+'<p class="r-para" style="margin-top:14px">'+focD.analysis+'</p><p class="r-para">आपके जीवन पथ '+lp+' और गायब अंकों ('+( loshu.missing.join(', ')||'कोई नहीं')+') के बीच सीधा संबंध है। जब तक ग्रिड के शून्य नहीं भरते, यह समस्या बनी रहेगी।</p>';

  // Sec 7: Name Analysis
  const nTotal=S.name.toLowerCase().split('').reduce((s,c)=>s+(PYT[c]||0),0);
  const nVowel=S.name.toLowerCase().split('').reduce((s,c)=>s+(VOWELS.has(c)?(PYT[c]||0):0),0);
  document.getElementById('r-name-analysis').innerHTML='<p class="r-para">पाइथागोरस अंकशास्त्र में हर अक्षर का एक अंक होता है: A=1, B=2, C=3... यह कैलकुलेशन बताती है कि आपका नाम किस ऊर्जा को आकर्षित करता है।</p><div class="r-highlight"><strong>'+S.name+'</strong> का विश्लेषण:<br>• भाग्य अंक (Destiny): <strong>'+dest+'</strong> — यह आपके जीवन का कर्म-मार्ग है।<br>• आत्मा अंक (Soul Urge): <strong>'+soul+'</strong> — यह आपकी गहरी आंतरिक इच्छा है।<br>• व्यक्तित्व अंक (Personality): <strong>'+pers+'</strong> — दुनिया आपको इस ऊर्जा से पहचानती है।</div><p class="r-para">आपके नाम की ऊर्जा और जन्म तिथि (जीवन पथ '+lp+') '+(Math.abs(dest-lp)<=2?'में <strong>अच्छा संतुलन</strong> है। यह शुभ संकेत है।':'में <strong>कुछ असंतुलन</strong> है। इसे सरल नाम-उपाय से ठीक किया जा सकता है।')+'</p>';

  // Sec 8: 2026 Year
  const pyI=PY_D[py]||PY_D[9];
  const mE=Array.from({length:12},(_,i)=>red1(lp+(i+1)));
  document.getElementById('r-year-content').innerHTML='<p class="r-para"><strong>'+S.name+' जी, 2026 आपका व्यक्तिगत वर्ष '+py+' है।</strong> '+pyI+'</p><table class="month-table"><thead><tr><th>माह</th><th>अंक</th><th>ऊर्जा</th><th>मुख्य संकेत</th></tr></thead><tbody>'+MONTHS.map((m,i)=>{const e=mE[i];const cls=[8,1,3].includes(e)?'mb-high':[4,7].includes(e)?'mb-low':'mb-mid';const lbl=[8,1,3].includes(e)?'अनुकूल':[4,7].includes(e)?'सावधानी':'सामान्य';const hint={1:'नई शुरुआत करें',2:'सहयोग लें',3:'रचनात्मक रहें',4:'कड़ी मेहनत',5:'बदलाव स्वीकारें',6:'परिवार पर ध्यान',7:'ध्यान करें',8:'निवेश करें',9:'पुराना छोड़ें'};return'<tr><td><strong>'+m+'</strong></td><td>'+e+'</td><td><span class="month-badge '+cls+'">'+lbl+'</span></td><td style="font-size:.77rem">'+( hint[e]||'-')+'</td></tr>';}).join('')+'</tbody></table>';

  // Sec 9: Remedies
  const gem=REMEDY_GEMS[lp]||'नवरत्न';
  document.getElementById('r-remedies').innerHTML='<p class="r-para">'+focD.remedy+'</p><div class="remedy-box"><div class="remedy-title">🌿 आपके समग्र उपाय (LP '+lp+')</div><ul class="remedy-list"><li><strong>रत्न उपाय:</strong> '+gem+' — अनामिका उँगली में, '+(['सोमवार','शुक्रवार','गुरुवार','शनिवार','बुधवार','शुक्रवार','शनिवार','शनिवार','मंगलवार','सोमवार'][lp-1]||'गुरुवार')+' को धारण करें।</li><li><strong>दिशा उपाय:</strong> प्रतिदिन सुबह '+(['पूर्व','उत्तर','उत्तर-पूर्व','दक्षिण','उत्तर','दक्षिण-पश्चिम','उत्तर-पश्चिम','उत्तर','दक्षिण'][lp-1]||'पूर्व')+' दिशा में बैठकर ध्यान करें।</li><li><strong>रंग उपाय:</strong> '+(['लाल','सफेद','पीला','हरा','नीला','गुलाबी','बैंगनी','काला/नेवी','नारंगी'][lp-1]||'सफेद')+' रंग के कपड़े अधिक पहनें।</li><li><strong>संख्या उपाय:</strong> फोन में सुबह '+lp+' बजे का अलार्म लगाएं, उस समय अपना लक्ष्य 11 बार दोहराएं।</li><li><strong>दान उपाय:</strong> '+(['रविवार','सोमवार','बृहस्पतिवार','बुधवार','बुधवार','शुक्रवार','शनिवार','शनिवार','मंगलवार'][lp-1]||'गुरुवार')+' को किसी जरूरतमंद को '+(['गेहूं','चावल','पीली दाल','हरी सब्जी','हरी दाल','मिठाई','तिल','तिल तेल','मसूर'][lp-1]||'भोजन')+' का दान करें।</li></ul></div>';

  // Sec 10: Affirmations
  const affs={1:['मैं एक शक्तिशाली नेता हूँ और अपनी शर्तों पर जीता हूँ।','मैं हर नई शुरुआत में साहस और विश्वास लेकर चलता हूँ।','मेरी स्वतंत्रता मेरी सबसे बड़ी ताकत है।'],2:['मैं अपनी भावनाओं का सम्मान करता हूँ।','मैं प्रेम देने और पाने का पात्र हूँ।','मैं "ना" कहना सीख रहा हूँ और यह मेरी ताकत है।'],3:['मेरी रचनात्मकता दुनिया को खूबसूरत बनाती है।','मैं खुलकर अपने आप को व्यक्त करता हूँ।','खुशी मेरा जन्मसिद्ध अधिकार है।'],4:['मेरी मेहनत का फल ज़रूर मिलेगा।','मैं धैर्य और अनुशासन से अपनी नींव मजबूत कर रहा हूँ।','स्थिरता और सुरक्षा मेरी ओर आ रही है।'],5:['मैं परिवर्तन का स्वागत करता हूँ।','हर नया अनुभव मुझे समृद्ध बनाता है।','मैं स्वतंत्र हूँ और अपना जीवन अपनी शर्तों पर जीता हूँ।']};
  const defaultAffs=['मैं ब्रह्मांड की ऊर्जा से जुड़ा हुआ हूँ।','हर दिन मैं बेहतर होता जा रहा हूँ।','जो मेरे लिए है, वह मुझ तक ज़रूर आएगा।'];
  const myAffs=affs[lp]||defaultAffs;
  document.getElementById('r-affirmations').innerHTML='<p class="r-para">अंकशास्त्र के अनुसार, शब्दों में असाधारण शक्ति होती है। आपके जीवन पथ '+lp+' के लिए ये पुष्टि-मंत्र सुबह उठकर और रात को सोने से पहले 11 बार बोलें:</p><div class="affirmation-box"><ul class="aff-list">'+myAffs.map(a=>'<li>'+a+'</li>').join('')+'</ul></div><p class="r-para" style="margin-top:14px"><strong>ध्यान मंत्र:</strong> "ॐ '+( lpD.en.split(' ')[1]||'शक्ति')+'  नमः" — हर सुबह 108 बार जाप करें।</p><p class="r-para">अपने कमरे में एक छोटी नोटबुक रखें। हर सुबह उठकर तीन चीज़ें लिखें जिनके लिए आप कृतज्ञ हैं। 21 दिन में आपकी ऊर्जा में बदलाव महसूस होगा।</p>';
}

/* PDF PRINT */
function printReport(which){
  const r=document.getElementById('report'),p=document.getElementById('report-pro');
  const wasR=r.classList.contains('show'),wasP=p.classList.contains('show');
  // Temporarily make the right div printable
  if(which==='report'){
    r.style.position='static';r.style.overflow='visible';
  } else {
    p.style.position='static';p.style.overflow='visible';
    if(!wasR)r.classList.remove('show');
    p.classList.add('show');
  }
  window.print();
  // Restore
  if(which==='report'){r.style.position='';r.style.overflow='';}
  else{p.style.position='';p.style.overflow='';if(!wasP)p.classList.remove('show');if(wasR)r.classList.add('show');}
}

/* UPSELL */
function buyProReport(){
  const usBtn=document.querySelector('.us-btn'),ubBtn=document.querySelector('.ub-btn');
  if(usBtn){usBtn.textContent='भुगतान प्रक्रिया में…';usBtn.style.pointerEvents='none';}
  if(ubBtn){ubBtn.textContent='प्रोसेसिंग…';ubBtn.style.pointerEvents='none';}
  document.getElementById('upsell-bar').classList.remove('show');
  setTimeout(()=>{
    document.getElementById('report').classList.remove('show');
    document.getElementById('pp-title').textContent='Ultimate Blueprint अनलॉक हो रहा है ✦';
    document.getElementById('pp-sub').textContent='चाल्डियन गणनाएँ प्रोसेस की जा रही हैं…';
    document.getElementById('post-pay').classList.add('show');
    setTimeout(()=>{document.getElementById('post-pay').classList.remove('show');buildProReport();},2500);
  },700);
}

function buildProReport(){
  document.getElementById('report-pro').classList.add('show');
  document.body.style.overflow='hidden';
  document.getElementById('report-pro').scrollTop=0;

  const lp=calcLP(),dest=calcDest(),soul=calcSoul(),pers=calcPers(),py=calcPY(lp);
  const loshu=calcLoShu(),pins=calcPins(),karmic=calcKarmic();
  const lpD=LP[lp]||LP[9],focD=FOCUS[S.cat]||FOCUS['purpose'];
  document.getElementById('pro-name-top').textContent=S.name.toUpperCase();
  document.getElementById('pro-footer-name').textContent=S.name.toUpperCase();

  // 1. Chaldean
  function chalRed(n){const CMAP={a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,u:6,v:6,w:6,x:5,y:1,z:7};return n;}
  const chalDest=red(S.name.toLowerCase().split('').reduce((s,c)=>s+({a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,u:6,v:6,w:6,x:5,y:1,z:7}[c]||0),0));
  const chalSoul=red(S.name.toLowerCase().split('').reduce((s,c)=>s+(VOWELS.has(c)?({a:1,e:5,i:1,o:7,u:6}[c]||0):0),0));
  document.getElementById('pro-chal').innerHTML='<p class="pro-para">चाल्डियन प्रणाली में 9 को दैवीय माना जाता है (सांसारिक गणनाओं में उपयोग नहीं) और A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7 का प्रयोग होता है।</p><table class="chal-table"><thead><tr><th>अंक प्रकार</th><th>पाइथागोरस</th><th>चाल्डियन</th><th>व्याख्या</th></tr></thead><tbody><tr><td>Destiny (भाग्य)</td><td>'+dest+'</td><td>'+chalDest+'</td><td>'+( chalDest!==dest?'दोनों प्रणालियों में अंतर — आपकी छिपी हुई कार्मिक ऊर्जा अलग है।':'दोनों में समानता — आपकी ऊर्जा एकीकृत है।')+'</td></tr><tr><td>Soul Urge (आत्मा)</td><td>'+soul+'</td><td>'+chalSoul+'</td><td>आपकी आत्मा की वास्तविक भाषा '+chalSoul+' की ऊर्जा में है।</td></tr><tr><td>Life Path (जीवन पथ)</td><td colspan="2">'+lp+'</td><td>जन्मतिथि पर आधारित — दोनों प्रणालियों में समान</td></tr></tbody></table><div class="pro-highlight">चाल्डियन प्रणाली के अनुसार: '+S.name+' का कंपन (Vibration) '+chalDest+' है। यह बताता है कि आपकी आत्मा गहराई में '+(LP[chalDest]||LP[9]).short+' की ऊर्जा चाहती है।</div>';

  // 2. Core Deep
  document.getElementById('pro-core-deep').innerHTML='<p class="pro-para">चारों अंकों का एक साथ विश्लेषण आपकी आत्मा की पूरी कहानी बताता है:</p>'+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+[{n:lp,t:'जीवन पथ',d:lpD.desc},{n:dest,t:'भाग्य',d:(LP[dest]||LP[9]).desc},{n:soul,t:'आत्मा',d:'यह वह है जो आपकी आत्मा सच में चाहती है — चाहे आप दुनिया को दिखाएं या नहीं। आत्मा अंक '+soul+' की ऊर्जा: '+( LP[soul]||LP[9]).short+'.'},{n:pers,t:'व्यक्तित्व',d:'दुनिया आपको '+( LP[pers]||LP[9]).arch+' की ऊर्जा से देखती है।'}].map(x=>'<div style="background:var(--pc2);border:1px solid var(--pbr);border-radius:9px;padding:14px"><div style="font-size:.67rem;color:var(--pg);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">'+x.t+'</div><div style="font-family:var(--serif);font-size:2.2rem;color:#fff;font-weight:700;line-height:1;margin-bottom:6px">'+x.n+'</div><p style="font-size:.77rem;color:var(--ptl);line-height:1.5">'+x.d.substring(0,120)+'…</p></div>').join('')+'</div>';

  // 3. Lo Shu Pro
  const loPos=[4,9,2,3,5,7,8,1,6];
  const pGrid='<div class="loshu-grid" style="width:150px;margin:0 auto">'+loPos.map(n=>{const c=loshu.cnt[n];if(c===0)return'<div class="loshu-cell empty" style="background:rgba(224,82,82,.07)">·</div>';return'<div class="loshu-cell '+(c>1?'has-rep':'')+'">'+String(n).repeat(c)+'</div>';}).join('')+'</div>';
  let proMiss='';
  loshu.missing.forEach(n=>{const md=MISSING[n];if(md)proMiss+='<div class="pro-highlight"><strong>अंक '+n+' — '+md.title+':</strong> '+md.effect+'</div>';});
  document.getElementById('pro-loshu-deep').innerHTML='<p class="pro-para">लोशु ग्रिड में केवल अनुपस्थिति ही नहीं, बल्कि प्रत्येक अंक की उपस्थिति की संख्या भी महत्वपूर्ण है। यदि कोई अंक 3 या अधिक बार आता है, तो वह ऊर्जा का "अतिरेक" (Excess) बनाता है।</p>'+pGrid+(proMiss||'<div class="pro-highlight">✅ आपका ग्रिड संपूर्ण है — यह अत्यंत दुर्लभ है।</div>');

  // 4. Karmic Pro
  if(karmic){const kPro={13:'यह 1+3=4 का उच्च कंपन है। 4 नींव और मेहनत का अंक है — इसलिए आपके लिए बिना परिश्रम कोई फल नहीं मिलेगा। जो मिलेगा, वह स्थायी होगा।',14:'1+4=5 — स्वतंत्रता का उच्च कंपन। परिवर्तन आपके लिए अनिवार्य पाठ है।',16:'1+6=7 — ज्ञान का उच्च कंपन। टॉवर क्षण के बाद असाधारण ज्ञान मिलता है।',19:'1+9=10=1 — नेतृत्व का उच्च कंपन। अकेले संघर्ष से असाधारण स्वावलंबन बनता है।'};document.getElementById('pro-karmic-deep').innerHTML='<p class="pro-para">कार्मिक ऋण '+karmic+' का गहरा अर्थ:</p><div class="past-life-box"><p class="pro-para">'+kPro[karmic]+'</p></div><p class="pro-para">इस जन्म में इस ऋण को चुकाने के लिए: सेवा, ईमानदारी और नम्रता — यही तीन गुण आपको मुक्त करेंगे। हर शुक्रवार को मंदिर या किसी पवित्र स्थान पर जाएं।</p>';}
  else{document.getElementById('p-sec4').className='pro-card green';document.getElementById('pro-karmic-deep').innerHTML='<div class="pro-highlight">✅ कोई भारी कार्मिक ऋण नहीं — आपकी आत्मा पिछले जन्मों के अधिकांश ऋण चुका चुकी है।</div><p class="pro-para">आपकी चुनौतियाँ इस जन्म के कर्मों से हैं, पिछले जन्म के नहीं। इसका अर्थ है कि आप इस जन्म में सही निर्णय लेकर अपनी किस्मत बदल सकते हैं।</p>';}

  // 5. 5 Years
  let yhtml='';for(let i=0;i<5;i++){const yr=2026+i,pyn=red1(lp+red1((2+0+yr)%9||9));const desc5={1:'नई शुरुआत — नए प्रोजेक्ट, नए रिश्ते।',2:'सहयोग — साझेदारी में काम करें।',3:'रचनात्मकता — अपनी प्रतिभा दिखाएं।',4:'मेहनत — नींव बनाने का समय।',5:'परिवर्तन — बड़े बदलाव आएंगे।',6:'परिवार — घर और रिश्तों पर ध्यान।',7:'आत्म-खोज — ध्यान और अध्यात्म।',8:'सफलता — भौतिक उपलब्धियाँ।',9:'समापन — पुराना छोड़ें।'};yhtml+='<div class="year-card'+(i===0?' current-yr':'')+'"><div class="yc-year">'+yr+(i===0?' (अभी)':'')+'</div><div class="yc-num">'+pyn+'</div><div class="yc-theme">'+(PY_D[pyn]||'विशेष वर्ष').split(' ')[0]+' '+( PY_D[pyn]||'').split(' ')[1]+'</div><div class="yc-desc">'+(desc5[pyn]||'-')+'</div><div class="yc-advice">'+( {love:'विवाह/प्रेम में: ',money:'धन में: ',health:'स्वास्थ्य में: ',mental:'मन में: ',purpose:'लक्ष्य में: '}[S.cat]||'ध्यान: ')+(['आशावादी रहें','सावधानी बरतें','अवसर लें','धैर्य रखें','साहस करें'][i])+'</div></div>';}
  document.getElementById('pro-years').innerHTML='<p class="pro-para">अगले 5 वर्षों में ब्रह्मांड आपके जीवन को इस दिशा में ले जाएगा:</p><div class="year-cards">'+yhtml+'</div>';

  // 6. Compat
  const compMap={1:[3,5,9],2:[2,4,8],3:[1,3,9],4:[2,4,8],5:[1,5,7],6:[2,6,9],7:[5,7,9],8:[2,4,8],9:[1,3,6]};
  const good=compMap[lp]||[1,5,9];const diff=[1,2,3,4,5,6,7,8,9].filter(n=>!good.includes(n)).slice(0,3);
  document.getElementById('pro-compat-content').innerHTML='<p class="pro-para">आपके जीवन पथ '+lp+' के साथ अनुकूलता:</p><div class="compat-grid">'+[...good,...diff].map((n,i)=>'<div class="compat-cell '+(i<3?'great':'diff')+'"><div class="cn">'+n+'</div>'+(i<3?'सर्वश्रेष्ठ':'चुनौती')+'</div>').join('')+'<div class="compat-cell neutral"><div class="cn">'+([2,4,6].find(n=>!good.includes(n)&&!diff.includes(n))||5)+'</div>सामान्य</div><div class="compat-cell neutral"><div class="cn">'+([1,3,7].find(n=>!good.includes(n)&&!diff.includes(n))||2)+'</div>सामान्य</div><div class="compat-cell neutral"><div class="cn">'+([5,8,9].find(n=>!good.includes(n)&&!diff.includes(n))||8)+'</div>सामान्य</div></div><p class="pro-para" style="margin-top:12px">आपके जीवन पथ '+lp+' के लिए <strong>'+good.join(', ')+' अंक</strong> वाले लोग सबसे अनुकूल साथी हैं। विवाह, व्यापार, और मित्रता में इन अंकों वाले लोगों को प्राथमिकता दें।</p>';

  // 7. Career
  const mths=MONTHS;document.getElementById('pro-career').innerHTML='<p class="pro-para">2026 में आपके करियर और व्यापार के लिए शुभ और कठिन माह:</p><table class="wealth-table"><thead><tr><th>माह</th><th>करियर</th><th>व्यापार</th><th>सुझाव</th></tr></thead><tbody>'+mths.map((m,i)=>{const e=red1(lp+(i+1));const ce=e%3;return'<tr><td>'+m+'</td><td class="'+(ce===0?'w-high':ce===1?'w-mid':'w-low')+'">'+(ce===0?'उत्कृष्ट':ce===1?'औसत':'संघर्ष')+'</td><td class="'+(ce===1?'w-high':ce===0?'w-mid':'w-low')+'">'+(ce===1?'शुभ':ce===0?'स्थिर':'जोखिम')+'</td><td style="font-size:.75rem">'+(['नई नौकरी/प्रमोशन','धैर्य रखें','सावधान निवेश','नई शुरुआत','साझेदारी','परिवार पहले','ध्यान करें','बड़ा निवेश','समीक्षा करें','नए संपर्क','सीखें','वर्ष-समीक्षा'][i])+'</td></tr>';}).join('')+'</tbody></table>';

  // 8. Name Fix
  const nLen=S.name.replace(/\s/g,'').length;document.getElementById('pro-name-fix').innerHTML='<p class="pro-para">वर्तमान नाम <strong>'+S.name+'</strong> ('+nLen+' अक्षर) का Destiny अंक '+dest+' है।</p><div class="pro-highlight"><strong>नाम और जन्म ऊर्जा का मेल:</strong> आपका जीवन पथ '+lp+' और Destiny '+dest+' — '+(Math.abs(dest-lp)<=2?'✅ अच्छा संतुलन।':'⚠️ हल्का असंतुलन।')+'</div><p class="pro-para">यदि असंतुलन है, तो इन सुझावों से नाम की ऊर्जा सुधारें: (1) सोशल मीडिया में नाम के अंत में एक अतिरिक्त स्वर अक्षर जोड़ें। (2) हस्ताक्षर में एक ऊपर की ओर जाती रेखा बनाएं। (3) व्यापार में नाम का पहला अक्षर बदलकर जाँचें।</p>';

  // 9. 21 Day
  let p21='';for(let w=1;w<=3;w++){p21+='<div class="plan-week"><div class="pw-title">सप्ताह '+w+' — '+(['जागरूकता','ऊर्जा सफाई','प्रकटन'][w-1])+'</div><div class="pw-days">';for(let d=1;d<=7;d++){p21+='<div class="pw-day"><div class="dd">Day '+((w-1)*7+d)+'</div><div class="di">'+(['🧘','✍️','🕯️','🌿','💧','🚶','🌙'][d-1])+'</div><div class="dt">'+(['ध्यान 10मि','कृतज्ञता','मंत्र','प्रकृति','जल चिकित्सा','मौन चलना','आराम'][d-1])+'</div></div>';}p21+='</div></div>';}
  document.getElementById('pro-21day').innerHTML=p21+'<p class="pro-para" style="margin-top:12px">इसे कल सुबह 6 बजे से शुरू करें। 21वें दिन तक आपकी ऊर्जा में महत्वपूर्ण बदलाव आएगा।</p>';

  // 10. Health
  const hParts=['पाचन तंत्र','तंत्रिका तंत्र','हृदय और रक्त','मांसपेशियाँ','गले और फेफड़े','त्वचा','हड्डियाँ','गुर्दे','रक्तचाप'];
  document.getElementById('pro-health').innerHTML='<p class="pro-para">आपके जीवन पथ '+lp+' और गायब अंकों के आधार पर स्वास्थ्य भेद्यता नक्शा:</p><div class="health-body-map">'+[{i:'🫁',t:'श्वास तंत्र',r:lp%4===0?85:35,d:'तनाव में श्वास प्रभावित होती है'},{i:'❤️',t:'हृदय',r:loshu.missing.includes(6)?75:25,d:loshu.missing.includes(6)?'6 गायब — हृदय पर दबाव':'सामान्य'},{i:'🧠',t:'मानसिक तंत्र',r:lp%7===0?80:40,d:'विचार अत्यधिक हैं'},{i:'🦴',t:hParts[lp-1]||'पाचन',r:50,d:'जीवन पथ '+lp+' का प्रत्यक्ष प्रभाव'}].map(h=>'<div class="hb-card"><div class="hb-icon">'+h.i+'</div><div class="hb-title">'+h.t+'</div><div class="hb-risk-bar"><div class="hb-risk-fill" style="width:'+h.r+'%;background:'+(h.r>60?'#fc8181':h.r>40?'#f6e05e':'#68d391')+'"></div></div><div class="hb-desc">जोखिम: '+h.r+'% — '+h.d+'</div></div>').join('')+'</div>';

  // 11. Wealth
  document.getElementById('pro-wealth').innerHTML='<table class="wealth-table"><thead><tr><th>माह</th><th>शुभ तारीखें</th><th>वर्ग</th><th>क्या करें</th></tr></thead><tbody>'+MONTHS.filter((_,i)=>i%3===0).map((m,i)=>'<tr><td>'+m+'</td><td class="w-high">'+(lp+i*3+1)+', '+(lp+i*3+10)+', '+(lp+i*3+19)+'</td><td>'+(['निवेश','करियर','व्यापार','धन'][i])+'</td><td>'+(['म्यूचुअल फंड / सोना','नौकरी / प्रमोशन','नया अनुबंध','बचत खाता'][i])+'</td></tr>').join('')+'</tbody></table>';

  // 12. Lucky
  const dys=['सोम','मंगल','बुध','गुरु','शुक्र','शनि','रवि'];const clrs=['#e53e3e','#fc8181','#38a169','#d69e2e','#805ad5','#3182ce','#718096'];
  document.getElementById('pro-lucky').innerHTML=dys.map((d,i)=>{const n=red1(lp+i);return'<div class="lucky-cell"><div class="lday">'+d+'</div><div class="lnum">'+n+'</div><div class="lclr" style="background:'+clrs[(lp+i)%7]+'"></div><div class="ltime">'+(n%12||12)+':00</div></div>';}).join('');

  // 13. Gems
  const gemData=[{i:'💎',n:REMEDY_GEMS[lp]||'नवरत्न',p:'मुख्य रत्न',h:'अनामिका उँगली, '+(['रवि','सोम','बुध','गुरु','शुक्र','शनि','शनि','बुध','मंगल'][lp-1]||'गुरु')+'वार'},{i:'🟢',n:'हरा ओनिक्स',p:'सहायक रत्न',h:'मध्यमा उँगली, बुधवार'},{i:'🔵',n:'नीली स्फटिक',p:'ऊर्जा संतुलन',h:'बाएं हाथ में पहनें'},{i:'⚪',n:'मून स्टोन',p:'भावनात्मक शांति',h:'चाँदी की अंगूठी में'}];
  document.getElementById('pro-gems').innerHTML='<p class="pro-para">आपके अंकों के अनुसार अनुशंसित रत्न:</p><div class="gem-grid">'+gemData.map(g=>'<div class="gem-card"><div class="gem-icon">'+g.i+'</div><div class="gem-name">'+g.n+'</div><div class="gem-purpose">'+g.p+'</div><div class="gem-how">कैसे पहनें: '+g.h+'</div></div>').join('')+'</div>';

  // 14. Vastu
  const vDir=['उत्तर','उत्तर-पूर्व','पूर्व','दक्षिण-पूर्व','दक्षिण','दक्षिण-पश्चिम','पश्चिम','उत्तर-पश्चिम','केंद्र'];const vIcons=['⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','🔲'];
  document.getElementById('pro-vastu').innerHTML='<p class="pro-para">वास्तु और अंकशास्त्र के संयुक्त अनुसार आपके घर और कार्यस्थल के लिए:</p><div class="vastu-grid">'+vDir.map((d,i)=>'<div class="vastu-cell"><div class="vastu-dir">'+d+'</div><div class="vastu-icon">'+vIcons[i]+'</div><div class="vastu-desc">'+(['धन और करियर','शिक्षा और ज्ञान','स्वास्थ्य और परिवार','प्रसिद्धि','सफलता','विवाह','रचनात्मकता','यात्रा','संतुलन'][i])+'</div></div>').join('')+'</div><p class="pro-para" style="margin-top:12px">आपके जीवन पथ '+lp+' के लिए — <strong>'+(['उत्तर','उत्तर-पूर्व','पूर्व','दक्षिण-पूर्व','उत्तर','दक्षिण-पश्चिम','उत्तर-पश्चिम','उत्तर','दक्षिण'][lp-1]||'उत्तर-पूर्व')+'</strong> दिशा सबसे महत्वपूर्ण है। इस दिशा में अपना अध्ययन कक्ष या कार्यस्थल रखें।</p>';

  // 15. Past Life
  const plPatterns=[{n:'कर्तव्य का त्याग','i':'पिछले जन्म में आप बड़े दायित्वों से भाग गए। इस जन्म में जिम्मेदारी लेना ही मुक्ति है।'},{n:'शक्ति का दुरुपयोग','i':'अतीत में सत्ता और प्रभाव का गलत उपयोग किया। इस जन्म में नम्रता ही मार्ग है।'},{n:'प्रेम से वंचित','i':'आत्मा ने गहरे प्रेम की कमी महसूस की। इस जन्म में प्रेम देना और पाना ही उद्देश्य है।'},{n:'ज्ञान की उपेक्षा','i':'विद्या और ज्ञान का अनादर किया था। इस जन्म में सीखना और सिखाना सर्वोपरि है।'}];
  const pl=plPatterns[lp%4];
  document.getElementById('pro-past-life').innerHTML='<div class="past-life-box"><p class="pro-para"><strong>पिछले जन्म का कर्म-पैटर्न: '+pl.n+'</strong></p><p class="pro-para">'+pl.i+'</p></div><p class="pro-para">जन्म के अंक '+lp+', '+S.day+' (जन्म दिन), और '+S.month+' (जन्म माह) मिलकर बताते हैं कि आत्मा कहाँ से आई है और क्या सीखने आई है।</p>';

  // 16. Soul Mission
  document.getElementById('pro-soul').innerHTML='<div class="soul-mission-box"><div class="sm-num">'+lp+'</div><h3 style="font-size:1.2rem;color:#fff;margin-bottom:8px">आपका आत्मिक मिशन: '+lpD.arch+'</h3><p style="font-size:.88rem;color:var(--ptl);line-height:1.6">'+lpD.mission+'</p></div><p class="pro-para" style="margin-top:16px">'+S.name+' जी, आपकी यात्रा यहाँ से शुरू होती है। आपका जीवन पथ '+lp+' आपको बताता है कि आप '+lpD.mission.toLowerCase()+' के लिए आए हैं। जब आप इस पथ पर चलते हैं, तो ब्रह्मांड खुद आपका रास्ता साफ करता है।</p><div class="pro-highlight">आपका कर्म-मंत्र: "मैं '+lpD.arch+' हूँ। मेरा अस्तित्व उद्देश्यपूर्ण है। मैं अपने मिशन को पूरा करूंगा।"</div>';
}
