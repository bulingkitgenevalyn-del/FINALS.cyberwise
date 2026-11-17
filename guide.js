/* =========================================================
   CYBERWISE - guide.js
   Features of the GUIDE page: password checker + generator,
   threats search/filter, and the privacy checklist.
   Needs data.js and main.js loaded before it.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   7. PASSWORD GUIDE: strength checker + generator
   --------------------------------------------------------- */
const COMMON_WORDS = ['password', '123456', 'qwerty', 'abc123', 'iloveyou', 'admin', 'letmein',
                      'welcome', 'monkey', 'dragon', '111111', 'sunshine', 'princess', 'football',
                      '1q2w3e', 'login', 'master', 'passw0rd'];
const SEQUENCES = ['1234', '2345', '3456', '4567', '5678', '6789', 'abcd', 'bcde', 'qwer', 'asdf', 'zxcv'];

function isCommon(pw) {
  const lower = pw.toLowerCase();
  for (const word of COMMON_WORDS) {
    if (lower.includes(word)) return true;
  }
  for (const seq of SEQUENCES) {
    if (lower.includes(seq)) return true;
  }
  return false;
}

// Runs each rule and returns an object of true/false results
function runChecks(pw) {
  return {
    length: pw.length >= 12,
    upper:  /[A-Z]/.test(pw),
    lower:  /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    common: pw.length > 0 && !isCommon(pw)
  };
}

// Score from 0 to 100
function scorePassword(pw, checks) {
  if (pw.length === 0) return 0;
  const collapsed = pw.replace(/(.)\1+/g, '$1');   // "aaaa" counts as one character
  let score = Math.min(collapsed.length, 12) * 4; // up to 48 for length
  if (checks.upper)  score += 13;
  if (checks.lower)  score += 13;
  if (checks.number) score += 13;
  if (checks.symbol) score += 13;
  if (collapsed.length > 12) score += Math.min(collapsed.length - 12, 8); // small bonus for very long
  if (!checks.common) score = Math.min(score, 25); // common patterns are always weak
  return Math.max(0, Math.min(100, score));
}

function labelFor(score) {
  if (score < 30) return { text: 'Very Weak', color: '#ff4d6d' };
  if (score < 50) return { text: 'Weak',      color: '#ff8c42' };
  if (score < 70) return { text: 'Fair',      color: '#ffc857' };
  if (score < 90) return { text: 'Strong',    color: '#9dff57' };
  return { text: 'Very Strong', color: '#39ff88' };
}

// Rough estimate only: assumes 10 billion guesses per second
function crackTime(pw, checks) {
  if (!checks.common) return 'instantly';
  let pool = 0;
  if (checks.lower)  pool += 26;
  if (checks.upper)  pool += 26;
  if (checks.number) pool += 10;
  if (checks.symbol) pool += 32;
  const length = pw.replace(/(.)\1+/g, '$1').length;   // ignore repeated characters
  const seconds = Math.pow(pool, length) / 2 / 1e10;
  if (seconds < 1)        return 'instantly';
  if (seconds < 60)       return Math.round(seconds) + ' seconds';
  if (seconds < 3600)     return Math.round(seconds / 60) + ' minutes';
  if (seconds < 86400)    return Math.round(seconds / 3600) + ' hours';
  if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
  if (seconds < 3.15e9)   return Math.round(seconds / 31536000) + ' years';
  return 'centuries';
}

function updatePasswordMeter() {
  const pw = $('#pwInput').value;
  const checks = runChecks(pw);
  const score = scorePassword(pw, checks);

  // tick or untick each rule in the list
  $$('#pwChecks li').forEach((li) => {
    li.classList.toggle('ok', checks[li.dataset.check] === true);
  });

  if (pw.length === 0) {
    $('#pwBar').style.width = '0%';
    $('#pwLabel').textContent = 'Type something to begin';
    $('#pwCrack').textContent = '';
    return;
  }

  const label = labelFor(score);
  $('#pwBar').style.width = Math.max(score, 6) + '%';
  $('#pwBar').style.background = label.color;
  $('#pwLabel').textContent = label.text;
  $('#pwLabel').style.color = label.color;
  $('#pwCrack').textContent = ' | Rough time to crack: ' + crackTime(pw, checks);
}

$('#pwInput').addEventListener('input', updatePasswordMeter);

$('#pwShow').addEventListener('click', () => {
  const input = $('#pwInput');
  const hidden = input.type === 'password';
  input.type = hidden ? 'text' : 'password';
  $('#pwShow').textContent = hidden ? '🙈 Hide' : '👁 Show';
});

// ----- Password generator -----
$('#genLength').addEventListener('input', () => {
  $('#genLenText').textContent = $('#genLength').value;
});

// Picks a secure random whole number from 0 to max-1
function randomInt(max) {
  const buffer = new Uint32Array(1);
  window.crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

function generatePassword() {
  const sets = [];
  if ($('#optUpper').checked)  sets.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
  if ($('#optLower').checked)  sets.push('abcdefghijkmnopqrstuvwxyz');
  if ($('#optNumber').checked) sets.push('23456789');
  if ($('#optSymbol').checked) sets.push('!@#$%^&*?-_');

  if (sets.length === 0) {
    $('#genMsg').textContent = 'Choose at least one character type.';
    $('#genOutput').value = '';
    return;
  }
  $('#genMsg').textContent = '';

  const length = parseInt($('#genLength').value, 10);
  const chars = [];

  // make sure at least one character from every chosen type is included
  sets.forEach((set) => chars.push(set[randomInt(set.length)]));

  const all = sets.join('');
  while (chars.length < length) {
    chars.push(all[randomInt(all.length)]);
  }

  // shuffle so the guaranteed characters are not always at the front
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  $('#genOutput').value = chars.join('');
}

$('#genBtn').addEventListener('click', generatePassword);

$('#copyBtn').addEventListener('click', () => {
  const value = $('#genOutput').value;
  if (value === '') {
    $('#genMsg').textContent = 'Generate a password first.';
    return;
  }
  const done = () => { $('#genMsg').textContent = 'Copied to clipboard!'; };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(done).catch(() => {
      $('#genOutput').select();
      $('#genMsg').textContent = 'Press Ctrl+C to copy the selected text.';
    });
  } else {
    $('#genOutput').select();
    $('#genMsg').textContent = 'Press Ctrl+C to copy the selected text.';
  }
});

/* ---------------------------------------------------------
   8. COMMON CYBER THREATS (search + filter)
   --------------------------------------------------------- */
let threatFilter = 'all';

function renderThreats() {
  const list = $('#threatList');
  list.innerHTML = '';
  // remove spaces and symbols so "wifi" also matches "Wi-Fi"
  const simplify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const query = simplify($('#threatSearch').value);

  const results = THREATS.filter((t) => {
    const matchesFilter = threatFilter === 'all' || t.cat === threatFilter;
    const text = simplify(t.name + ' ' + t.short + ' ' + t.what);
    return matchesFilter && (query === '' || text.includes(query));
  });

  $('#threatCount').textContent = results.length + ' threat(s) found';

  if (results.length === 0) {
    list.innerHTML = '<p>No match. Try a word like "phishing" or "wifi".</p>';
    return;
  }

  results.forEach((t) => {
    const details = document.createElement('details');
    details.className = 'threat ' + t.cat;
    details.innerHTML =
      '<summary>' + t.emoji + ' ' + t.name + '<small>' + t.short + '</small></summary>' +
      '<div class="body">' +
        '<p>' + t.what + '</p>' +
        '<h4>🚩 Warning signs</h4><ul>' + t.signs.map((s) => '<li>' + s + '</li>').join('') + '</ul>' +
        '<h4>🛡️ How to stay safe</h4><ul>' + t.safe.map((s) => '<li>' + s + '</li>').join('') + '</ul>' +
      '</div>';
    list.appendChild(details);
  });
}

$('#threatSearch').addEventListener('input', renderThreats);
$('#threatClear').addEventListener('click', () => {
  $('#threatSearch').value = '';
  renderThreats();
});
$$('#threats .filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('#threats .filter').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    threatFilter = btn.dataset.filter;
    renderThreats();
  });
});

/* ---------------------------------------------------------
   9. ONLINE PRIVACY TIPS (checklist saved in localStorage)
   --------------------------------------------------------- */
function renderPrivacy() {
  const done = loadJSON(KEY_PRIVACY, {});
  const list = $('#privList');
  list.innerHTML = '';
  let count = 0;

  PRIVACY_TIPS.forEach((tip) => {
    const checked = done[tip.id] === true;
    if (checked) count++;

    const label = document.createElement('label');
    label.className = 'priv-item' + (checked ? ' done' : '');
    label.innerHTML =
      '<input type="checkbox" data-id="' + tip.id + '"' + (checked ? ' checked' : '') + '>' +
      '<div><b>' + tip.title + '</b><small>' + tip.note + '</small></div>';
    list.appendChild(label);
  });

  const percent = Math.round((count / PRIVACY_TIPS.length) * 100);
  $('#privBar').style.width = percent + '%';
  $('#privBar').style.background = percent === 100 ? '#39ff88' : '#00e5ff';
  $('#privText').textContent = count + ' of ' + PRIVACY_TIPS.length + ' done (' + percent + '%)' +
                               (percent === 100 ? ' 🎉 Great job!' : '');
}

$('#privList').addEventListener('change', (event) => {
  if (event.target.type !== 'checkbox') return;
  const done = loadJSON(KEY_PRIVACY, {});
  done[event.target.dataset.id] = event.target.checked;
  saveJSON(KEY_PRIVACY, done);
  renderPrivacy();
});

$('#privReset').addEventListener('click', () => {
  saveJSON(KEY_PRIVACY, {});
  renderPrivacy();
});

/* ---------------------------------------------------------
   START UP
   --------------------------------------------------------- */
setupTabs();            // Awareness / Passwords / Threats / Privacy tabs
renderThreats();
renderPrivacy();
updatePasswordMeter();
