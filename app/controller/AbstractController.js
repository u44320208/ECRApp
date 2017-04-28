let { Tracable, exception } = require('../../app-common')

let Promise = require('bluebird')
let _ = require('lodash')
let uuid = require('node-uuid')

module.exports = class AbstractController extends Tracable(Object) {

  constructor(logger, services) {
    super()

    this.logger = logger
    this.services = services
  }

  createProcessInfo(req) {
    req.processInfo = {
      tracking: uuid.v1(req.query.msgId || '')
    }
  }

  validateCommonParam(req) {

  }

  authenticate(req, res) {
    let tracer = this.trace(req.processInfo.tracking)
    let sess = req.session

    console.log('=====> authenticate-sess :: ', sess)
    // console.log('=====> sess.isLogin :: ', sess.isLogin)
    // console.log('=====> sess.username :: ', sess.username)

    // if(!_.eq(req.url, '/backoffice/login/') && !_.eq(req.url, '/backoffice/doLogin/')){
    //   if (!sess || _.isUndefined(sess) || _.isUndefined(sess.isLogin)) {
    //     res.redirect('/backoffice/login/')
    //     return
    //   }
    // }
    if (!_.eq(req.url, '/backoffice/login/') && !_.eq(req.url, '/backoffice/doLogin/')) {
      if (!sess || _.isUndefined(sess.isLogin) || !_.eq(sess.isLogin, true)) {
        res.redirect('/backoffice/login/')
        return
      }
    }

    return Promise.resolve()
      .then(() => {
        tracer.log('authenticated')
      })
      .finally(tracer.endDetach())
  }

  authorize(req) {
    let tracer = this.trace(req.processInfo.tracking)

    return Promise.resolve()
      .then(() => {
        tracer.log('authorized')
      })
      .finally(tracer.endDetach())
  }

  prepareCommonResponse(req, res, content) {
    return this.track(() => content, req.processInfo.tracking)
  }

  sendJSONresponse(req, res, status, content) {
    this.track(() => res.status(status).json(content), req.processInfo.tracking)
  }




  // main process step for executing an api
  // steps
  // 1. generates unique code for tracking.
  // 2. validates common request parameter
  // 3. authenticate
  // 4. authorize
  // 5. execute controller logic
  // 6. prepare specific controller's response
  // 7. prepare common response
  // 8. prepare json msg // might be removed
  processRequest(req, res, next) {
    Promise.resolve()
      .thenReturn(this.createProcessInfo(req))
      // .thenReturn(this.validateCommonParam(req))
      .then(() => this.validateCommonParam(req))
      .then(() => this.authenticate(req, res))
      .then(() => this.authorize(req))
      .then(() => this.execute(req, res))
      // .then((result) => this.prepareResponse(req, res, result))
      // .then((result) => this.prepareCommonResponse(req, res, result))
      // .then((result) => this.sendJSONresponse(req, res, 200, result))
      // .then(next)
      .catch((ex) => {
        // FIXME: Use others HTTP Status Code to indicate an error state to the client.
        this.sendJSONresponse(req, res, 200, { status: { code: ex.errorCode, message: ex.message } });
      })
      .done()
  }

  prepareResponse(req, res, content) {
    let response = {
      status: {
        code: '00000',
        message: 'success'
      },
      body: content
    }

    return response
  }
}
