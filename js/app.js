// =========================================================
// LOADING / PRELOADER
// =========================================================

const preloader = document.getElementById("preloader");
const loaderStatus = document.getElementById("loaderStatus");
const loaderPercent = document.getElementById("loaderPercent");
const loaderConsole = document.getElementById("loaderConsole");
const loaderProgressFill = document.getElementById("loaderProgressFill");


// =========================================================
// PARTÍCULAS
// =========================================================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];

const colors = [
  "rgba(183,91,255,0.38)",
  "rgba(248,209,108,0.32)",
  "rgba(103,35,229,0.24)"
];

function resizeCanvas() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;

  const amount = Math.max(
    18,
    Math.floor(window.innerWidth / 80)
  );

  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,

    radius: 2 + Math.random() * 2.5,

    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.4,

    alpha: 0.15 + Math.random() * 0.22,

    color:
      colors[Math.floor(Math.random() * colors.length)],

    pulse: Math.random() * Math.PI * 2
  }));
}

function drawParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach((particle) => {

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    particle.pulse += 0.03;

    const radius =
      particle.radius +
      Math.sin(particle.pulse) * 0.7;

    if (particle.x < -20) {
      particle.x = canvas.width + 20;
    }

    if (particle.x > canvas.width + 20) {
      particle.x = -20;
    }

    if (particle.y < -20) {
      particle.y = canvas.height + 20;
    }

    if (particle.y > canvas.height + 20) {
      particle.y = -20;
    }

    ctx.beginPath();

    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.alpha;

    ctx.arc(
      particle.x,
      particle.y,
      Math.max(0.8, radius),
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  ctx.globalAlpha = 1;

  requestAnimationFrame(drawParticles);
}


// =========================================================
// LOADING
// =========================================================

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
    loaderConsole.textContent =
      `SYSTEM STATUS - ${message}`;
  }
}

function flushFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}


// =========================================================
// DOM
// =========================================================

async function initializeDOM() {

  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    return;
  }

  await new Promise((resolve) => {

    document.addEventListener(
      "DOMContentLoaded",
      resolve,
      { once: true }
    );

  });
}


// =========================================================
// INTERFACE
// =========================================================

async function initializeInterface() {

  await flushFrame();

}


// =========================================================
// PARTÍCULAS
// =========================================================

async function initializeParticles() {

  resizeCanvas();

  createParticles();

  await flushFrame();

}


// =========================================================
// EVENTOS
// =========================================================

async function initializeEvents() {

  window.addEventListener(
    "resize",
    () => {

      resizeCanvas();
      createParticles();

    },
    { passive: true }
  );

  await flushFrame();

}


// =========================================================
// LINKS
// =========================================================

async function initializeLinks() {

  const buttons =
    document.querySelectorAll(".link-button");

  buttons.forEach((button) => {

    if (!button.hasAttribute("target")) {
      button.setAttribute(
        "target",
        "_blank"
      );
    }

    if (!button.hasAttribute("rel")) {
      button.setAttribute(
        "rel",
        "noopener noreferrer"
      );
    }

  });

  await flushFrame();

}


// =========================================================
// RECURSOS
// =========================================================

async function initializeResources() {

  const loaders = [];


  // Fontes
  if (
    document.fonts &&
    document.fonts.ready
  ) {

    loaders.push(
      document.fonts.ready.catch(() => null)
    );

  }


  // Imagens
  const images =
    Array.from(document.images);

  images.forEach((image) => {

    if (image.complete) {
      return;
    }

    loaders.push(
      new Promise((resolve) => {

        image.addEventListener(
          "load",
          resolve,
          { once: true }
        );

        image.addEventListener(
          "error",
          resolve,
          { once: true }
        );

      })
    );

  });


  if (loaders.length > 0) {
    await Promise.all(loaders);
  }

}


// =========================================================
// CONTADOR GLOBAL DE VISITAS
// =========================================================

async function carregarContadorVisitas() {

  const contador =
    document.getElementById("visitCount");


  if (!contador) {

    console.warn(
      "[VISITAS] #visitCount não encontrado."
    );

    return;

  }


  try {

    contador.textContent =
      "CARREGANDO...";


    console.log(
      "[VISITAS] Registrando visita..."
    );


    const response = await fetch(
      "/api/visits",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        cache: "no-store"
      }
    );


    const responseText =
      await response.text();


    console.log(
      "[VISITAS] API:",
      response.status,
      responseText
    );


    if (!response.ok) {

      throw new Error(
        `API retornou HTTP ${response.status}`
      );

    }


    let data;

    try {

      data =
        JSON.parse(responseText);

    } catch {

      throw new Error(
        "Resposta da API não é JSON válido."
      );

    }


    if (
      !data ||
      data.success !== true ||
      typeof data.count !== "number"
    ) {

      throw new Error(
        "Resposta inválida da API."
      );

    }


    const numero =
      data.count.toLocaleString(
        "pt-BR"
      );


    contador.textContent =
      numero;


    console.log(
      `[VISITAS] Total: ${numero}`
    );


  } catch (error) {

    console.error(
      "[VISITAS] Erro ao registrar visita:",
      error
    );


    // Não quebra o site se o contador falhar
    contador.textContent = "—";

  }

}


// =========================================================
// FINALIZAR LOADING
// =========================================================

function finishLoading() {

  updateLoading(
    100,
    "✓ SISTEMA PRONTO"
  );


  document.body.classList.remove(
    "loading"
  );

  document.body.classList.add(
    "loaded"
  );


  if (!preloader) {
    return;
  }


  preloader.classList.add(
    "loading-complete"
  );


  preloader.addEventListener(
    "transitionend",
    () => {

      if (preloader.parentNode) {
        preloader.remove();
      }

    },
    { once: true }
  );

}


// =========================================================
// INICIALIZAÇÃO PRINCIPAL
// =========================================================

async function initializeApp() {

  try {

    // 0%
    updateLoading(
      0,
      "[1/6] Inicializando sistema..."
    );

    await initializeDOM();


    // 20%
    updateLoading(
      20,
      "[2/6] Carregando interface..."
    );

    await initializeInterface();


    // 40%
    updateLoading(
      40,
      "[3/6] Inicializando partículas..."
    );

    await initializeParticles();


    // 60%
    updateLoading(
      60,
      "[4/6] Configurando eventos..."
    );

    await initializeEvents();


    // 70%
    updateLoading(
      70,
      "[5/6] Configurando links..."
    );

    await initializeLinks();


    // 85%
    updateLoading(
      85,
      "[6/6] Carregando recursos..."
    );

    await initializeResources();


    // =====================================================
    // REGISTRAR VISITA
    // =====================================================

    updateLoading(
      95,
      "Registrando visita..."
    );

    // Não deixa o contador impedir o site de carregar
    await carregarContadorVisitas();


    // =====================================================
    // FINAL
    // =====================================================

    await flushFrame();

    finishLoading();


  } catch (error) {

    console.error(
      "[APP] Erro durante inicialização:",
      error
    );


    if (loaderConsole) {

      loaderConsole.textContent =
        "⚠ ALGUNS RECURSOS NÃO FORAM CARREGADOS";

    }


    // Mesmo com erro, libera o site
    finishLoading();

  }

}


// =========================================================
// INICIAR PARTÍCULAS IMEDIATAMENTE
// =========================================================

resizeCanvas();
createParticles();

requestAnimationFrame(
  drawParticles
);


// =========================================================
// INICIAR APP
// =========================================================

initializeApp();