<template>
	<view playList>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="15">
			<template #loading><uni-load-more status="loading"></uni-load-more></template>
			<view class="list">
				<view class="row" v-for="(item,index) in dataList" :key="index">
					<AwardsItem></AwardsItem>
				</view>
			</view>
		</z-paging>
		<uni-fab ref="fab" :pattern="{icon:'scan'}" :content="content" horizontal="right" vertical="bottom" @fabClick="scanCode"></uni-fab>
	</view>
</template>

<script setup>
import {ref} from 'vue'
const paging=ref(null)
const dataList=ref([])
const queryList=(pageNo,pageSize)=>{
	paging.value.complete([])
}

const scanCode = ()=>{
	uni.scanCode({
		success: function (res) {
			console.log('条码类型：' + res.scanType);
			console.log(res);
		},
		fail:function(err){
			console.log(err);
		}
	})
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
