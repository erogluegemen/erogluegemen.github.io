// --- DHL Themed Personal Site JS ---

// Year in footer
document.getElementById('y').textContent = new Date().getFullYear();

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
