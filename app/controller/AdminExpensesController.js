const AbstractController = require('./AbstractPublicController');
const { ecrappConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class AdminExpensesController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      let tracer = this.trace(req.processInfo.tracking, null)

      if (_.eq(req.method, 'GET')) {
          let cmd = _(req.params.cmd || null).value()
          let expenseId = _(req.params.expenseId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expenseId = ', expenseId)

          if (_.isNull(cmd)) {
            return models.Expenditure.findAll({attributes: ['expenditureId','expenditureDetail','expenditureYear'],order: 'expenditureDetail ASC'})
              .then((_expenditure)=> {
                return Promise.resolve(models.Expense.findAll({attributes: ['expenseYear'],group: 'expenseYear',order: 'expenseYear DESC'}))
                  .then((_expenseYear)=> {
                    return Promise.resolve(res.render('admin/expenses',{EXPENDITURE: _expenditure, EXPENSEYEAR : _expenseYear, EXPENSETYPE: ecrappConstants.EXPENSETYPE}))
                  })
              })
          }

          if (_.eq(cmd, 'list-expenses')) {
              return this.getExpenses(req, res)
          }else if (_.eq(cmd, 'detail-expenses')) {
              if(!_.isNull(expenseId)){
                  return this.getExpensesById(req, res, expenseId)
              }
          }

          return res.send("No Page Found!!");
          
      }else if(_.eq(req.method, 'POST')){
          let cmd = _(req.params.cmd || null).value()
          let expenseId = _(req.params.expenseId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expenseId = ', expenseId)

          if (_.isNull(cmd)) {
              return this.addExpenses(req, res);
          }else if(_.eq(cmd, 'update-expenses')) {
              if(!_.isEmpty(expenseId)){
                  return this.updateExpensesById(req, res, expenseId);
              }
          }
          return res.send("No Page Found!!");

      }else if(_.eq(req.method, 'DELETE')){
          let expenseId = _(req.params.expenseId || null).value()
          tracer.log('=====> expenseId = ', expenseId)

          if (!_.isNull(expenseId)) {
              return this.deleteExpensesById(req, res, expenseId)
          }else{
              return res.send("What do u want to do??");
          } 
      }
  }

  getExpenses(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    let expenseYear = req.query.expenseYear

    if(!_.isNull(expenseYear)){

      let _start       = _(req.query.start || 0).value()
      let _length      = _(req.query.length || 0).value()

      let _orderColum  = req.query.order[0].column;
      let _orderBy     = req.query.order[0].dir;
      let _orderName   = req.query.columns[_orderColum].name;

      let _where       = {}
      let _include     = [{model: models.Expenditure}]
      let _order       = [['expenseId','DESC']]

      if(_.isEmpty(req.query.search.value)){
        _where = {  expenseYear : expenseYear }
      }else{
        _where = { 
            expenseYear : expenseYear,
            $or: [
              { expenseReceipt : {$like: '%' + req.query.search.value + '%'} },
              { expenseAmount : {$like: '%' + req.query.search.value + '%'} },
              { expenseDetail : {$like: '%' + req.query.search.value + '%'} },
            ],
          }
      }

      _length     = _.parseInt(_length)
      _start      = _.parseInt(_start)
      _order      = [[_orderName, _orderBy]]

      return models.Expense.findAndCountAll({
          include: _include,
          limit: _.parseInt(_length),
          offset: _.parseInt(_start),
          order: _order,
          where: _where
        })
        .then(_expenses => {
          let resp =  {
            recordsTotal: _expenses.count,
            recordsFiltered: _expenses.count,
            data: []
          }

          _.forEach(_expenses.rows, function (_expenses, idx) {

              let btnEdit = '<i class="material-icons search-icon icon-expenses-detail" data-idx="'+ _expenses.expenseId +'">search</i>'
              let expenseDate = _expenses.expenseDate.toISOString()

              if(!_.isNull(expenseDate)){
                  expenseDate = expenseDate.slice(0, 10).split('-');
                  expenseDate = expenseDate[0]+'-'+expenseDate[1]+'-'+expenseDate[2]
              }
              _expenses.expenseType = _.find(ecrappConstants.EXPENSETYPE, {typeId : _expenses.expenseType})
              _expenses.expenseStatus = _.find(ecrappConstants.EXPENSESTATUS, {typeId : _expenses.expenseStatus})

              let dataRow = [
                  idx+1,
                  _expenses.expenseId,
                  _expenses.expenseYear,
                  _expenses.expenseReceipt,
                  expenseDate,
                  _expenses.expenditureId,
                  _expenses.Expenditure.expenditureDetail,
                  _expenses.expenseType.typeName,
                  _expenses.expenseAmount,
                  _expenses.expenseDetail,
                  _expenses.expenseStatus.typeName,
                  btnEdit,
              ]

              resp.data.push(dataRow)
          })
          return res.json(resp)
        })
    }
  }

  getExpensesById(req, res, expenseId){
    let tracer = this.trace(req.processInfo.tracking, null)

    return models.Expense.findOne({
      where: { expenseId: expenseId }
    })
      .then((expense)=>{
            let resp = {
                status: 200,
                title: 'success',
                data: expense
                }
            return res.send(resp)
        })
        .finally(tracer.endDetach())
  }

  addExpenses(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let expenseObj = {
      expenseId: req.body.expenseId,
      expenseYear: req.body.expenseYear,
      expenditureId: req.body.expenditureId,
      expenseType: req.body.expenseType,
      expenseDetail: req.body.expenseDetail,
      expenseAmount: req.body.expenseAmount,
      expenseApprove: req.body.expenseApprove,
      expenseDate: req.body.expenseDate,
      expenseReceipt: req.body.expenseReceipt,
      expenseStatus: req.body.expenseStatus,
      insertName: 'session.userName',
      insertDate: dateFormat(nowDate, 'isoDateTime'),
      updateName: 'session.userName',
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Expense.create(expenseObj)
      .then((result) => {
        let resp = {
          status: 200,
          title: 'success',
          message: 'เพิ่มข้อมูลกะการทำงานสำเร็จ'
        }
        return res.send(resp)
      })
      .catch((err) => {
        tracer.log("ERROR : ", err)
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expenseObj)]))
      })
      .finally(tracer.endDetach())
  }

  updateExpensesById(req, res, expenseId){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let expenseObj = {
      expenseId: req.body.expenseId,
      expenseYear: req.body.expenseYear,
      expenditureId: req.body.expenditureId,
      expenseType: req.body.expenseType,
      expenseDetail: req.body.expenseDetail,
      expenseAmount: req.body.expenseAmount,
      expenseApprove: req.body.expenseApprove,
      expenseDate: req.body.expenseDate,
      expenseReceipt: req.body.expenseReceipt,
      expenseStatus: req.body.expenseStatus,
      updateName: 'session.userName',
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Expense.findById(expenseId)
      .then((expense) => expense.update(expenseObj))
      .then((expense) => {
        let resp = {
          status: 200,
          title: 'success',
          message: 'แก้ไขข้อมูลกะการทำงานสำเร็จ'
        }
        return res.send(resp)
      })
      .catch((err) => {
        tracer.log("ERROR : ", err)
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expenseObj)]))
      })
      .finally(tracer.endDetach())
  }

  deleteExpensesById(req, res, expenseId){
    return res.send("deleteExpensesById : "+expenseId)
  }

}