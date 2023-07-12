import Express, { json } from "express";
import swaggerUi from "swagger-ui-express";
import { DefaultErrorHandler } from "./middleware/error-handler.middleware";
import { RegisterRoutes } from './routes/routes';
import { requestLogMiddleware } from "./utility/Logging/log.middleware";
require('dotenv').config();
import cors from 'cors';
const path = require('path');

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();
// L'appli parse le corps du message entrant comme du json
app.use(json());

// Utilisez le middleware CORS
app.use(cors());

// Chemin vers le dossier de build de l'application React
const buildPath = path.join(process.cwd(), 'client', 'build');

// Utiliser un middleware pour créer des logs
app.use(requestLogMiddleware('req'));
// Définissez la route de base pour le préfixe "/api"
RegisterRoutes(app);



// Servir les fichiers statiques de l'application React depuis la racine
app.use(Express.static(buildPath));



// Ajouter une route qui sert la documentation swagger
app.use(Express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// Renvoyer index.html pour toutes les autres routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);

// Lancer le serveur
app.listen(PORT, () => {
  console.info("API Listening on port " + PORT);
});
