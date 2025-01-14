<template>
	<view playList>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="15">
			<template #loading><uni-load-more status="loading"></uni-load-more></template>
			<view class="list">
				<view class="row" v-for="(item,index) in 3" :key="index">
					<AwardsItem :code="true"></AwardsItem>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
import {ref} from 'vue'
const paging=ref(null)
const dataList=ref([])
const queryList=(pageNo,pageSize)=>{
	paging.value.complete([])
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
