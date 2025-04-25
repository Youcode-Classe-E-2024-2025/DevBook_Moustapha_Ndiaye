// models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Charger depuis config.js
const configObject = require(__dirname + '/../config/config.js');
const config = configObject[env]; // Sélectionner la config de l'environnement
const db = {};

if (!config) {
  console.error(`Configuration error: Environment "${env}" not found in config/config.js`);
  process.exit(1); // Arrêter si la config manque
}

let sequelize;
// Initialiser Sequelize avec les paramètres de config (issus de config.js)
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Charger les modèles du dossier courant
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&         // Pas de fichiers cachés
      file !== basename &&               // Pas index.js lui-même
      file.slice(-3) === '.js' &&        // Doit être un fichier JS
      file.indexOf('.test.js') === -1  // Exclure les tests éventuels
    );
  })
  .forEach(file => {
    // Importer la classe modèle (qui s'initialise elle-même dans son fichier)
    const ModelClass = require(path.join(__dirname, file));
    // Vérifier si c'est une classe Sequelize valide et l'ajouter à db
    if (ModelClass && ModelClass.prototype instanceof Sequelize.Model && ModelClass.name) {
       db[ModelClass.name] = ModelClass;
    } else if (file !== basename) {
       // Optionnel: Avertir si un fichier non-modèle est trouvé
       // console.warn(`File ${file} in models folder does not appear to export a valid Sequelize model.`);
    }
  });

// Appeler la méthode 'associate' de chaque modèle si elle existe
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exporter l'objet db contenant les modèles et la connexion sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;