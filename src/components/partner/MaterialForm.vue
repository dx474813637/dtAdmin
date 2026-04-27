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
				<FormField v-slot="{ componentField }" name="type">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel>物料类型</FieldLabel>
							<span class="text-destructive">*</span>
						</div>
						<FormControl>
							<RadioGroup class="flex items-center space-y-1" default-value="0" v-bind="componentField">
								<div class="flex items-center space-x-2">
									<RadioGroupItem id="r1" value="0" />
									<label for="r1" class="font-normal">台签</label> 
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroupItem id="r2" value="1" />
									<label for="r2" class="font-normal">单页</label> 
								</div>
							</RadioGroup> 
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="num">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel for="num">数量</FieldLabel>
							<span class="text-destructive">*</span>
						</div>
						<FormControl>
							<Input type="number" id="num" placeholder="请输入数量" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<DialogFooter class="mt-4">
					<Button type="button" variant="outline" @click="handleOpenChange(false)">取消</Button>
					<Button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white">物料申请</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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

// 监听partner变化，更新表单值
watch(() => props.dialogOpen, (newDialogOpen) => {
	if (newDialogOpen) {
		handleReset()
		setValues({
			num: 0,
			type: '0'
		})
	}
}, { immediate: true })

const formSchema = toTypedSchema(
	z.object({
		num: z.number().min(1, '数量不能为0'),
		type: z.enum(['0', '1'], {
			required_error: '请选择一个物料类型。',
		})
		// captcha: z.string().min(8, { message: '密码至少需要8个字符。' }),
	})
)
const { handleSubmit, values, handleReset, setValues } = useForm({
	defaultValues: { num: 0, type: '0' },
	validationSchema: formSchema,
})

const handleOpenChange = (value) => {
	emit('update:dialogOpen', value)
}

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
			handleOpenChange(false)
		}
	} catch (err) {
		console.error('物料申请失败', err)
	}
})
</script>
