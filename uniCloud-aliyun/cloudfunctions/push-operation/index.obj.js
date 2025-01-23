const db =uniCloud.database()
const dbCmd = db.command
const uniID=require("uni-id-common")
function uniPush(){
	return  uniCloud.getPushManager({appId:"__UNI__D5ADB49"})
}
//获取满足条件的用户
async function getUserListAll(pushId){
	console.log("抽奖id",pushId);
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

//获取当前用户的信息
async function getUserInfo(that){
	let token =that.getUniIdToken()
	let clientInfo = that.getClientInfo()
	let unidIns = uniID.createInstance({clientInfo})
	let res =await unidIns.checkToken(token)
	if(res.errCode!=0) throw new Error(res.errMsg)
	return res
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
		let {uid,role} =await getUserInfo(this)
		let updateData={
			active_state
		}
		//给客户端推送数据
		let payload={
			time:Date.now(),
			active_state,
			type:"push"
		}
		//获取满足条件的用户
		let {data:[{isRepeat,user_id,awardsList}]} = await db.collection("push-data").where({_id:pushId}).field({isRepeat:true,user_id:true,awardsList:true}).get()
		//判断操作者是否是同一个人
		if(uid!=user_id){
			throw new Error("权限不足不能抽奖")
		}
		//获取所有满足抽奖的用户者
		let userList = await getUserListAll(pushId)
		userList = [...new Set(userList)]
		let tempUserList =[...userList]
		if(!isRepeat){
			let {data}=await db.collection("push-award-user").where({push_id:pushId}).field({award_user_id:true}).get()
			let awUsers=data.map(item=>item.award_user_id)
			tempUserList = userList.filter(item=>!awUsers.includes(item))
		}
		if(tempUserList.length==0){
			return {code:400,msg:"无满足用户或参与用户已全部中奖,无法中奖"}
		}
		//状态由2-1 停止->点击参与
		if(formData){
			//满足条件用户内随机前端传过来的number
			let award_user= getRandomElements(tempUserList,formData.number)
			let not_award_user = userList.filter(item=>!award_user.includes(item))
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
			let find = awardsList.find(find=>find.id==formData.aid)
			uniPush().sendMessage({
					user_id:award_user,
					title:"抽奖结果",
					content:"恭喜中奖",
					payload:{
						...payload,
						result:{
							value:1,
							name:find.name,
							description:find.description
						}
					}
			})
			uniPush().sendMessage({
					user_id:not_award_user,
					title:"抽奖结果",
					content:"没有中奖",
					payload:{
						...payload,
						result:{
							value:0
						}
					}
			})
		}else{
			if(reset) payload.reset=true
			//状态由1-2 点击参与->停止
			//全员通知抽奖开始
			uniPush().sendMessage({
				user_id:userList,
				title:"大转盘抽奖",
				content:"大转盘抽奖抽奖中",
				payload:payload
		})
			
		}
		return await db.collection("push-data").where({_id:pushId}).update(updateData)
	},
	async joinUserSend({push_id=null}){
		//获取所有满足抽奖的用户者
		let userList = await getUserListAll(push_id)
		userList = [...new Set(userList)]
		console.log("用户信息",userList);
		let {data:[{join_count}]}=await db.collection("push-data").where({_id:push_id}).field({join_count:true}).get()
		uniPush().sendMessage({
				user_id:userList,
				title:"实时参与人数统计",
				content:"获取参与当前投票的人员信息",
				payload:{
					time:Date.now(),
					join_count:join_count,
					type:"joinUser"
				}
		})
	}
}