<template>
	<Dialog :open="dialogOpen" @update:open="(value) => emit('update:dialogOpen', value)">
		<DialogContent class="sm:max-w-md">
			<form @submit="onSubmit">
				<DialogHeader>
					<DialogTitle class="text-lg font-semibold">编辑备注</DialogTitle>
				</DialogHeader>
				<!-- 合伙人信息 -->
				<div v-if="partner" class="mt-2 p-3 bg-gray-50 rounded-lg">
					<p class="text-sm text-gray-600">
						<span class="font-medium">用户名：</span>{{ partner.name || '未设置' }}
					</p>
					<p class="text-sm text-gray-600 mt-1">
						<span class="font-medium">账号：</span>{{ partner.user }}
					</p>
				</div>
				<FormField v-slot="{ componentField }" name="company">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel for="company">
								<Building2 class="size-4 text-slate-500" />公司
							</FieldLabel>
						</div>
						<FormControl>
							<Input type="text" id="company" placeholder="公司名称" v-bind="componentField" />
						</FormControl>
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="address">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel for="address">
								<MapPinned class="size-4 text-slate-500" />地址
							</FieldLabel>
						</div>
						<FormControl>
							<Textarea placeholder="请输入地址" id="address" v-bind="componentField" class="min-h-[60px]" />
						</FormControl>
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="info">
					<FormItem>
						<div class="flex items-center mt-3">
							<FieldLabel for="info">
								<Bookmark class="size-4 text-slate-500" />备注内容
							</FieldLabel>
						</div>
						<FormControl>
							<Textarea placeholder="请输入备注内容" id="info" v-bind="componentField" class="min-h-[100px]" />
						</FormControl>
					</FormItem>
				</FormField>
				<DialogFooter class="mt-4">
					<Button type="button" variant="outline" @click="handleOpenChange(false)">取消</Button>
					<Button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white">保存</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { Building2, MapPinned, Bookmark } from "lucide-vue-next"
import { ref, inject, watch } from 'vue'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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

const { handleSubmit, values, handleReset, setValues } = useForm({
	defaultValues: { company: "", address: "", info: "" },
})

// 监听partner变化，更新表单值
watch(() => props.dialogOpen, (newDialogOpen) => {  
	if (newDialogOpen) {
		handleReset()
		setValues({
			company: props.partner.company || '',
			address: props.partner.address || '',
			info: props.partner.info || ''
		})
	}
}, { immediate: true })

const handleOpenChange = (value) => {
	emit('update:dialogOpen', value)
}

const onSubmit = handleSubmit(async (formdata) => {
	if (!props.partner) return
	try {
		const res = await $api.edit_partner({
			...formdata,
			id: props.partner.id
		})
		if (res.code === 1) {
			// 更新本地数据
			const updatedPartner = {
				...props.partner,
				info: formdata.info,
				company: formdata.company,
				address: formdata.address
			}
			ElMessage.success(res.msg)
			emit('update:partner', updatedPartner)
			handleOpenChange(false)
		}
	} catch (err) {
		console.error('保存备注失败', err)
	}
})
</script>
