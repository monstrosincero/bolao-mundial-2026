export default async function handler(req, res) {
  const SUPABASE_URL = 'https://fwlrininphvlwdsykisz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bHJpbmlucGh2bHdkc3lraXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDE4NTAsImV4cCI6MjA5NzExNzg1MH0.dvyzsAZxD5wrwCKuR1Z_FnmH1oGBmbDf6ZZlZefMqEM';
  const FD_KEY = '8fa323508273400cb933fd178cec6e90';

  try {
    // Buscar jogos dos últimos 2 dias que possam ter terminado
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const from = twoDaysAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const apiRes = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${from}&dateTo=${to}&status=FINISHED`,
      { headers: { 'X-Auth-Token': FD_KEY } }
    );
    const data = await apiRes.json();
    const matches = data.matches || [];

    let updated = 0;
    for (const match of matches) {
      const ft = match.score?.fullTime;
      if (ft?.home == null || ft?.away == null) continue;

      await fetch(`${SUPABASE_URL}/rest/v1/results`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          match_id: String(match.id),
          home_score: ft.home,
          away_score: ft.away,
          finished: true
        })
      });
      updated++;
    }

    res.status(200).json({ ok: true, updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
