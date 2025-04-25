// models/loan.js
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin

class Loan extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Un emprunt appartient à UN livre (Loan -> Book)
    this.belongsTo(models.Book, {
      foreignKey: 'book_id', // La clé étrangère est dans la table 'loans'
      as: 'book'             // Alias pour accéder au livre depuis un emprunt (loan.book)
    });

    // Un emprunt appartient à UN utilisateur (membre) (Loan -> User)
    this.belongsTo(models.User, {
      foreignKey: 'member_id', // La clé étrangère est dans la table 'loans'
      as: 'member'            // Alias pour accéder au membre depuis un emprunt (loan.member)
    });
  }
}

Loan.init({
  // Attributs du modèle (correspondent aux colonnes)
  loan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  book_id: { // Clé étrangère vers Book
    type: DataTypes.INTEGER,
    allowNull: false
    // Pas besoin de 'references' ici, géré par l'association belongsTo
  },
  member_id: { // Clé étrangère vers User
    type: DataTypes.INTEGER,
    allowNull: false
    // Pas besoin de 'references' ici, géré par l'association belongsTo
  },
  date_borrowed: {
    type: DataTypes.DATEONLY, // Correspond au type DATE SQL
    allowNull: false
    // Rappel: Nous avons retiré le defaultValue de la DB,
    // il faudra le gérer dans le code applicatif lors de la création.
  },
  date_returned: {
    type: DataTypes.DATEONLY,
    allowNull: true // Peut être null si le livre n'est pas encore retourné
  },
  // createdAt et updatedAt gérés par Sequelize (timestamps: true)
}, {
  sequelize,
  modelName: 'Loan',
  tableName: 'loans', // Nom de la table dans la BDD
  timestamps: true   // Sequelize gère createdAt et updatedAt
});

module.exports = Loan;