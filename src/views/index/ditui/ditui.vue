<!--  -->
<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
		<div class="max-w-6xl mx-auto">
			<!-- 页面标题和搜索框 -->
			<div class="mb-8">
				<div class="text-center mb-6">
					<h1 class="text-3xl font-bold text-gray-800 mb-2">地推人员管理</h1>
					<p class="text-gray-600">管理和查看所有地推人员信息</p>
				</div>
				<!-- 搜索框 -->
				<div class="max-w-md mx-auto">
					<div class="relative bg-white rounded-md p-2">
						<Input v-model="searchTerm" placeholder="请输入姓名或手机搜索" class="pr-10" />
						<Button variant="default" class="absolute right-1 top-1/2 transform -translate-y-1/2"
							@click="handleSearch">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</Button>
					</div>
				</div>
			</div>

			<div v-if="dataList.length === 0" class="text-center">
				<img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
				<p class="text-gray-500 text-sm">暂无数据</p>
			</div>
			<!-- 地推人员卡片列表 -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
				<!-- 地推人员卡片 -->
				<div v-for="item in dataList" :key="item.id"
					class="bg-white rounded-2xl shadow-sm  overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
					<div class="p-4">
						<!-- 卡片头部 -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-3">
								<span
									class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium cursor-pointer  mr-2"
									>
									ID: {{ item.id }}
								</span>
								<div>
									<h3 class="font-semibold text-gray-900">{{ item.name || '未设置' }}</h3>
									<p class="text-sm text-gray-500">{{ item.login }}</p>
								</div>
							</div>
							<div class="flex-shrink-0">
								<!-- <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
									{{ item.zt === 1 ? '已激活' : '未激活' }}
								</span> -->
							</div>
						</div>

						<!-- 地推人员信息 -->
						<div v-if="item.develop" class="mb-2 flex items-start gap-2 ">
							<Building2 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">发展人：{{ item.develop }}</p>
						</div>
						<div v-if="item.ctime" class="flex items-start gap-2">
							<Clock8 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.ctime }}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- 加载状态 -->
			<div v-if="loading" class="mt-12 text-center">
				<div class="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-sm border border-gray-200">
					<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
					<span class="text-gray-600">加载中...</span>
				</div>
			</div>

			<!-- 无更多数据 -->
			<div v-if="!loading && loadstatus === 'nomore'" class="mt-12 text-center">
				<div class="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-sm border border-gray-200">
					<span class="text-gray-600">已加载全部数据</span>
				</div>
			</div>

			<!-- 错误状态 -->
			<div v-if="error" class="mt-12 text-center">
				<div class="inline-flex items-center px-6 py-3 rounded-full bg-red-50 shadow-sm border border-red-200">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-2" fill="none"
						viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-red-600">{{ error }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Building2, MapPinned, Bookmark, Clock8 } from "lucide-vue-next";
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { baseStore } from '@/stores/main.js' 

const base = baseStore()
const { empty } = toRefs(base)

const $api = inject('$api')

// 搜索参数
const searchTerm = ref('')

const options = computed(() => {
	return {
		params: {
			terms: searchTerm.value
		},
		api: 'ditui',
	}
})

// 使用useDataList
const {
	dataList,
	loading,
	loadstatus,
	initDataList,
	setupScrollListener
} = useDataList(options)

// 错误状态
const error = ref('')

// 搜索
const handleSearch = () => {
	// 重新初始化数据列表
	initDataList()
}

// 初始加载
onMounted(() => {
	initDataList()
	// 设置滚动监听器
	const cleanup = setupScrollListener()
	// 组件卸载时清理监听器
	onUnmounted(cleanup)
})
</script>
<style scoped>
/* 可以添加自定义样式 */
</style>
