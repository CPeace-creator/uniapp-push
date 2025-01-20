<template>
	<view class="raffleList">
		<z-paging v-model="dataList" ref="paging" @query='queryList' :default-page-size="15">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<uni-list border-full>
				<uni-list-item :title="`${item.nickname}--创建抽奖活动`" clickable note="列表描述信息" showArrow
					:rightText="getActiveState(item.active_state)"
					:note="`创建于${dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}\n已参与${item.join_count}人`"
					v-for="item in dataList" :key="item"
					@click="routeTo(`/page_push/detail/detail?id=${item._id}`)"></uni-list-item>
			</uni-list>
		</z-paging>
		<view class="huodong">
			<button type="warn" @click="routeTo('/page_push/edit/edit')"><text>+</text></button>
		</view>
	</view>
</template>

<script setup>
	import {
		routeTo,
		getActiveState
	} from '../../utils/utils';
	import {
		ref
	} from 'vue'
	import DBUtils from '../../utils/dbUtils';
	import dayjs from 'dayjs';
	import {
		onShow
	} from '@dcloudio/uni-app'
	onShow(()=>{
		queryList()
	})
	const paging = ref(null)
	const content = ref(null)
	const dataList = ref([])
	const addList = ref([])
	const queryList = async (pageNo, pageSize) => {
		const pushData = new DBUtils("push-data");
		let res = await pushData.query({
			secondTable: "uni-id-users",
			secondField: "_id,nickname",
			tempField: "active_state,create_date,join_count,arrayElemAt(user_id.nickname,0) as nickname,_id",
			orderBy: "create_time desc"
		})
		console.log(res.data);
		if (res.errCode == 0) {
			paging.value.complete(res.data);
		} else {
			paging.value.complete([]);
		}
	}
	const goDetail = () => {
		routeTo("/page_push/detail/detail")
		// uni.navigateTo({
		// 	url:'/page_push/detail/detail'
		// })
	}
	const addRaffie = () => {
		console.log("点击了");
	}
	const showRight = ref(null)
	const showDrawer = () => {
		showRight.value.open()
	}
</script>

<style scoped lang="scss">
	.raffleList {
		position: relative;
	}

	.huodong {
		position: absolute;
		top: 1000rpx;
		right: 0rpx;

	}
</style>