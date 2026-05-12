# Urban Traffic Platform - Mini Projet Web Services GraphQL

## Description
Plateforme intelligente de gestion du trafic urbain basée sur une architecture microservices avec une API Gateway GraphQL.

## Architecture

\\\
+-- urban-traffic-platform/
¦   +-- services/
¦   ¦   +-- auth/          # Service Authentification (port 3001)
¦   ¦   +-- vehicles/      # Service Véhicules (port 3002)
¦   ¦   +-- traffic/       # Service Trafic (port 3003)
¦   ¦   +-- incidents/     # Service Incidents (port 3004)
¦   ¦   +-- notifications/ # Service Notifications (port 3005)
¦   ¦   +-- gateway/       # API Gateway GraphQL (port 3000)
¦   +-- frontend/          # Dashboard Next.js (port 3006)
¦   +-- docker-compose.yml
+-- .github/
    +-- workflows/
        +-- ci.yml
\\\

## Technologies
- **Backend**: NestJS, GraphQL, TypeORM
- **Base de données**: PostgreSQL
- **Authentification**: JWT
- **Frontend**: Next.js, Apollo Client
- **Containerisation**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Temps réel**: WebSocket

## Prérequis
- Docker Desktop
- Node.js v20+
- Git

## Installation et Démarrage

### 1. Cloner le repo
\\\ash
git clone https://github.com/iheb137/Mini_Projet_Web_Services_GraphQL.git
cd Mini_Projet_Web_Services_GraphQL
\\\

### 2. Démarrer avec Docker
\\\ash
cd urban-traffic-platform
docker compose up -d --build
\\\

### 3. Accéder à l'application
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3006 |
| Gateway GraphQL | http://localhost:3000/graphql |
| Auth | http://localhost:3001 |
| Vehicles | http://localhost:3002 |
| Traffic | http://localhost:3003 |
| Incidents | http://localhost:3004 |
| Notifications | http://localhost:3005 |

## Services

### 1. Service Authentification
- Inscription des utilisateurs
- Connexion sécurisée avec JWT
- Gestion des rôles: ADMIN, OPERATOR

### 2. Service Véhicules
- Ajouter/consulter des véhicules
- Positions GPS simulées
- Historique des déplacements

### 3. Service Trafic
- Zones de circulation
- Mesure de densité du trafic
- Détection des zones congestionnées

### 4. Service Incidents
- Déclaration d'incidents
- Types: Accident, Travaux, Route fermée, Embouteillage
- Statuts: Signalé, En cours, Résolu

### 5. Service Notifications
- Notifications temps réel via WebSocket
- Marquer comme lu

## Requêtes GraphQL

### Inscription
\\\graphql
mutation {
  register(email: "admin@traffic.com", password: "password123", role: "ADMIN") {
    access_token
    user { id email role }
  }
}
\\\

### Connexion
\\\graphql
mutation {
  login(email: "admin@traffic.com", password: "password123") {
    access_token
    user { id email role }
  }
}
\\\

### Créer un véhicule (authentifié)
\\\graphql
mutation {
  createVehicle(plate: "TN-123-456", type: "CAR", brand: "Toyota", model: "Corolla", ownerId: "USER_ID") {
    id plate brand model
  }
}
\\\

### Créer une zone
\\\graphql
mutation {
  createZone(name: "Centre Ville", centerLat: 36.8189, centerLng: 10.1658, radiusMeters: 500) {
    id name densityLevel
  }
}
\\\

### Créer un incident
\\\graphql
mutation {
  createIncident(title: "Accident", type: "ACCIDENT", latitude: 36.8189, longitude: 10.1658, reportedBy: "USER_ID") {
    id title status
  }
}
\\\

## CI/CD
Le pipeline GitHub Actions effectue automatiquement:
- Installation des dépendances
- Build de tous les services
- Build des images Docker

## Auteur
- **Nom**: Iheb
- **GitHub**: https://github.com/iheb137
