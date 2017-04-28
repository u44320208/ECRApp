/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var Expendituretype = sequelize.define('Expendituretype', {
			expendituretypeId: {field: 'expendituretype_id', type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true},
			expendituretype: {field: 'expendituretype', type: DataTypes.STRING, allowNull: false}
		}, 
		{
			tableName: 'tbl_ms_expendituretype',
			timestamps: false,
			underscored: true,
			classMethods: {
				associate: function (models) {
					Expendituretype.hasMany(models.Expenditure, {
						foreignKey: {
						onDelete: "CASCADE",
						name: "expendituretypeId",
						field: "expendituretype_id",
						allowNull: false
						}
					});
				}
			}
		});

	return Expendituretype
};
