# SANAA (صَنْعة) — Protected Educational Video Streaming Platform

> **LMS & Streaming Vidéo Sécurisé sous DRM Matériel avec Authentification Google OAuth 2.0 et Système d'Approbation de Paiement Multi-Canal.**

---

## 🏛️ Vue d'Ensemble & Vision Architectural

**SANAA (صَنْعة)** est la plateforme de formation et de masterclass exclusive fondée par le réalisateur et producteur exécutif **Abdelilah Bhihi**. 

L'architecture est entièrement découplée (**Decoupled Architecture**) :
1. **Showcase / Portfolio** : Développé sous [Astro](https://astro.build) pour un référencement naturel maximal (SEO), un chargement ultra-rapide (SSG) et des animations cinématiques.
2. **Plateforme Membre (Ce Dépôt)** : Application Web Fullstack indépendante conçue pour offrir une sécurité vidéo de niveau entreprise (**Hollywood / Netflix Grade Anti-Piracy**), une authentification sans mot de passe via Google, et une gestion des souscriptions adaptée au marché marocain et international.

---

## 🛠️ Stack Technologique (Tech Stack)

### 1. Frontend (Client SPA)
* **Framework** : [React 19](https://react.dev) bootstrapé avec [Vite](https://vitejs.dev) (Single Page Application réactive).
* **Styling** : [Tailwind CSS](https://tailwindcss.com) avec thème Dark Cinema sur mesure (`#0d0d0d`, `#161616`).
* **Routing** : `react-router-dom` v6.
* **Authentification** : `@react-oauth/google` (Google Identity Services / One-Tap & Sign in with Google).
* **Lecteur Vidéo Sécurisé** : VdoCipher Web SDK / EME Player avec couche **Canvas Watermark Dynamique** en temps réel.
* **Icons** : `lucide-react`.

### 2. Backend (API REST)
* **Runtime** : [Node.js](https://nodejs.org) (v22+ LTS).
* **Framework Web** : [Express.js](https://expressjs.com).
* **Sécurité & Auth** :
  * `google-auth-library` : Validation cryptographique des tokens Google ID côté serveur.
  * `jsonwebtoken` (JWT) : Gestion des sessions stateless et des rôles utilisateurs (RBAC: `STUDENT`, `ADMIN`).
  * `helmet` & `cors` : Protection contre les vulnérabilités web et filtrage des origines.
* **Gestion des Fichiers** : `multer` (Upload sécurisé des bordereaux et reçus de paiement bancaire).
* **DRM Broker** : Client sécurisé communiquant avec l'API VdoCipher pour la génération de clés éphémères (OTP).

### 3. Base de Données & Stockage
* **Base de données relationnelle** : **PostgreSQL** (hébergée sur [Supabase](https://supabase.com)).
* **Stockage de fichiers** : Bucket chiffré pour les reçus de paiement et ressources PDF.

---

## 🛡️ Architecture Anti-Piratage & DRM (Netflix-Grade Security)

L'un des défis majeurs résolus dans ce projet est l'interdiction absolue de téléchargement et d'enregistrement illégal des cours :

1. **Chiffrement CENC (Common Encryption)** :
   * Les flux vidéo sont encodés en segments cryptés DASH et HLS.
   * Aucune URL directe `.mp4` n'existe ; les outils de sniffing réseau comme **IDM (Internet Download Manager)** ou les extensions de navigateur ne peuvent rien télécharger d'exploitable.
2. **DRM Matériel (Hardware-Level EME)** :
   * Prise en charge officielle de **Google Widevine DRM** (Chrome, Android, Edge) et **Apple FairPlay** (Safari, iOS, macOS).
   * Le décryptage s'opère dans le pipeline matériel sécurisé du processeur graphique (GPU / TEE).
   * **Effet Écran Noir (Black Screen)** : Toute tentative d'enregistrement d'écran (OBS, QuickTime, outils de capture mobile iOS/Android) génère un flux d'images totalement noir.
3. **Filigrane Dynamique Forensique (Dynamic Moving Watermark)** :
   * En superposition continue sur la vidéo, un script calcule et déplace un filigrane semi-transparent toutes les 5 secondes.
   * Données affichées : **Adresse Gmail officielle de l'étudiant** + **Numéro de téléphone** + **IP et Horodatage**.
   * Effet dissuasif absolu : Impossible de filmer l'écran avec un smartphone externe sans compromettre définitivement son identité et risquer des poursuites judiciaires.

---

## 💳 Modèle de Paiement & Workflow d'Approbation

Adapté aux réalités du marché marocain et des souscriptions internationales :

```
[Visiteur] ──> [Connexion 1-Clic Google] ──> [Lead Capturé en BDD]
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
         [Option A: Virement CIH / CashPlus]                           [Option B: PayPal International]
                       │                                                             │
        [Upload du bordereau / reçu]                                    [Paiement instantané en ligne]
                       │                                                             │
          (Statut: PENDING_APPROVAL)                                           (Statut: ACTIVE)
                       │                                                             │
          [Notification à l'Admin]                                             [Accès Direct aux Cours]
                       │
       [Validation 1-Clic par l'Admin]
                       │
               (Statut: ACTIVE)
                       │
        [Notification WhatsApp & Email]
```

---

## 📁 Structure du Projet

```text
sanaa-platform/
├── client/                     # Application Frontend React (Vite SPA)
│   ├── src/
│   │   ├── components/         # Composants réutilisables (Navbar, DRMPlayer, Watermark, etc.)
│   │   ├── pages/              # Vues (Login, Catalog, Watch, AdminDashboard)
│   │   ├── hooks/              # Custom Hooks (useAuth, useCourse)
│   │   └── services/           # Configuration Axios et appels API
│   └── package.json
│
└── server/                     # Serveur Backend Node.js (Express REST API)
    ├── src/
    │   ├── config/             # Variables d'environnement & configuration
    │   ├── controllers/        # Logique des routes (Auth, Subscriptions, Videos, Admin)
    │   ├── middlewares/        # Sécurité JWT, RBAC, et gestion d'upload Multer
    │   ├── routes/             # Endpoints REST de l'application
    │   ├── services/           # Intégrations tierces (Google OAuth, VdoCipher DRM, DB)
    │   └── index.js            # Point d'entrée de l'API
    ├── uploads/                # Stockage local protégé des reçus
    └── package.json
```

---

## 🚀 Guide de Démarrage en Local

### Prérequis
* Node.js v22+
* Compte Google Cloud Console (pour les identifiants OAuth 2.0)
* Base de données PostgreSQL (ou projet Supabase gratuit)

### 1. Démarrer le Serveur Backend
```bash
cd server
npm install
cp .env.example .env     # Renseigner vos clés d'API
npm run dev              # Écoute sur http://localhost:5000
```

### 2. Démarrer le Client Frontend
```bash
cd client
npm install
npm run dev              # Écoute sur http://localhost:5173
```

---

## 📄 Licence & Droits d'Auteur
© 2026 Abdelilah Bhihi Studio. Tous droits réservés.
Architecture logicielle conçue et implémentée sous les normes industrielles de génie logiciel.
