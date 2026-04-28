<template>
	<Dialog :open="dialogOpen" @update:open="(value) => emit('update:dialogOpen', value)">
		<DialogTrigger as-child>
			<button
				class="w-full relative bg-white rounded-md p-3 text-left hover:bg-gray-50 transition-colors border border-gray-200">
				<span v-if="selectedDitui" class="text-gray-700">地推人员-{{ selectedDitui.name }} ({{ selectedDitui.login }})</span>
				<span v-else class="text-gray-400">请选择地推人员</span>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-lg">
			<DialogHeader>
				<DialogTitle>选择地推人员</DialogTitle>
			</DialogHeader>
			<div class="space-y-4">
				<div class="relative">
					<Input
						v-model="searchTerm"
						placeholder="请输入姓名或手机搜索"
						class="pr-10"
					/>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<div class=" h-[50vh] overflow-y-auto border rounded-md">
					<div
						v-for="item in dituiList"
						:key="item.id"
						@click="handleSelect(item)"
						class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium text-gray-900">{{ item.name || '未设置' }}</p>
								<p class="text-sm text-gray-500">{{ item.login }}</p>
							</div>
						</div>
					</div>
					<!-- <div v-if="dituiList.length === 0" class="p-8 text-center text-gray-500">暂无数据</div> -->
					<div v-if="dituiList.length === 0" class="text-center">
						<img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
						<p class="text-gray-500 text-sm">暂无数据</p>
					</div>
					<div v-else-if="loadstatus === 'nomore'" class="text-center py-4 text-gray-500 text-sm">已加载全部数据
					</div>
				</div>
			</div>
			<DialogFooter>
				<Button type="button" variant="outline" @click="handleOpenChange(false)">关闭</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import debounce from '@/utils/debounce.js'
import { baseStore } from '@/stores/main.js'

const base = baseStore()
const { empty } = toRefs(base)

const props = defineProps<{
	dialogOpen: {
		type: Boolean,
		required: true
	} ,
	ditui: {
		type: Object,
		default: () => ({})
	}
}>()

const emit = defineEmits(['update:dialogOpen', 'update:ditui'])

const handleOpenChange = (value) => {
	emit('update:dialogOpen', value)
}
const searchTerm = ref('')

const options = computed(() => ({
	params: { terms: searchTerm.value },
	api: 'ditui'
}))

const { dataList: dituiList, initDataList, loadstatus } = useDataList(options)

const debouncedInitDataList = debounce(() => {
	initDataList()
}, 300)

watch(() => searchTerm.value, () => {
	console.log(searchTerm.value)
	debouncedInitDataList()
})
watch(() => props.dialogOpen, (value) => {
	console.log(value)
	if (value) {
		initDataList()
	}
})


const selectedDitui = computed(() => props.ditui)

const handleSelect = (item) => {
	emit('update:ditui', item)
	handleOpenChange(false)
}
</script>
