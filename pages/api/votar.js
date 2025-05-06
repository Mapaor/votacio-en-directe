import { db } from '../../../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { nom }  req.body;
  if (!nom) {
    return res.status(400).json({ error: 'Nom del curt no rebut' });
  }

  const ref = db.ref(nom);
  try {
    await ref.transaction((actual) => (actual || 0) + 1);
    const nouValor = (await ref.once('value')).val();
    return res.status(200).json({ nom, nouValor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al votar' });
  }
}
