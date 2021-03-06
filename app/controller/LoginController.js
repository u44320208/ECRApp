const AbstractController = require('./AbstractPublicController');
const { ecrappConstants } = require('../../app-common');

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
      req.session.destroy(function(err) {
        if(err) {
          console.log(err)
        } else {
          return res.render('login',{message: ''})
        }
      });
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

    return models.Users.findOne({ 
      where: {
        username: username, 
        password: password 
      }
    })
    .then((_user)=>{
        if(_.isNull(_user)){
          return res.render('login',{message: 'Username and Password ไม่ถูกต้อง'})
        }

        req.session.isLogin = true
        req.session.username = _user.firstName +' '+ _user.lastName
        req.session.userRole = _user.userRole

        if(_.eq(_user.userRole, '10')) {
          return res.redirect('admin/')
        }
        else{
          return res.redirect('users/')
        }
    })
  }

}