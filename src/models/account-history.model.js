const { DataTypes, db } = require('../configs/db.config');
const Account = require('./account.model');

const AccountHistory = db.define(
	'AccountHistory',
	{
		accountHistoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		activity: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		createdDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
	},
	{ tableName: 'AccountHistory', timestamps: false, initialAutoIncrement: 1000 }
);

// Foreign key
Account.hasMany(AccountHistory, {
	sourceKey: 'accountId',
	foreignKey: {
		name: 'accountId',
		allowNull: false,
	},
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});
AccountHistory.belongsTo(Account, {
	foreignKey: 'accountId',
});

module.exports = AccountHistory;
