const { DataTypes, db } = require('../configs/db.config');
const ProductPackage = require('./productPackage.model');
const User = require('./user.model');

const ConsumptionHistory = db.define(
	'ConsumptionHistory',
	{
		consumptionHistoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		buyDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		totalPrice: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		tableName: 'ConsumptionHistory',
		timestamps: false,
		initialAutoIncrement: 1,
	}
);

// Foreign key
User.hasMany(ConsumptionHistory, {
	sourceKey: 'userId',
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
ConsumptionHistory.belongsTo(User, { foreignKey: 'userId' });

ProductPackage.hasMany(ConsumptionHistory, {
	sourceKey: 'productPackageId',
	foreignKey: {
		name: 'productPackageId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
ConsumptionHistory.belongsTo(ProductPackage, {
	foreignKey: 'productPackageId',
});

module.exports = ConsumptionHistory;