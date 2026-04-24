<template>
	<Dialog :open="dialogOpen" @update:open="(value) => emit('update:dialogOpen', value)">
		<DialogContent class="sm:max-w-md">
			<form @submit="onSubmit">
				<DialogHeader>
					<DialogTitle class="text-lg font-semibold">物料申请</DialogTitle>
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
				<FormField v-slot="{ componentField }" name="num">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel for="num">数量</FieldLabel>
						</div>
						<FormControl>
							<Input type="number" id="num" placeholder="请输入数量" v-bind="componentField" />
						</FormControl>
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="type">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel>物料类型</FieldLabel>
						</div>
						<FormControl>
							<div class="flex gap-4">
								<label class="flex items-center gap-2">
									<input type="radio" value="0" v-bind="componentField" />
									<span>台签</span>
								</label>
								<label class="flex items-center gap-2">
									<input type="radio" value="1" v-bind="componentField" />
									<span>单页</span>
								</label>
							</div>
						</FormControl>
					</FormItem>
				</FormField>
				<DialogFooter class="mt-4">
					<Button variant="outline" @click="dialogOpen = false">取消</Button>
					<Button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white">物料申请</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

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

const emit = defineEmits(['update:dialogOpen'])

const $api = inject('$api')

const { handleSubmit, values } = useForm({
	defaultValues: { num: 1, type: '0' },
})

const onSubmit = handleSubmit(async (formdata) => {
	if (!props.partner) return
	try {
		const res = await $api.add_material({
			params: { 
				...formdata,
				partner: props.partner.user
			}
		})
		if (res.code === 1) {
			// 申请成功
			ElMessage.success(res.msg)
			emit('update:dialogOpen', false)
		}
	} catch (err) {
		console.error('物料申请失败', err)
	}
})
</script>
