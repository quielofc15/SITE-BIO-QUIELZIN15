/**
 * =========================================================
 * CONTADOR GLOBAL DE VISITAS
 * Vercel + Supabase
 * =========================================================
 *
 * Rota:
 * POST /api/visits
 *
 * Variáveis necessárias na Vercel:
 * SUPABASE_URL
 * SUPABASE_SECRET_KEY
 */

module.exports = async function handler(req, res) {
  console.log("========================================");
  console.log("[VISITAS] Nova requisição recebida");
  console.log("[VISITAS] Método:", req.method);
  console.log("[VISITAS] Horário:", new Date().toISOString());

  // -------------------------------------------------------
  // SOMENTE POST
  // -------------------------------------------------------

  if (req.method !== "POST") {
    console.warn("[VISITAS] Método não permitido:", req.method);

    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // -------------------------------------------------------
  // VARIÁVEIS DE AMBIENTE
  // -------------------------------------------------------

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

  console.log(
    "[VISITAS] SUPABASE_URL:",
    SUPABASE_URL ? "CONFIGURADA" : "NÃO CONFIGURADA"
  );

  console.log(
    "[VISITAS] SUPABASE_SECRET_KEY:",
    SUPABASE_KEY ? "CONFIGURADA" : "NÃO CONFIGURADA"
  );

  // Nunca mostrar a chave no console.
  // Isso é importante para segurança.

  if (!SUPABASE_URL) {
    console.error("[VISITAS] ERRO: SUPABASE_URL não existe.");

    return res.status(500).json({
      success: false,
      error: "SUPABASE_URL não configurada."
    });
  }

  if (!SUPABASE_KEY) {
    console.error(
      "[VISITAS] ERRO: SUPABASE_SECRET_KEY não existe."
    );

    return res.status(500).json({
      success: false,
      error: "SUPABASE_SECRET_KEY não configurada."
    });
  }

  // -------------------------------------------------------
  // VERIFICA URL
  // -------------------------------------------------------

  const supabaseUrl = SUPABASE_URL.replace(/\/+$/, "");

  console.log("[VISITAS] URL Supabase:", supabaseUrl);

  const rpcUrl =
    `${supabaseUrl}/rest/v1/rpc/increment_visits`;

  console.log("[VISITAS] RPC:", rpcUrl);

  // -------------------------------------------------------
  // CHAMADA SUPABASE
  // -------------------------------------------------------

  try {
    console.log(
      "[VISITAS] Chamando increment_visits..."
    );

    const response = await fetch(rpcUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },

      body: "{}"
    });

    console.log(
      "[VISITAS] Status Supabase:",
      response.status,
      response.statusText
    );

    const responseText = await response.text();

    console.log(
      "[VISITAS] Resposta bruta:",
      responseText
    );

    // -----------------------------------------------------
    // ERRO SUPABASE
    // -----------------------------------------------------

    if (!response.ok) {
      console.error(
        "[VISITAS] ❌ SUPABASE RECUSOU A REQUISIÇÃO"
      );

      console.error(
        "[VISITAS] HTTP:",
        response.status
      );

      console.error(
        "[VISITAS] Detalhes:",
        responseText
      );

      return res.status(500).json({
        success: false,
        error: "Supabase recusou a atualização.",
        status: response.status
      });
    }

    // -----------------------------------------------------
    // CONVERTER RESPOSTA
    // -----------------------------------------------------

    let count;

    try {
      count = JSON.parse(responseText);
    } catch (error) {
      console.warn(
        "[VISITAS] Resposta não é JSON puro."
      );

      count = responseText;
    }

    console.log(
      "[VISITAS] Valor recebido:",
      count
    );

    // Algumas respostas podem vir como número
    // e outras como string.
    count = Number(count);

    if (!Number.isFinite(count)) {
      console.error(
        "[VISITAS] ❌ CONTADOR INVÁLIDO"
      );

      console.error(
        "[VISITAS] Resposta recebida:",
        responseText
      );

      return res.status(500).json({
        success: false,
        error: "Resposta inválida do contador."
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
      "[VISITAS] ❌ ERRO NA REQUISIÇÃO"
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
      error: "Erro interno ao processar contador."
    });
  }
};