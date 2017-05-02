const AbstractController = require('./AbstractPublicController');
const { iamsmConstants } = require('../../app-common');

// Dom
let models = require('../../app-core/dao/db');

let Promise = require('bluebird');
let _ = require('lodash')
let dateFormat = require('dateformat')

module.exports = class LoginController extends AbstractController {
  constructor(logger, services) {
    super(logger, services);
  }

  execute(req, res) {
    let tracer = this.trace(req.processInfo.tracking, null)

    if (_.eq(req.method, 'GET')) {
      return res.render('login');
    }
    else if(_.eq(req.method, 'POST')){
      return this.loginProcess(req, res);
    }
  }

  loginProcess(req, res){
    let tracer = this.trace(req.processInfo.tracking, null)
  
    tracer.log('=====> req.params :: ', req.params)
    tracer.log('=====> req.body :: ', req.body)

    let username = req.body.username
    let password = req.body.password

    if(_.eq(username, 'admin')) {
      // return res.render('admin/index');
      return res.redirect('admin/')
    }
    else{
      // return res.render('users/index');
      return res.redirect('users/')
    }
  }

}