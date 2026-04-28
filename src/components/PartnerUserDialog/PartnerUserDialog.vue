<template>
	<Dialog :open="open" @update:open="(value) => emit('update:open', value)">
		<DialogContent class="sm:max-w-2xl">
			<DialogHeader>
				<DialogTitle>{{ partner?.name || '未设置' }} 的推广用户</DialogTitle>
			</DialogHeader>
			<div class="space-y-4">
				<div class="bg-indigo-50 rounded-lg p-4 flex items-center">
					<p class="text-sm text-indigo-500">合伙人账号</p>
					<p class="font-medium text-gray-900 ml-2">{{ partner?.user }}</p>
				</div>
				<div class="flex border-b border-gray-100">
					<button v-for="tab in tabs" :key="tab.key" @click="handleTabChange(tab.key)" :class="[
						'flex-1 py-2 text-center font-medium transition-colors text-sm',
						activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
					]">
						{{ tab.label }}
					</button>
				</div>
				<div ref="scrollAreaRef" class=" h-[50vh] overflow-y-auto border rounded-md bg-gray-50">
					<div class="p-4">
						<div v-if="loading" class="flex items-center justify-center py-8">
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
						</div>
						<div v-for="item in userList" :key="item.id"
							class="bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 mb-3">
							<div class="flex items-center justify-between mb-3">
								<span
									class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium">
									ID: {{ item.id }}
								</span>
								<span :class="[
									'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium',
									item.user_pay_total === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
								]">
									{{ item.user_pay_total === 1 ? '付费会员' : '普通用户' }}
								</span>
							</div>

							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<div class="flex items-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400"
										viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
									</svg>
									<span class="text-sm text-gray-700">{{ item.mobile || '未填写' }}</span>
								</div>

								<div class="flex items-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400"
										viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
									</svg>
									<span class="text-sm text-gray-500">{{ item.register_time || '未知' }}</span>
								</div>
							</div>
						</div>
						<!-- <div v-for="item in userList" :key="item.id"
							class="p-3 border-b border-gray-100 last:border-b-0">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-gray-900">ID: {{ item.id }}</p>
									<p class="text-sm text-gray-500">{{ item.mobile }}</p>
								</div>
								<span :class="[
									'px-2 py-1 rounded-full text-xs font-medium',
									item.user_pay_total === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
								]">
									{{ item.user_pay_total === 1 ? '付费会员' : '普通用户' }}
								</span>
							</div>
							<p class="text-sm text-gray-400 mt-1">{{ item.register_time }}</p>
						</div> -->
						<div v-if="loadstatus === 'loading'" class="flex items-center justify-center py-4">
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
						</div> 
						<div v-else-if="userList.length === 0" class="text-center">
							<img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
							<p class="text-gray-500 text-sm">暂无数据</p>
						</div>
						<div v-else-if="loadstatus === 'nomore'" class="text-center py-4 text-gray-500 text-sm">已加载全部数据
						</div>
					</div>
				</div>
				<div class="flex items-center justify-end gap-4" v-if="userList.length > 0">
					<div class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
						<span class="w-2 h-2 bg-green-500 rounded-full"></span>
						<span class="text-sm font-medium text-green-700">{{ user_pay || 0 }}人已支付</span>
					</div>
					<div class="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
						<span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
						<span class="text-sm font-medium text-indigo-600">{{ total || 0 }}人总推广</span>
					</div>
				</div>
			</div>
			<DialogFooter>
				<Button variant="outline" @click="handleClose">关闭</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onUnmounted } from 'vue'
import { inject } from 'vue'
import { useDataList } from '@/composition/useDataList'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { baseStore } from '@/stores/main.js'

const base = baseStore()
const { empty } = toRefs(base)

const props = defineProps<{
	open: boolean
	partner: any
}>()

const emit = defineEmits(['update:open'])

const $api = inject('$api')

const scrollAreaRef = ref<HTMLElement | null>(null)
let cleanupScrollListener: (() => void) | null = null
const user_pay = ref(0)

const tabs = [
	{ key: 'cft', label: '财富通' },
	{ key: 'red', label: '红娘' }
]

const activeTab = ref('cft')

const apiOptions = computed(() => ({
	params: { cate: 1, login: props.partner?.user || '' },
	api: activeTab.value === 'cft' ? 'statistical2' : 'statistical',
	getDataCallBack: (res) => {
		if (res.code === 1) {
			if (activeTab.value === 'cft') {
				userList.value = [...userList.value, ...(res.list?.list_ptp || [])]
				total.value = res.list?.num_ptp || 0
				user_pay.value = res.list.num_pay || 0
			} else {
				userList.value = [...userList.value, ...(res.list?.data?.list || [])]
				total.value = res.list?.data?.user_total || 0
				user_pay.value = res.list.data.user_pay_total || 0
			}
			if (userList.value.length >= total.value) {
				loadstatus.value = 'nomore'
			} else {
				loadstatus.value = 'loadmore'
			}
		}
	}
}))

const {
	dataList: userList,
	loading,
	loadstatus,
	total,
	initDataList,
	getMoreDataList,
} = useDataList(apiOptions)

const handleClose = () => {
	emit('update:open', false)
}

const handleTabChange = (tabKey: string) => {
	activeTab.value = tabKey
	initDataList()
}

const setupScrollListener = () => {
	if (!scrollAreaRef.value) return

	const scrollAreaElement = scrollAreaRef.value as HTMLElement
	scrollAreaElement.addEventListener('scroll', handleScroll)

	return () => {
		scrollAreaElement.removeEventListener('scroll', handleScroll)
	}
}

const handleScroll = () => {
	if (!scrollAreaRef.value) return
	const target = scrollAreaRef.value as HTMLElement
	const { scrollTop, scrollHeight, clientHeight } = target

	if (scrollTop + clientHeight >= scrollHeight - 20 && loadstatus.value === 'loadmore') {
		getMoreDataList()
	}
}

watch(() => props.open, (newVal) => {
	if (newVal && props.partner) {
		activeTab.value = 'cft'
		initDataList()
		nextTick(() => {
			if (cleanupScrollListener) {
				cleanupScrollListener()
			}
			cleanupScrollListener = setupScrollListener()
		})
	} else if (!newVal && cleanupScrollListener) {
		cleanupScrollListener()
		cleanupScrollListener = null
	}
})

onUnmounted(() => {
	if (cleanupScrollListener) {
		cleanupScrollListener()
	}
})
</script>
