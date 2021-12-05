const { DataTypes, db } = require('../configs/db.config');
const { ACCOUNT_TYPES, MAX } = require('../constants/index.constant');

const Account = db.define(
	'Account',
	{
		accountId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING(30),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		password: {
			type: DataTypes.STRING(72),
			allowNull: true,
		},
		accountType: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: ACCOUNT_TYPES.USER,
		},
		isLocked: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		failedLoginTime: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
				max: MAX.FAILED_LOGIN_TIME,
			},
		},
	},
	{ tableName: 'Account', timestamps: false, initialAutoIncrement: 1 }
);

module.exports = Account;
