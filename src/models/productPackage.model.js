const { DataTypes, db } = require('../configs/db.config');

const ProductPackage = db.define(
	'ProductPackage',
	{
		productPackageId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		productPackageName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		limitedProducts: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
		limitedInDay: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
		limitedInWeek: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
		limitedInMonth: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{ tableName: 'ProductPackage', timestamps: false, initialAutoIncrement: 1 }
);

module.exports = ProductPackage;
