var buffer = require('buffer').Buffer;
var crypto = require('crypto');
var lincoapp = 'lincoapp@gavinning';

// 返回加密后的base64编码
exports.base = function(content){
	return crypto.createHmac('sha1', lincoapp).update(content).digest().toString('base64')
}

// 返回加密后的hex编码
exports.hex = function(content){
	return crypto.createHmac('sha1', lincoapp).update(content).digest().toString('hex')
}

// base64转hex
exports.baseToHEX = function(content){
	return new buffer(content, 'base64').toString('hex')
}

// hex转base64
exports.HEXToBase = function(content){
	return new buffer(content, 'hex').toString('base64')
}
