import { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { ref, onValue } from 'firebase/database';

export default function Home() {
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        // Obtenim una referència a la base de dades
        const dbRef = ref(db);
        // Subscripció en temps real
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const items = [];
            // Recorrem tots els keys del node principal
            for (const key in data) {
                items.push({ key, value: data[key] });
            }
            setVotes(items);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1>Estat de la votació (Temps real)</h1>
            <ul>
                {votes.map((item) => (
                    <li key={item.key}>
                        {item.key}: {item.value}
                    </li>
                ))}
            </ul>
        </div>
    );
}