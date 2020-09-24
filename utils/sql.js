const LIST_USER = 'SELECT username,attribute FROM radcheck'
const GET_USER_INFO = user => `SELECT * FROM radcheck where username='${user}'`
const GET_PASSWORD = userName => `SELECT value FROM radcheck where op=':=' and attribute='Cleartext-Password' and username=${userName}`
const ADD_USER = (user, type, password) => `insert into radcheck(username,attribute,op,value) select '${user}','${type}',':=','${password}' from DUAL where not exists(select username from radcheck where username = '${user}');`
const ADD_USER_TO_GROUP = user => `insert into radusergroup (username,groupname) values ('${user}','user');`
const DELETE_USER = user => `delete from radcheck where username = '${user}'`
const DELETE_USER_FROM_GROUP = user => `delete from radusergroup where username = '${user}'`
const CHANGE_PASSWORD = (user, type, password) => `update radcheck set attribute='${type}',value='${password}' where username = '${user}'`

module.exports = {
  LIST_USER,
  GET_PASSWORD,
  ADD_USER,
  ADD_USER_TO_GROUP,
  DELETE_USER,
  DELETE_USER_FROM_GROUP,
  CHANGE_PASSWORD,
  GET_USER_INFO
}
