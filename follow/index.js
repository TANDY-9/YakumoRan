"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = __importStar(require("../../lib/api"));
const config_1 = __importDefault(require("../../config"));
const permission_1 = __importDefault(require("../permission/permission"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../lib/logger"));
try {
    fs_1.default.mkdirSync(path_1.default.join(api.Data, './follow'));
}
catch (error) { }
api.command(/^.跟随$/, 'fllow.add', (m, e, reply) => {
    if (e.username === config_1.default.account.username)
        return; // 不响应自己发送的消息
    try {
        if (!permission_1.default.users.hasPermission(e.uid, 'follow.op') && !permission_1.default.users.hasPermission(e.uid, 'permission.follow.op'))
            return;
        permission_1.default.users.addPermission(e.uid, 'follow.can');
        reply(` [Follow] :  [*${e.username}*] 跟随模式开启~`);
    }
    catch (error) {
        if (permission_1.default.users.hasPermission(e.uid, 'follow.can'))
            return reply(` [Follow] :  [*${e.username}*] 您已成功拥有小跟班，无需再次重新声明..!`);
    }
});
api.command(/^.取消跟随$/, 'fllow.loss', (m, e, reply) => {
    if (e.username === config_1.default.account.username)
        return; // 不响应自己发送的消息
    try {
        if (!permission_1.default.users.hasPermission(e.uid, 'follow.can'))
            return reply(` [Follow] :  [*${e.username}*] 您木有设定小跟班哦~`);
        permission_1.default.users.removePermission(e.uid, 'follow.can');
        reply(` [Follow] :  [*${e.username}*] 取消跟随成功了~`);
    }
    catch (error) {
        reply(`[Follow] :  [*${e.username}*] 发生了未知错误`);
    }
});
api.Event.on('SwitchRoom', msg => {
    if (msg.username === config_1.default.account.username)
        return;
    const uid = msg.uid.toUpperCase();
    const roomId = msg.targetRoom;
    const list = permission_1.default.users.has('follow.can');
    if (list.indexOf(uid) >= 0) {
        const logger = (0, logger_1.default)(`正在前往房间：${roomId}`);
        api.method.bot.moveTo(roomId);
    }
});
