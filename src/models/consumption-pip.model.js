const { DataTypes, db } = require('../configs/db.config');
const ConsumptionHistory = require('./consumption-history.model');
const ProductInPackage = require('./product-in-package.model');

const ConsumptionPIP = db.define(
	'ConsumptionPIP',
	{
		consumptionPIPId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{
		tableName: 'ConsumptionPIP',
		timestamps: false,
		initialAutoIncrement: 1000,
	}
);

// Foreign key
ConsumptionHistory.hasMany(ConsumptionPIP, {
	sourceKey: 'consumptionHistoryId',
	foreignKey: {
		name: 'consumptionHistoryId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
ConsumptionPIP.belongsTo(ConsumptionHistory, {
	foreignKey: 'consumptionHistoryId',
});

ProductInPackage.hasMany(ConsumptionPIP, {
	sourceKey: 'productInPackageId',
	foreignKey: {
		name: 'productInPackageId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
ConsumptionPIP.belongsTo(ProductInPackage, {
	foreignKey: 'productInPackageId',
});

module.exports = ConsumptionPIP;
