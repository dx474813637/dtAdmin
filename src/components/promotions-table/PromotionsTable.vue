<template>
	<div class="w-full">
		<!-- 表格标题和刷新按钮 -->
		<div class="flex items-center justify-between mb-2">
			<h3 class="text-sm font-medium text-gray-700">单页列表</h3>
			<div class="flex items-center">
				<Button size="sm" variant="destructive" @click="removeBtn" :loading="loading">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					重置选择
				</Button>
				<Button class="ml-2" size="sm" variant="outline" @click="fetchPromotions" :loading="loading">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					刷新
				</Button>

			</div>
		</div>
		<ScrollArea ref="scrollAreaRef" class=" h-[calc(50vh)] w-full rounded-md border">
			<div class="p-4"> 
				<div class="flex justify-between p-3 " :class="{ 'bg-gray-50': item.login || item.disabled }"
					v-for="item in dataCheckList" :key="item.id">
					<div class="w-1/5">
						<template v-if="!item.login">
							<Checkbox :id="item.id" v-model="item.checked" :disabled="item.disabled"
								@click="() => handleCheckboxClick(item)" />
						</template>
					</div>
					<Label :for="item.id" class="text-sm w-full">
						{{ item.id }}
					</Label>
					<div class="text-sm w-full">
						{{ item.login || '未绑定' }}
					</div>
				</div>
			</div>
		</ScrollArea>
		<!-- 统计信息和分页 -->
		<div class=" mt-4">
			<div class="text-xs text-gray-500">
				共 {{ total }} 条，已绑定 {{ total3 }} 条
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch, nextTick, computed } from 'vue'
import { Table, TableBody, TableCell, TableEmpty, TableHeader, TableHead, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useDataList } from '@/composition/useDataList'
import { useScroll } from '@vueuse/core'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
	login: {
		type: String,
		required: true
	}
})

const emit = defineEmits(['update:numa', 'update:numb'])

const $api = inject('$api')

// 滚动区域引用
const scrollAreaRef = ref<HTMLElement | null>(null)

// 统计信息 
const total2 = ref(0) // 已分发
const total3 = ref(0) // 已使用

// 开始和结束序号
const numa = ref<number | null>(null)
const numb = ref<number | null>(null)

// 使用useDataList
const {
	dataList,
	loading,
	curP,
	total,
	loadstatus,
	initDataList,
	getMoreDataList
} = useDataList({
	api: 'promotions',
	params: { login: props.login },
	getDataCallBack: (res) => {
		if (res.code === 1) {
			dataList.value = [...dataList.value, ...res.list]
			if (dataList.value.length >= res.total) {
				loadstatus.value = 'nomore'
			} else {
				loadstatus.value = 'loadmore'
			}
			total.value = res.total || 0
			total2.value = res.total2 || 0
			total3.value = res.total3 || 0
		}
	}
})

// 处理数据列表，添加checked和disabled状态
const dataCheckList = computed(() => {
	let data = dataList.value.map(item => {
		// 确保id是数字类型
		const itemId = Number(item.id)

		// 计算是否禁用
		let disabled = false
		// 第一次numa参数有id值时候，小于等于当前id的列表复选框disabled都为true
		if (numa.value !== null && itemId <= numa.value) {
			disabled = true
		}
		// 第二次numb有值的时候，整个列表的checkbox的disabled值为true
		if (numb.value !== null) {
			disabled = true
		}

		// 计算是否选中
		let checked = false
		// 第一次numa参数有id值时候，当前id的复选框checked为true
		if (numa.value !== null && itemId === numa.value) {
			checked = true
		}
		// 第二次numb有值的时候，列表里id值大于等于numa，小于等于numb的复选框checked为true
		if (numa.value !== null && numb.value !== null && itemId >= numa.value && itemId <= numb.value) {
			checked = true
		}
		return {
			...item,
			checked,
			disabled,
			idd: `check_${item.id}`
		}
	})
	console.log(data)
	return data
})

// 处理checkbox点击事件
const handleCheckboxChange = (item: any, checked: boolean) => {
	// 如果item被禁用，不处理点击事件
	if (item.disabled) return

	if (checked) {
		// 确保id是数字类型
		const itemId = Number(item.id)
		// 第一次点击，设置numa参数
		if (numa.value === null) {
			numa.value = itemId
			emit('update:numa', itemId)
		}
		// 第二次点击，设置numb参数
		else if (numb.value === null && itemId > numa.value!) {
			numb.value = itemId
			emit('update:numb', itemId)
		}
		// 已经设置了numa和numb，不处理
	}
}

// 处理checkbox点击事件
const handleCheckboxClick = (item: any) => {
	// 如果item被禁用，不处理点击事件  
	if (item.disabled) return
	// 切换checked状态
	const checked = !item.checked
	// 调用handleCheckboxChange处理逻辑
	handleCheckboxChange(item, checked)
}

// 监听login变化，重新加载数据
watch(() => props.login, () => {
	initDataList()
	numa.value = null
	numb.value = null
	emit('update:numa', null)
	emit('update:numb', null)
}, { immediate: true })

// 监听滚动事件
onMounted(() => {
	nextTick(() => {
		if (scrollAreaRef.value) {
			// 获取底层DOM元素
			const scrollAreaElement = scrollAreaRef.value.$el || scrollAreaRef.value
			if (scrollAreaElement) {
				const viewport = scrollAreaElement.querySelector('[data-slot="scroll-area-viewport"]')
				if (viewport) {
					viewport.addEventListener('scroll', (e) => {
						const target = e.target as HTMLElement
						const { scrollTop, scrollHeight, clientHeight } = target

						// 当滚动到距离底部20px时触发加载更多数据
						if (scrollTop + clientHeight >= scrollHeight - 20 && loadstatus.value === 'loadmore') {
							getMoreDataList()
							console.log('加载更多数据...')
						}
					})
				}
			}
		}
	})
})

// 刷新数据
const fetchPromotions = () => {
	initDataList()
	numa.value = null
	numb.value = null
	emit('update:numa', null)
	emit('update:numb', null)
}
const removeBtn = () => {
	// 重置numa和numb参数
	numa.value = null
	numb.value = null
	emit('update:numa', null)
	emit('update:numb', null)
}

// 暴露方法和数据供父组件调用
defineExpose({
	fetchPromotions,
	numa,
	numb
})
</script>
