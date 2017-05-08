
module.exports = function(sequelize, DataTypes) {
	var Expenditure = sequelize.define('Expenditure', {
			expenditureId: {field: 'expenditure_id', type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true},
			expenditureYear: {field: 'expenditure_year', type: DataTypes.INTEGER(4), allowNull: false,},
			expendituretypeId: {field: 'expendituretype_id', type: DataTypes.INTEGER(4), allowNull: false},
			expenditureDetail: {field: 'expenditure_detail', type: DataTypes.TEXT, allowNull: false},
			expenditureText: {field: 'expenditure_text', type: DataTypes.TEXT, allowNull: false},
			expenditureAmount: {field: 'expenditure_amount', type: "DOUBLE", allowNull: false},
			insertName: {field: 'insert_name', type: DataTypes.STRING, allowNull: false, defaultValue: "admin"},
			insertDate: {field: 'insert_date', type: DataTypes.DATE, allowNull: false},
			updateName: {field: 'update_name', type: DataTypes.STRING, allowNull: true},
			updateDate: {field: 'update_date', type: DataTypes.DATE, allowNull: true}
		}, 
		{
			tableName: 'tbl_expenditure',
			timestamps: false,
			underscored: true,
			classMethods: {
				associate: function (models) {
					
					Expenditure.hasMany(models.Expense, {
						foreignKey: {
						onDelete: "CASCADE",
						name: "expenditureId",
						field: "expenditure_id",
						allowNull: false
						}
					});

					Expenditure.belongsTo(models.Expendituretype, {
						onDelete: "CASCADE",
						foreignKey: {
						name: "expendituretypeId",
						field: "expendituretype_id",
						allowNull: false
						}
					});
				}
			}
		});
	return Expenditure
};
