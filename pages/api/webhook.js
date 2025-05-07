export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }
    
    try {
        // Algunes plataformes envien el payload com a array
        const payload = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log('Webhook rebut:', payload);
        
        const { data } = payload;
        if (!data) {
            console.error('No s\'ha rebut property data');
            return res.status(400).json({ error: 'Missing data property' });
        }
        
        // Mostrem tots els camps per verificar que estiguin poblats
        console.log('Fields:', data.fields);
        
        // Si vols extreure un camp en concret, assegura't que la label coincideix exactament
        // Per exemple, si "formName" és "Votació final premi del públic", potser vols processar
        // els camps sense filtrar per una label.
        let keyInteres = data.fields.find(field => field.label === 'Votació final premi del públic')?.key || null;
        console.log('Key d’interès:', keyInteres);
        
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error processant el webhook:', err);
        return res.status(500).json({ error: 'Error processant el webhook' });
    }
}