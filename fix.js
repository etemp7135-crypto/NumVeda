const fs = require('fs');
let html = fs.readFileSync('love.html', 'utf8');

// Condense the report view
const newBody = `
  document.getElementById('lv-rpt-body').innerHTML=\`
    <div style="padding:20px; text-align:center; background:rgba(233,30,140,0.05); border-radius:12px; margin:0 16px 20px; border:1px solid rgba(233,30,140,0.2);">
      <h3 style="color:var(--la); margin-bottom:10px; font-size:1.1rem;">आपकी 25-पेज प्रीमियम रिपोर्ट तैयार है!</h3>
      <p style="font-size:0.85rem; color:var(--lm); line-height:1.5;">नीचे दी गई जानकारी केवल एक संक्षिप्त सारांश है। आपके जीवन-पथ, भाग्य-अंक, आत्मा-अंक और भविष्यवाणियों का अत्यंत गहरा विश्लेषण हमारी <strong>25-पेज की विस्तृत PDF रिपोर्ट</strong> में दिया गया है।</p>
    </div>
    <div class="lv-rs"><div class="lv-rs-title"><span>🌟</span> 1 — जीवन-पथ सारांश</div>
      <div class="lv-num-cmp"><div class="lv-num-box"><div class="lv-nval c1">\${lp1}</div><div class="lv-nname">\${fn1}</div><div class="lv-nlbl">जीवन-पथ</div></div><div class="lv-num-box"><div class="lv-nval c2">\${lp2}</div><div class="lv-nname">\${fn2}</div><div class="lv-nlbl">जीवन-पथ</div></div></div>
      <div class="lv-rs-body"><p><strong>इन दोनों का मिलन:</strong> \${ltxt.s}</p>
      <div class="lv-bar-row"><span class="lv-bar-lbl">अनुकूलता</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-acc" style="width:\${score}%"></div></div><span class="lv-bar-val">\${score}%</span></div></div></div>
    
    <div class="lv-rs alt"><div class="lv-rs-title"><span>📊</span> 2 — अनुकूलता के 3 स्तंभ</div>
      <div class="lv-rs-body">
        <div class="lv-bar-row"><span class="lv-bar-lbl">शारीरिक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-acc" style="width:\${phys}%"></div></div><span class="lv-bar-val">\${phys}%</span></div>
        <div class="lv-bar-row"><span class="lv-bar-lbl">भावनात्मक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-prp" style="width:\${emo}%"></div></div><span class="lv-bar-val">\${emo}%</span></div>
        <div class="lv-bar-row"><span class="lv-bar-lbl">बौद्धिक</span><div class="lv-bar"><div class="lv-bar-fill lv-bf-gold" style="width:\${intel}%"></div></div><span class="lv-bar-val">\${intel}%</span></div>
      </div></div>
      
    <div class="lv-rs gold-bdr"><div class="lv-rs-title"><span>🔮</span> 3 — सारांश और आगे क्या?</div>
      <div class="lv-rs-body">
        <p style="margin-bottom: 10px;">आपकी विस्तृत रिपोर्ट में आत्मा-अंक, भाग्य-अंक, 5 साल की भविष्यवाणी, और अचूक वैदिक उपाय शामिल हैं। पूरी जानकारी के लिए अभी PDF डाउनलोड करें।</p>
        <p style="color:var(--lg); font-weight:bold;">विवाह योग: \${score>=80?'बेहद शुभ':'संभव'}</p>
      </div></div>\`;
`;

// Replace massive HTML block
html = html.replace(/document\.getElementById\('lv-rpt-body'\)\.innerHTML=`[\s\S]*?      <\/div><\/div>`;/, newBody);

// Update downloadLovePDF to use raw HTML string
const newDownload = `function downloadLovePDF() {
  if(!window.generatePremiumPDFHTML) {
    alert("PDF सामग्री तैयार नहीं है। कृपया पृष्ठ रिफ्रेश करें।");
    return;
  }
  
  const btns = document.querySelectorAll('.lv-btn');
  btns.forEach(b => { b.dataset.origText = b.textContent; b.textContent = "तैयार हो रहा है..."; b.style.pointerEvents = "none"; });
  
  const opt = {
    margin:       0,
    filename:     \`NumVeda_Love_Report_\${LS.p1.name}_\${LS.p2.name}.pdf\`,
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  const htmlString = window.generatePremiumPDFHTML(C);
  
  // Need to append a temporary element for html2pdf because passing raw string works, but sometimes loses external CSS if not in DOM.
  // Actually, passing raw string is fine, but to be 100% safe against blank pages:
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  temp.style.top = '0';
  document.body.appendChild(temp);
  
  html2pdf().set(opt).from(temp).save().then(() => {
    btns.forEach(b => { b.textContent = b.dataset.origText; b.style.pointerEvents = "auto"; });
    document.body.removeChild(temp);
  }).catch(e => {
    console.error(e);
    alert("डाउनलोड विफल।");
    btns.forEach(b => { b.textContent = b.dataset.origText; b.style.pointerEvents = "auto"; });
    document.body.removeChild(temp);
  });
}`;

html = html.replace(/function downloadLovePDF\(\) \{[\s\S]*?\n\}/, newDownload);

fs.writeFileSync('love.html', html);
console.log('Fixes applied successfully.');
