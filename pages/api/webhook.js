export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }
    
    try {
        // Algunes plataformes envien el payload com a array
        const payload = Array.isArray(req.body) ? req.body[0] : req.body;
        
        const { data } = payload;
        if (!data) {
            console.error('No s\'ha rebut property data');
            return res.status(400).json({ error: 'Missing data property' });
        }
        
        // Itera per cada field i filtra per la condició:
        // - field.value !== null
        // - field.key.length < 20
        const fieldVotat = data.fields.find(field => field.value !== null && field.key.length < 20);
        
        // Defineix el mapping de labels a identificadors
        const mapping = {
            '3 Fases Pilot': 'pilot',
            "L'altra banda del fil": 'fil',
            "Aquella nit d'ahir": 'ahir',
            'Pixapins': 'pixapins',
            'La Patata': 'patata',
            'Tangle Twist': 'twist',
            'Remember': 'remember'
        };
        
        if (fieldVotat) {
            const label = fieldVotat.label;
            const identificador = mapping[label];
            console.log('Field label:', label);
            if (identificador) {
                console.log('Identificador assignat:', identificador);
            } else {
                console.log('Label no mapejada als identificadors: ', label);
            }
        } else {
            console.log('No s\'ha trobat cap field que compleixi la condició.');
        }
        
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error processant el webhook:', err);
        return res.status(500).json({ error: 'Error processant el webhook' });
    }
}