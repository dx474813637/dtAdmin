<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div class="mb-4">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">推广详情</h1>
                    <p class="text-gray-600">查看地推人员及其合伙人的推广详细信息</p>
                </div>
                <div class="max-w-md mx-auto">
                    <DituiSelector v-model:dialogOpen="dituiDialogOpen" v-model:ditui="selectedDitui" />
                </div>
            </div>

            <div v-if="selectedDitui" class="mb-4">
                <div class="bg-white rounded-xl shadow-sm p-4 pt-1">
                    <div class="flex border-b border-gray-100 mb-4">
                        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                            'flex-1 py-3 text-center font-medium transition-colors',
                            activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
                        ]">
                            {{ tab.label }}
                        </button>
                    </div> 
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-indigo-50 rounded-lg p-4">
                            <p class="text-sm text-gray-500 mb-1">合伙人数</p>
                            <p class="text-2xl font-bold text-indigo-600 ">
                                <template v-if="overviewLoading"><Spinner /></template>
                                <template v-else>
                                    {{ overviewData.hhr_total || 0 }}
                                </template>
                            </p>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4">
                            <p class="text-sm text-gray-500 mb-1">推广用户数</p>
                            <p class="text-2xl font-bold text-green-600 ">
                                <template v-if="overviewLoading"><Spinner /></template>
                                <template v-else>
                                    {{ overviewData.member_total || 0 }}
                                </template>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="selectedDitui">
                <h2 class="text-xl font-semibold text-gray-700 mb-4">合伙人列表</h2>

                <div v-if="partnerLoading" class="py-12 text-center">
                    <div
                        class="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-sm border border-gray-200">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        <span class="text-gray-600">加载中...</span>
                    </div>
                </div>

                <!-- <div v-else-if="partnerList.length === 0" class="text-center py-12">
                    <p class="text-gray-500">暂无合伙人数据</p>
                </div> -->
                <div v-else-if="partnerList.length === 0" class="text-center">
                    <img :src="empty" alt="暂无数据" class="w-full max-w h-32 sm:h-32 object-contain mx-auto mb-4" />
                    <p class="text-gray-500 text-sm">暂无合伙人数据</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <PartnerCard
                        v-for="item in partnerList"
                        :key="item.id"
                        :item="item"
                        :simplified="true"
                        @click="openPartnerDetail"
                        @previewHaibao="previewHaibao"
					    @uploadImage="previewImg"
                    />
                </div>
            </div>

            <div v-if="!selectedDitui" class="text-center py-12">
                <p class="text-gray-500">请先选择地推人员</p>
            </div>
			<!-- 无更多数据 -->
			<div v-else-if="!partnerLoading && loadstatus === 'nomore'" class="mt-12 text-center">
				<div class="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-sm border border-gray-200">
					<span class="text-gray-600">已加载全部数据</span>
				</div>
			</div>
        </div>

        <PartnerUserDialog v-model:open="showPartnerDialog" :partner="selectedPartner" />
    </div>
	<!-- 图片预览对话框 -->
	<ImagePreview :dialogOpen="imagePreviewDialogOpen" :images="previewImages"
		@update:dialogOpen="(value) => imagePreviewDialogOpen = value"> 
	</ImagePreview>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { Button } from '@/components/ui/button'
import { toRefs } from 'vue'
import { baseStore } from '@/stores/main.js'  

const imagePreviewDialogOpen = ref(false)
const previewImages = ref([])

const base = baseStore()
const { empty } = toRefs(base)

const $api = inject('$api')
const dituiDialogOpen = ref(false)

const tabs = [
    { key: 'cft', label: '财富通' },
    { key: 'red', label: '红娘' }
]

const selectedDitui = ref(null)
const activeTab = ref('cft')
const showPartnerDialog = ref(false)
const selectedPartner = ref(null)

const overviewLoading = ref(false)

const overviewData = ref({
    hhr_total: 0,
    member_total: 0
})

const partnerOptions = computed(() => ({
    params: { login: selectedDitui.value?.login || '', p: curP.value },
    api: 'partner2',
    getDataCallBack: (res) => {
        if (res.code === 1) { 
            partnerList.value = [...partnerList.value, ...res.list]
            total.value = res.total || 0
            if (partnerList.value.length >= res.total) {
                loadstatus.value = 'nomore'
            } else {
                loadstatus.value = 'loadmore'
            }
        }
    }
}))

const {
    curP,
    dataList: partnerList,
    loading: partnerLoading,
    total: total,
    loadstatus: loadstatus,
    initDataList: initPartnerList
} = useDataList(partnerOptions)

watch(selectedDitui, (newVal) => {
    if (newVal) {
        fetchOverview()
        initPartnerList()
    }
})

// 预览海报
const previewHaibao = (item) => {
	if (item.haibao) {
		// 如果有haibao属性，打开图片预览
		previewImages.value = [item.haibao]
		imagePreviewDialogOpen.value = true
	}
} 
// 预览海报2
const previewImg = (item) => {
	if (item.img) {
		previewImages.value = item.img.split(',').filter(url => url.trim())
		imagePreviewDialogOpen.value = true
	}
} 
const fetchOverview = async () => {
    if (!selectedDitui.value) return
    const apiName = activeTab.value === 'cft' ? 'overview2' : 'overview'
    overviewLoading.value = true
    try {
        const res = await $api[apiName]({
            params: { cate: 1, login: selectedDitui.value.login }
        })
        if (res.code === 1) {
            if (activeTab.value === 'cft') {
                overviewData.value = {
                    hhr_total: res.list.num_partner || 0,
                    member_total: res.list.num_dy || 0
                }
            } else {
                overviewData.value = {
                    hhr_total: res.list.data?.hhr_total || 0,
                    member_total: res.list.data?.member_total || 0
                }
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        overviewLoading.value = false
    }
}

const openPartnerDetail = (partner) => {
    selectedPartner.value = partner 
    showPartnerDialog.value = true
}

watch(activeTab, () => {
    fetchOverview()
})
</script>
