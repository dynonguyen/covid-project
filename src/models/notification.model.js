const { DataTypes, db } = require('../configs/db.config');
const User = require('./user.model');

const Notification = db.define(
	'Notification',
	{
		notificationId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		createdTime: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
	},
	{ tableName: 'Notification', timestamps: false, initialAutoIncrement: 1 }
);

User.hasMany(Notification, {
	sourceKey: 'userId',
	foreignKey: 'userId',
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE',
});
Notification.belongsTo(User, {
	foreignKey: 'userId',
});

module.exports = Notification;
