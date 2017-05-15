/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var Users = sequelize.define('tblMsUsers', {
            userId: {field: 'user_id', type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
            firstName: {field: 'first_name', type: DataTypes.STRING, allowNull: false},
            lastName: {field: 'last_name', type: DataTypes.STRING, allowNull: false},
            email: {field: 'email', type: DataTypes.STRING, allowNull: false},
            username: {field: 'username', type: DataTypes.STRING, allowNull: false},
            password: {field: 'password', type: DataTypes.STRING, allowNull: false},
            userRole: {field: 'user_role', type: DataTypes.CHAR(2), allowNull: false},
            userStatus: {field: 'user_status', type: DataTypes.CHAR(2), allowNull: false},
            createBy: {field: 'createBy', type: DataTypes.STRING, allowNull: false, defaultValue: "admin"},
            createDate: {field: 'createDate', type: DataTypes.DATE, allowNull: false},
            updateBy: {field: 'updateBy', type: DataTypes.STRING, allowNull: true, defaultValue: "admin"},
            updateDate: {field: 'updateDate', type: DataTypes.DATE, allowNull: true}
        },
        {
            tableName: 'tbl_ms_users',
            timestamps: false,
			underscored: true,
			classMethods: {
				associate: function (models) {
					
				}
			}
	});
    return Users
};
