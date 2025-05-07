import { useState } from 'react';

export default function Home() {
    const [nom, setNom] = useState('');
    const [resultat, setResultat] = useState(null);
    const [error, setError] = useState('');

    async function votar(e) {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/votar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom })
        });
        const data = await res.json();
        if (data.error) {
            // Mostrem l'error enviat des de l'API (per exemple: "El curt no existeix")
            setError(data.error);
            setResultat(null);
        } else {
            setResultat(data);
        }
    }

    return (
        <div>
            <h1>Votació en Directe</h1>
            <form onSubmit={votar}>
                <input
                    type="text"
                    placeholder="Nom del curt"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
                <button type="submit">Votar</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {resultat && (
                <div>
                    <p>Curt: {resultat.nom}</p>
                    <p>Vots actuals: {resultat.nouValor}</p>
                </div>
            )}
        </div>
    );
}