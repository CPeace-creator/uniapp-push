const db = uniCloud.database()
const dbCmd	 = db.command
const pushCloudObj = uniCloud.importObject("push-operation",{customUI:true})
module.exports = {
  trigger: {
	// 注册数据表的read前事件
    beforeCreate: async function (
	{
		clientInfo,
		addDataList
    } = {}) {
		let [{push_id}]=addDataList
		db.collection("push-data").doc(push_id).update({
			join_count:dbCmd.inc(1)
		})
		pushCloudObj.joinUserSend({push_id})
    }
  }
}
