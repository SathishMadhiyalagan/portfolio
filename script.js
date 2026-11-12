// Navigation remains visible on small screens when JavaScript is unavailable.
const root = document.documentElement;
root.classList.add('js');
const theme = document.querySelector('.theme');
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

function applyTheme(value) {
  root.dataset.theme = value;
  const light = value === 'light';
  theme.textContent = light ? '☾' : '☼';
  theme.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}

let initialTheme = 'dark';
try {
  if (localStorage.getItem('portfolio-theme') === 'light') initialTheme = 'light';
} catch { /* Browser storage can be unavailable in private browsing. */ }
applyTheme(initialTheme);
theme.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch { /* Session-only choice. */ }
});

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
nav.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

// Animate cards as they enter the viewport. Content stays visible without JS.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrive');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

// The line and milestones follow the reader's position in the career timeline.
const timeline = document.querySelector('.timeline');
const roles = [...timeline.querySelectorAll('.row')];
let scheduled = false;
function paintTimeline() {
  const bounds = timeline.getBoundingClientRect();
  const distance = window.innerHeight * .55 - bounds.top;
  timeline.style.setProperty('--progress', Math.min(1, Math.max(0, distance / bounds.height)));
  roles.forEach(role => role.classList.toggle('reached', role.offsetTop + 40 <= distance));
  scheduled = false;
}
function scheduleTimeline() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(paintTimeline);
  }
}
window.addEventListener('scroll', scheduleTimeline, {passive: true});
window.addEventListener('resize', scheduleTimeline);
paintTimeline();
