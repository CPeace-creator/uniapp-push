<template>
	<view playList>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="15">
			<template #loading><uni-load-more status="loading"></uni-load-more></template>
			<view class="list">
				<view class="row">
					<AwardsItem></AwardsItem>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>

</script>

<style scoped lang="scss">

</style>
