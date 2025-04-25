const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Book, {
      foreignKey: 'category_id', 
      as: 'books' 
    });
  }
}

Category.init({
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true 
});

module.exports = Category;