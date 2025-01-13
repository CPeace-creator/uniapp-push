<template>
	<view class="play">
		<view class="options">
			<view class="row">
				<view class="left">
					奖项选择
				</view>
				<view class="right">
					<uni-data-select v-model="formData.aid" :localdata="range" @change="selectChange"></uni-data-select>
				</view>
			</view>
			<view class="row">
				<view class="left">
					抽取个数
				</view>
				<view class="right">
					<uv-number-box v-model="formData.number" :min="0")></uv-number-box>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script setup>
import { ref } from 'vue';
const formData=ref({
	aid:"",
	number:0
})
const range=ref([
	{value:0,text:'一等奖'},
	{value:1,text:'一等奖'},
	{value:2,text:'一等奖'},
])
//下拉框选择事件
const selectChange=(e)=>{
	formData.value.number=0
}
</script>

<style scoped lang="scss">
.play{
	.options{
		.row{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			border-bottom: 1px solid #eee;
			padding: 30rpx;
			.right{
				flex:1;
			}
		}
	}
}
</style>
