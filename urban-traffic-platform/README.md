# Urban Traffic Platform

Une plateforme complète et modulaire d'analyse et de gestion du trafic urbain.

## 🌟 Architecture (Microservices + GraphQL Gateway + Next.js)

Le projet utilise une architecture orientée microservices (NestJS) interagissant via une API Gateway GraphQL (Apollo), accompagnés d'un Dashboard en Next.js.
Un système d'événements et de sockets (Service Notifications) s'occupe du temps réel.

### Composants :
- **Gateway GraphQL** (Port 3000) : Expose toutes les requêtes/mutations GraphQL.
- **Service Auth** (Port 3001) : Gestion des utilisateurs (JWT, TypeORM/Postgres).
- **Service Vehicles** (Port 3002) : Gestion des véhicules de la flotte.
- **Service Traffic** (Port 3003) : Analyse du trafic (capteurs, flux).
- **Service Incidents** (Port 3004) : Déclaration et gestion des accidents ou travaux.
- **Service Notifications** (Port 3005) : WebSockets pour les alertes en temps réel (Socket.IO).
- **Frontend** (Port 3006) : Dashboard administrateur Next.js (App router, Tailwind, Apollo Client, Reat-Leaflet).


## 🛠 Prérequis

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) & Docker Compose
- [npm](https://www.npmjs.com/)

## 🚀 Installation

Si vous utilisez le CLI, les dépendances sont automatiquement installées dans chaque dossier (ou exécutez `npm install` dans chaque sous-dossier de la plateforme).

## 🐳 Démarrage avec Docker

```bash
cd urban-traffic-platform
docker-compose up --build
```
Les bases de données PostgreSQL indépendantes et les services démarreront de manière ordonnée.

## 🧑‍💻 Démarrage en dev (Local)

Pour développer sur un service spécifique (ex: auth) :
1. Démarrez sa base de données depuis docker-compose (`docker-compose up -d db-auth`)
2. `cd services/auth`
3. `cp .env.example .env` (ajuster si nécessaire)
4. `npm run start:dev`

## 🔑 Variables d'Environnement (.env.example)
Chaque service contient un `.env.example` avec :
- `PORT=300X`
- `DATABASE_URL=postgres://user:password@localhost:5432/db`
- `JWT_SECRET=super_secret_dev` (si applicable)

## 📍 Routes de base de l'Application (Dev)
- GraphQL Playground: http://localhost:3000/graphql
- Dashboard Frontend: http://localhost:3006

## CI/CD Secrets
Configure the following secrets in your GitHub repository to enable the CI/CD pipeline:
- **DOCKERHUB_USERNAME**: Your Docker Hub username (for pushing images)
- **DOCKERHUB_TOKEN**: Docker Hub token or password
- **PROD_SSH_KEY**: The private SSH key to access the production server
- **PROD_HOST**: Hostname or IP address of the production server
- **PROD_USER**: User for SSH access to the production server

