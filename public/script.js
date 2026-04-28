var SUPABASE_URL = 'https://fbxgypfpgjapywjdnnlo.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_DToJ1Q7-GG9WHyjboJTgKA_qqrIgdna';
var sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var PROJECTS = [
  {name:'CATS CAN BLAST!',desc:'DIY project plugin for a custom lasertag minigame in MC without mods, full coded in Java, with 9 gamemodes',tags:['Java','Maven','Minecraft'],viewType:'link',link:'#quote'},
  {name:'ELEVATOR WAND',desc:'Plugin with abilities to make standstill, moving and cabin elevators. With smooth operation, call buttons and much more, all while keeping peak performance.',tags:['Java','Maven','Minecraft'],viewType:'video',videoSrc:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'}
];

// FIXED: skills array was broken - second group had no wrapping object
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

var PHRASES = ['Full-Stack Developer','Certified Dev','Plugin dev','Cat food enjoyer','I like cat food'];
var EASTER_PASS = 'admin123';

var quotes = [];
var pendingReviews = [];
var approvedReviews = [];
var currentAdmin = null;
var appReady = false;
var reviewRating = 5;
var reviewsExpanded = false;

function formatErrorMessage(err, fallback) {
  if (!err) { return fallback || 'Unknown error'; }
  if (typeof err === 'string') { return err; }
  var parts = [];
  if (err.message) { parts.push(String(err.message)); }
  if (err.details) { parts.push(String(err.details)); }
  if (err.hint) { parts.push(String(err.hint)); }
  if (!parts.length) {
    try {
      return JSON.stringify(err);
    } catch (_) {
      return fallback || 'Unknown error';
    }
  }
  return parts.join(' | ');
}

function normalizeQuote(row) {
  return { id: row.id, name: row.name, email: row.email, type: row.type, budget: row.budget || 'Not specified', description: row.description || row.desc || '', date: row.date || '', status: row.status || 'new' };
}
function normalizeReview(row) {
  return { id: row.id, name: row.name, rank: row.rank || row.role || 'Client', text: row.text, date: row.date || '', status: row.status || 'pending', rating: row.rating || 5, discord_id: row.discord_id || '', discord_username: row.discord_username || '' };
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderProjects() {
  var el = document.getElementById('proj-list');
  if (!el) return;
  var h = '';
  for (var i = 0; i < PROJECTS.length; i++) {
    var p = PROJECTS[i];
    var tags = '';
    for (var t = 0; t < p.tags.length; t++) { tags += '<span class="tag">' + p.tags[t] + '</span>'; }
    h += '<div class="proj">';
    h += '<div class="proj-header"><span class="proj-header-name">' + p.name + '</span></div>';
    h += '<div class="proj-body">';
    h += '<div class="proj-name">' + p.name + '</div>';
    h += '<div class="proj-desc">' + p.desc + '</div>';
    h += '<div class="proj-tags">' + tags + '</div>';
    h += '<div class="proj-links">';
    if ((p.viewType || 'link') === 'video') {
      h += '<button type="button" class="proj-link proj-link-btn" onclick="openProjectView(' + i + ')">[VIEW]</button>';
    } else {
      var target = (p.link && p.link.indexOf('#') === 0) ? '' : ' target="_blank" rel="noopener noreferrer"';
      h += '<a href="' + esc(p.link || '#') + '" class="proj-link"' + target + '>[VIEW]</a>';
    }
    h += '</div></div></div>';
  }
  el.innerHTML = h;
}

function renderSkills() {
  var el = document.getElementById('skill-list');
  if (!el) return;
  var h = '';
  for (var g = 0; g < SKILLS.length; g++) {
    var grp = SKILLS[g];
    h += '<div><div class="skill-group-title">// ' + grp.group + '</div>';
    for (var i = 0; i < grp.items.length; i++) {
      var s = grp.items[i];
      h += '<div class="skill-item"><span class="skill-name-txt">' + s.name + '</span>';
      h += '<span class="skill-pct">' + s.pct + '%</span>';
      h += '<div class="skill-bar-outer"><div class="skill-bar-inner" data-pct="' + s.pct + '"></div></div></div>';
    }
    h += '</div>';
  }
  el.innerHTML = h;
}

function openProjectView(index) {
  var p = PROJECTS[index];
  if (!p) return;
  if ((p.viewType || 'link') === 'video') {
    openVideoPlayer(p);
    return;
  }
  if (!p.link) return;
  if (p.link.charAt(0) === '#') {
    window.location.hash = p.link.slice(1);
  } else {
    window.open(p.link, '_blank', 'noopener,noreferrer');
  }
}

function openVideoPlayer(project) {
  var popup = document.getElementById('video-popup');
  var player = document.getElementById('video-player');
  var title = document.getElementById('video-title');
  var source = document.getElementById('video-source');
  var status = document.getElementById('video-status');
  var note = document.getElementById('video-note');
  title.textContent = project.name ? project.name.toUpperCase() : 'PLAYBACK';
  source.textContent = 'SOURCE: ' + (project.videoSrc ? (project.videoSrc.indexOf('http') === 0 ? 'REMOTE' : 'LOCAL') : 'NOT SET');
  status.textContent = 'STATUS: ' + (project.videoSrc ? 'READY' : 'NO VIDEO');
  note.textContent = project.desc || 'Project playback.';
  if (project.videoSrc) {
    player.src = project.videoSrc;
    player.load();
    player.play().catch(function() {});
  } else {
    player.removeAttribute('src');
    player.load();
  }
  popup.classList.add('show');
}

function closeVideoPlayer() {
  var popup = document.getElementById('video-popup');
  var player = document.getElementById('video-player');
  if (player) {
    player.pause();
    player.removeAttribute('src');
    player.load();
  }
  if (popup) { popup.classList.remove('show'); }
}

function renderReviews() {
  var el = document.getElementById('rev-list');
  if (!el) return;
  var all = BUILTIN_REVIEWS.concat(approvedReviews);
  var visible = reviewsExpanded ? all : all.slice(0, 6);
  var summary = document.getElementById('review-summary');
  var counts = [0, 0, 0, 0, 0];
  for (var c = 0; c < all.length; c++) {
    var rating = parseInt(all[c].rating || 5, 10);
    if (rating >= 1 && rating <= 5) { counts[rating - 1]++; }
  }
  if (summary) {
    var totalReviews = all.length || 1;
    var sh = '';
    for (var s = 5; s >= 1; s--) {
      var pct = Math.round((counts[s - 1] / totalReviews) * 100);
      sh += '<div class="review-stat"><span class="n">' + s + '</span>';
      sh += '<div class="bar"><div class="fill" style="width:' + pct + '%"></div></div>';
      sh += '<span class="pct">' + counts[s - 1] + '</span></div>';
    }
    summary.innerHTML = sh;
  }
  var h = '';
  if (all.length === 0) {
    h = '<p class="empty">NO REVIEWS YET</p>';
  } else {
    for (var i = 0; i < visible.length; i++) {
      var r = visible[i];
      var rating = parseInt(r.rating || 5, 10);
      h += '<div class="review-item">';
      h += '<div class="review-meta">';
      h += '<div><span class="review-author-name">' + esc(r.name) + '</span>';
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

function toggleReviews() {
  reviewsExpanded = !reviewsExpanded;
  renderReviews();
}

function setupBars() {
  var bars = document.querySelectorAll('.skill-bar-inner');
  if (!window.IntersectionObserver) {
    for (var i = 0; i < bars.length; i++) { bars[i].style.width = bars[i].getAttribute('data-pct') + '%'; }
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.style.width = entries[i].target.getAttribute('data-pct') + '%';
        io.unobserve(entries[i].target);
      }
    }
  }, {threshold: 0.2});
  for (var i = 0; i < bars.length; i++) { io.observe(bars[i]); }
}

async function loadData() {
  var qRes = await sb.from('quotes').select('*').order('created_at', { ascending: false });
  var rRes = await sb.from('reviews').select('*').order('created_at', { ascending: false });
  if (qRes.error) { throw new Error('Quotes load failed: ' + formatErrorMessage(qRes.error)); }
  if (rRes.error) { throw new Error('Reviews load failed: ' + formatErrorMessage(rRes.error)); }
  quotes = (qRes.data || []).map(normalizeQuote);
  pendingReviews = (rRes.data || []).filter(function(row) { return row.status !== 'approved'; }).map(normalizeReview);
  approvedReviews = (rRes.data || []).filter(function(row) { return row.status === 'approved'; }).map(normalizeReview);
}

async function refreshAll() {
  await loadData();
  renderReviews();
  if (currentAdmin) { renderDash(); }
}

function makeDate() {
  return new Date().toLocaleDateString();
}

function findReviewById(id) {
  for (var i = 0; i < pendingReviews.length; i++) { if (pendingReviews[i].id === id) { return pendingReviews[i]; } }
  for (var j = 0; j < approvedReviews.length; j++) { if (approvedReviews[j].id === id) { return approvedReviews[j]; } }
  return null;
}

// ---- popup functions must be global for onclick= attributes ----
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
  closeVerifyPopup();
  closeAnonConfirmPopup();
}
function openTos() {
  document.getElementById('tos-popup').classList.add('show');
}
function closeTos() {
  document.getElementById('tos-popup').classList.remove('show');
}
// Discord state
var discordUser = null; // { id, username } or null
var REVIEW_DRAFT_KEY = 'review_draft_v1';
var REVIEW_OAUTH_PENDING_KEY = 'review_oauth_pending_v1';

function getDiscordNameFromUser(user) {
  var md = (user && user.user_metadata) || {};
  return md.preferred_username || md.user_name || md.full_name || md.name || (user && user.email ? user.email.split('@')[0] : '') || 'discord_user';
}

function getDiscordIdFromUser(user) {
  var ids = (user && user.identities) || [];
  for (var i = 0; i < ids.length; i++) {
    var ident = ids[i] || {};
    if (ident.provider === 'discord') {
      var data = ident.identity_data || {};
      return ident.id || data.sub || data.id || '';
    }
  }
  var md = (user && user.user_metadata) || {};
  return md.provider_id || md.sub || '';
}

function saveReviewDraft() {
  var draft = {
    name: (document.getElementById('r-name').value || '').trim(),
    rank: document.getElementById('r-rank').value || '',
    text: (document.getElementById('r-text').value || '').trim(),
    rating: reviewRating || 5
  };
  sessionStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify(draft));
}

function restoreReviewDraft() {
  var raw = sessionStorage.getItem(REVIEW_DRAFT_KEY);
  if (!raw) return false;
  try {
    var draft = JSON.parse(raw);
    if (draft.name !== undefined) { document.getElementById('r-name').value = draft.name; }
    if (draft.rank !== undefined) { document.getElementById('r-rank').value = draft.rank; }
    if (draft.text !== undefined) { document.getElementById('r-text').value = draft.text; }
    setReviewRating(parseInt(draft.rating || 5, 10));
    return true;
  } catch (_) {
    return false;
  }
}

function clearReviewDraft() {
  sessionStorage.removeItem(REVIEW_DRAFT_KEY);
  sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY);
}

function applyDiscordConnectedUI() {
  if (!discordUser) return;
  document.getElementById('discord-connected-bar').style.display = 'block';
  document.getElementById('discord-username-display').textContent = '@' + discordUser.username;
  var nameInput = document.getElementById('r-name');
  if (nameInput && !nameInput.value) { nameInput.value = discordUser.username; }
}

async function hydrateDiscordFromSupabase() {
  var res = await sb.auth.getSession();
  var session = res && res.data ? res.data.session : null;
  if (!session || !session.user) { return; }
  var user = session.user;
  var pendingOauth = sessionStorage.getItem(REVIEW_OAUTH_PENDING_KEY) === '1';
  var provider = (user.app_metadata && user.app_metadata.provider) || '';
  var ids = user.identities || [];
  var md = user.user_metadata || {};
  var hasDiscordIdentity = provider === 'discord' || !!md.preferred_username || !!md.user_name;
  if (!hasDiscordIdentity) {
    for (var i = 0; i < ids.length; i++) {
      if (ids[i] && ids[i].provider === 'discord') { hasDiscordIdentity = true; break; }
    }
  }
  if (!hasDiscordIdentity && !pendingOauth) { return; }
  discordUser = { id: getDiscordIdFromUser(user) || user.id, username: getDiscordNameFromUser(user) };
  if (pendingOauth) {
    openReviewPopup();
    restoreReviewDraft();
    applyDiscordConnectedUI();
    closeVerifyPopup();
    var nameVal = document.getElementById('r-name').value.trim();
    var rankVal = document.getElementById('r-rank').value;
    var textVal = document.getElementById('r-text').value.trim();
    if (nameVal && rankVal && textVal) {
      doFinalSubmit(false);
      return;
    }
    sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY);
  }
}

function openVerifyPopup() {
  var p = document.getElementById('discord-verify-popup');
  p.style.display = 'flex';
}
function closeVerifyPopup() {
  var p = document.getElementById('discord-verify-popup');
  p.style.display = 'none';
}
function openAnonConfirmPopup() {
  closeVerifyPopup();
  var p = document.getElementById('anon-confirm-popup');
  p.style.display = 'flex';
}
function closeAnonConfirmPopup() {
  var p = document.getElementById('anon-confirm-popup');
  p.style.display = 'none';
}

function doDiscordLogin() {
  saveReviewDraft();
  sessionStorage.setItem(REVIEW_OAUTH_PENDING_KEY, '1');
  sb.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.href.split('#')[0],
      scopes: 'identify'
    }
  }).then(function(res) {
    if (res.error) { throw res.error; }
  }).catch(function(err) {
    sessionStorage.removeItem(REVIEW_OAUTH_PENDING_KEY);
    alert('Discord login failed: ' + formatErrorMessage(err, 'Try again.'));
  });
}

function submitAnon() {
  closeAnonConfirmPopup();
  discordUser = null;
  clearReviewDraft();
  doFinalSubmit(true);
}

function doFinalSubmit(isAnon) {
  var payload = {
    name: isAnon ? 'Anonymous' : document.getElementById('r-name').value,
    rank: isAnon ? 'Unknown' : (document.getElementById('r-rank').value || 'Client'),
    text: document.getElementById('r-text').value,
    rating: reviewRating,
    date: makeDate(),
    status: 'pending'
  };
  if (!isAnon && discordUser) {
    payload.discord_id = discordUser.id;
    payload.discord_username = discordUser.username;
  }
  saveReviewInsert(payload).then(async function(res) {
    if (res.error) { alert(res.error.message); return; }
    clearReviewDraft();
    document.getElementById('rform').style.display = 'none';
    document.getElementById('rform-done').style.display = 'block';
    await refreshAll();
    setTimeout(closeReviewPopup, 2200);
  });
}

function submitReview() {
  var payload = {
    name: document.getElementById('r-name').value,
    rank: document.getElementById('r-rank').value || 'Client',
    text: document.getElementById('r-text').value,
    rating: reviewRating,
    date: makeDate(),
    status: 'pending'
  };
  return saveReviewInsert(payload);
}
function saveReviewInsert(payload) {
  return sb.from('reviews').insert([payload]).then(function(res) {
    if (res.error && String(res.error.message || '').toLowerCase().indexOf('rating') !== -1 && payload.rating !== undefined) {
      var retry = {};
      for (var k in payload) { if (k !== 'rating') { retry[k] = payload[k]; } }
      return sb.from('reviews').insert([retry]);
    }
    return res;
  });
}
function saveReviewUpdate(id, payload) {
  return sb.from('reviews').update(payload).eq('id', id).then(function(res) {
    if (res.error && String(res.error.message || '').toLowerCase().indexOf('rating') !== -1 && payload.rating !== undefined) {
      var retry = {};
      for (var k in payload) { if (k !== 'rating') { retry[k] = payload[k]; } }
      return sb.from('reviews').update(retry).eq('id', id);
    }
    return res;
  });
}
// ----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

async function initApp() {
  try {
    await refreshAll();
  } catch (e) {
    console.error(e);
    alert('Supabase load failed: ' + formatErrorMessage(e, 'Check tables, policies, keys, and network/CORS settings.'));
  }
  try {
    await hydrateDiscordFromSupabase();
  } catch (e2) {
    console.error(e2);
  }
  sb.auth.onAuthStateChange(function(event, session) {
    if (!session || !session.user) { return; }
    hydrateDiscordFromSupabase().catch(function() {});
  });

// Quote form
document.getElementById('qform').addEventListener('submit', function(e) {
  e.preventDefault();
  sb.from('quotes').insert([{
    name: document.getElementById('q-name').value,
    email: document.getElementById('q-email').value,
    type: document.getElementById('q-type').value,
    budget: document.getElementById('q-budget').value || 'Not specified',
    description: document.getElementById('q-desc').value,
    date: makeDate(),
    status: 'new'
  }]).then(async function(res) {
    if (res.error) { alert(res.error.message); return; }
    await refreshAll();
    document.getElementById('qform').style.display = 'none';
    document.getElementById('form-done').style.display = 'block';
  });
});

var ratingPicker = document.getElementById('rating-picker');
if (ratingPicker) {
  ratingPicker.addEventListener('click', function(e) {
    var btn = e.target.closest('.star-btn');
    if (!btn) return;
    setReviewRating(parseInt(btn.getAttribute('data-rating'), 10));
  });
}

// Review form — submit button now shows verify popup
document.getElementById('review-submit-btn').addEventListener('click', function() {
  var nameVal = document.getElementById('r-name').value.trim();
  var rankVal = document.getElementById('r-rank').value;
  var textVal = document.getElementById('r-text').value.trim();
  if (!nameVal || !rankVal || !textVal) {
    alert('Please fill in all fields before submitting.');
    return;
  }
  saveReviewDraft();
  if (discordUser) {
    doFinalSubmit(false);
    return;
  }
  openVerifyPopup();
});

// Admin listeners
document.getElementById('login-btn').addEventListener('click', function() { checkAdmin(); });
document.getElementById('admin-pass').addEventListener('keydown', function(e) { if (e.key === 'Enter') { checkAdmin(); } });
document.getElementById('admin-email').addEventListener('keydown', function(e) { if (e.key === 'Enter') { checkAdmin(); } });
document.getElementById('refresh-db-btn').addEventListener('click', function() { refreshAll(); });

renderProjects();
renderSkills();
tick();
setupBars();

} // end initApp

function setReviewRating(value) {
  reviewRating = value;
  var valueEl = document.getElementById('rating-value');
  if (valueEl) { valueEl.textContent = value + ' star' + (value === 1 ? '' : 's'); }
  var buttons = document.querySelectorAll('.star-btn');
  for (var i = 0; i < buttons.length; i++) {
    var active = parseInt(buttons[i].getAttribute('data-rating'), 10) === value;
    buttons[i].classList.toggle('active', active);
  }
}

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

function checkAdmin() {
  var email = document.getElementById('admin-email').value;
  var val = document.getElementById('admin-pass').value;
  if (val === EASTER_PASS) { openEaster(); document.getElementById('admin-pass').value = ''; return; }
  sb.auth.signInWithPassword({ email: email, password: val }).then(function(res) {
    if (res.error) {
      document.getElementById('admin-err').style.display = 'block';
      document.getElementById('admin-pass').value = '';
      return;
    }
    currentAdmin = res.data.session;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dash').style.display = 'block';
    renderDash();
  });
}

function switchTab(tab) {
  var tabs = document.querySelectorAll('.admin-tab');
  var contents = document.querySelectorAll('.admin-tab-content');
  for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('active'); }
  for (var i = 0; i < contents.length; i++) { contents[i].classList.remove('active'); }
  document.querySelector('.admin-tab[onclick="switchTab(\'' + tab + '\')"]').classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

function renderDash() {
  var total = quotes.length;
  var nw = 0;
  for (var i = 0; i < quotes.length; i++) { if (quotes[i].status === 'new') { nw++; } }
  document.getElementById('s-total').textContent = total;
  document.getElementById('s-new').textContent = nw;
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
    var bc = (q.status === 'new') ? 'badge-new' : (q.status === 'done') ? 'badge-done' : 'badge-seen';
    rows += '<tr>';
    rows += '<td>' + esc(q.date) + '</td><td>' + esc(q.name) + '</td>';
    rows += '<td>' + esc(q.email) + '</td><td>' + esc(q.type) + '</td>';
    rows += '<td><span class="badge ' + bc + '">' + q.status.toUpperCase() + '</span></td>';
    rows += '<td><button class="tbl-btn view-btn" data-id="' + q.id + '">VIEW</button>';
    rows += '<button class="tbl-btn del-btn" data-id="' + q.id + '">DEL</button></td></tr>';
  }
  wrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr>'
    + '<th>DATE</th><th>NAME</th><th>EMAIL</th><th>TYPE</th><th>STATUS</th><th>ACTIONS</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  var viewBtns = document.querySelectorAll('.view-btn');
  for (var i = 0; i < viewBtns.length; i++) {
    viewBtns[i].addEventListener('click', function() { viewQ(parseInt(this.getAttribute('data-id'))); });
  }
  var delBtns = document.querySelectorAll('.del-btn');
  for (var i = 0; i < delBtns.length; i++) {
    delBtns[i].addEventListener('click', function() { delQ(parseInt(this.getAttribute('data-id'))); });
  }
}

function renderReviewsTable() {
  // Pending
  var wrap = document.getElementById('r-wrap');
  if (!pendingReviews.length) {
    wrap.innerHTML = '<p class="empty">NO PENDING REVIEWS</p>';
  } else {
    var rows = '';
    for (var i = 0; i < pendingReviews.length; i++) {
      var r = pendingReviews[i];
      var discordCell = r.discord_id
        ? '<a href="https://discord.com/users/' + esc(r.discord_id) + '" target="_blank" rel="noopener" style="color:var(--purple);text-decoration:none;font-size:10px" title="Open in Discord">@' + esc(r.discord_username || r.discord_id) + '</a>'
        : '<span style="color:var(--dim);font-size:10px">Anonymous</span>';
      rows += '<tr>';
      rows += '<td>' + esc(r.date) + '</td>';
      rows += '<td>' + esc(r.name) + '</td>';
      rows += '<td>' + discordCell + '</td>';
      rows += '<td>' + esc(r.rank) + '</td>';
      rows += '<td style="max-width:240px;word-break:break-word">' + esc(r.text.slice(0,80)) + (r.text.length > 80 ? '...' : '') + '</td>';
      rows += '<td>';
      rows += '<button class="tbl-btn rev-edit-btn" data-id="' + r.id + '">EDIT</button>';
      rows += '<button class="tbl-btn tbl-btn-approve rev-approve-btn" data-id="' + r.id + '">APPROVE</button>';
      rows += '<button class="tbl-btn tbl-btn-reject rev-reject-btn" data-id="' + r.id + '">REJECT</button>';
      rows += '</td></tr>';
    }
    wrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr>'
      + '<th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    var appBtns = document.querySelectorAll('.rev-approve-btn');
    for (var i = 0; i < appBtns.length; i++) {
      appBtns[i].addEventListener('click', function() { approveReview(parseInt(this.getAttribute('data-id'))); });
    }
    var editBtns = document.querySelectorAll('.rev-edit-btn');
    for (var i = 0; i < editBtns.length; i++) {
      editBtns[i].addEventListener('click', function() { openReviewEditor(parseInt(this.getAttribute('data-id'))); });
    }
    var rejBtns = document.querySelectorAll('.rev-reject-btn');
    for (var i = 0; i < rejBtns.length; i++) {
      rejBtns[i].addEventListener('click', function() { rejectReview(parseInt(this.getAttribute('data-id'))); });
    }
  }

  // Approved
  var awrap = document.getElementById('r-approved-wrap');
  if (!approvedReviews.length) {
    awrap.innerHTML = '<p class="empty">NO APPROVED REVIEWS</p>';
  } else {
    var arows = '';
    for (var i = 0; i < approvedReviews.length; i++) {
      var r = approvedReviews[i];
      var discordCellA = r.discord_id
        ? '<a href="https://discord.com/users/' + esc(r.discord_id) + '" target="_blank" rel="noopener" style="color:var(--purple);text-decoration:none;font-size:10px" title="Open in Discord">@' + esc(r.discord_username || r.discord_id) + '</a>'
        : '<span style="color:var(--dim);font-size:10px">Anonymous</span>';
      arows += '<tr>';
      arows += '<td>' + esc(r.date) + '</td>';
      arows += '<td>' + esc(r.name) + '</td>';
      arows += '<td>' + discordCellA + '</td>';
      arows += '<td>' + esc(r.rank) + '</td>';
      arows += '<td style="max-width:240px;word-break:break-word">' + esc(r.text.slice(0,80)) + (r.text.length > 80 ? '...' : '') + '</td>';
      arows += '<td><button class="tbl-btn rev-edit-btn" data-id="' + r.id + '">EDIT</button><button class="tbl-btn tbl-btn-reject rev-del-btn" data-id="' + r.id + '">DEL</button></td></tr>';
    }
    awrap.innerHTML = '<div style="overflow-x:auto"><table class="q-table"><thead><tr>'
      + '<th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th>'
      + '</tr></thead><tbody>' + arows + '</tbody></table></div>';
    var delBtns = document.querySelectorAll('.rev-del-btn');
    for (var i = 0; i < delBtns.length; i++) {
      delBtns[i].addEventListener('click', function() { delApprovedReview(parseInt(this.getAttribute('data-id'))); });
    }
    var editBtns2 = awrap.querySelectorAll('.rev-edit-btn');
    for (var i = 0; i < editBtns2.length; i++) {
      editBtns2[i].addEventListener('click', function() { openReviewEditor(parseInt(this.getAttribute('data-id'))); });
    }
  }
}

function approveReview(id) {
  sb.from('reviews').update({ status: 'approved' }).eq('id', id).then(function() { refreshAll(); });
}

function openReviewEditor(id) {
  var r = findReviewById(id);
  if (!r) return;
  var d = document.createElement('div');
  d.className = 'detail-overlay';
  var inner = '<div class="win detail-win">';
  inner += '<div class="win-titlebar"><span class="win-title">REVIEW <span class="dim">#' + id + '</span></span>';
  inner += '<div class="win-controls"><div class="win-btn" id="re-close">x</div></div></div>';
  inner += '<div class="win-body">';
  inner += dfield('NAME', '<input id="re-name" type="text" value="' + esc(r.name) + '" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">');
  var ranks = ['Client','Long-time Client','Meowtastic Client','Server Owner','Developer','Community Lead','Content Creator','VIP'];
  var rankValue = r.rank || r.role || 'Client';
  var rankSelect = '<select id="re-rank" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">';
  for (var i = 0; i < ranks.length; i++) {
    rankSelect += '<option' + (ranks[i] === rankValue ? ' selected' : '') + '>' + ranks[i] + '</option>';
  }
  rankSelect += '</select>';
  inner += dfield('RANK', rankSelect);
  var ratingSelect = '<select id="re-rating" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">';
  for (var s = 5; s >= 1; s--) {
    ratingSelect += '<option value="' + s + '"' + (s === parseInt(r.rating || 5, 10) ? ' selected' : '') + '>' + s + '/5</option>';
  }
  ratingSelect += '</select>';
  inner += dfield('RATING', ratingSelect);
  var statusValue = r.status || 'pending';
  var statusSelect = '<select id="re-status" style="width:100%;font-family:inherit;font-size:10px;border:none;background:transparent;outline:none">';
  statusSelect += '<option' + (statusValue === 'pending' ? ' selected' : '') + '>pending</option>';
  statusSelect += '<option' + (statusValue === 'approved' ? ' selected' : '') + '>approved</option>';
  statusSelect += '</select>';
  inner += dfield('STATUS', statusSelect);
  inner += dfield('REVIEW', '<textarea id="re-text" style="width:100%;min-height:160px;font-family:inherit;font-size:10px;border:none;background:-transparent;outline:none;resize:vertical">' + esc(r.text) + '</textarea>');
  inner += '<div style="display:flex;gap:10px;margin-top:20px">';
  inner += '<button class="tbl-btn tbl-btn-approve" id="re-save">SAVE</button>';
  inner += '<button class="tbl-btn" id="re-cancel">CANCEL</button>';
  inner += '</div></div></div>';
  d.innerHTML = inner;
  document.body.appendChild(d);
  function closeEditor() { d.remove(); }
  document.getElementById('re-close').addEventListener('click', closeEditor);
  document.getElementById('re-cancel').addEventListener('click', closeEditor);
  d.addEventListener('click', function(e) { if (e.target === d) { closeEditor(); } });
  document.getElementById('re-save').addEventListener('click', function() {
    var payload = {
      name: document.getElementById('re-name').value,
      rank: document.getElementById('re-rank').value,
      rating: parseInt(document.getElementById('re-rating').value, 10),
      status: document.getElementById('re-status').value,
      text: document.getElementById('re-text').value
    };
    saveReviewUpdate(id, payload).then(function(res) {
      if (res.error) { alert(res.error.message); return; }
      closeEditor();
      refreshAll();
    });
  });
}

function rejectReview(id) {
  sb.from('reviews').delete().eq('id', id).then(function() { refreshAll(); });
}

function delApprovedReview(id) {
  if (!confirm('Remove this review from the site?')) return;
  sb.from('reviews').delete().eq('id', id).then(function() { refreshAll(); });
}

function viewQ(id) {
  var q = null;
  for (var i = 0; i < quotes.length; i++) { if (quotes[i].id === id) { q = quotes[i]; break; } }
  if (!q) return;
  var d = document.createElement('div');
  d.className = 'detail-overlay';
  var inner = '<div class="win detail-win">';
  inner += '<div class="win-titlebar"><span class="win-title">QUOTE <span class="dim">#' + id + '</span></span>';
  inner += '<div class="win-controls"><div class="win-btn" id="cld">x</div></div></div>';
  inner += '<div class="win-body">';
  inner += dfield('NAME', esc(q.name));
  inner += dfield('EMAIL', esc(q.email));
  inner += dfield('TYPE', esc(q.type));
  inner += dfield('BUDGET', esc(q.budget));
  inner += dfield('DATE', esc(q.date));
  inner += dfield('DESCRIPTION', esc(q.description || q.desc || ''));
  inner += '<div style="display:flex;gap:10px;margin-top:20px">';
  inner += '<button class="tbl-btn" id="btn-seen">MARK SEEN</button>';
  inner += '<button class="tbl-btn" id="btn-done" style="color:#007700;border-color:#007700">MARK DONE</button>';
  inner += '</div></div></div>';
  d.innerHTML = inner;
  document.body.appendChild(d);
  document.getElementById('cld').addEventListener('click', function() { d.remove(); });
  document.getElementById('btn-seen').addEventListener('click', function() { setStatus(id,'seen'); d.remove(); });
  document.getElementById('btn-done').addEventListener('click', function() { setStatus(id,'done'); d.remove(); });
  d.addEventListener('click', function(e) { if (e.target === d) { d.remove(); } });
}

function dfield(label, val) {
  return '<div class="detail-field"><span class="lbl">' + label + '</span><span class="val">' + val + '</span></div>';
}
function setStatus(id, status) {
  sb.from('quotes').update({ status: status }).eq('id', id).then(function() { refreshAll(); });
}
function delQ(id) {
  if (!confirm('Delete this request?')) return;
  sb.from('quotes').delete().eq('id', id).then(function() { refreshAll(); });
}

// Typing animation
var pi = 0; var ci = 0; var going_back = false;
function tick() {
  var phrase = PHRASES[pi];
  var el = document.getElementById('typed-out');
  if (!el) return;
  if (!going_back) {
    ci++;
    el.textContent = phrase.slice(0, ci);
    if (ci === phrase.length) { going_back = true; setTimeout(tick, 1800); return; }
  } else {
    ci--;
    el.textContent = phrase.slice(0, ci);
    if (ci === 0) { going_back = false; pi = (pi + 1) % PHRASES.length; }
  }
  setTimeout(tick, going_back ? 55 : 95);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeAdmin(); closeEaster(); closeReviewPopup(); closeTos(); closeVideoPlayer(); closeVerifyPopup(); closeAnonConfirmPopup(); }
});