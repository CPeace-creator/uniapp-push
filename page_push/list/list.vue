
<template>
	<view class="raffleList">
		<z-paging v-model="dataList" ref="paging" @query='queryList' :default-page-size="15">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<uni-list border-full>
				<uni-list-item title="列表文字" clickable  note="列表描述信息" showArrow  rightText="右侧文字" :note="`列表${Date.now()}\n已参与10人`"
				v-for="item in dataList" :key="item" @click="routeTo('/page_push/detail/detail')"></uni-list-item>
			</uni-list>
		</z-paging>
		<view class="huodong">
			<button type="warn" @click="routeTo('/page_push/edit/edit')"><text>活动详情</text></button>
		</view>	
	</view>
</template>
	
<script setup>
	
import { routeTo } from '../../utils/utils';
import {ref} from 'vue'
const paging= ref(null)
const content=ref(null)
const dataList = ref([])
const addList = ref([])
const queryList  = (pageNo,pageSize)=>{
	let data=[]
	for(let i=0;i<pageSize;i++){
		let item ={id:i,title:Math.random()}
		data.push(item)
	}
	paging.value.complete(data);
}
const goDetail=()=>{
	routeTo("/page_push/detail/detail")
	// uni.navigateTo({
	// 	url:'/page_push/detail/detail'
	// })
}
const addRaffie=()=>{
	console.log("点击了");
}
const showRight=ref(null)
const showDrawer=()=>{
	showRight.value.open()
}
</script>

<style scoped lang="scss">
	.raffleList{
		position: relative;
	}
	.huodong{
		position: absolute;
		top: 1000rpx;
		right: 0rpx;
		
	}
</style>
