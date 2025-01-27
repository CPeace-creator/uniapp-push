<template>
	<view playList>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="15" empty-view-text="暂无获奖记录">
			<template #loading><uni-load-more status="loading"></uni-load-more></template>
			<view class="list">
				<view class="row" v-for="(item,index) in dataList" :key="index">
					<AwardsItem :writeOff="true" :item="item" @success="statusSuccess"></AwardsItem>
				</view>
			</view>
		</z-paging>
		<uni-fab ref="fab" :pattern="{icon:'scan'}" :content="content" horizontal="right" vertical="bottom" @fabClick="scanCode(pushId)"></uni-fab>
	</view>
</template>

<script setup>
import {ref} from 'vue'
import {
		onLoad,onUnload
	} from '@dcloudio/uni-app'
import { showToast,scanCode} from '../../utils/utils'
const paging=ref(null)
const dataList=ref([])
const db=uniCloud.database()
const queryList=async (pageNo,pageSize)=>{
	let skip = (pageNo-1)*pageSize
	let {result:{data:[{awardsList,operLogs,award_user_id}={}]=[],errCode=400}={}}=await await db.collection("push-data").doc(pushId).field(`awardsList,operLogs`).get()
	if(errCode!=0) return paging.value.complete(false)
	if(award_user_id!=uniCloud.getCurrentUserInfo().uid){
		return paging.value.complete(false)
	}
	let awardTmp=await db.collection("push-award-user").where({
		push_id:pushId,
		order_id:orderID
	}).skip(skip).limit(pageSize).getTemp()
	let userTmp=await db.collection("uni-id-users").field(
		`_id,avatar_file,nickname`
	).getTemp()
	let {result:{data,errCode:errCode2}={}} = await db.collection(awardTmp,userTmp).field("_id,push_id,award_id,order_id,status,create_date,arrayElemAt(award_user_id,0) as award_userInfo").get()
	data=data.map(item=>{
		let find =awardsList.find(i=>i.id=item.award_id)
		let orderIndex = operLogs.findIndex(oIndex=>oIndex.id=item.order_id)
		return {
			...item,
			award_des:find.description,
			award_name:find.name,
			award_pic:find.picUrl?find.picUrl+"?x-oss-process=iamge/resize,w_120,m_lfit":"https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/prizePic.webp",
			order_number:orderIndex+1
		}
	})
	paging.value.complete(data)
}
let pushId,orderID
onLoad((e)=>{
	({pushId,orderID}=e)
})


//修改状态成功
const statusSuccess=()=>{
	paging.value.refresh()
}
</script>

<style scoped lang="scss">
.playList{
	.list{
		padding: 30rpx;
		.row{
			margin-bottom: 30rpx;
		}
	}
}
</style>
