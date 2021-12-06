const { DataTypes, db } = require('../configs/db.config');
const { MAX } = require('../constants/index.constant');

const AdminAccount = db.define(
	'AdminAccount',
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
	{ tableName: 'AdminAccount', timestamps: false, initialAutoIncrement: 1 }
);

module.exports = AdminAccount;
