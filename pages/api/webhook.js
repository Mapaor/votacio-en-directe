export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }
    
    try {
        // Suposem que el webhook envia la informació en JSON
        const { keyData, altreInformacio } = req.body;
        
        // Aquí pots processar la informació rebuda
        console.log('Webhook rebut:', req.body);
        
        // Guarda o processa keyData segons el que necessitis
        // Per exemple, pots actualitzar la base de dades o fer una altra operació

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error processant el webhook:', err);
        return res.status(500).json({ error: 'Error processant el webhook' });
    }
}