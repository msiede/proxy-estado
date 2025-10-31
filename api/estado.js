// api/estado.js — Vercel Serverless Function (Node.js)
// Devuelve JSON y permite CORS para tu dominio.

export default async function handler(req, res) {
  // Origines permitidos para CORS (ajusta si usas otros dominios/subdominios)
  const ORIGINS = new Set([
    'https://assermind.cl',
    'https://www.assermind.cl',
    'http://assermind.cl',
    'http://www.assermind.cl'
  ]);
  const origin = req.headers.origin || '';
  if (ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Validar patente
  const patente = String(req.query.patente || '').toUpperCase().trim();
  if (!patente) return res.status(400).json({ error: 'Patente requerida' });

  try {
    // ================== MODO DEMO ==================
    // Cambia "Estado Sello" a "BLOQUEADO" para probar alerta roja en el front.
    const simulated = {
      "Patente": patente,
      "Acreditación DBMS": "OK",
      "Integración Fatiga": "OK",
      "Hub Gestión Vial": "OK",
      "Estado Sello": "BLOQUEADO"
    };
    return res.status(200).json(simulated);

    // ============ CUANDO TENGAS API REAL ===========
    // Ejemplo de cómo llamar al endpoint real:
    // const r = await fetch(`https://<endpoint-real>?patente=${encodeURIComponent(patente)}`, {
    //   headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` } // si te dan token
    // });
    // if (!r.ok) throw new Error('HTTP ' + r.status);
    // const raw = await r.json();
    // const normalized = {
    //   "Patente": raw.placa ?? patente,
    //   "Estado Sello": String(raw.estadoSello ?? raw.estado ?? '').toUpperCase(),
    //   // agrega aquí los campos que quieras mostrar "tal cual"
    // };
    // return res.status(200).json(normalized);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Fallo de consulta' });
  }
}
