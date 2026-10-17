'use strict';

const chapters = [
  { title: 'Hai, kamu.', photo: 1, sticker: 2, caption: 'semua bermula dari kamu.', paragraphs: ['Ada yang ingin kusampaikan. Tidak perlu buru-buru, kita baca pelan-pelan saja, ya.', 'Kalau kamu mau, putar lagunya. Biar ia menemani hal-hal yang kadang sulit kuucapkan langsung.'], closing: 'Surat kecil ini untukmu. Semua rasanya juga.' },
  { title: 'Ternyata, ke arahmu.', photo: 2, sticker: 3, caption: 'ternyata, kamu yang kutunggu.', paragraphs: ['Aku tidak tahu sejak kapan aku mulai menunggu. Yang kutahu, penantian itu terasa masuk akal saat kamu datang.', 'Jalan yang pernah terasa jauh, hari-hari yang sempat terasa sepi, ternyata membawaku pada sebuah pertemuan yang begitu kusyukuri.'], closing: 'Barangkali aku tidak sedang tersesat. Aku sedang berjalan ke arahmu.' },
  { title: 'Kamu itu rumah.', photo: 3, sticker: 4, caption: 'tempat hatiku ingin pulang.', paragraphs: ['Dari sekian banyak orang yang lewat di hidupku, kamu yang membuatku ingin menetap.', 'Kamu adalah rumah yang tidak pernah kurencanakan, tetapi selalu ingin kupulangi.', 'Bersamamu, bahkan hal paling sederhana pun terasa seperti sesuatu yang ingin kuingat lama.'], closing: 'Bukan karena semuanya sempurna. Karena ada kamu di dalamnya.' },
  { title: 'Kita, juga saat hujan.', photo: 4, sticker: 5, caption: 'di mendung pun, aku di sini.', paragraphs: ['Aku tidak bisa menjanjikan hari-hari yang selalu terang. Mungkin akan ada mendung, hujan, dan hal-hal yang tidak berjalan sesuai rencana.', 'Tapi aku ingin terus belajar menemanimu. Mendengarkanmu, memahami diammu, dan menggenggam tanganmu saat hari terasa berat.'], closing: 'Kalau dunia terlalu ramai, kita cari tenang bersama, ya.' },
  { title: 'Semua versi harimu.', photo: 5, sticker: 6, caption: 'kamu boleh jadi dirimu.', paragraphs: ['Aku mau ada di tawamu yang paling lepas, juga di tangismu yang paling pelan.', 'Di pagi yang malas, di malam yang penuh cerita, dan di hari ketika kamu bahkan tidak tahu harus merasa apa.', 'Kamu tidak perlu selalu kuat atau selalu ceria di dekatku.'], closing: 'Aku menyayangimu, termasuk saat kamu sedang tidak baik-baik saja.' },
  { title: 'Yang bisa kuberi.', photo: 6, sticker: 12, caption: 'sedikit kata, seluruh rasa.', paragraphs: ['Aku mungkin tidak punya segalanya. Tetapi ada waktu yang ingin kuluangkan, kesabaran yang ingin kurawat, dan doa yang selalu menyebutmu.', 'Aku ingin sayang ini terasa dalam hal-hal kecil: menanyakan harimu, mengingat ceritamu, dan tetap hadir ketika kamu membutuhkanku.'], closing: 'Biar bukan hanya terdengar. Biar kamu juga merasa disayang.' },
  { title: 'Jawabannya, kamu.', photo: 1, sticker: 16, caption: 'hari ini, dan hari-hari nanti.', paragraphs: ['Jadi, kalau kamu bertanya siapa yang kupilih, jawabanku masih sama: kamu.', 'Hari ini, besok, dan hari-hari yang ingin kita usahakan bersama.', 'Terima kasih sudah hadir, sudah menjadi dirimu, dan sudah membuat banyak hal terasa lebih hangat.'], closing: 'Kamu. Cuma kamu. Terima kasih sudah jadi satu-satunya. ♡' }
];

const captions = ['senyummu, favoritku.', 'bahagia sesederhana ini.', 'rumah punya wajahmu.', 'hal kecil, rasa besar.', 'ingin kusimpan selamanya.', 'tetap kamu, selalu.'];
const galleryStickers = [8, 9, 10, 4, 6, 12];
const notes = [
  { title: 'Bahagiamu, bahagiaku.', body: 'Ceritakan semuanya, bahkan hal kecil yang membuatmu tersenyum hari ini. Aku ingin jadi orang yang ikut senang mendengarnya. Semoga ada banyak hari ringan yang menunggumu, ya.', sticker: 15 },
  { title: 'Tidak harus kuat terus.', body: 'Hari ini terasa berat, ya? Tarik napas pelan-pelan. Kamu boleh istirahat, boleh menangis, boleh tidak punya jawaban dulu. Kamu tidak perlu melakukan semuanya sekaligus. Aku di sini, menemanimu sebisaku.', sticker: 17 },
  { title: 'Ada peluk yang menunggu.', body: 'Anggap pesan ini peluk kecil yang bisa kamu buka kapan saja. Kalau sedang kangen, bilang, ya. Aku juga suka mencari alasan untuk lebih lama mendengar suaramu.', sticker: 13 }
];

const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let chapterIndex = 0;
let photoIndex = 0;
let hugCount = 0;
let toastTimer;
let letterTimer;

function watchImage(img) {
  const markFailed = () => {
    img.classList.add('unavailable');
    if (img.classList.contains('personal-photo')) img.setAttribute('aria-hidden', 'true');
  };
  const markLoaded = () => { img.classList.remove('unavailable'); img.removeAttribute('aria-hidden'); };
  img.addEventListener('error', markFailed);
  img.addEventListener('load', markLoaded);
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markFailed();
}

function changeImage(img, path, alt) {
  img.classList.remove('unavailable');
  img.removeAttribute('aria-hidden');
  if (alt !== undefined) img.alt = alt;
  img.src = path;
}

function showToast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4800);
}

function renderChapter(index, focus = false) {
  chapterIndex = Math.max(0, Math.min(chapters.length - 1, index));
  const item = chapters[chapterIndex];
  $('#chapter-number').textContent = `HALAMAN ${String(chapterIndex + 1).padStart(2, '0')} / 07`;
  $('#chapter-title').textContent = item.title;
  $('#chapter-caption').textContent = item.caption;
  $('#chapter-text').replaceChildren();
  [...item.paragraphs, item.closing].forEach((text, i) => {
    const p = document.createElement('p');
    p.textContent = text;
    if (i === item.paragraphs.length) p.className = 'closing-line';
    $('#chapter-text').append(p);
  });
  changeImage($('#chapter-photo'), `./pict/${item.photo}.jpeg`, `Foto ${item.photo} orang tersayang`);
  changeImage($('#chapter-sticker'), `./sticker/${item.sticker}.png`);
  $('#prev-chapter').disabled = chapterIndex === 0;
  $('#next-chapter').disabled = chapterIndex === chapters.length - 1;
  document.querySelectorAll('.chapter-dots button').forEach((button, i) => button.setAttribute('aria-current', String(i === chapterIndex)));
  $('#chapter-status').textContent = `Halaman ${chapterIndex + 1} dari 7: ${item.title}`;
  const chapter = $('#chapter');
  chapter.classList.remove('page-enter');
  void chapter.offsetWidth;
  chapter.classList.add('page-enter');
  if (focus) chapter.focus({ preventScroll: true });
}

chapters.forEach((item, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Halaman ${i + 1}: ${item.title}`);
  button.addEventListener('click', () => renderChapter(i, true));
  $('#chapter-dots').append(button);
});

$('#open-letter').addEventListener('click', () => {
  const button = $('#open-letter');
  if (button.getAttribute('aria-expanded') === 'true') {
    $('#surat').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    $('#chapter').focus({ preventScroll: true });
    return;
  }
  button.classList.add('open');
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-label', 'Baca lagi surat untuk kamu');
  $('#envelope-hint').textContent = 'sudah terbuka. seperti hatiku untukmu ♡';
  $('#letter-content').hidden = false;
  clearTimeout(letterTimer);
  letterTimer = setTimeout(() => {
    $('#surat').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    $('#chapter').focus({ preventScroll: true });
  }, reducedMotion.matches ? 0 : 700);
});

$('#prev-chapter').addEventListener('click', () => renderChapter(chapterIndex - 1, true));
$('#next-chapter').addEventListener('click', () => renderChapter(chapterIndex + 1, true));
$('#letter-content').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    renderChapter(chapterIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
  }
});
let touchStart = null;
$('#letter-book').addEventListener('touchstart', (event) => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
$('#letter-book').addEventListener('touchend', (event) => {
  if (!touchStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) renderChapter(chapterIndex + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
$('#letter-book').addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

captions.forEach((caption, i) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'gallery-item';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'photo-button polaroid';
  button.setAttribute('aria-label', `Perbesar foto ${i + 1}: ${caption}`);
  button.setAttribute('aria-haspopup', 'dialog');
  const slot = document.createElement('div');
  slot.className = 'photo-slot';
  const fallback = document.createElement('span');
  fallback.className = 'photo-placeholder';
  fallback.setAttribute('aria-hidden', 'true');
  fallback.textContent = '♡';
  const fallbackCaption = document.createElement('small');
  fallbackCaption.textContent = 'a memory to keep';
  fallback.append(fallbackCaption);
  const img = document.createElement('img');
  img.className = 'personal-photo';
  img.src = `./pict/${i + 1}.jpeg`;
  img.alt = `Foto ${i + 1} orang tersayang`;
  img.loading = 'lazy';
  img.width = 600;
  img.height = 750;
  slot.append(fallback, img);
  const number = document.createElement('span');
  number.className = 'photo-number';
  number.textContent = `0${i + 1}`;
  number.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'photo-caption';
  label.textContent = caption;
  button.append(slot, number, label);
  const sticker = document.createElement('img');
  sticker.src = `./sticker/${galleryStickers[i]}.png`;
  sticker.alt = '';
  sticker.className = 'sticker gallery-sticker';
  sticker.loading = 'lazy';
  sticker.width = 90;
  sticker.height = 100;
  wrapper.append(button, sticker);
  $('#photo-grid').append(wrapper);
  button.addEventListener('click', () => {
    if (img.classList.contains('unavailable') || !img.naturalWidth) {
      showToast('Foto ini belum tersedia. Coba buka lagi setelah fotonya dimuat, ya.');
      return;
    }
    setLightboxPhoto(i);
    openDialog($('#photo-dialog'));
  });
});

function openDialog(dialog) {
  if (typeof dialog.showModal !== 'function') { showToast('Buka dengan browser yang lebih baru untuk melihat kejutan ini, ya.'); return; }
  dialog.showModal();
  document.body.classList.add('modal-open');
}

function setLightboxPhoto(index) {
  photoIndex = (index + captions.length) % captions.length;
  $('#lightbox-photo').hidden = false;
  $('#lightbox-photo').src = `./pict/${photoIndex + 1}.jpeg`;
  $('#lightbox-photo').alt = `Foto ${photoIndex + 1}: ${captions[photoIndex]}`;
  $('#lightbox-caption').textContent = `${photoIndex + 1} / 6 · ${captions[photoIndex]}`;
}

$('#lightbox-photo').addEventListener('error', () => {
  $('#lightbox-photo').hidden = true;
  $('#lightbox-caption').textContent = `${photoIndex + 1} / 6 · Foto ini belum tersedia.`;
});
$('#prev-photo').addEventListener('click', () => setLightboxPhoto(photoIndex - 1));
$('#next-photo').addEventListener('click', () => setLightboxPhoto(photoIndex + 1));
$('#photo-dialog').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    setLightboxPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
});
document.querySelectorAll('[data-note]').forEach((button) => button.addEventListener('click', () => {
  const note = notes[Number(button.dataset.note)];
  $('#note-title').textContent = note.title;
  $('#note-body').textContent = note.body;
  changeImage($('#note-sticker'), `./sticker/${note.sticker}.png`);
  openDialog($('#note-dialog'));
}));

const audio = $('#backsound');
const musicButton = $('#music-toggle');
let musicPending = false;
audio.volume = 0.55;
function updateMusic() {
  const playing = !audio.paused;
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
  $('#music-label').textContent = playing ? 'Jeda lagu' : 'Putar lagu';
}
musicButton.addEventListener('click', async () => {
  if (musicPending) return;
  if (!audio.paused) { audio.pause(); return; }
  musicPending = true;
  musicButton.setAttribute('aria-busy', 'true');
  $('#music-label').textContent = 'Memuat…';
  try {
    await audio.play();
  } catch (error) {
    showToast(error.name === 'NotAllowedError' ? 'Ketuk putar sekali lagi untuk memulai musik, ya.' : 'Musiknya belum bisa diputar. Pastikan backsound.mp3 tersedia di folder blue.');
  } finally {
    musicPending = false;
    musicButton.removeAttribute('aria-busy');
    updateMusic();
  }
});
audio.addEventListener('play', updateMusic);
audio.addEventListener('pause', updateMusic);
audio.addEventListener('error', () => {
  updateMusic();
  if (!musicPending) showToast('Musiknya belum tersedia. Kamu tetap bisa membaca suratnya, ya.');
});

$('#send-hug').addEventListener('click', () => {
  hugCount++;
  const messages = ['Peluk pertama. Yang lama, ya. ♡', 'Satu lagi, karena satu saja kurang.', 'Kalau capek, istirahat di sini dulu.', 'Sayangnya tidak habis-habis, kok.', 'Sebanyak yang kamuu mau. Selalu. ♡'];
  $('#hug-message').textContent = messages[Math.min(hugCount - 1, messages.length - 1)];
  if (reducedMotion.matches) return;
  const container = $('#heart-rain');
  const available = Math.max(0, 36 - container.childElementCount);
  for (let i = 0; i < Math.min(18, available); i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = i % 3 === 0 ? '✧' : '♡';
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.fontSize = `${15 + Math.random() * 24}px`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    heart.style.setProperty('--drift', `${Math.random() * 150 - 75}px`);
    heart.style.setProperty('--spin', `${Math.random() * 120 - 60}deg`);
    container.append(heart);
    setTimeout(() => heart.remove(), 3300);
  }
});

let scrollQueued = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  $('#read-progress').style.width = `${total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0}%`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
document.querySelectorAll('.personal-photo, .sticker').forEach(watchImage);
renderChapter(0);
updateProgress();

$('.skip-link').addEventListener('click', () => {
  $('#letter-content').hidden = false;
  $('#open-letter').classList.add('open');
  $('#open-letter').setAttribute('aria-expanded', 'true');
  $('#chapter').focus({ preventScroll: true });
});
