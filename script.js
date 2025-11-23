/* ================= THEME TOGGLE ================= */
const toggleBtn = document.getElementById("toggleTheme");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  initParticles();
});

/* ================= SETTINGS PANEL UI ================= */
const settingsBtn = document.getElementById("settingsBtn");
const particlePanel = document.getElementById("particlePanel");
settingsBtn.addEventListener("click", () => {
  particlePanel.style.display =
    particlePanel.style.display === "block" ? "none" : "block";
});

/* SETTINGS: Toggle + Density */
const toggleParticles = document.getElementById("toggleParticles");
const densitySlider = document.getElementById("densitySlider");
const densityValue = document.getElementById("densityValue");

let particleCount = 100;

densitySlider.addEventListener("input", () => {
  particleCount = parseInt(densitySlider.value);
  densityValue.textContent = particleCount;
  initParticles();
});

toggleParticles.addEventListener("change", () => {
  if (!toggleParticles.checked) {
    particles = [];
  } else {
    initParticles();
  }
});

/* ================= PARTICLE SYSTEM ================= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width = (canvas.width = innerWidth);
let height = (canvas.height = innerHeight);
let particles = [];

window.addEventListener("resize", () => {
  width = canvas.width = innerWidth;
  height = canvas.height = innerHeight;
  initParticles();
});

/* Mouse tracking */
const mouse = { x: null, y: null, radius: 80 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* CLICK — ADD BURST EFFECT */
window.addEventListener("click", (e) => {
  if (!toggleParticles.checked) return;

  for (let i = 0; i < 10; i++) {
    particles.push(
      new Particle(e.clientX, e.clientY, true) // special burst flag
    );
  }
});

/* Particle class */
class Particle {
  constructor(x = Math.random() * width, y = Math.random() * height, burst = false) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 2 + 1;

    if (burst) {
      // burst mode = faster & outward
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    } else {
      this.vx = (Math.random() - 0.5) * 0.99;
      this.vy = (Math.random() - 0.5) * 0.99;
    }
  }

  draw(c) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  }

  update() {
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.x += this.vx;
    this.y += this.vy;
  }
}

/* Init */
function initParticles() {
  if (!toggleParticles.checked) return;

  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

/* Theme color */
function particleColor() {
  return document.body.classList.contains("dark")
    ? "rgba(245,250,120,0.8)"
    : "rgba(30,30,30,0.9)";
}

/* Animate */
function animate() {
  ctx.clearRect(0, 0, width, height);

  if (toggleParticles.checked) {
    particles.forEach((p) => {
      p.update();
      p.draw(particleColor());
    });

    // Limit number of particles so the page doesn't lag
    if (particles.length > particleCount + 80) {
      particles.splice(0, 20);
    }
  }

  requestAnimationFrame(animate);
}

initParticles();
animate();
