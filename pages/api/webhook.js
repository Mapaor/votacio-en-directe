export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }
    
    try {
        // Exemple: extreure la key d'un camp concret segons el seu label
        const { data } = req.body;
        let keyInteres = null;
        if (data && data.fields && Array.isArray(data.fields)) {
            keyInteres = data.fields.find(field => field.label === 'Votació final premi del públic')?.key;
        }
        
        console.log('Webhook rebut:', req.body);
        console.log('Key d’interès:', keyInteres);
        
        // Aquí pots guardar o processar keyInteres com necessitis

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error processant el webhook:', err);
        return res.status(500).json({ error: 'Error processant el webhook' });
    }
}