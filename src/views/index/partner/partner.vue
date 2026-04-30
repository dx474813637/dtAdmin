<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
		<div class="max-w-6xl mx-auto">
			<!-- 页面标题 -->
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">合伙人管理</h1>
				<p class="text-gray-600">管理和查看所有合伙人信息</p>
			</div>
			
			<div v-if="dataList.length === 0" class="text-center">
				<img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
				<p class="text-gray-500 text-sm">暂无数据</p>
			</div>
			<!-- 合伙人卡片列表 -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<PartnerCard
					v-for="item in dataList"
					:key="item.id"
					:item="item"
					@upload-image="uploadImage"
					@preview-haibao="previewHaibao"
					@edit-remark="editRemark"
					@bind-partner="bindPartner"
				/>
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
	<RemarkForm v-model:dialogOpen="remarkDialogOpen" v-model:partner="currentPartner" />


	<!-- 物料申请对话框 -->
	<MaterialForm :dialogOpen="bindDialogOpen" :partner="currentPartner"
		@update:dialogOpen="(value) => bindDialogOpen = value" />

	<!-- 上传台签对话框 -->
	<UploadImageForm :dialogOpen="uploadDialogOpen" :partner="currentPartner"
		@update:dialogOpen="(value) => uploadDialogOpen = value" @update:partner="updatePartner" />

	<!-- 图片预览对话框 -->
	<ImagePreview :dialogOpen="imagePreviewDialogOpen" :images="previewImages"
		@update:dialogOpen="(value) => imagePreviewDialogOpen = value">
		<template #footerBtn>
			<Button type="button" variant="default" @click="handleAdminImage">管理图片</Button>
		</template>
	</ImagePreview>
</template>

<script setup lang="ts">
import { Building2, MapPinned, Bookmark, Clock8 } from "lucide-vue-next";
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { useDataList } from '@/composition/useDataList.ts' 
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { PromotionsTable } from '@/components/promotions-table'
import { RemarkForm, MaterialForm, UploadImageForm, ImagePreview } from '@/components/partner' 
import { baseStore } from '@/stores/main.js'

const base = baseStore()
const { empty } = toRefs(base)

const $api = inject('$api')

const options = computed(() => {
	return {
		params: {},
		api: 'partner',
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

// 上传台签相关
const uploadDialogOpen = ref(false)

// 图片预览相关
const imagePreviewDialogOpen = ref(false)
const previewImages = ref([])

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

// 上传台签
const uploadImage = (item) => {
	currentPartner.value = item
	if (item.img) {
		// 如果有img属性，打开图片预览
		previewImages.value = item.img.split(',').filter(url => url.trim())
		imagePreviewDialogOpen.value = true
	} else {
		// 如果没有img属性，打开上传组件
		uploadDialogOpen.value = true
	}
}
// 管理图片
const handleAdminImage = () => {
	imagePreviewDialogOpen.value = false
	uploadDialogOpen.value = true
}

// 预览海报
const previewHaibao = (item) => {
	if (item.haibao) {
		// 如果有haibao属性，打开图片预览
		previewImages.value = [item.haibao]
		imagePreviewDialogOpen.value = true
	}
}
// 更新合伙人信息
const updatePartner = (updatedPartner) => {
	// 更新currentPartner
	currentPartner.value = updatedPartner
	// 更新数据列表中的对应项
	const index = dataList.value.findIndex(p => p.id === updatedPartner.id)
	if (index !== -1) {
		dataList.value[index] = updatedPartner
	}
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
