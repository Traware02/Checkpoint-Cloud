# Mini Suivi VTC (MERN)

Petite application pour l'exercice de déploiement : saisir les dépenses et gains
journaliers de 3 véhicules, avec une liste et un solde total.

Stack : React (Create React App) + Node/Express + MongoDB (via MongoDB Atlas).

## 1. Lancer le projet en local

### Prérequis
- Node.js installé (version 18 ou plus)
- Un compte MongoDB Atlas (gratuit, sans carte bancaire) avec un cluster créé

### Backend
```bash
cd server
npm install
cp .env.example .env
# Ouvre .env et remplace MONGO_URI par ta vraie chaîne de connexion Atlas
npm run dev
```
Le serveur démarre sur http://localhost:5000

### Frontend
Dans un second terminal :
```bash
cd client
npm install
npm start
```
Le frontend démarre sur http://localhost:3000 et communique avec le backend
via le proxy configuré dans client/package.json (`"proxy": "http://localhost:5000"`).

Teste : ajoute une entrée, vérifie qu'elle apparaît dans la liste, supprime-la.

## 2. Préparer le déploiement

```bash
cd client
npm run build
```
Cela crée un dossier `client/build`. Copie son contenu dans `server/public` :
```bash
# depuis la racine du projet
cp -r client/build server/public
```
Le fichier `server.js` est déjà configuré pour servir ce dossier `public`
quand `NODE_ENV=production`.

## 3. Déployer sur Render (alternative gratuite à Azure)

1. Crée un dépôt GitHub et pousse tout le contenu de ce dossier
   (server/ + client/ + le dossier server/public généré à l'étape 2, une fois qu'il existe).
   Le fichier `server/.gitignore` n'exclut plus `public/`, donc il sera bien
   inclus dans ton push — vérifie sur GitHub que le dossier `server/public`
   apparaît bien après ton `git push`.
2. Crée un compte gratuit sur https://render.com (aucune carte bancaire requise).
3. Dashboard → "New" → "Web Service" → connecte ton dépôt GitHub.
4. Configure :
   - Root Directory : `server`
   - Build Command : `npm install`
   - Start Command : `node server.js`
5. Dans l'onglet "Environment", ajoute les variables :
   - `MONGO_URI` = ta chaîne de connexion MongoDB Atlas
   - `NODE_ENV` = `production`
6. Clique sur "Create Web Service". Render build et déploie automatiquement.
7. Une fois terminé, ouvre l'URL fournie (ex: https://ton-app.onrender.com)
   et teste l'ajout/suppression d'entrées.

## Structure du projet

```
mini-vtc-app/
├── server/          # Backend Express + Mongoose
│   ├── models/Entry.js
│   ├── routes/entries.js
│   ├── server.js
│   └── .env.example
├── client/           # Frontend React (Vite)
│   └── src/
│       ├── App.jsx
│       └── App.css
└── README.md
```
