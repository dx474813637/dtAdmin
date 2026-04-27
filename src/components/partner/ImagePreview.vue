<template>
	<Dialog :open="dialogOpen" @update:open="(value) => emit('update:dialogOpen', value)">
		<DialogContent class="sm:max-w-3xl sm:max-h-screen">
			<DialogHeader>
				<DialogTitle class="text-lg font-semibold">图片预览（点击图片可下载）</DialogTitle>
			</DialogHeader>
			<div class="max-h-[calc(100vh-240px)] overflow-y-auto">
				<div v-if="images && images.length > 0" class="space-y-4">
					<div v-for="(img, index) in images" :key="index" class="relative">
						<img 
							:src="img" 
							alt="预览" 
							class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
							@click.stop="handleDownload(img)"
						/>
					</div>
				</div>
				<div v-else class="text-center text-gray-500 py-8">
					暂无图片
				</div>
			</div>
			<DialogFooter class="mt-4">
				<Button type="button" variant="outline" @click="handleOpenChange(false)">关闭</Button>
				<slot name="footerBtn"></slot>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const props = defineProps({
	dialogOpen: {
		type: Boolean,
		required: true
	},
	images: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['update:dialogOpen'])
const isDownloading = ref(false)

const handleOpenChange = (value) => {
	emit('update:dialogOpen', value)
}

const handleDownload = async (imgUrl) => {
	if (isDownloading.value) return
	isDownloading.value = true
	try {
		await nextTick()
		const confirmed = window.confirm('是否下载当前图片?')
		if (confirmed) {
			const link = document.createElement('a')
			link.href = imgUrl
			link.download = imgUrl.split('/').pop() || 'image'
			link.target = '_blank'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	} catch (error) {
		// 用户取消操作
	} finally {
		isDownloading.value = false
	}
}
</script>
