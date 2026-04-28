<!--  -->
<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
		<div class="max-w-6xl mx-auto">
			<!-- 页面标题 -->
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">物料申请列表</h1>
				<p class="text-gray-600">管理和审核所有物料申请信息</p>
			</div>
			
			<div v-if="dataList.length === 0" class="text-center">
				<img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
				<p class="text-gray-500 text-sm">暂无数据</p>
			</div>
			<!-- 物料卡片列表 -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 
				<!-- 物料卡片 -->
				<div v-for="item in dataList" :key="item.id"
					class="bg-white rounded-2xl shadow-sm  overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
					<div class="p-3">
						<!-- 卡片头部 -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center ">
								<div class="flex items-center">
									<span
										class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium cursor-pointer  mr-2">
										ID: {{ item.id }}
									</span>
									<!-- <h3 class="font-semibold text-gray-900 mr-2">{{ item.type == '1' ? '单页' : '台签' }}
									</h3>
									<p class="text-sm text-gray-500">数量：{{ item.num || 0 }}</p> -->
								</div>
							</div>
							<div class="flex-shrink-0">
								<span class="px-2.5 py-1 rounded-full text-sm font-medium cursor-pointer " :class="{
									'bg-green-100 text-green-800': item.zt == '1',
									'bg-red-100 text-red-800': item.zt == '2',
									'bg-yellow-100 text-yellow-800': item.zt == '0',
								}">
									<template v-if="item.zt == '1'">审核通过</template>
									<template v-else-if="item.zt == '2'">审核拒绝</template>
									<template v-else>待审核</template>
								</span>
							</div>
						</div>

						<!-- 物料信息 -->
						<div v-if="item.partner" class="mb-2 flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4 text-indigo-400 mt-0.5"
								fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<p class="text-sm text-primary leading-relaxed">
								物料：{{ item.type == '1' ? '单页' : '台签' }} +{{ item.num || 0 }}
							</p>
						</div>
						<div v-if="item.partner" class="mb-2 flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4 text-indigo-400 mt-0.5"
								fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<p class="text-sm text-gray-600 leading-relaxed">合伙人：{{ item.partner }}
								<template v-if="item.name"> - {{ item.name }}</template>
							</p>
						</div>
						<div v-if="item.develop" class="mb-2 flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4 text-indigo-400 mt-0.5"
								fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<p class="text-sm text-gray-600 leading-relaxed">发展人：{{ item.develop }}</p>
						</div>
						<div v-if="item.ctime" class="flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 size-4 text-indigo-400 mt-0.5"
								fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.ctime }}</p>
						</div>

						<!-- 审核按钮 -->
						<div v-if="item.zt == '0'" class="flex gap-2 mt-4">
							<Button variant="default" size="sm" class="flex-1 " @click="openAuditDialog(item)">
								审核管理
							</Button>
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

	<!-- 审核弹窗 -->
	<Dialog :open="auditDialogOpen" @update:open="(value) => auditDialogOpen = value">
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle class="text-lg font-semibold">审核确认</DialogTitle>
			</DialogHeader>
			<div class="py-4">
				<p class="text-gray-600">是否审核通过该物料申请？</p>
				<div class="mt-2 p-3 bg-gray-50 rounded-lg">
					<p class="text-sm text-gray-500 mb-1">物料类型：{{ currentItem?.type == '1' ? '单页' : '台签' }}</p>
					<p class="text-sm text-gray-500 mb-1">数量：{{ currentItem?.num || 0 }}</p>
					<p class="text-sm text-gray-500 mb-1">合伙人：{{ currentItem?.partner }}</p>
					<p class="text-sm text-gray-500 mb-1">发展人：{{ currentItem?.develop }}</p>
					<p class="text-sm text-gray-500 mb-1">创建时间：{{ currentItem?.ctime }}</p>
				</div>
			</div>
			<DialogFooter class="gap-2">
				<Button variant="outline" @click="auditDialogOpen = false">关闭</Button>
				<Button variant="destructive" @click="handleReject" :loading="auditLoading">拒绝</Button>
				<Button variant="default" class="bg-green-600 hover:bg-green-700" @click="handleApprove"
					:loading="auditLoading">通过</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { baseStore } from '@/stores/main.js'

const base = baseStore()
const { empty } = toRefs(base)

const $api = inject('$api')

// 审核弹窗相关
const auditDialogOpen = ref(false)
const currentItem = ref(null)
const auditLoading = ref(false)

const options = computed(() => {
	return {
		params: {},
		api: 'material2',
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

// 打开审核弹窗
const openAuditDialog = (item) => {
	currentItem.value = item
	auditDialogOpen.value = true
}

// 审核通用方法
const handleAudit = async (zt) => {
	if (!currentItem.value) return
	auditLoading.value = true
	try {
		const res = await $api.material_shenhe({
			params: {
				id: currentItem.value.id,
				zt: zt
			}
		})
		if (res.code === 1) {
			ElMessage.success(zt === 1 ? '审核通过成功' : '审核拒绝成功')
			currentItem.value.zt = zt.toString()
			auditDialogOpen.value = false
		}
	} catch (err) {
		console.error('审核失败', err)
		ElMessage.error('审核失败，请重试')
	} finally {
		auditLoading.value = false
	}
}

// 审核通过
const handleApprove = async () => {
	handleAudit(1)
}

// 审核拒绝
const handleReject = async () => {
	handleAudit(2)
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
