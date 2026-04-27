<template>
	<Dialog :open="dialogOpen" @update:open="(value) => emit('update:dialogOpen', value)">
		<DialogContent class="sm:max-w-md">
			<form @submit="onSubmit">
				<DialogHeader>
					<DialogTitle class="text-lg font-semibold">台签管理</DialogTitle>
				</DialogHeader>
				<!-- 合伙人信息 -->
				<div v-if="partner" class=" p-3 bg-gray-50 rounded-lg">
					<p class="text-sm text-gray-600">
						<span class="font-medium">用户名：</span>{{ partner.name || '未设置' }}
					</p>
					<p class="text-sm text-gray-600 mt-1">
						<span class="font-medium">账号：</span>{{ partner.user }}
					</p>
				</div>
				<FormField v-slot="{ componentField }" name="images">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel>台签图片</FieldLabel>
							<span class="text-destructive">*</span>
						</div>
						<FormControl>
							<!-- 预览图片 -->
							<div v-if="selectedImages.length > 0" class="grid grid-cols-3 gap-2">
								<div v-for="(img, index) in selectedImages" :key="index" class="relative">
									<img :src="img.url" alt="预览" class="w-full h-20 object-cover rounded" />
									<button type="button"
										class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
										@click="removeFile(index)">
										×
									</button>
								</div>
							</div>
							<div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-4">
								<input type="file" multiple accept="image/*" @change="handleFileChange" class="hidden"
									ref="fileInput" />
								<Button type="button" variant="outline" @click="triggerFileInput">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
										viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
									</svg>
									选择图片
								</Button>
								<p class="text-sm text-gray-500 mt-2">支持上传多张图片</p>
							</div>
						</FormControl>
						<FormMessage v-if="errors.images">{{ errors.images }}</FormMessage>
					</FormItem>
				</FormField>
				<DialogFooter class="mt-4">
					<Button type="button" variant="outline" @click="handleOpenChange(false)">取消</Button>
					<Button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white">上传</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
	dialogOpen: {
		type: Boolean,
		required: true
	},
	partner: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(['update:dialogOpen', 'update:partner'])

const $api = inject('$api')
// 创建settings store实例
const settingsStore = useSettingsStore()

// 文件输入引用
const fileInput = ref(null)
// 选中的图片信息，包含本地文件和网络地址
const selectedImages = ref([])
// 表单错误
const errors = ref({})

// 监听dialogOpen变化，处理partner的img属性
watch(() => props.dialogOpen, (newDialogOpen) => {
	if (newDialogOpen && props.partner && props.partner.img) {
		// 分割英文逗号分隔的图片地址
		const imageUrls = props.partner.img.split(',').filter(url => url.trim())
		// 清空现有图片
		selectedImages.value = []
		// 添加图片到预览列表
		imageUrls.forEach(url => {
			selectedImages.value.push({
				url: url.trim()
			})
		})
	} else if (newDialogOpen) {
		// 清空现有图片
		selectedImages.value = []
	}
}, { immediate: true })

const { handleSubmit } = useForm({
	defaultValues: { images: [] },
})

// 触发文件选择
const triggerFileInput = () => {
	fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = async (e) => {
	const files = Array.from(e.target.files)
	for (const file of files) {
		try {
			// 使用settings store的uploadImage方法上传图片
			const url = await settingsStore.uploadImage(file)
			// 保存图片信息
			selectedImages.value.push({
				file: file,
				url: url
			})
			errors.value.images = ''
		} catch (err) {
			console.error('上传失败', err)
			ElMessage.error('上传失败，请重试')
		}
	}
}

// 移除文件
const removeFile = (index) => {
	selectedImages.value.splice(index, 1)
}

// 创建对象URL
const getObjectURL = (file) => {
	if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
		return window.URL.createObjectURL(file)
	}
	return ''
}

const handleOpenChange = (value) => {
	emit('update:dialogOpen', value)
	// 重置文件选择
	selectedImages.value = []
	errors.value = {}
}

const onSubmit = handleSubmit(async (formdata) => {
	if (!props.partner) return
	if (selectedImages.value.length === 0) {
		errors.value.images = '请选择至少一张图片'
		return
	}
	try {
		// 获取已上传的图片网络地址
		const imageUrls = selectedImages.value.map(img => img.url)

		// 调用up_img_partner接口
		const res = await $api.up_img_partner({
			img: imageUrls.join(','),
			id: props.partner.id
		})
		if (res.code === 1) {
				// 上传成功
				ElMessage.success(res.msg)
				// 获取更新后的图片地址
				const imageUrls = selectedImages.value.map(img => img.url)
				// 传递更新后的partner信息给父组件
				emit('update:partner', {
					...props.partner,
					img: imageUrls.join(',')
				})
				handleOpenChange(false)
			}
	} catch (err) {
		console.error('上传失败', err)
		ElMessage.error('上传失败，请重试')
	}
})
</script>
