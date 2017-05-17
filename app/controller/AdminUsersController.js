const AbstractController = require('./AbstractPublicController');
const { ecrappConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class AdminUsersController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
      let tracer = this.trace(req.processInfo.tracking, null)

      if (_.eq(req.method, 'GET')) {
          let cmd = _(req.params.cmd || null).value()
          let userId = _(req.params.userId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> userId = ', userId)

          if (_.isNull(cmd)) {
            return res.render('admin/users')
          }

          if (_.eq(cmd, 'list-users')) {
              return this.getUsers(req, res)
          }else if (_.eq(cmd, 'detail-users')) {
              if(!_.isNull(userId)){
                  return this.getUsersById(req, res, userId)
              }
          }

          return res.send("No Page Found!!");
          
      }else if(_.eq(req.method, 'POST')){
          let cmd = _(req.params.cmd || null).value()
          let userId = _(req.params.userId || null).value()
          tracer.log('=====> cmd = ', cmd)
          tracer.log('=====> userId = ', userId)

          if (_.isNull(cmd)) {
              return this.addUsers(req, res)
          }else if(_.eq(cmd, 'update-users')) {
              if(!_.isEmpty(userId)){
                  return this.updateUsersById(req, res, userId)
              }
          }
          return res.send("No Page Found!!");

      }else if(_.eq(req.method, 'DELETE')){
          let userId = _(req.params.userId || null).value()
          tracer.log('=====> userId = ', userId)

          if (!_.isNull(userId)) {
              return this.deleteUsersById(req, res, userId)
          }else{
              return res.send("What do u want to do??");
          } 
      }
  }

  getUsers(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    let _start       = _(req.query.start || 0).value()
    let _length      = _(req.query.length || 0).value()

    let _orderColum  = req.query.order[0].column;
    let _orderBy     = req.query.order[0].dir;
    let _orderName   = req.query.columns[_orderColum].name;

    let _where       = {}
    let _include     = []
    let _order       = [['username','ASC']]

    if(!_.isEmpty(req.query.search.value)){
      _where = { 
          $or: [
            {  username : {$like: '%' + req.query.search.value + '%'}  },
            {  firstName : {$like: '%' + req.query.search.value + '%'}  },
            {  lastName : {$like: '%' + req.query.search.value + '%'}  },
            {  email : {$like: '%' + req.query.search.value + '%'}  }
          ],
        }
    }

    _length     = _.parseInt(_length)
    _start      = _.parseInt(_start)
    _order      = [[_orderName, _orderBy]]


    return models.Users.findAndCountAll({
        include: _include,
        limit: _.parseInt(_length),
        offset: _.parseInt(_start),
        order: _order,
        where: _where
      })
      .then(_users => {
        let resp =  {
          recordsTotal: _users.count,
          recordsFiltered: _users.count,
          data: []
        }

        _.forEach(_users.rows, function (_users, idx) {

            let btnEdit = '<i class="material-icons search-icon icon-users-detail" data-idx="'+ _users.userId +'">search</i>'

            _users.userRole = _.find(ecrappConstants.USERSROLE, {typeId : _users.userRole})
            _users.userStatus = _.find(ecrappConstants.USERSTATUS, {typeId : _users.userStatus})

            let dataRow = [
                idx+1,
                _users.username,
                _users.firstName,
                _users.lastName,
                _users.email,
                _users.userRole.typeName,
                _users.userStatus.typeName,
                btnEdit,
            ]

            resp.data.push(dataRow)
        })
        return res.json(resp)
      })
  }

  getUsersById(req, res, userId){
    let tracer = this.trace(req.processInfo.tracking, null)

    return models.Users.findOne({
      where: { userId: userId }
    })
      .then((user)=>{
            let resp = {
                status: 200,
                title: 'success',
                data: user
                }
            return res.send(resp)
        })
        .finally(tracer.endDetach())
  }

  addUsers(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let userObj = {
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      userRole: req.body.userRole,
      userStatus: req.body.userStatus,
      createBy: req.session.username,
      createDate: dateFormat(nowDate, 'isoDateTime'),
      updateBy: req.session.username,
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Users.create(userObj)
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
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(userObj)]))
      })
      .finally(tracer.endDetach())
  }

  updateUsersById(req, res, userId){
    let tracer = this.trace(req.processInfo.tracking, null)

    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let nowDate = new Date()

    let usersObj = {
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      userRole: req.body.userRole,
      userStatus: req.body.userStatus,
      updateBy: req.session.username,
      updateDate: dateFormat(nowDate, 'isoDateTime'),
    }

    return models.Users.findById(userId)
      .then((user) => user.update(usersObj))
      .then((user) => {
        let resp = {
          status: 200,
          title: 'success',
          message: 'แก้ไขข้อมูลกะการทำงานสำเร็จ'
        }
        return res.send(resp)
      })
      .catch((err) => {
        tracer.log("ERROR : ", err)
        return Promise.reject(new exception.BusinessException('710000', null, [JSON.stringify(usersObj)]))
      })
      .finally(tracer.endDetach())
  }

  deleteUsersById(req, res, userId){

  }

}