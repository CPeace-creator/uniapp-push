function getPushId(){
	return  uniCloud.getPushManager({appId:"__UNI__D5ADB49"})
}
module.exports = {
	_before: function () { // 通用预处理器

	},
	async sendMsg(data){
		return await getPushId().sendMessage({
		"title": "pushDemo",	
		"content": "pushDemo",
		"payload": {
			"time":Date.now(),
			menuData:data
		}
		})
	}
}
