const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const dotsEl = document.getElementById('dots');

let cur = 0;

// Build navigation dots
slides.forEach(function (_, i) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' on' : '');
  d.onclick = function () { goTo(i); };
  dotsEl.appendChild(d);
});

// Go to a specific slide
function goTo(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  cur = i;

  slider.scrollTo({ left: i * window.innerWidth, behavior: 'smooth' });

  dotsEl.querySelectorAll('.dot').forEach(function (d, j) {
    d.classList.toggle('on', j === i);
  });

  document.getElementById('arL').style.opacity = i === 0 ? '0.25' : '1';
  document.getElementById('arR').style.opacity = i === slides.length - 1 ? '0.25' : '1';
}

// Sync dots on native scroll (touch / trackpad)
slider.addEventListener('scroll', function () {
  const idx = Math.round(slider.scrollLeft / window.innerWidth);

  if (idx !== cur) {
    cur = idx;

    dotsEl.querySelectorAll('.dot').forEach(function (d, j) {
      d.classList.toggle('on', j === idx);
    });

    document.getElementById('arL').style.opacity = idx === 0 ? '0.25' : '1';
    document.getElementById('arR').style.opacity = idx === slides.length - 1 ? '0.25' : '1';
  }
}, { passive: true });

// Keyboard arrow navigation
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') goTo(cur + 1);
  if (e.key === 'ArrowLeft')  goTo(cur - 1);
});

// Mouse drag to scroll
let dn = false;
let sx = 0;
let sl = 0;

slider.addEventListener('mousedown', function (e) {
  dn = true;
  sx = e.pageX;
  sl = slider.scrollLeft;
  slider.style.cursor = 'grabbing';
});

slider.addEventListener('mouseleave', function () {
  dn = false;
  slider.style.cursor = 'default';
});

slider.addEventListener('mouseup', function () {
  if (dn) {
    dn = false;
    slider.style.cursor = 'default';

    const diff = sl - slider.scrollLeft;
    if (Math.abs(diff) > 60) {
      goTo(diff > 0 ? cur - 1 : cur + 1);
    } else {
      goTo(cur);
    }
  }
});

slider.addEventListener('mousemove', function (e) {
  if (!dn) return;
  e.preventDefault();
  slider.scrollLeft = sl - (e.pageX - sx);
});

// Set initial arrow state
document.getElementById('arL').style.opacity = '0.25';