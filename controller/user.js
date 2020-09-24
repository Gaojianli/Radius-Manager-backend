'use strict'
const query = require('../utils/query')
const sql = require('../utils/sql')
const crypto = require('crypto')

module.exports = {
  login: async ctx => {
    const key = ctx.request.body.adminKey
    if (key === process.env.ADMIN_KEY) {
      ctx.cookies.set('admin', key, {
        domain: '*'
      })
      ctx.request.status = 200
      ctx.body = {
        code: 200,
        data: 'Login successful'
      }
    } else {
      ctx.response.status = 403
      ctx.body = {
        code: 403,
        data: 'Invaild key'
      }
    }
  },
  list: async (ctx, next) => {
    const result = await query(sql.LIST_USER)
    ctx.body = {
      code: 200,
      data: result.map(it => {
        return {
          username: it.username,
          type: it.attribute
        }
      })
    }
  },
  register: async (ctx, next) => {
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    const type = ctx.request.body.type
    if ((username && password) && (type === 'Cleartext-Password' || type === 'MD5-Password')) {
      const result = await query(sql.ADD_USER(username, type, password))
      await query(sql.ADD_USER_TO_GROUP(username))
      ctx.response.status = 201
      ctx.body = {
        code: 201,
        data: result
      }
    } else {
      ctx.response.status = 406
      ctx.body = {
        code: 406,
        data: null
      }
    }
  },
  delete: async (ctx, next) => {
    const username = ctx.params.username
    if (username) {
      await Promise.all([
        query(sql.DELETE_USER(username)),
        query(sql.DELETE_USER_FROM_GROUP(username))
      ])
      ctx.response.status = 204
      ctx.body = {
        code: 204,
        data: 'User deleted'
      }
    } else {
      ctx.response.status = 404
      ctx.body = {
        code: 404,
        data: 'User not found'
      }
    }
  },
  changePassword: async ctx => {
    const username = ctx.params.username
    const password = ctx.request.body.password
    const type = ctx.request.body.type
    if ((username && password) && (type === 'Cleartext-Password' || type === 'MD5-Password')) {
      const realPassowrd = type === 'MD5-Password' ? crypto.createHash('md5').update(password).digest().toString('base64') : password
      await query(sql.CHANGE_PASSWORD(username, type, realPassowrd))
      ctx.request.status = 200
      ctx.body = {
        code: 200,
        data: 'Modified.'
      }
    } else {
      ctx.response.status = 406
      ctx.body = {
        code: 406,
        data: null
      }
    }
  },
  showPassword: async ctx => {
    const username = ctx.params.username
    if (username) {
      const user = (await query(sql.GET_USER_INFO(username)))[0]
      if (user.attribute === 'Cleartext-Password') {
        ctx.body = {
          code: 200,
          data: user.value
        }
      } else {
        ctx.response.status = 406
        ctx.body = {
          code: 406,
          data: 'Password was encrypted.'
        }
      }
    }
  }
}
