const preloader = document.getElementById('preloader');
const loaderStatus = document.getElementById('loaderStatus');
const loaderPercent = document.getElementById('loaderPercent');
const loaderConsole = document.getElementById('loaderConsole');
const loaderProgressFill = document.getElementById('loaderProgressFill');

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const colors = ['rgba(183,91,255,0.38)', 'rgba(248,209,108,0.32)', 'rgba(103,35,229,0.24)'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = Array.from({ length: Math.max(18, Math.floor(window.innerWidth / 80)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 2 + Math.random() * 2.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.4,
    alpha: 0.15 + Math.random() * 0.22,
    color: colors[Math.floor(Math.random() * colors.length)],
    pulse: Math.random() * Math.PI * 2,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.pulse += 0.03;
    const radius = particle.radius + Math.sin(particle.pulse) * 0.7;

    if (particle.x < -20) particle.x = canvas.width + 20;
    if (particle.x > canvas.width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = canvas.height + 20;
    if (particle.y > canvas.height + 20) particle.y = -20;

    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.alpha;
    ctx.arc(particle.x, particle.y, Math.max(0.8, radius), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

function updateLoading(percent, message) {
  if (loaderProgressFill) {
    loaderProgressFill.style.width = `${percent}%`;
  }
  if (loaderPercent) {
    loaderPercent.textContent = `${percent}%`;
  }
  if (loaderStatus) {
    loaderStatus.textContent = message;
  }
  if (loaderConsole) {
    loaderConsole.textContent = `SYSTEM STATUS - ${message}`;
  }
}

function flushFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function initializeDOM() {
  if (document.readyState === 'complete') {
    return;
  }
  await new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true });
  });
}

async function initializeInterface() {
  await flushFrame();
}

async function initializeResources() {
  const loaders = [];

  if (document.fonts && document.fonts.ready) {
    loaders.push(document.fonts.ready.catch(() => null));
  }

  const images = Array.from(document.images).filter((img) => !img.complete);
  images.forEach((image) => {
    loaders.push(new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    }));
  });

  if (loaders.length) {
    await Promise.all(loaders);
  }
}

async function initializeParticles() {
  resizeCanvas();
  createParticles();
  await flushFrame();
}

async function initializeEvents() {
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  }, { passive: true });
  await flushFrame();
}

async function initializeLinks() {
  const buttons = document.querySelectorAll('.link-button');
  buttons.forEach((button) => {
    if (!button.hasAttribute('target')) {
      button.setAttribute('target', '_blank');
    }
    if (!button.hasAttribute('rel')) {
      button.setAttribute('rel', 'noopener noreferrer');
    }
  });
  await flushFrame();
}

function finishLoading() {
  updateLoading(100, '✓ SISTEMA PRONTO');
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  if (!preloader) return;

  preloader.classList.add('loading-complete');

  preloader.addEventListener('transitionend', () => {
    if (preloader.parentNode) {
      preloader.remove();
    }
  }, { once: true });
}

async function initializeApp() {
  try {
    updateLoading(0, '[1/6] Inicializando sistema...');
    await initializeDOM();

    updateLoading(20, '[2/6] Carregando interface...');
    await initializeInterface();

    updateLoading(40, '[3/6] Inicializando partículas...');
    await initializeParticles();

    updateLoading(60, '[4/6] Configurando eventos...');
    await initializeEvents();

    updateLoading(80, '[5/6] Configurando links...');
    await initializeLinks();

    updateLoading(90, '[6/6] Carregando recursos...');
    await initializeResources();

    await flushFrame();
    finishLoading();
  } catch (error) {
    console.error('Erro na inicialização do loading:', error);
    if (loaderConsole) {
      loaderConsole.textContent = '⚠ ALGUNS RECURSOS NÃO FORAM CARREGADOS';
    }
    finishLoading();
  }
}

resizeCanvas();
createParticles();
requestAnimationFrame(drawParticles);
initializeApp();
/* =========================================================
   CONTADOR GLOBAL DE VISITAS
   ========================================================= */

async function carregarContadorVisitas() {
  const contador = document.getElementById("visitCount");

  if (!contador) {
    console.warn(
      "[VISITAS] Elemento #visitCount não encontrado."
    );

    return;
  }

  try {
    contador.textContent = "CARREGANDO...";

    const response = await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (
      !data ||
      typeof data.count !== "number"
    ) {
      throw new Error(
        "Resposta inválida da API."
      );
    }

    const numero = data.count.toLocaleString(
      "pt-BR"
    );

    contador.textContent = numero;

    console.log(
      `[VISITAS] Total: ${numero}`
    );

  } catch (error) {
    console.error(
      "[VISITAS] Erro:",
      error
    );

    contador.textContent = "—";
  }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    carregarContadorVisitas
  );

} else {

  carregarContadorVisitas();

}