/**
 * CONTADOR GLOBAL DE VISITAS
 * Vercel + Supabase
 */

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[VISITAS] Variáveis do Supabase não configuradas.");

    return res.status(500).json({
      error: "Supabase não configurado."
    });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/increment_visits`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        },

        body: "{}"
      }
    );

    const responseText = await response.text();

    console.log(
      "[VISITAS] Supabase:",
      response.status,
      responseText
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Erro ao atualizar contador.",
        details: responseText
      });
    }

    let count;

    try {
      count = JSON.parse(responseText);
    } catch {
      count = responseText;
    }

    count = Number(count);

    if (!Number.isFinite(count)) {
      console.error(
        "[VISITAS] Contador inválido:",
        responseText
      );

      return res.status(500).json({
        error: "Resposta inválida do contador."
      });
    }

    return res.status(200).json({
      success: true,
      count: count
    });

  } catch (error) {
    console.error(
      "[VISITAS] Erro interno:",
      error
    );

    return res.status(500).json({
      error: "Erro interno ao processar contador."
    });
  }
};