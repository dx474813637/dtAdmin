<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
		<div class="max-w-6xl mx-auto">
			<!-- 页面标题 -->
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">合伙人管理</h1>
				<p class="text-gray-600">管理和查看所有合伙人信息</p>
			</div>

			<!-- 合伙人卡片列表 -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<!-- 合伙人卡片 -->
				<div v-for="item in dataList" :key="item.id"
					class="bg-white rounded-2xl shadow-sm  overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
					<div class="p-6">
						<!-- 卡片头部 -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<span class="text-indigo-600 font-medium">{{ item.name?.charAt(0) || '合' }}</span>
								</div>
								<div>
									<h3 class="font-semibold text-gray-900">{{ item.name || '未设置' }}</h3>
									<p class="text-sm text-gray-500">{{ item.user }}</p>
								</div>
							</div>
							<div class="flex-shrink-0">
								<span class="px-2.5 py-1 rounded-full text-xs font-medium " :class="{
									'bg-green-100 text-green-800': item.img,
									'bg-red-100 text-red-800': !item.img
								}">
									{{ item.zt === 1 ? '查看台签' : '上传台签' }}
								</span>
							</div>
						</div>

						<!-- 合伙人信息 -->
						<div v-if="item.company" class="mb-2 flex items-start gap-2 ">
							<Building2 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.company }}</p>
						</div>
						<div v-if="item.address" class="mb-2 flex items-start gap-2 ">
							<MapPinned class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.address }}</p>
						</div>
						<div v-if="item.info" class="mb-2 flex items-start gap-2">
							<Bookmark class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.info }}</p>
						</div>
						<div v-if="item.ctime" class="mb-2 flex items-start gap-2">
							<Clock8 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.ctime }}</p>
						</div>
 

						<!-- 操作按钮 -->
						<div class="flex gap-3 mt-3">
							<Button variant="secondary" size="sm" class="flex-1" @click="editRemark(item)">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
								</svg>
								备注信息
							</Button>
							<Button variant="default" size="sm" class="flex-1" @click="bindPartner(item)">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
								物料申请
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

	<!-- 备注编辑对话框 -->
	<RemarkForm 
		v-model:dialogOpen="remarkDialogOpen"
		v-model:partner="currentPartner"
	/>


	<!-- 物料申请对话框 -->
	<MaterialForm 
		:dialogOpen="bindDialogOpen"
		:partner="currentPartner"
		@update:dialogOpen="(value) => bindDialogOpen = value"
	/>

</template>

<script setup lang="ts">
import { Building2, MapPinned, Bookmark, Clock8 } from "lucide-vue-next";
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { add_promotions, edit_partner } from '@/apis/interface/base'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { PromotionsTable } from '@/components/promotions-table'
import { RemarkForm, MaterialForm } from '@/components/partner'

const $api = inject('$api')

// 使用useDataList
const {
	dataList,
	loading,
	loadstatus,
	initDataList,
	setupScrollListener
} = useDataList({
	api: 'partner',
	params: {},
	// getDataCallBack: (res) => {
	// 	if (res.code === 1) {
	// 		dataList.value = [...dataList.value, ...res.list]
	// 	}
	// }
})

// 错误状态
const error = ref('')

// 备注编辑相关
const remarkDialogOpen = ref(false)
const currentPartner = ref(null)

// 物料申请相关
const bindDialogOpen = ref(false)
const bindForm = ref({
	numa: '',
	numb: ''
})
const promotionsTableRef = ref(null)

// 编辑备注
const editRemark = (item) => {
	currentPartner.value = item
	remarkDialogOpen.value = true
}


// 物料申请 
const bindPartner = (item) => {
	currentPartner.value = item
	bindForm.value = {
		numa: '',
		numb: ''
	}
	bindDialogOpen.value = true
}

// 监听currentPartner变化，更新本地数据
watch(() => currentPartner.value, (newPartner) => {
	if (newPartner) {
		const index = dataList.value.findIndex(p => p.id === newPartner.id)
		if (index !== -1) {
			dataList.value[index] = newPartner
		}
	}
}, { deep: true })

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
