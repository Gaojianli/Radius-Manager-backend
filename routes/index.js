const router = require('koa-router')()
const user = require('../controller/user')

// login
router.post('/login', user.login)

// list user
router.get('/user', user.list)

// create user
router.put('/user', user.register)

// delete user
router.delete('/user/:username', user.delete)

// change password
router.post('/user/:username/changepassword', user.changePassword)

// show password
router.get('/user/:username/password', user.showPassword)

module.exports = router
