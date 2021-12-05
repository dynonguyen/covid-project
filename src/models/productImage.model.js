const { DataTypes, db } = require('../configs/db.config');
const Product = require('./product.model');

const ProductImage = db.define(
	'ProductImage',
	{
		productImageId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		src: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isThumbnail: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{ tableName: 'ProductImage', timestamps: false, initialAutoIncrement: 1 }
);

// Foreign key
Product.hasMany(ProductImage, {
	sourceKey: 'productId',
	foreignKey: {
		name: 'productId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE',
});
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

module.exports = ProductImage;
