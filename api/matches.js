export default async function handler(req, res) {
  const { dateFrom, dateTo } = req.query;
  
  const response = await fetch(
    `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    { headers: { 'X-Auth-Token': '8fa323508273400cb933fd178cec6e90' } }
  );
  
  const data = await response.json();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(response.status).json(data);
}
