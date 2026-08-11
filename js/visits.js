async function carregarVisitas() {
  const contador = document.getElementById("visitCount");

  if (!contador) {
    console.error("[VISITAS] #visitCount não encontrado.");
    return;
  }

  try {
    contador.textContent = "...";

    const response = await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    const data = await response.json();

    console.log("[VISITAS] Resposta:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erro na API");
    }

    contador.textContent =
      Number(data.count).toLocaleString("pt-BR");

  } catch (error) {
    console.error("[VISITAS] Erro:", error);

    contador.textContent = "—";
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    carregarVisitas
  );
} else {
  carregarVisitas();
}