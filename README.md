# n8n-nodes-flowtly

Ce node permet d'intégrer Flowtly avec n8n. Il offre les fonctionnalités suivantes :

- Authentification avec l'API Flowtly
- Récupération des organisations
- Gestion des tokens JWT

## Installation

```bash
npm install n8n-nodes-flowtly
```

## Configuration

1. Dans n8n, ajoutez un nouveau node Flowtly
2. Configurez les credentials avec votre email et mot de passe Flowtly
3. Sélectionnez l'opération souhaitée (Login, Get Organizations, etc.)

## Opérations disponibles

### Login
Authentifie l'utilisateur et retourne un token JWT.

### Get Organizations
Récupère la liste des organisations accessibles avec le token JWT.

## Développement

```bash
# Installation des dépendances
npm install

# Compilation
npm run build

# Tests
npm run test
```

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

## Licence

MIT 