import getUUId from '../u'

function beforeRegister({
	userRecord,
	clientInfo
} = {}) {
	userRecord.nickname = userRecord.nickname ? userRecord.nickname : "游客" + Date.now().toString(
			36) + '-' + Math
		.random().toString(36).substring(3, 9)
	return userRecord // 务必返回处理后的userRecord
}

module.exports = {
	beforeRegister
}