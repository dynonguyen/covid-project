const { DataTypes, db } = require('../configs/db.config');
const { PAYMENT_TYPES } = require('../constants/index.constant');
const ConsumptionHistory = require('./consumption-history.model');
const User = require('./user.model');

const PaymentHistory = db.define(
	'PaymentHistory',
	{
		paymentHistoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		paymentDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		currentBalance: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		paymentType: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: PAYMENT_TYPES.CONSUME,
		},
		paymentCode: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		totalMoney: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{ tableName: 'PaymentHistory', timestamps: false, initialAutoIncrement: 1000 }
);

// Foreign key
User.hasMany(PaymentHistory, {
	sourceKey: 'userId',
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});
PaymentHistory.belongsTo(User, { foreignKey: 'userId' });

ConsumptionHistory.hasOne(PaymentHistory, {
	sourceKey: 'consumptionHistoryId',
	foreignKey: {
		name: 'consumptionHistoryId',
		allowNull: true,
	},
	onDelete: 'SET NULL',
	onUpdate: 'CASCADE',
});
PaymentHistory.belongsTo(ConsumptionHistory, {
	foreignKey: 'consumptionHistoryId',
});

module.exports = PaymentHistory;
