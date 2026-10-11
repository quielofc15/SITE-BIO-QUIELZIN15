/* =========================================================
   APP QUIELZIN15
   LOADING + PARTÍCULAS + CONTADOR DE VISITAS
   ========================================================= */


/* =========================================================
   ELEMENTOS DO LOADING
   ========================================================= */

const preloader = document.getElementById("preloader");
const loaderStatus = document.getElementById("loaderStatus");
const loaderPercent = document.getElementById("loaderPercent");
const loaderConsole = document.getElementById("loaderConsole");
const loaderProgressFill =
  document.getElementById("loaderProgressFill");

const canvas = document.getElementById("particle-canvas");

let ctx = null;
let particles = [];

const colors = [
  "rgba(183,91,255,0.38)",
  "rgba(248,209,108,0.32)",
  "rgba(103,35,229,0.24)"
];


/* =========================================================
   CANVAS
   ========================================================= */

function resizeCanvas() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}


/* =========================================================
   PARTÍCULAS
   ========================================================= */

function createParticles() {
  if (!canvas) return;

  const quantidade = Math.max(
    18,
    Math.floor(window.innerWidth / 80)
  );

  particles = Array.from(
    { length: quantidade },
    () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,

      radius: 2 + Math.random() * 2.5,

      speedX:
        (Math.random() - 0.5) * 0.3,

      speedY:
        (Math.random() - 0.5) * 0.4,

      alpha:
        0.15 + Math.random() * 0.22,

      color:
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ],

      pulse:
        Math.random() *
        Math.PI *
        2
    })
  );
}


/* =========================================================
   DESENHAR PARTÍCULAS
   ========================================================= */

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
      Math.sin(
        particle.pulse
      ) * 0.7;


    /* TELEPORTE NAS BORDAS */

    if (particle.x < -20) {
      particle.x =
        canvas.width + 20;
    }

    if (
      particle.x >
      canvas.width + 20
    ) {
      particle.x = -20;
    }

    if (particle.y < -20) {
      particle.y =
        canvas.height + 20;
    }

    if (
      particle.y >
      canvas.height + 20
    ) {
      particle.y = -20;
    }


    /* DESENHAR */

    ctx.beginPath();

    ctx.fillStyle =
      particle.color;

    ctx.globalAlpha =
      particle.alpha;

    ctx.arc(
      particle.x,
      particle.y,
      Math.max(
        0.8,
        radius
      ),
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  ctx.globalAlpha = 1;

  requestAnimationFrame(
    drawParticles
  );
}


/* =========================================================
   ATUALIZAR LOADING
   ========================================================= */

function updateLoading(
  percent,
  message
) {

  if (loaderProgressFill) {
    loaderProgressFill.style.width =
      `${percent}%`;
  }

  if (loaderPercent) {
    loaderPercent.textContent =
      `${percent}%`;
  }

  if (loaderStatus) {
    loaderStatus.textContent =
      message;
  }

  if (loaderConsole) {
    loaderConsole.textContent =
      `SYSTEM STATUS - ${message}`;
  }
}


/* =========================================================
   AGUARDAR FRAME
   ========================================================= */

function flushFrame() {

  return new Promise(
    (resolve) => {

      requestAnimationFrame(
        () => resolve()
      );

    }
  );
}


/* =========================================================
   DOM
   ========================================================= */

async function initializeDOM() {

  console.log(
    "[APP] Verificando DOM..."
  );

  if (
    document.readyState ===
    "complete"
  ) {

    console.log(
      "[APP] DOM já está completamente carregado."
    );

    return;
  }

  await new Promise(
    (resolve) => {

      window.addEventListener(
        "load",
        resolve,
        {
          once: true
        }
      );

    }
  );

  console.log(
    "[APP] Evento window.load recebido."
  );
}


/* =========================================================
   INTERFACE
   ========================================================= */

async function initializeInterface() {

  console.log(
    "[APP] Inicializando interface..."
  );

  await flushFrame();

  console.log(
    "[APP] Interface inicializada."
  );
}


/* =========================================================
   PARTÍCULAS
   ========================================================= */

async function initializeParticles() {

  console.log(
    "[APP] Inicializando partículas..."
  );

  if (canvas) {

    ctx =
      canvas.getContext("2d");

    resizeCanvas();

    createParticles();
  }

  await flushFrame();

  console.log(
    "[APP] Partículas inicializadas."
  );
}


/* =========================================================
   EVENTOS
   ========================================================= */

async function initializeEvents() {

  console.log(
    "[APP] Configurando eventos..."
  );

  window.addEventListener(
    "resize",
    () => {

      resizeCanvas();

      createParticles();

    },
    {
      passive: true
    }
  );

  await flushFrame();

  console.log(
    "[APP] Eventos configurados."
  );
}


/* =========================================================
   LINKS
   ========================================================= */

async function initializeLinks() {

  console.log(
    "[APP] Verificando links..."
  );

  const buttons =
    document.querySelectorAll(
      ".link-button"
    );

  console.log(
    "[APP] Botões encontrados:",
    buttons.length
  );

  buttons.forEach(
    (button) => {

      if (
        !button.hasAttribute(
          "target"
        )
      ) {

        button.setAttribute(
          "target",
          "_blank"
        );
      }

      if (
        !button.hasAttribute(
          "rel"
        )
      ) {

        button.setAttribute(
          "rel",
          "noopener noreferrer"
        );
      }

    }
  );

  await flushFrame();

  console.log(
    "[APP] Links configurados."
  );
}


/* =========================================================
   RECURSOS
   ========================================================= */

async function initializeResources() {

  console.log(
    "[APP] Verificando recursos..."
  );

  const loaders = [];


  /* FONTES */

  if (
    document.fonts &&
    document.fonts.ready
  ) {

    console.log(
      "[APP] Aguardando fontes..."
    );

    loaders.push(
      document.fonts.ready.catch(
        (error) => {

          console.warn(
            "[APP] Erro nas fontes:",
            error
          );

          return null;
        }
      )
    );
  }


  /* IMAGENS */

  const images =
    Array.from(
      document.images
    );

  console.log(
    "[APP] Imagens encontradas:",
    images.length
  );


  images.forEach(
    (image, index) => {

      if (image.complete) {

        console.log(
          `[APP] Imagem ${index + 1}: já carregada`
        );

        return;
      }

      console.log(
        `[APP] Aguardando imagem ${index + 1}:`,
        image.src
      );


      loaders.push(
        new Promise(
          (resolve) => {

            image.addEventListener(
              "load",
              () => {

                console.log(
                  `[APP] Imagem ${index + 1}: carregada`
                );

                resolve();

              },
              {
                once: true
              }
            );


            image.addEventListener(
              "error",
              () => {

                console.warn(
                  `[APP] Imagem ${index + 1}: erro`,
                  image.src
                );

                resolve();

              },
              {
                once: true
              }
            );

          }
        )
      );

    }
  );


  if (
    loaders.length > 0
  ) {

    await Promise.all(
      loaders
    );
  }


  console.log(
    "[APP] Recursos finalizados."
  );
}


/* =========================================================
   FINALIZAR LOADING
   ========================================================= */

function finishLoading() {

  console.log(
    "[APP] Finalizando loading..."
  );

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

    console.log(
      "[APP] Preloader não encontrado."
    );

    return;
  }


  preloader.classList.add(
    "loading-complete"
  );


  preloader.addEventListener(
    "transitionend",
    () => {

      if (
        preloader.parentNode
      ) {

        preloader.remove();

        console.log(
          "[APP] Loading removido."
        );
      }

    },
    {
      once: true
    }
  );
}


/* =========================================================
   INICIALIZAÇÃO PRINCIPAL
   ========================================================= */

async function initializeApp() {

  console.log(
    "========================================"
  );

  console.log(
    "[APP] initializeApp() iniciado"
  );


  try {

    /* 1 */

    updateLoading(
      0,
      "[1/6] Inicializando sistema..."
    );

    await initializeDOM();


    /* 2 */

    updateLoading(
      20,
      "[2/6] Carregando interface..."
    );

    await initializeInterface();


    /* 3 */

    updateLoading(
      40,
      "[3/6] Inicializando partículas..."
    );

    await initializeParticles();


    /* 4 */

    updateLoading(
      60,
      "[4/6] Configurando eventos..."
    );

    await initializeEvents();


    /* 5 */

    updateLoading(
      80,
      "[5/6] Configurando links..."
    );

    await initializeLinks();


    /* 6 */

    updateLoading(
      90,
      "[6/6] Carregando recursos..."
    );

    await initializeResources();


    await flushFrame();


    finishLoading();


    console.log(
      "[APP] ✅ Inicialização concluída."
    );

    console.log(
      "========================================"
    );

  } catch (error) {

    console.error(
      "[APP] ❌ ERRO NA INICIALIZAÇÃO:"
    );

    console.error(
      error
    );


    if (loaderConsole) {

      loaderConsole.textContent =
        "⚠ ALGUNS RECURSOS NÃO FORAM CARREGADOS";
    }


    finishLoading();
  }
}


/* =========================================================
   CONTADOR GLOBAL DE VISITAS
   ========================================================= */

async function carregarContadorVisitas() {

  console.log(
    "========================================"
  );

  console.log(
    "[VISITAS] Iniciando contador..."
  );


  const contador =
    document.getElementById(
      "visitCount"
    );


  if (!contador) {

    console.error(
      "[VISITAS] ❌ #visitCount não encontrado."
    );

    return;
  }


  contador.textContent =
    "CARREGANDO...";


  try {

    console.log(
      "[VISITAS] Enviando POST para /api/visits..."
    );


    const inicio =
      performance.now();


    const response =
      await fetch(
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


    const tempo =
      Math.round(
        performance.now() -
        inicio
      );


    console.log(
      "[VISITAS] Resposta recebida em:",
      `${tempo}ms`
    );


    console.log(
      "[VISITAS] HTTP:",
      response.status,
      response.statusText
    );


    const texto =
      await response.text();


    console.log(
      "[VISITAS] Resposta da API:",
      texto
    );


    if (!response.ok) {

      throw new Error(
        `API retornou HTTP ${response.status}: ${texto}`
      );
    }


    let data;


    try {

      data =
        JSON.parse(texto);

    } catch (error) {

      console.error(
        "[VISITAS] ❌ API não retornou JSON válido."
      );

      throw new Error(
        "Resposta da API não é JSON."
      );
    }


    console.log(
      "[VISITAS] Dados recebidos:",
      data
    );


    if (
      !data ||
      data.success !== true
    ) {

      throw new Error(
        "API informou que a operação não teve sucesso."
      );
    }


    const numero =
      Number(
        data.count
      );


    if (
      !Number.isFinite(
        numero
      )
    ) {

      throw new Error(
        "O contador recebido não é um número válido."
      );
    }


    const formatado =
      numero.toLocaleString(
        "pt-BR"
      );


    contador.textContent =
      formatado;


    console.log(
      "[VISITAS] ✅ VISITA REGISTRADA!"
    );

    console.log(
      "[VISITAS] TOTAL:",
      formatado
    );

    console.log(
      "========================================"
    );


  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "[VISITAS] ❌ ERRO!"
    );

    console.error(
      "[VISITAS] Nome:",
      error?.name
    );

    console.error(
      "[VISITAS] Mensagem:",
      error?.message
    );

    console.error(
      "[VISITAS] Erro completo:",
      error
    );

    console.error(
      "========================================"
    );


    contador.textContent =
      "—";
  }
}


/* =========================================================
   INICIAR APLICAÇÃO
   ========================================================= */

function iniciarAplicacao() {

  console.log(
    "[APP] Página iniciando..."
  );


  if (canvas) {

    ctx =
      canvas.getContext("2d");

    resizeCanvas();

    createParticles();

    requestAnimationFrame(
      drawParticles
    );
  }


  /* IMPORTANTE:
     Cada função é chamada somente UMA VEZ. */

  initializeApp();

  carregarContadorVisitas();
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacao,
    {
      once: true
    }
  );

} else {

  iniciarAplicacao();
}