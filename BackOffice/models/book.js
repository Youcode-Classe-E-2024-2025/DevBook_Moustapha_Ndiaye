const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Book extends Model {
  static associate(models) {
    this.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      this.hasMany(models.Loan, {
        foreignKey: 'book_id',
        as: 'loans'          
      });
    //this.hasMany(models.Loan, { foreignKey: 'book_id', as: 'loans' });
  }
}

Book.init({
  book_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
    field: 'ISBN' 
  },
  published_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true 
  },
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
  timestamps: true
});

module.exports = Book;