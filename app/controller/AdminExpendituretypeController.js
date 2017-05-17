const AbstractController = require('./AbstractAdminController');
const { ecrappConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class AdminExpendituretypeController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      let tracer = this.trace(req.processInfo.tracking, null)

      if (_.eq(req.method, 'GET')) {
          let cmd = _(req.params.cmd || null).value()
          let expendituretypeId = _(req.params.expendituretypeId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expendituretypeId = ', expendituretypeId)

          if (_.isNull(cmd)) {
            return res.render('admin/expendituretype')
          }

          if (_.eq(cmd, 'list-expendituretype')) {
              return this.getExpendituretypes(req, res)
          }else if (_.eq(cmd, 'detail-expendituretype')) {
              if(!_.isNull(expendituretypeId)){
                  return this.getExpendituretypeById(req, res, expendituretypeId)
              }
          }

          return res.send("No Page Found!!");
          
      }else if(_.eq(req.method, 'POST')){
          let cmd = _(req.params.cmd || null).value()
          let expendituretypeId = _(req.params.expendituretypeId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> expendituretypeId = ', expendituretypeId)

          if (_.isNull(cmd)) {
              return this.addExpendituretype(req, res);
          }else if(_.eq(cmd, 'update-expendituretype')) {
              if(!_.isEmpty(expendituretypeId)){
                  return this.updateExpendituretypeById(req, res, expendituretypeId);
              }
          }
          return res.send("No Page Found!!");

      }else if(_.eq(req.method, 'DELETE')){
          let expendituretypeId = _(req.params.expendituretypeId || null).value()
          tracer.log('=====> expendituretypeId = ', expendituretypeId)

          if (!_.isNull(expendituretypeId)) {
              return this.deleteExpendituretypeById(req, res, expendituretypeId)
          }else{
              return res.send("What do u want to do??");
          } 
      }
  }

  getExpendituretypes(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)
    
    let _start       = _(req.query.start || 0).value()
    let _length      = _(req.query.length || 0).value()

    let _orderColum  = req.query.order[0].column;
    let _orderBy     = req.query.order[0].dir;
    let _orderName   = req.query.columns[_orderColum].name;

    let _where       = {}
    let _include     = []
    let _order       = [['expendituretypeId','ASC']]

    if(!_.isEmpty(req.query.search.value)){
      _where = { 
          $or: [
            {  expendituretype : {$like: '%' + req.query.search.value + '%'}  }
          ],
        }
    }

    _length     = _.parseInt(_length)
    _start      = _.parseInt(_start)
    _order      = [[_orderName, _orderBy]]

    return models.Expendituretype.findAndCountAll({
        include: _include,
        limit: _.parseInt(_length),
        offset: _.parseInt(_start),
        order: _order,
        where: _where
      })
      .then(_expendituretypes => {
        let resp = {
          recordsTotal: _expendituretypes.count,
          recordsFiltered: _expendituretypes.count,
          data: []
        }
        _.forEach(_expendituretypes.rows, function (_expendituretypes, idx) {
         
            let btnEdit = '<i class="material-icons search-icon icon-expendituretype-detail" data-idx="'+ _expendituretypes.expendituretypeId +'">search</i>'

            let dataRow = [
                idx+1,
                _expendituretypes.expendituretypeId,
                _expendituretypes.expendituretype,
                btnEdit,
            ]

            resp.data.push(dataRow)
        })
        return res.json(resp)
      })
  }

  getExpendituretypeById(req, res, expendituretypeId){
    let tracer = this.trace(req.processInfo.tracking, null)

    return models.Expendituretype.findOne({
      where: { expendituretypeId: expendituretypeId }
    })
      .then((expendituretype)=>{
            let resp = {
                status: 200,
                title: 'success',
                data: expendituretype
                }
            return res.send(resp)
        })
        .finally(tracer.endDetach())
  }

  addExpendituretype(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let expendituretypeObj = {
      expendituretypeId: req.body.expendituretypeId,
      expendituretype: req.body.expendituretype,
    }

    return models.Expendituretype.create(expendituretypeObj)
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
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expendituretypeObj)]))
      })
      .finally(tracer.endDetach())
  }

  updateExpendituretypeById(req, res, expendituretypeId){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let expendituretypeObj = {
      expendituretypeId: req.body.expendituretypeId,
      expendituretype: req.body.expendituretype,
    }

    return models.Expendituretype.findById(expendituretypeId)
      .then((expendituretype) => expendituretype.update(expendituretypeObj))
      .then((expendituretype) => {
        let resp = {
          status: 200,
          title: 'success',
          message: 'แก้ไขข้อมูลกะการทำงานสำเร็จ'
        }
        return res.send(resp)
      })
      .catch((err) => {
        tracer.log("ERROR : ", err)
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(expendituretypeObj)]))
      })
      .finally(tracer.endDetach())
  }

  deleteExpendituretypeById(req, res, expendituretypeId){
    return res.send('deleteExpendituretypeById')
  }

}