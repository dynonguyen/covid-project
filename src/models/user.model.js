const { DataTypes, db } = require('../configs/db.config');
const { DEFAULT, STATUS_F } = require('../constants/index.constant');
const Account = require('./account.model');
const Address = require('./address.model');

const User = db.define(
	'User',
	{
		userId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		fullname: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		peopleId: {
			type: DataTypes.STRING(12),
			allowNull: true,
		},
		DOB: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: new Date(DEFAULT.USER_DOB),
		},
		statusF: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: STATUS_F.F0,
		},
	},
	{ tableName: 'User', timestamps: true, initialAutoIncrement: 1 }
);

// Foreign key
Account.hasMany(User, {
	sourceKey: 'accountId',
	foreignKey: 'managerId',
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
User.belongsTo(Account, {
	foreignKey: 'managerId',
	as: 'manager',
});

Account.hasOne(User, {
	sourceKey: 'accountId',
	foreignKey: {
		name: 'accountId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
User.belongsTo(Account, {
	foreignKey: 'accountId',
	as: 'account',
});

Address.hasOne(User, {
	sourceKey: 'addressId',
	foreignKey: {
		name: 'addressId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
User.belongsTo(Address, {
	foreignKey: 'addressId',
});

module.exports = User;
