import * as api from '../../lib/api'
import config from '../../config'
import per from '../permission/permission'
import fs from 'fs'
import path from 'path'
import log from '../../lib/logger'


try {
  fs.mkdirSync(path.join(api.Data, './follow'))
} catch (error) {}


api.command(/^.跟随$/, 'fllow.add', (m, e, reply) => {
  if (e.username === config.account.username) return // 不响应自己发送的消息
  try {
    if (!per.users.hasPermission(e.uid, 'follow.op') && !per.users.hasPermission(e.uid, 'permission.follow.op')) return
    per.users.addPermission(e.uid, 'follow.can')
    reply(` [Follow] :  [*${e.username}*] 跟随模式开启~`)
  } catch (error) {
        if (per.users.hasPermission(e.uid, 'follow.can')) return reply(` [Follow] :  [*${e.username}*] 您已成功拥有小跟班，无需再次重新声明..!`)
  }
})

api.command(/^.取消跟随$/, 'fllow.loss', (m, e, reply) => {
  if (e.username === config.account.username) return // 不响应自己发送的消息
  try {
    if (!per.users.hasPermission(e.uid, 'follow.can')) return reply(` [Follow] :  [*${e.username}*] 您木有设定小跟班哦~`)
    per.users.removePermission(e.uid, 'follow.can')


    reply(` [Follow] :  [*${e.username}*] 取消跟随成功了~`)
  } catch (error) {
    reply(`[Follow] :  [*${e.username}*] 发生了未知错误`)
  }
})

api.Event.on('SwitchRoom', msg => {
  if (msg.username === config.account.username) return
  const uid:string = msg.uid.toUpperCase()
  const roomId:string = msg.targetRoom
  const list = per.users.has('follow.can')
  
  if (list.indexOf(uid) >= 0) {
    const logger = log(`正在前往房间：${roomId}`)
    api.method.bot.moveTo(roomId)
   
  }
})
