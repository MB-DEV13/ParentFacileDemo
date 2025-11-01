# 🌿 ParentFacile

**ParentFacile** est une application web qui centralise les démarches parentales (grossesse → 3 ans), les **documents PDF utiles** et un **espace administrateur** sécurisé pour gérer les contenus et les messages.

---

## 🧭 Sommaire

1. 🚀 Aperçu du projet  
2. 🧱 Architecture (structure réelle du repo)  
3. 🛠️ Stack technique  
4. ⚙️ Installation & configuration  
5. 🗄️ Installation de la base de données (SQL)  
6. 🔐 Authentification Admin  
7. 📨 Formulaire de contact  
8. 📚 API REST (extrait)  
9. 🚢 Déploiement  
10. 💡 Améliorations futures  
11. 📜 Licence  

---

## 🚀 Aperçu du projet

- **Frontend** (React + Vite) : pages Accueil, Parcours/Informations, Documents (aperçu + téléchargement individuel / ZIP), Contact, Login Admin, Dashboard.  
- **Backend** (Node + Express + MySQL) : API REST, gestion de documents PDF, messagerie, envoi d’emails via SMTP, authentification admin par **JWT** stocké en **cookie HttpOnly**.

---

## 🧱 Architecture (structure réelle)

```
.
├── backend-node/                 # API Express + MySQL
│   ├── SQL/                      # Scripts SQL (structure + données)
│   │   ├── parentfacile_schema.sql
│   │   └── parentfacile_seed.sql
│   ├── public/
│   │   └── pdfs/                 # Fichiers PDF servis en statique
│   ├── src/
│   │   └── routes/               # admin.auth.js, admin.docs.js, admin.messages.js, docs.js
│   ├── .env                      # Variables d'environnement du backend
│   └── server.js                 # Entrée serveur (Express)
│
├── public/                       # Frontend public (Vite)
├── src/                          # Frontend source (pages, components, hooks, services, utils)
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── ...
├── .env                          # (optionnel) variables pour le frontend si nécessaire
├── index.html                    # Entrée Vite
├── package.json                  # Dépendances du frontend
└── README.md
```

---

## 🛠️ Stack technique

**Frontend** : React 18, Vite, React Router, Tailwind CSS v4, Axios  
**Backend** : Node.js, Express, MySQL2 (Promise), Nodemailer, jsonwebtoken, bcrypt, cookie-parser, express-rate-limit, helmet, cors, morgan  
**BDD** : MySQL/MariaDB (utf8mb4), stockage des PDF dans `backend-node/public/pdfs/`

---

## ⚙️ Installation & configuration

### 1) Cloner le dépôt
```bash
git clone https://github.com/ton-utilisateur/parentfacile.git
cd parentfacile
```

### 2) Installer les dépendances

**Backend :**
```bash
cd backend-node
npm install
```

**Frontend :**
```bash
cd ..
npm install
```

### 3) Configurer les variables d’environnement (backend)

Créer le fichier `backend-node/.env` (exemple) :
```dotenv
# --- API ---
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5174

# --- MySQL ---
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=parentfacile

# --- SMTP ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=VOTRE_ADRESSE@gmail.com
SMTP_PASS=MDP_APPLICATION_GMAIL
SMTP_FROM="ParentFacile - VOTRE_ADRESSE@gmail.com"
CONTACT_TO=VOTRE_ADRESSE@gmail.com

# --- Auth Admin ---
ADMIN_JWT_SECRET=une_chaine_random_longue_inchangeable_en_prod
ADMIN_COOKIE_NAME=admintoken
ADMIN_COOKIE_SECURE=false

# --- Admin initial ---
ADMIN_SEED_EMAIL=admin@parentfacile.fr
ADMIN_SEED_PASSWORD=Admin1234!
```

> 🔐 Pour Gmail : active la **2FA** et crée un **mot de passe d’application** → à mettre dans `SMTP_PASS`.

---

## 🗄️ Installation de la base de données (SQL)

Les scripts SQL sont dans **`backend-node/SQL/`**.

1. Importer la **structure + création BDD** :  
   ```sql
   SOURCE backend-node/SQL/parentfacile_schema.sql;
   ```

2. Importer le **contenu de départ** :  
   ```sql
   SOURCE backend-node/SQL/parentfacile_seed.sql;
   ```

> Le compte admin **seed** est créé automatiquement (ou détecté s’il existe).

---

## ▶️ Démarrer

**Backend :**
```bash
cd backend-node
node server.js
# API => http://localhost:4000
```

**Frontend :**
```bash
cd ..
npm run dev
# Front => http://localhost:5174
```

> Au démarrage du backend, tu devrais voir :  
> `MySQL OK: tables ... prêtes` et `SMTP OK: prêt à envoyer des emails`

---

## 🔐 Authentification Admin

- **POST** `/api/admin/auth/login` → connexion (JWT émis, stocké en cookie HttpOnly)  
- **POST** `/api/admin/auth/logout` → déconnexion (clear cookie)  
- **GET** `/api/admin/auth/me` → qui suis‑je ?

> En admin : **créer/éditer/supprimer des documents PDF**, **lire et répondre** aux messages du contact.

---

## 📨 Formulaire de contact

- **POST** `/api/contact` → enregistre le message en base + envoie un email à `CONTACT_TO`.  
- Protections : **express-validator**, honeypot anti‑bot, **rate‑limit**.

---

## 📚 API REST (extrait)

| Méthode | Route | Description |
|---|---|---|
GET | `/api/docs` | Liste paginée des documents
GET | `/api/docs/:id/download` | Téléchargement d’un PDF
POST | `/api/contact` | Envoi d’un message
POST | `/api/admin/auth/login` | Connexion admin
POST | `/api/admin/auth/logout` | Déconnexion
GET | `/api/admin/auth/me` | Vérification session
GET | `/api/admin/messages` | Derniers messages
GET | `/api/admin/messages/all` | Tous les messages (cap)
POST | `/api/admin/docs` | Création d’un document (upload)
DELETE | `/api/admin/docs/:id` | Suppression d’un document

---

## 🚢 Déploiement

- **Frontend** : Netlify / Vercel (build Vite)  
- **Backend** : Render / Railway (Node + MySQL)  
- **BDD** : MySQL gérée par la même plateforme si possible (moins de services).

---

## 📜 Licence

© 2025 **ParentFacile** – MBDev  
Usage pédagogique & personnel