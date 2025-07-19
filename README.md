# votacio-en-directe
Web que rep les respostes d'un Tally Forms en directe.

El formulari és el següent (l'he tornat a obrir a mode d'arxiu): https://tally.so/r/w7jyXP.

Aquí un diagrama amb el funcionament de l'aplicació i lògica de la repo:

![diagrama](repo-diagram.svg)


Per generar el QR s'ha utilitzat una web de codi obert molt xula: [https://mini-qr-code-generator.vercel.app/](https://mini-qr-code-generator.vercel.app/)


### Configuració Tally
Dins del formulari:

![regles tally](tally-rules.png)

Integració webhook:

![webhook integration](tally-webhooks.png)

### Lògica firebase
Tenim a firebase realtime databse una base de dades que és un JSON molt simple:
```
{
  "ahir": 7,
  "fil": 16,
  "patata": 13,
  "pilot": 17,
  "pixapins": 9,
  "remember": 3,
  "twist": 17
}
```
Aquestes dades únicament les modifiquem (escriptura) nosaltres des del servidor (amb firebase admin SDK), és a dir des de la api de la pròpia app nextjs que és `api/webhook.js`. 

Nota: `api/votar.js` és irrellevant, es podria eliminar i tot seguiria funcionant, l'he deixat únicament per si es volen fer proves.

El servidor, al tenir configurat admin SDK no té restriccions (explicació de com configurar-ho al diagrama que hi ha més amunt), això vol dir que pot llegir i escriure tot el que vulgui. El client (és a dir un usuari que utilitza el navegador i entra a la pàgina) no necessita escriure a la base de dades (no hi ha cap botó de votar). Aleshores únicament necessita permissos de lectura (per poder llegir la base de dades i mostrar els vots de manera maca a index.js), és per això que les regles de la base de dades (https://console.firebase.google.com/u/0/project/nomProjecte/database/nomBaseDeDades/rules) són:
```
{
  "rules": {
    ".read": "true",
    ".write": "false",
  }
}
```

El que s'encarrega de llegir la resposta del formulari de Tally i actualitzar la base de dades és `api/webhook.js`, i ho fa gràcies als permisos (d'escriptura i lectura server-side) Admin SDK de `firebase.js`. El que s'encarrega de mostrar els vots de manera bonica és `index.js`, i ho fa gràcies als permissos de lectura client-side de `firabaseClient.js`.

### Variables d'entorn
L'important és tenir en compte que en local (repo instal·lada) s'ha de tenir en un fitxer .env.local i a Vercel s'ha de tenir les variables posades a la configuració a la secció 'Environment Variables'.

Les privades (escriptura server-side via Admin SDK) les oobtenim configurant la firebase a "Project Settings > Service accounts > Firebase admin SDK" i exportant el JSON.

Les públiques (lectura client-side) les obtenim quan afegim una Web App (icona </>) a la base de dades.

### Publicació a Vercel
Si en local amb `npm run dev` to va bé (es mostra tot bé a htttps://localhost:3000) abans de publicar cal comprovar que en mode producció la web també funciona. Això vol dir fer `npm run build` i quan acaba de compilar totes les pàgines fer `npm start`. El més probable és que el build doni errors si la configuració de variables d'entorn està mal feta. En el moment que el build ja no dongui errors, l'app ja estarà preparada per producció i es podrà publicar a Vercel.

La manera més senzilla és utilitzar GitHub desktop per anar publicant a GitHub les modificacions fetes a la app en local. Aleshores des de la web de GitHub anar a Settings > Apps > Vercel > Configure > [Afegir el repositori]. I després des del Vercel dashboard "New Project" i importar el repositori. En aquest moment es poden posaar les variables d'entorn en la configuració inicial o simplement fer 'Deploy' (el build fallarà) i després a Vercel > Project > Settings > Environment variables afegir totes les del `.env.local` manualment. Els noms (keys) i values seran els maateixos en local i a Vercel. També es pot posar importar el fitxer .env.local directament per no haver d'anar fent Ctrl+C i Ctrl+V per cada variable.
