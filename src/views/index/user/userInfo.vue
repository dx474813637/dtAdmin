<!--  -->
<template>
	<div class=" p-4">
		<div class="max-w-full mx-auto">
			<!-- 页面标题 -->
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">用户信息</h1>
				<p class="text-gray-600">管理和查看该账户用户信息</p>
			</div>

			<!-- 用户信息卡片 -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
				<!-- 加载状态 -->
				<div v-if="loading" class="p-8 text-center text-gray-500">
					加载中...
				</div>

				<!-- 错误状态 -->
				<div v-else-if="error" class="p-8 text-center text-red-500">
					{{ error }}
				</div>

				<!-- 用户信息内容 -->
				<div v-else-if="userInfo" class="p-6">
					<div class="space-y-4">
						<!-- 姓名 -->
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-gray-500">用户名</span>
							<div class="flex items-center">
								<Dialog  v-model:open="isDialogOpen">
									<DialogTrigger>
										<Badge variant="secondary" class="mr-2 ">
											<SquarePen class="size-4 mr-1" />
											<span class="text-gray-600">编辑</span>
										</Badge>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader class="mb-4">
											<DialogTitle>编辑用户信息</DialogTitle>
											<!-- <DialogDescription>
												This action cannot be undone. This will permanently delete your account
												and remove your data from our servers.
											</DialogDescription> -->
										</DialogHeader>
										<FieldGroup class="mb-4">
											<Field>
												<Label for="name-1">用户名</Label>
												<Input id="name-1" v-model="userInfo.name" />
											</Field>
										</FieldGroup>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant="outline">取 消</Button>
											</DialogClose>
											<Button type="submit" @click="submitForm" :loading="editLoading" :disabled="editLoading">提 交</Button>
										</DialogFooter>
									</DialogContent>

								</Dialog>
								<span class="text-gray-800 font-medium" v-if="userInfo.name">{{ userInfo.name }}</span>
								<span class="text-gray-400 font-medium flex items-center" v-else>未设置</span>
							</div>
						</div>

						<!-- 账号 -->
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-gray-500">账号</span>
							<span class="text-gray-800 font-medium">{{ userInfo.login || '未设置' }}</span>
						</div>

						<!-- 角色 -->
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-gray-500">角色</span>
							<span class="text-gray-800 font-medium">
								{{ roleName }}
							</span>
						</div>
						<!-- 发展人 -->
							<div class="flex justify-between items-center py-3 border-b border-gray-100">
								<span class="text-gray-500">发展人</span>
								<span class="text-gray-800 font-medium">{{ userInfo.develop || '无' }}</span>
							</div>

							<!-- 发展码 -->
							<div class="flex justify-between items-center py-3 border-b border-gray-100">
								<span class="text-gray-500">发展码</span>
								<div class="flex items-center">
									<button 
										v-if="userInfo.ewm" 
										class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
										@click="previewEwm"
									>
										查看二维码
									</button>
									<span v-else class="text-gray-400 font-medium">未设置</span>
								</div>
							</div>

						</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 图片预览对话框 -->
	<ImagePreview
		:dialogOpen="imagePreviewDialogOpen"
		:images="previewImages"
		@update:dialogOpen="(value) => imagePreviewDialogOpen = value"
	/>

</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { SquarePen } from "lucide-vue-next"
import { info } from '@/apis/interface/base'
import { Input } from "@/components/ui/input"
import { ImagePreview } from '@/components/partner'
import {userStore} from '@/stores/user'
const user = userStore()
const {roleName} = toRefs(user)
const $api = inject('$api')
const userInfo = ref({ name: '' })
const loading = ref(true)
const error = ref('')
const isDialogOpen = ref(false)
const editLoading = ref(false)

// 图片预览相关
const imagePreviewDialogOpen = ref(false)
const previewImages = ref([])

onMounted(async () => {
	try {
		const res = await $api.info()
		if (res.code == 1) {
			userInfo.value = res.list
			user.setUserInfo(res.list)
		}
	} catch (err) {
		error.value = '获取用户信息失败'
		console.error(err)
	} finally {
		loading.value = false
	}
})

const submitForm = async () => {
	if(editLoading.value) return
	editLoading.value = true
	try {
		const res = await $api.edit_info({ params: { name: userInfo.value.name } })
		if (res.code == 1) {
			ElMessage.success('更新成功')
			error.value = ''
			isDialogOpen.value = false
		}
	} catch (err) {
		error.value = '更新用户信息失败'
		console.error(err)
	} finally {
		editLoading.value = false
	}
}

// 预览发展码
const previewEwm = () => {
	if (userInfo.value.ewm) {
		previewImages.value = [userInfo.value.ewm]
		imagePreviewDialogOpen.value = true
	}
}
</script>
<style lang="scss" scoped></style>
