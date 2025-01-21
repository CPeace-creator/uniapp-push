const db =uniCloud.database()
const dbCmd = db.command
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	async update({pushId=null,active_state=null,formData=null}){
		let updateData={
			active_state
		}
		if(formData) updateData.operLogs=dbCmd.push([formData])
		return await db.collection("push-data").where({_id:pushId}).update(updateData)
	}
}
