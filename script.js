// ═══════════════ PAGE NAVIGATION ═══════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  var target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.nav-link').forEach(function(a) {
    a.classList.toggle('active', a.dataset.page === id);
  });
  if (id === 'rechner' && typeof rechInit === 'function') rechInit();
}

// ═══════════════ MOBILE MENU ═══════════════
function toggleMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  var menu = document.getElementById('mobile-menu');
  var burger = document.querySelector('.nav-burger');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && e.target !== burger) {
    menu.classList.remove('open');
  }
});

// ═══════════════ ANGEBOT FORM ═══════════════
function submitForm() {
  var vorname = document.getElementById('f-vorname') ? document.getElementById('f-vorname').value.trim() : '';
  var email = document.getElementById('f-email') ? document.getElementById('f-email').value.trim() : '';
  if (!vorname || !email) { alert('Bitte Vorname und E-Mail ausfüllen.'); return; }
  var nachname = (document.getElementById('f-nachname') || {value:''}).value.trim();
  var leistung = (document.getElementById('f-leistung') || {value:''}).value;
  var nachricht = (document.getElementById('f-nachricht') || {value:''}).value.trim();
  var tel = (document.getElementById('f-tel') || {value:''}).value.trim();
  var subject = encodeURIComponent('Angebotsanfrage – ' + vorname + ' ' + nachname);
  var body = encodeURIComponent(
    'Neue Angebotsanfrage von der Website:\n\n' +
    'Name: ' + vorname + ' ' + nachname + '\n' +
    'E-Mail: ' + email + '\n' +
    (tel ? 'Telefon: ' + tel + '\n' : '') +
    (leistung ? 'Leistung: ' + leistung + '\n' : '') +
    (nachricht ? '\nNachricht:\n' + nachricht : '')
  );
  window.location.href = 'mailto:info&#64;schulz-gd.de?subject=' + subject + '&body=' + body;
  setTimeout(function() {
    var main = document.getElementById('form-main');
    var success = document.getElementById('form-success');
    if (main) main.style.display = 'none';
    if (success) success.style.display = 'block';
  }, 500);
}

// ═══════════════ BEWERBUNG PAGE ═══════════════
var bewSelectedFiles = [];

function handleFiles(fileList) {
  for (var i = 0; i < fileList.length; i++) {
    var f = fileList[i];
    // avoid duplicates
    var exists = bewSelectedFiles.some(function(x){ return x.name === f.name && x.size === f.size; });
    if (!exists) bewSelectedFiles.push(f);
  }
  renderFileList();
}

function removeFile(index) {
  bewSelectedFiles.splice(index, 1);
  renderFileList();
}

function renderFileList() {
  var list = document.getElementById('bew-file-list');
  if (!list) return;
  if (bewSelectedFiles.length === 0) { list.innerHTML = ''; return; }
  var html = '';
  var icons = {pdf:'📄', doc:'📝', docx:'📝', jpg:'🖼️', jpeg:'🖼️', png:'🖼️'};
  bewSelectedFiles.forEach(function(f, i) {
    var ext = f.name.split('.').pop().toLowerCase();
    var icon = icons[ext] || '📎';
    var size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB';
    html += '<div class="file-item">' +
      '<span class="file-item-icon">' + icon + '</span>' +
      '<span class="file-item-name">' + f.name + '</span>' +
      '<span class="file-item-size">' + size + '</span>' +
      '<button class="file-item-remove" onclick="removeFile(' + i + ')" title="Entfernen">✕</button>' +
      '</div>';
  });
  list.innerHTML = html;
}

// drag & drop support
document.addEventListener('DOMContentLoaded', function() {
  initCookieBanner();
  var area = document.getElementById('bew-upload-area');
  if (area) {
    area.addEventListener('dragover', function(e) { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', function() { area.classList.remove('drag-over'); });
    area.addEventListener('drop', function(e) {
      e.preventDefault();
      area.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files);
    });
  }
  showPage('home');
  setTimeout(initServiceMap, 100);
});

function goToBewerbung(stelle) {
  // Reset form state before showing
  bewSelectedFiles = [];
  renderFileList();
  var formMain = document.getElementById('bew-form-main');
  var formSuccess = document.getElementById('bew-form-success');
  var hint = document.getElementById('bew-upload-hint');
  if (formMain) formMain.style.display = 'block';
  if (formSuccess) formSuccess.style.display = 'none';
  if (hint) hint.style.display = 'none';

  showPage('bewerbung');

  // Pre-select the job position
  var sel = document.getElementById('bew-stelle');
  if (sel && stelle) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === stelle) { sel.selectedIndex = i; break; }
    }
  }
}

function submitBewerbungPage() {
  var vorname = document.getElementById('bew-vorname').value.trim();
  var nachname = document.getElementById('bew-nachname').value.trim();
  var email = document.getElementById('bew-email').value.trim();
  var stelle = document.getElementById('bew-stelle').value;
  var nachricht = document.getElementById('bew-nachricht').value.trim();
  if (!vorname || !email || !stelle || !nachricht) {
    alert('Bitte Vorname, E-Mail, Stelle und Nachricht ausfüllen.');
    return;
  }
  if (!email.includes('@')) { alert('Bitte gültige E-Mail eingeben.'); return; }
  var telefon = document.getElementById('bew-telefon').value.trim();
  var verfuegbar = document.getElementById('bew-verfuegbar').value;

  // Build file list string
  var fileInfo = '';
  if (bewSelectedFiles.length > 0) {
    fileInfo = '\n\nAngehängte Unterlagen (' + bewSelectedFiles.length + ' Datei(en)):\n';
    bewSelectedFiles.forEach(function(f) {
      var size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB';
      fileInfo += '  • ' + f.name + ' (' + size + ')\n';
    });
    fileInfo += '\n⚠️ BITTE DATEIEN MANUELL IM E-MAIL-PROGRAMM ANHÄNGEN!';
  }

  var subject = encodeURIComponent('Bewerbung: ' + stelle + ' – ' + vorname + ' ' + nachname);
  var body = encodeURIComponent(
    'Neue Bewerbung über die Website:\n\n' +
    'Stelle: ' + stelle + '\n' +
    'Name: ' + vorname + ' ' + nachname + '\n' +
    'E-Mail: ' + email + '\n' +
    (telefon ? 'Telefon: ' + telefon + '\n' : '') +
    (verfuegbar ? 'Verfügbar: ' + verfuegbar + '\n' : '') +
    '\nÜber mich:\n' + nachricht +
    fileInfo
  );
  window.location.href = 'mailto:info&#64;schulz-gd.de?subject=' + subject + '&body=' + body;

  // Show hint if files selected, else show success directly
  setTimeout(function() {
    var hint = document.getElementById('bew-upload-hint');
    var main = document.getElementById('bew-form-main');
    var success = document.getElementById('bew-form-success');
    if (bewSelectedFiles.length > 0) {
      if (hint) hint.style.display = 'block';
      if (main) {
        // hide everything except file list and hint
        Array.from(main.querySelectorAll('.form-group, .form-row, .form-note, button')).forEach(function(el){
          el.style.display = 'none';
        });
        var fileList = main.querySelector('#bew-file-list');
        var uploadArea = main.querySelector('.upload-area');
        if (fileList) fileList.style.display = 'flex';
        if (uploadArea) uploadArea.style.display = 'none';
      }
    } else {
      if (main) main.style.display = 'none';
      if (success) success.style.display = 'block';
    }
  }, 600);
}

// ═══════════════ RÜCKRUF MODAL ═══════════════
function openCallback() {
  var form = document.getElementById('cb-form');
  var success = document.getElementById('cb-success');
  if (form) form.style.display = 'block';
  if (success) success.style.display = 'none';
  var modal = document.getElementById('callbackModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCallback() {
  var modal = document.getElementById('callbackModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', function(e) {
  var modal = document.getElementById('callbackModal');
  if (modal && modal.classList.contains('open') && e.target === modal) closeCallback();
});
function submitCallback() {
  var name = document.getElementById('cb-name').value.trim();
  var tel = document.getElementById('cb-tel').value.trim();
  if (!name || !tel) { alert('Bitte Name und Telefonnummer eingeben.'); return; }
  var zeit = document.getElementById('cb-zeit').value;
  var subject = encodeURIComponent('Rückrufanfrage – ' + name);
  var body = encodeURIComponent(
    'Rückrufanfrage von der Website:\n\n' +
    'Name: ' + name + '\n' +
    'Telefon: ' + tel + '\n' +
    (zeit ? 'Gewünschte Zeit: ' + zeit : 'Zeit: Egal, so schnell wie möglich')
  );
  window.location.href = 'mailto:info&#64;schulz-gd.de?subject=' + subject + '&body=' + body;
  setTimeout(function() {
    var form = document.getElementById('cb-form');
    var success = document.getElementById('cb-success');
    var nameEl = document.getElementById('cb-success-name');
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
    if (nameEl) nameEl.textContent = 'Danke, ' + name.split(' ')[0] + '!';
  }, 500);
}


// ═══════════════ FAQ ═══════════════
function toggleFaq(btn) {
  var item = btn.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el){ el.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// ═══════════════ COOKIE BANNER ═══════════════
function initCookieBanner() {
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(function() {
      var banner = document.getElementById('cookieBanner');
      if (banner) banner.classList.add('visible');
    }, 800);
  }
}
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  hideCookieBanner();
}
function hideCookieBanner() {
  var banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('visible');
  if (!localStorage.getItem('cookieConsent')) {
    localStorage.setItem('cookieConsent', 'declined');
  }
}
// ═══════════════ SERVICE MAP OVERLAY ═══════════════
function initServiceMap() {
  var container = document.getElementById('serviceMap');
  if (!container || container.querySelector('svg')) return;

  var W = 800, H = 500;
  var minLng = 11.106, maxLng = 11.890;
  var minLat = 47.862, maxLat = 48.412;

  function px(lng) { return (lng - minLng) / (maxLng - minLng) * W; }
  function py(lat) { return (1 - (lat - minLat) / (maxLat - minLat)) * H; }

  var s = [];
  s.push('<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">');
  s.push('<defs>');
  s.push('<filter id="gf"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>');
  s.push('<filter id="lf"><feGaussianBlur stdDeviation="3"/></filter>');
  s.push('</defs>');

  // ── STANDORT MARKER — Gräfelfing ──
  var ox = 202, oy = 336;

  // Outer pulse rings
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+oy.toFixed(1)+'" r="16" fill="none" stroke="rgba(201,168,76,0.5)" stroke-width="1.5"><animate attributeName="r" values="16;38;16" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2.6s" repeatCount="indefinite"/></circle>');
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+oy.toFixed(1)+'" r="16" fill="none" stroke="rgba(201,168,76,0.25)" stroke-width="1"><animate attributeName="r" values="16;26;16" dur="2.6s" begin="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" begin="0.8s" repeatCount="indefinite"/></circle>');

  // Drop shadow
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+(oy+5).toFixed(1)+'" r="16" fill="rgba(0,0,0,0.35)" filter="url(#lf)"/>');

  // Outer ring (gold border)
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+oy.toFixed(1)+'" r="17" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.6)" stroke-width="1.5"/>');

  // Main gold circle
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+oy.toFixed(1)+'" r="13" fill="#c9a84c" filter="url(#gf)"/>');

  // Inner gradient effect — lighter center
  s.push('<circle cx="'+(ox-3).toFixed(1)+'" cy="'+(oy-3).toFixed(1)+'" r="7" fill="rgba(255,255,255,0.2)"/>');

  // White border ring
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+oy.toFixed(1)+'" r="13" fill="none" stroke="white" stroke-width="2.5"/>');

  // Center logo — location pin shape
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+(oy-1).toFixed(1)+'" r="4" fill="white"/>');
  s.push('<circle cx="'+ox.toFixed(1)+'" cy="'+(oy-1).toFixed(1)+'" r="2" fill="#c9a84c"/>');

  // Label pill above marker
  var lw=148, lh=44, lx=ox-lw/2, ly=oy-66;
  s.push('<line x1="'+ox.toFixed(1)+'" y1="'+(oy-14).toFixed(1)+'" x2="'+ox.toFixed(1)+'" y2="'+(ly+lh).toFixed(1)+'" stroke="rgba(201,168,76,0.55)" stroke-width="1.5" stroke-dasharray="3,2"/>');
  s.push('<rect x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" width="'+lw+'" height="'+lh+'" rx="8" fill="rgba(8,10,18,0.90)" stroke="rgba(201,168,76,0.75)" stroke-width="1.5"/>');
  s.push('<text x="'+ox.toFixed(1)+'" y="'+(ly+15).toFixed(1)+'" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="700" fill="#c9a84c">Unser Standort</text>');
  s.push('<text x="'+ox.toFixed(1)+'" y="'+(ly+28).toFixed(1)+'" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="9" fill="rgba(255,255,255,0.65)">Gräfelfing · München</text>');
  s.push('<text x="'+ox.toFixed(1)+'" y="'+(ly+39).toFixed(1)+'" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="8.5" fill="rgba(255,255,255,0.4)">Lochhamer Schlag 11a</text>');




  s.push('</svg>');
  container.innerHTML = s.join('');
}



// ═══════════════ ANGEBOTSRECHNER ═══════════════
(function() {
  const ANFAHRT = 30;
  const TURNUS = [
    {label:"täglich 2× (7 Tage)", fak:60.84},
    {label:"täglich 2× (6 Tage)", fak:52.17},
    {label:"täglich 2× (5 Tage)", fak:43.5},
    {label:"7× wöchentlich",      fak:30.45},
    {label:"6× wöchentlich",      fak:25.09},
    {label:"5× wöchentlich",      fak:21.75},
    {label:"4× wöchentlich",      fak:17.4},
    {label:"3× wöchentlich",      fak:12.54},
    {label:"2,5× wöchentlich",    fak:10.92},
    {label:"2× wöchentlich",      fak:8.7},
    {label:"1× wöchentlich",      fak:4.35},
    {label:"14-tägig",            fak:2.0},
    {label:"1× monatlich",        fak:1.0},
  ];
  const RAUMARTEN = [
    {label:"Büro",                  mid:195},
    {label:"Besprechungszimmer",    mid:215},
    {label:"WC / Wasch / Dusch",    mid:75},
    {label:"Teeküche",              mid:115},
    {label:"Aufenthaltsraum",       mid:155},
    {label:"Umkleide / Garderobe",  mid:220},
    {label:"Aufzug",                mid:120},
    {label:"Flur manuell",          mid:300},
    {label:"Flur maschinell",       mid:475},
    {label:"Eingangshalle / Foyer", mid:425},
    {label:"Treppenhaus",           mid:165},
    {label:"Nebenraum / Lager",     mid:300},
  ];

  let lohn = 35, rooms = [], uid = 0, initialized = false;

  function fmt(n) {
    return n.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €';
  }

  function makeRow(id, raumIdx, qm, turnusIdx) {
    const ra = RAUMARTEN.map((r,i) => `<option value="${i}"${i===raumIdx?' selected':''}>${r.label}</option>`).join('');
    const tu = TURNUS.map((t,i) => `<option value="${i}"${i===turnusIdx?' selected':''}>${t.label}</option>`).join('');
    return `<tr id="rechrow${id}">
      <td class="rech-td"><select class="rech-select" onchange="rechUpd(${id},'raumIdx',+this.value)">${ra}</select></td>
      <td class="rech-td"><input class="rech-input" type="number" value="${qm}" min="1" max="9999" oninput="rechUpd(${id},'qm',+this.value)"></td>
      <td class="rech-td"><select class="rech-select" onchange="rechUpd(${id},'turnusIdx',+this.value)">${tu}</select></td>
      <td class="rech-td"><button class="rech-del" onclick="rechDelRoom(${id})">×</button></td>
    </tr>`;
  }

  window.rechAddRoom = function(raumIdx=0, qm=20, turnusIdx=10) {
    const id = uid++;
    rooms.push({id, raumIdx, qm, turnusIdx});
    const tbody = document.getElementById('rech-rooms-body');
    if (tbody) { tbody.insertAdjacentHTML('beforeend', makeRow(id, raumIdx, qm, turnusIdx)); rechCalc(); }
  };

  window.rechDelRoom = function(id) {
    rooms = rooms.filter(r => r.id !== id);
    const el = document.getElementById('rechrow' + id);
    if (el) el.remove();
    rechCalc();
  };

  window.rechUpd = function(id, key, val) {
    const r = rooms.find(r => r.id === id);
    if (r) { r[key] = val; rechCalc(); }
  };

  let lastMid = 0, lastDetails = [];

  function rechCalc() {
    let total = 0, details = [];
    rooms.forEach(r => {
      if (!r.qm || r.qm <= 0) return;
      const ra = RAUMARTEN[r.raumIdx], tu = TURNUS[r.turnusIdx];
      const k = (r.qm * tu.fak / ra.mid) * lohn;
      total += k;
      details.push({name: ra.label, qm: r.qm, turnus: tu.label, kosten: k});
    });
    const result = document.getElementById('rech-result');
    if (!result) return;
    if (!rooms.length || total === 0) { result.style.display = 'none'; return; }

    const mid = total * 1.19 + ANFAHRT;
    lastMid = mid; lastDetails = details;
    result.style.display = 'block';
    document.getElementById('rech-low').textContent  = fmt(mid * 0.85);
    document.getElementById('rech-mid').textContent  = fmt(mid);
    document.getElementById('rech-high').textContent = fmt(mid * 1.15);

    let html = '';
    details.forEach(d => {
      if (d.kosten > 0) html += `<div class="rech-detail-row"><span>${d.name}</span><span>${fmt(d.kosten * 1.19)}</span></div>`;
    });
    html += `<div class="rech-detail-row"><span>Anfahrtspauschale</span><span>${fmt(ANFAHRT)}</span></div>`;
    html += `<div class="rech-detail-row"><span>Gesamt inkl. MwSt. &amp; Anfahrt</span><span>${fmt(mid)}</span></div>`;
    document.getElementById('rech-detail').innerHTML = html;
  }

  window.rechAnfragen = function() {
    let body = 'Guten Tag,\n\nich habe Ihren Preisrechner genutzt und möchte ein verbindliches Angebot anfragen.\n\n';
    body += '--- KALKULATION ---\n';
    body += 'Stundensatz: ' + lohn + ' €/h\n\n';
    body += 'Räume / Flächen:\n';
    lastDetails.forEach(d => {
      const r = rooms.find(r => RAUMARTEN[r.raumIdx].label === d.name);
      body += '  • ' + d.name + ' – ' + (r ? r.qm : '?') + ' m²' + ' – ' + d.turnus + ' – ' + fmt(d.kosten * 1.19) + '/Monat\n';
    });
    body += '\nAnfahrtspauschale: ' + fmt(ANFAHRT) + '\n';
    body += '\nMindestpreis:      ' + fmt(lastMid * 0.85) + '/Monat\n';
    body += 'Kalkulierter Preis: ' + fmt(lastMid) + '/Monat\n';
    body += 'Höchstpreis:       ' + fmt(lastMid * 1.15) + '/Monat\n';
    body += '\n(inkl. MwSt. 19 %, inkl. Anfahrt – unverbindliche Schätzung)\n\n';
    body += 'Mit freundlichen Grüßen\n';
    const subject = encodeURIComponent('Angebotsanfrage Unterhaltsreinigung – Preisrechner');
    window.location.href = 'mailto:info@schulz-gd.de?subject=' + subject + '&body=' + encodeURIComponent(body);
  };

  window.rechInit = function() {
    if (initialized) return;
    initialized = true;
    rechAddRoom(0, 40, 10);
    rechAddRoom(2, 15, 10);
    rechAddRoom(7, 30, 10);
    document.querySelectorAll('#lohn-group .rech-pill').forEach(p => {
      p.addEventListener('click', () => {
        document.querySelectorAll('#lohn-group .rech-pill').forEach(x => x.classList.remove('on'));
        p.classList.add('on');
        lohn = +p.dataset.lohn;
        rechCalc();
      });
    });
  };
})();
