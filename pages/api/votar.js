import { db } from '../../firebase';

if (typeof window !== 'undefined') {
  throw new Error('firebase-admin només pot ser carregat al servidor');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ error: 'Nom del curt no rebut' });
  }

  const ref = db.ref(nom);
  try {
    // Comprovem si la key existeix
    const snapshot = await ref.once('value');
    const valorActual = snapshot.val();
    if (valorActual === null) {
      return res.status(400).json({ error: 'El curt no existeix' });
    }

    // Si la key existeix, augmentem el valor
    await ref.transaction((actual) => actual + 1);
    const nouValor = (await ref.once('value')).val();
    return res.status(200).json({ nom, nouValor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al votar' });
  }
}
