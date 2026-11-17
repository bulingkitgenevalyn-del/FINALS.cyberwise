/* =========================================================
   CYBERWISE - main.js
   Code shared by ALL pages, plus the HOME page features.
   Needs data.js loaded before it.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. HELPERS
   --------------------------------------------------------- */
const $  = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback; // storage blocked or corrupted data
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Could not save data:', err);
  }
}

// Fisher-Yates shuffle: returns the same array in random order
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------------------------------------------------------
   2. TABS INSIDE A PAGE
   Buttons with data-tab="x" show the section with id="x".
   The tab is also remembered in the URL (guide.html#passwords).
   Returns a function: showTab('id')
   --------------------------------------------------------- */
function setupTabs(onShow) {
  const panels = Array.from($$('.page'));
  const ids = panels.map((p) => p.id);

  function show(id) {
    if (!ids.includes(id)) id = ids[0];
    panels.forEach((p) => p.classList.toggle('active', p.id === id));
    $$('[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === id));
    try { history.replaceState(null, '', '#' + id); } catch (err) { /* ignore */ }
    if (onShow) onShow(id);
  }

  $$('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      show(btn.dataset.tab);
      window.scrollTo(0, 0);
    });
  });

  // when the page loads from a link like guide.html#threats
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
  return show;
}

/* ---------------------------------------------------------
   3. SOUND (simple beeps using the Web Audio API)
   --------------------------------------------------------- */
let soundOn = loadJSON(KEY_SOUND, true);
let audioCtx = null;

function beep(frequency, duration, type) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = 0.07;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) { /* sound is optional, ignore errors */ }
}

const soundBtn = $('#soundToggle');
if (soundBtn) {
  soundBtn.textContent = soundOn ? '🔊' : '🔇';
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    saveJSON(KEY_SOUND, soundOn);
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
  });
}

/* ---------------------------------------------------------
   4. PLAYER NAME (shared by Home and Play)
   --------------------------------------------------------- */
let playerName = loadJSON(KEY_PLAYER, '');

// Returns an error message, or '' when the name is valid
function validateName(name) {
  const trimmed = name.trim();
  if (trimmed === '')       return 'Please enter your name.';
  if (trimmed.length < 2)   return 'Name must be at least 2 characters.';
  if (trimmed.length > 15)  return 'Name must be 15 characters or fewer.';
  if (!/^[A-Za-z0-9 ]+$/.test(trimmed)) return 'Use letters, numbers and spaces only.';
  return '';
}

/* ---------------------------------------------------------
   5. HOME PAGE (only runs if the home elements exist)
   --------------------------------------------------------- */
const nameForm = $('#nameForm');
if (nameForm) {
  $('#playerName').value = playerName;

  // Play page sends people here when they have no name yet
  if (location.search.includes('needname')) {
    $('#nameError').textContent = 'Please enter your name first.';
  }

  nameForm.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the page from reloading
    const value = $('#playerName').value;
    const error = validateName(value);
    $('#nameError').textContent = error;

    if (error === '') {
      playerName = value.trim();
      saveJSON(KEY_PLAYER, playerName);
      window.location.href = 'play.html';
    }
  });
}

if ($('#statGames')) {
  const stats = loadJSON(KEY_STATS, { games: 0, best: 0, correct: 0 });
  $('#statGames').textContent   = stats.games;
  $('#statBest').textContent    = stats.best;
  $('#statCorrect').textContent = stats.correct;
}

function showTip() {
  const index = Math.floor(Math.random() * CYBER_TIPS.length);
  $('#cyberTip').textContent = CYBER_TIPS[index];
}
if ($('#cyberTip')) {
  showTip();
  $('#newTip').addEventListener('click', showTip);
}
