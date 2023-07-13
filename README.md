# challenge 

## Description

Le projet consiste à développer une application web pour gérer un challenge annuel destiné à plusieurs promos d'étudiants. L'application permettra aux étudiants de participer au challenge, de soumettre des tâches, d'obtenir des scores et de suivre leur progression. En tant qu'administrateur, vous pourrez gérer les promos, les étudiants, les tâches et les scores.

## Documentation de l'architecture du projet
L'architecture du projet est conçue pour répondre aux besoins spécifiques du challenge, en fournissant une séparation claire entre le frontend et le backend. Voici une vue d'ensemble de l'architecture logicielle du projet.

### Backend API
Le backend API est développé en utilisant Node.js, Typescript et Express.js. Il est entièrement indépendant du frontend et fournit des services API pour gérer les promos, les étudiants, les scores et les tâches du challenge.

Le backend suit une architecture en couches pour une meilleure modularité et maintenabilité :

> #### Routes : 
> Les routes définissent les endpoints de l'API et les actions correspondantes à effectuer lorsqu'une requête est reçue.
> #### Middlewares : 
> Les middlewares sont des fonctions intermédiaires qui sont exécutées avant ou après le traitement des routes. Ils permettent de gérer des aspects transversaux tels que l'authentification, l'autorisation, la validation des données, etc.
> #### Controllers : 
> Les controllers gèrent la logique métier de l'API en traitant les requêtes, en interagissant avec les services appropriés et en renvoyant les réponses.
> #### Services : 
> Les services encapsulent la logique métier de l'application et interagissent avec la base de données pour récupérer et manipuler les données.
> #### Base de données : 
> Une base de données MySQL est utilisée pour stocker les données des promos, des étudiants, des scores et des tâches.
> #### Authentification et Autorisation : 
> Les JWT sont utilisés pour gérer l'authentification des utilisateurs et s'assurer que seuls les utilisateurs autorisés peuvent accéder à certaines fonctionnalités.
Le backend est déployé à l'aide d'un conteneur Docker, ce qui facilite le déploiement et la gestion de l'application sur différents environnements.

### Frontend
Le frontend est développé à l'aide de la technologie React et communique avec le backend via des requêtes HTTP pour récupérer et envoyer des données. Le frontend est hébergé sur un hébergeur gratuit tel que Firebase.

Le frontend permet aux étudiants de se connecter, de créer un compte via un lien magique et de lancer le challenge. Il affiche également les scores de la promo sous forme de tableau visuel et permet de les télécharger au format Excel. L'interface utilisateur est conçue de manière conviviale et intuitive pour faciliter la participation des étudiants.

### Base de données
Une base de données MySQL est utilisée pour stocker les données des promos, des étudiants, des scores et des tâches. Le schéma de la base de données est conçu pour garantir l'intégrité des données et prévenir toute modification ou interférence indésirable. Les contraintes et les clés étrangères sont utilisées pour assurer la cohérence des données.

### Sécurité
La sécurité est une préoccupation majeure dans le projet. Des mesures de sécurité telles que l'authentification JWT et la validation des autorisations sont mises en place pour empêcher tout accès non autorisé à l'API ou à la base de données. Les utilisateurs doivent s'authentifier pour participer au challenge et seuls les utilisateurs autorisés peuvent accéder aux fonctionnalités d'administration.

### Connexion SSH
Le projet utilise la bibliothèque ssh2 pour établir des connexions SSH à partir du serveur API vers une autre instance. Cette fonctionnalité permet de se connecter à l'instance du challenge, d'exécuter des tâches et de valider les résultats. Les erreurs renvoyées par l'instance de test sont transmises à l'étudiant pour qu'il puisse les comprendre et les corriger.

### Middlewares
Les middlewares jouent un rôle essentiel dans le backend API. Voici quelques exemples de middlewares utilisés dans le projet :

> #### Middleware d'authentification : 
> Vérifie la validité du JWT envoyé par l'utilisateur, permettant ainsi de sécuriser les endpoints nécessitant une authentification.
> #### Middleware d'autorisation : 
> Vérifie les droits d'accès de l'utilisateur aux ressources demandées, en fonction de son rôle et des autorisations définies.
> #### Middleware de validation des données : 
> Valide les données envoyées par l'utilisateur, s'assurant qu'elles respectent les règles définies (par exemple, format de l'email, longueur minimale du mot de passe, etc.).
> #### Middleware de logging : 
> Enregistre les informations de journalisation pour suivre les requêtes, les erreurs et les actions importantes effectuées par l'API.

Ces middlewares contribuent à la sécurité, à la validation des données et à la traçabilité des actions effectuées dans l'application.

### Documentation et Logging
Le backend API est accompagné d'une documentation complète pour faciliter son utilisation et sa maintenance. La documentation décrit chaque endpoint, les paramètres acceptés, les réponses renvoyées et les erreurs possibles. De plus, un système de logging est mis en place pour enregistrer les événements importants, les erreurs et les actions effectuées par l'application.

Le code fourni dans ce projet met en œuvre les fonctionnalités essentielles pour répondre aux besoins spécifiques du challenge. Cependant, assurez-vous de personnaliser et d'adapter le code en fonction de vos besoins spécifiques et des meilleures pratiques de développement.

## Instructions d'utilisation

Le projet est concu pour un VSCode Dev Container. Relancez le projet dans un DevContainer, et ouvrez un terminal.

Avant de lancer le serveur il faut d'abord préparer la base de données 

```bash
mycli -h dbms -u root < ./dbms/ddl/init.sql
mycli -h dbms -u root < ./dbms/ddl/ddl.sql
```

Ensuite, on peut lancer le serveur avec :

```bash
npm run server
```

## Tests Postman

Un export des tests pour Postman se trouve dans [./src/test/postman/api.postman_collection.json](./src/test/postman/api.postman_collection.json)
