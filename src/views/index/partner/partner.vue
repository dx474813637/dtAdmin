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
				<div 
					v-for="item in dataList" 
					:key="item.login"
					class="bg-white rounded-2xl shadow-sm  overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
				>
					<div class="p-6">
						<!-- 卡片头部 -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<span class="text-indigo-600 font-medium">{{ item.name?.charAt(0) || '合' }}</span>
								</div>
								<div>
									<h3 class="font-semibold text-gray-900">{{ item.name || '未设置' }}</h3>
									<p class="text-sm text-gray-500">{{ item.login }}</p>
								</div>
							</div>
							<div class="flex-shrink-0">
								<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
									{{ item.zt === 1 ? '活跃' : '禁用' }}
								</span>
							</div>
						</div>

						<!-- 备注信息 -->
						<div v-if="item.info" class="mb-2">
							<p class="text-sm text-gray-600 leading-relaxed">{{ item.info }}</p>
						</div>

						<!-- 创建时间 -->
						<div class="mb-4 text-xs text-gray-400">
							创建时间: {{ item.ctime }}
						</div>

						<!-- 操作按钮 -->
						<div class="flex gap-3">
							<Button 
								variant="secondary" 
								size="sm" 
								class="flex-1"
								@click="editRemark(item)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
								</svg>
								编辑备注
							</Button>
							<Button 
								variant="default" 
								size="sm" 
								class="flex-1"
								@click="bindPartner(item)"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
								绑定
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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-red-600">{{ error }}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- 备注编辑对话框 -->
	<Dialog v-model:open="remarkDialogOpen">
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle class="text-lg font-semibold">编辑备注</DialogTitle>
			</DialogHeader>
			<Field class="mt-4">
				<FieldLabel>备注内容</FieldLabel>
				<Textarea 
					v-model="remarkContent" 
					placeholder="请输入备注内容" 
					class="min-h-[100px]"
				/>
			</Field>
			<DialogFooter class="mt-4">
				<Button variant="outline" @click="remarkDialogOpen = false">取消</Button>
				<Button class="bg-indigo-600 hover:bg-indigo-700 text-white">保存</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>

	<!-- 绑定对话框 -->
	<Dialog v-model:open="bindDialogOpen">
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle class="text-lg font-semibold">绑定合伙人</DialogTitle>
			</DialogHeader>
			<Field class="mt-4">
				<FieldLabel>开始序号</FieldLabel>
				<Input v-model="bindForm.numa" type="number" placeholder="请输入开始序号" />
			</Field>
			<Field class="mt-4">
				<FieldLabel>结束序号</FieldLabel>
				<Input v-model="bindForm.numb" type="number" placeholder="请输入结束序号" />
			</Field>
			<DialogFooter class="mt-4">
				<Button variant="outline" @click="bindDialogOpen = false">取消</Button>
				<Button class="bg-indigo-600 hover:bg-indigo-700 text-white">绑定</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { add_promotions, edit_partner } from '@/apis/interface/base'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const $api = inject('$api')

// 模拟合伙人数据
const mockPartners = Array.from({ length: 20 }, (_, index) => ({
	ctime: `2026-04-${String(index + 1).padStart(2, '0')} ${String(index + 10).padStart(2, '0')}:00:00`,
	develop: index % 2,
	id: index + 1,
	login: `partner${index + 1}`,
	name: `合伙人${index + 1}`,
	role: 0,
	token: `token${index + 1}`,
	zt: 1,
	info: index % 3 === 0 ? `这是合伙人${index + 1}的备注信息` : ''
}))

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
	getDataCallBack: (res) => {
		if (res.code === 1) {
			// 如果数据为空，使用模拟数据
			if (!res.list || res.list.length === 0) {
				dataList.value = mockPartners
			} else {
				dataList.value = res.list
			}
		}
	}
})

// 错误状态
const error = ref('')

// 备注编辑相关
const remarkDialogOpen = ref(false)
const remarkContent = ref('')
const currentPartner = ref(null)

// 绑定相关
const bindDialogOpen = ref(false)
const bindForm = ref({
	numa: '',
	numb: ''
})

// 编辑备注
const editRemark = (item) => {
	currentPartner.value = item
	remarkContent.value = item.info || ''
	remarkDialogOpen.value = true
}

// 保存备注
const saveRemark = async () => {
	if (!currentPartner.value) return
	try {
		const res = await $api.edit_partner({
			login: currentPartner.value.login,
			info: remarkContent.value
		})
		if (res.code === 1) {
			// 更新本地数据
			const index = dataList.value.findIndex(p => p.login === currentPartner.value.login)
			if (index !== -1) {
				dataList.value[index].info = remarkContent.value
			}
			remarkDialogOpen.value = false
		}
	} catch (err) {
		console.error('保存备注失败', err)
	}
}

// 绑定合伙人
const bindPartner = (item) => {
	currentPartner.value = item
	bindForm.value = {
		numa: '',
		numb: ''
	}
	bindDialogOpen.value = true
}

// 保存绑定
const saveBind = async () => {
	if (!currentPartner.value) return
	try {
		const res = await add_promotions({
			login: currentPartner.value.login,
			numa: bindForm.value.numa,
			numb: bindForm.value.numb
		})
		if (res.code === 1) {
			bindDialogOpen.value = false
			// 可以添加成功提示
		}
	} catch (err) {
		console.error('绑定失败', err)
	}
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
