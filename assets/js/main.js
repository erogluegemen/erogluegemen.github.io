// --- DHL Themed Personal Site JS ---

// Year in footer
document.getElementById('y').textContent = new Date().getFullYear();

// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  }, { passive: true });
}

// Active nav section highlighting
(function () {
  const sections = document.querySelectorAll('main section[id], main .vitae[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-active');
    });
  }, { threshold: 0.25, rootMargin: '-10% 0px -65% 0px' });
  sections.forEach(s => obs.observe(s));
}());

// Entrance animations
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const targets = document.querySelectorAll('.card, .timeline-item, .pubs li, .about-list li');
  targets.forEach(el => el.classList.add('fade-in'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
}

// Back to top
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Tiny honk easter egg (no audio for accessibility; just a wiggle + toast)
const van = document.querySelector('.van');
const wrap = van?.closest('.van-wrap') || van?.parentElement || document.body;

const toast = document.createElement('div');
toast.id = 'van-beep';
toast.textContent = 'beep-beep!';
wrap.appendChild(toast);

function wiggle(){
  if (!van) return;
  van.animate([
    { transform: 'translateX(0) rotate(0deg)' },
    { transform: 'translateX(0) rotate(-3deg)' },
    { transform: 'translateX(0) rotate(3deg)' },
    { transform: 'translateX(0) rotate(0deg)' }
  ], { duration: 300, iterations: 1 });

  // show toast above GIF
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(-8px)';
  setTimeout(()=>{
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%)';
  }, 600);
}

document.addEventListener('keydown', (e)=>{ if (e.key.toLowerCase() === 'h') wiggle(); });
van?.addEventListener('click', wiggle);
