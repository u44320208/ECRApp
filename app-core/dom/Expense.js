module.exports = function(sequelize, DataTypes) {
	var Expense = sequelize.define('Expense', {
			expenseId: {field: 'expense_id', type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true,},
			expenseYear: {field: 'expense_year', type: DataTypes.INTEGER(4), allowNull: false},
			expenditureId: {field: 'expenditure_id',  type: DataTypes.INTEGER(11), allowNull: false},
			expenseType: {field: 'expense_type', type: DataTypes.CHAR(2), allowNull: false},
			expenseDetail: {field: 'expense_detail', type: DataTypes.TEXT, allowNull: false},
			expenseAmount: {field: 'expense_amount', type: "DOUBLE", allowNull: false},
			expenseApprove: {field: 'expense_approve', type: "DOUBLE", allowNull: false},
			expensePay: {field: 'expense_pay', type: "DOUBLE", allowNull: false, defaultValue: '0'},
			expenseDeducted: {field: 'expense_deducted', type: "DOUBLE", allowNull: false, defaultValue: '0'},
			expenseDate: {field: 'expense_date', type: DataTypes.DATE, allowNull: false},
			expenseReceipt: {field: 'expense_receipt', type: DataTypes.STRING, allowNull: false},
			expenseNote: {field: 'expense_note', type: DataTypes.TEXT, allowNull: true},
			expenseStatus: {field: 'expense_status', type: DataTypes.CHAR(2), allowNull: false},
			insertName: {field: 'insert_name', type: DataTypes.STRING, allowNull: false, defaultValue: "admin"},
			insertDate: {field: 'insert_date', type: DataTypes.DATE, allowNull: false},
			updateName: {field: 'update_name', type: DataTypes.STRING, allowNull: true},
			updateDate: {field: 'update_date', type: DataTypes.DATE, allowNull: true}
		}, 
		{
			tableName: 'tbl_expense',
			timestamps: false,
			underscored: true,
			classMethods: {
				associate: function (models) {
					Expense.belongsTo(models.Expenditure, {
						onDelete: "CASCADE",
						foreignKey: {
						name: "expenditureId",
						field: "expenditure_id",
						allowNull: false
						}
					});
				}
			}
		});
	return Expense
};
