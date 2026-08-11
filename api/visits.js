/**
 * =========================================================
 * CONTADOR GLOBAL DE VISITAS
 * VERCEL + SUPABASE
 * =========================================================
 *
 * Rota:
 * POST /api/visits
 *
 * Variáveis:
 * SUPABASE_URL
 * SUPABASE_SECRET_KEY
 * =========================================================
 */

module.exports = async (req, res) => {
  console.log("========================================");
  console.log("[VISITAS] API INICIADA");
  console.log("[VISITAS] Método:", req.method);
  console.log("[VISITAS] URL:", req.url);
  console.log("[VISITAS] Data:", new Date().toISOString());

  // -------------------------------------------------------
  // SOMENTE POST
  // -------------------------------------------------------

  if (req.method !== "POST") {
    console.log("[VISITAS] ❌ Método não permitido");

    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // -------------------------------------------------------
  // VARIÁVEIS
  // -------------------------------------------------------

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

  console.log(
    "[VISITAS] SUPABASE_URL:",
    SUPABASE_URL ? "OK" : "AUSENTE"
  );

  console.log(
    "[VISITAS] SUPABASE_SECRET_KEY:",
    SUPABASE_KEY ? "OK" : "AUSENTE"
  );

  if (!SUPABASE_URL) {
    console.error("[VISITAS] ❌ SUPABASE_URL AUSENTE");

    return res.status(500).json({
      success: false,
      error: "SUPABASE_URL não configurada"
    });
  }

  if (!SUPABASE_KEY) {
    console.error("[VISITAS] ❌ SUPABASE_SECRET_KEY AUSENTE");

    return res.status(500).json({
      success: false,
      error: "SUPABASE_SECRET_KEY não configurada"
    });
  }

  // -------------------------------------------------------
  // URL DO SUPABASE
  // -------------------------------------------------------

  const baseUrl = SUPABASE_URL.replace(/\/+$/, "");

  const rpcUrl =
    `${baseUrl}/rest/v1/rpc/increment_visits`;

  console.log("[VISITAS] RPC:", rpcUrl);

  // -------------------------------------------------------
  // CHAMAR SUPABASE
  // -------------------------------------------------------

  try {
    console.log("[VISITAS] Chamando Supabase...");

    const response = await fetch(rpcUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },

      body: "{}"
    });

    const responseText = await response.text();

    console.log(
      "[VISITAS] HTTP Supabase:",
      response.status
    );

    console.log(
      "[VISITAS] Resposta Supabase:",
      responseText
    );

    // -----------------------------------------------------
    // ERRO SUPABASE
    // -----------------------------------------------------

    if (!response.ok) {
      console.error(
        "[VISITAS] ❌ SUPABASE RETORNOU ERRO"
      );

      return res.status(500).json({
        success: false,
        error: "Erro no Supabase",
        status: response.status,
        details: responseText
      });
    }

    // -----------------------------------------------------
    // CONVERTER RESULTADO
    // -----------------------------------------------------

    let count;

    try {
      count = JSON.parse(responseText);
    } catch {
      count = responseText;
    }

    count = Number(count);

    console.log(
      "[VISITAS] Contador recebido:",
      count
    );

    if (!Number.isFinite(count)) {
      console.error(
        "[VISITAS] ❌ CONTADOR INVÁLIDO"
      );

      return res.status(500).json({
        success: false,
        error: "Contador inválido",
        response: responseText
      });
    }

    // -----------------------------------------------------
    // SUCESSO
    // -----------------------------------------------------

    console.log(
      "[VISITAS] ✅ VISITA REGISTRADA"
    );

    console.log(
      "[VISITAS] TOTAL:",
      count
    );

    console.log("========================================");

    return res.status(200).json({
      success: true,
      count: count
    });

  } catch (error) {

    console.error(
      "[VISITAS] ❌ ERRO INTERNO"
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
      "[VISITAS] Stack:",
      error?.stack
    );

    console.log("========================================");

    return res.status(500).json({
      success: false,
      error: "Erro interno ao processar contador"
    });
  }
};