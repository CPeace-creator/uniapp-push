<template>
	<view class="confirmPage">
		<view class="row" v-for="(item,index) in listData" :key="item._id">
			<AwardsItem :confirm="true" :item="item" @success="onSuccess"></AwardsItem>
		</view>
	</view>
</template>

<script setup>
import {ref} from 'vue'
import {
		onLoad,onUnload
	} from '@dcloudio/uni-app'
import { goBack } from '../../utils/utils'
let id,pushId
const db=uniCloud.database()
onLoad(async (e)=>{
	id=e.id
	pushId=e.pushId
	if(!id){
		let res = await uni.showModal({
			title:"错误参数",
			content:"缺少参数,点击返回首页",
			showCancel:false
		})
		if(res.confirm){
			goBack()
		}
		return
	}
	getAwardUser()
})
const listData=ref([])
const getAwardUser=async ()=>{
	let {result:{data:[{awardsList,operLogs}={}]=[],errCode=400}={}}=await await db.collection("push-data")
	.doc(pushId).field(`awardsList,operLogs`).get()
	let awardTmp=await db.collection("push-award-user").where({_id:id}).getTemp()
	let userTmp=await db.collection("uni-id-users").field(
		`_id,avatar_file,nickname`
	).getTemp()
	let {result:{data,errCode:errCode2}={}} = await db.collection(awardTmp,userTmp)
	.field("_id,push_id,award_id,order_id,status,create_date,arrayElemAt(award_user_id,0) as award_userInfo")
	.get()
	data=data.map(item=>{
		let find =awardsList.find(i=>i.id=item.award_id)
		let orderIndex = operLogs.findIndex(oIndex=>oIndex.id=item.order_id)
		return {
			...item,
			award_des:find.description,
			award_name:find.name,
			award_pic:find.picUrl?find.picUrl+
			"?x-oss-process=iamge/resize,w_120,m_lfit":"https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/prizePic.webp",
			order_number:orderIndex+1
		}
	})
	listData.value=data
}
const onSuccess=()=>{
	getAwardUser()
}
</script>

<style scoped lang="scss">
.confirmPage{
	padding: 30rpx;
}
</style>
