const db =uniCloud.database()
const dbCmd = db.command
//获取满足条件的用户
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
	return result.map(item=>item.award_user_id)
}

//获取随机用户数组
function getRandomElements(arr, count) {
    const shuffled = arr.slice(0); // 创建数组的副本
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 随机选择一个索引
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
    }
    return shuffled.slice(0, count); // 返回随机选择的前`count`个元素
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
			let {data:[{isRepeat}]} = await db.collection("push-data").where({_id:pushId}).field({isRepeat:true}).get()
			let tempUserList =[...userList]
			if(!isRepeat){
				let {data}=await db.collection("push-award-user").where({push_id:pushId}).field({award_user_id:true}).get()
				let awUsers=data.map(item=>item.award_user_id)
				tempUserList = userList.filter(item=>!awUsers.includes(item))
			}
			//满足条件用户内随机前端传过来的number
			let award_user= getRandomElements(tempUserList,formData.number)
			//将新用户放到保存中奖纪录表中 push-award-user
			let addArr= award_user.map(item=>{
				return {
					award_user_id:item,
					push_id:pushId,
					order_id:formData.id,
					award_id:formData.aid,
					create_date:Date.now(),
					status:0
				}
			})
			db.collection("push-award-user").add(addArr)
			updateData.operLogs=dbCmd.push([formData])
		}
		return await db.collection("push-data").where({_id:pushId}).update(updateData)
	}
}