/**
 * CONTADOR GLOBAL DE VISITAS
 * Vercel + Supabase
 */

module.exports = async (req, res) => {
  // Aceita somente POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

  // Verifica configuração
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Variáveis do Supabase não configuradas.");

    return res.status(500).json({
      error: "Supabase não configurado."
    });
  }

  try {
    // Chama a função PostgreSQL
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/increment_visits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({})
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Erro Supabase:",
        response.status,
        responseText
      );

      return res.status(500).json({
        error: "Erro ao atualizar contador."
      });
    }

    const count = Number(responseText);

    if (!Number.isFinite(count)) {
      console.error("Resposta inválida do Supabase:", responseText);

      return res.status(500).json({
        error: "Resposta inválida do contador."
      });
    }

    // Retorna o total para o navegador
    return res.status(200).json({
      success: true,
      count
    });

  } catch (error) {
    console.error("Erro na API de visitas:", error);

    return res.status(500).json({
      error: "Erro interno ao processar contador."
    });
  }
};