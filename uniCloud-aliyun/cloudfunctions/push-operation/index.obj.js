const db =uniCloud.database()
const dbCmd = db.command
async function getUserListAll(pushId){
	let limit = 100; // 每次查询的数量
	let offset = 0; // 偏移量	
	let {total} = await db.collection("push-join-user").where({push_id:pushId}).count();		
	let promiseArr = []; //promise列表
	do {		
		  let promise = db.collection('push-join-user').where({push_id:pushId}).field({award_user_id:true}).skip(offset).limit(limit).get(); //将查询数据的结果赋值给变量promise
		  promiseArr.push(promise) //将返回结果push到promiseArr
		  offset += limit; 
	} while (offset < total);		
	let arr = await Promise.all(promiseArr) //通过.all统一同时执行请求
	let result = arr.map(item=>{
		return item.data
	}).flat();//返回的是每个的数据对象，将需要的res.data返回，并flat将二维数组变为一维数组
	console.log(result);
	return result
}
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	async update({pushId=null,active_state=null,formData=null,reset=false}){
		let updateData={
			active_state
		}
		if(formData){
			//获取满足条件的用户
			let userList = await getUserListAll(pushId)
			return userList
			return
			updateData.operLogs=dbCmd.push([formData])
		}
		return await db.collection("push-data").where({_id:pushId}).update(updateData)
	}
}