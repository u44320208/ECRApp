/*
#######################################################################################################################
###						                  																			###
###                           				BS  Error Code and Message		              							###
###					                  																				###
#######################################################################################################################
###	                       					Error Code Pattern [0-9][0-9][0-9][000-999]	     		           		###
###	                          				Error Type|Severity|System|Running Number                 				###
#######################################################################################################################
###	Error Type : Default 		1	### Error Severity : Information			1	### System : KROK(Default) 	0	###
###	             Security		2  	###	          		 Alert Operation		2	###			 ACCOUNT		1	###
###	             XML/JSON		3   ##	          	     Alert Development		3	###			 ORDER  		2	###
###	             Configuration	4   ###	          		 Critical Operation		4	### 		 SOCIAL 		3	###
###	             Batch			5   ###	          		 Critical Development	5	###			 ToBeDefine		4	###
###	             JMS			6   ### 											###			 ToBeDefine		5	###
###	             DB				7   ### 											###			 AME    		6	###
###	             Business		8   ### 											###			 SONG			7	###
###	             Adapter		9   ### 											###			 SHELF		    8	###
#######################################################################################################################
*/
const _ = require('lodash')

const Types = {
  DEFAULT: 1,
  SECURITY: 2,
  XML_JSON: 3,
  CONFIGURATION: 4,
  BATCH: 5,
  JMS: 6,
  DB: 7,
  BUSINESS: 8,
  ADAPTER: 9
}

const Severities = {
  INFOMATION: 1,
  ALERT_OPERATION: 2,
  ALERT_DEVELOPMENT: 3,
  CRITICAL_OPERATION: 4,
  CRITICAL_DEVELOPMENT: 5
}

const Systems = {
  KROK: 0,
  ACCOUNT: 1,
  ORDER: 2,
  SOCIAL: 3,
  GAME: 6,
  SONG: 7,
  SHELF: 8
}

let makeErrorCode = _.curry((type, system, severity, num) => {
  return [type % 10, severity % 10, system % 10, ('000' + (num % 1000)).substr(-3)].join('')
})

let pair = (code, name, message) => {
  return { code, name, message }
}

let createMakers = (type, system) => {
  let make = makeErrorCode(type, system)

  let info = make(Severities.INFOMATION)
  let alert_operation = make(Severities.ALERT_OPERATION)
  let alert_development = make(Severities.ALERT_DEVELOPMENT)
  let critical_operation = make(Severities.CRITICAL_OPERATION)
  let critical_development = make(Severities.CRITICAL_DEVELOPMENT)

  let create = _.curry((maker, num, name, message) => pair(maker(num), name, message))

  return { info, alert_operation, alert_development, critical_operation, critical_development, create }
}

// 1S1XXX
let makeKROKDefaultErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.DEFAULT, Systems.KROK)
  return [
    create(info, 0, 'DEFAULT_ERROR1', '{0}'),
    create(info, 1, 'DEFAULT_ERROR1', 'There are some error occur. Error detail : {0}.')
  ]
}

// 5S0XXX
let makeKROKBatchErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BATCH, Systems.KROK)
  return [
    create(info, 0, 'BATCH_ERROR1', 'Batch task cannot be executed, error: {0}'),
    create(info, 1, 'BATCH_ERROR2', 'On {0} Event error : require activity attr {1} missing'),
    create(info, 2, 'BATCH_ERROR2', 'Game Id {0} : no account to invite'),
    create(info, 3, 'BATCH_ERROR3', 'Game Id {0} : Test')
  ]
}

// 9S0XXX
let makeKROKAdapterErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.ADAPTER, Systems.KROK)
  return [
    create(info, 1, 'ADPT_ERROR1', 'key {0} was not found in Redis.')

  ]
}



// 8S0XXX
let makeKROKAccountErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.KROK)
  return [
    create(info, 1, 'ACCOUNT_ERROR1', 'Account Id {0} does not exist.'),
    create(info, 2, 'ACCOUNT_ERROR1', 'Your token key {0} has expired, Please re-login.')
  ]
}

// 8S6XXX
let makeKROKGameErrors = () => {
    let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.GAME)
    return [
        create(info, 0, 'GAME_ERROR1', 'Can\'t create Game {0}.'),
        create(info, 1, 'GAME_ERROR2', 'Game Id {0} does not exist.'),
        create(info, 2, 'GAME_ERROR3', 'Game Id {0} is not publish.'),
        create(info, 3, 'GAME_ERROR4', 'Game Id {0} is not active.'),
        create(info, 4, 'GAME_ERROR5', 'Game Id {0} is type miss match.'),
        create(info, 5, 'GAME_ERROR6', 'Can\'t update Game {0}.'),
        create(info, 6, 'GAME_ERROR7', 'Game Type is not support {0}.'),
        create(info, 7, 'GAME_ERROR8', 'Song Part {0} miss match.'),
        create(info, 8, 'GAME_ERROR9', 'Game Sing {0} exception.'),
        create(info, 9, 'GAME_ERROR10', '{0}'),
        create(info, 10, 'GAME_ERROR11', 'Song group {0} is not subscription level {1}')
    ]
}

// 8S7XXX
let makeKROKSongErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.SONG)

  return [
    create(info, 0, 'SONG_ERROR1', 'Can\'t create song {0}.'),
    create(info, 1, 'SONG_ERROR2', 'Song Id {0} does not exist.'),
    create(info, 2, 'SONG_ERROR3', 'Song Id {0} is not publish.'),
    create(info, 3, 'SONG_ERROR4', 'Song Id {0} is not active.'),
    create(info, 4, 'SONG_ERROR5', 'Song Id {0} is type miss match.'),
    create(info, 5, 'SONG_ERROR6', 'Can\'t update song {0}.')
  ]
}

// 8S8XXX
let makeKROKShelfErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.SHELF)

  return [
    create(info, 0, 'SHELF_ERROR1', 'Can\'t create shelf {0}.'),
    create(info, 1, 'SHELF_ERROR2', 'Shelf Id {0} does not exist.'),
    create(info, 2, 'SHELF_ERROR3', 'Shelf Id {0} is not publish.'),
    create(info, 3, 'SHELF_ERROR4', 'Shelf Id {0} is not active.'),
    create(info, 4, 'SHELF_ERROR5', 'Shelf Id {0} is type miss match.')
  ]
}


// 8S3XXX
let makeKROKSocialErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.SOCIAL)

  return [
    create(info, 0, 'SOCIAL_ERROR1', 'Cannot get social feed for account {0}.'),
    create(info, 1, 'SOCIAL_ERROR2', 'Social error'),
    create(info, 2, 'SOCIAL_ERROR3', 'There is no your social post specific id :{0}')
  ]
}

// 7S7XXX
/*
let makeKROKDBErrors = () => {
  let { info, alert_operation, alert_development, critical_operation, critical_development, create } = createMakers(Types.BUSINESS, Systems.SOCIAL)

  return [
    create(info, 0, 'SOCIAL_ERROR1', 'Cannot get social feed for account {0}.'),
    create(info, 1, 'SOCIAL_ERROR2', 'Social error')
  ]
}
*/

let register = (...registras) => {
  return registras.reduce((registry, registra) => {
    registra().forEach((r) => {
      registry.codes[r.name] = r.code
      registry.messages[r.code] = r.message
    })

    return registry
  }, { codes: {}, messages: {} })
}


module.exports = register(
  makeKROKDefaultErrors,
  makeKROKAccountErrors,
  makeKROKSongErrors,
  makeKROKShelfErrors,
  makeKROKGameErrors,
  makeKROKSocialErrors,
  makeKROKBatchErrors,
  makeKROKAdapterErrors
)
