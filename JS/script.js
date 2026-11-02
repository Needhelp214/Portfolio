const ORDER = ['home', 'about', 'education', 'experiences', 'activities', 'work', 'certificates', 'contact'];
const NAMES = ['Home', 'About Me', 'Education', 'Experiences', 'Activities', 'My Work', 'Certificates', 'Contact'];

const stage = document.getElementById('stage');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

// สร้าง Pager สำหรับแต่ละหน้าอัตโนมัติ
document.querySelectorAll('.page').forEach(p => {
  const i = ORDER.indexOf(p.dataset.page);
  const prev = i > 0 ? `<a href="#${ORDER[i - 1]}">← ${NAMES[i - 1]}</a>` : '<span class="sp"></span>';
  const next = i < ORDER.length - 1 ? `<a href="#${ORDER[i + 1]}">${NAMES[i + 1]} →</a>` : '<span class="sp"></span>';
  p.insertAdjacentHTML('beforeend', `<div class="pager">${prev}<span>Page ${i + 1} of ${ORDER.length}</span>${next}</div>`);
});

let current = null, busy = false, target = 'home';
const pageEl = id => stage.querySelector(`:scope > .page[data-page="${id}"]`);

function setNav(id) {
  document.querySelectorAll('[data-nav]').forEach(a => {
    const on = a.dataset.nav === id;
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    if (on) a.scrollIntoView({ inline: 'center', block: 'nearest' });
  });
  document.title = NAMES[ORDER.indexOf(id)] + ' – Sutatta';
}

function show(id) {
  if (!ORDER.includes(id)) id = 'home';
  target = id;
  if (busy || id === current) return;
  
  const next = pageEl(id), prev = current ? pageEl(current) : null;
  const dir = prev && ORDER.indexOf(id) < ORDER.indexOf(current) ? -1 : 1;
  current = id;
  setNav(id);
  
  if (!prev || reduce) {
    stage.querySelectorAll(':scope > .page.active').forEach(p => p.classList.remove('active', 'fade'));
    next.classList.add('active');
    if (prev) next.classList.add('fade');
    return;
  }
  
  busy = true;
  const leaf = document.createElement('div');
  leaf.className = 'leaf ' + (dir > 0 ? 'fwd' : 'bwd');
  
  const front = document.createElement('div');
  front.className = 'face front';
  const copy = prev.cloneNode(true);
  copy.classList.add('active');
  front.appendChild(copy);
  
  const back = document.createElement('div');
  back.className = 'face back';
  
  const shade = document.createElement('div');
  shade.className = 'shade';
  
  leaf.append(front, back);
  prev.classList.remove('active');
  next.classList.add('active');
  stage.append(shade, leaf);
  
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  const deg = dir > 0 ? -172 : 172, dur = 1000;
  shade.animate([{ opacity: .4 }, { opacity: 0 }], { duration: dur, easing: 'ease-in', fill: 'forwards' });
  
  const a = leaf.animate([
    { transform: 'rotateY(0deg)', opacity: 1, offset: 0 },
    { opacity: 1, offset: .75 },
    { transform: `rotateY(${deg}deg)`, opacity: 0, offset: 1 }
  ], { duration: dur, easing: 'cubic-bezier(.6,.05,.25,1)', fill: 'forwards' });
  
  a.onfinish = () => {
    leaf.remove();
    shade.remove();
    busy = false;
    if (target !== current) show(target);
  };
}

addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1) || 'home');

// ฟอร์มส่งข้อความ
const cform = $('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    $('sent').hidden = false;
  });
}