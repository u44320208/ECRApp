const AbstractController = require('./AbstractPublicController');
const { ecrappConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class UsersExpenditureController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      let tracer = this.trace(req.processInfo.tracking, null)

      if (_.eq(req.method, 'GET')) {
          let cmd = _(req.params.cmd || null).value()
          let expenditureId = _(req.params.expenditureId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expenditureId = ', expenditureId)

          if (_.isNull(cmd)) {
            return models.Expendituretype.findAll()
                .then((_expendituretype) => {
                    return Promise.resolve(models.Expenditure.findAll({attributes: ['expenditureYear'],group: 'expenditureYear',order: 'expenditureYear DESC'}))
                      .then((_expenditureYear)=> {
                        return Promise.resolve(res.render('users/expenditure',{EXPENDITURETYPE: _expendituretype, EXPENDITUREYEAR: _expenditureYear}))
                      })
                })
          }

          if (_.eq(cmd, 'list-expenditure')) {
              return this.getExpenditures(req, res)
          }else if (_.eq(cmd, 'detail-expenditure')) {
              if(!_.isNull(expenditureId)){
                  return this.getExpenditureById(req, res, expenditureId)
              }
          }else if (_.eq(cmd, 'list-expendituredetail')) {
              return this.getExpenditureDetail(req, res, expenditureId)
          }

          return res.send("No Page Found!!");
          
      }else if(_.eq(req.method, 'POST')){
          let cmd = _(req.params.cmd || null).value()
          let expenditureId = _(req.params.expenditureId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expenditureId = ', expenditureId)

          if (_.isNull(cmd)) {
              return this.addExpenditure(req, res);
          }else if(_.eq(cmd, 'update-expenditure')) {
              if(!_.isEmpty(expenditureId)){
                  return this.updateExpenditureById(req, res, expenditureId);
              }
          }
          return res.send("No Page Found!!");

      }else if(_.eq(req.method, 'DELETE')){
          let expenditureId = _(req.params.expenditureId || null).value()
          tracer.log('=====> expenditureId = ', expenditureId)

          if (!_.isNull(expenditureId)) {
              return this.deleteExpenditureById(req, res, expenditureId)
          }else{
              return res.send("What do u want to do??");
          } 
      }
  }

  getExpenditures(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    let expenditureYear = req.query.expenditureYear

    if(!_.isNull(expenditureYear)){

      let _start       = _(req.query.start || 0).value()
      let _length      = _(req.query.length || 0).value()

      let _orderColum  = req.query.order[0].column;
      let _orderBy     = req.query.order[0].dir;
      let _orderName   = req.query.columns[_orderColum].name;

      let _where       = {}
      let _include     = [{model: models.Expendituretype}]
      let _order       = [['expenditureId','DESC']]

      if(_.isEmpty(req.query.search.value)){
        _where = {  expenditureYear : expenditureYear }
      }else{
        _where = { 
            expenditureYear : expenditureYear,
            $or: [
              { expenditureDetail : {$like: '%' + req.query.search.value + '%'} },
              { expenditureAmount : {$like: '%' + req.query.search.value + '%'} },
            ],
          }
      }

      _length     = _.parseInt(_length)
      _start      = _.parseInt(_start)
      _order      = [[_orderName, _orderBy]]


      return models.Expenditure.findAndCountAll({
          include: _include,
          limit: _.parseInt(_length),
          offset: _.parseInt(_start),
          order: _order,
          where: _where
        })
        .then(_expenditure => {
          let resp =  {
            recordsTotal: _expenditure.count,
            recordsFiltered: _expenditure.count,
            data: []
          }

          _.forEach(_expenditure.rows, function (_expenditure, idx) {

              let btnEdit = '<i class="material-icons search-icon icon-expenditure-detail" data-idx="'+ _expenditure.expenditureId +'">search</i>'

              let dataRow = [
                  idx+1,
                  _expenditure.expenditureId,
                  _expenditure.expenditureYear,
                  _expenditure.expendituretypeId,
                  _expenditure.Expendituretype.expendituretype,
                  _expenditure.expenditureDetail,
                  _expenditure.expenditureAmount,
                  btnEdit,
              ]

              resp.data.push(dataRow)
          })
          return res.json(resp)
        })
    }
  }

  getExpenditureById(req, res, expenditureId){
    let tracer = this.trace(req.processInfo.tracking, null)

    return models.Expenditure.findOne({
      where: { expenditureId: expenditureId }
    })
      .then((expenditure)=>{
            let resp = {
                status: 200,
                title: 'success',
                data: expenditure
                }
            return res.send(resp)
        })
        .finally(tracer.endDetach())
  }

  addExpenditure(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let expenditureObj = {
      expenditureId: req.body.expenditureId,
      expenditureYear: req.body.expenditureYear,
      expendituretypeId: req.body.expendituretypeId,
      expenditureDetail: req.body.expenditureDetail,
      expenditureText: req.body.expenditureText,
      expenditureAmount: req.body.expenditureAmount,
      insertName: 'session.userName',
      insertDate: dateFormat(nowDate, 'isoDateTime'),
      updateName: 'session.userName',
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Expenditure.create(expenditureObj)
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
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expenditureObj)]))
      })
      .finally(tracer.endDetach())
  }

  updateExpenditureById(req, res, expenditureId){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let expenditureObj = {
      expenditureId: req.body.expenditureId,
      expenditureYear: req.body.expenditureYear,
      expendituretypeId: req.body.expendituretypeId,
      expenditureDetail: req.body.expenditureDetail,
      expenditureText: req.body.expenditureText,
      expenditureAmount: req.body.expenditureAmount,
      updateName: 'session.userName',
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Expenditure.findById(expenditureId)
      .then((expenditure) => expenditure.update(expenditureObj))
      .then((expenditure) => {
        let resp = {
          status: 200,
          title: 'success',
          message: 'แก้ไขข้อมูลกะการทำงานสำเร็จ'
        }
        return res.send(resp)
      })
      .catch((err) => {
        tracer.log("ERROR : ", err)
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expenditureObj)]))
      })
      .finally(tracer.endDetach())
  }

  deleteExpenditureById(req, res, expenditureId){
    return res.send("deleteExpenditureById : "+expenditureId);
  }

  getExpenditureDetail(req, res, expenditureId){
    let tracer = this.trace(req.processInfo.tracking, null)

    let expenditureYear = req.query.expenditureYear
    let expendituretypeId = req.query.expendituretypeId

    if(!_.isNull(expenditureYear)){
      let _where = { expenditureYear: expenditureYear }
      console.log('expenditureYear : '+expenditureYear)
      if(!_.isEmpty(expendituretypeId) && !_.isNull(expendituretypeId)){
        _where = {
          expenditureYear: expenditureYear,
          expendituretypeId: expendituretypeId
        }
        console.log('expendituretypeId : '+expendituretypeId)
      }
      return models.Expenditure.findAll({attributes: ['expenditureId','expenditureDetail'], order: 'expenditureDetail ASC', where: _where})
        .then((expenditureYearList)=>{
            return res.send(expenditureYearList)
        })
        .finally(tracer.endDetach())
    }
  }

}