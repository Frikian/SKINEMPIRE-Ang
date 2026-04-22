const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('skinempire', 'root', 'patata', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const Producte = sequelize.define('Producte', {
  id_producte: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_producte: { type: DataTypes.STRING(45) },
}, { timestamps: false, tableName: 'producte' });

const Compra = sequelize.define('Compra', {
  id_compra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_usuari: { type: DataTypes.STRING(45), allowNull: false },
  data_compra: { type: DataTypes.DATEONLY, allowNull: false },
}, { timestamps: false, tableName: 'compra' });

const ProductesCompra = sequelize.define('ProductesCompra', {
  id_productes_compra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_compra: { type: DataTypes.INTEGER, allowNull: false },
  id_producte: { type: DataTypes.INTEGER, allowNull: false },
  cuantitat: { type: DataTypes.INTEGER },
  preu_unitari: { type: DataTypes.DECIMAL(15, 2) },
  oferta: { type: DataTypes.TINYINT },
}, { timestamps: false, tableName: 'productes_compra' });

const CarritoGuardat = sequelize.define('CarritoGuardat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_usuari: { type: DataTypes.STRING(45), allowNull: false },
  id_producte: { type: DataTypes.INTEGER, allowNull: false },
  cuantitat: { type: DataTypes.INTEGER, allowNull: false },
  expira: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false, tableName: 'carrito_guardats' });

Compra.hasMany(ProductesCompra, { foreignKey: 'id_compra', constraints: false });
ProductesCompra.belongsTo(Compra, { foreignKey: 'id_compra', constraints: false });
ProductesCompra.belongsTo(Producte, { foreignKey: 'id_producte', constraints: false });

sequelize.sync();

sequelize.authenticate()
  .then(() => console.log('Sequelize conectat correctament.'))
  .catch(err => console.error('Error de connexió Sequelize:', err));

module.exports = { sequelize, Producte, Compra, ProductesCompra, CarritoGuardat };
