import { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { ref, onValue } from 'firebase/database';
import styles from '../styles/ImageGrid.module.css';

export default function Home() {
    const [votes, setVotes] = useState([]);

    // Defineix el mapping de títols reals a identificadors
    const mapping = {
      '3 Fases Pilot': 'pilot',
      "L'altra banda del fil": 'fil',
      "Aquella nit d'ahir": 'ahir',
      'Pixapins': 'pixapins',
      'La Patata': 'patata',
      'Tangle Twist': 'twist',
      'Remember': 'remember'
    };
    // Inverteix el mapping per obtenir (identificador -> títol real)
    const invertedMapping = Object.fromEntries(
      Object.entries(mapping).map(([title, id]) => [id, title])
    );

    useEffect(() => {
        const dbRef = ref(db);
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const items = [];
            for (const key in data) {
                items.push({ key, value: data[key] });
            }
            setVotes(items);
        });
        return () => unsubscribe();
    }, []);

    // Calcula el valor màxim de vots (convertint a number si cal)
    const maxVote = votes.length ? Math.max(...votes.map(item => Number(item.value))) : 0;

    return (
        <div>
            <h1>Vots del premi del públic LENDEMÀ21</h1>
            <div className="wrapper">
              <div className={styles.gridContainer}>
                {votes.map((item) => {
                  const voteValue = Number(item.value);
                  const voteDifference = maxVote - voteValue;
                  let cardStyle = {};
                  if (voteDifference === 0) {
                      cardStyle = { backgroundColor: "#9dfc03" };
                  } else if (voteDifference > 0 && voteDifference <= 2) {
                      cardStyle = { backgroundColor: "#f4f731" };
                  }
                  return (
                    <div key={item.key} className={styles.card} style={cardStyle}>
                        <h2>{invertedMapping[item.key] || item.key}</h2>
                        <img src={`/${item.key}.png`} alt={item.key} className={styles.cardImage} />
                        <p key={`${item.key}-${item.value}`} className={styles.voteNumber} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {item.value}
                        </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR overlay sempre visible amb animació constant */}
            <div className={styles.qrOverlay}>
              <img src="/qr.png" alt="QR" className={styles.qrImage} />
            </div>
        </div>
    );
}