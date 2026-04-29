var PROJECTS = [
  {name:'CATS CAN BLAST!',desc:'DIY project plugin for a custom lasertag minigame in MC without mods, full coded in Java, with 9 gamemodes',tags:['Java','Maven','Minecraft'],viewType:'link',link:'#quote',cardLink:'#quote'},
  {name:'ELEVATOR WAND',desc:'Plugin with abilities to make standstill, moving and cabin elevators. With smooth operation, call buttons and much more, all while keeping peak performance.',tags:['Java','Maven','Minecraft'],viewType:'video',videoSrc:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'},
  {name:'ARCANE MAGIC',desc:'A powerful spellcasting plugin for Minecraft with a wide range of magical abilities and effects.',tags:['Java','Maven','Minecraft'],viewType:'video',videoSrc:'arcane-plugin.mp4'},
  {name:'PORTFOLIO WEBSITE',desc:'This very website you are on, built with Next.js, framework in HTML, database + auth using Supabase, showcasing my projects, skills, and client reviews.',tags:['JavaScript','CSS','HTML','Next.js','Supabase'],viewType:'link',link:'https://github.com/wolfspace099/portfolio-new/'},
];

var SKILLS = [
  {group:'DEVELOPMENT',items:[
    {name:'JavaScript / TS',pct:95},
    {name:'React / Next.js',pct:92},
    {name:'Node.js',pct:88},
    {name:'Python',pct:82},
    {name:'PostgreSQL',pct:78}
  ]},
  {group:'MINECRAFT',items:[
    {name:'Java Plugins',pct:90},
    {name:'Skript',pct:95},
    {name:'Spigot / Paper',pct:88},
    {name:'BungeeCord',pct:72}
  ]},
  {group:'TOOLS',items:[
    {name:'Git',pct:95},
    {name:'Linux / CLI',pct:88},
    {name:'Docker / CI-CD',pct:74},
    {name:'Supabase / Data',pct:70}
  ]}
];

var BUILTIN_REVIEWS = [];
var PHRASES = ['Full-Stack developer','Pussie lover <3','Plugin developer','Meow :3','I like cat food'];

var quotes = [];
var pendingReviews = [];
var approvedReviews = [];
var currentAdminToken = null;
var appReady = false;
var reviewRating = 5;
var reviewsExpanded = false;
var discordUser = null;
var _discordSessionToken = null;
var REVIEW_DRAFT_KEY = 'review_draft_v1';
var REVIEW_OAUTH_PENDING_KEY = 'review_oauth_pending_v1';
var QUOTE_DRAFT_KEY = 'quote_draft_v1';
var QUOTE_OAUTH_PENDING_KEY = 'quote_oauth_pending_v1';
var verifyContext = 'review';

// ─── API helpers ──────────────────────────────────────────────────────────────

function _headers() {
  var h = { 'Content-Type': 'application/json' };
  if (currentAdminToken) { h['Authorization'] = 'Bearer ' + currentAdminToken; }
  return h;
}
function apiGet(path) {
  return fetch(path, { headers: _headers() }).then(function(r) { return r.json(); });
}
function apiPost(path, body, extraHeaders) {
  var h = _headers();
  if (extraHeaders) { for (var k in extraHeaders) { h[k] = extraHeaders[k]; } }
  return fetch(path, { method: 'POST', headers: h, body: JSON.stringify(body) }).then(function(r) { return r.json(); });
}
function apiPatch(path, body) {
  return fetch(path, { method: 'PATCH', headers: _headers(), body: JSON.stringify(body) }).then(function(r) { return r.json(); });
}
function apiDelete(path, body) {
  return fetch(path, { method: 'DELETE', headers: _headers(), body: JSON.stringify(body) }).then(function(r) { return r.json(); });
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatErrorMessage(err, fallback) {
  if (!err) { return fallback || 'Unknown error'; }
  if (typeof err === 'string') { return err; }
  var parts = [];
  if (err.message) { parts.push(String(err.message)); }
  if (err.details) { parts.push(String(err.details)); }
  if (err.hint)    { parts.push(String(err.hint)); }
  if (!parts.length) { try { return JSON.stringify(err); } catch(_) { return fallback || 'Unknown error'; } }
  return parts.join(' | ');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function makeDate() { return new Date().toLocaleDateString(); }

// ─── Projects ────────────────────────────────────────────────────────────────

function renderProjects() {
  var el = document.getElementById('proj-list');
  if (!el) return;
  var h = '';
  for (var i = 0; i < PROJECTS.length; i++) {
    var p = PROJECTS[i];
    var tags = '';
    for (var t = 0; t < p.tags.length; t++) { tags += '<span class="tag">' + p.tags[t] + '</span>'; }
    h += '<article class="proj proj-clickable" data-index="' + i + '" role="link" tabindex="0" aria-label="Open project ' + esc(p.name) + '">';
    h += '<div class="proj-header"><span class="proj-header-name">' + p.name + '</span></div>';
    h += '<div class="proj-body">';
    h += '<div class="proj-desc-label">&gt; DESCRIPTION:</div>';
    h += '<div class="proj-desc">' + p.desc + '</div>';
    h += '<div class="proj-tags">' + tags + '</div>';
    h += '<div class="proj-links">';
    if ((p.viewType || 'link') === 'video') {
      h += '<button type="button" class="proj-link proj-link-btn" onclick="openProjectView(' + i + ')">[VIEW]</button>';
    } else {
      var target = (p.link && p.link.indexOf('#') === 0) ? '' : ' target="_blank" rel="noopener noreferrer"';
      h += '<a href="' + esc(p.link || '#') + '" class="proj-link"' + target + '>[VIEW]</a>';
    }
    h += '</div></div></article>';
  }
  el.innerHTML = h;
  var cards = el.querySelectorAll('.proj-clickable');
  for (var c = 0; c < cards.length; c++) {
    cards[c].addEventListener('click', function(e) {
      if (e.target.closest('.proj-link')) { return; }
      openProjectFromCard(parseInt(this.getAttribute('data-index'), 10));
    });
    cards[c].addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.key !== ' ') { return; }
      e.preventDefault();
      openProjectFromCard(parseInt(this.getAttribute('data-index'), 10));
    });
  }
}

function renderSkills() {
  var el = document.getElementById('skill-list');
  if (!el) return;
  var h = '';
  for (var g = 0; g < SKILLS.length; g++) {
    var grp = SKILLS[g];
    h += '<section class="skill-group"><div class="skill-group-title">// ' + grp.group + '</div><div class="skill-cards">';
    for (var i = 0; i < grp.items.length; i++) {
      var s = grp.items[i];
      h += '<article class="skill-card"><span class="skill-name-txt">' + s.name + '</span><span class="skill-pct">' + s.pct + '%</span></article>';
    }
    h += '</div></section>';
  }
  el.innerHTML = h;
}

function openProjectFromCard(index) {
  var p = PROJECTS[index];
  if (!p) return;
  if (p.cardLink) {
    if (p.cardLink.charAt(0) === '#') { window.location.hash = p.cardLink.slice(1); }
    else { window.open(p.cardLink, '_blank', 'noopener,noreferrer'); }
    return;
  }
  openProjectView(index);
}

function openProjectView(index) {
  var p = PROJECTS[index];
  if (!p) return;
  if ((p.viewType || 'link') === 'video') { openVideoPlayer(p); return; }
  if (!p.link) return;
  if (p.link.charAt(0) === '#') { window.location.hash = p.link.slice(1); }
  else { window.open(p.link, '_blank', 'noopener,noreferrer'); }
}

function openVideoPlayer(project) {
  var popup  = document.getElementById('video-popup');
  var player = document.getElementById('video-player');
  var title  = document.getElementById('video-title');
  var source = document.getElementById('video-source');
  var status = document.getElementById('video-status');
  var note   = document.getElementById('video-note');
  title.textContent  = project.name ? project.name.toUpperCase() : 'PLAYBACK';
  source.textContent = 'SOURCE: ' + (project.videoSrc ? (project.videoSrc.indexOf('http') === 0 ? 'REMOTE' : 'LOCAL') : 'NOT SET');
  status.textContent = 'STATUS: ' + (project.videoSrc ? 'READY' : 'NO VIDEO');
  note.textContent   = project.desc || 'Project playback.';
  if (project.videoSrc) { player.src = project.videoSrc; player.load(); player.play().catch(function(){}); }
  else { player.removeAttribute('src'); player.load(); }
  popup.classList.add('show');
}

function closeVideoPlayer() {
  var popup = document.getElementById('video-popup');
  var player = document.getElementById('video-player');
  if (player) { player.pause(); player.removeAttribute('src'); player.load(); }
  if (popup) { popup.classList.remove('show'); }
}

// ─── Reviews (public) ────────────────────────────────────────────────────────

function renderReviews() {
  var el = document.getElementById('rev-list');
  if (!el) return;
  var all = BUILTIN_REVIEWS.concat(approvedReviews);
  var visible = reviewsExpanded ? all : all.slice(0, 6);
  var summary = document.getElementById('review-summary');
  var counts = [0,0,0,0,0];
  for (var c = 0; c < all.length; c++) {
    var rat = parseInt(all[c].rating || 5, 10);
    if (rat >= 1 && rat <= 5) { counts[rat-1]++; }
  }
  if (summary) {
    var tot = all.length || 1; var sh = '';
    for (var s = 5; s >= 1; s--) {
      var pct = Math.round((counts[s-1]/tot)*100);
      sh += '<div class="review-stat"><span class="n">' + s + '</span><div class="bar"><div class="fill" style="width:' + pct + '%"></div></div><span class="pct">' + counts[s-1] + '</span></div>';
    }
    summary.innerHTML = sh;
  }
  var h = '';
  if (!all.length) {
    h = '<p class="empty">NO REVIEWS YET</p>';
  } else {
    for (var i = 0; i < visible.length; i++) {
      var r = visible[i];
      var rating = parseInt(r.rating || 5, 10);
      h += '<div class="review-item">';
      h += '<div class="review-meta"><div><span class="review-author-name">' + esc(r.name) + '</span>';
      h += '<span class="review-author-rank">' + esc(r.rank || r.role || '') + '</span></div></div>';
      h += '<p class="review-text">' + esc(r.text) + '</p>';
      h += '<div class="review-rating"><div class="review-rating-label">RATING</div><div class="review-badge">' + rating + '/5</div></div></div>';
    }
  }
  el.innerHTML = h;
  var toggle = document.getElementById('reviews-toggle-btn');
  if (toggle) {
    var hasMore = all.length > 6;
    toggle.style.display = hasMore ? 'inline-flex' : 'none';
    toggle.setAttribute('aria-label', reviewsExpanded ? 'Show fewer reviews' : 'Show more reviews');
    toggle.title = reviewsExpanded ? 'Show fewer reviews' : 'Show more reviews';
    toggle.textContent = reviewsExpanded ? 'SHOW LESS' : 'SHOW MORE';
  }
}

function toggleReviews() { reviewsExpanded = !reviewsExpanded; renderReviews(); }

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadData() {
  var res = await apiGet('/api/reviews');
  if (res.error) { throw new Error('Reviews load failed: ' + res.error); }
  approvedReviews = res.reviews || [];
}

async function loadAdminData() {
  var res = await apiGet('/api/admin');
  if (res.error) { throw new Error('Admin data failed: ' + res.error); }
  quotes = res.quotes || [];
  var all = res.reviews || [];
  pendingReviews  = all.filter(function(r) { return r.status !== 'approved'; });
  approvedReviews = all.filter(function(r) { return r.status === 'approved'; });
}

async function refreshAll() {
  if (currentAdminToken) { await loadAdminData(); } else { await loadData(); }
  renderReviews();
  if (currentAdminToken) { renderDash(); }
}

// ─── Discord OAuth (anon key stays — it is public by design) ─────────────────

function getDiscordNameFromUser(user) {
  var md = (user && user.user_metadata) || {};
  return md.preferred_username || md.user_name || md.full_name || md.name || (user && user.email ? user.email.split('@')[0] : '') || 'discord_user';
}
function getDiscordIdFromUser(user) {
  var ids = (user && user.identities) || [];
  for (var i = 0; i < ids.length; i++) {
    var ident = ids[i] || {};
    if (ident.provider === 'discord') { var d = ident.identity_data || {}; return ident.id || d.sub || d.id || ''; }
  }
  var md = (user && user.user_metadata) || {};
  return md.provider_id || md.sub || '';
}

async function hydrateDiscordFromSupabase() {
  if (typeof supabase === 'undefined') { return; }
  var res = await supabase.auth.getSession();
  var session = res && res.data ? res.data.session : null;
  if (!session || !session.user) { return; }
  var user = session.user;
  var pendingReview = sessionStorage.getItem(REVIEW_OAUTH_PENDING_KEY) === '1';
  var pendingQuote  = sessionStorage.getItem(QUOTE_OAUTH_PENDING_KEY)  === '1';
  var provider = (user.app_metadata && user.app_metadata.provider) || '';
  var ids = user.identities || [];
  var md  = user.user_metadata || {};
  var hasDiscord = provider === 'discord' || !!md.preferred_username || !!md.user_name;
  if (!hasDiscord) { for (var i = 0; i < ids.length; i++) { if (ids[i] && ids[i].provider === 'discord') { hasDiscord = true; break; } } }
  if (!hasDiscord && !pendingReview && !pendingQuote) { return; }
  discordUser = { id: getDiscordIdFromUser(user) || user.id, username: getDiscordNameFromUser(user) };
  _discordSessionToken = session.access_token || null;
  syncQuoteDiscordField();
  if (pendingReview) {
    openReviewPopup(); restoreReviewDraft(); applyDiscordConnectedUI(); closeVerifyPopup();
    var nv = document.getElementById('r-name').value.trim();
    var rv = document.getElementById('r-rank').value;
    var tv = document.getElementById('r-text').value.trim();
    if (nv && rv && tv) { doFinalSubmit(false); return; }
    sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY);
  }
  if (pendingQuote) {
    restoreQuoteDraft();
    sessionStorage.removeItem(QUOTE_OAUTH_PENDING_KEY);
    closeVerifyPopup();
    submitQuoteWithDiscord();
  }
}

function doDiscordLogin() {
  if (verifyContext === 'quote') { saveQuoteDraft(); sessionStorage.setItem(QUOTE_OAUTH_PENDING_KEY, '1'); }
  else { saveReviewDraft(); sessionStorage.setItem(REVIEW_OAUTH_PENDING_KEY, '1'); }
  supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: window.location.href.split('#')[0], scopes: 'identify' }
  }).then(function(res) {
    if (res.error) { throw res.error; }
  }).catch(function(err) {
    sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY);
    sessionStorage.removeItem(QUOTE_OAUTH_PENDING_KEY);
    alert('Discord login failed: ' + formatErrorMessage(err, 'Try again.'));
  });
}

// ─── Review form ──────────────────────────────────────────────────────────────

function openReviewPopup() {
  document.getElementById('review-popup').classList.add('show');
  document.getElementById('rform').style.display = 'flex';
  document.getElementById('rform-done').style.display = 'none';
  document.getElementById('rform').reset();
  setReviewRating(5);
  if (discordUser) {
    document.getElementById('discord-connected-bar').style.display = 'block';
    document.getElementById('discord-username-display').textContent = '@' + discordUser.username;
  } else {
    document.getElementById('discord-connected-bar').style.display = 'none';
  }
}
function closeReviewPopup() {
  document.getElementById('review-popup').classList.remove('show');
  closeVerifyPopup(); closeAnonConfirmPopup();
}
function openTos()  { document.getElementById('tos-popup').classList.add('show'); }
function closeTos() { document.getElementById('tos-popup').classList.remove('show'); }

function saveReviewDraft() {
  sessionStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify({
    name:   (document.getElementById('r-name').value || '').trim(),
    rank:   document.getElementById('r-rank').value || '',
    text:   (document.getElementById('r-text').value || '').trim(),
    rating: reviewRating || 5
  }));
}
function saveQuoteDraft() {
  sessionStorage.setItem(QUOTE_DRAFT_KEY, JSON.stringify({
    name:   (document.getElementById('q-name').value || '').trim(),
    type:   document.getElementById('q-type').value || '',
    budget: document.getElementById('q-budget').value || '',
    desc:   (document.getElementById('q-desc').value || '').trim()
  }));
}
function restoreReviewDraft() {
  var raw = sessionStorage.getItem(REVIEW_DRAFT_KEY); if (!raw) return false;
  try {
    var d = JSON.parse(raw);
    if (d.name !== undefined) document.getElementById('r-name').value = d.name;
    if (d.rank !== undefined) document.getElementById('r-rank').value = d.rank;
    if (d.text !== undefined) document.getElementById('r-text').value = d.text;
    setReviewRating(parseInt(d.rating || 5, 10));
    return true;
  } catch(_) { return false; }
}
function restoreQuoteDraft() {
  var raw = sessionStorage.getItem(QUOTE_DRAFT_KEY); if (!raw) return false;
  try {
    var d = JSON.parse(raw);
    if (d.name   !== undefined) document.getElementById('q-name').value   = d.name;
    if (d.type   !== undefined) document.getElementById('q-type').value   = d.type;
    if (d.budget !== undefined) document.getElementById('q-budget').value = d.budget;
    if (d.desc   !== undefined) document.getElementById('q-desc').value   = d.desc;
    return true;
  } catch(_) { return false; }
}
function clearReviewDraft() { sessionStorage.removeItem(REVIEW_DRAFT_KEY); sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY); }
function clearQuoteDraft()  { sessionStorage.removeItem(QUOTE_DRAFT_KEY);  sessionStorage.removeItem(QUOTE_OAUTH_PENDING_KEY); }

function applyDiscordConnectedUI() {
  if (!discordUser) return;
  document.getElementById('discord-connected-bar').style.display = 'block';
  document.getElementById('discord-username-display').textContent = '@' + discordUser.username;
  var ni = document.getElementById('r-name');
  if (ni && !ni.value) { ni.value = discordUser.username; }
  syncQuoteDiscordField();
}
function syncQuoteDiscordField() {
  var qd = document.getElementById('q-discord');
  if (!qd) return;
  qd.value = discordUser ? '@' + discordUser.username : '';
}

function openVerifyPopup(context) {
  verifyContext = context || 'review';
  var p = document.getElementById('discord-verify-popup');
  var title = document.getElementById('verify-title-text');
  var desc  = document.getElementById('verify-desc-text');
  var anon  = document.getElementById('verify-anon-btn');
  if (verifyContext === 'quote') {
    if (title) title.textContent = 'DISCORD REQUIRED FOR QUOTES';
    if (desc)  desc.textContent  = 'Log in with Discord to submit a quote request.';
    if (anon)  anon.style.display = 'none';
  } else {
    if (title) title.textContent = 'NEED TO VERIFY YOUR IDENTITY';
    if (desc)  desc.textContent  = 'Log into Discord to ensure you are not a bot and verify you as a user';
    if (anon)  anon.style.display = 'inline-block';
  }
  p.style.display = 'flex';
}
function closeVerifyPopup()     { document.getElementById('discord-verify-popup').style.display = 'none'; }
function openAnonConfirmPopup() { closeVerifyPopup(); document.getElementById('anon-confirm-popup').style.display = 'flex'; }
function closeAnonConfirmPopup(){ document.getElementById('anon-confirm-popup').style.display = 'none'; }

function submitAnon() {
  closeAnonConfirmPopup();
  discordUser = null; _discordSessionToken = null;
  clearReviewDraft();
  doFinalSubmit(true);
}

async function doFinalSubmit(isAnon) {
  var payload = {
    name:   isAnon ? 'Anonymous' : document.getElementById('r-name').value,
    rank:   isAnon ? 'Unknown'   : (document.getElementById('r-rank').value || 'Client'),
    text:   document.getElementById('r-text').value,
    rating: reviewRating,
  };
  if (!isAnon && discordUser) { payload.discord_id = discordUser.id; payload.discord_username = discordUser.username; }
  var extraHeaders = {};
  if (!isAnon && _discordSessionToken) { extraHeaders['Authorization'] = 'Bearer ' + _discordSessionToken; }
  var res = await apiPost('/api/reviews', payload, extraHeaders);
  if (res.error) { alert(res.error); return; }
  clearReviewDraft();
  document.getElementById('rform').style.display = 'none';
  document.getElementById('rform-done').style.display = 'block';
  await refreshAll();
  setTimeout(closeReviewPopup, 2200);
}

async function submitQuoteWithDiscord() {
  var nameEl   = document.getElementById('q-name');
  var typeEl   = document.getElementById('q-type');
  var budgetEl = document.getElementById('q-budget');
  var descEl   = document.getElementById('q-desc');
  var formEl   = document.getElementById('qform');
  var doneEl   = document.getElementById('form-done');
  if (!nameEl || !typeEl || !descEl || !formEl || !doneEl) { return; }
  var nameVal = (nameEl.value || '').trim();
  var typeVal = typeEl.value || '';
  var descVal = (descEl.value || '').trim();
  if (!nameVal || !typeVal || !descVal) { alert('Please fill in all quote fields.'); return; }
  if (!discordUser || !discordUser.username) { openVerifyPopup('quote'); return; }
  var extraHeaders = {};
  if (_discordSessionToken) { extraHeaders['Authorization'] = 'Bearer ' + _discordSessionToken; }
  var res = await apiPost('/api/quotes', {
    name: nameVal, type: typeVal,
    budget: (budgetEl && budgetEl.value) ? budgetEl.value : 'Not specified',
    description: descVal,
    discord_username: discordUser.username,
  }, extraHeaders);
  if (res.error) { alert(res.error); return; }
  clearQuoteDraft();
  await refreshAll();
  formEl.style.display = 'none';
  doneEl.style.display = 'block';
}

// ─── App init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() { initApp(); });

async function initApp() {
  // Render static content immediately — never block on API
  renderProjects();
  renderSkills();
  animateHeroAsciiLines();
  tick();

  try { await refreshAll(); } catch(e) { console.error('Load failed:', e); }
  try { await hydrateDiscordFromSupabase(); } catch(e) { console.error(e); }

  if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange(function(event, session) {
      if (!session || !session.user) { return; }
      hydrateDiscordFromSupabase().catch(function(){});
    });
  }

  document.getElementById('qform').addEventListener('submit', function(e) {
    e.preventDefault(); saveQuoteDraft();
    if (!discordUser) { openVerifyPopup('quote'); return; }
    submitQuoteWithDiscord();
  });

  var rp = document.getElementById('rating-picker');
  if (rp) {
    rp.addEventListener('click', function(e) {
      var btn = e.target.closest('.star-btn');
      if (!btn) return;
      setReviewRating(parseInt(btn.getAttribute('data-rating'), 10));
    });
  }

  document.getElementById('review-submit-btn').addEventListener('click', function() {
    var nv = document.getElementById('r-name').value.trim();
    var rv = document.getElementById('r-rank').value;
    var tv = document.getElementById('r-text').value.trim();
    if (!nv || !rv || !tv) { alert('Please fill in all fields before submitting.'); return; }
    saveReviewDraft();
    if (discordUser) { doFinalSubmit(false); return; }
    openVerifyPopup('review');
  });

  document.getElementById('login-btn').addEventListener('click', function() { checkAdmin(); });
  document.getElementById('admin-pass').addEventListener('keydown', function(e) { if (e.key === 'Enter') { checkAdmin(); } });
  document.getElementById('admin-email').addEventListener('keydown', function(e) { if (e.key === 'Enter') { checkAdmin(); } });
  document.getElementById('refresh-db-btn').addEventListener('click', function() { refreshAll(); });
}

function setReviewRating(value) {
  reviewRating = value;
  var ve = document.getElementById('rating-value');
  if (ve) { ve.textContent = value + ' star' + (value === 1 ? '' : 's'); }
  var btns = document.querySelectorAll('.star-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.toggle('active', parseInt(btns[i].getAttribute('data-rating'), 10) === value);
  }
}

// ─── Admin panel ──────────────────────────────────────────────────────────────

function openAdmin() {
  document.getElementById('admin-overlay').classList.add('show');
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-dash').style.display = 'none';
  document.getElementById('admin-err').style.display = 'none';
  document.getElementById('admin-email').value = '';
  document.getElementById('admin-pass').value = '';
  setTimeout(function() { document.getElementById('admin-pass').focus(); }, 80);
}
function closeAdmin() { document.getElementById('admin-overlay').classList.remove('show'); }
function openEaster() { closeAdmin(); document.getElementById('easter-popup').classList.add('show'); }
function closeEaster() { document.getElementById('easter-popup').classList.remove('show'); }

async function checkAdmin() {
  var email    = document.getElementById('admin-email').value;
  var password = document.getElementById('admin-pass').value;
  // All logic — including easter egg check — is handled server-side
  var res = await apiPost('/api/auth', { email: email, password: password });
  if (res.easter) { document.getElementById('admin-pass').value = ''; openEaster(); return; }
  if (res.error || !res.token) {
    document.getElementById('admin-err').style.display = 'block';
    document.getElementById('admin-pass').value = '';
    return;
  }
  currentAdminToken = res.token;  // JWT in memory only — never persisted
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-dash').style.display = 'block';
  await refreshAll();
  renderDash();
}

function switchTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.admin-tab-content').forEach(function(c) { c.classList.remove('active'); });
  document.querySelector('.admin-tab[onclick="switchTab(\'' + tab + '\')"]').classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

function renderDash() {
  var nw = quotes.filter(function(q) { return q.status === 'new'; }).length;
  document.getElementById('s-total').textContent    = quotes.length;
  document.getElementById('s-new').textContent      = nw;
  document.getElementById('s-rev-pending').textContent = pendingReviews.length;
  renderQuotesTable();
  renderReviewsTable();
}

function renderQuotesTable() {
  var wrap = document.getElementById('q-wrap');
  if (!quotes.length) { wrap.innerHTML = '<p class="empty">NO QUOTE REQUESTS YET</p>'; return; }
  var rows = '';
  for (var i = 0; i < quotes.length; i++) {
    var q = quotes[i];
    var bc = q.status === 'new' ? 'badge-new' : q.status === 'done' ? 'badge-done' : 'badge-seen';
    rows += '<tr><td>' + esc(q.date) + '</td><td>' + esc(q.name) + '</td><td>' + esc(q.email) + '</td><td>' + esc(q.type) + '</td>';
    rows += '<td><span class="badge ' + bc + '">' + q.status.toUpperCase() + '</span></td>';
    rows += '<td><button class="tbl-btn view-btn" data-id="' + q.id + '">VIEW</button>';
    rows += '<button class="tbl-btn del-btn" data-id="' + q.id + '">DEL</button></td></tr>';
  }
  wrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>TYPE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  wrap.querySelectorAll('.view-btn').forEach(function(b) { b.addEventListener('click', function() { viewQ(parseInt(this.getAttribute('data-id'))); }); });
  wrap.querySelectorAll('.del-btn').forEach(function(b)  { b.addEventListener('click', function() { delQ(parseInt(this.getAttribute('data-id'))); }); });
}

function findReviewById(id) {
  for (var i = 0; i < pendingReviews.length; i++)  { if (pendingReviews[i].id  === id) { return pendingReviews[i];  } }
  for (var j = 0; j < approvedReviews.length; j++) { if (approvedReviews[j].id === id) { return approvedReviews[j]; } }
  return null;
}

function renderReviewsTable() {
  var wrap = document.getElementById('r-wrap');
  if (!pendingReviews.length) {
    wrap.innerHTML = '<p class="empty">NO PENDING REVIEWS</p>';
  } else {
    var rows = '';
    for (var i = 0; i < pendingReviews.length; i++) {
      var r = pendingReviews[i];
      var dc = r.discord_id
        ? '<a href="https://discord.com/users/' + esc(r.discord_id) + '" target="_blank" rel="noopener" style="color:var(--purple);text-decoration:none;font-size:10px">@' + esc(r.discord_username || r.discord_id) + '</a>'
        : '<span style="color:var(--dim);font-size:10px">Anonymous</span>';
      rows += '<tr><td>' + esc(r.date) + '</td><td>' + esc(r.name) + '</td><td>' + dc + '</td><td>' + esc(r.rank) + '</td>';
      rows += '<td style="max-width:240px;word-break:break-word">' + esc(r.text.slice(0,80)) + (r.text.length > 80 ? '...' : '') + '</td>';
      rows += '<td><button class="tbl-btn rev-edit-btn" data-id="' + r.id + '">EDIT</button>';
      rows += '<button class="tbl-btn tbl-btn-approve rev-approve-btn" data-id="' + r.id + '">APPROVE</button>';
      rows += '<button class="tbl-btn tbl-btn-reject rev-reject-btn" data-id="' + r.id + '">REJECT</button></td></tr>';
    }
    wrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    wrap.querySelectorAll('.rev-approve-btn').forEach(function(b) { b.addEventListener('click', function() { approveReview(parseInt(this.getAttribute('data-id'))); }); });
    wrap.querySelectorAll('.rev-edit-btn').forEach(function(b)    { b.addEventListener('click', function() { openReviewEditor(parseInt(this.getAttribute('data-id'))); }); });
    wrap.querySelectorAll('.rev-reject-btn').forEach(function(b)  { b.addEventListener('click', function() { rejectReview(parseInt(this.getAttribute('data-id'))); }); });
  }

  var awrap = document.getElementById('r-approved-wrap');
  if (!approvedReviews.length) {
    awrap.innerHTML = '<p class="empty">NO APPROVED REVIEWS</p>';
  } else {
    var arows = '';
    for (var i = 0; i < approvedReviews.length; i++) {
      var r = approvedReviews[i];
      var dc = r.discord_id
        ? '<a href="https://discord.com/users/' + esc(r.discord_id) + '" target="_blank" rel="noopener" style="color:var(--purple);text-decoration:none;font-size:10px">@' + esc(r.discord_username || r.discord_id) + '</a>'
        : '<span style="color:var(--dim);font-size:10px">Anonymous</span>';
      arows += '<tr><td>' + esc(r.date) + '</td><td>' + esc(r.name) + '</td><td>' + dc + '</td><td>' + esc(r.rank) + '</td>';
      arows += '<td style="max-width:240px;word-break:break-word">' + esc(r.text.slice(0,80)) + (r.text.length > 80 ? '...' : '') + '</td>';
      arows += '<td><button class="tbl-btn rev-edit-btn" data-id="' + r.id + '">EDIT</button>';
      arows += '<button class="tbl-btn tbl-btn-reject rev-del-btn" data-id="' + r.id + '">DEL</button></td></tr>';
    }
    awrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th></tr></thead><tbody>' + arows + '</tbody></table></div>';
    awrap.querySelectorAll('.rev-del-btn').forEach(function(b)  { b.addEventListener('click', function() { delApprovedReview(parseInt(this.getAttribute('data-id'))); }); });
    awrap.querySelectorAll('.rev-edit-btn').forEach(function(b) { b.addEventListener('click', function() { openReviewEditor(parseInt(this.getAttribute('data-id'))); }); });
  }
}

async function approveReview(id) {
  var res = await apiPatch('/api/admin', { table:'reviews', id:id, payload:{ status:'approved' } });
  if (res.error) { alert(res.error); return; }
  refreshAll();
}
function openReviewEditor(id) {
  var r = findReviewById(id); if (!r) return;
  var d = document.createElement('div'); d.className = 'detail-overlay';
  var ranks = ['Client','Long-time Client','Meowtastic Client','Server Owner','Developer','Community Lead','Content Creator','VIP'];
  var rankValue = r.rank || r.role || 'Client';
  var rankOpts = ranks.map(function(rk) { return '<option' + (rk === rankValue ? ' selected' : '') + '>' + rk + '</option>'; }).join('');
  var ratingOpts = '';
  for (var s = 5; s >= 1; s--) { ratingOpts += '<option value="' + s + '"' + (s === parseInt(r.rating||5,10) ? ' selected':'') + '>' + s + '/5</option>'; }
  var statusValue = r.status || 'pending';
  var inner = '<div class="win detail-win">';
  inner += '<div class="win-titlebar"><span class="win-title">REVIEW <span class="dim">#' + id + '</span></span><div class="win-controls"><div class="win-btn" id="re-close">x</div></div></div>';
  inner += '<div class="win-body">';
  inner += dfield('NAME',   '<input id="re-name"   type="text" value="' + esc(r.name) + '" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">');
  inner += dfield('RANK',   '<select id="re-rank"   style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">' + rankOpts + '</select>');
  inner += dfield('RATING', '<select id="re-rating" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">' + ratingOpts + '</select>');
  inner += dfield('STATUS', '<select id="re-status" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none"><option' + (statusValue==='pending'?'selected':'') + '>pending</option><option' + (statusValue==='approved'?' selected':'') + '>approved</option></select>');
  inner += dfield('REVIEW', '<textarea id="re-text" style="width:100%;min-height:160px;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none;resize:vertical">' + esc(r.text) + '</textarea>');
  inner += '<div style="display:flex;gap:10px;margin-top:20px"><button class="tbl-btn tbl-btn-approve" id="re-save">SAVE</button><button class="tbl-btn" id="re-cancel">CANCEL</button></div>';
  inner += '</div></div>';
  d.innerHTML = inner; document.body.appendChild(d);
  function closeEditor() { d.remove(); }
  document.getElementById('re-close').addEventListener('click', closeEditor);
  document.getElementById('re-cancel').addEventListener('click', closeEditor);
  d.addEventListener('click', function(e) { if (e.target === d) { closeEditor(); } });
  document.getElementById('re-save').addEventListener('click', async function() {
    var payload = {
      name:   document.getElementById('re-name').value,
      rank:   document.getElementById('re-rank').value,
      rating: parseInt(document.getElementById('re-rating').value, 10),
      status: document.getElementById('re-status').value,
      text:   document.getElementById('re-text').value
    };
    var res = await apiPatch('/api/admin', { table:'reviews', id:id, payload:payload });
    if (res.error) { alert(res.error); return; }
    closeEditor(); refreshAll();
  });
}
async function rejectReview(id) {
  var res = await apiDelete('/api/admin', { table:'reviews', id:id });
  if (res.error) { alert(res.error); return; }
  refreshAll();
}
async function delApprovedReview(id) {
  if (!confirm('Remove this review from the site?')) return;
  var res = await apiDelete('/api/admin', { table:'reviews', id:id });
  if (res.error) { alert(res.error); return; }
  refreshAll();
}

function viewQ(id) {
  var q = null; for (var i = 0; i < quotes.length; i++) { if (quotes[i].id === id) { q = quotes[i]; break; } }
  if (!q) return;
  var d = document.createElement('div'); d.className = 'detail-overlay';
  var inner = '<div class="win detail-win">';
  inner += '<div class="win-titlebar"><span class="win-title">QUOTE <span class="dim">#' + id + '</span></span><div class="win-controls"><div class="win-btn" id="cld">x</div></div></div>';
  inner += '<div class="win-body">';
  inner += dfield('NAME', esc(q.name)) + dfield('EMAIL', esc(q.email)) + dfield('TYPE', esc(q.type)) + dfield('BUDGET', esc(q.budget)) + dfield('DATE', esc(q.date)) + dfield('DESCRIPTION', esc(q.description || q.desc || ''));
  inner += '<div style="display:flex;gap:10px;margin-top:20px"><button class="tbl-btn" id="btn-seen">MARK SEEN</button><button class="tbl-btn" id="btn-done" style="color:#007700;border-color:#007700">MARK DONE</button></div>';
  inner += '</div></div>';
  d.innerHTML = inner; document.body.appendChild(d);
  document.getElementById('cld').addEventListener('click', function() { d.remove(); });
  document.getElementById('btn-seen').addEventListener('click', function() { setStatus(id,'seen'); d.remove(); });
  document.getElementById('btn-done').addEventListener('click', function() { setStatus(id,'done'); d.remove(); });
  d.addEventListener('click', function(e) { if (e.target === d) { d.remove(); } });
}

function dfield(label, val) {
  return '<div class="detail-field"><span class="lbl">' + label + '</span><span class="val">' + val + '</span></div>';
}
async function setStatus(id, status) {
  var res = await apiPatch('/api/admin', { table:'quotes', id:id, payload:{ status:status } });
  if (res.error) { alert(res.error); }
  refreshAll();
}
async function delQ(id) {
  if (!confirm('Delete this request?')) return;
  var res = await apiDelete('/api/admin', { table:'quotes', id:id });
  if (res.error) { alert(res.error); return; }
  refreshAll();
}

// ─── Animations ───────────────────────────────────────────────────────────────

var pi = 0; var ci = 0; var going_back = false;
function tick() {
  var phrase = PHRASES[pi];
  var el = document.getElementById('typed-out'); if (!el) return;
  if (!going_back) { ci++; el.textContent = phrase.slice(0,ci); if (ci === phrase.length) { going_back = true; setTimeout(tick,1800); return; } }
  else { ci--; el.textContent = phrase.slice(0,ci); if (ci === 0) { going_back = false; pi = (pi+1) % PHRASES.length; } }
  setTimeout(tick, going_back ? 55 : 95);
}

function animateHeroAsciiLines() {
  var el = document.querySelector('.hero-ascii'); if (!el) return;
  var full = (el.textContent || '').replace(/\r/g,''); if (!full.trim()) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var lines = full.split('\n');
  el.style.minHeight = ((parseFloat(window.getComputedStyle(el).lineHeight) || 16) * lines.length) + 'px';
  el.textContent = '';
  var i = 0;
  function reveal() { if (i >= lines.length) return; el.textContent += (i===0?'':'\n') + lines[i]; i++; setTimeout(reveal, 140); }
  reveal();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeAdmin(); closeEaster(); closeReviewPopup(); closeTos(); closeVideoPlayer(); closeVerifyPopup(); closeAnonConfirmPopup(); }
});