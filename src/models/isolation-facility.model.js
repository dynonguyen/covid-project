const { DataTypes, db } = require('../configs/db.config');
const Address = require('./address.model');

const IsolationFacility = db.define(
	'IsolationFacility',
	{
		isolationFacilityId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		isolationFacilityName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		capacity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		currentQuantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{ tableName: 'IsolationFacility', timestamps: false, initialAutoIncrement: 1 }
);

// Foreign key
Address.hasMany(IsolationFacility, {
	sourceKey: 'addressId',
	foreignKey: {
		name: 'addressId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
IsolationFacility.belongsTo(Address, { foreignKey: 'addressId' });

module.exports = IsolationFacility;
