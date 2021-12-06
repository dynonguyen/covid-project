const { DataTypes, db } = require('../configs/db.config');
const Product = require('./product.model');
const ProductPackage = require('./product-package.model');

const ProductInPackage = db.define(
	'ProductInPackage',
	{
		productInPackageId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		maxQuantity: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
		quantity: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{ tableName: 'ProductInPackage', timestamps: false, initialAutoIncrement: 1 }
);

// Foreign key
Product.hasMany(ProductInPackage, {
	sourceKey: 'productId',
	foreignKey: {
		name: 'productId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE',
});
ProductInPackage.belongsTo(Product, { foreignKey: 'productId' });

ProductPackage.hasMany(ProductInPackage, {
	sourceKey: 'productPackageId',
	foreignKey: {
		name: 'productPackageId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE',
});
ProductInPackage.belongsTo(ProductPackage, { foreignKey: 'productPackageId' });

module.exports = ProductInPackage;
