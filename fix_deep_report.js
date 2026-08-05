const fs = require('fs');
let html = fs.readFileSync('love.html', 'utf8');

const newBody = `
    <!-- DEEP SECTION 1 -->
    <div class="lv-rs"><div class="lv-rs-title"><span>🌟</span> 1 — जीवन-पथ: गहरा ब्रह्मांडीय विश्लेषण</div>
      <div class="lv-num-cmp"><div class="lv-num-box"><div class="lv-nval c1">\${lp1}</div><div class="lv-nname">\${fn1}</div><div class="lv-nlbl">जीवन-पथ</div></div><div class="lv-num-box"><div class="lv-nval c2">\${lp2}</div><div class="lv-nname">\${fn2}</div><div class="lv-nlbl">जीवन-पथ</div></div></div>
      <div class="lv-rs-body">
        <h4 style="color:var(--la); margin-bottom:4px;">\${fn1} का जीवन-पथ (\${lp1}):</h4>
        <p style="margin-bottom:12px;">\${LOVE_REPORT_TEXT.lp[lp1] ? LOVE_REPORT_TEXT.lp[lp1].meaning : lpDesc(lp1,fn1)}<br>
        <strong>ताकत:</strong> \${LOVE_REPORT_TEXT.lp[lp1] ? LOVE_REPORT_TEXT.lp[lp1].strengths : ''}<br>
        <strong>कमजोरी:</strong> \${LOVE_REPORT_TEXT.lp[lp1] ? LOVE_REPORT_TEXT.lp[lp1].weaknesses : ''}</p>
        
        <h4 style="color:var(--la); margin-bottom:4px;">\${fn2} का जीवन-पथ (\${lp2}):</h4>
        <p style="margin-bottom:12px;">\${LOVE_REPORT_TEXT.lp[lp2] ? LOVE_REPORT_TEXT.lp[lp2].meaning : lpDesc(lp2,fn2)}<br>
        <strong>ताकत:</strong> \${LOVE_REPORT_TEXT.lp[lp2] ? LOVE_REPORT_TEXT.lp[lp2].strengths : ''}<br>
        <strong>कमजोरी:</strong> \${LOVE_REPORT_TEXT.lp[lp2] ? LOVE_REPORT_TEXT.lp[lp2].weaknesses : ''}</p>
        
        <h4 style="color:var(--lg); margin-bottom:4px;">इन दोनों का मिलन:</h4>
        <p>\${ltxt.s}</p>
        <p><strong>प्रेम शैली:</strong> \${ltxt.l}</p>
      <div class="lv-bar-row"><span class="lv-bar-lbl">अनुकूलता</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-acc" style="width:\${score}%"></div></div><span class="lv-bar-val">\${score}%</span></div></div></div>

    <!-- DEEP SECTION 2 -->
    <div class="lv-rs alt"><div class="lv-rs-title"><span>💜</span> 2 — आत्मा-अंक: भीतरी आवाज़</div>
      <div class="lv-num-cmp"><div class="lv-num-box"><div class="lv-nval c1">\${soul1}</div><div class="lv-nname">\${fn1}</div><div class="lv-nlbl">आत्मा-अंक</div></div><div class="lv-num-box"><div class="lv-nval c2">\${soul2}</div><div class="lv-nname">\${fn2}</div><div class="lv-nlbl">आत्मा-अंक</div></div></div>
      <div class="lv-rs-body">
        <p><strong>\${fn1} (आत्मा-अंक \${soul1}):</strong> \${LOVE_REPORT_TEXT.soul[soul1] || soulDesc(soul1,fn1)}</p>
        <p><strong>\${fn2} (आत्मा-अंक \${soul2}):</strong> \${LOVE_REPORT_TEXT.soul[soul2] || soulDesc(soul2,fn2)}</p>
        <p>\${soul1===soul2?\`दोनों की आत्माएं एक ही भाषा बोलती हैं — यह दुर्लभ और गहरा बंधन है।\`:\`दोनों की भावनात्मक ज़रूरतें \${Math.abs(soul1-soul2)<=2?'बेहद मिलती-जुलती हैं।':'अलग हैं — यही अंतर एक-दूसरे को पूर्ण करता है।'}\`}</p>
      <div class="lv-bar-row"><span class="lv-bar-lbl">आत्मिक मेल</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-prp" style="width:\${emo}%"></div></div><span class="lv-bar-val">\${emo}%</span></div></div></div>

    <div class="lv-rs"><div class="lv-rs-title"><span>💕</span> 3 — प्रेम भाषा डिकोड</div>
      <div class="lv-rs-body"><p><strong>\${fn1} की प्रेम भाषा:</strong> \${getLang(soul1)}</p><p><strong>\${fn2} की प्रेम भाषा:</strong> \${getLang(soul2)}</p><p>\${soul1===soul2?\`दोनों एक ही प्रेम भाषा बोलते हैं — बेहद दुर्लभ और सुंदर।\`:\`\${fn1} जिस तरह प्रेम व्यक्त करते हैं और \${fn2} जिस तरह महसूस करते हैं — थोड़े अलग हैं। एक-दूसरे की भाषा सीखना ज़रूरी है।\`}</p></div></div>
    
    <div class="lv-rs alt gold-bdr"><div class="lv-rs-title"><span>✨</span> 4 — रिश्ते की शक्तियाँ</div>
      <div class="lv-rs-body">
        <div class="lv-list-item"><span class="lv-li-icon">💎</span><span>\${fn1} और \${fn2} एक-दूसरे की सबसे बड़ी कमज़ोरी को ताकत में बदल सकते हैं।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">💎</span><span>दोनों के बीच एक स्वाभाविक समझ है जो बिना कहे भी महसूस होती है।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">💎</span><span>इस रिश्ते में एक-दूसरे के साथ बढ़ने की असाधारण क्षमता है।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">💎</span><span>\${ltxt.s}</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">💎</span><span>\${ltxt.l}</span></div>
      </div></div>
      
    <div class="lv-rs"><div class="lv-rs-title"><span>🌿</span> 5 — चुनौतियाँ और समाधान</div>
      <div class="lv-rs-body"><p>\${ltxt.c}</p>
        <div class="lv-list-item"><span class="lv-li-icon">⚡</span><span>संचार में खुलापन ज़रूरी है — जो मन में है वो कहें, छुपाएं नहीं।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">⚡</span><span>एक-दूसरे की स्वतंत्रता का सम्मान करें — प्रेम में नियंत्रण नहीं होता।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">⚡</span><span>गुस्से के क्षणों में शांत रहना सीखें — कड़वे शब्द लंबे समय तक घाव करते हैं।</span></div>
        <div class="lv-list-item"><span class="lv-li-icon">⚡</span><span>अपेक्षाओं को स्पष्ट बोलें — दूसरे मन के भाव नहीं पढ़ सकते।</span></div>
      </div></div>
      
    <div class="lv-rs alt"><div class="lv-rs-title"><span>📊</span> 6 — शारीरिक, भावनात्मक, बौद्धिक अनुकूलता</div>
      <div class="lv-rs-body">
        <div class="lv-bar-row"><span class="lv-bar-lbl">शारीरिक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-acc" style="width:\${phys}%"></div></div><span class="lv-bar-val">\${phys}%</span></div>
        <div class="lv-bar-row"><span class="lv-bar-lbl">भावनात्मक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-prp" style="width:\${emo}%"></div></div><span class="lv-bar-val">\${emo}%</span></div>
        <div class="lv-bar-row"><span class="lv-bar-lbl">बौद्धिक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-gold" style="width:\${intel}%"></div></div><span class="lv-bar-val">\${intel}%</span></div>
        <p style="margin-top:12px;">\${emo>=80?\`दोनों के बीच भावनात्मक जुड़ाव बहुत गहरा है — यही इस रिश्ते की सबसे बड़ी ताकत है।\`:intel>=80?\`बौद्धिक स्तर पर दोनों एक-दूसरे से बहुत प्रभावित होते हैं।\`:\`दोनों के बीच संतुलित अनुकूलता है।\`}</p>
      </div></div>
      
    <!-- DEEP SECTION 7 -->
    <div class="lv-rs"><div class="lv-rs-title"><span>🎯</span> 7 — भाग्य-अंक: जीवन का अंतिम लक्ष्य</div>
      <div class="lv-num-cmp"><div class="lv-num-box"><div class="lv-nval c1">\${dest1}</div><div class="lv-nname">\${fn1}</div><div class="lv-nlbl">भाग्य-अंक</div></div><div class="lv-num-box"><div class="lv-nval c2">\${dest2}</div><div class="lv-nname">\${fn2}</div><div class="lv-nlbl">भाग्य-अंक</div></div></div>
      <div class="lv-rs-body">
        <p><strong>\${fn1} (भाग्य \${dest1}):</strong> \${LOVE_REPORT_TEXT.destiny[dest1] || ''}</p>
        <p><strong>\${fn2} (भाग्य \${dest2}):</strong> \${LOVE_REPORT_TEXT.destiny[dest2] || ''}</p>
        <p>\${dest1===dest2?\`\${fn1} और \${fn2} के भाग्य-अंक समान हैं (\${dest1}) — दोनों के जीवन लक्ष्य एक ही दिशा में हैं। बेहद शुभ!\`:\`\${fn1} और \${fn2} के जीवन लक्ष्य \${Math.abs(dest1-dest2)<=2?'मिलती-जुलती दिशाओं में हैं।':'अलग-अलग दिशाओं में हैं — लेकिन एक-दूसरे के पूरक हो सकते हैं।'}\`}</p>
      <div class="lv-bar-row"><span class="lv-bar-lbl">लक्ष्य मेल</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-gold" style="width:\${intel}%"></div></div><span class="lv-bar-val">\${intel}%</span></div></div></div>
      
    <div class="lv-rs alt gold-bdr"><div class="lv-rs-title"><span>💍</span> 8 — विवाह अनुकूलता</div>
      <div class="lv-rs-body"><p>\${score>=80?\`\${fn1} और \${fn2} की अनुकूलता विवाह के लिए बेहद शुभ है। आपके अंकों का मेल दर्शाता है कि यह एक दीर्घकालिक और संतोषजनक जीवन साथी का रिश्ता हो सकता है।\`:score>=65?\`\${fn1} और \${fn2} के बीच विवाह की अच्छी संभावना है। कुछ क्षेत्रों में समझौता और संवाद ज़रूरी होगा।\`:\`\${fn1} और \${fn2} के बीच विवाह संभव है। पहले एक-दूसरे को गहराई से समझना ज़रूरी है।\`}</p><p><strong>शुभ तारीखें:</strong> \${ad.slice(0,4).join(', ')} — हर महीने।</p><p><strong>सर्वश्रेष्ठ विवाह मास:</strong> \${am[lp1%4]} या \${am[lp2%4]}।</p></div></div>
      
    <div class="lv-rs"><div class="lv-rs-title"><span>🔮</span> 9 — 2026–2030 रिश्ते की भविष्यवाणी</div>
      <div class="lv-rs-body" style="padding-top:4px;">\${Object.entries(years).map(([y,[t,tx]])=>\`<div class="lv-yr-row"><div class="lv-yr-num">\${y}</div><div class="lv-yr-txt"><span class="lv-yr-tag \${t}">\${t==='good'?'शुभ':t==='ok'?'सामान्य':'चुनौती'}</span><br>\${tx}</div></div>\`).join('')}</div></div>
      
    <div class="lv-rs alt"><div class="lv-rs-title"><span>📅</span> 10 — शुभ तारीखें और मुहूर्त</div>
      <div class="lv-rs-body"><p>आपके दोनों के अंकों के आधार पर ये तारीखें बेहद शुभ हैं:</p>
        <div class="lv-date-grid">\${ad.map(d=>\`<div class="lv-date-card"><div class="lv-date-num">\${d}</div><div class="lv-date-lbl">हर महीने</div></div>\`).join('')}</div>
        <p style="margin-top:12px;"><strong>सलाह:</strong> कोई भी बड़ा निर्णय — सगाई, शादी, एक साथ रहना — इन तारीखों पर करें।</p></div></div>
        
    <div class="lv-rs gold-bdr"><div class="lv-rs-title"><span>📝</span> 11 — नाम अनुकूलता विश्लेषण</div>
      <div class="lv-num-cmp"><div class="lv-num-box"><div class="lv-nval c1">\${dest1}</div><div class="lv-nname">\${LS.p1.name}</div><div class="lv-nlbl">नाम-अंक</div></div><div class="lv-num-box"><div class="lv-nval c2">\${dest2}</div><div class="lv-nname">\${LS.p2.name}</div><div class="lv-nlbl">नाम-अंक</div></div></div>
      <div class="lv-rs-body"><p>\${dest1===dest2?\`दोनों के नामों का अंक एक समान (\${dest1}) — यह बेहद शुभ संकेत है। नामों की ऊर्जाएं सामंजस्यपूर्ण हैं।\`:Math.abs(dest1-dest2)<=2?\`दोनों के नामों की ऊर्जाएं मिलती-जुलती हैं।\`:\`यदि चाहें तो नाम की स्पेलिंग में छोटा बदलाव करके अनुकूलता बढ़ाई जा सकती है।\`}</p>\${dest1===dest2?\`<p style="color:var(--lg);font-weight:600;">✦ आप दोनों के नाम-अंक एक समान हैं — यह बेहद दुर्लभ और शुभ संयोग है!</p>\`:''}</div></div>
      
    <div class="lv-rs alt"><div class="lv-rs-title"><span>🌺</span> 12 — व्यक्तिगत उपाय और रत्न चिकित्सा</div>
      <div class="lv-rs-body">
        <div class="lv-remedy"><strong>रत्न चिकित्सा:</strong> \${fn1} के लिए \${gems(lp1)} और \${fn2} के लिए \${gems(lp2)} धारण करना शुभ रहेगा।</div>
        <div class="lv-remedy"><strong>साप्ताहिक उपाय:</strong> हर शुक्रवार को साथ बैठकर किसी की मदद करें। यह प्रेम के अंक 6 की ऊर्जा को सक्रिय करता है।</div>
        <div class="lv-remedy"><strong>रंग चिकित्सा:</strong> अपने घर में गुलाबी और सोने के रंग का इस्तेमाल करें — ये प्रेम और समृद्धि को आकर्षित करते हैं।</div>
        <div class="lv-remedy"><strong>मंत्र:</strong> "ॐ क्लीं नमः" — प्रेम और आकर्षण का मंत्र। दोनों मिलकर रोज़ सुबह 11 बार बोलें।</div>
        <div class="lv-remedy"><strong>21-दिन उपाय:</strong> अगले 21 दिनों तक रोज़ एक-दूसरे को एक सच्ची तारीफ दें। यह रिश्ते में सकारात्मक ऊर्जा का प्रवाह बढ़ाता है।</div>
      </div></div>
`;

// Replace massive HTML block
html = html.replace(/document\.getElementById\('lv-rpt-body'\)\.innerHTML=`[\s\S]*?      <\/div><\/div>`;/, `document.getElementById('lv-rpt-body').innerHTML=\`${newBody}\`;`);

// Fix downloadLovePDF to export the lv-report container natively without being blank!
const newDownload = `function downloadLovePDF() {
  const el = document.getElementById('lv-report');
  
  // To prevent html2canvas from cropping due to overflow, temporarily expand
  const origHeight = el.style.height;
  const origOverflow = el.style.overflow;
  el.style.height = 'auto';
  el.style.overflow = 'visible';
  
  const btns = document.querySelectorAll('.lv-btn');
  btns.forEach(b => { b.dataset.origText = b.textContent; b.textContent = "PDF तैयार हो रहा है..."; b.style.pointerEvents = "none"; });
  
  const opt = {
    margin:       [0, 0],
    filename:     \`NumVeda_Love_Report_\${LS.p1.name}_\${LS.p2.name}.pdf\`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: el.scrollWidth, windowHeight: el.scrollHeight },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(el).save().then(() => {
    btns.forEach(b => { b.textContent = b.dataset.origText; b.style.pointerEvents = "auto"; });
    el.style.height = origHeight;
    el.style.overflow = origOverflow;
  }).catch(e => {
    console.error(e);
    alert("डाउनलोड विफल।");
    btns.forEach(b => { b.textContent = b.dataset.origText; b.style.pointerEvents = "auto"; });
    el.style.height = origHeight;
    el.style.overflow = origOverflow;
  });
}`;

html = html.replace(/function downloadLovePDF\(\) \{[\s\S]*?\n\}/, newDownload);

fs.writeFileSync('love.html', html);
console.log('Deep report web view and exact PDF export fix applied successfully.');
