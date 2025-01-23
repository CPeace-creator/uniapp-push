<template>
	<view class="joinUser">
		<z-paging v-model="dataList" ref="paging" @query='queryList' :default-page-size="15">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<uni-list border-full v-if="dataList.length">
				<uni-list-item :title="`${item.userInfo.nickname}`" thumb-size="lg" :note="`参与时间${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`"
				v-for="(item,index) in dataList" :key="item.id"
				thumb="https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/defAvatar.jpg"></uni-list-item>
			</uni-list>
		</z-paging>
	</view>
</template>

<script setup>
import {
routeTo,
getActiveState,showToast
} from '../../utils/utils';
import {
ref
} from 'vue'
import DBUtils from '../../utils/dbUtils';
import dayjs from 'dayjs'
const paging = ref(null)
const content = ref(null)
const dataList = ref([])
const db = uniCloud.database()
const id = ref(null)
import {
		onLoad
	} from '@dcloudio/uni-app'
	onLoad((e) => {
		id.value=e.pushId
	})
const queryList=async (pageNo, pageSize) => {
	let skip =(pageNo-1)*pageSize
	let joinTemp = db.collection("push-join-user").where({push_id:id.value}).orderBy("create_date desc").skip(skip).limit(pageSize).getTemp()
	let userTemp = db.collection("uni-id-users").field("_id,nickname,avatar_file").getTemp()
	let {result:{data,errCode}}=await db.collection(joinTemp,userTemp).field(`create_date,push_id,arrayElemAt(award_user_id,0) as userInfo`) .get();
	console.log(data);
	paging.value.complete(data);
}
</script>

<style scoped lang="scss">

</style>
